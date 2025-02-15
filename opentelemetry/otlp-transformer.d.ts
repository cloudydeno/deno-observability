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

import { HrTime } from './api.d.ts';
import { ReadableSpan } from './sdk-trace-base.d.ts';
import { ResourceMetrics } from './sdk-metrics.d.ts';
import { ReadableLogRecord } from './sdk-logs.d.ts';

/** Properties of an InstrumentationScope. */
interface IInstrumentationScope {
	/** InstrumentationScope name */
	name: string;
	/** InstrumentationScope version */
	version?: string;
	/** InstrumentationScope attributes */
	attributes?: IKeyValue[];
	/** InstrumentationScope droppedAttributesCount */
	droppedAttributesCount?: number;
}
/** Properties of a KeyValue. */
interface IKeyValue {
	/** KeyValue key */
	key: string;
	/** KeyValue value */
	value: IAnyValue;
}
/** Properties of an AnyValue. */
interface IAnyValue {
	/** AnyValue stringValue */
	stringValue?: string | null;
	/** AnyValue boolValue */
	boolValue?: boolean | null;
	/** AnyValue intValue */
	intValue?: number | null;
	/** AnyValue doubleValue */
	doubleValue?: number | null;
	/** AnyValue arrayValue */
	arrayValue?: IArrayValue;
	/** AnyValue kvlistValue */
	kvlistValue?: IKeyValueList;
	/** AnyValue bytesValue */
	bytesValue?: Uint8Array;
}
/** Properties of an ArrayValue. */
interface IArrayValue {
	/** ArrayValue values */
	values: IAnyValue[];
}
/** Properties of a KeyValueList. */
interface IKeyValueList {
	/** KeyValueList values */
	values: IKeyValue[];
}
interface LongBits {
	low: number;
	high: number;
}
declare type Fixed64 = LongBits | string | number;
interface OtlpEncodingOptions {
	/** Convert trace and span IDs to hex strings. */
	useHex?: boolean;
	/** Convert HrTime to 2 part 64 bit values. */
	useLongBits?: boolean;
}

declare function hrTimeToNanos(hrTime: HrTime): bigint;
declare function toLongBits(value: bigint): LongBits;
declare function encodeAsLongBits(hrTime: HrTime): LongBits;
declare function encodeAsString(hrTime: HrTime): string;
declare type HrTimeEncodeFunction = (hrTime: HrTime) => Fixed64;
declare type SpanContextEncodeFunction = (spanContext: string) => string | Uint8Array;
declare type OptionalSpanContextEncodeFunction = (spanContext: string | undefined) => string | Uint8Array | undefined;
interface Encoder {
	encodeHrTime: HrTimeEncodeFunction;
	encodeSpanContext: SpanContextEncodeFunction;
	encodeOptionalSpanContext: OptionalSpanContextEncodeFunction;
}
declare function getOtlpEncoder(options?: OtlpEncodingOptions): Encoder;

/** Properties of a Resource. */
interface IResource {
	/** Resource attributes */
	attributes: IKeyValue[];
	/** Resource droppedAttributesCount */
	droppedAttributesCount: number;
}

