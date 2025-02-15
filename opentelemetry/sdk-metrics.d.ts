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

import * as _opentelemetry_api from './api.d.ts';
import { MetricAttributes, Context, HrTime, ValueType, MeterProvider as MeterProvider$1, MeterOptions, Meter } from './api.d.ts';
import { InstrumentationScope, ExportResult } from './core.d.ts';
import { IResource } from './resources.d.ts';

/**
 * The {@link AttributesProcessor} is responsible for customizing which
 * attribute(s) are to be reported as metrics dimension(s) and adding
 * additional dimension(s) from the {@link Context}.
 */
declare abstract class AttributesProcessor {
	/**
	* Process the metric instrument attributes.
	*
	* @param incoming The metric instrument attributes.
	* @param context The active context when the instrument is synchronous.
	* `undefined` otherwise.
	*/
	abstract process(incoming: MetricAttributes, context?: Context): MetricAttributes;
	static Noop(): NoopAttributesProcessor;
}
declare class NoopAttributesProcessor extends AttributesProcessor {
	process(incoming: MetricAttributes, _context?: Context): _opentelemetry_api.Attributes;
}

interface Predicate {
	match(str: string): boolean;
}

interface InstrumentSelectorCriteria {
	name?: string;
	type?: InstrumentType;
	unit?: string;
}
declare class InstrumentSelector {
	private _nameFilter;
	private _type?;
	private _unitFilter;
	constructor(criteria?: InstrumentSelectorCriteria);
	getType(): InstrumentType | undefined;
	getNameFilter(): Predicate;
	getUnitFilter(): Predicate;
}

interface MeterSelectorCriteria {
	name?: string;
	version?: string;
	schemaUrl?: string;
}
declare class MeterSelector {
	private _nameFilter;
	private _versionFilter;
	private _schemaUrlFilter;
	constructor(criteria?: MeterSelectorCriteria);
	getNameFilter(): Predicate;
	/**
	* TODO: semver filter? no spec yet.
	*/
	getVersionFilter(): Predicate;
	getSchemaUrlFilter(): Predicate;
}

/**
 * AggregationTemporality indicates the way additive quantities are expressed.
 */
declare enum AggregationTemporality {
	DELTA = 0,
	CUMULATIVE = 1
}

declare type Maybe<T> = T | undefined;
/**
 * Error that is thrown on timeouts.
 */
declare class TimeoutError extends Error {
	constructor(message?: string);
}

/** The kind of aggregator. */
declare enum AggregatorKind {
	DROP = 0,
	SUM = 1,
	LAST_VALUE = 2,
	HISTOGRAM = 3,
	EXPONENTIAL_HISTOGRAM = 4
}
/** DataPoint value type for SumAggregation. */
declare type Sum = number;
/** DataPoint value type for LastValueAggregation. */
declare type LastValue = number;
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
 * An Aggregator accumulation state.
 */
interface Accumulation {
	setStartTime(startTime: HrTime): void;
	record(value: number): void;
}
declare type AccumulationRecord<T> = [MetricAttributes, T];
/**
 * Base interface for aggregators. Aggregators are responsible for holding
 * aggregated values and taking a snapshot of these values upon export.
 */
interface Aggregator<T> {
	/** The kind of the aggregator. */
	kind: AggregatorKind;
	/**
	* Create a clean state of accumulation.
	*/
	createAccumulation(startTime: HrTime): T;
	/**
	* Returns the result of the merge of the given accumulations.
	*
	* This should always assume that the accumulations do not overlap and merge together for a new
	* cumulative report.
	*
	* @param previous the previously captured accumulation
	* @param delta the newly captured (delta) accumulation
	* @returns the result of the merge of the given accumulations
	*/
	merge(previous: T, delta: T): T;
	/**
	* Returns a new DELTA aggregation by comparing two cumulative measurements.
	*
	* @param previous the previously captured accumulation
	* @param current the newly captured (cumulative) accumulation
	* @returns The resulting delta accumulation
	*/
	diff(previous: T, current: T): T;
	/**
	* Returns the {@link MetricData} that this {@link Aggregator} will produce.
	*
	* @param descriptor the metric descriptor.
	* @param aggregationTemporality the temporality of the resulting {@link MetricData}
	* @param accumulationByAttributes the array of attributes and accumulation pairs.
	* @param endTime the end time of the metric data.
	* @return the {@link MetricData} that this {@link Aggregator} will produce.
	*/
	toMetricData(descriptor: MetricDescriptor, aggregationTemporality: AggregationTemporality, accumulationByAttributes: AccumulationRecord<T>[], endTime: HrTime): Maybe<MetricData>;
}

