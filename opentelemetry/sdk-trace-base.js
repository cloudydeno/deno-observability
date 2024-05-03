/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="./sdk-trace-base.d.ts" />

import * as api from './api.js';
import { SpanStatusCode, diag, trace, isSpanContextValid, TraceFlags, isValidTraceId, context, propagation } from './api.js';
import { otperformance, getTimeOrigin, isAttributeValue, isTimeInput, sanitizeAttributes, hrTimeDuration, hrTime, millisToHrTime, isTimeInputHrTime, addHrTimes, globalErrorHandler, getEnv, TracesSamplerValues, getEnvWithoutDefaults, DEFAULT_ATTRIBUTE_COUNT_LIMIT, DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, BindOnceFuture, suppressTracing, unrefTimer, ExportResultCode, isTracingSuppressed, merge, CompositePropagator, W3CTraceContextPropagator, W3CBaggagePropagator, hrTimeToMicroseconds, internal } from './core.js';
import { SemanticAttributes } from './semantic-conventions.js';
import { Resource } from './resources.js';

const ExceptionEventName = 'exception';

class Span {
	constructor(parentTracer, context, spanName, spanContext, kind, parentSpanId, links = [], startTime, _deprecatedClock
	) {
		this.attributes = {};
		this.links = [];
		this.events = [];
		this._droppedAttributesCount = 0;
		this._droppedEventsCount = 0;
		this._droppedLinksCount = 0;
		this.status = {
			code: SpanStatusCode.UNSET,
		};
		this.endTime = [0, 0];
		this._ended = false;
		this._duration = [-1, -1];
		this.name = spanName;
		this._spanContext = spanContext;
		this.parentSpanId = parentSpanId;
		this.kind = kind;
		this.links = links;
		const now = Date.now();
		this._performanceStartTime = otperformance.now();
		this._performanceOffset =
			now - (this._performanceStartTime + getTimeOrigin());
		this._startTimeProvided = startTime != null;
		this.startTime = this._getTime(startTime ?? now);
		this.resource = parentTracer.resource;
		this.instrumentationLibrary = parentTracer.instrumentationLibrary;
		this._spanLimits = parentTracer.getSpanLimits();
		this._spanProcessor = parentTracer.getActiveSpanProcessor();
		this._spanProcessor.onStart(this, context);
		this._attributeValueLengthLimit =
			this._spanLimits.attributeValueLengthLimit || 0;
	}
	spanContext() {
		return this._spanContext;
	}
	setAttribute(key, value) {
		if (value == null || this._isSpanEnded())
			return this;
		if (key.length === 0) {
			diag.warn(`Invalid attribute key: ${key}`);
			return this;
		}
		if (!isAttributeValue(value)) {
			diag.warn(`Invalid attribute value set for key: ${key}`);
			return this;
		}
		if (Object.keys(this.attributes).length >=
			this._spanLimits.attributeCountLimit &&
			!Object.prototype.hasOwnProperty.call(this.attributes, key)) {
			this._droppedAttributesCount++;
			return this;
		}
		this.attributes[key] = this._truncateToSize(value);
		return this;
	}
	setAttributes(attributes) {
		for (const [k, v] of Object.entries(attributes)) {
			this.setAttribute(k, v);
		}
		return this;
	}
	addEvent(name, attributesOrStartTime, timeStamp) {
		if (this._isSpanEnded())
			return this;
		if (this._spanLimits.eventCountLimit === 0) {
			diag.warn('No events allowed.');
			this._droppedEventsCount++;
			return this;
		}
		if (this.events.length >= this._spanLimits.eventCountLimit) {
			diag.warn('Dropping extra events.');
			this.events.shift();
			this._droppedEventsCount++;
		}
		if (isTimeInput(attributesOrStartTime)) {
			if (!isTimeInput(timeStamp)) {
				timeStamp = attributesOrStartTime;
			}
			attributesOrStartTime = undefined;
		}
		const attributes = sanitizeAttributes(attributesOrStartTime);
		this.events.push({
			name,
			attributes,
			time: this._getTime(timeStamp),
			droppedAttributesCount: 0,
		});
		return this;
	}
	setStatus(status) {
		if (this._isSpanEnded())
			return this;
		this.status = status;
		return this;
	}
	updateName(name) {
		if (this._isSpanEnded())
			return this;
		this.name = name;
		return this;
	}
	end(endTime) {
		if (this._isSpanEnded()) {
			diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
			return;
		}
		this._ended = true;
		this.endTime = this._getTime(endTime);
		this._duration = hrTimeDuration(this.startTime, this.endTime);
		if (this._duration[0] < 0) {
			diag.warn('Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.', this.startTime, this.endTime);
			this.endTime = this.startTime.slice();
			this._duration = [0, 0];
		}
		this._spanProcessor.onEnd(this);
	}
	_getTime(inp) {
		if (typeof inp === 'number' && inp < otperformance.now()) {
			return hrTime(inp + this._performanceOffset);
		}
		if (typeof inp === 'number') {
			return millisToHrTime(inp);
		}
		if (inp instanceof Date) {
			return millisToHrTime(inp.getTime());
		}
		if (isTimeInputHrTime(inp)) {
			return inp;
		}
		if (this._startTimeProvided) {
			return millisToHrTime(Date.now());
		}
		const msDuration = otperformance.now() - this._performanceStartTime;
		return addHrTimes(this.startTime, millisToHrTime(msDuration));
	}
	isRecording() {
		return this._ended === false;
	}
	recordException(exception, time) {
		const attributes = {};
		if (typeof exception === 'string') {
			attributes[SemanticAttributes.EXCEPTION_MESSAGE] = exception;
		}
		else if (exception) {
			if (exception.code) {
				attributes[SemanticAttributes.EXCEPTION_TYPE] =
					exception.code.toString();
			}
			else if (exception.name) {
				attributes[SemanticAttributes.EXCEPTION_TYPE] = exception.name;
			}
			if (exception.message) {
				attributes[SemanticAttributes.EXCEPTION_MESSAGE] = exception.message;
			}
			if (exception.stack) {
				attributes[SemanticAttributes.EXCEPTION_STACKTRACE] = exception.stack;
			}
		}
		if (attributes[SemanticAttributes.EXCEPTION_TYPE] ||
			attributes[SemanticAttributes.EXCEPTION_MESSAGE]) {
			this.addEvent(ExceptionEventName, attributes, time);
		}
		else {
			diag.warn(`Failed to record an exception ${exception}`);
		}
	}
	get duration() {
		return this._duration;
	}
	get ended() {
		return this._ended;
	}
	get droppedAttributesCount() {
		return this._droppedAttributesCount;
	}
	get droppedEventsCount() {
		return this._droppedEventsCount;
	}
	get droppedLinksCount() {
		return this._droppedLinksCount;
	}
	_isSpanEnded() {
		if (this._ended) {
			diag.warn(`Can not execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
		}
		return this._ended;
	}
	_truncateToLimitUtil(value, limit) {
		if (value.length <= limit) {
			return value;
		}
		return value.substr(0, limit);
	}
	_truncateToSize(value) {
		const limit = this._attributeValueLengthLimit;
		if (limit <= 0) {
			diag.warn(`Attribute value limit must be positive, got ${limit}`);
			return value;
		}
		if (typeof value === 'string') {
			return this._truncateToLimitUtil(value, limit);
		}
		if (Array.isArray(value)) {
			return value.map(val => typeof val === 'string' ? this._truncateToLimitUtil(val, limit) : val);
		}
		return value;
	}
}

var SamplingDecision;
(function (SamplingDecision) {
	SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
	SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
	SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
})(SamplingDecision || (SamplingDecision = {}));

class AlwaysOffSampler {
	shouldSample() {
		return {
			decision: SamplingDecision.NOT_RECORD,
		};
	}
	toString() {
		return 'AlwaysOffSampler';
	}
}

class AlwaysOnSampler {
	shouldSample() {
		return {
			decision: SamplingDecision.RECORD_AND_SAMPLED,
		};
	}
	toString() {
		return 'AlwaysOnSampler';
	}
}

class ParentBasedSampler {
	constructor(config) {
		this._root = config.root;
		if (!this._root) {
			globalErrorHandler(new Error('ParentBasedSampler must have a root sampler configured'));
			this._root = new AlwaysOnSampler();
		}
		this._remoteParentSampled =
			config.remoteParentSampled ?? new AlwaysOnSampler();
		this._remoteParentNotSampled =
			config.remoteParentNotSampled ?? new AlwaysOffSampler();
		this._localParentSampled =
			config.localParentSampled ?? new AlwaysOnSampler();
		this._localParentNotSampled =
			config.localParentNotSampled ?? new AlwaysOffSampler();
	}
	shouldSample(context, traceId, spanName, spanKind, attributes, links) {
		const parentContext = trace.getSpanContext(context);
		if (!parentContext || !isSpanContextValid(parentContext)) {
			return this._root.shouldSample(context, traceId, spanName, spanKind, attributes, links);
		}
		if (parentContext.isRemote) {
			if (parentContext.traceFlags & TraceFlags.SAMPLED) {
				return this._remoteParentSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
			}
			return this._remoteParentNotSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
		}
		if (parentContext.traceFlags & TraceFlags.SAMPLED) {
			return this._localParentSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
		}
		return this._localParentNotSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
	}
	toString() {
		return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
	}
}

class TraceIdRatioBasedSampler {
	constructor(_ratio = 0) {
		this._ratio = _ratio;
		this._ratio = this._normalize(_ratio);
		this._upperBound = Math.floor(this._ratio * 0xffffffff);
	}
	shouldSample(context, traceId) {
		return {
			decision: isValidTraceId(traceId) && this._accumulate(traceId) < this._upperBound
				? SamplingDecision.RECORD_AND_SAMPLED
				: SamplingDecision.NOT_RECORD,
		};
	}
	toString() {
		return `TraceIdRatioBased{${this._ratio}}`;
	}
	_normalize(ratio) {
		if (typeof ratio !== 'number' || isNaN(ratio))
			return 0;
		return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
	}
	_accumulate(traceId) {
		let accumulation = 0;
		for (let i = 0; i < traceId.length / 8; i++) {
			const pos = i * 8;
			const part = parseInt(traceId.slice(pos, pos + 8), 16);
			accumulation = (accumulation ^ part) >>> 0;
		}
		return accumulation;
	}
}

const env = getEnv();
const FALLBACK_OTEL_TRACES_SAMPLER = TracesSamplerValues.AlwaysOn;
const DEFAULT_RATIO = 1;
function loadDefaultConfig() {
	return {
		sampler: buildSamplerFromEnv(env),
		forceFlushTimeoutMillis: 30000,
		generalLimits: {
			attributeValueLengthLimit: getEnv().OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT,
			attributeCountLimit: getEnv().OTEL_ATTRIBUTE_COUNT_LIMIT,
		},
		spanLimits: {
			attributeValueLengthLimit: getEnv().OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT,
			attributeCountLimit: getEnv().OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT,
			linkCountLimit: getEnv().OTEL_SPAN_LINK_COUNT_LIMIT,
			eventCountLimit: getEnv().OTEL_SPAN_EVENT_COUNT_LIMIT,
			attributePerEventCountLimit: getEnv().OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
			attributePerLinkCountLimit: getEnv().OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT,
		},
	};
}
function buildSamplerFromEnv(environment = getEnv()) {
	switch (environment.OTEL_TRACES_SAMPLER) {
		case TracesSamplerValues.AlwaysOn:
			return new AlwaysOnSampler();
		case TracesSamplerValues.AlwaysOff:
			return new AlwaysOffSampler();
		case TracesSamplerValues.ParentBasedAlwaysOn:
			return new ParentBasedSampler({
				root: new AlwaysOnSampler(),
			});
		case TracesSamplerValues.ParentBasedAlwaysOff:
			return new ParentBasedSampler({
				root: new AlwaysOffSampler(),
			});
		case TracesSamplerValues.TraceIdRatio:
			return new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment));
		case TracesSamplerValues.ParentBasedTraceIdRatio:
			return new ParentBasedSampler({
				root: new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment)),
			});
		default:
			diag.error(`OTEL_TRACES_SAMPLER value "${environment.OTEL_TRACES_SAMPLER} invalid, defaulting to ${FALLBACK_OTEL_TRACES_SAMPLER}".`);
			return new AlwaysOnSampler();
	}
}
function getSamplerProbabilityFromEnv(environment) {
	if (environment.OTEL_TRACES_SAMPLER_ARG === undefined ||
		environment.OTEL_TRACES_SAMPLER_ARG === '') {
		diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${DEFAULT_RATIO}.`);
		return DEFAULT_RATIO;
	}
	const probability = Number(environment.OTEL_TRACES_SAMPLER_ARG);
	if (isNaN(probability)) {
		diag.error(`OTEL_TRACES_SAMPLER_ARG=${environment.OTEL_TRACES_SAMPLER_ARG} was given, but it is invalid, defaulting to ${DEFAULT_RATIO}.`);
		return DEFAULT_RATIO;
	}
	if (probability < 0 || probability > 1) {
		diag.error(`OTEL_TRACES_SAMPLER_ARG=${environment.OTEL_TRACES_SAMPLER_ARG} was given, but it is out of range ([0..1]), defaulting to ${DEFAULT_RATIO}.`);
		return DEFAULT_RATIO;
	}
	return probability;
}

function mergeConfig(userConfig) {
	const perInstanceDefaults = {
		sampler: buildSamplerFromEnv(),
	};
	const DEFAULT_CONFIG = loadDefaultConfig();
	const target = Object.assign({}, DEFAULT_CONFIG, perInstanceDefaults, userConfig);
	target.generalLimits = Object.assign({}, DEFAULT_CONFIG.generalLimits, userConfig.generalLimits || {});
	target.spanLimits = Object.assign({}, DEFAULT_CONFIG.spanLimits, userConfig.spanLimits || {});
	return target;
}
function reconfigureLimits(userConfig) {
	const spanLimits = Object.assign({}, userConfig.spanLimits);
	const parsedEnvConfig = getEnvWithoutDefaults();
	spanLimits.attributeCountLimit =
		userConfig.spanLimits?.attributeCountLimit ??
			userConfig.generalLimits?.attributeCountLimit ??
			parsedEnvConfig.OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT ??
			parsedEnvConfig.OTEL_ATTRIBUTE_COUNT_LIMIT ??
			DEFAULT_ATTRIBUTE_COUNT_LIMIT;
	spanLimits.attributeValueLengthLimit =
		userConfig.spanLimits?.attributeValueLengthLimit ??
			userConfig.generalLimits?.attributeValueLengthLimit ??
			parsedEnvConfig.OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT ??
			parsedEnvConfig.OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT ??
			DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT;
	return Object.assign({}, userConfig, { spanLimits });
}

class BatchSpanProcessorBase {
	constructor(_exporter, config) {
		this._exporter = _exporter;
		this._isExporting = false;
		this._finishedSpans = [];
		this._droppedSpansCount = 0;
		const env = getEnv();
		this._maxExportBatchSize =
			typeof config?.maxExportBatchSize === 'number'
				? config.maxExportBatchSize
				: env.OTEL_BSP_MAX_EXPORT_BATCH_SIZE;
		this._maxQueueSize =
			typeof config?.maxQueueSize === 'number'
				? config.maxQueueSize
				: env.OTEL_BSP_MAX_QUEUE_SIZE;
		this._scheduledDelayMillis =
			typeof config?.scheduledDelayMillis === 'number'
				? config.scheduledDelayMillis
				: env.OTEL_BSP_SCHEDULE_DELAY;
		this._exportTimeoutMillis =
			typeof config?.exportTimeoutMillis === 'number'
				? config.exportTimeoutMillis
				: env.OTEL_BSP_EXPORT_TIMEOUT;
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
		if (this._maxExportBatchSize > this._maxQueueSize) {
			diag.warn('BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize');
			this._maxExportBatchSize = this._maxQueueSize;
		}
	}
	forceFlush() {
		if (this._shutdownOnce.isCalled) {
			return this._shutdownOnce.promise;
		}
		return this._flushAll();
	}
	onStart(_span, _parentContext) { }
	onEnd(span) {
		if (this._shutdownOnce.isCalled) {
			return;
		}
		if ((span.spanContext().traceFlags & TraceFlags.SAMPLED) === 0) {
			return;
		}
		this._addToBuffer(span);
	}
	shutdown() {
		return this._shutdownOnce.call();
	}
	_shutdown() {
		return Promise.resolve()
			.then(() => {
			return this.onShutdown();
		})
			.then(() => {
			return this._flushAll();
		})
			.then(() => {
			return this._exporter.shutdown();
		});
	}
	_addToBuffer(span) {
		if (this._finishedSpans.length >= this._maxQueueSize) {
			if (this._droppedSpansCount === 0) {
				diag.debug('maxQueueSize reached, dropping spans');
			}
			this._droppedSpansCount++;
			return;
		}
		if (this._droppedSpansCount > 0) {
			diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`);
			this._droppedSpansCount = 0;
		}
		this._finishedSpans.push(span);
		this._maybeStartTimer();
	}
	_flushAll() {
		return new Promise((resolve, reject) => {
			const promises = [];
			const count = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
			for (let i = 0, j = count; i < j; i++) {
				promises.push(this._flushOneBatch());
			}
			Promise.all(promises)
				.then(() => {
				resolve();
			})
				.catch(reject);
		});
	}
	_flushOneBatch() {
		this._clearTimer();
		if (this._finishedSpans.length === 0) {
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error('Timeout'));
			}, this._exportTimeoutMillis);
			context.with(suppressTracing(context.active()), () => {
				const spans = this._finishedSpans.splice(0, this._maxExportBatchSize);
				const doExport = () => this._exporter.export(spans, result => {
					clearTimeout(timer);
					if (result.code === ExportResultCode.SUCCESS) {
						resolve();
					}
					else {
						reject(result.error ??
							new Error('BatchSpanProcessor: span export failed'));
					}
				});
				const pendingResources = spans
					.map(span => span.resource)
					.filter(resource => resource.asyncAttributesPending);
				if (pendingResources.length === 0) {
					doExport();
				}
				else {
					Promise.all(pendingResources.map(resource => resource.waitForAsyncAttributes?.())).then(doExport, err => {
						globalErrorHandler(err);
						reject(err);
					});
				}
			});
		});
	}
	_maybeStartTimer() {
		if (this._isExporting)
			return;
		const flush = () => {
			this._isExporting = true;
			this._flushOneBatch()
				.then(() => {
				this._isExporting = false;
				if (this._finishedSpans.length > 0) {
					this._clearTimer();
					this._maybeStartTimer();
				}
			})
				.catch(e => {
				this._isExporting = false;
				globalErrorHandler(e);
			});
		};
		if (this._finishedSpans.length >= this._maxExportBatchSize) {
			return flush();
		}
		if (this._timer !== undefined)
			return;
		this._timer = setTimeout(() => flush(), this._scheduledDelayMillis);
		unrefTimer(this._timer);
	}
	_clearTimer() {
		if (this._timer !== undefined) {
			clearTimeout(this._timer);
			this._timer = undefined;
		}
	}
}

class BatchSpanProcessor extends BatchSpanProcessorBase {
	onShutdown() { }
}

const SPAN_ID_BYTES = 8;
const TRACE_ID_BYTES = 16;
class RandomIdGenerator {
	constructor() {
		this.generateTraceId = getIdGenerator(TRACE_ID_BYTES);
		this.generateSpanId = getIdGenerator(SPAN_ID_BYTES);
	}
}
const SHARED_CHAR_CODES_ARRAY = Array(32);
function getIdGenerator(bytes) {
	return function generateId() {
		for (let i = 0; i < bytes * 2; i++) {
			SHARED_CHAR_CODES_ARRAY[i] = Math.floor(Math.random() * 16) + 48;
			if (SHARED_CHAR_CODES_ARRAY[i] >= 58) {
				SHARED_CHAR_CODES_ARRAY[i] += 39;
			}
		}
		return String.fromCharCode.apply(null, SHARED_CHAR_CODES_ARRAY.slice(0, bytes * 2));
	};
}

class Tracer {
	constructor(instrumentationLibrary, config, _tracerProvider) {
		this._tracerProvider = _tracerProvider;
		const localConfig = mergeConfig(config);
		this._sampler = localConfig.sampler;
		this._generalLimits = localConfig.generalLimits;
		this._spanLimits = localConfig.spanLimits;
		this._idGenerator = config.idGenerator || new RandomIdGenerator();
		this.resource = _tracerProvider.resource;
		this.instrumentationLibrary = instrumentationLibrary;
	}
	startSpan(name, options = {}, context = api.context.active()) {
		if (options.root) {
			context = api.trace.deleteSpan(context);
		}
		const parentSpan = api.trace.getSpan(context);
		if (isTracingSuppressed(context)) {
			api.diag.debug('Instrumentation suppressed, returning Noop Span');
			const nonRecordingSpan = api.trace.wrapSpanContext(api.INVALID_SPAN_CONTEXT);
			return nonRecordingSpan;
		}
		const parentSpanContext = parentSpan?.spanContext();
		const spanId = this._idGenerator.generateSpanId();
		let traceId;
		let traceState;
		let parentSpanId;
		if (!parentSpanContext ||
			!api.trace.isSpanContextValid(parentSpanContext)) {
			traceId = this._idGenerator.generateTraceId();
		}
		else {
			traceId = parentSpanContext.traceId;
			traceState = parentSpanContext.traceState;
			parentSpanId = parentSpanContext.spanId;
		}
		const spanKind = options.kind ?? api.SpanKind.INTERNAL;
		const links = (options.links ?? []).map(link => {
			return {
				context: link.context,
				attributes: sanitizeAttributes(link.attributes),
			};
		});
		const attributes = sanitizeAttributes(options.attributes);
		const samplingResult = this._sampler.shouldSample(context, traceId, name, spanKind, attributes, links);
		traceState = samplingResult.traceState ?? traceState;
		const traceFlags = samplingResult.decision === api.SamplingDecision.RECORD_AND_SAMPLED
			? api.TraceFlags.SAMPLED
			: api.TraceFlags.NONE;
		const spanContext = { traceId, spanId, traceFlags, traceState };
		if (samplingResult.decision === api.SamplingDecision.NOT_RECORD) {
			api.diag.debug('Recording is off, propagating context in a non-recording span');
			const nonRecordingSpan = api.trace.wrapSpanContext(spanContext);
			return nonRecordingSpan;
		}
		const span = new Span(this, context, name, spanContext, spanKind, parentSpanId, links, options.startTime);
		const initAttributes = sanitizeAttributes(Object.assign(attributes, samplingResult.attributes));
		span.setAttributes(initAttributes);
		return span;
	}
	startActiveSpan(name, arg2, arg3, arg4) {
		let opts;
		let ctx;
		let fn;
		if (arguments.length < 2) {
			return;
		}
		else if (arguments.length === 2) {
			fn = arg2;
		}
		else if (arguments.length === 3) {
			opts = arg2;
			fn = arg3;
		}
		else {
			opts = arg2;
			ctx = arg3;
			fn = arg4;
		}
		const parentContext = ctx ?? api.context.active();
		const span = this.startSpan(name, opts, parentContext);
		const contextWithSpanSet = api.trace.setSpan(parentContext, span);
		return api.context.with(contextWithSpanSet, fn, undefined, span);
	}
	getGeneralLimits() {
		return this._generalLimits;
	}
	getSpanLimits() {
		return this._spanLimits;
	}
	getActiveSpanProcessor() {
		return this._tracerProvider.getActiveSpanProcessor();
	}
}

class MultiSpanProcessor {
	constructor(_spanProcessors) {
		this._spanProcessors = _spanProcessors;
	}
	forceFlush() {
		const promises = [];
		for (const spanProcessor of this._spanProcessors) {
			promises.push(spanProcessor.forceFlush());
		}
		return new Promise(resolve => {
			Promise.all(promises)
				.then(() => {
				resolve();
			})
				.catch(error => {
				globalErrorHandler(error || new Error('MultiSpanProcessor: forceFlush failed'));
				resolve();
			});
		});
	}
	onStart(span, context) {
		for (const spanProcessor of this._spanProcessors) {
			spanProcessor.onStart(span, context);
		}
	}
	onEnd(span) {
		for (const spanProcessor of this._spanProcessors) {
			spanProcessor.onEnd(span);
		}
	}
	shutdown() {
		const promises = [];
		for (const spanProcessor of this._spanProcessors) {
			promises.push(spanProcessor.shutdown());
		}
		return new Promise((resolve, reject) => {
			Promise.all(promises).then(() => {
				resolve();
			}, reject);
		});
	}
}

class NoopSpanProcessor {
	onStart(_span, _context) { }
	onEnd(_span) { }
	shutdown() {
		return Promise.resolve();
	}
	forceFlush() {
		return Promise.resolve();
	}
}

var ForceFlushState;
(function (ForceFlushState) {
	ForceFlushState[ForceFlushState["resolved"] = 0] = "resolved";
	ForceFlushState[ForceFlushState["timeout"] = 1] = "timeout";
	ForceFlushState[ForceFlushState["error"] = 2] = "error";
	ForceFlushState[ForceFlushState["unresolved"] = 3] = "unresolved";
})(ForceFlushState || (ForceFlushState = {}));
class BasicTracerProvider {
	constructor(config = {}) {
		this._registeredSpanProcessors = [];
		this._tracers = new Map();
		const mergedConfig = merge({}, loadDefaultConfig(), reconfigureLimits(config));
		this.resource = mergedConfig.resource ?? Resource.empty();
		this.resource = Resource.default().merge(this.resource);
		this._config = Object.assign({}, mergedConfig, {
			resource: this.resource,
		});
		const defaultExporter = this._buildExporterFromEnv();
		if (defaultExporter !== undefined) {
			const batchProcessor = new BatchSpanProcessor(defaultExporter);
			this.activeSpanProcessor = batchProcessor;
		}
		else {
			this.activeSpanProcessor = new NoopSpanProcessor();
		}
	}
	getTracer(name, version, options) {
		const key = `${name}@${version || ''}:${options?.schemaUrl || ''}`;
		if (!this._tracers.has(key)) {
			this._tracers.set(key, new Tracer({ name, version, schemaUrl: options?.schemaUrl }, this._config, this));
		}
		return this._tracers.get(key);
	}
	addSpanProcessor(spanProcessor) {
		if (this._registeredSpanProcessors.length === 0) {
			this.activeSpanProcessor
				.shutdown()
				.catch(err => diag.error('Error while trying to shutdown current span processor', err));
		}
		this._registeredSpanProcessors.push(spanProcessor);
		this.activeSpanProcessor = new MultiSpanProcessor(this._registeredSpanProcessors);
	}
	getActiveSpanProcessor() {
		return this.activeSpanProcessor;
	}
	register(config = {}) {
		trace.setGlobalTracerProvider(this);
		if (config.propagator === undefined) {
			config.propagator = this._buildPropagatorFromEnv();
		}
		if (config.contextManager) {
			context.setGlobalContextManager(config.contextManager);
		}
		if (config.propagator) {
			propagation.setGlobalPropagator(config.propagator);
		}
	}
	forceFlush() {
		const timeout = this._config.forceFlushTimeoutMillis;
		const promises = this._registeredSpanProcessors.map((spanProcessor) => {
			return new Promise(resolve => {
				let state;
				const timeoutInterval = setTimeout(() => {
					resolve(new Error(`Span processor did not completed within timeout period of ${timeout} ms`));
					state = ForceFlushState.timeout;
				}, timeout);
				spanProcessor
					.forceFlush()
					.then(() => {
					clearTimeout(timeoutInterval);
					if (state !== ForceFlushState.timeout) {
						state = ForceFlushState.resolved;
						resolve(state);
					}
				})
					.catch(error => {
					clearTimeout(timeoutInterval);
					state = ForceFlushState.error;
					resolve(error);
				});
			});
		});
		return new Promise((resolve, reject) => {
			Promise.all(promises)
				.then(results => {
				const errors = results.filter(result => result !== ForceFlushState.resolved);
				if (errors.length > 0) {
					reject(errors);
				}
				else {
					resolve();
				}
			})
				.catch(error => reject([error]));
		});
	}
	shutdown() {
		return this.activeSpanProcessor.shutdown();
	}
	_getPropagator(name) {
		return this.constructor._registeredPropagators.get(name)?.();
	}
	_getSpanExporter(name) {
		return this.constructor._registeredExporters.get(name)?.();
	}
	_buildPropagatorFromEnv() {
		const uniquePropagatorNames = Array.from(new Set(getEnv().OTEL_PROPAGATORS));
		const propagators = uniquePropagatorNames.map(name => {
			const propagator = this._getPropagator(name);
			if (!propagator) {
				diag.warn(`Propagator "${name}" requested through environment variable is unavailable.`);
			}
			return propagator;
		});
		const validPropagators = propagators.reduce((list, item) => {
			if (item) {
				list.push(item);
			}
			return list;
		}, []);
		if (validPropagators.length === 0) {
			return;
		}
		else if (uniquePropagatorNames.length === 1) {
			return validPropagators[0];
		}
		else {
			return new CompositePropagator({
				propagators: validPropagators,
			});
		}
	}
	_buildExporterFromEnv() {
		const exporterName = getEnv().OTEL_TRACES_EXPORTER;
		if (exporterName === 'none' || exporterName === '')
			return;
		const exporter = this._getSpanExporter(exporterName);
		if (!exporter) {
			diag.error(`Exporter "${exporterName}" requested through environment variable is unavailable.`);
		}
		return exporter;
	}
}
BasicTracerProvider._registeredPropagators = new Map([
	['tracecontext', () => new W3CTraceContextPropagator()],
	['baggage', () => new W3CBaggagePropagator()],
]);
BasicTracerProvider._registeredExporters = new Map();

class ConsoleSpanExporter {
	export(spans, resultCallback) {
		return this._sendSpans(spans, resultCallback);
	}
	shutdown() {
		this._sendSpans([]);
		return this.forceFlush();
	}
	forceFlush() {
		return Promise.resolve();
	}
	_exportInfo(span) {
		return {
			traceId: span.spanContext().traceId,
			parentId: span.parentSpanId,
			traceState: span.spanContext().traceState?.serialize(),
			name: span.name,
			id: span.spanContext().spanId,
			kind: span.kind,
			timestamp: hrTimeToMicroseconds(span.startTime),
			duration: hrTimeToMicroseconds(span.duration),
			attributes: span.attributes,
			status: span.status,
			events: span.events,
			links: span.links,
		};
	}
	_sendSpans(spans, done) {
		for (const span of spans) {
			console.dir(this._exportInfo(span), { depth: 3 });
		}
		if (done) {
			return done({ code: ExportResultCode.SUCCESS });
		}
	}
}

class InMemorySpanExporter {
	constructor() {
		this._finishedSpans = [];
		this._stopped = false;
	}
	export(spans, resultCallback) {
		if (this._stopped)
			return resultCallback({
				code: ExportResultCode.FAILED,
				error: new Error('Exporter has been stopped'),
			});
		this._finishedSpans.push(...spans);
		setTimeout(() => resultCallback({ code: ExportResultCode.SUCCESS }), 0);
	}
	shutdown() {
		this._stopped = true;
		this._finishedSpans = [];
		return this.forceFlush();
	}
	forceFlush() {
		return Promise.resolve();
	}
	reset() {
		this._finishedSpans = [];
	}
	getFinishedSpans() {
		return this._finishedSpans;
	}
}

class SimpleSpanProcessor {
	constructor(_exporter) {
		this._exporter = _exporter;
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
		this._unresolvedExports = new Set();
	}
	async forceFlush() {
		await Promise.all(Array.from(this._unresolvedExports));
		if (this._exporter.forceFlush) {
			await this._exporter.forceFlush();
		}
	}
	onStart(_span, _parentContext) { }
	onEnd(span) {
		if (this._shutdownOnce.isCalled) {
			return;
		}
		if ((span.spanContext().traceFlags & TraceFlags.SAMPLED) === 0) {
			return;
		}
		const doExport = () => internal
			._export(this._exporter, [span])
			.then((result) => {
			if (result.code !== ExportResultCode.SUCCESS) {
				globalErrorHandler(result.error ??
					new Error(`SimpleSpanProcessor: span export failed (status ${result})`));
			}
		})
			.catch(error => {
			globalErrorHandler(error);
		});
		if (span.resource.asyncAttributesPending) {
			const exportPromise = span.resource
				.waitForAsyncAttributes?.()
				.then(() => {
				if (exportPromise != null) {
					this._unresolvedExports.delete(exportPromise);
				}
				return doExport();
			}, err => globalErrorHandler(err));
			if (exportPromise != null) {
				this._unresolvedExports.add(exportPromise);
			}
		}
		else {
			void doExport();
		}
	}
	shutdown() {
		return this._shutdownOnce.call();
	}
	_shutdown() {
		return this._exporter.shutdown();
	}
}

export { AlwaysOffSampler, AlwaysOnSampler, BasicTracerProvider, BatchSpanProcessor, ConsoleSpanExporter, ForceFlushState, InMemorySpanExporter, NoopSpanProcessor, ParentBasedSampler, RandomIdGenerator, SamplingDecision, SimpleSpanProcessor, Span, TraceIdRatioBasedSampler, Tracer };
