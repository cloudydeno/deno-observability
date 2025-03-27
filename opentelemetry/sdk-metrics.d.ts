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

import { ValueType, HrTime, Attributes, Context, MeterProvider as MeterProvider$1, MeterOptions, Meter } from './api.d.ts';
import { InstrumentationScope, ExportResult } from './core.d.ts';
import { Resource } from './resources.d.ts';

/**
 * AggregationTemporality indicates the way additive quantities are expressed.
 */
declare enum AggregationTemporality {
	DELTA = 0,
	CUMULATIVE = 1
}

/**
 * Supported types of metric instruments.
 */
declare enum InstrumentType {
	COUNTER = "COUNTER",
	GAUGE = "GAUGE",
	HISTOGRAM = "HISTOGRAM",
	UP_DOWN_COUNTER = "UP_DOWN_COUNTER",
	OBSERVABLE_COUNTER = "OBSERVABLE_COUNTER",
	OBSERVABLE_GAUGE = "OBSERVABLE_GAUGE",
	OBSERVABLE_UP_DOWN_COUNTER = "OBSERVABLE_UP_DOWN_COUNTER"
}
interface MetricDescriptor {
	readonly name: string;
	readonly description: string;
	readonly unit: string;
	readonly valueType: ValueType;
}
/**
 * Basic metric data fields.
 */
interface BaseMetricData {
	readonly descriptor: MetricDescriptor;
	readonly aggregationTemporality: AggregationTemporality;
	/**
	* DataPointType of the metric instrument.
	*/
	readonly dataPointType: DataPointType;
}
/**
 * Represents a metric data aggregated by either a LastValueAggregation or
 * SumAggregation.
 */
interface SumMetricData extends BaseMetricData {
	readonly dataPointType: DataPointType.SUM;
	readonly dataPoints: DataPoint<number>[];
	readonly isMonotonic: boolean;
}
interface GaugeMetricData extends BaseMetricData {
	readonly dataPointType: DataPointType.GAUGE;
	readonly dataPoints: DataPoint<number>[];
}
/**
 * Represents a metric data aggregated by a HistogramAggregation.
 */
interface HistogramMetricData extends BaseMetricData {
	readonly dataPointType: DataPointType.HISTOGRAM;
	readonly dataPoints: DataPoint<Histogram>[];
}
/**
 * Represents a metric data aggregated by a ExponentialHistogramAggregation.
 */
interface ExponentialHistogramMetricData extends BaseMetricData {
	readonly dataPointType: DataPointType.EXPONENTIAL_HISTOGRAM;
	readonly dataPoints: DataPoint<ExponentialHistogram>[];
}
/**
 * Represents an aggregated metric data.
 */
type MetricData = SumMetricData | GaugeMetricData | HistogramMetricData | ExponentialHistogramMetricData;
interface ScopeMetrics {
	scope: InstrumentationScope;
	metrics: MetricData[];
}
interface ResourceMetrics {
	resource: Resource;
	scopeMetrics: ScopeMetrics[];
}
/**
 * Represents the collection result of the metrics. If there are any
 * non-critical errors in the collection, like throwing in a single observable
 * callback, these errors are aggregated in the {@link CollectionResult.errors}
 * array and other successfully collected metrics are returned.
 */
interface CollectionResult {
	/**
	* Collected metrics.
	*/
	resourceMetrics: ResourceMetrics;
	/**
	* Arbitrary JavaScript exception values.
	*/
	errors: unknown[];
}
/**
 * The aggregated point data type.
 */
declare enum DataPointType {
	/**
	* A histogram data point contains a histogram statistics of collected
	* values with a list of explicit bucket boundaries and statistics such
	* as min, max, count, and sum of all collected values.
	*/
	HISTOGRAM = 0,
	/**
	* An exponential histogram data point contains a histogram statistics of
	* collected values where bucket boundaries are automatically calculated
	* using an exponential function, and statistics such as min, max, count,
	* and sum of all collected values.
	*/
	EXPONENTIAL_HISTOGRAM = 1,
	/**
	* A gauge metric data point has only a single numeric value.
	*/
	GAUGE = 2,
	/**
	* A sum metric data point has a single numeric value and a
	* monotonicity-indicator.
	*/
	SUM = 3
}
/**
 * Represents an aggregated point data with start time, end time and their
 * associated attributes and points.
 */
