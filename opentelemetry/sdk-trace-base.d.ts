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

import { Attributes, TraceState, Context, SpanKind, Link, HrTime, SpanContext, SpanStatus, Span as Span$1, TextMapPropagator, ContextManager, TracerProvider, Tracer } from './api.d.ts';
import { Resource } from './resources.d.ts';
import { InstrumentationScope, ExportResult } from './core.d.ts';

/** IdGenerator provides an interface for generating Trace Id and Span Id */
interface IdGenerator {
	/** Returns a trace ID composed of 32 lowercase hex characters. */
	generateTraceId(): string;
	/** Returns a span ID composed of 16 lowercase hex characters. */
	generateSpanId(): string;
}

/**
 * A sampling decision that determines how a {@link Span} will be recorded
 * and collected.
 */
declare enum SamplingDecision {
	/**
	* `Span.isRecording() === false`, span will not be recorded and all events
	* and attributes will be dropped.
	*/
	NOT_RECORD = 0,
	/**
	* `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
	* MUST NOT be set.
	*/
	RECORD = 1,
	/**
	* `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
	* MUST be set.
	*/
	RECORD_AND_SAMPLED = 2
}
/**
 * A sampling result contains a decision for a {@link Span} and additional
 * attributes the sampler would like to added to the Span.
 */
interface SamplingResult {
	/**
	* A sampling decision, refer to {@link SamplingDecision} for details.
	*/
	decision: SamplingDecision;
	/**
	* The list of attributes returned by SamplingResult MUST be immutable.
	* Caller may call {@link Sampler}.shouldSample any number of times and
	* can safely cache the returned value.
	*/
	attributes?: Readonly<Attributes>;
	/**
	* A {@link TraceState} that will be associated with the {@link Span} through
	* the new {@link SpanContext}. Samplers SHOULD return the TraceState from
	* the passed-in {@link Context} if they do not intend to change it. Leaving
	* the value undefined will also leave the TraceState unchanged.
	*/
	traceState?: TraceState;
}
/**
 * This interface represent a sampler. Sampling is a mechanism to control the
 * noise and overhead introduced by OpenTelemetry by reducing the number of
 * samples of traces collected and sent to the backend.
 */
interface Sampler {
	/**
	* Checks whether span needs to be created and tracked.
	*
	* @param context Parent Context which may contain a span.
	* @param traceId of the span to be created. It can be different from the
	*     traceId in the {@link SpanContext}. Typically in situations when the
	*     span to be created starts a new trace.
	* @param spanName of the span to be created.
	* @param spanKind of the span to be created.
	* @param attributes Initial set of Attributes for the Span being constructed.
	* @param links Collection of links that will be associated with the Span to
	*     be created. Typically useful for batch operations.
	* @returns a {@link SamplingResult}.
	*/
	shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: Attributes, links: Link[]): SamplingResult;
	/** Returns the sampler name or short description with the configuration. */
	toString(): string;
}

/**
 * Represents a timed event.
 * A timed event is an event with a timestamp.
 */
interface TimedEvent {
	time: HrTime;
	/** The name of the event. */
	name: string;
	/** The attributes of the event. */
	attributes?: Attributes;
	/** Count of attributes of the event that were dropped due to collection limits */
	droppedAttributesCount?: number;
}

interface ReadableSpan {
	readonly name: string;
	readonly kind: SpanKind;
	readonly spanContext: () => SpanContext;
	readonly parentSpanContext?: SpanContext;
	readonly startTime: HrTime;
	readonly endTime: HrTime;
	readonly status: SpanStatus;
	readonly attributes: Attributes;
	readonly links: Link[];
	readonly events: TimedEvent[];
	readonly duration: HrTime;
	readonly ended: boolean;
	readonly resource: Resource;
	readonly instrumentationScope: InstrumentationScope;
	readonly droppedAttributesCount: number;
	readonly droppedEventsCount: number;
	readonly droppedLinksCount: number;
}

/**
 * This type provides the properties of @link{ReadableSpan} at the same time
 * of the Span API
 */
type Span = Span$1 & ReadableSpan;

/**
 * SpanProcessor is the interface Tracer SDK uses to allow synchronous hooks
 * for when a {@link Span} is started or when a {@link Span} is ended.
 */
interface SpanProcessor {
	/**
	* Forces to export all finished spans
	*/
	forceFlush(): Promise<void>;
	/**
	* Called when a {@link Span} is started, if the `span.isRecording()`
	* returns true.
	* @param span the Span that just started.
	*/
	onStart(span: Span, parentContext: Context): void;
	/**
	* Called when a {@link ReadableSpan} is ended, if the `span.isRecording()`
	* returns true.
	* @param span the Span that just ended.
	*/
	onEnd(span: ReadableSpan): void;
	/**
	* Shuts down the processor. Called when SDK is shut down. This is an
	* opportunity for processor to do any cleanup required.
	*/
	shutdown(): Promise<void>;
}

