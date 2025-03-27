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

import * as api from './api.d.ts';
import { TextMapPropagator, Context, TextMapSetter, TextMapGetter, Attributes, AttributeValue, Exception, SpanContext, Span, DiagLogLevel } from './api.d.ts';

/**
 * Propagates {@link Baggage} through Context format propagation.
 *
 * Based on the Baggage specification:
 * https://w3c.github.io/baggage/
 */
declare class W3CBaggagePropagator implements TextMapPropagator {
	inject(context: Context, carrier: unknown, setter: TextMapSetter): void;
	extract(context: Context, carrier: unknown, getter: TextMapGetter): Context;
	fields(): string[];
}

interface Clock {
	/**
	* Return the current time in milliseconds from some epoch such as the Unix epoch or process start
	*/
	now(): number;
}
/**
 * A utility for returning wall times anchored to a given point in time. Wall time measurements will
 * not be taken from the system, but instead are computed by adding a monotonic clock time
 * to the anchor point.
 *
 * This is needed because the system time can change and result in unexpected situations like
 * spans ending before they are started. Creating an anchored clock for each local root span
 * ensures that span timings and durations are accurate while preventing span times from drifting
 * too far from the system clock.
 *
 * Only creating an anchored clock once per local trace ensures span times are correct relative
 * to each other. For example, a child span will never have a start time before its parent even
 * if the system clock is corrected during the local trace.
 *
 * Heavily inspired by the OTel Java anchored clock
 * https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk/trace/src/main/java/io/opentelemetry/sdk/trace/AnchoredClock.java
 */
declare class AnchoredClock implements Clock {
	private _monotonicClock;
	private _epochMillis;
	private _performanceMillis;
	/**
	* Create a new AnchoredClock anchored to the current time returned by systemClock.
	*
	* @param systemClock should be a clock that returns the number of milliseconds since January 1 1970 such as Date
	* @param monotonicClock should be a clock that counts milliseconds monotonically such as window.performance or perf_hooks.performance
	*/
	constructor(systemClock: Clock, monotonicClock: Clock);
	/**
	* Returns the current time by adding the number of milliseconds since the
	* AnchoredClock was created to the creation epoch time
	*/
	now(): number;
}

declare function sanitizeAttributes(attributes: unknown): Attributes;
declare function isAttributeValue(val: unknown): val is AttributeValue;

/**
 * An instrumentation scope consists of the name and optional version
 * used to obtain a tracer or meter from a provider. This metadata is made
 * available on ReadableSpan and MetricRecord for use by the export pipeline.
 */
interface InstrumentationScope {
	readonly name: string;
	readonly version?: string;
	readonly schemaUrl?: string;
}
/** Defines an error handler function */
type ErrorHandler = (ex: Exception) => void;

/**
 * Set the global error handler
 * @param {ErrorHandler} handler
 */
declare function setGlobalErrorHandler(handler: ErrorHandler): void;
/**
 * Return the global error handler
 * @param {Exception} ex
 */
declare function globalErrorHandler(ex: Exception): void;

/**
 * Returns a function that logs an error using the provided logger, or a
 * console logger if one was not provided.
 */
declare function loggingErrorHandler(): ErrorHandler;

/**
 * Converts a number of milliseconds from epoch to HrTime([seconds, remainder in nanoseconds]).
 * @param epochMillis
 */
declare function millisToHrTime(epochMillis: number): api.HrTime;
declare function getTimeOrigin(): number;
/**
 * Returns an hrtime calculated via performance component.
 * @param performanceNow
 */
declare function hrTime(performanceNow?: number): api.HrTime;
/**
 *
 * Converts a TimeInput to an HrTime, defaults to _hrtime().
 * @param time
 */
declare function timeInputToHrTime(time: api.TimeInput): api.HrTime;
/**
 * Returns a duration of two hrTime.
 * @param startTime
 * @param endTime
 */
declare function hrTimeDuration(startTime: api.HrTime, endTime: api.HrTime): api.HrTime;
/**
 * Convert hrTime to timestamp, for example "2019-05-14T17:00:00.000123456Z"
 * @param time
 */
declare function hrTimeToTimeStamp(time: api.HrTime): string;
/**
 * Convert hrTime to nanoseconds.
 * @param time
 */
declare function hrTimeToNanoseconds(time: api.HrTime): number;
/**
 * Convert hrTime to milliseconds.
 * @param time
 */
declare function hrTimeToMilliseconds(time: api.HrTime): number;
/**
 * Convert hrTime to microseconds.
 * @param time
 */
declare function hrTimeToMicroseconds(time: api.HrTime): number;
/**
 * check if time is HrTime
 * @param value
 */
declare function isTimeInputHrTime(value: unknown): value is api.HrTime;
/**
 * check if input value is a correct types.TimeInput
 * @param value
 */