interface DataPoint<T> {
	/**
	* The start epoch timestamp of the DataPoint, usually the time when
	* the metric was created when the preferred AggregationTemporality is
	* CUMULATIVE, or last collection time otherwise.
	*/
	readonly startTime: HrTime;
	/**
	* The end epoch timestamp when data were collected, usually it represents
	* the moment when `MetricReader.collect` was called.
	*/
	readonly endTime: HrTime;
	/**
	* The attributes associated with this DataPoint.
	*/
	readonly attributes: Attributes;
	/**
	* The value for this DataPoint. The type of the value is indicated by the
	* {@link DataPointType}.
	*/
	readonly value: T;
}

/**
 * Error that is thrown on timeouts.
 */
declare class TimeoutError extends Error {
	constructor(message?: string);
}

/**
 * The {@link AttributesProcessor} is responsible for customizing which
 * attribute(s) are to be reported as metrics dimension(s) and adding
 * additional dimension(s) from the {@link Context}.
 */
interface IAttributesProcessor {
	/**
	* Process the metric instrument attributes.
	*
	* @param incoming The metric instrument attributes.
	* @param context The active context when the instrument is synchronous.
	* `undefined` otherwise.
	*/
	process: (incoming: Attributes, context?: Context) => Attributes;
}
/**
 * Create an {@link IAttributesProcessor} that filters by allowed attribute names and drops any names that are not in the
 * allow list.
 */
declare function createAllowListAttributesProcessor(attributeAllowList: string[]): IAttributesProcessor;
/**
 * Create an {@link IAttributesProcessor} that drops attributes based on the names provided in the deny list
 */
declare function createDenyListAttributesProcessor(attributeDenyList: string[]): IAttributesProcessor;

declare enum AggregationType {
	DEFAULT = 0,
	DROP = 1,
	SUM = 2,
	LAST_VALUE = 3,
	EXPLICIT_BUCKET_HISTOGRAM = 4,
	EXPONENTIAL_HISTOGRAM = 5
}
type SumAggregationOption = {
	type: AggregationType.SUM;
};
type LastValueAggregationOption = {
	type: AggregationType.LAST_VALUE;
};
type DropAggregationOption = {
	type: AggregationType.DROP;
};
type DefaultAggregationOption = {
	type: AggregationType.DEFAULT;
};
type HistogramAggregationOption = {
	type: AggregationType.EXPLICIT_BUCKET_HISTOGRAM;
	options?: {
		recordMinMax?: boolean;
		boundaries: number[];
	};
};
type ExponentialHistogramAggregationOption = {
	type: AggregationType.EXPONENTIAL_HISTOGRAM;
	options?: {
		recordMinMax?: boolean;
		maxSize?: number;
	};
};
type AggregationOption = ExponentialHistogramAggregationOption | HistogramAggregationOption | SumAggregationOption | DropAggregationOption | DefaultAggregationOption | LastValueAggregationOption;

