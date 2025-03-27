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

import { otperformance, getTimeOrigin, isAttributeValue, isTimeInput, sanitizeAttributes, hrTimeDuration, hrTime, millisToHrTime, isTimeInputHrTime, addHrTimes, globalErrorHandler, getNumberFromEnv, getStringFromEnv, BindOnceFuture, suppressTracing, unrefTimer, ExportResultCode, isTracingSuppressed, merge, hrTimeToMicroseconds, internal } from './core.js';
import { defaultResource } from './resources.js';
import * as api from './api.js';
import { SpanStatusCode, diag, trace, isSpanContextValid, TraceFlags, isValidTraceId, context } from './api.js';
import { SEMATTRS_EXCEPTION_TYPE, SEMATTRS_EXCEPTION_MESSAGE, SEMATTRS_EXCEPTION_STACKTRACE } from './semantic-conventions.js';

const ExceptionEventName = 'exception';

class SpanImpl {
	_spanContext;
	kind;
	parentSpanContext;
	attributes = {};
	links = [];
	events = [];
	startTime;
	resource;
	instrumentationScope;
	_droppedAttributesCount = 0;
	_droppedEventsCount = 0;
	_droppedLinksCount = 0;
	name;
	status = {
		code: SpanStatusCode.UNSET,
	};
	endTime = [0, 0];
	_ended = false;
	_duration = [-1, -1];
	_spanProcessor;
	_spanLimits;
	_attributeValueLengthLimit;
	_performanceStartTime;
	_performanceOffset;
	_startTimeProvided;
	constructor(opts) {
		const now = Date.now();
		this._spanContext = opts.spanContext;
		this._performanceStartTime = otperformance.now();
		this._performanceOffset =
			now - (this._performanceStartTime + getTimeOrigin());
		this._startTimeProvided = opts.startTime != null;
		this._spanLimits = opts.spanLimits;
		this._attributeValueLengthLimit =
			this._spanLimits.attributeValueLengthLimit || 0;
		this._spanProcessor = opts.spanProcessor;
		this.name = opts.name;
		this.parentSpanContext = opts.parentSpanContext;
		this.kind = opts.kind;
		this.links = opts.links || [];
		this.startTime = this._getTime(opts.startTime ?? now);
		this.resource = opts.resource;
		this.instrumentationScope = opts.scope;
		if (opts.attributes != null) {
			this.setAttributes(opts.attributes);
		}
		this._spanProcessor.onStart(this, opts.context);
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
		const { attributeCountLimit } = this._spanLimits;
		if (attributeCountLimit !== undefined &&
			Object.keys(this.attributes).length >= attributeCountLimit &&
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
		const { eventCountLimit } = this._spanLimits;
		if (eventCountLimit === 0) {
			diag.warn('No events allowed.');
			this._droppedEventsCount++;
			return this;
		}
		if (eventCountLimit !== undefined &&
			this.events.length >= eventCountLimit) {
			if (this._droppedEventsCount === 0) {
				diag.debug('Dropping extra events.');
			}
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
	addLink(link) {
		this.links.push(link);
		return this;
	}
	addLinks(links) {
		this.links.push(...links);
		return this;
	}
	setStatus(status) {
		if (this._isSpanEnded())
			return this;
		this.status = { ...status };
		if (this.status.message != null && typeof status.message !== 'string') {
			diag.warn(`Dropping invalid status.message of type '${typeof status.message}', expected 'string'`);
			delete this.status.message;
		}
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
		if (this._droppedEventsCount > 0) {
			diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
		}
		this._spanProcessor.onEnd(this);
	}
	_getTime(inp) {
		if (typeof inp === 'number' && inp <= otperformance.now()) {
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
			attributes[SEMATTRS_EXCEPTION_MESSAGE] = exception;
		}
		else if (exception) {
			if (exception.code) {
				attributes[SEMATTRS_EXCEPTION_TYPE] = exception.code.toString();
			}
			else if (exception.name) {
				attributes[SEMATTRS_EXCEPTION_TYPE] = exception.name;
			}
			if (exception.message) {
				attributes[SEMATTRS_EXCEPTION_MESSAGE] = exception.message;
			}
			if (exception.stack) {
				attributes[SEMATTRS_EXCEPTION_STACKTRACE] = exception.stack;
			}
		}
		if (attributes[SEMATTRS_EXCEPTION_TYPE] ||
			attributes[SEMATTRS_EXCEPTION_MESSAGE]) {
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
			const error = new Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
			diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, error);
		}
		return this._ended;
	}
	_truncateToLimitUtil(value, limit) {
		if (value.length <= limit) {
			return value;
		}
		return value.substring(0, limit);
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
	_root;
	_remoteParentSampled;
	_remoteParentNotSampled;
	_localParentSampled;
	_localParentNotSampled;
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
	_ratio;
	_upperBound;
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

const DEFAULT_RATIO = 1;
function loadDefaultConfig() {
	return {
		sampler: buildSamplerFromEnv(),
		forceFlushTimeoutMillis: 30000,
		generalLimits: {
			attributeValueLengthLimit: getNumberFromEnv('OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT') ?? Infinity,
			attributeCountLimit: getNumberFromEnv('OTEL_ATTRIBUTE_COUNT_LIMIT') ?? 128,
		},
		spanLimits: {
			attributeValueLengthLimit: getNumberFromEnv('OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT') ?? Infinity,
			attributeCountLimit: getNumberFromEnv('OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT') ?? 128,
			linkCountLimit: getNumberFromEnv('OTEL_SPAN_LINK_COUNT_LIMIT') ?? 128,
			eventCountLimit: getNumberFromEnv('OTEL_SPAN_EVENT_COUNT_LIMIT') ?? 128,
			attributePerEventCountLimit: getNumberFromEnv('OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT') ?? 128,
			attributePerLinkCountLimit: getNumberFromEnv('OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT') ?? 128,
		},
	};
}
function buildSamplerFromEnv() {
	const sampler = getStringFromEnv('OTEL_TRACES_SAMPLER') ??
		"parentbased_always_on" ;
	switch (sampler) {
		case "always_on" :
			return new AlwaysOnSampler();
		case "always_off" :
			return new AlwaysOffSampler();
		case "parentbased_always_on" :
			return new ParentBasedSampler({
				root: new AlwaysOnSampler(),
			});
		case "parentbased_always_off" :
			return new ParentBasedSampler({
				root: new AlwaysOffSampler(),
			});
		case "traceidratio" :
			return new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv());
		case "parentbased_traceidratio" :
			return new ParentBasedSampler({
				root: new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv()),
			});
		default:
			diag.error(`OTEL_TRACES_SAMPLER value "${sampler}" invalid, defaulting to "${"parentbased_always_on" }".`);
			return new ParentBasedSampler({
				root: new AlwaysOnSampler(),
			});
	}
}
function getSamplerProbabilityFromEnv() {
	const probability = getNumberFromEnv('OTEL_TRACES_SAMPLER_ARG');
	if (probability == null) {
		diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${DEFAULT_RATIO}.`);
		return DEFAULT_RATIO;
	}
	if (probability < 0 || probability > 1) {
		diag.error(`OTEL_TRACES_SAMPLER_ARG=${probability} was given, but it is out of range ([0..1]), defaulting to ${DEFAULT_RATIO}.`);
		return DEFAULT_RATIO;
	}
	return probability;
}

const DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
const DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = Infinity;
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
	spanLimits.attributeCountLimit =
		userConfig.spanLimits?.attributeCountLimit ??
			userConfig.generalLimits?.attributeCountLimit ??
			getNumberFromEnv('OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT') ??
			getNumberFromEnv('OTEL_ATTRIBUTE_COUNT_LIMIT') ??
			DEFAULT_ATTRIBUTE_COUNT_LIMIT;
	spanLimits.attributeValueLengthLimit =
		userConfig.spanLimits?.attributeValueLengthLimit ??
			userConfig.generalLimits?.attributeValueLengthLimit ??
			getNumberFromEnv('OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT') ??
			getNumberFromEnv('OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT') ??
			DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT;
	return Object.assign({}, userConfig, { spanLimits });
}

class BatchSpanProcessorBase {
	_exporter;
	_maxExportBatchSize;
	_maxQueueSize;
	_scheduledDelayMillis;
	_exportTimeoutMillis;
	_isExporting = false;
	_finishedSpans = [];
	_timer;
	_shutdownOnce;
	_droppedSpansCount = 0;
	constructor(_exporter, config) {
		this._exporter = _exporter;
		this._maxExportBatchSize =
			typeof config?.maxExportBatchSize === 'number'
				? config.maxExportBatchSize
				: (getNumberFromEnv('OTEL_BSP_MAX_EXPORT_BATCH_SIZE') ?? 512);
		this._maxQueueSize =
			typeof config?.maxQueueSize === 'number'
				? config.maxQueueSize
				: (getNumberFromEnv('OTEL_BSP_MAX_QUEUE_SIZE') ?? 2048);
		this._scheduledDelayMillis =
			typeof config?.scheduledDelayMillis === 'number'
				? config.scheduledDelayMillis
				: (getNumberFromEnv('OTEL_BSP_SCHEDULE_DELAY') ?? 5000);
		this._exportTimeoutMillis =
			typeof config?.exportTimeoutMillis === 'number'
				? config.exportTimeoutMillis
				: (getNumberFromEnv('OTEL_BSP_EXPORT_TIMEOUT') ?? 30000);
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
				let spans;
				if (this._finishedSpans.length <= this._maxExportBatchSize) {
					spans = this._finishedSpans;
					this._finishedSpans = [];
				}
				else {
					spans = this._finishedSpans.splice(0, this._maxExportBatchSize);
				}
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
				let pendingResources = null;
				for (let i = 0, len = spans.length; i < len; i++) {
					const span = spans[i];
					if (span.resource.asyncAttributesPending &&
						span.resource.waitForAsyncAttributes) {
						pendingResources ??= [];
						pendingResources.push(span.resource.waitForAsyncAttributes());
					}
				}
				if (pendingResources === null) {
					doExport();
				}
				else {
					Promise.all(pendingResources).then(doExport, err => {
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
				.finally(() => {
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
	generateTraceId = getIdGenerator(TRACE_ID_BYTES);
	generateSpanId = getIdGenerator(SPAN_ID_BYTES);
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
	_sampler;
	_generalLimits;
	_spanLimits;
	_idGenerator;
	instrumentationScope;
	_resource;
	_spanProcessor;
	constructor(instrumentationScope, config, resource, spanProcessor) {
		const localConfig = mergeConfig(config);
		this._sampler = localConfig.sampler;
		this._generalLimits = localConfig.generalLimits;
		this._spanLimits = localConfig.spanLimits;
		this._idGenerator = config.idGenerator || new RandomIdGenerator();
		this._resource = resource;
		this._spanProcessor = spanProcessor;
		this.instrumentationScope = instrumentationScope;
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
		let validParentSpanContext;
		let traceId;
		let traceState;
		if (!parentSpanContext ||
			!api.trace.isSpanContextValid(parentSpanContext)) {
			traceId = this._idGenerator.generateTraceId();
		}
		else {
			traceId = parentSpanContext.traceId;
			traceState = parentSpanContext.traceState;
			validParentSpanContext = parentSpanContext;
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
		const initAttributes = sanitizeAttributes(Object.assign(attributes, samplingResult.attributes));
		const span = new SpanImpl({
			resource: this._resource,
			scope: this.instrumentationScope,
			context,
			spanContext,
			name,
			kind: spanKind,
			links,
			parentSpanContext: validParentSpanContext,
			attributes: initAttributes,
			startTime: options.startTime,
			spanProcessor: this._spanProcessor,
			spanLimits: this._spanLimits,
		});
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
}

class MultiSpanProcessor {
	_spanProcessors;
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

var ForceFlushState;
(function (ForceFlushState) {
	ForceFlushState[ForceFlushState["resolved"] = 0] = "resolved";
	ForceFlushState[ForceFlushState["timeout"] = 1] = "timeout";
	ForceFlushState[ForceFlushState["error"] = 2] = "error";
	ForceFlushState[ForceFlushState["unresolved"] = 3] = "unresolved";
})(ForceFlushState || (ForceFlushState = {}));
class BasicTracerProvider {
	_config;
	_tracers = new Map();
	_resource;
	_activeSpanProcessor;
	constructor(config = {}) {
		const mergedConfig = merge({}, loadDefaultConfig(), reconfigureLimits(config));
		this._resource = mergedConfig.resource ?? defaultResource();
		this._config = Object.assign({}, mergedConfig, {
			resource: this._resource,
		});
		const spanProcessors = [];
		if (config.spanProcessors?.length) {
			spanProcessors.push(...config.spanProcessors);
		}
		this._activeSpanProcessor = new MultiSpanProcessor(spanProcessors);
	}
	getTracer(name, version, options) {
		const key = `${name}@${version || ''}:${options?.schemaUrl || ''}`;
		if (!this._tracers.has(key)) {
			this._tracers.set(key, new Tracer({ name, version, schemaUrl: options?.schemaUrl }, this._config, this._resource, this._activeSpanProcessor));
		}
		return this._tracers.get(key);
	}
	forceFlush() {
		const timeout = this._config.forceFlushTimeoutMillis;
		const promises = this._activeSpanProcessor['_spanProcessors'].map((spanProcessor) => {
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
		return this._activeSpanProcessor.shutdown();
	}
}

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
			resource: {
				attributes: span.resource.attributes,
			},
			instrumentationScope: span.instrumentationScope,
			traceId: span.spanContext().traceId,
			parentSpanContext: span.parentSpanContext,
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
	_finishedSpans = [];
	_stopped = false;
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
	_exporter;
	_shutdownOnce;
	_pendingExports;
	constructor(_exporter) {
		this._exporter = _exporter;
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
		this._pendingExports = new Set();
	}
	async forceFlush() {
		await Promise.all(Array.from(this._pendingExports));
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
		const pendingExport = this._doExport(span).catch(err => globalErrorHandler(err));
		this._pendingExports.add(pendingExport);
		pendingExport.finally(() => this._pendingExports.delete(pendingExport));
	}
	async _doExport(span) {
		if (span.resource.asyncAttributesPending) {
			await span.resource.waitForAsyncAttributes?.();
		}
		const result = await internal._export(this._exporter, [span]);
		if (result.code !== ExportResultCode.SUCCESS) {
			throw (result.error ??
				new Error(`SimpleSpanProcessor: span export failed (status ${result})`));
		}
	}
	shutdown() {
		return this._shutdownOnce.call();
	}
	_shutdown() {
		return this._exporter.shutdown();
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

export { AlwaysOffSampler, AlwaysOnSampler, BasicTracerProvider, BatchSpanProcessor, ConsoleSpanExporter, InMemorySpanExporter, NoopSpanProcessor, ParentBasedSampler, RandomIdGenerator, SamplingDecision, SimpleSpanProcessor, TraceIdRatioBasedSampler };