/** Properties of an ExportMetricsServiceRequest. */
interface IExportMetricsServiceRequest {
	/** ExportMetricsServiceRequest resourceMetrics */
	resourceMetrics: IResourceMetrics[];
}
interface IExportMetricsServiceResponse {
	/** ExportMetricsServiceResponse partialSuccess */
	partialSuccess?: IExportMetricsPartialSuccess;
}
interface IExportMetricsPartialSuccess {
	/** ExportMetricsPartialSuccess rejectedDataPoints */
	rejectedDataPoints?: number;
	/** ExportMetricsPartialSuccess errorMessage */
	errorMessage?: string;
}
/** Properties of a ResourceMetrics. */
interface IResourceMetrics {
	/** ResourceMetrics resource */
	resource?: IResource;
	/** ResourceMetrics scopeMetrics */
	scopeMetrics: IScopeMetrics[];
	/** ResourceMetrics schemaUrl */
	schemaUrl?: string;
}
/** Properties of an IScopeMetrics. */
interface IScopeMetrics {
	/** ScopeMetrics scope */
	scope?: IInstrumentationScope;
	/** ScopeMetrics metrics */
	metrics: IMetric[];
	/** ScopeMetrics schemaUrl */
	schemaUrl?: string;
}
/** Properties of a Metric. */
interface IMetric {
	/** Metric name */
	name: string;
	/** Metric description */
	description?: string;
	/** Metric unit */
	unit?: string;
	/** Metric gauge */
	gauge?: IGauge;
	/** Metric sum */
	sum?: ISum;
	/** Metric histogram */
	histogram?: IHistogram;
	/** Metric exponentialHistogram */
	exponentialHistogram?: IExponentialHistogram;
	/** Metric summary */
	summary?: ISummary;
}
/** Properties of a Gauge. */
interface IGauge {
	/** Gauge dataPoints */
	dataPoints: INumberDataPoint[];
}
/** Properties of a Sum. */
interface ISum {
	/** Sum dataPoints */
	dataPoints: INumberDataPoint[];
	/** Sum aggregationTemporality */
	aggregationTemporality: EAggregationTemporality;
	/** Sum isMonotonic */
	isMonotonic?: boolean | null;
}
/** Properties of a Histogram. */
interface IHistogram {
	/** Histogram dataPoints */
	dataPoints: IHistogramDataPoint[];
	/** Histogram aggregationTemporality */
	aggregationTemporality?: EAggregationTemporality;
}
/** Properties of an ExponentialHistogram. */
interface IExponentialHistogram {
	/** ExponentialHistogram dataPoints */
	dataPoints: IExponentialHistogramDataPoint[];
	/** ExponentialHistogram aggregationTemporality */
	aggregationTemporality?: EAggregationTemporality;
}
/** Properties of a Summary. */
interface ISummary {
	/** Summary dataPoints */
	dataPoints: ISummaryDataPoint[];
}
/** Properties of a NumberDataPoint. */
interface INumberDataPoint {
	/** NumberDataPoint attributes */
	attributes: IKeyValue[];
	/** NumberDataPoint startTimeUnixNano */
	startTimeUnixNano?: Fixed64;
	/** NumberDataPoint timeUnixNano */
	timeUnixNano?: Fixed64;
	/** NumberDataPoint asDouble */
	asDouble?: number | null;
	/** NumberDataPoint asInt */
	asInt?: number;
	/** NumberDataPoint exemplars */
	exemplars?: IExemplar[];
	/** NumberDataPoint flags */
	flags?: number;
}
/** Properties of a HistogramDataPoint. */
interface IHistogramDataPoint {
	/** HistogramDataPoint attributes */
	attributes?: IKeyValue[];
	/** HistogramDataPoint startTimeUnixNano */
	startTimeUnixNano?: Fixed64;
	/** HistogramDataPoint timeUnixNano */
	timeUnixNano?: Fixed64;
	/** HistogramDataPoint count */
	count?: number;
	/** HistogramDataPoint sum */
	sum?: number;
	/** HistogramDataPoint bucketCounts */
	bucketCounts?: number[];
	/** HistogramDataPoint explicitBounds */
	explicitBounds?: number[];
	/** HistogramDataPoint exemplars */
	exemplars?: IExemplar[];
	/** HistogramDataPoint flags */
	flags?: number;
	/** HistogramDataPoint min */
	min?: number;
	/** HistogramDataPoint max */
	max?: number;
}
/** Properties of an ExponentialHistogramDataPoint. */
interface IExponentialHistogramDataPoint {
	/** ExponentialHistogramDataPoint attributes */
	attributes?: IKeyValue[];
	/** ExponentialHistogramDataPoint startTimeUnixNano */
	startTimeUnixNano?: Fixed64;
	/** ExponentialHistogramDataPoint timeUnixNano */
	timeUnixNano?: Fixed64;
	/** ExponentialHistogramDataPoint count */
	count?: number;
	/** ExponentialHistogramDataPoint sum */
	sum?: number;
	/** ExponentialHistogramDataPoint scale */
	scale?: number;
	/** ExponentialHistogramDataPoint zeroCount */
	zeroCount?: number;
	/** ExponentialHistogramDataPoint positive */
	positive?: IBuckets;
	/** ExponentialHistogramDataPoint negative */
	negative?: IBuckets;
	/** ExponentialHistogramDataPoint flags */
	flags?: number;
	/** ExponentialHistogramDataPoint exemplars */
	exemplars?: IExemplar[];
	/** ExponentialHistogramDataPoint min */
	min?: number;
	/** ExponentialHistogramDataPoint max */
	max?: number;
}
/** Properties of a SummaryDataPoint. */
interface ISummaryDataPoint {
	/** SummaryDataPoint attributes */
	attributes?: IKeyValue[];
	/** SummaryDataPoint startTimeUnixNano */
	startTimeUnixNano?: number;
	/** SummaryDataPoint timeUnixNano */
	timeUnixNano?: string;
	/** SummaryDataPoint count */
	count?: number;
	/** SummaryDataPoint sum */
	sum?: number;
	/** SummaryDataPoint quantileValues */
	quantileValues?: IValueAtQuantile[];
	/** SummaryDataPoint flags */
	flags?: number;
}
/** Properties of a ValueAtQuantile. */
interface IValueAtQuantile {
	/** ValueAtQuantile quantile */
	quantile?: number;
	/** ValueAtQuantile value */
	value?: number;
}
/** Properties of a Buckets. */
interface IBuckets {
	/** Buckets offset */
	offset?: number;
	/** Buckets bucketCounts */
	bucketCounts?: number[];
}
/** Properties of an Exemplar. */
interface IExemplar {
	/** Exemplar filteredAttributes */
	filteredAttributes?: IKeyValue[];
	/** Exemplar timeUnixNano */
	timeUnixNano?: string;
	/** Exemplar asDouble */
	asDouble?: number;
	/** Exemplar asInt */
	asInt?: number;
	/** Exemplar spanId */
	spanId?: string | Uint8Array;
	/** Exemplar traceId */
	traceId?: string | Uint8Array;
}
/**
 * AggregationTemporality defines how a metric aggregator reports aggregated
 * values. It describes how those values relate to the time interval over
 * which they are aggregated.
 */