/** Basic aggregator for None which keeps no recorded value. */
declare class DropAggregator implements Aggregator<undefined> {
	kind: AggregatorKind.DROP;
	createAccumulation(): undefined;
	merge(_previous: undefined, _delta: undefined): undefined;
	diff(_previous: undefined, _current: undefined): undefined;
	toMetricData(_descriptor: MetricDescriptor, _aggregationTemporality: AggregationTemporality, _accumulationByAttributes: AccumulationRecord<undefined>[], _endTime: HrTime): Maybe<MetricData>;
}

/**
 * Internal value type for HistogramAggregation.
 * Differs from the exported type as undefined sum/min/max complicate arithmetic
 * performed by this aggregation, but are required to be undefined in the exported types.
 */
interface InternalHistogram$1 {
	buckets: {
		boundaries: number[];
		counts: number[];
	};
	sum: number;
	count: number;
	hasMinMax: boolean;
	min: number;
	max: number;
}
declare class HistogramAccumulation implements Accumulation {
	startTime: HrTime;
	private readonly _boundaries;
	private _recordMinMax;
	private _current;
	constructor(startTime: HrTime, _boundaries: number[], _recordMinMax?: boolean, _current?: InternalHistogram$1);
	record(value: number): void;
	setStartTime(startTime: HrTime): void;
	toPointValue(): InternalHistogram$1;
}
/**
 * Basic aggregator which observes events and counts them in pre-defined buckets
 * and provides the total sum and count of all observations.
 */
declare class HistogramAggregator implements Aggregator<HistogramAccumulation> {
	private readonly _boundaries;
	private readonly _recordMinMax;
	kind: AggregatorKind.HISTOGRAM;
	/**
	* @param _boundaries sorted upper bounds of recorded values.
	* @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
	*/
	constructor(_boundaries: number[], _recordMinMax: boolean);
	createAccumulation(startTime: HrTime): HistogramAccumulation;
	/**
	* Return the result of the merge of two histogram accumulations. As long as one Aggregator
	* instance produces all Accumulations with constant boundaries we don't need to worry about
	* merging accumulations with different boundaries.
	*/
	merge(previous: HistogramAccumulation, delta: HistogramAccumulation): HistogramAccumulation;
	/**
	* Returns a new DELTA aggregation by comparing two cumulative measurements.
	*/
	diff(previous: HistogramAccumulation, current: HistogramAccumulation): HistogramAccumulation;
	toMetricData(descriptor: MetricDescriptor, aggregationTemporality: AggregationTemporality, accumulationByAttributes: AccumulationRecord<HistogramAccumulation>[], endTime: HrTime): Maybe<HistogramMetricData>;
}

