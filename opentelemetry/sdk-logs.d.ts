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

import { IResource } from './resources.js';
import * as logsAPI from './api-logs.js';
import { SeverityNumber } from './api-logs.js';
import * as api from './api.js';
import { HrTime, SpanContext, Attributes, AttributeValue, Context } from './api.js';
import { InstrumentationScope, ExportResult } from './core.js';

interface LoggerProviderConfig {
	/** Resource associated with trace telemetry  */
	resource?: IResource;
	/**
	* How long the forceFlush can run before it is cancelled.
	* The default value is 30000ms
	*/
	forceFlushTimeoutMillis?: number;
	/** Log Record Limits*/
	logRecordLimits?: LogRecordLimits;
}
interface LoggerConfig {
	/** Log Record Limits*/
	logRecordLimits?: LogRecordLimits;
	/** include Trace Context */
	includeTraceContext?: boolean;
}
interface LogRecordLimits {
	/** attributeValueLengthLimit is maximum allowed attribute value size */
	attributeValueLengthLimit?: number;
	/** attributeCountLimit is number of attributes per LogRecord */
	attributeCountLimit?: number;
}
/** Interface configuration for a buffer. */
interface BufferConfig {
	/** The maximum batch size of every export. It must be smaller or equal to
	* maxQueueSize. The default value is 512. */
	maxExportBatchSize?: number;
	/** The delay interval in milliseconds between two consecutive exports.
	*  The default value is 5000ms. */
	scheduledDelayMillis?: number;
	/** How long the export can run before it is cancelled.
	* The default value is 30000ms */
	exportTimeoutMillis?: number;
	/** The maximum queue size. After the size is reached log records are dropped.
	* The default value is 2048. */
	maxQueueSize?: number;
}
interface BatchLogRecordProcessorBrowserConfig extends BufferConfig {
	/** Disable flush when a user navigates to a new page, closes the tab or the browser, or,
	* on mobile, switches to a different app. Auto flush is enabled by default. */
	disableAutoFlushOnDocumentHide?: boolean;
}

interface ReadableLogRecord {
	readonly hrTime: HrTime;
	readonly spanContext?: SpanContext;
	readonly severityText?: string;
	readonly severityNumber?: SeverityNumber;
	readonly body?: string;
	readonly resource: IResource;
	readonly instrumentationScope: InstrumentationScope;
	readonly attributes: Attributes;
}

declare class Logger implements logsAPI.Logger {
	readonly instrumentationScope: InstrumentationScope;
	private _loggerProvider;
	readonly resource: IResource;
	private readonly _loggerConfig;
	constructor(instrumentationScope: InstrumentationScope, config: LoggerConfig, _loggerProvider: LoggerProvider);
	emit(logRecord: logsAPI.LogRecord): void;
	getLogRecordLimits(): LogRecordLimits;
	getActiveLogRecordProcessor(): LogRecordProcessor;
}

declare class LogRecord implements ReadableLogRecord {
	readonly hrTime: api.HrTime;
	readonly spanContext?: api.SpanContext;
	readonly resource: IResource;
	readonly instrumentationScope: InstrumentationScope;
	readonly attributes: Attributes;
	private _severityText?;
	private _severityNumber?;
	private _body?;
	private _isReadonly;
	private readonly _logRecordLimits;
	set severityText(severityText: string | undefined);
	get severityText(): string | undefined;
	set severityNumber(severityNumber: logsAPI.SeverityNumber | undefined);
	get severityNumber(): logsAPI.SeverityNumber | undefined;
	set body(body: string | undefined);
	get body(): string | undefined;
	constructor(logger: Logger, logRecord: logsAPI.LogRecord);
	setAttribute(key: string, value?: AttributeValue): this;
	setAttributes(attributes: Attributes): this;
	setBody(body: string): this;
	setSeverityNumber(severityNumber: logsAPI.SeverityNumber): this;
	setSeverityText(severityText: string): this;
	/**
	* A LogRecordProcessor may freely modify logRecord for the duration of the OnEmit call.
	* If logRecord is needed after OnEmit returns (i.e. for asynchronous processing) only reads are permitted.
	*/
	makeReadonly(): void;
	private _truncateToSize;
	private _truncateToLimitUtil;
	private _isLogRecordReadonly;
}

interface LogRecordProcessor {
	/**
	* Forces to export all finished log records
	*/
	forceFlush(): Promise<void>;
	/**
	* Called when a {@link LogRecord} is emit
	* @param logRecord the ReadWriteLogRecord that just emitted.
	* @param context the current Context, or an empty Context if the Logger was obtained with include_trace_context=false
	*/
	onEmit(logRecord: LogRecord, context?: Context): void;
	/**
	* Shuts down the processor. Called when SDK is shut down. This is an
	* opportunity for processor to do any cleanup required.
	*/
	shutdown(): Promise<void>;
}

/**
 * Implementation of the {@link LogRecordProcessor} that simply forwards all
 * received events to a list of {@link LogRecordProcessor}s.
 */
declare class MultiLogRecordProcessor implements LogRecordProcessor {
	readonly processors: LogRecordProcessor[];
	readonly forceFlushTimeoutMillis: number;
	constructor(processors: LogRecordProcessor[], forceFlushTimeoutMillis: number);
	forceFlush(): Promise<void>;
	onEmit(logRecord: LogRecord): void;
	shutdown(): Promise<void>;
}