declare function isTimeInput(value: unknown): value is api.HrTime | number | Date;
/**
 * Given 2 HrTime formatted times, return their sum as an HrTime.
 */
declare function addHrTimes(time1: api.HrTime, time2: api.HrTime): api.HrTime;

interface ExportResult {
	code: ExportResultCode;
	error?: Error;
}
declare enum ExportResultCode {
	SUCCESS = 0,
	FAILED = 1
}

/**
 * Parse a string serialized in the baggage HTTP Format (without metadata):
 * https://github.com/w3c/baggage/blob/master/baggage/HTTP_HEADER_FORMAT.md
 */
declare function parseKeyPairsIntoRecord(value?: string): Record<string, string>;

/**
 * Retrieves a number from an environment variable.
 * - Returns `undefined` if the environment variable is empty, unset, contains only whitespace, or is not a number.
 * - Returns a number in all other cases.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @returns {number | undefined} - The number value or `undefined`.
 */
declare function getNumberFromEnv(key: string): number | undefined;
/**
 * Retrieves a string from an environment variable.
 * - Returns `undefined` if the environment variable is empty, unset, or contains only whitespace.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @returns {string | undefined} - The string value or `undefined`.
 */
declare function getStringFromEnv(key: string): string | undefined;
/**
 * Retrieves a boolean value from an environment variable.
 * - Trims leading and trailing whitespace and ignores casing.
 * - Returns `false` if the environment variable is empty, unset, or contains only whitespace.
 * - Returns `false` for strings that cannot be mapped to a boolean.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @returns {boolean} - The boolean value or `false` if the environment variable is unset empty, unset, or contains only whitespace.
 */
declare function getBooleanFromEnv(key: string): boolean;
/**
 * Retrieves a list of strings from an environment variable.
 * - Uses ',' as the delimiter.
 * - Trims leading and trailing whitespace from each entry.
 * - Excludes empty entries.
 * - Returns `undefined` if the environment variable is empty or contains only whitespace.
 * - Returns an empty array if all entries are empty or whitespace.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @returns {string[] | undefined} - The list of strings or `undefined`.
 */
declare function getStringListFromEnv(key: string): string[] | undefined;

/** only globals that common to node and browsers are allowed */
declare const _globalThis: typeof globalThis;

declare const otperformance: Performance;

/** Constants describing the SDK in use */
declare const SDK_INFO: {
	"telemetry.sdk.name": string;
	"process.runtime.name": string;
	"telemetry.sdk.language": string;
	"telemetry.sdk.version": string;
};

declare function unrefTimer(timer: any): void;

/** Configuration object for composite propagator */
interface CompositePropagatorConfig {
	/**
	* List of propagators to run. Propagators run in the
	* list order. If a propagator later in the list writes the same context
	* key as a propagator earlier in the list, the later on will "win".
	*/
	propagators?: TextMapPropagator[];
}
/** Combines multiple propagators into a single propagator. */
declare class CompositePropagator implements TextMapPropagator {
	private readonly _propagators;
	private readonly _fields;
	/**
	* Construct a composite propagator from a list of propagators.
	*
	* @param [config] Configuration object for composite propagator
	*/
	constructor(config?: CompositePropagatorConfig);
	/**
	* Run each of the configured propagators with the given context and carrier.
	* Propagators are run in the order they are configured, so if multiple
	* propagators write the same carrier key, the propagator later in the list
	* will "win".
	*
	* @param context Context to inject
	* @param carrier Carrier into which context will be injected
	*/
	inject(context: Context, carrier: unknown, setter: TextMapSetter): void;
	/**
	* Run each of the configured propagators with the given context and carrier.
	* Propagators are run in the order they are configured, so if multiple
	* propagators write the same context key, the propagator later in the list
	* will "win".
	*
	* @param context Context to add values to
	* @param carrier Carrier from which to extract context
	*/
	extract(context: Context, carrier: unknown, getter: TextMapGetter): Context;
	fields(): string[];
}

declare const TRACE_PARENT_HEADER = "traceparent";
declare const TRACE_STATE_HEADER = "tracestate";
/**
 * Parses information from the [traceparent] span tag and converts it into {@link SpanContext}
 * @param traceParent - A meta property that comes from server.
 *     It should be dynamically generated server side to have the server's request trace Id,
 *     a parent span Id that was set on the server's request span,
 *     and the trace flags to indicate the server's sampling decision
 *     (01 = sampled, 00 = not sampled).
 *     for example: '{version}-{traceId}-{spanId}-{sampleDecision}'
 *     For more information see {@link https://www.w3.org/TR/trace-context/}
 */
declare function parseTraceParent(traceParent: string): SpanContext | null;
/**
 * Propagates {@link SpanContext} through Trace Context format propagation.
 *
 * Based on the Trace Context specification:
 * https://www.w3.org/TR/trace-context/
 */