declare class Buckets {
	backing: BucketsBacking;
	indexBase: number;
	indexStart: number;
	indexEnd: number;
	/**
	* The term index refers to the number of the exponential histogram bucket
	* used to determine its boundaries. The lower boundary of a bucket is
	* determined by base ** index and the upper boundary of a bucket is
	* determined by base ** (index + 1). index values are signed to account
	* for values less than or equal to 1.
	*
	* indexBase is the index of the 0th position in the
	* backing array, i.e., backing[0] is the count
	* in the bucket with index `indexBase`.
	*
	* indexStart is the smallest index value represented
	* in the backing array.
	*
	* indexEnd is the largest index value represented in
	* the backing array.
	*/
	constructor(backing?: BucketsBacking, indexBase?: number, indexStart?: number, indexEnd?: number);
	/**
	* Offset is the bucket index of the smallest entry in the counts array
	* @returns {number}
	*/
	get offset(): number;
	/**
	* Buckets is a view into the backing array.
	* @returns {number}
	*/
	get length(): number;
	/**
	* An array of counts, where count[i] carries the count
	* of the bucket at index (offset+i).  count[i] is the count of
	* values greater than base^(offset+i) and less than or equal to
	* base^(offset+i+1).
	* @returns {number} The logical counts based on the backing array
	*/
	counts(): number[];
	/**
	* At returns the count of the bucket at a position in the logical
	* array of counts.
	* @param position
	* @returns {number}
	*/
	at(position: number): number;
	/**
	* incrementBucket increments the backing array index by `increment`
	* @param bucketIndex
	* @param increment
	*/
	incrementBucket(bucketIndex: number, increment: number): void;
	/**
	* decrementBucket decrements the backing array index by `decrement`
	* if decrement is greater than the current value, it's set to 0.
	* @param bucketIndex
	* @param decrement
	*/
	decrementBucket(bucketIndex: number, decrement: number): void;
	/**
	* trim removes leading and / or trailing zero buckets (which can occur
	* after diffing two histos) and rotates the backing array so that the
	* smallest non-zero index is in the 0th position of the backing array
	*/
	trim(): void;
	/**
	* downscale first rotates, then collapses 2**`by`-to-1 buckets.
	* @param by
	*/
	downscale(by: number): void;
	/**
	* Clone returns a deep copy of Buckets
	* @returns {Buckets}
	*/
	clone(): Buckets;
	/**
	* _rotate shifts the backing array contents so that indexStart ==
	* indexBase to simplify the downscale logic.
	*/
	private _rotate;
	/**
	* _relocateBucket adds the count in counts[src] to counts[dest] and
	* resets count[src] to zero.
	*/
	private _relocateBucket;
}
/**
 * BucketsBacking holds the raw buckets and some utility methods to
 * manage them.
 */
declare class BucketsBacking {
	private _counts;
	constructor(_counts?: number[]);
	/**
	* length returns the physical size of the backing array, which
	* is >= buckets.length()
	*/
	get length(): number;
	/**
	* countAt returns the count in a specific bucket
	*/
	countAt(pos: number): number;
	/**
	* growTo grows a backing array and copies old entries
	* into their correct new positions.
	*/
	growTo(newSize: number, oldPositiveLimit: number, newPositiveLimit: number): void;
	/**
	* reverse the items in the backing array in the range [from, limit).
	*/
	reverse(from: number, limit: number): void;
	/**
	* emptyBucket empties the count from a bucket, for
	* moving into another.
	*/
	emptyBucket(src: number): number;
	/**
	* increments a bucket by `increment`
	*/
	increment(bucketIndex: number, increment: number): void;
	/**
	* decrements a bucket by `decrement`
	*/
	decrement(bucketIndex: number, decrement: number): void;
	/**
	* clone returns a deep copy of BucketsBacking
	*/
	clone(): BucketsBacking;
}

/**
 * The mapping interface is used by the exponential histogram to determine
 * where to bucket values. The interface is implemented by ExponentMapping,
 * used for scales [-10, 0] and LogarithmMapping, used for scales [1, 20].
 */
interface Mapping {
	mapToIndex(value: number): number;
	lowerBoundary(index: number): number;
	get scale(): number;
}

/**
 * Internal value type for ExponentialHistogramAggregation.
 * Differs from the exported type as undefined sum/min/max complicate arithmetic
 * performed by this aggregation, but are required to be undefined in the exported types.
 */