declare enum EAggregationTemporality {
	AGGREGATION_TEMPORALITY_UNSPECIFIED = 0,
	/** DELTA is an AggregationTemporality for a metric aggregator which reports
	changes since last report time. Successive metrics contain aggregation of
	values from continuous and non-overlapping intervals.

	The values for a DELTA metric are based only on the time interval
	associated with one measurement cycle. There is no dependency on
	previous measurements like is the case for CUMULATIVE metrics.

	For example, consider a system measuring the number of requests that
	it receives and reports the sum of these requests every second as a
	DELTA metric:

	1. The system starts receiving at time=t_0.
	2. A request is received, the system measures 1 request.
	3. A request is received, the system measures 1 request.
	4. A request is received, the system measures 1 request.
	5. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_0 to
		t_0+1 with a value of 3.
	6. A request is received, the system measures 1 request.
	7. A request is received, the system measures 1 request.
	8. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_0+1 to
		t_0+2 with a value of 2. */
	AGGREGATION_TEMPORALITY_DELTA = 1,
	/** CUMULATIVE is an AggregationTemporality for a metric aggregator which
	reports changes since a fixed start time. This means that current values
	of a CUMULATIVE metric depend on all previous measurements since the
	start time. Because of this, the sender is required to retain this state
	in some form. If this state is lost or invalidated, the CUMULATIVE metric
	values MUST be reset and a new fixed start time following the last
	reported measurement time sent MUST be used.

	For example, consider a system measuring the number of requests that
	it receives and reports the sum of these requests every second as a
	CUMULATIVE metric:

	1. The system starts receiving at time=t_0.
	2. A request is received, the system measures 1 request.
	3. A request is received, the system measures 1 request.
	4. A request is received, the system measures 1 request.
	5. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_0 to
		t_0+1 with a value of 3.
	6. A request is received, the system measures 1 request.
	7. A request is received, the system measures 1 request.
	8. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_0 to
		t_0+2 with a value of 5.
	9. The system experiences a fault and loses state.
	10. The system recovers and resumes receiving at time=t_1.
	11. A request is received, the system measures 1 request.
	12. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_1 to
		t_0+1 with a value of 1.

	Note: Even though, when reporting changes since last report time, using
	CUMULATIVE is valid, it is not recommended. This may cause problems for
	systems that do not use start_time to determine when the aggregation
	value was reset (e.g. Prometheus). */
	AGGREGATION_TEMPORALITY_CUMULATIVE = 2
}

