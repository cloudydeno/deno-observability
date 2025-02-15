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
import { TextMapPropagator, Context, TextMapSetter, TextMapGetter, SpanAttributes, SpanAttributeValue, Exception, Baggage, BaggageEntryMetadata, DiagLogLevel, SpanContext, Span, Sampler, SamplingResult, SpanKind, Link } from './api.d.ts';

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

declare function sanitizeAttributes(attributes: unknown): SpanAttributes;
declare function isAttributeKey(key: unknown): key is string;
declare function isAttributeValue(val: unknown): val is SpanAttributeValue;

/**
 * This interface defines a fallback to read a timeOrigin when it is not available on performance.timeOrigin,
 * this happens for example on Safari Mac
 * then the timeOrigin is taken from fetchStart - which is the closest to timeOrigin
 */
interface TimeOriginLegacy {
	timing: {
		fetchStart: number;
	};
}
/**
 * This interface defines the params that are be added to the wrapped function
 * using the "shimmer.wrap"
 */
interface ShimWrapped extends Function {
	__wrapped: boolean;
	__unwrap: Function;
	__original: Function;
}
/**
 * An instrumentation library consists of the name and optional version
 * used to obtain a tracer or meter from a provider. This metadata is made
 * available on ReadableSpan and MetricRecord for use by the export pipeline.
 * @deprecated Use {@link InstrumentationScope} instead.
 */
interface InstrumentationLibrary {
	readonly name: string;
	readonly version?: string;
	readonly schemaUrl?: string;
}
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
declare type ErrorHandler = (ex: Exception) => void;

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

declare function hexToBinary(hexStr: string): Uint8Array;

interface ExportResult {
	code: ExportResultCode;
	error?: Error;
}
declare enum ExportResultCode {
	SUCCESS = 0,
	FAILED = 1
}

declare type ParsedBaggageKeyValue = {
	key: string;
	value: string;
	metadata: BaggageEntryMetadata | undefined;
};
declare function serializeKeyPairs(keyPairs: string[]): string;
declare function getKeyPairs(baggage: Baggage): string[];
declare function parsePairKeyValue(entry: string): ParsedBaggageKeyValue | undefined;
/**
 * Parse a string serialized in the baggage HTTP Format (without metadata):
 * https://github.com/w3c/baggage/blob/master/baggage/HTTP_HEADER_FORMAT.md
 */
declare function parseKeyPairsIntoRecord(value?: string): Record<string, string>;

declare const utils_d_getKeyPairs: typeof getKeyPairs;
declare const utils_d_parseKeyPairsIntoRecord: typeof parseKeyPairsIntoRecord;
declare const utils_d_parsePairKeyValue: typeof parsePairKeyValue;
declare const utils_d_serializeKeyPairs: typeof serializeKeyPairs;
declare namespace utils_d {
export {
	utils_d_getKeyPairs as getKeyPairs,
	utils_d_parseKeyPairsIntoRecord as parseKeyPairsIntoRecord,
	utils_d_parsePairKeyValue as parsePairKeyValue,
	utils_d_serializeKeyPairs as serializeKeyPairs,
};
}

/**
 * Environment interface to define all names
 */