interface InternalHistogram extends ExponentialHistogram {
	hasMinMax: boolean;
	min: number;
	max: number;
	sum: number;
}
declare class ExponentialHistogramAccumulation implements Accumulation {
	startTime: HrTime;
	private _maxSize;
	private _recordMinMax;
	private _sum;
	private _count;
	private _zeroCount;
	private _min;
	private _max;
	private _positive;
	private _negative;
	private _mapping;
	constructor(startTime?: HrTime, _maxSize?: number, _recordMinMax?: boolean, _sum?: number, _count?: number, _zeroCount?: number, _min?: number, _max?: number, _positive?: Buckets, _negative?: Buckets, _mapping?: Mapping);
	/**
	* record updates a histogram with a single count
	* @param {Number} value
	*/
	record(value: number): void;
	/**
	* Sets the start time for this accumulation
	* @param {HrTime} startTime
	*/
	setStartTime(startTime: HrTime): void;
	/**
	* Returns the datapoint representation of this accumulation
	* @param {HrTime} startTime
	*/
	toPointValue(): InternalHistogram;
	/**
	* @returns {Number} The sum of values recorded by this accumulation
	*/
	get sum(): number;
	/**
	* @returns {Number} The minimum value recorded by this accumulation
	*/
	get min(): number;
	/**
	* @returns {Number} The maximum value recorded by this accumulation
	*/
	get max(): number;
	/**
	* @returns {Number} The count of values recorded by this accumulation
	*/
	get count(): number;
	/**
	* @returns {Number} The number of 0 values recorded by this accumulation
	*/
	get zeroCount(): number;
	/**
	* @returns {Number} The scale used by this accumulation
	*/
	get scale(): number;
	/**
	* positive holds the positive values
	* @returns {Buckets}
	*/
	get positive(): Buckets;
	/**
	* negative holds the negative values by their absolute value
	* @returns {Buckets}
	*/
	get negative(): Buckets;
	/**
	* updateByIncr supports updating a histogram with a non-negative
	* increment.
	* @param value
	* @param increment
	*/
	updateByIncrement(value: number, increment: number): void;
	/**
	* merge combines data from previous value into self
	* @param {ExponentialHistogramAccumulation} previous
	*/
	merge(previous: ExponentialHistogramAccumulation): void;
	/**
	* diff subtracts other from self
	* @param {ExponentialHistogramAccumulation} other
	*/
	diff(other: ExponentialHistogramAccumulation): void;
	/**
	* clone returns a deep copy of self
	* @returns {ExponentialHistogramAccumulation}
	*/
	clone(): ExponentialHistogramAccumulation;
	/**
	* _updateBuckets maps the incoming value to a bucket index for the current
	* scale. If the bucket index is outside of the range of the backing array,
	* it will rescale the backing array and update the mapping for the new scale.
	*/
	private _updateBuckets;
	/**
	* _incrementIndexBy increments the count of the bucket specified by `index`.
	* If the index is outside of the range [buckets.indexStart, buckets.indexEnd]
	* the boundaries of the backing array will be adjusted and more buckets will
	* be added if needed.
	*/
	private _incrementIndexBy;
	/**
	* grow resizes the backing array by doubling in size up to maxSize.
	* This extends the array with a bunch of zeros and copies the
	* existing counts to the same position.
	*/
	private _grow;
	/**
	* _changeScale computes how much downscaling is needed by shifting the
	* high and low values until they are separated by no more than size.
	*/
	private _changeScale;
	/**
	* _downscale subtracts `change` from the current mapping scale.
	*/
	private _downscale;
	/**
	* _minScale is used by diff and merge to compute an ideal combined scale
	*/
	private _minScale;
	/**
	* _highLowAtScale is used by diff and merge to compute an ideal combined scale.
	*/
	private _highLowAtScale;
	/**
	* _mergeBuckets translates index values from another histogram and
	* adds the values into the corresponding buckets of this histogram.
	*/
	private _mergeBuckets;
	/**
	* _diffBuckets translates index values from another histogram and
	* subtracts the values in the corresponding buckets of this histogram.
	*/
	private _diffBuckets;
}
/**
 * Aggregator for ExponentialHistogramAccumulations
 */