/** Properties of an ExportTraceServiceRequest. */
interface IExportTraceServiceRequest {
	/** ExportTraceServiceRequest resourceSpans */
	resourceSpans?: IResourceSpans[];
}
interface IExportTraceServiceResponse {
	/** ExportTraceServiceResponse partialSuccess */
	partialSuccess?: IExportTracePartialSuccess;
}
interface IExportTracePartialSuccess {
	/** ExportLogsServiceResponse rejectedLogRecords */
	rejectedSpans?: number;
	/** ExportLogsServiceResponse errorMessage */
	errorMessage?: string;
}
/** Properties of a ResourceSpans. */
interface IResourceSpans {
	/** ResourceSpans resource */
	resource?: IResource;
	/** ResourceSpans scopeSpans */
	scopeSpans: IScopeSpans[];
	/** ResourceSpans schemaUrl */
	schemaUrl?: string;
}
/** Properties of an ScopeSpans. */
interface IScopeSpans {
	/** IScopeSpans scope */
	scope?: IInstrumentationScope;
	/** IScopeSpans spans */
	spans?: ISpan[];
	/** IScopeSpans schemaUrl */
	schemaUrl?: string | null;
}
/** Properties of a Span. */
interface ISpan {
	/** Span traceId */
	traceId: string | Uint8Array;
	/** Span spanId */
	spanId: string | Uint8Array;
	/** Span traceState */
	traceState?: string | null;
	/** Span parentSpanId */
	parentSpanId?: string | Uint8Array;
	/** Span name */
	name: string;
	/** Span kind */
	kind: ESpanKind;
	/** Span startTimeUnixNano */
	startTimeUnixNano: Fixed64;
	/** Span endTimeUnixNano */
	endTimeUnixNano: Fixed64;
	/** Span attributes */
	attributes: IKeyValue[];
	/** Span droppedAttributesCount */
	droppedAttributesCount: number;
	/** Span events */
	events: IEvent[];
	/** Span droppedEventsCount */
	droppedEventsCount: number;
	/** Span links */
	links: ILink[];
	/** Span droppedLinksCount */
	droppedLinksCount: number;
	/** Span status */
	status: IStatus;
}
/**
 * SpanKind is the type of span. Can be used to specify additional relationships between spans
 * in addition to a parent/child relationship.
 */
