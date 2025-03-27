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

import { TimeInput, Context, Attributes } from './api.d.ts';

type AnyValueScalar = string | number | boolean;
type AnyValueArray = Array<AnyValue>;
/**
 * AnyValueMap is a map from string to AnyValue (attribute value or a nested map)
 */
interface AnyValueMap {
	[attributeKey: string]: AnyValue;
}
/**
 * AnyValue can be one of the following:
 * - a scalar value
 * - a byte array
 * - array of any value
 * - map from string to any value
 * - empty value
 */
type AnyValue = AnyValueScalar | Uint8Array | AnyValueArray | AnyValueMap | null | undefined;

type LogBody = AnyValue;
type LogAttributes = AnyValueMap;
declare enum SeverityNumber {
	UNSPECIFIED = 0,
	TRACE = 1,
	TRACE2 = 2,
	TRACE3 = 3,
	TRACE4 = 4,
	DEBUG = 5,
	DEBUG2 = 6,
	DEBUG3 = 7,
	DEBUG4 = 8,
	INFO = 9,
	INFO2 = 10,
	INFO3 = 11,
	INFO4 = 12,
	WARN = 13,
	WARN2 = 14,
	WARN3 = 15,
	WARN4 = 16,
	ERROR = 17,
	ERROR2 = 18,
	ERROR3 = 19,
	ERROR4 = 20,
	FATAL = 21,
	FATAL2 = 22,
	FATAL3 = 23,
	FATAL4 = 24
}
interface LogRecord {
	/**
	* The time when the log record occurred as UNIX Epoch time in nanoseconds.
	*/
	timestamp?: TimeInput;
	/**
	* Time when the event was observed by the collection system.
	*/
	observedTimestamp?: TimeInput;
	/**
	* Numerical value of the severity.
	*/
	severityNumber?: SeverityNumber;
	/**
	* The severity text.
	*/
	severityText?: string;
	/**
	* A value containing the body of the log record.
	*/
	body?: LogBody;
	/**
	* Attributes that define the log record.
	*/
	attributes?: LogAttributes;
	/**
	* The Context associated with the LogRecord.
	*/
	context?: Context;
}

interface Logger {
	/**
	* Emit a log record. This method should only be used by log appenders.
	*
	* @param logRecord
	*/
	emit(logRecord: LogRecord): void;
}

interface LoggerOptions {
	/**
	* The schemaUrl of the tracer or instrumentation library
	* @default ''
	*/
	schemaUrl?: string;
	/**
	* The instrumentation scope attributes to associate with emitted telemetry
	*/
	scopeAttributes?: Attributes;
	/**
	* Specifies whether the Trace Context should automatically be passed on to the LogRecords emitted by the Logger.
	* @default true
	*/
	includeTraceContext?: boolean;
}

/**
 * A registry for creating named {@link Logger}s.
 */
interface LoggerProvider {
	/**
	* Returns a Logger, creating one if one with the given name, version, and
	* schemaUrl pair is not already created.
	*
	* @param name The name of the logger or instrumentation library.
	* @param version The version of the logger or instrumentation library.
	* @param options The options of the logger or instrumentation library.
	* @returns Logger A Logger with the given name and version
	*/
	getLogger(name: string, version?: string, options?: LoggerOptions): Logger;
}

declare class NoopLogger implements Logger {
	emit(_logRecord: LogRecord): void;
}
declare const NOOP_LOGGER: NoopLogger;

declare class NoopLoggerProvider implements LoggerProvider {
	getLogger(_name: string, _version?: string | undefined, _options?: LoggerOptions | undefined): Logger;
}
declare const NOOP_LOGGER_PROVIDER: NoopLoggerProvider;

declare class ProxyLogger implements Logger {
	private _provider;
	readonly name: string;
	readonly version?: string | undefined;
	readonly options?: LoggerOptions | undefined;
	private _delegate?;
	constructor(_provider: LoggerDelegator, name: string, version?: string | undefined, options?: LoggerOptions | undefined);
	/**
	* Emit a log record. This method should only be used by log appenders.
	*
	* @param logRecord
	*/
	emit(logRecord: LogRecord): void;
	/**
	* Try to get a logger from the proxy logger provider.
	* If the proxy logger provider has no delegate, return a noop logger.
	*/
	private _getLogger;
}
interface LoggerDelegator {
	getDelegateLogger(name: string, version?: string, options?: LoggerOptions): Logger | undefined;
}

declare class ProxyLoggerProvider implements LoggerProvider {
	private _delegate?;
	getLogger(name: string, version?: string | undefined, options?: LoggerOptions | undefined): Logger;
	getDelegate(): LoggerProvider;
	/**
	* Set the delegate logger provider
	*/
	setDelegate(delegate: LoggerProvider): void;
	getDelegateLogger(name: string, version?: string | undefined, options?: LoggerOptions | undefined): Logger | undefined;
}

declare class LogsAPI {
	private static _instance?;
	private _proxyLoggerProvider;
	private constructor();
	static getInstance(): LogsAPI;
	setGlobalLoggerProvider(provider: LoggerProvider): LoggerProvider;
	/**
	* Returns the global logger provider.
	*
	* @returns LoggerProvider
	*/
	getLoggerProvider(): LoggerProvider;
	/**
	* Returns a logger from the global logger provider.
	*
	* @returns Logger
	*/
	getLogger(name: string, version?: string, options?: LoggerOptions): Logger;
	/** Remove the global logger provider */
	disable(): void;
}

declare const logs: LogsAPI;

export { AnyValue, AnyValueMap, LogAttributes, LogBody, LogRecord, Logger, LoggerOptions, LoggerProvider, NOOP_LOGGER, NOOP_LOGGER_PROVIDER, NoopLogger, NoopLoggerProvider, ProxyLogger, ProxyLoggerProvider, SeverityNumber, logs };