declare class ExponentialHistogramAggregator implements Aggregator<ExponentialHistogramAccumulation> {
	readonly _maxSize: number;
	private readonly _recordMinMax;
	kind: AggregatorKind.EXPONENTIAL_HISTOGRAM;
	/**
	* @param _maxSize Maximum number of buckets for each of the positive
	*    and negative ranges, exclusive of the zero-bucket.
	* @param _recordMinMax If set to true, min and max will be recorded.
	*    Otherwise, min and max will not be recorded.
	*/
	constructor(_maxSize: number, _recordMinMax: boolean);
	createAccumulation(startTime: HrTime): ExponentialHistogramAccumulation;
	/**
	* Return the result of the merge of two exponential histogram accumulations.
	*/
	merge(previous: ExponentialHistogramAccumulation, delta: ExponentialHistogramAccumulation): ExponentialHistogramAccumulation;
	/**
	* Returns a new DELTA aggregation by comparing two cumulative measurements.
	*/
	diff(previous: ExponentialHistogramAccumulation, current: ExponentialHistogramAccumulation): ExponentialHistogramAccumulation;
	toMetricData(descriptor: MetricDescriptor, aggregationTemporality: AggregationTemporality, accumulationByAttributes: AccumulationRecord<ExponentialHistogramAccumulation>[], endTime: HrTime): Maybe<ExponentialHistogramMetricData>;
}

declare class LastValueAccumulation implements Accumulation {
	startTime: HrTime;
	private _current;
	sampleTime: HrTime;
	constructor(startTime: HrTime, _current?: number, sampleTime?: HrTime);
	record(value: number): void;
	setStartTime(startTime: HrTime): void;
	toPointValue(): LastValue;
}
/** Basic aggregator which calculates a LastValue from individual measurements. */
declare class LastValueAggregator implements Aggregator<LastValueAccumulation> {
	kind: AggregatorKind.LAST_VALUE;
	createAccumulation(startTime: HrTime): LastValueAccumulation;
	/**
	* Returns the result of the merge of the given accumulations.
	*
	* Return the newly captured (delta) accumulation for LastValueAggregator.
	*/
	merge(previous: LastValueAccumulation, delta: LastValueAccumulation): LastValueAccumulation;
	/**
	* Returns a new DELTA aggregation by comparing two cumulative measurements.
	*
	* A delta aggregation is not meaningful to LastValueAggregator, just return
	* the newly captured (delta) accumulation for LastValueAggregator.
	*/
	diff(previous: LastValueAccumulation, current: LastValueAccumulation): LastValueAccumulation;
	toMetricData(descriptor: MetricDescriptor, aggregationTemporality: AggregationTemporality, accumulationByAttributes: AccumulationRecord<LastValueAccumulation>[], endTime: HrTime): Maybe<GaugeMetricData>;
}

declare class SumAccumulation implements Accumulation {
	startTime: HrTime;
	monotonic: boolean;
	private _current;
	reset: boolean;
	constructor(startTime: HrTime, monotonic: boolean, _current?: number, reset?: boolean);
	record(value: number): void;
	setStartTime(startTime: HrTime): void;
	toPointValue(): Sum;
}
/** Basic aggregator which calculates a Sum from individual measurements. */
declare class SumAggregator implements Aggregator<SumAccumulation> {
	monotonic: boolean;
	kind: AggregatorKind.SUM;
	constructor(monotonic: boolean);
	createAccumulation(startTime: HrTime): SumAccumulation;
	/**
	* Returns the result of the merge of the given accumulations.
	*/
	merge(previous: SumAccumulation, delta: SumAccumulation): SumAccumulation;
	/**
	* Returns a new DELTA aggregation by comparing two cumulative measurements.
	*/
	diff(previous: SumAccumulation, current: SumAccumulation): SumAccumulation;
	toMetricData(descriptor: MetricDescriptor, aggregationTemporality: AggregationTemporality, accumulationByAttributes: AccumulationRecord<SumAccumulation>[], endTime: HrTime): Maybe<SumMetricData>;
}

/**
 * Configures how measurements are combined into metrics for views.
 *
 * Aggregation provides a set of built-in aggregations via static methods.
 */
declare abstract class Aggregation {
	abstract createAggregator(instrument: InstrumentDescriptor$1): Aggregator<Maybe<Accumulation>>;
	static Drop(): Aggregation;
	static Sum(): Aggregation;
	static LastValue(): Aggregation;
	static Histogram(): Aggregation;
	static ExponentialHistogram(): Aggregation;
	static Default(): Aggregation;
}
/**
 * The default drop aggregation.
 */
declare class DropAggregation extends Aggregation {
	private static DEFAULT_INSTANCE;
	createAggregator(_instrument: InstrumentDescriptor$1): DropAggregator;
}
/**
 * The default sum aggregation.
 */