declare enum ESpanKind {
	/** Unspecified. Do NOT use as default. Implementations MAY assume SpanKind to be INTERNAL when receiving UNSPECIFIED. */
	SPAN_KIND_UNSPECIFIED = 0,
	/** Indicates that the span represents an internal operation within an application,
	* as opposed to an operation happening at the boundaries. Default value.
	*/
	SPAN_KIND_INTERNAL = 1,
	/** Indicates that the span covers server-side handling of an RPC or other
	* remote network request.
	*/
	SPAN_KIND_SERVER = 2,
	/** Indicates that the span describes a request to some remote service.
	*/
	SPAN_KIND_CLIENT = 3,
	/** Indicates that the span describes a producer sending a message to a broker.
	* Unlike CLIENT and SERVER, there is often no direct critical path latency relationship
	* between producer and consumer spans. A PRODUCER span ends when the message was accepted
	* by the broker while the logical processing of the message might span a much longer time.
	*/
	SPAN_KIND_PRODUCER = 4,
	/** Indicates that the span describes consumer receiving a message from a broker.
	* Like the PRODUCER kind, there is often no direct critical path latency relationship
	* between producer and consumer spans.
	*/
	SPAN_KIND_CONSUMER = 5
}
/** Properties of a Status. */
interface IStatus {
	/** Status message */
	message?: string;
	/** Status code */
	code: EStatusCode;
}
/** StatusCode enum. */
declare enum EStatusCode {
	/** The default status. */
	STATUS_CODE_UNSET = 0,
	/** The Span has been evaluated by an Application developers or Operator to have completed successfully. */
	STATUS_CODE_OK = 1,
	/** The Span contains an error. */
	STATUS_CODE_ERROR = 2
}
/** Properties of an Event. */
interface IEvent {
	/** Event timeUnixNano */
	timeUnixNano: Fixed64;
	/** Event name */
	name: string;
	/** Event attributes */
	attributes: IKeyValue[];
	/** Event droppedAttributesCount */
	droppedAttributesCount: number;
}
/** Properties of a Link. */
interface ILink {
	/** Link traceId */
	traceId: string | Uint8Array;
	/** Link spanId */
	spanId: string | Uint8Array;
	/** Link traceState */
	traceState?: string;
	/** Link attributes */
	attributes: IKeyValue[];
	/** Link droppedAttributesCount */
	droppedAttributesCount: number;
}

/** Properties of an ExportLogsServiceRequest. */
interface IExportLogsServiceRequest {
	/** ExportLogsServiceRequest resourceLogs */
	resourceLogs?: IResourceLogs[];
}
interface IExportLogsServiceResponse {
	/** ExportLogsServiceResponse partialSuccess */
	partialSuccess?: IExportLogsPartialSuccess;
}
interface IExportLogsPartialSuccess {
	/** ExportLogsPartialSuccess rejectedLogRecords */
	rejectedLogRecords?: number;
	/** ExportLogsPartialSuccess errorMessage */
	errorMessage?: string;
}
/** Properties of a ResourceLogs. */
interface IResourceLogs {
	/** ResourceLogs resource */
	resource?: IResource;
	/** ResourceLogs scopeLogs */
	scopeLogs: IScopeLogs[];
	/** ResourceLogs schemaUrl */
	schemaUrl?: string;
}
/** Properties of an ScopeLogs. */
interface IScopeLogs {
	/** IScopeLogs scope */
	scope?: IInstrumentationScope;
	/** IScopeLogs logRecords */
	logRecords?: ILogRecord[];
	/** IScopeLogs schemaUrl */
	schemaUrl?: string | null;
}
/** Properties of a LogRecord. */
interface ILogRecord {
	/** LogRecord timeUnixNano */
	timeUnixNano: Fixed64;
	/** LogRecord observedTimeUnixNano */
	observedTimeUnixNano: Fixed64;
	/** LogRecord severityNumber */
	severityNumber?: ESeverityNumber;
	/** LogRecord severityText */
	severityText?: string;
	/** LogRecord body */
	body?: IAnyValue;
	/** LogRecord attributes */
	attributes: IKeyValue[];
	/** LogRecord droppedAttributesCount */
	droppedAttributesCount: number;
	/** LogRecord flags */
	flags?: number;
	/** LogRecord traceId */
	traceId?: string | Uint8Array;
	/** LogRecord spanId */
	spanId?: string | Uint8Array;
}
/**
 * Numerical value of the severity, normalized to values described in Log Data Model.
 */