declare const ENVIRONMENT_BOOLEAN_KEYS: readonly ["OTEL_SDK_DISABLED"];
declare type ENVIRONMENT_BOOLEANS = {
	[K in (typeof ENVIRONMENT_BOOLEAN_KEYS)[number]]?: boolean;
};
declare const ENVIRONMENT_NUMBERS_KEYS: readonly ["OTEL_BSP_EXPORT_TIMEOUT", "OTEL_BSP_MAX_EXPORT_BATCH_SIZE", "OTEL_BSP_MAX_QUEUE_SIZE", "OTEL_BSP_SCHEDULE_DELAY", "OTEL_BLRP_EXPORT_TIMEOUT", "OTEL_BLRP_MAX_EXPORT_BATCH_SIZE", "OTEL_BLRP_MAX_QUEUE_SIZE", "OTEL_BLRP_SCHEDULE_DELAY", "OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT", "OTEL_ATTRIBUTE_COUNT_LIMIT", "OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT", "OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT", "OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT", "OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT", "OTEL_SPAN_EVENT_COUNT_LIMIT", "OTEL_SPAN_LINK_COUNT_LIMIT", "OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT", "OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT", "OTEL_EXPORTER_OTLP_TIMEOUT", "OTEL_EXPORTER_OTLP_TRACES_TIMEOUT", "OTEL_EXPORTER_OTLP_METRICS_TIMEOUT", "OTEL_EXPORTER_OTLP_LOGS_TIMEOUT", "OTEL_EXPORTER_JAEGER_AGENT_PORT"];
declare type ENVIRONMENT_NUMBERS = {
	[K in (typeof ENVIRONMENT_NUMBERS_KEYS)[number]]?: number;
};
declare const ENVIRONMENT_LISTS_KEYS: readonly ["OTEL_NO_PATCH_MODULES", "OTEL_PROPAGATORS"];
declare type ENVIRONMENT_LISTS = {
	[K in (typeof ENVIRONMENT_LISTS_KEYS)[number]]?: string[];
};
declare type ENVIRONMENT = {
	CONTAINER_NAME?: string;
	ECS_CONTAINER_METADATA_URI_V4?: string;
	ECS_CONTAINER_METADATA_URI?: string;
	HOSTNAME?: string;
	KUBERNETES_SERVICE_HOST?: string;
	NAMESPACE?: string;
	OTEL_EXPORTER_JAEGER_AGENT_HOST?: string;
	OTEL_EXPORTER_JAEGER_ENDPOINT?: string;
	OTEL_EXPORTER_JAEGER_PASSWORD?: string;
	OTEL_EXPORTER_JAEGER_USER?: string;
	OTEL_EXPORTER_OTLP_ENDPOINT?: string;
	OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
	OTEL_EXPORTER_OTLP_METRICS_ENDPOINT?: string;
	OTEL_EXPORTER_OTLP_LOGS_ENDPOINT?: string;
	OTEL_EXPORTER_OTLP_HEADERS?: string;
	OTEL_EXPORTER_OTLP_TRACES_HEADERS?: string;
	OTEL_EXPORTER_OTLP_METRICS_HEADERS?: string;
	OTEL_EXPORTER_OTLP_LOGS_HEADERS?: string;
	OTEL_EXPORTER_ZIPKIN_ENDPOINT?: string;
	OTEL_LOG_LEVEL?: DiagLogLevel;
	OTEL_RESOURCE_ATTRIBUTES?: string;
	OTEL_SERVICE_NAME?: string;
	OTEL_TRACES_EXPORTER?: string;
	OTEL_TRACES_SAMPLER_ARG?: string;
	OTEL_TRACES_SAMPLER?: string;
	OTEL_LOGS_EXPORTER?: string;
	OTEL_EXPORTER_OTLP_INSECURE?: string;
	OTEL_EXPORTER_OTLP_TRACES_INSECURE?: string;
	OTEL_EXPORTER_OTLP_METRICS_INSECURE?: string;
	OTEL_EXPORTER_OTLP_LOGS_INSECURE?: string;
	OTEL_EXPORTER_OTLP_CERTIFICATE?: string;
	OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE?: string;
	OTEL_EXPORTER_OTLP_METRICS_CERTIFICATE?: string;
	OTEL_EXPORTER_OTLP_LOGS_CERTIFICATE?: string;
	OTEL_EXPORTER_OTLP_COMPRESSION?: string;
	OTEL_EXPORTER_OTLP_TRACES_COMPRESSION?: string;
	OTEL_EXPORTER_OTLP_METRICS_COMPRESSION?: string;
	OTEL_EXPORTER_OTLP_LOGS_COMPRESSION?: string;
	OTEL_EXPORTER_OTLP_CLIENT_KEY?: string;
	OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY?: string;
	OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY?: string;
	OTEL_EXPORTER_OTLP_LOGS_CLIENT_KEY?: string;
	OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE?: string;
	OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE?: string;
	OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE?: string;
	OTEL_EXPORTER_OTLP_LOGS_CLIENT_CERTIFICATE?: string;
	OTEL_EXPORTER_OTLP_PROTOCOL?: string;
	OTEL_EXPORTER_OTLP_TRACES_PROTOCOL?: string;
	OTEL_EXPORTER_OTLP_METRICS_PROTOCOL?: string;
	OTEL_EXPORTER_OTLP_LOGS_PROTOCOL?: string;
	OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE?: string;
} & ENVIRONMENT_BOOLEANS & ENVIRONMENT_NUMBERS & ENVIRONMENT_LISTS;
declare type RAW_ENVIRONMENT = {
	[key: string]: string | number | undefined | string[];
};
declare const DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT: number;
declare const DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
declare const DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT = 128;
declare const DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT = 128;
/**
 * Default environment variables
 */
declare const DEFAULT_ENVIRONMENT: Required<ENVIRONMENT>;
/**
 * Parses environment values
 * @param values
 */
declare function parseEnvironment(values: RAW_ENVIRONMENT): ENVIRONMENT;

/**
 * Gets the environment variables
 */
declare function getEnv(): Required<ENVIRONMENT>;
declare function getEnvWithoutDefaults(): ENVIRONMENT;

/** only globals that common to node and browsers are allowed */
declare const _globalThis: typeof globalThis;

declare function hexToBase64(hexStr: string): string;

/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * IdGenerator provides an interface for generating Trace Id and Span Id.
 */
interface IdGenerator {
	/** Returns a trace ID composed of 32 lowercase hex characters. */
	generateTraceId(): string;
	/** Returns a span ID composed of 16 lowercase hex characters. */
	generateSpanId(): string;
}

