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
import { Resource } from './resources.js';
import { timeInputToHrTime, isAttributeValue, getEnv, getEnvWithoutDefaults, DEFAULT_ATTRIBUTE_COUNT_LIMIT, DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, callWithTimeout, merge, BindOnceFuture, hrTimeToMicroseconds, ExportResultCode, globalErrorHandler, unrefTimer } from './core.js';

class LogRecord {
	constructor(logger, logRecord) {
		this.attributes = {};
		this._isReadonly = false;
		const { timestamp = Date.now(), severityNumber, severityText, body, attributes = {}, context, } = logRecord;
		this.hrTime = timeInputToHrTime(timestamp);
		if (context) {
			const spanContext = api.trace.getSpanContext(context);
			if (spanContext && api.isSpanContextValid(spanContext)) {
				this.spanContext = spanContext;
			}
		}
		this.severityNumber = severityNumber;
		this.severityText = severityText;
		this.body = body;
		this.resource = logger.resource;
		this.instrumentationScope = logger.instrumentationScope;
		this._logRecordLimits = logger.getLogRecordLimits();
		this.setAttributes(attributes);
	}
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
		if (!isAttributeValue(value)) {
			api.diag.warn(`Invalid attribute value set for key: ${key}`);
			return this;
		}
		if (Object.keys(this.attributes).length >=
			this._logRecordLimits.attributeCountLimit &&
			!Object.prototype.hasOwnProperty.call(this.attributes, key)) {
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
	makeReadonly() {
		this._isReadonly = true;
	}
	_truncateToSize(value) {
		const limit = this._logRecordLimits.attributeValueLengthLimit || 0;
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

function loadDefaultConfig() {
	return {
		forceFlushTimeoutMillis: 30000,
		logRecordLimits: {
			attributeValueLengthLimit: getEnv().OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT,
			attributeCountLimit: getEnv().OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT,
		},
		includeTraceContext: true,
	};
}
function reconfigureLimits(userConfig) {
	const logRecordLimits = Object.assign({}, userConfig.logRecordLimits);
	const parsedEnvConfig = getEnvWithoutDefaults();
	logRecordLimits.attributeCountLimit =
		userConfig.logRecordLimits?.attributeCountLimit ??
			parsedEnvConfig.OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT ??
			parsedEnvConfig.OTEL_ATTRIBUTE_COUNT_LIMIT ??
			DEFAULT_ATTRIBUTE_COUNT_LIMIT;
	logRecordLimits.attributeValueLengthLimit =
		userConfig.logRecordLimits?.attributeValueLengthLimit ??
			parsedEnvConfig.OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT ??
			parsedEnvConfig.OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT ??
			DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT;
	return Object.assign({}, userConfig, { logRecordLimits });
}
function mergeConfig(userConfig) {
	const DEFAULT_CONFIG = loadDefaultConfig();
	const target = Object.assign({}, DEFAULT_CONFIG, userConfig);
	target.logRecordLimits = Object.assign({}, DEFAULT_CONFIG.logRecordLimits, userConfig.logRecordLimits || {});
	return target;
}

class Logger {
	constructor(instrumentationScope, config, _loggerProvider) {
		this.instrumentationScope = instrumentationScope;
		this._loggerProvider = _loggerProvider;
		this._loggerConfig = mergeConfig(config);
		this.resource = _loggerProvider.resource;
	}
	emit(logRecord) {
		const currentContext = this._loggerConfig.includeTraceContext
			? context.active()
			: undefined;
		const logRecordInstance = new LogRecord(this, {
			context: currentContext,
			...logRecord,
		});
		this.getActiveLogRecordProcessor().onEmit(logRecordInstance, currentContext);
		logRecordInstance.makeReadonly();
	}
	getLogRecordLimits() {
		return this._loggerConfig.logRecordLimits;
	}
	getActiveLogRecordProcessor() {
		return this._loggerProvider.getActiveLogRecordProcessor();
	}
}

class MultiLogRecordProcessor {
	constructor(processors, forceFlushTimeoutMillis) {
		this.processors = processors;
		this.forceFlushTimeoutMillis = forceFlushTimeoutMillis;
	}
	async forceFlush() {
		const timeout = this.forceFlushTimeoutMillis;
		await Promise.all(this.processors.map(processor => callWithTimeout(processor.forceFlush(), timeout)));
	}
	onEmit(logRecord) {
		this.processors.forEach(processors => processors.onEmit(logRecord));
	}
	async shutdown() {
		await Promise.all(this.processors.map(processor => processor.shutdown()));
	}
}

class NoopLogRecordProcessor {
	forceFlush() {
		return Promise.resolve();
	}
	onEmit(_logRecord) { }
	shutdown() {
		return Promise.resolve();
	}
}

const DEFAULT_LOGGER_NAME = 'unknown';
class LoggerProvider {
	constructor(config = {}) {
		this._loggers = new Map();
		this._registeredLogRecordProcessors = [];
		const { resource = Resource.empty(), logRecordLimits, forceFlushTimeoutMillis, } = merge({}, loadDefaultConfig(), reconfigureLimits(config));
		this.resource = Resource.default().merge(resource);
		this._config = {
			logRecordLimits,
			resource: this.resource,
			forceFlushTimeoutMillis,
		};
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
		this._activeProcessor = new MultiLogRecordProcessor([new NoopLogRecordProcessor()], forceFlushTimeoutMillis);
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
		if (!this._loggers.has(key)) {
			this._loggers.set(key, new Logger({ name: loggerName, version, schemaUrl: options?.schemaUrl }, {
				logRecordLimits: this._config.logRecordLimits,
				includeTraceContext: options?.includeTraceContext,
			}, this));
		}
		return this._loggers.get(key);
	}
	addLogRecordProcessor(processor) {
		if (this._registeredLogRecordProcessors.length === 0) {
			this._activeProcessor
				.shutdown()
				.catch(err => diag.error('Error while trying to shutdown current log record processor', err));
		}
		this._registeredLogRecordProcessors.push(processor);
		this._activeProcessor = new MultiLogRecordProcessor(this._registeredLogRecordProcessors, this._config.forceFlushTimeoutMillis);
	}
	forceFlush() {
		if (this._shutdownOnce.isCalled) {
			diag.warn('invalid attempt to force flush after LoggerProvider shutdown');
			return this._shutdownOnce.promise;
		}
		return this._activeProcessor.forceFlush();
	}
	shutdown() {
		if (this._shutdownOnce.isCalled) {
			diag.warn('shutdown may only be called once per LoggerProvider');
			return this._shutdownOnce.promise;
		}
		return this._shutdownOnce.call();
	}
	getActiveLogRecordProcessor() {
		return this._activeProcessor;
	}
	getActiveLoggers() {
		return this._loggers;
	}
	_shutdown() {
		return this._activeProcessor.shutdown();
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
	constructor(_exporter) {
		this._exporter = _exporter;
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
	}
	onEmit(logRecord) {
		if (this._shutdownOnce.isCalled) {
			return;
		}
		this._exporter.export([logRecord], (res) => {
			if (res.code !== ExportResultCode.SUCCESS) {
				globalErrorHandler(res.error ??
					new Error(`SimpleLogRecordProcessor: log record export failed (status ${res})`));
				return;
			}
		});
	}
	forceFlush() {
		return Promise.resolve();
	}
	shutdown() {
		return this._shutdownOnce.call();
	}
	_shutdown() {
		return this._exporter.shutdown();
	}
}

class InMemoryLogRecordExporter {
	constructor() {
		this._finishedLogRecords = [];
		this._stopped = false;
	}
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
	constructor(_exporter, config) {
		this._exporter = _exporter;
		this._finishedLogRecords = [];
		const env = getEnv();
		this._maxExportBatchSize =
			config?.maxExportBatchSize ?? env.OTEL_BLRP_MAX_EXPORT_BATCH_SIZE;
		this._maxQueueSize = config?.maxQueueSize ?? env.OTEL_BLRP_MAX_QUEUE_SIZE;
		this._scheduledDelayMillis =
			config?.scheduledDelayMillis ?? env.OTEL_BLRP_SCHEDULE_DELAY;
		this._exportTimeoutMillis =
			config?.exportTimeoutMillis ?? env.OTEL_BLRP_EXPORT_TIMEOUT;
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
		return new Promise((resolve, reject) => {
			this._exporter.export(logRecords, (res) => {
				if (res.code !== ExportResultCode.SUCCESS) {
					reject(res.error ??
						new Error(`BatchLogRecordProcessorBase: log record export failed (status ${res})`));
					return;
				}
				resolve(res);
			});
		});
	}
}

class BatchLogRecordProcessor extends BatchLogRecordProcessorBase {
	onShutdown() { }
}

export { BatchLogRecordProcessor, ConsoleLogRecordExporter, InMemoryLogRecordExporter, LogRecord, Logger, LoggerProvider, NoopLogRecordProcessor, SimpleLogRecordProcessor };