type ViewOptions = {
	/**
	*  Alters the metric stream:
	*  This will be used as the name of the metrics stream.
	*  If not provided, the original Instrument name will be used.
	*/
	name?: string;
	/**
	* Alters the metric stream:
	* This will be used as the description of the metrics stream.
	* If not provided, the original Instrument description will be used by default.
	*
	* @example <caption>changes the description of all selected instruments to 'sample description'</caption>
	* description: 'sample description'
	*/
	description?: string;
	/**
	* Alters the metric stream:
	* If provided, the attributes will be modified as defined by the processors in the list. Processors are applied
	* in the order they're provided.
	* If not provided, all attribute keys will be used by default.
	*
	* @example <caption>drops all attributes with top-level keys except for 'myAttr' and 'myOtherAttr'</caption>
	* attributesProcessors: [createAllowListProcessor(['myAttr', 'myOtherAttr'])]
	* @example <caption>drops all attributes</caption>
	* attributesProcessors: [createAllowListProcessor([])]
	* @example <caption>allows all attributes except for 'myAttr'</caption>
	* attributesProcessors: [createDenyListProcessor(['myAttr']]
	*/
	attributesProcessors?: IAttributesProcessor[];
	/**
	* Alters the metric stream:
	* Alters the Aggregation of the metric stream.
	*
	* @example <caption>changes the aggregation of the selected instrument(s) to ExplicitBucketHistogramAggregation</caption>
	* aggregation: { type: AggregationType.EXPLICIT_BUCKET_HISTOGRAM, options: { boundaries: [1, 10, 100] } }
	* @example <caption>changes the aggregation of the selected instrument(s) to LastValueAggregation</caption>
	* aggregation: { type: AggregationType.LAST_VALUE, options: { boundaries: [1, 10, 100] } }
	*/
	aggregation?: AggregationOption;
	/**
	* Alters the metric stream:
	* Sets a limit on the number of unique attribute combinations (cardinality) that can be aggregated.
	* If not provided, the default limit will be used.
	*
	* @example <caption>sets the cardinality limit to 1000</caption>
	* aggregationCardinalityLimit: 1000
	*/
	aggregationCardinalityLimit?: number;
	/**
	* Instrument selection criteria:
	* The original type of the Instrument(s).
	*
	* @example <caption>selects all counters</caption>
	* instrumentType: InstrumentType.COUNTER
	* @example <caption>selects all histograms</caption>
	* instrumentType: InstrumentType.HISTOGRAM
	*/
	instrumentType?: InstrumentType;
	/**
	* Instrument selection criteria:
	* Original name of the Instrument(s) with wildcard support.
	*
	* @example <caption>select all instruments</caption>
	* instrumentName: '*'
	* @example <caption>select all instruments starting with 'my.instruments.'</caption>
	* instrumentName: 'my.instruments.*'
	* @example <caption>select all instruments named 'my.instrument.requests' exactly</caption>
	* instrumentName: 'my.instruments.requests'
	*/
	instrumentName?: string;
	/**
	* Instrument selection criteria:
	* The unit of the Instrument(s).
	*
	* @example <caption>select all instruments with unit 'ms'</caption>
	* instrumentUnit: 'ms'
	*/
	instrumentUnit?: string;
	/**
	* Instrument selection criteria:
	* The name of the Meter. No wildcard support, name must match the meter exactly.
	*
	* @example <caption>select all meters named 'example.component.app' exactly</caption>
	* meterName: 'example.component.app'
	*/
	meterName?: string;
	/**
	* Instrument selection criteria:
	* The version of the Meter. No wildcard support, version must match exactly.
	*
	* @example
	* meterVersion: '1.0.1'
	*/
	meterVersion?: string;
	/**
	* Instrument selection criteria:
	* The schema URL of the Meter. No wildcard support, schema URL must match exactly.
	*
	* @example <caption>Select all meters with schema URL 'https://example.com/schema' exactly.</caption>
	* meterSchemaUrl: 'https://example.com/schema'
	*/
	meterSchemaUrl?: string;
};

/** DataPoint value type for SumAggregation. */
type Sum = number;
/** DataPoint value type for LastValueAggregation. */
type LastValue = number;
/** DataPoint value type for HistogramAggregation. */
interface Histogram {
	/**
	* Buckets are implemented using two different arrays:
	*  - boundaries: contains every finite bucket boundary, which are inclusive upper bounds
	*  - counts: contains event counts for each bucket
	*
	* Note that we'll always have n+1 buckets, where n is the number of boundaries.
	* This is because we need to count events that are higher than the upper boundary.
	*
	* Example: if we measure the values: [5, 30, 5, 40, 5, 15, 15, 15, 25]
	*  with the boundaries [ 10, 20, 30 ], we will have the following state:
	*
	* buckets: {
	*	boundaries: [10, 20, 30],
	*	counts: [3, 3, 2, 1],
	* }
	*/
	buckets: {
		boundaries: number[];
		counts: number[];
	};
	sum?: number;
	count: number;
	min?: number;
	max?: number;
}
/** DataPoint value type for ExponentialHistogramAggregation. */
interface ExponentialHistogram {
	count: number;
	sum?: number;
	scale: number;
	zeroCount: number;
	positive: {
		offset: number;
		bucketCounts: number[];
	};
	negative: {
		offset: number;
		bucketCounts: number[];
	};
	min?: number;
	max?: number;
}