/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 */
declare class RandomIdGenerator implements IdGenerator {
	/**
	* Returns a random 16-byte trace ID formatted/encoded as a 32 lowercase hex
	* characters corresponding to 128 bits.
	*/
	generateTraceId: () => string;
	/**
	* Returns a random 8-byte span ID formatted/encoded as a 16 lowercase hex
	* characters corresponding to 64 bits.
	*/
	generateSpanId: () => string;
}

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
declare type HTTPMetadata = {
	type: RPCType.HTTP;
	route?: string;
	span: Span;
};
/**
 * Allows for future rpc metadata to be used with this mechanism
 */
declare type RPCMetadata = HTTPMetadata;
declare function setRPCMetadata(context: Context, meta: RPCMetadata): Context;
declare function deleteRPCMetadata(context: Context): Context;
declare function getRPCMetadata(context: Context): RPCMetadata | undefined;

/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * Sampler that samples no traces.
 */
declare class AlwaysOffSampler implements Sampler {
	shouldSample(): SamplingResult;
	toString(): string;
}

/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * Sampler that samples all traces.
 */
declare class AlwaysOnSampler implements Sampler {
	shouldSample(): SamplingResult;
	toString(): string;
}

/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * A composite sampler that either respects the parent span's sampling decision
 * or delegates to `delegateSampler` for root spans.
 */
declare class ParentBasedSampler implements Sampler {
	private _root;
	private _remoteParentSampled;
	private _remoteParentNotSampled;
	private _localParentSampled;
	private _localParentNotSampled;
	constructor(config: ParentBasedSamplerConfig);
	shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: SpanAttributes, links: Link[]): SamplingResult;
	toString(): string;
}
interface ParentBasedSamplerConfig {
	/** Sampler called for spans with no parent */
	root: Sampler;
	/** Sampler called for spans with a remote parent which was sampled. Default AlwaysOn */
	remoteParentSampled?: Sampler;
	/** Sampler called for spans with a remote parent which was not sampled. Default AlwaysOff */
	remoteParentNotSampled?: Sampler;
	/** Sampler called for spans with a local parent which was sampled. Default AlwaysOn */
	localParentSampled?: Sampler;
	/** Sampler called for spans with a local parent which was not sampled. Default AlwaysOff */
	localParentNotSampled?: Sampler;
}

/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * Sampler that samples a given fraction of traces based of trace id deterministically.
 */
declare class TraceIdRatioBasedSampler implements Sampler {
	private readonly _ratio;
	private _upperBound;
	constructor(_ratio?: number);
	shouldSample(context: unknown, traceId: string): SamplingResult;
	toString(): string;
	private _normalize;
	private _accumulate;
}

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

declare enum TracesSamplerValues {
	AlwaysOff = "always_off",
	AlwaysOn = "always_on",
	ParentBasedAlwaysOff = "parentbased_always_off",
	ParentBasedAlwaysOn = "parentbased_always_on",
	ParentBasedTraceIdRatio = "parentbased_traceidratio",
	TraceIdRatio = "traceidratio"
}

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
 * Checks if certain function has been already wrapped
 * @param func
 */
declare function isWrapped(func: unknown): func is ShimWrapped;

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

declare const VERSION = "1.25.0";

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

export { AlwaysOffSampler, AlwaysOnSampler, AnchoredClock, BindOnceFuture, Clock, CompositePropagator, CompositePropagatorConfig, DEFAULT_ATTRIBUTE_COUNT_LIMIT, DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, DEFAULT_ENVIRONMENT, DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT, DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT, ENVIRONMENT, ErrorHandler, ExportResult, ExportResultCode, IdGenerator, InstrumentationLibrary, InstrumentationScope, ParentBasedSampler, RAW_ENVIRONMENT, RPCMetadata, RPCType, RandomIdGenerator, SDK_INFO, ShimWrapped, TRACE_PARENT_HEADER, TRACE_STATE_HEADER, TimeOriginLegacy, TimeoutError, TraceIdRatioBasedSampler, TraceState, TracesSamplerValues, VERSION, W3CBaggagePropagator, W3CTraceContextPropagator, _globalThis, addHrTimes, utils_d as baggageUtils, callWithTimeout, deleteRPCMetadata, getEnv, getEnvWithoutDefaults, getRPCMetadata, getTimeOrigin, globalErrorHandler, hexToBase64, hexToBinary, hrTime, hrTimeDuration, hrTimeToMicroseconds, hrTimeToMilliseconds, hrTimeToNanoseconds, hrTimeToTimeStamp, internal, isAttributeKey, isAttributeValue, isTimeInput, isTimeInputHrTime, isTracingSuppressed, isUrlIgnored, isWrapped, loggingErrorHandler, merge, millisToHrTime, otperformance, parseEnvironment, parseTraceParent, sanitizeAttributes, setGlobalErrorHandler, setRPCMetadata, suppressTracing, timeInputToHrTime, unrefTimer, unsuppressTracing, urlMatches };