declare class W3CTraceContextPropagator implements TextMapPropagator {
	inject(context: Context, carrier: unknown, setter: TextMapSetter): void;
	extract(context: Context, carrier: unknown, getter: TextMapGetter): Context;
	fields(): string[];
}

declare enum RPCType {
	HTTP = "http"
}
type HTTPMetadata = {
	type: RPCType.HTTP;
	route?: string;
	span: Span;
};
/**
 * Allows for future rpc metadata to be used with this mechanism
 */
type RPCMetadata = HTTPMetadata;
declare function setRPCMetadata(context: Context, meta: RPCMetadata): Context;
declare function deleteRPCMetadata(context: Context): Context;
declare function getRPCMetadata(context: Context): RPCMetadata | undefined;

declare function suppressTracing(context: Context): Context;
declare function unsuppressTracing(context: Context): Context;
declare function isTracingSuppressed(context: Context): boolean;

/**
 * TraceState must be a class and not a simple object type because of the spec
 * requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
 *
 * Here is the list of allowed mutations:
 * - New key-value pair should be added into the beginning of the list
 * - The value of any key can be updated. Modified keys MUST be moved to the
 * beginning of the list.
 */
declare class TraceState implements api.TraceState {
	private _internalState;
	constructor(rawTraceState?: string);
	set(key: string, value: string): TraceState;
	unset(key: string): TraceState;
	get(key: string): string | undefined;
	serialize(): string;
	private _parse;
	private _keys;
	private _clone;
}

/**
 * Merges objects together
 * @param args - objects / values to be merged
 */
declare function merge(...args: any[]): any;

/**
 * Error that is thrown on timeouts.
 */
declare class TimeoutError extends Error {
	constructor(message?: string);
}
/**
 * Adds a timeout to a promise and rejects if the specified timeout has elapsed. Also rejects if the specified promise
 * rejects, and resolves if the specified promise resolves.
 *
 * <p> NOTE: this operation will continue even after it throws a {@link TimeoutError}.
 *
 * @param promise promise to use with timeout.
 * @param timeout the timeout in milliseconds until the returned promise is rejected.
 */
declare function callWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T>;

declare function urlMatches(url: string, urlToMatch: string | RegExp): boolean;
/**
 * Check if {@param url} should be ignored when comparing against {@param ignoredUrls}
 * @param url
 * @param ignoredUrls
 */
declare function isUrlIgnored(url: string, ignoredUrls?: Array<string | RegExp>): boolean;

/**
 * Bind the callback and only invoke the callback once regardless how many times `BindOnceFuture.call` is invoked.
 */
declare class BindOnceFuture<R, This = unknown, T extends (this: This, ...args: unknown[]) => R = () => R> {
	private _callback;
	private _that;
	private _isCalled;
	private _deferred;
	constructor(_callback: T, _that: This);
	get isCalled(): boolean;
	get promise(): Promise<R>;
	call(...args: Parameters<T>): Promise<R>;
}

/**
 * Convert a string to a {@link DiagLogLevel}, defaults to {@link DiagLogLevel} if the log level does not exist or undefined if the input is undefined.
 * @param value
 */
declare function diagLogLevelFromString(value: string | undefined): DiagLogLevel | undefined;

interface Exporter<T> {
	export(arg: T, resultCallback: (result: ExportResult) => void): void;
}
/**
 * @internal
 * Shared functionality used by Exporters while exporting data, including suppression of Traces.
 */
declare function _export<T>(exporter: Exporter<T>, arg: T): Promise<ExportResult>;

declare const internal: {
	_export: typeof _export;
};

export { AnchoredClock, BindOnceFuture, Clock, CompositePropagator, CompositePropagatorConfig, ErrorHandler, ExportResult, ExportResultCode, InstrumentationScope, RPCMetadata, RPCType, SDK_INFO, TRACE_PARENT_HEADER, TRACE_STATE_HEADER, TimeoutError, TraceState, W3CBaggagePropagator, W3CTraceContextPropagator, _globalThis, addHrTimes, callWithTimeout, deleteRPCMetadata, diagLogLevelFromString, getBooleanFromEnv, getNumberFromEnv, getRPCMetadata, getStringFromEnv, getStringListFromEnv, getTimeOrigin, globalErrorHandler, hrTime, hrTimeDuration, hrTimeToMicroseconds, hrTimeToMilliseconds, hrTimeToNanoseconds, hrTimeToTimeStamp, internal, isAttributeValue, isTimeInput, isTimeInputHrTime, isTracingSuppressed, isUrlIgnored, loggingErrorHandler, merge, millisToHrTime, otperformance, parseKeyPairsIntoRecord, parseTraceParent, sanitizeAttributes, setGlobalErrorHandler, setRPCMetadata, suppressTracing, timeInputToHrTime, unrefTimer, unsuppressTracing, urlMatches };