declare class LoggerProvider implements logsAPI.LoggerProvider {
	readonly resource: IResource;
	private readonly _loggers;
	private _activeProcessor;
	private readonly _registeredLogRecordProcessors;
	private readonly _config;
	private _shutdownOnce;
	constructor(config?: LoggerProviderConfig);
	/**
	* Get a logger with the configuration of the LoggerProvider.
	*/
	getLogger(name: string, version?: string, options?: logsAPI.LoggerOptions): logsAPI.Logger;
	/**
	* Adds a new {@link LogRecordProcessor} to this logger.
	* @param processor the new LogRecordProcessor to be added.
	*/
	addLogRecordProcessor(processor: LogRecordProcessor): void;
	/**
	* Notifies all registered LogRecordProcessor to flush any buffered data.
	*
	* Returns a promise which is resolved when all flushes are complete.
	*/
	forceFlush(): Promise<void>;
	/**
	* Flush all buffered data and shut down the LoggerProvider and all registered
	* LogRecordProcessor.
	*
	* Returns a promise which is resolved when all flushes are complete.
	*/
	shutdown(): Promise<void>;
	getActiveLogRecordProcessor(): MultiLogRecordProcessor;
	getActiveLoggers(): Map<string, Logger>;
	private _shutdown;
}

declare class NoopLogRecordProcessor implements LogRecordProcessor {
	forceFlush(): Promise<void>;
	onEmit(_logRecord: ReadableLogRecord): void;
	shutdown(): Promise<void>;
}

interface LogRecordExporter {
	/**
	* Called to export {@link ReadableLogRecord}s.
	* @param logs the list of sampled LogRecords to be exported.
	*/
	export(logs: ReadableLogRecord[], resultCallback: (result: ExportResult) => void): void;
	/** Stops the exporter. */
	shutdown(): Promise<void>;
}

/**
 * This is implementation of {@link LogRecordExporter} that prints LogRecords to the
 * console. This class can be used for diagnostic purposes.
 */
declare class ConsoleLogRecordExporter implements LogRecordExporter {
	/**
	* Export logs.
	* @param logs
	* @param resultCallback
	*/
	export(logs: ReadableLogRecord[], resultCallback: (result: ExportResult) => void): void;
	/**
	* Shutdown the exporter.
	*/
	shutdown(): Promise<void>;
	/**
	* converts logRecord info into more readable format
	* @param logRecord
	*/
	private _exportInfo;
	/**
	* Showing logs  in console
	* @param logRecords
	* @param done
	*/
	private _sendLogRecords;
}

declare class SimpleLogRecordProcessor implements LogRecordProcessor {
	private readonly _exporter;
	private _shutdownOnce;
	constructor(_exporter: LogRecordExporter);
	onEmit(logRecord: LogRecord): void;
	forceFlush(): Promise<void>;
	shutdown(): Promise<void>;
	private _shutdown;
}

/**
 * This class can be used for testing purposes. It stores the exported LogRecords
 * in a list in memory that can be retrieved using the `getFinishedLogRecords()`
 * method.
 */
declare class InMemoryLogRecordExporter implements LogRecordExporter {
	private _finishedLogRecords;
	/**
	* Indicates if the exporter has been "shutdown."
	* When false, exported log records will not be stored in-memory.
	*/
	protected _stopped: boolean;
	export(logs: ReadableLogRecord[], resultCallback: (result: ExportResult) => void): void;
	shutdown(): Promise<void>;
	getFinishedLogRecords(): ReadableLogRecord[];
	reset(): void;
}

declare abstract class BatchLogRecordProcessorBase<T extends BufferConfig> implements LogRecordProcessor {
	private readonly _exporter;
	private readonly _maxExportBatchSize;
	private readonly _maxQueueSize;
	private readonly _scheduledDelayMillis;
	private readonly _exportTimeoutMillis;
	private _finishedLogRecords;
	private _timer;
	private _shutdownOnce;
	constructor(_exporter: LogRecordExporter, config?: T);
	onEmit(logRecord: LogRecord): void;
	forceFlush(): Promise<void>;
	shutdown(): Promise<void>;
	private _shutdown;
	/** Add a LogRecord in the buffer. */
	private _addToBuffer;
	/**
	* Send all LogRecords to the exporter respecting the batch size limit
	* This function is used only on forceFlush or shutdown,
	* for all other cases _flush should be used
	* */
	private _flushAll;
	private _flushOneBatch;
	private _maybeStartTimer;
	private _clearTimer;
	private _export;
	protected abstract onShutdown(): void;
}

declare class BatchLogRecordProcessor extends BatchLogRecordProcessorBase<BufferConfig> {
	protected onShutdown(): void;
}

export { BatchLogRecordProcessor, BatchLogRecordProcessorBrowserConfig, BufferConfig, ConsoleLogRecordExporter, InMemoryLogRecordExporter, LogRecord, LogRecordExporter, LogRecordLimits, LogRecordProcessor, Logger, LoggerConfig, LoggerProvider, NoopLogRecordProcessor, ReadableLogRecord, SimpleLogRecordProcessor };