declare class SumAggregation extends Aggregation {
	private static MONOTONIC_INSTANCE;
	private static NON_MONOTONIC_INSTANCE;
	createAggregator(instrument: InstrumentDescriptor$1): SumAggregator;
}
/**
 * The default last value aggregation.
 */
declare class LastValueAggregation extends Aggregation {
	private static DEFAULT_INSTANCE;
	createAggregator(_instrument: InstrumentDescriptor$1): LastValueAggregator;
}
/**
 * The default histogram aggregation.
 */
declare class HistogramAggregation extends Aggregation {
	private static DEFAULT_INSTANCE;
	createAggregator(_instrument: InstrumentDescriptor$1): HistogramAggregator;
}
/**
 * The explicit bucket histogram aggregation.
 */
declare class ExplicitBucketHistogramAggregation extends Aggregation {
	private readonly _recordMinMax;
	private _boundaries;
	/**
	* @param boundaries the bucket boundaries of the histogram aggregation
	* @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
	*/
	constructor(boundaries: number[], _recordMinMax?: boolean);
	createAggregator(_instrument: InstrumentDescriptor$1): HistogramAggregator;
}
declare class ExponentialHistogramAggregation extends Aggregation {
	private readonly _maxSize;
	private readonly _recordMinMax;
	constructor(_maxSize?: number, _recordMinMax?: boolean);
	createAggregator(_instrument: InstrumentDescriptor$1): ExponentialHistogramAggregator;
}
/**
 * The default aggregation.
 */
declare class DefaultAggregation extends Aggregation {
	private _resolve;
	createAggregator(instrument: InstrumentDescriptor$1): Aggregator<Maybe<Accumulation>>;
}