declare enum ESeverityNumber {
	/** Unspecified. Do NOT use as default */
	SEVERITY_NUMBER_UNSPECIFIED = 0,
	SEVERITY_NUMBER_TRACE = 1,
	SEVERITY_NUMBER_TRACE2 = 2,
	SEVERITY_NUMBER_TRACE3 = 3,
	SEVERITY_NUMBER_TRACE4 = 4,
	SEVERITY_NUMBER_DEBUG = 5,
	SEVERITY_NUMBER_DEBUG2 = 6,
	SEVERITY_NUMBER_DEBUG3 = 7,
	SEVERITY_NUMBER_DEBUG4 = 8,
	SEVERITY_NUMBER_INFO = 9,
	SEVERITY_NUMBER_INFO2 = 10,
	SEVERITY_NUMBER_INFO3 = 11,
	SEVERITY_NUMBER_INFO4 = 12,
	SEVERITY_NUMBER_WARN = 13,
	SEVERITY_NUMBER_WARN2 = 14,
	SEVERITY_NUMBER_WARN3 = 15,
	SEVERITY_NUMBER_WARN4 = 16,
	SEVERITY_NUMBER_ERROR = 17,
	SEVERITY_NUMBER_ERROR2 = 18,
	SEVERITY_NUMBER_ERROR3 = 19,
	SEVERITY_NUMBER_ERROR4 = 20,
	SEVERITY_NUMBER_FATAL = 21,
	SEVERITY_NUMBER_FATAL2 = 22,
	SEVERITY_NUMBER_FATAL3 = 23,
	SEVERITY_NUMBER_FATAL4 = 24
}

declare function createExportTraceServiceRequest(spans: ReadableSpan[], options?: OtlpEncodingOptions): IExportTraceServiceRequest;

declare function createExportMetricsServiceRequest(resourceMetrics: ResourceMetrics[], options?: OtlpEncodingOptions): IExportMetricsServiceRequest;

declare function createExportLogsServiceRequest(logRecords: ReadableLogRecord[], options?: OtlpEncodingOptions): IExportLogsServiceRequest;

/**
 * Serializes and deserializes the OTLP request/response to and from {@link Uint8Array}
 */
interface ISerializer<Request, Response> {
	serializeRequest(request: Request): Uint8Array | undefined;
	deserializeResponse(data: Uint8Array): Response;
}

declare const ProtobufLogsSerializer: ISerializer<any[], any>;
declare const ProtobufMetricsSerializer: ISerializer<any[], any>;
declare const ProtobufTraceSerializer: ISerializer<any[], any>;

declare const JsonTraceSerializer: ISerializer<ReadableSpan[], IExportTraceServiceResponse>;
declare const JsonMetricsSerializer: ISerializer<ResourceMetrics[], IExportMetricsServiceResponse>;
declare const JsonLogsSerializer: ISerializer<ReadableLogRecord[], IExportLogsServiceResponse>;

export { EAggregationTemporality, ESeverityNumber, ESpanKind, EStatusCode, Encoder, Fixed64, HrTimeEncodeFunction, IAnyValue, IArrayValue, IBuckets, IEvent, IExemplar, IExponentialHistogram, IExponentialHistogramDataPoint, IExportLogsPartialSuccess, IExportLogsServiceRequest, IExportLogsServiceResponse, IExportMetricsPartialSuccess, IExportMetricsServiceRequest, IExportMetricsServiceResponse, IExportTracePartialSuccess, IExportTraceServiceRequest, IExportTraceServiceResponse, IGauge, IHistogram, IHistogramDataPoint, IInstrumentationScope, IKeyValue, IKeyValueList, ILink, ILogRecord, IMetric, INumberDataPoint, IResource, IResourceLogs, IResourceMetrics, IResourceSpans, IScopeLogs, IScopeMetrics, IScopeSpans, ISerializer, ISpan, IStatus, ISum, ISummary, ISummaryDataPoint, IValueAtQuantile, JsonLogsSerializer, JsonMetricsSerializer, JsonTraceSerializer, LongBits, OptionalSpanContextEncodeFunction, OtlpEncodingOptions, ProtobufLogsSerializer, ProtobufMetricsSerializer, ProtobufTraceSerializer, SpanContextEncodeFunction, createExportLogsServiceRequest, createExportMetricsServiceRequest, createExportTraceServiceRequest, encodeAsLongBits, encodeAsString, getOtlpEncoder, hrTimeToNanos, toLongBits };