/**
 * Aggregation selector based on metric instrument types.
 */
type AggregationSelector = (instrumentType: InstrumentType) => AggregationOption;
/**
 * Aggregation temporality selector based on metric instrument types.
 */
type AggregationTemporalitySelector = (instrumentType: InstrumentType) => AggregationTemporality;

/**
 * An interface that allows different metric services to export recorded data
 * in their own format.
 *
 * To export data this MUST be registered to the Metrics SDK with a MetricReader.
 */
interface PushMetricExporter {
	/**
	* Called to export sampled {@link ResourceMetrics}.
	* @param metrics the metric data to be exported.
	* @param resultCallback callback for when the export has completed
	*/
	export(metrics: ResourceMetrics, resultCallback: (result: ExportResult) => void): void;
	/**
	* Ensure that the export of any metrics the exporter has received is
	* completed before the returned promise is settled.
	*/
	forceFlush(): Promise<void>;
	/**
	* Select the {@link AggregationTemporality} for the given
	* {@link InstrumentType} for this exporter.
	*/
	selectAggregationTemporality?(instrumentType: InstrumentType): AggregationTemporality;
	/**
	* Select the {@link Aggregation} for the given
	* {@link InstrumentType} for this exporter.
	*/
	selectAggregation?(instrumentType: InstrumentType): AggregationOption;
	/**
	* Returns a promise which resolves when the last exportation is completed.
	* Further calls to {@link PushMetricExporter.export} may not export the
	* data.
	*/
	shutdown(): Promise<void>;
}

interface MetricCollectOptions {
	/**
	* Timeout for the SDK to perform the involved asynchronous callback
	* functions.
	*
	* If the callback functions failed to finish the observation in time,
	* their results are discarded and an error is appended in the
	* {@link CollectionResult.errors}.
	*/
	timeoutMillis?: number;
}
/**
 * This is a public interface that represent an export state of a IMetricReader.
 */
interface MetricProducer {
	/**
	* Collects the metrics from the SDK. If there are asynchronous Instruments
	* involved, their callback functions will be triggered.
	*/
	collect(options?: MetricCollectOptions): Promise<CollectionResult>;
}

type CommonReaderOptions = {
	timeoutMillis?: number;
};
type CollectionOptions = CommonReaderOptions;
type ShutdownOptions = CommonReaderOptions;
type ForceFlushOptions = CommonReaderOptions;

/**
 * Cardinality Limit selector based on metric instrument types.
 */
type CardinalitySelector = (instrumentType: InstrumentType) => number;

interface MetricReaderOptions {
	/**
	* Aggregation selector based on metric instrument types. If no views are
	* configured for a metric instrument, a per-metric-reader aggregation is
	* selected with this selector.
	*
	* <p> NOTE: the provided function MUST be pure
	*/
	aggregationSelector?: AggregationSelector;
	/**
	* Aggregation temporality selector based on metric instrument types. If
	* not configured, cumulative is used for all instruments.
	*
	* <p> NOTE: the provided function MUST be pure
	*/
	aggregationTemporalitySelector?: AggregationTemporalitySelector;
	/**
	* Cardinality selector based on metric instrument types. If not configured,
	* a default value is used.
	*
	* <p> NOTE: the provided function MUST be pure
	*/
	cardinalitySelector?: CardinalitySelector;
	/**
	* **Note, this option is experimental**. Additional MetricProducers to use as a source of
	* aggregated metric data in addition to the SDK's metric data. The resource returned by
	* these MetricProducers is ignored; the SDK's resource will be used instead.
	* @experimental
	*/
	metricProducers?: MetricProducer[];
}
/**
 * Reads metrics from the SDK. Implementations MUST follow the Metric Reader Specification as well as the requirements
 * listed in this interface. Consider extending {@link MetricReader} to get a specification-compliant base implementation
 * of this interface
 */