declare type ViewOptions = {
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
	* If provided, the attributes that are not in the list will be ignored.
	* If not provided, all attribute keys will be used by default.
	*
	* @example <caption>drops all attributes with top-level keys except for 'myAttr' and 'myOtherAttr'</caption>
	* attributeKeys: ['myAttr', 'myOtherAttr']
	* @example <caption>drops all attributes</caption>
	* attributeKeys: []
	*/
	attributeKeys?: string[];
	/**
	* Alters the metric stream:
	* Alters the {@link Aggregation} of the metric stream.
	*
	* @example <caption>changes the aggregation of the selected instrument(s) to ExplicitBucketHistogramAggregation</caption>
	* aggregation: new ExplicitBucketHistogramAggregation([1, 10, 100])
	* @example <caption>changes the aggregation of the selected instrument(s) to LastValueAggregation</caption>
	* aggregation: new LastValueAggregation()
	*/
	aggregation?: Aggregation;
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
/**
 * Can be passed to a {@link MeterProvider} to select instruments and alter their metric stream.
 */
declare class View {
	readonly name?: string;
	readonly description?: string;
	readonly aggregation: Aggregation;
	readonly attributesProcessor: AttributesProcessor;
	readonly instrumentSelector: InstrumentSelector;
	readonly meterSelector: MeterSelector;
	/**
	* Create a new {@link View} instance.
	*
	* Parameters can be categorized as two types:
	*  Instrument selection criteria: Used to describe the instrument(s) this view will be applied to.
	*  Will be treated as additive (the Instrument has to meet all the provided criteria to be selected).
	*
	*  Metric stream altering: Alter the metric stream of instruments selected by instrument selection criteria.
	*
	* @param viewOptions {@link ViewOptions} for altering the metric stream and instrument selection.
	* @param viewOptions.name
	* Alters the metric stream:
	*  This will be used as the name of the metrics stream.
	*  If not provided, the original Instrument name will be used.
	* @param viewOptions.description
	* Alters the metric stream:
	*  This will be used as the description of the metrics stream.
	*  If not provided, the original Instrument description will be used by default.
	* @param viewOptions.attributeKeys
	* Alters the metric stream:
	*  If provided, the attributes that are not in the list will be ignored.
	*  If not provided, all attribute keys will be used by default.
	* @param viewOptions.aggregation
	* Alters the metric stream:
	*  Alters the {@link Aggregation} of the metric stream.
	* @param viewOptions.instrumentName
	* Instrument selection criteria:
	*  Original name of the Instrument(s) with wildcard support.
	* @param viewOptions.instrumentType
	* Instrument selection criteria:
	*  The original type of the Instrument(s).
	* @param viewOptions.instrumentUnit
	* Instrument selection criteria:
	*  The unit of the Instrument(s).
	* @param viewOptions.meterName
	* Instrument selection criteria:
	*  The name of the Meter. No wildcard support, name must match the meter exactly.
	* @param viewOptions.meterVersion
	* Instrument selection criteria:
	*  The version of the Meter. No wildcard support, version must match exactly.
	* @param viewOptions.meterSchemaUrl
	* Instrument selection criteria:
	*  The schema URL of the Meter. No wildcard support, schema URL must match exactly.
	*
	* @example
	* // Create a view that changes the Instrument 'my.instrument' to use to an
	* // ExplicitBucketHistogramAggregation with the boundaries [20, 30, 40]
	* new View({
	*   aggregation: new ExplicitBucketHistogramAggregation([20, 30, 40]),
	*   instrumentName: 'my.instrument'
	* })
	*/
	constructor(viewOptions: ViewOptions);
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
/**
 * An internal interface describing the instrument.
 *
 * This is intentionally distinguished from the public MetricDescriptor (a.k.a. InstrumentDescriptor)
 * which may not contains internal fields like metric advice.
 */
interface InstrumentDescriptor$1 {
	readonly name: string;
	readonly description: string;
	readonly unit: string;
	readonly type: InstrumentType;
	readonly valueType: ValueType;
	/**
	* @experimental
	*
	* This is intentionally not using the API's type as it's only available from @opentelemetry/api 1.7.0 and up.
	* In SDK 2.0 we'll be able to bump the minimum API version and remove this workaround.
	*/
	readonly advice: {
		/**
		* Hint the explicit bucket boundaries for SDK if the metric has been
		* aggregated with a HistogramAggregator.
		*/
		explicitBucketBoundaries?: number[];
	};
}

interface MetricDescriptor {
	readonly name: string;
	readonly description: string;
	readonly unit: string;
	/**
	* @deprecated exporter should avoid depending on the type of the instrument
	* as their resulting aggregator can be re-mapped with views.
	*/
	readonly type: InstrumentType;
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
declare type MetricData = SumMetricData | GaugeMetricData | HistogramMetricData | ExponentialHistogramMetricData;
interface ScopeMetrics {
	scope: InstrumentationScope;
	metrics: MetricData[];
}
interface ResourceMetrics {
	resource: IResource;
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
	readonly attributes: MetricAttributes;
	/**
	* The value for this DataPoint. The type of the value is indicated by the
	* {@link DataPointType}.
	*/
	readonly value: T;
}

/**
 * Aggregation selector based on metric instrument types.
 */
declare type AggregationSelector = (instrumentType: InstrumentType) => Aggregation;
/**
 * Aggregation temporality selector based on metric instrument types.
 */
declare type AggregationTemporalitySelector = (instrumentType: InstrumentType) => AggregationTemporality;

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
	selectAggregation?(instrumentType: InstrumentType): Aggregation;
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
 * This is a public interface that represent an export state of a MetricReader.
 */
interface MetricProducer {
	/**
	* Collects the metrics from the SDK. If there are asynchronous Instruments
	* involved, their callback functions will be triggered.
	*/
	collect(options?: MetricCollectOptions): Promise<CollectionResult>;
}

declare type CommonReaderOptions = {
	timeoutMillis?: number;
};
declare type CollectionOptions = CommonReaderOptions;
declare type ShutdownOptions = CommonReaderOptions;
declare type ForceFlushOptions = CommonReaderOptions;

interface MetricReaderOptions {
	/**
	* Aggregation selector based on metric instrument types. If no views are
	* configured for a metric instrument, a per-metric-reader aggregation is
	* selected with this selector.
	*/
	aggregationSelector?: AggregationSelector;
	/**
	* Aggregation temporality selector based on metric instrument types. If
	* not configured, cumulative is used for all instruments.
	*/
	aggregationTemporalitySelector?: AggregationTemporalitySelector;
	/**
	* **Note, this option is experimental**. Additional MetricProducers to use as a source of
	* aggregated metric data in addition to the SDK's metric data. The resource returned by
	* these MetricProducers is ignored; the SDK's resource will be used instead.
	* @experimental
	*/
	metricProducers?: MetricProducer[];
}
/**
 * A registered reader of metrics that, when linked to a {@link MetricProducer}, offers global
 * control over metrics.
 */
declare abstract class MetricReader {
	private _shutdown;
	private _metricProducers;
	private _sdkMetricProducer?;
	private readonly _aggregationTemporalitySelector;
	private readonly _aggregationSelector;
	constructor(options?: MetricReaderOptions);
	/**
	* Set the {@link MetricProducer} used by this instance. **This should only be called by the
	* SDK and should be considered internal.**
	*
	* To add additional {@link MetricProducer}s to a {@link MetricReader}, pass them to the
	* constructor as {@link MetricReaderOptions.metricProducers}.
	*
	* @internal
	* @param metricProducer
	*/
	setMetricProducer(metricProducer: MetricProducer): void;
	/**
	* Select the {@link Aggregation} for the given {@link InstrumentType} for this
	* reader.
	*/
	selectAggregation(instrumentType: InstrumentType): Aggregation;
	/**
	* Select the {@link AggregationTemporality} for the given
	* {@link InstrumentType} for this reader.
	*/
	selectAggregationTemporality(instrumentType: InstrumentType): AggregationTemporality;
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
	/**
	* Collect all metrics from the associated {@link MetricProducer}
	*/
	collect(options?: CollectionOptions): Promise<CollectionResult>;
	/**
	* Shuts down the metric reader, the promise will reject after the optional timeout or resolve after completion.
	*
	* <p> NOTE: this operation will continue even after the promise rejects due to a timeout.
	* @param options options with timeout.
	*/
	shutdown(options?: ShutdownOptions): Promise<void>;
	/**
	* Flushes metrics read by this reader, the promise will reject after the optional timeout or resolve after completion.
	*
	* <p> NOTE: this operation will continue even after the promise rejects due to a timeout.
	* @param options options with timeout.
	*/
	forceFlush(options?: ForceFlushOptions): Promise<void>;
}

declare type PeriodicExportingMetricReaderOptions = {
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
	resource?: IResource;
	views?: View[];
	readers?: MetricReader[];
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
	* Register a {@link MetricReader} to the meter provider. After the
	* registration, the MetricReader can start metrics collection.
	*
	* <p> NOTE: {@link MetricReader} instances MUST be added before creating any instruments.
	* A {@link MetricReader} instance registered later may receive no or incomplete metric data.
	*
	* @param metricReader the metric reader to be registered.
	*
	* @deprecated This method will be removed in SDK 2.0. Please use
	* {@link MeterProviderOptions.readers} via the {@link MeterProvider} constructor instead
	*/
	addMetricReader(metricReader: MetricReader): void;
	/**
	* Flush all buffered data and shut down the MeterProvider and all registered
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

/**
 * @deprecated Use {@link MetricDescriptor} instead.
 */
declare type InstrumentDescriptor = MetricDescriptor;

export { Aggregation, AggregationSelector, AggregationTemporality, AggregationTemporalitySelector, CollectionResult, ConsoleMetricExporter, DataPoint, DataPointType, DefaultAggregation, DropAggregation, ExplicitBucketHistogramAggregation, ExponentialHistogram, ExponentialHistogramAggregation, ExponentialHistogramMetricData, GaugeMetricData, Histogram, HistogramAggregation, HistogramMetricData, InMemoryMetricExporter, InstrumentDescriptor, InstrumentType, LastValue, LastValueAggregation, MeterProvider, MeterProviderOptions, MetricCollectOptions, MetricData, MetricDescriptor, MetricProducer, MetricReader, MetricReaderOptions, PeriodicExportingMetricReader, PeriodicExportingMetricReaderOptions, PushMetricExporter, ResourceMetrics, ScopeMetrics, Sum, SumAggregation, SumMetricData, TimeoutError, View, ViewOptions };
