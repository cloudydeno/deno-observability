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
/// <reference types="./sdk-logs.d.ts" />

import * as api from './api.js';
import { diag, context } from './api.js';
import { NOOP_LOGGER } from './api-logs.js';
import { defaultResource } from './resources.js';
import { timeInputToHrTime, isAttributeValue, getNumberFromEnv, callWithTimeout, merge, BindOnceFuture, hrTimeToMicroseconds, ExportResultCode, globalErrorHandler, internal, unrefTimer } from './core.js';

class LogRecord {
	hrTime;
	hrTimeObserved;
	spanContext;
	resource;
	instrumentationScope;
	attributes = {};
	_severityText;
	_severityNumber;
	_body;
	totalAttributesCount = 0;
	_isReadonly = false;
	_logRecordLimits;
	set severityText(severityText) {
		if (this._isLogRecordReadonly()) {
			return;
		}
		this._severityText = severityText;
	}
	get severityText() {
		return this._severityText;
	}
	set severityNumber(severityNumber) {
		if (this._isLogRecordReadonly()) {
			return;
		}
		this._severityNumber = severityNumber;
	}
	get severityNumber() {
		return this._severityNumber;
	}
	set body(body) {
		if (this._isLogRecordReadonly()) {
			return;
		}
		this._body = body;
	}
	get body() {
		return this._body;
	}
	get droppedAttributesCount() {
		return this.totalAttributesCount - Object.keys(this.attributes).length;
	}
	constructor(_sharedState, instrumentationScope, logRecord) {
		const { timestamp, observedTimestamp, severityNumber, severityText, body, attributes = {}, context, } = logRecord;
		const now = Date.now();
		this.hrTime = timeInputToHrTime(timestamp ?? now);
		this.hrTimeObserved = timeInputToHrTime(observedTimestamp ?? now);
		if (context) {
			const spanContext = api.trace.getSpanContext(context);
			if (spanContext && api.isSpanContextValid(spanContext)) {
				this.spanContext = spanContext;
			}
		}
		this.severityNumber = severityNumber;
		this.severityText = severityText;
		this.body = body;
		this.resource = _sharedState.resource;
		this.instrumentationScope = instrumentationScope;
		this._logRecordLimits = _sharedState.logRecordLimits;
		this.setAttributes(attributes);
	}
	setAttribute(key, value) {
		if (this._isLogRecordReadonly()) {
			return this;
		}
		if (value === null) {
			return this;
		}
		if (key.length === 0) {
			api.diag.warn(`Invalid attribute key: ${key}`);
			return this;
		}
		if (!isAttributeValue(value) &&
			!(typeof value === 'object' &&
				!Array.isArray(value) &&
				Object.keys(value).length > 0)) {
			api.diag.warn(`Invalid attribute value set for key: ${key}`);
			return this;
		}
		this.totalAttributesCount += 1;
		if (Object.keys(this.attributes).length >=
			this._logRecordLimits.attributeCountLimit &&
			!Object.prototype.hasOwnProperty.call(this.attributes, key)) {
			if (this.droppedAttributesCount === 1) {
				api.diag.warn('Dropping extra attributes.');
			}
			return this;
		}
		if (isAttributeValue(value)) {
			this.attributes[key] = this._truncateToSize(value);
		}
		else {
			this.attributes[key] = value;
		}
		return this;
	}
	setAttributes(attributes) {
		for (const [k, v] of Object.entries(attributes)) {
			this.setAttribute(k, v);
		}
		return this;
	}
	setBody(body) {
		this.body = body;
		return this;
	}
	setSeverityNumber(severityNumber) {
		this.severityNumber = severityNumber;
		return this;
	}
	setSeverityText(severityText) {
		this.severityText = severityText;
		return this;
	}
	_makeReadonly() {
		this._isReadonly = true;
	}
	_truncateToSize(value) {
		const limit = this._logRecordLimits.attributeValueLengthLimit;
		if (limit <= 0) {
			api.diag.warn(`Attribute value limit must be positive, got ${limit}`);
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
	_truncateToLimitUtil(value, limit) {
		if (value.length <= limit) {
			return value;
		}
		return value.substring(0, limit);
	}
	_isLogRecordReadonly() {
		if (this._isReadonly) {
			diag.warn('Can not execute the operation on emitted log record');
		}
		return this._isReadonly;
	}
}

class Logger {
	instrumentationScope;
	_sharedState;
	constructor(instrumentationScope, _sharedState) {
		this.instrumentationScope = instrumentationScope;
		this._sharedState = _sharedState;
	}
	emit(logRecord) {
		const currentContext = logRecord.context || context.active();
		const logRecordInstance = new LogRecord(this._sharedState, this.instrumentationScope, {
			context: currentContext,
			...logRecord,
		});
		this._sharedState.activeProcessor.onEmit(logRecordInstance, currentContext);
		logRecordInstance._makeReadonly();
	}
}

function loadDefaultConfig() {
	return {
		forceFlushTimeoutMillis: 30000,
		logRecordLimits: {
			attributeValueLengthLimit: getNumberFromEnv('OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT') ??
				Infinity,
			attributeCountLimit: getNumberFromEnv('OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT') ?? 128,
		},
		includeTraceContext: true,
	};
}
function reconfigureLimits(logRecordLimits) {
	return {
		attributeCountLimit: logRecordLimits.attributeCountLimit ??
			getNumberFromEnv('OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT') ??
			getNumberFromEnv('OTEL_ATTRIBUTE_COUNT_LIMIT') ??
			128,
		attributeValueLengthLimit: logRecordLimits.attributeValueLengthLimit ??
			getNumberFromEnv('OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT') ??
			getNumberFromEnv('OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT') ??
			Infinity,
	};
}

class MultiLogRecordProcessor {
	processors;
	forceFlushTimeoutMillis;
	constructor(processors, forceFlushTimeoutMillis) {
		this.processors = processors;
		this.forceFlushTimeoutMillis = forceFlushTimeoutMillis;
	}
	async forceFlush() {
		const timeout = this.forceFlushTimeoutMillis;
		await Promise.all(this.processors.map(processor => callWithTimeout(processor.forceFlush(), timeout)));
	}
	onEmit(logRecord, context) {
		this.processors.forEach(processors => processors.onEmit(logRecord, context));
	}
	async shutdown() {
		await Promise.all(this.processors.map(processor => processor.shutdown()));
	}
}

class NoopLogRecordProcessor {
	forceFlush() {
		return Promise.resolve();
	}
	onEmit(_logRecord, _context) { }
	shutdown() {
		return Promise.resolve();
	}
}

class LoggerProviderSharedState {
	resource;
	forceFlushTimeoutMillis;
	logRecordLimits;
	loggers = new Map();
	activeProcessor;
	registeredLogRecordProcessors = [];
	constructor(resource, forceFlushTimeoutMillis, logRecordLimits) {
		this.resource = resource;
		this.forceFlushTimeoutMillis = forceFlushTimeoutMillis;
		this.logRecordLimits = logRecordLimits;
		this.activeProcessor = new NoopLogRecordProcessor();
	}
}

const DEFAULT_LOGGER_NAME = 'unknown';
class LoggerProvider {
	_shutdownOnce;
	_sharedState;
	constructor(config = {}) {
		const mergedConfig = merge({}, loadDefaultConfig(), config);
		const resource = config.resource ?? defaultResource();
		this._sharedState = new LoggerProviderSharedState(resource, mergedConfig.forceFlushTimeoutMillis, reconfigureLimits(mergedConfig.logRecordLimits));
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
	}
	getLogger(name, version, options) {
		if (this._shutdownOnce.isCalled) {
			diag.warn('A shutdown LoggerProvider cannot provide a Logger');
			return NOOP_LOGGER;
		}
		if (!name) {
			diag.warn('Logger requested without instrumentation scope name.');
		}
		const loggerName = name || DEFAULT_LOGGER_NAME;
		const key = `${loggerName}@${version || ''}:${options?.schemaUrl || ''}`;
		if (!this._sharedState.loggers.has(key)) {
			this._sharedState.loggers.set(key, new Logger({ name: loggerName, version, schemaUrl: options?.schemaUrl }, this._sharedState));
		}
		return this._sharedState.loggers.get(key);
	}
	addLogRecordProcessor(processor) {
		if (this._sharedState.registeredLogRecordProcessors.length === 0) {
			this._sharedState.activeProcessor
				.shutdown()
				.catch(err => diag.error('Error while trying to shutdown current log record processor', err));
		}
		this._sharedState.registeredLogRecordProcessors.push(processor);
		this._sharedState.activeProcessor = new MultiLogRecordProcessor(this._sharedState.registeredLogRecordProcessors, this._sharedState.forceFlushTimeoutMillis);
	}
	forceFlush() {
		if (this._shutdownOnce.isCalled) {
			diag.warn('invalid attempt to force flush after LoggerProvider shutdown');
			return this._shutdownOnce.promise;
		}
		return this._sharedState.activeProcessor.forceFlush();
	}
	shutdown() {
		if (this._shutdownOnce.isCalled) {
			diag.warn('shutdown may only be called once per LoggerProvider');
			return this._shutdownOnce.promise;
		}
		return this._shutdownOnce.call();
	}
	_shutdown() {
		return this._sharedState.activeProcessor.shutdown();
	}
}

class ConsoleLogRecordExporter {
	export(logs, resultCallback) {
		this._sendLogRecords(logs, resultCallback);
	}
	shutdown() {
		return Promise.resolve();
	}
	_exportInfo(logRecord) {
		return {
			resource: {
				attributes: logRecord.resource.attributes,
			},
			instrumentationScope: logRecord.instrumentationScope,
			timestamp: hrTimeToMicroseconds(logRecord.hrTime),
			traceId: logRecord.spanContext?.traceId,
			spanId: logRecord.spanContext?.spanId,
			traceFlags: logRecord.spanContext?.traceFlags,
			severityText: logRecord.severityText,
			severityNumber: logRecord.severityNumber,
			body: logRecord.body,
			attributes: logRecord.attributes,
		};
	}
	_sendLogRecords(logRecords, done) {
		for (const logRecord of logRecords) {
			console.dir(this._exportInfo(logRecord), { depth: 3 });
		}
		done?.({ code: ExportResultCode.SUCCESS });
	}
}

class SimpleLogRecordProcessor {
	_exporter;
	_shutdownOnce;
	_unresolvedExports;
	constructor(_exporter) {
		this._exporter = _exporter;
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
		this._unresolvedExports = new Set();
	}
	onEmit(logRecord) {
		if (this._shutdownOnce.isCalled) {
			return;
		}
		const doExport = () => internal
			._export(this._exporter, [logRecord])
			.then((result) => {
			if (result.code !== ExportResultCode.SUCCESS) {
				globalErrorHandler(result.error ??
					new Error(`SimpleLogRecordProcessor: log record export failed (status ${result})`));
			}
		})
			.catch(globalErrorHandler);
		if (logRecord.resource.asyncAttributesPending) {
			const exportPromise = logRecord.resource
				.waitForAsyncAttributes?.()
				.then(() => {
				this._unresolvedExports.delete(exportPromise);
				return doExport();
			}, globalErrorHandler);
			if (exportPromise != null) {
				this._unresolvedExports.add(exportPromise);
			}
		}
		else {
			void doExport();
		}
	}
	async forceFlush() {
		await Promise.all(Array.from(this._unresolvedExports));
	}
	shutdown() {
		return this._shutdownOnce.call();
	}
	_shutdown() {
		return this._exporter.shutdown();
	}
}

class InMemoryLogRecordExporter {
	_finishedLogRecords = [];
	_stopped = false;
	export(logs, resultCallback) {
		if (this._stopped) {
			return resultCallback({
				code: ExportResultCode.FAILED,
				error: new Error('Exporter has been stopped'),
			});
		}
		this._finishedLogRecords.push(...logs);
		resultCallback({ code: ExportResultCode.SUCCESS });
	}
	shutdown() {
		this._stopped = true;
		this.reset();
		return Promise.resolve();
	}
	getFinishedLogRecords() {
		return this._finishedLogRecords;
	}
	reset() {
		this._finishedLogRecords = [];
	}
}

class BatchLogRecordProcessorBase {
	_exporter;
	_maxExportBatchSize;
	_maxQueueSize;
	_scheduledDelayMillis;
	_exportTimeoutMillis;
	_finishedLogRecords = [];
	_timer;
	_shutdownOnce;
	constructor(_exporter, config) {
		this._exporter = _exporter;
		this._maxExportBatchSize =
			config?.maxExportBatchSize ??
				getNumberFromEnv('OTEL_BLRP_MAX_EXPORT_BATCH_SIZE') ??
				512;
		this._maxQueueSize =
			config?.maxQueueSize ??
				getNumberFromEnv('OTEL_BLRP_MAX_QUEUE_SIZE') ??
				2048;
		this._scheduledDelayMillis =
			config?.scheduledDelayMillis ??
				getNumberFromEnv('OTEL_BLRP_SCHEDULE_DELAY') ??
				5000;
		this._exportTimeoutMillis =
			config?.exportTimeoutMillis ??
				getNumberFromEnv('OTEL_BLRP_EXPORT_TIMEOUT') ??
				30000;
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
		if (this._maxExportBatchSize > this._maxQueueSize) {
			diag.warn('BatchLogRecordProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize');
			this._maxExportBatchSize = this._maxQueueSize;
		}
	}
	onEmit(logRecord) {
		if (this._shutdownOnce.isCalled) {
			return;
		}
		this._addToBuffer(logRecord);
	}
	forceFlush() {
		if (this._shutdownOnce.isCalled) {
			return this._shutdownOnce.promise;
		}
		return this._flushAll();
	}
	shutdown() {
		return this._shutdownOnce.call();
	}
	async _shutdown() {
		this.onShutdown();
		await this._flushAll();
		await this._exporter.shutdown();
	}
	_addToBuffer(logRecord) {
		if (this._finishedLogRecords.length >= this._maxQueueSize) {
			return;
		}
		this._finishedLogRecords.push(logRecord);
		this._maybeStartTimer();
	}
	_flushAll() {
		return new Promise((resolve, reject) => {
			const promises = [];
			const batchCount = Math.ceil(this._finishedLogRecords.length / this._maxExportBatchSize);
			for (let i = 0; i < batchCount; i++) {
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
		if (this._finishedLogRecords.length === 0) {
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			callWithTimeout(this._export(this._finishedLogRecords.splice(0, this._maxExportBatchSize)), this._exportTimeoutMillis)
				.then(() => resolve())
				.catch(reject);
		});
	}
	_maybeStartTimer() {
		if (this._timer !== undefined) {
			return;
		}
		this._timer = setTimeout(() => {
			this._flushOneBatch()
				.then(() => {
				if (this._finishedLogRecords.length > 0) {
					this._clearTimer();
					this._maybeStartTimer();
				}
			})
				.catch(e => {
				globalErrorHandler(e);
			});
		}, this._scheduledDelayMillis);
		unrefTimer(this._timer);
	}
	_clearTimer() {
		if (this._timer !== undefined) {
			clearTimeout(this._timer);
			this._timer = undefined;
		}
	}
	_export(logRecords) {
		const doExport = () => internal
			._export(this._exporter, logRecords)
			.then((result) => {
			if (result.code !== ExportResultCode.SUCCESS) {
				globalErrorHandler(result.error ??
					new Error(`BatchLogRecordProcessor: log record export failed (status ${result})`));
			}
		})
			.catch(globalErrorHandler);
		const pendingResources = logRecords
			.map(logRecord => logRecord.resource)
			.filter(resource => resource.asyncAttributesPending);
		if (pendingResources.length === 0) {
			return doExport();
		}
		else {
			return Promise.all(pendingResources.map(resource => resource.waitForAsyncAttributes?.())).then(doExport, globalErrorHandler);
		}
	}
}

class BatchLogRecordProcessor extends BatchLogRecordProcessorBase {
	onShutdown() { }
}

export { BatchLogRecordProcessor, ConsoleLogRecordExporter, InMemoryLogRecordExporter, LogRecord, LoggerProvider, NoopLogRecordProcessor, SimpleLogRecordProcessor };