interface IMetricReader {
	/**
	* Set the {@link MetricProducer} used by this instance. **This should only be called once by the
	* SDK and should be considered internal.**
	*
	* <p> NOTE: implementations MUST throw when called more than once
	*
	* @param metricProducer
	*/
	setMetricProducer(metricProducer: MetricProducer): void;
	/**
	* Select the {@link AggregationOption} for the given {@link InstrumentType} for this
	* reader.
	*
	* <p> NOTE: implementations MUST be pure
	*/
	selectAggregation(instrumentType: InstrumentType): AggregationOption;
	/**
	* Select the {@link AggregationTemporality} for the given
	* {@link InstrumentType} for this reader.
	*
	* <p> NOTE: implementations MUST be pure
	*/
	selectAggregationTemporality(instrumentType: InstrumentType): AggregationTemporality;
	/**
	* Select the cardinality limit for the given {@link InstrumentType} for this
	* reader.
	*
	* <p> NOTE: implementations MUST be pure
	*/
	selectCardinalityLimit(instrumentType: InstrumentType): number;
	/**
	* Collect all metrics from the associated {@link MetricProducer}
	*/
	collect(options?: CollectionOptions): Promise<CollectionResult>;
	/**
	* Shuts down the metric reader, the promise will reject after the optional timeout or resolve after completion.
	*
	* <p> NOTE: this operation MAY continue even after the promise rejects due to a timeout.
	* @param options options with timeout.
	*/
	shutdown(options?: ShutdownOptions): Promise<void>;
	/**
	* Flushes metrics read by this reader, the promise will reject after the optional timeout or resolve after completion.
	*
	* <p> NOTE: this operation MAY continue even after the promise rejects due to a timeout.
	* @param options options with timeout.
	*/
	forceFlush(options?: ForceFlushOptions): Promise<void>;
}
/**
 * A registered reader of metrics that, when linked to a {@link MetricProducer}, offers global
 * control over metrics.
 */
declare abstract class MetricReader implements IMetricReader {
	private _shutdown;
	private _metricProducers;
	private _sdkMetricProducer?;
	private readonly _aggregationTemporalitySelector;
	private readonly _aggregationSelector;
	private readonly _cardinalitySelector?;
	constructor(options?: MetricReaderOptions);
	setMetricProducer(metricProducer: MetricProducer): void;
	selectAggregation(instrumentType: InstrumentType): AggregationOption;
	selectAggregationTemporality(instrumentType: InstrumentType): AggregationTemporality;
	selectCardinalityLimit(instrumentType: InstrumentType): number;
	/**
	* Handle once the SDK has initialized this {@link MetricReader}
	* Overriding this method is optional.
	*/
	protected onInitialized(): void;
	/**
	* Handle a shutdown signal by the SDK.
	*
	* <p> For push exporters, this should shut down any intervals and close any open connections.
	* @protected
	*/
	protected abstract onShutdown(): Promise<void>;
	/**
	* Handle a force flush signal by the SDK.
	*
	* <p> In all scenarios metrics should be collected via {@link collect()}.
	* <p> For push exporters, this should collect and report metrics.
	* @protected
	*/
	protected abstract onForceFlush(): Promise<void>;
	collect(options?: CollectionOptions): Promise<CollectionResult>;
	shutdown(options?: ShutdownOptions): Promise<void>;
	forceFlush(options?: ForceFlushOptions): Promise<void>;
}

type PeriodicExportingMetricReaderOptions = {
	/**
	* The backing exporter for the metric reader.
	*/
	exporter: PushMetricExporter;
	/**
	* An internal milliseconds for the metric reader to initiate metric
	* collection.
	*/
	exportIntervalMillis?: number;
	/**
	* Milliseconds for the async observable callback to timeout.
	*/
	exportTimeoutMillis?: number;
	/**
	* **Note, this option is experimental**. Additional MetricProducers to use as a source of
	* aggregated metric data in addition to the SDK's metric data. The resource returned by
	* these MetricProducers is ignored; the SDK's resource will be used instead.
	* @experimental
	*/
	metricProducers?: MetricProducer[];
};
/**
 * {@link MetricReader} which collects metrics based on a user-configurable time interval, and passes the metrics to
 * the configured {@link PushMetricExporter}
 */