/**
 * TracerConfig provides an interface for configuring a Basic Tracer.
 */
interface TracerConfig {
	/**
	* Sampler determines if a span should be recorded or should be a NoopSpan.
	*/
	sampler?: Sampler;
	/** General Limits */
	generalLimits?: GeneralLimits;
	/** Span Limits */
	spanLimits?: SpanLimits;
	/** Resource associated with trace telemetry  */
	resource?: Resource;
	/**
	* Generator of trace and span IDs
	* The default idGenerator generates random ids
	*/
	idGenerator?: IdGenerator;
	/**
	* How long the forceFlush can run before it is cancelled.
	* The default value is 30000ms
	*/
	forceFlushTimeoutMillis?: number;
	/**
	* List of SpanProcessor for the tracer
	*/
	spanProcessors?: SpanProcessor[];
}
/**
 * Configuration options for registering the API with the SDK.
 * Undefined values may be substituted for defaults, and null
 * values will not be registered.
 */
interface SDKRegistrationConfig {
	/** Propagator to register as the global propagator */
	propagator?: TextMapPropagator | null;
	/** Context manager to register as the global context manager */
	contextManager?: ContextManager | null;
}
/** Global configuration limits of trace service */
interface GeneralLimits {
	/** attributeValueLengthLimit is maximum allowed attribute value size */
	attributeValueLengthLimit?: number;
	/** attributeCountLimit is number of attributes per trace */
	attributeCountLimit?: number;
}
/** Global configuration of trace service */
interface SpanLimits {
	/** attributeValueLengthLimit is maximum allowed attribute value size */
	attributeValueLengthLimit?: number;
	/** attributeCountLimit is number of attributes per span */
	attributeCountLimit?: number;
	/** linkCountLimit is number of links per span */
	linkCountLimit?: number;
	/** eventCountLimit is number of message events per span */
	eventCountLimit?: number;
	/** attributePerEventCountLimit is the maximum number of attributes allowed per span event */
	attributePerEventCountLimit?: number;
	/** attributePerLinkCountLimit is the maximum number of attributes allowed per span link */
	attributePerLinkCountLimit?: number;
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
	/** The maximum queue size. After the size is reached spans are dropped.
	* The default value is 2048. */
	maxQueueSize?: number;
}
/** Interface configuration for BatchSpanProcessor on browser */
interface BatchSpanProcessorBrowserConfig extends BufferConfig {
	/** Disable flush when a user navigates to a new page, closes the tab or the browser, or,
	* on mobile, switches to a different app. Auto flush is enabled by default. */
	disableAutoFlushOnDocumentHide?: boolean;
}

/**
 * This class represents a basic tracer provider which platform libraries can extend
 */
declare class BasicTracerProvider implements TracerProvider {
	private readonly _config;
	private readonly _tracers;
	private readonly _resource;
	private readonly _activeSpanProcessor;
	constructor(config?: TracerConfig);
	getTracer(name: string, version?: string, options?: {
		schemaUrl?: string;
	}): Tracer;
	forceFlush(): Promise<void>;
	shutdown(): Promise<void>;
}

/**
 * An interface that allows different tracing services to export recorded data
 * for sampled spans in their own format.
 *
 * To export data this MUST be register to the Tracer SDK using a optional
 * config.
 */
interface SpanExporter {
	/**
	* Called to export sampled {@link ReadableSpan}s.
	* @param spans the list of sampled Spans to be exported.
	*/
	export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
	/** Stops the exporter. */
	shutdown(): Promise<void>;
	/** Immediately export all spans */
	forceFlush?(): Promise<void>;
}

/**
 * Implementation of the {@link SpanProcessor} that batches spans exported by
 * the SDK then pushes them to the exporter pipeline.
 */
declare abstract class BatchSpanProcessorBase<T extends BufferConfig> implements SpanProcessor {
	private readonly _exporter;
	private readonly _maxExportBatchSize;
	private readonly _maxQueueSize;
	private readonly _scheduledDelayMillis;
	private readonly _exportTimeoutMillis;
	private _isExporting;
	private _finishedSpans;
	private _timer;
	private _shutdownOnce;
	private _droppedSpansCount;
	constructor(_exporter: SpanExporter, config?: T);
	forceFlush(): Promise<void>;
	onStart(_span: Span, _parentContext: Context): void;
	onEnd(span: ReadableSpan): void;
	shutdown(): Promise<void>;
	private _shutdown;
	/** Add a span in the buffer. */
	private _addToBuffer;
	/**
	* Send all spans to the exporter respecting the batch size limit
	* This function is used only on forceFlush or shutdown,
	* for all other cases _flush should be used
	* */
	private _flushAll;
	private _flushOneBatch;
	private _maybeStartTimer;
	private _clearTimer;
	protected abstract onShutdown(): void;
}

declare class BatchSpanProcessor extends BatchSpanProcessorBase<BufferConfig> {
	protected onShutdown(): void;
}

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

/**
 * This is implementation of {@link SpanExporter} that prints spans to the
 * console. This class can be used for diagnostic purposes.
 *
 * NOTE: This {@link SpanExporter} is intended for diagnostics use only, output rendered to the console may change at any time.
 */
declare class ConsoleSpanExporter implements SpanExporter {
	/**
	* Export spans.
	* @param spans
	* @param resultCallback
	*/
	export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
	/**
	* Shutdown the exporter.
	*/
	shutdown(): Promise<void>;
	/**
	* Exports any pending spans in exporter
	*/
	forceFlush(): Promise<void>;
	/**
	* converts span info into more readable format
	* @param span
	*/
	private _exportInfo;
	/**
	* Showing spans in console
	* @param spans
	* @param done
	*/
	private _sendSpans;
}

/**
 * This class can be used for testing purposes. It stores the exported spans
 * in a list in memory that can be retrieved using the `getFinishedSpans()`
 * method.
 */
declare class InMemorySpanExporter implements SpanExporter {
	private _finishedSpans;
	/**
	* Indicates if the exporter has been "shutdown."
	* When false, exported spans will not be stored in-memory.
	*/
	protected _stopped: boolean;
	export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
	shutdown(): Promise<void>;
	/**
	* Exports any pending spans in the exporter
	*/
	forceFlush(): Promise<void>;
	reset(): void;
	getFinishedSpans(): ReadableSpan[];
}

/**
 * An implementation of the {@link SpanProcessor} that converts the {@link Span}
 * to {@link ReadableSpan} and passes it to the configured exporter.
 *
 * Only spans that are sampled are converted.
 *
 * NOTE: This {@link SpanProcessor} exports every ended span individually instead of batching spans together, which causes significant performance overhead with most exporters. For production use, please consider using the {@link BatchSpanProcessor} instead.
 */
declare class SimpleSpanProcessor implements SpanProcessor {
	private readonly _exporter;
	private _shutdownOnce;
	private _pendingExports;
	constructor(_exporter: SpanExporter);
	forceFlush(): Promise<void>;
	onStart(_span: Span, _parentContext: Context): void;
	onEnd(span: ReadableSpan): void;
	private _doExport;
	shutdown(): Promise<void>;
	private _shutdown;
}

/** No-op implementation of SpanProcessor */
declare class NoopSpanProcessor implements SpanProcessor {
	onStart(_span: Span, _context: Context): void;
	onEnd(_span: ReadableSpan): void;
	shutdown(): Promise<void>;
	forceFlush(): Promise<void>;
}

/** Sampler that samples no traces. */
declare class AlwaysOffSampler implements Sampler {
	shouldSample(): SamplingResult;
	toString(): string;
}

/** Sampler that samples all traces. */
declare class AlwaysOnSampler implements Sampler {
	shouldSample(): SamplingResult;
	toString(): string;
}

/**
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
	shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: Attributes, links: Link[]): SamplingResult;
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

/** Sampler that samples a given fraction of traces based of trace id deterministically. */
declare class TraceIdRatioBasedSampler implements Sampler {
	private readonly _ratio;
	private _upperBound;
	constructor(_ratio?: number);
	shouldSample(context: unknown, traceId: string): SamplingResult;
	toString(): string;
	private _normalize;
	private _accumulate;
}

export { AlwaysOffSampler, AlwaysOnSampler, BasicTracerProvider, BatchSpanProcessor, BatchSpanProcessorBrowserConfig, BufferConfig, ConsoleSpanExporter, GeneralLimits, IdGenerator, InMemorySpanExporter, NoopSpanProcessor, ParentBasedSampler, RandomIdGenerator, ReadableSpan, SDKRegistrationConfig, Sampler, SamplingDecision, SamplingResult, SimpleSpanProcessor, Span, SpanExporter, SpanLimits, SpanProcessor, TimedEvent, TraceIdRatioBasedSampler, TracerConfig };