declare class PeriodicExportingMetricReader extends MetricReader {
	private _interval?;
	private _exporter;
	private readonly _exportInterval;
	private readonly _exportTimeout;
	constructor(options: PeriodicExportingMetricReaderOptions);
	private _runOnce;
	private _doRun;
	protected onInitialized(): void;
	protected onForceFlush(): Promise<void>;
	protected onShutdown(): Promise<void>;
}

/**
 * In-memory Metrics Exporter is a Push Metric Exporter
 * which accumulates metrics data in the local memory and
 * allows to inspect it (useful for e.g. unit tests).
 */
declare class InMemoryMetricExporter implements PushMetricExporter {
	protected _shutdown: boolean;
	protected _aggregationTemporality: AggregationTemporality;
	private _metrics;
	constructor(aggregationTemporality: AggregationTemporality);
	/**
	* @inheritedDoc
	*/
	export(metrics: ResourceMetrics, resultCallback: (result: ExportResult) => void): void;
	/**
	* Returns all the collected resource metrics
	* @returns ResourceMetrics[]
	*/
	getMetrics(): ResourceMetrics[];
	forceFlush(): Promise<void>;
	reset(): void;
	selectAggregationTemporality(_instrumentType: InstrumentType): AggregationTemporality;
	shutdown(): Promise<void>;
}

interface ConsoleMetricExporterOptions {
	temporalitySelector?: AggregationTemporalitySelector;
}
/**
 * This is an implementation of {@link PushMetricExporter} that prints metrics to the
 * console. This class can be used for diagnostic purposes.
 *
 * NOTE: This {@link PushMetricExporter} is intended for diagnostics use only, output rendered to the console may change at any time.
 */
declare class ConsoleMetricExporter implements PushMetricExporter {
	protected _shutdown: boolean;
	protected _temporalitySelector: AggregationTemporalitySelector;
	constructor(options?: ConsoleMetricExporterOptions);
	export(metrics: ResourceMetrics, resultCallback: (result: ExportResult) => void): void;
	forceFlush(): Promise<void>;
	selectAggregationTemporality(_instrumentType: InstrumentType): AggregationTemporality;
	shutdown(): Promise<void>;
	private static _sendMetrics;
}

/**
 * MeterProviderOptions provides an interface for configuring a MeterProvider.
 */
interface MeterProviderOptions {
	/** Resource associated with metric telemetry  */
	resource?: Resource;
	views?: ViewOptions[];
	readers?: IMetricReader[];
}
/**
 * This class implements the {@link MeterProvider} interface.
 */
declare class MeterProvider implements MeterProvider$1 {
	private _sharedState;
	private _shutdown;
	constructor(options?: MeterProviderOptions);
	/**
	* Get a meter with the configuration of the MeterProvider.
	*/
	getMeter(name: string, version?: string, options?: MeterOptions): Meter;
	/**
	* Shut down the MeterProvider and all registered
	* MetricReaders.
	*
	* Returns a promise which is resolved when all flushes are complete.
	*/
	shutdown(options?: ShutdownOptions): Promise<void>;
	/**
	* Notifies all registered MetricReaders to flush any buffered data.
	*
	* Returns a promise which is resolved when all flushes are complete.
	*/
	forceFlush(options?: ForceFlushOptions): Promise<void>;
}

export { AggregationOption, AggregationSelector, AggregationTemporality, AggregationTemporalitySelector, AggregationType, CollectionResult, ConsoleMetricExporter, DataPoint, DataPointType, ExponentialHistogram, ExponentialHistogramMetricData, GaugeMetricData, Histogram, HistogramMetricData, IAttributesProcessor, IMetricReader, InMemoryMetricExporter, InstrumentType, LastValue, MeterProvider, MeterProviderOptions, MetricCollectOptions, MetricData, MetricDescriptor, MetricProducer, MetricReader, MetricReaderOptions, PeriodicExportingMetricReader, PeriodicExportingMetricReaderOptions, PushMetricExporter, ResourceMetrics, ScopeMetrics, Sum, SumMetricData, TimeoutError, ViewOptions, createAllowListAttributesProcessor, createDenyListAttributesProcessor };
