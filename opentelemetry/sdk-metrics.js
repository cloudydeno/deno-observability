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
/// <reference types="./sdk-metrics.d.ts" />

import * as api from './api.js';
import { diag, ValueType, context, createNoopMeter } from './api.js';
import { hrTimeToMicroseconds, millisToHrTime, globalErrorHandler, internal, ExportResultCode, unrefTimer } from './core.js';
import { defaultResource } from './resources.js';

var AggregationTemporality;
(function (AggregationTemporality) {
	AggregationTemporality[AggregationTemporality["DELTA"] = 0] = "DELTA";
	AggregationTemporality[AggregationTemporality["CUMULATIVE"] = 1] = "CUMULATIVE";
})(AggregationTemporality || (AggregationTemporality = {}));

var InstrumentType;
(function (InstrumentType) {
	InstrumentType["COUNTER"] = "COUNTER";
	InstrumentType["GAUGE"] = "GAUGE";
	InstrumentType["HISTOGRAM"] = "HISTOGRAM";
	InstrumentType["UP_DOWN_COUNTER"] = "UP_DOWN_COUNTER";
	InstrumentType["OBSERVABLE_COUNTER"] = "OBSERVABLE_COUNTER";
	InstrumentType["OBSERVABLE_GAUGE"] = "OBSERVABLE_GAUGE";
	InstrumentType["OBSERVABLE_UP_DOWN_COUNTER"] = "OBSERVABLE_UP_DOWN_COUNTER";
})(InstrumentType || (InstrumentType = {}));
var DataPointType;
(function (DataPointType) {
	DataPointType[DataPointType["HISTOGRAM"] = 0] = "HISTOGRAM";
	DataPointType[DataPointType["EXPONENTIAL_HISTOGRAM"] = 1] = "EXPONENTIAL_HISTOGRAM";
	DataPointType[DataPointType["GAUGE"] = 2] = "GAUGE";
	DataPointType[DataPointType["SUM"] = 3] = "SUM";
})(DataPointType || (DataPointType = {}));

function isNotNullish(item) {
	return item !== undefined && item !== null;
}
function hashAttributes(attributes) {
	let keys = Object.keys(attributes);
	if (keys.length === 0)
		return '';
	keys = keys.sort();
	return JSON.stringify(keys.map(key => [key, attributes[key]]));
}
function instrumentationScopeId(instrumentationScope) {
	return `${instrumentationScope.name}:${instrumentationScope.version ?? ''}:${instrumentationScope.schemaUrl ?? ''}`;
}
class TimeoutError extends Error {
	constructor(message) {
		super(message);
		Object.setPrototypeOf(this, TimeoutError.prototype);
	}
}
function callWithTimeout(promise, timeout) {
	let timeoutHandle;
	const timeoutPromise = new Promise(function timeoutFunction(_resolve, reject) {
		timeoutHandle = setTimeout(function timeoutHandler() {
			reject(new TimeoutError('Operation timed out.'));
		}, timeout);
	});
	return Promise.race([promise, timeoutPromise]).then(result => {
		clearTimeout(timeoutHandle);
		return result;
	}, reason => {
		clearTimeout(timeoutHandle);
		throw reason;
	});
}
async function PromiseAllSettled(promises) {
	return Promise.all(promises.map(async (p) => {
		try {
			const ret = await p;
			return {
				status: 'fulfilled',
				value: ret,
			};
		}
		catch (e) {
			return {
				status: 'rejected',
				reason: e,
			};
		}
	}));
}
function isPromiseAllSettledRejectionResult(it) {
	return it.status === 'rejected';
}
function FlatMap(arr, fn) {
	const result = [];
	arr.forEach(it => {
		result.push(...fn(it));
	});
	return result;
}
function setEquals(lhs, rhs) {
	if (lhs.size !== rhs.size) {
		return false;
	}
	for (const item of lhs) {
		if (!rhs.has(item)) {
			return false;
		}
	}
	return true;
}
function binarySearchUB(arr, value) {
	let lo = 0;
	let hi = arr.length - 1;
	let ret = arr.length;
	while (hi >= lo) {
		const mid = lo + Math.trunc((hi - lo) / 2);
		if (arr[mid] < value) {
			lo = mid + 1;
		}
		else {
			ret = mid;
			hi = mid - 1;
		}
	}
	return ret;
}
function equalsCaseInsensitive(lhs, rhs) {
	return lhs.toLowerCase() === rhs.toLowerCase();
}

var AggregatorKind;
(function (AggregatorKind) {
	AggregatorKind[AggregatorKind["DROP"] = 0] = "DROP";
	AggregatorKind[AggregatorKind["SUM"] = 1] = "SUM";
	AggregatorKind[AggregatorKind["LAST_VALUE"] = 2] = "LAST_VALUE";
	AggregatorKind[AggregatorKind["HISTOGRAM"] = 3] = "HISTOGRAM";
	AggregatorKind[AggregatorKind["EXPONENTIAL_HISTOGRAM"] = 4] = "EXPONENTIAL_HISTOGRAM";
})(AggregatorKind || (AggregatorKind = {}));

class DropAggregator {
	kind = AggregatorKind.DROP;
	createAccumulation() {
		return undefined;
	}
	merge(_previous, _delta) {
		return undefined;
	}
	diff(_previous, _current) {
		return undefined;
	}
	toMetricData(_descriptor, _aggregationTemporality, _accumulationByAttributes, _endTime) {
		return undefined;
	}
}

function createNewEmptyCheckpoint(boundaries) {
	const counts = boundaries.map(() => 0);
	counts.push(0);
	return {
		buckets: {
			boundaries,
			counts,
		},
		sum: 0,
		count: 0,
		hasMinMax: false,
		min: Infinity,
		max: -Infinity,
	};
}
class HistogramAccumulation {
	startTime;
	_boundaries;
	_recordMinMax;
	_current;
	constructor(startTime, _boundaries, _recordMinMax = true, _current = createNewEmptyCheckpoint(_boundaries)) {
		this.startTime = startTime;
		this._boundaries = _boundaries;
		this._recordMinMax = _recordMinMax;
		this._current = _current;
	}
	record(value) {
		if (Number.isNaN(value)) {
			return;
		}
		this._current.count += 1;
		this._current.sum += value;
		if (this._recordMinMax) {
			this._current.min = Math.min(value, this._current.min);
			this._current.max = Math.max(value, this._current.max);
			this._current.hasMinMax = true;
		}
		const idx = binarySearchUB(this._boundaries, value);
		this._current.buckets.counts[idx] += 1;
	}
	setStartTime(startTime) {
		this.startTime = startTime;
	}
	toPointValue() {
		return this._current;
	}
}
class HistogramAggregator {
	_boundaries;
	_recordMinMax;
	kind = AggregatorKind.HISTOGRAM;
	constructor(_boundaries, _recordMinMax) {
		this._boundaries = _boundaries;
		this._recordMinMax = _recordMinMax;
	}
	createAccumulation(startTime) {
		return new HistogramAccumulation(startTime, this._boundaries, this._recordMinMax);
	}
	merge(previous, delta) {
		const previousValue = previous.toPointValue();
		const deltaValue = delta.toPointValue();
		const previousCounts = previousValue.buckets.counts;
		const deltaCounts = deltaValue.buckets.counts;
		const mergedCounts = new Array(previousCounts.length);
		for (let idx = 0; idx < previousCounts.length; idx++) {
			mergedCounts[idx] = previousCounts[idx] + deltaCounts[idx];
		}
		let min = Infinity;
		let max = -Infinity;
		if (this._recordMinMax) {
			if (previousValue.hasMinMax && deltaValue.hasMinMax) {
				min = Math.min(previousValue.min, deltaValue.min);
				max = Math.max(previousValue.max, deltaValue.max);
			}
			else if (previousValue.hasMinMax) {
				min = previousValue.min;
				max = previousValue.max;
			}
			else if (deltaValue.hasMinMax) {
				min = deltaValue.min;
				max = deltaValue.max;
			}
		}
		return new HistogramAccumulation(previous.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
			buckets: {
				boundaries: previousValue.buckets.boundaries,
				counts: mergedCounts,
			},
			count: previousValue.count + deltaValue.count,
			sum: previousValue.sum + deltaValue.sum,
			hasMinMax: this._recordMinMax &&
				(previousValue.hasMinMax || deltaValue.hasMinMax),
			min: min,
			max: max,
		});
	}
	diff(previous, current) {
		const previousValue = previous.toPointValue();
		const currentValue = current.toPointValue();
		const previousCounts = previousValue.buckets.counts;
		const currentCounts = currentValue.buckets.counts;
		const diffedCounts = new Array(previousCounts.length);
		for (let idx = 0; idx < previousCounts.length; idx++) {
			diffedCounts[idx] = currentCounts[idx] - previousCounts[idx];
		}
		return new HistogramAccumulation(current.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
			buckets: {
				boundaries: previousValue.buckets.boundaries,
				counts: diffedCounts,
			},
			count: currentValue.count - previousValue.count,
			sum: currentValue.sum - previousValue.sum,
			hasMinMax: false,
			min: Infinity,
			max: -Infinity,
		});
	}
	toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
		return {
			descriptor,
			aggregationTemporality,
			dataPointType: DataPointType.HISTOGRAM,
			dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
				const pointValue = accumulation.toPointValue();
				const allowsNegativeValues = descriptor.type === InstrumentType.GAUGE ||
					descriptor.type === InstrumentType.UP_DOWN_COUNTER ||
					descriptor.type === InstrumentType.OBSERVABLE_GAUGE ||
					descriptor.type === InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
				return {
					attributes,
					startTime: accumulation.startTime,
					endTime,
					value: {
						min: pointValue.hasMinMax ? pointValue.min : undefined,
						max: pointValue.hasMinMax ? pointValue.max : undefined,
						sum: !allowsNegativeValues ? pointValue.sum : undefined,
						buckets: pointValue.buckets,
						count: pointValue.count,
					},
				};
			}),
		};
	}
}

class Buckets {
	backing;
	indexBase;
	indexStart;
	indexEnd;
	constructor(backing = new BucketsBacking(), indexBase = 0, indexStart = 0, indexEnd = 0) {
		this.backing = backing;
		this.indexBase = indexBase;
		this.indexStart = indexStart;
		this.indexEnd = indexEnd;
	}
	get offset() {
		return this.indexStart;
	}
	get length() {
		if (this.backing.length === 0) {
			return 0;
		}
		if (this.indexEnd === this.indexStart && this.at(0) === 0) {
			return 0;
		}
		return this.indexEnd - this.indexStart + 1;
	}
	counts() {
		return Array.from({ length: this.length }, (_, i) => this.at(i));
	}
	at(position) {
		const bias = this.indexBase - this.indexStart;
		if (position < bias) {
			position += this.backing.length;
		}
		position -= bias;
		return this.backing.countAt(position);
	}
	incrementBucket(bucketIndex, increment) {
		this.backing.increment(bucketIndex, increment);
	}
	decrementBucket(bucketIndex, decrement) {
		this.backing.decrement(bucketIndex, decrement);
	}
	trim() {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i) !== 0) {
				this.indexStart += i;
				break;
			}
			else if (i === this.length - 1) {
				this.indexStart = this.indexEnd = this.indexBase = 0;
				return;
			}
		}
		for (let i = this.length - 1; i >= 0; i--) {
			if (this.at(i) !== 0) {
				this.indexEnd -= this.length - i - 1;
				break;
			}
		}
		this._rotate();
	}
	downscale(by) {
		this._rotate();
		const size = 1 + this.indexEnd - this.indexStart;
		const each = 1 << by;
		let inpos = 0;
		let outpos = 0;
		for (let pos = this.indexStart; pos <= this.indexEnd;) {
			let mod = pos % each;
			if (mod < 0) {
				mod += each;
			}
			for (let i = mod; i < each && inpos < size; i++) {
				this._relocateBucket(outpos, inpos);
				inpos++;
				pos++;
			}
			outpos++;
		}
		this.indexStart >>= by;
		this.indexEnd >>= by;
		this.indexBase = this.indexStart;
	}
	clone() {
		return new Buckets(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd);
	}
	_rotate() {
		const bias = this.indexBase - this.indexStart;
		if (bias === 0) {
			return;
		}
		else if (bias > 0) {
			this.backing.reverse(0, this.backing.length);
			this.backing.reverse(0, bias);
			this.backing.reverse(bias, this.backing.length);
		}
		else {
			this.backing.reverse(0, this.backing.length);
			this.backing.reverse(0, this.backing.length + bias);
		}
		this.indexBase = this.indexStart;
	}
	_relocateBucket(dest, src) {
		if (dest === src) {
			return;
		}
		this.incrementBucket(dest, this.backing.emptyBucket(src));
	}
}
class BucketsBacking {
	_counts;
	constructor(_counts = [0]) {
		this._counts = _counts;
	}
	get length() {
		return this._counts.length;
	}
	countAt(pos) {
		return this._counts[pos];
	}
	growTo(newSize, oldPositiveLimit, newPositiveLimit) {
		const tmp = new Array(newSize).fill(0);
		tmp.splice(newPositiveLimit, this._counts.length - oldPositiveLimit, ...this._counts.slice(oldPositiveLimit));
		tmp.splice(0, oldPositiveLimit, ...this._counts.slice(0, oldPositiveLimit));
		this._counts = tmp;
	}
	reverse(from, limit) {
		const num = Math.floor((from + limit) / 2) - from;
		for (let i = 0; i < num; i++) {
			const tmp = this._counts[from + i];
			this._counts[from + i] = this._counts[limit - i - 1];
			this._counts[limit - i - 1] = tmp;
		}
	}
	emptyBucket(src) {
		const tmp = this._counts[src];
		this._counts[src] = 0;
		return tmp;
	}
	increment(bucketIndex, increment) {
		this._counts[bucketIndex] += increment;
	}
	decrement(bucketIndex, decrement) {
		if (this._counts[bucketIndex] >= decrement) {
			this._counts[bucketIndex] -= decrement;
		}
		else {
			this._counts[bucketIndex] = 0;
		}
	}
	clone() {
		return new BucketsBacking([...this._counts]);
	}
}

const SIGNIFICAND_WIDTH = 52;
const EXPONENT_MASK = 0x7ff00000;
const SIGNIFICAND_MASK = 0xfffff;
const EXPONENT_BIAS = 1023;
const MIN_NORMAL_EXPONENT = -EXPONENT_BIAS + 1;
const MAX_NORMAL_EXPONENT = EXPONENT_BIAS;
const MIN_VALUE = Math.pow(2, -1022);
function getNormalBase2(value) {
	const dv = new DataView(new ArrayBuffer(8));
	dv.setFloat64(0, value);
	const hiBits = dv.getUint32(0);
	const expBits = (hiBits & EXPONENT_MASK) >> 20;
	return expBits - EXPONENT_BIAS;
}
function getSignificand(value) {
	const dv = new DataView(new ArrayBuffer(8));
	dv.setFloat64(0, value);
	const hiBits = dv.getUint32(0);
	const loBits = dv.getUint32(4);
	const significandHiBits = (hiBits & SIGNIFICAND_MASK) * Math.pow(2, 32);
	return significandHiBits + loBits;
}

function ldexp(frac, exp) {
	if (frac === 0 ||
		frac === Number.POSITIVE_INFINITY ||
		frac === Number.NEGATIVE_INFINITY ||
		Number.isNaN(frac)) {
		return frac;
	}
	return frac * Math.pow(2, exp);
}
function nextGreaterSquare(v) {
	v--;
	v |= v >> 1;
	v |= v >> 2;
	v |= v >> 4;
	v |= v >> 8;
	v |= v >> 16;
	v++;
	return v;
}

class MappingError extends Error {
}

class ExponentMapping {
	_shift;
	constructor(scale) {
		this._shift = -scale;
	}
	mapToIndex(value) {
		if (value < MIN_VALUE) {
			return this._minNormalLowerBoundaryIndex();
		}
		const exp = getNormalBase2(value);
		const correction = this._rightShift(getSignificand(value) - 1, SIGNIFICAND_WIDTH);
		return (exp + correction) >> this._shift;
	}
	lowerBoundary(index) {
		const minIndex = this._minNormalLowerBoundaryIndex();
		if (index < minIndex) {
			throw new MappingError(`underflow: ${index} is < minimum lower boundary: ${minIndex}`);
		}
		const maxIndex = this._maxNormalLowerBoundaryIndex();
		if (index > maxIndex) {
			throw new MappingError(`overflow: ${index} is > maximum lower boundary: ${maxIndex}`);
		}
		return ldexp(1, index << this._shift);
	}
	get scale() {
		if (this._shift === 0) {
			return 0;
		}
		return -this._shift;
	}
	_minNormalLowerBoundaryIndex() {
		let index = MIN_NORMAL_EXPONENT >> this._shift;
		if (this._shift < 2) {
			index--;
		}
		return index;
	}
	_maxNormalLowerBoundaryIndex() {
		return MAX_NORMAL_EXPONENT >> this._shift;
	}
	_rightShift(value, shift) {
		return Math.floor(value * Math.pow(2, -shift));
	}
}

class LogarithmMapping {
	_scale;
	_scaleFactor;
	_inverseFactor;
	constructor(scale) {
		this._scale = scale;
		this._scaleFactor = ldexp(Math.LOG2E, scale);
		this._inverseFactor = ldexp(Math.LN2, -scale);
	}
	mapToIndex(value) {
		if (value <= MIN_VALUE) {
			return this._minNormalLowerBoundaryIndex() - 1;
		}
		if (getSignificand(value) === 0) {
			const exp = getNormalBase2(value);
			return (exp << this._scale) - 1;
		}
		const index = Math.floor(Math.log(value) * this._scaleFactor);
		const maxIndex = this._maxNormalLowerBoundaryIndex();
		if (index >= maxIndex) {
			return maxIndex;
		}
		return index;
	}
	lowerBoundary(index) {
		const maxIndex = this._maxNormalLowerBoundaryIndex();
		if (index >= maxIndex) {
			if (index === maxIndex) {
				return 2 * Math.exp((index - (1 << this._scale)) / this._scaleFactor);
			}
			throw new MappingError(`overflow: ${index} is > maximum lower boundary: ${maxIndex}`);
		}
		const minIndex = this._minNormalLowerBoundaryIndex();
		if (index <= minIndex) {
			if (index === minIndex) {
				return MIN_VALUE;
			}
			else if (index === minIndex - 1) {
				return Math.exp((index + (1 << this._scale)) / this._scaleFactor) / 2;
			}
			throw new MappingError(`overflow: ${index} is < minimum lower boundary: ${minIndex}`);
		}
		return Math.exp(index * this._inverseFactor);
	}
	get scale() {
		return this._scale;
	}
	_minNormalLowerBoundaryIndex() {
		return MIN_NORMAL_EXPONENT << this._scale;
	}
	_maxNormalLowerBoundaryIndex() {
		return ((MAX_NORMAL_EXPONENT + 1) << this._scale) - 1;
	}
}

const MIN_SCALE = -10;
const MAX_SCALE$1 = 20;
const PREBUILT_MAPPINGS = Array.from({ length: 31 }, (_, i) => {
	if (i > 10) {
		return new LogarithmMapping(i - 10);
	}
	return new ExponentMapping(i - 10);
});
function getMapping(scale) {
	if (scale > MAX_SCALE$1 || scale < MIN_SCALE) {
		throw new MappingError(`expected scale >= ${MIN_SCALE} && <= ${MAX_SCALE$1}, got: ${scale}`);
	}
	return PREBUILT_MAPPINGS[scale + 10];
}

class HighLow {
	low;
	high;
	static combine(h1, h2) {
		return new HighLow(Math.min(h1.low, h2.low), Math.max(h1.high, h2.high));
	}
	constructor(low, high) {
		this.low = low;
		this.high = high;
	}
}
const MAX_SCALE = 20;
const DEFAULT_MAX_SIZE = 160;
const MIN_MAX_SIZE = 2;
class ExponentialHistogramAccumulation {
	startTime;
	_maxSize;
	_recordMinMax;
	_sum;
	_count;
	_zeroCount;
	_min;
	_max;
	_positive;
	_negative;
	_mapping;
	constructor(startTime = startTime, _maxSize = DEFAULT_MAX_SIZE, _recordMinMax = true, _sum = 0, _count = 0, _zeroCount = 0, _min = Number.POSITIVE_INFINITY, _max = Number.NEGATIVE_INFINITY, _positive = new Buckets(), _negative = new Buckets(), _mapping = getMapping(MAX_SCALE)) {
		this.startTime = startTime;
		this._maxSize = _maxSize;
		this._recordMinMax = _recordMinMax;
		this._sum = _sum;
		this._count = _count;
		this._zeroCount = _zeroCount;
		this._min = _min;
		this._max = _max;
		this._positive = _positive;
		this._negative = _negative;
		this._mapping = _mapping;
		if (this._maxSize < MIN_MAX_SIZE) {
			diag.warn(`Exponential Histogram Max Size set to ${this._maxSize}, \
				changing to the minimum size of: ${MIN_MAX_SIZE}`);
			this._maxSize = MIN_MAX_SIZE;
		}
	}
	record(value) {
		this.updateByIncrement(value, 1);
	}
	setStartTime(startTime) {
		this.startTime = startTime;
	}
	toPointValue() {
		return {
			hasMinMax: this._recordMinMax,
			min: this.min,
			max: this.max,
			sum: this.sum,
			positive: {
				offset: this.positive.offset,
				bucketCounts: this.positive.counts(),
			},
			negative: {
				offset: this.negative.offset,
				bucketCounts: this.negative.counts(),
			},
			count: this.count,
			scale: this.scale,
			zeroCount: this.zeroCount,
		};
	}
	get sum() {
		return this._sum;
	}
	get min() {
		return this._min;
	}
	get max() {
		return this._max;
	}
	get count() {
		return this._count;
	}
	get zeroCount() {
		return this._zeroCount;
	}
	get scale() {
		if (this._count === this._zeroCount) {
			return 0;
		}
		return this._mapping.scale;
	}
	get positive() {
		return this._positive;
	}
	get negative() {
		return this._negative;
	}
	updateByIncrement(value, increment) {
		if (Number.isNaN(value)) {
			return;
		}
		if (value > this._max) {
			this._max = value;
		}
		if (value < this._min) {
			this._min = value;
		}
		this._count += increment;
		if (value === 0) {
			this._zeroCount += increment;
			return;
		}
		this._sum += value * increment;
		if (value > 0) {
			this._updateBuckets(this._positive, value, increment);
		}
		else {
			this._updateBuckets(this._negative, -value, increment);
		}
	}
	merge(previous) {
		if (this._count === 0) {
			this._min = previous.min;
			this._max = previous.max;
		}
		else if (previous.count !== 0) {
			if (previous.min < this.min) {
				this._min = previous.min;
			}
			if (previous.max > this.max) {
				this._max = previous.max;
			}
		}
		this.startTime = previous.startTime;
		this._sum += previous.sum;
		this._count += previous.count;
		this._zeroCount += previous.zeroCount;
		const minScale = this._minScale(previous);
		this._downscale(this.scale - minScale);
		this._mergeBuckets(this.positive, previous, previous.positive, minScale);
		this._mergeBuckets(this.negative, previous, previous.negative, minScale);
	}
	diff(other) {
		this._min = Infinity;
		this._max = -Infinity;
		this._sum -= other.sum;
		this._count -= other.count;
		this._zeroCount -= other.zeroCount;
		const minScale = this._minScale(other);
		this._downscale(this.scale - minScale);
		this._diffBuckets(this.positive, other, other.positive, minScale);
		this._diffBuckets(this.negative, other, other.negative, minScale);
	}
	clone() {
		return new ExponentialHistogramAccumulation(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping);
	}
	_updateBuckets(buckets, value, increment) {
		let index = this._mapping.mapToIndex(value);
		let rescalingNeeded = false;
		let high = 0;
		let low = 0;
		if (buckets.length === 0) {
			buckets.indexStart = index;
			buckets.indexEnd = buckets.indexStart;
			buckets.indexBase = buckets.indexStart;
		}
		else if (index < buckets.indexStart &&
			buckets.indexEnd - index >= this._maxSize) {
			rescalingNeeded = true;
			low = index;
			high = buckets.indexEnd;
		}
		else if (index > buckets.indexEnd &&
			index - buckets.indexStart >= this._maxSize) {
			rescalingNeeded = true;
			low = buckets.indexStart;
			high = index;
		}
		if (rescalingNeeded) {
			const change = this._changeScale(high, low);
			this._downscale(change);
			index = this._mapping.mapToIndex(value);
		}
		this._incrementIndexBy(buckets, index, increment);
	}
	_incrementIndexBy(buckets, index, increment) {
		if (increment === 0) {
			return;
		}
		if (buckets.length === 0) {
			buckets.indexStart = buckets.indexEnd = buckets.indexBase = index;
		}
		if (index < buckets.indexStart) {
			const span = buckets.indexEnd - index;
			if (span >= buckets.backing.length) {
				this._grow(buckets, span + 1);
			}
			buckets.indexStart = index;
		}
		else if (index > buckets.indexEnd) {
			const span = index - buckets.indexStart;
			if (span >= buckets.backing.length) {
				this._grow(buckets, span + 1);
			}
			buckets.indexEnd = index;
		}
		let bucketIndex = index - buckets.indexBase;
		if (bucketIndex < 0) {
			bucketIndex += buckets.backing.length;
		}
		buckets.incrementBucket(bucketIndex, increment);
	}
	_grow(buckets, needed) {
		const size = buckets.backing.length;
		const bias = buckets.indexBase - buckets.indexStart;
		const oldPositiveLimit = size - bias;
		let newSize = nextGreaterSquare(needed);
		if (newSize > this._maxSize) {
			newSize = this._maxSize;
		}
		const newPositiveLimit = newSize - bias;
		buckets.backing.growTo(newSize, oldPositiveLimit, newPositiveLimit);
	}
	_changeScale(high, low) {
		let change = 0;
		while (high - low >= this._maxSize) {
			high >>= 1;
			low >>= 1;
			change++;
		}
		return change;
	}
	_downscale(change) {
		if (change === 0) {
			return;
		}
		if (change < 0) {
			throw new Error(`impossible change of scale: ${this.scale}`);
		}
		const newScale = this._mapping.scale - change;
		this._positive.downscale(change);
		this._negative.downscale(change);
		this._mapping = getMapping(newScale);
	}
	_minScale(other) {
		const minScale = Math.min(this.scale, other.scale);
		const highLowPos = HighLow.combine(this._highLowAtScale(this.positive, this.scale, minScale), this._highLowAtScale(other.positive, other.scale, minScale));
		const highLowNeg = HighLow.combine(this._highLowAtScale(this.negative, this.scale, minScale), this._highLowAtScale(other.negative, other.scale, minScale));
		return Math.min(minScale - this._changeScale(highLowPos.high, highLowPos.low), minScale - this._changeScale(highLowNeg.high, highLowNeg.low));
	}
	_highLowAtScale(buckets, currentScale, newScale) {
		if (buckets.length === 0) {
			return new HighLow(0, -1);
		}
		const shift = currentScale - newScale;
		return new HighLow(buckets.indexStart >> shift, buckets.indexEnd >> shift);
	}
	_mergeBuckets(ours, other, theirs, scale) {
		const theirOffset = theirs.offset;
		const theirChange = other.scale - scale;
		for (let i = 0; i < theirs.length; i++) {
			this._incrementIndexBy(ours, (theirOffset + i) >> theirChange, theirs.at(i));
		}
	}
	_diffBuckets(ours, other, theirs, scale) {
		const theirOffset = theirs.offset;
		const theirChange = other.scale - scale;
		for (let i = 0; i < theirs.length; i++) {
			const ourIndex = (theirOffset + i) >> theirChange;
			let bucketIndex = ourIndex - ours.indexBase;
			if (bucketIndex < 0) {
				bucketIndex += ours.backing.length;
			}
			ours.decrementBucket(bucketIndex, theirs.at(i));
		}
		ours.trim();
	}
}
class ExponentialHistogramAggregator {
	_maxSize;
	_recordMinMax;
	kind = AggregatorKind.EXPONENTIAL_HISTOGRAM;
	constructor(_maxSize, _recordMinMax) {
		this._maxSize = _maxSize;
		this._recordMinMax = _recordMinMax;
	}
	createAccumulation(startTime) {
		return new ExponentialHistogramAccumulation(startTime, this._maxSize, this._recordMinMax);
	}
	merge(previous, delta) {
		const result = delta.clone();
		result.merge(previous);
		return result;
	}
	diff(previous, current) {
		const result = current.clone();
		result.diff(previous);
		return result;
	}
	toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
		return {
			descriptor,
			aggregationTemporality,
			dataPointType: DataPointType.EXPONENTIAL_HISTOGRAM,
			dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
				const pointValue = accumulation.toPointValue();
				const allowsNegativeValues = descriptor.type === InstrumentType.GAUGE ||
					descriptor.type === InstrumentType.UP_DOWN_COUNTER ||
					descriptor.type === InstrumentType.OBSERVABLE_GAUGE ||
					descriptor.type === InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
				return {
					attributes,
					startTime: accumulation.startTime,
					endTime,
					value: {
						min: pointValue.hasMinMax ? pointValue.min : undefined,
						max: pointValue.hasMinMax ? pointValue.max : undefined,
						sum: !allowsNegativeValues ? pointValue.sum : undefined,
						positive: {
							offset: pointValue.positive.offset,
							bucketCounts: pointValue.positive.bucketCounts,
						},
						negative: {
							offset: pointValue.negative.offset,
							bucketCounts: pointValue.negative.bucketCounts,
						},
						count: pointValue.count,
						scale: pointValue.scale,
						zeroCount: pointValue.zeroCount,
					},
				};
			}),
		};
	}
}

class LastValueAccumulation {
	startTime;
	_current;
	sampleTime;
	constructor(startTime, _current = 0, sampleTime = [0, 0]) {
		this.startTime = startTime;
		this._current = _current;
		this.sampleTime = sampleTime;
	}
	record(value) {
		this._current = value;
		this.sampleTime = millisToHrTime(Date.now());
	}
	setStartTime(startTime) {
		this.startTime = startTime;
	}
	toPointValue() {
		return this._current;
	}
}
class LastValueAggregator {
	kind = AggregatorKind.LAST_VALUE;
	createAccumulation(startTime) {
		return new LastValueAccumulation(startTime);
	}
	merge(previous, delta) {
		const latestAccumulation = hrTimeToMicroseconds(delta.sampleTime) >=
			hrTimeToMicroseconds(previous.sampleTime)
			? delta
			: previous;
		return new LastValueAccumulation(previous.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
	}
	diff(previous, current) {
		const latestAccumulation = hrTimeToMicroseconds(current.sampleTime) >=
			hrTimeToMicroseconds(previous.sampleTime)
			? current
			: previous;
		return new LastValueAccumulation(current.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
	}
	toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
		return {
			descriptor,
			aggregationTemporality,
			dataPointType: DataPointType.GAUGE,
			dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
				return {
					attributes,
					startTime: accumulation.startTime,
					endTime,
					value: accumulation.toPointValue(),
				};
			}),
		};
	}
}

class SumAccumulation {
	startTime;
	monotonic;
	_current;
	reset;
	constructor(startTime, monotonic, _current = 0, reset = false) {
		this.startTime = startTime;
		this.monotonic = monotonic;
		this._current = _current;
		this.reset = reset;
	}
	record(value) {
		if (this.monotonic && value < 0) {
			return;
		}
		this._current += value;
	}
	setStartTime(startTime) {
		this.startTime = startTime;
	}
	toPointValue() {
		return this._current;
	}
}
class SumAggregator {
	monotonic;
	kind = AggregatorKind.SUM;
	constructor(monotonic) {
		this.monotonic = monotonic;
	}
	createAccumulation(startTime) {
		return new SumAccumulation(startTime, this.monotonic);
	}
	merge(previous, delta) {
		const prevPv = previous.toPointValue();
		const deltaPv = delta.toPointValue();
		if (delta.reset) {
			return new SumAccumulation(delta.startTime, this.monotonic, deltaPv, delta.reset);
		}
		return new SumAccumulation(previous.startTime, this.monotonic, prevPv + deltaPv);
	}
	diff(previous, current) {
		const prevPv = previous.toPointValue();
		const currPv = current.toPointValue();
		if (this.monotonic && prevPv > currPv) {
			return new SumAccumulation(current.startTime, this.monotonic, currPv, true);
		}
		return new SumAccumulation(current.startTime, this.monotonic, currPv - prevPv);
	}
	toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
		return {
			descriptor,
			aggregationTemporality,
			dataPointType: DataPointType.SUM,
			dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
				return {
					attributes,
					startTime: accumulation.startTime,
					endTime,
					value: accumulation.toPointValue(),
				};
			}),
			isMonotonic: this.monotonic,
		};
	}
}

class DropAggregation {
	static DEFAULT_INSTANCE = new DropAggregator();
	createAggregator(_instrument) {
		return DropAggregation.DEFAULT_INSTANCE;
	}
}
class SumAggregation {
	static MONOTONIC_INSTANCE = new SumAggregator(true);
	static NON_MONOTONIC_INSTANCE = new SumAggregator(false);
	createAggregator(instrument) {
		switch (instrument.type) {
			case InstrumentType.COUNTER:
			case InstrumentType.OBSERVABLE_COUNTER:
			case InstrumentType.HISTOGRAM: {
				return SumAggregation.MONOTONIC_INSTANCE;
			}
			default: {
				return SumAggregation.NON_MONOTONIC_INSTANCE;
			}
		}
	}
}
class LastValueAggregation {
	static DEFAULT_INSTANCE = new LastValueAggregator();
	createAggregator(_instrument) {
		return LastValueAggregation.DEFAULT_INSTANCE;
	}
}
class HistogramAggregation {
	static DEFAULT_INSTANCE = new HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000], true);
	createAggregator(_instrument) {
		return HistogramAggregation.DEFAULT_INSTANCE;
	}
}
class ExplicitBucketHistogramAggregation {
	_recordMinMax;
	_boundaries;
	constructor(boundaries, _recordMinMax = true) {
		this._recordMinMax = _recordMinMax;
		if (boundaries == null) {
			throw new Error('ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array');
		}
		boundaries = boundaries.concat();
		boundaries = boundaries.sort((a, b) => a - b);
		const minusInfinityIndex = boundaries.lastIndexOf(-Infinity);
		let infinityIndex = boundaries.indexOf(Infinity);
		if (infinityIndex === -1) {
			infinityIndex = undefined;
		}
		this._boundaries = boundaries.slice(minusInfinityIndex + 1, infinityIndex);
	}
	createAggregator(_instrument) {
		return new HistogramAggregator(this._boundaries, this._recordMinMax);
	}
}
class ExponentialHistogramAggregation {
	_maxSize;
	_recordMinMax;
	constructor(_maxSize = 160, _recordMinMax = true) {
		this._maxSize = _maxSize;
		this._recordMinMax = _recordMinMax;
	}
	createAggregator(_instrument) {
		return new ExponentialHistogramAggregator(this._maxSize, this._recordMinMax);
	}
}
class DefaultAggregation {
	_resolve(instrument) {
		switch (instrument.type) {
			case InstrumentType.COUNTER:
			case InstrumentType.UP_DOWN_COUNTER:
			case InstrumentType.OBSERVABLE_COUNTER:
			case InstrumentType.OBSERVABLE_UP_DOWN_COUNTER: {
				return SUM_AGGREGATION;
			}
			case InstrumentType.GAUGE:
			case InstrumentType.OBSERVABLE_GAUGE: {
				return LAST_VALUE_AGGREGATION;
			}
			case InstrumentType.HISTOGRAM: {
				if (instrument.advice.explicitBucketBoundaries) {
					return new ExplicitBucketHistogramAggregation(instrument.advice.explicitBucketBoundaries);
				}
				return HISTOGRAM_AGGREGATION;
			}
		}
		api.diag.warn(`Unable to recognize instrument type: ${instrument.type}`);
		return DROP_AGGREGATION;
	}
	createAggregator(instrument) {
		return this._resolve(instrument).createAggregator(instrument);
	}
}
const DROP_AGGREGATION = new DropAggregation();
const SUM_AGGREGATION = new SumAggregation();
const LAST_VALUE_AGGREGATION = new LastValueAggregation();
const HISTOGRAM_AGGREGATION = new HistogramAggregation();
const DEFAULT_AGGREGATION = new DefaultAggregation();

var AggregationType;
(function (AggregationType) {
	AggregationType[AggregationType["DEFAULT"] = 0] = "DEFAULT";
	AggregationType[AggregationType["DROP"] = 1] = "DROP";
	AggregationType[AggregationType["SUM"] = 2] = "SUM";
	AggregationType[AggregationType["LAST_VALUE"] = 3] = "LAST_VALUE";
	AggregationType[AggregationType["EXPLICIT_BUCKET_HISTOGRAM"] = 4] = "EXPLICIT_BUCKET_HISTOGRAM";
	AggregationType[AggregationType["EXPONENTIAL_HISTOGRAM"] = 5] = "EXPONENTIAL_HISTOGRAM";
})(AggregationType || (AggregationType = {}));
function toAggregation(option) {
	switch (option.type) {
		case AggregationType.DEFAULT:
			return DEFAULT_AGGREGATION;
		case AggregationType.DROP:
			return DROP_AGGREGATION;
		case AggregationType.SUM:
			return SUM_AGGREGATION;
		case AggregationType.LAST_VALUE:
			return LAST_VALUE_AGGREGATION;
		case AggregationType.EXPONENTIAL_HISTOGRAM: {
			const expOption = option;
			return new ExponentialHistogramAggregation(expOption.options?.maxSize, expOption.options?.recordMinMax);
		}
		case AggregationType.EXPLICIT_BUCKET_HISTOGRAM: {
			const expOption = option;
			if (expOption.options == null) {
				return HISTOGRAM_AGGREGATION;
			}
			else {
				return new ExplicitBucketHistogramAggregation(expOption.options?.boundaries, expOption.options?.recordMinMax);
			}
		}
		default:
			throw new Error('Unsupported Aggregation');
	}
}

const DEFAULT_AGGREGATION_SELECTOR = _instrumentType => {
	return {
		type: AggregationType.DEFAULT,
	};
};
const DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = _instrumentType => AggregationTemporality.CUMULATIVE;

class MetricReader {
	_shutdown = false;
	_metricProducers;
	_sdkMetricProducer;
	_aggregationTemporalitySelector;
	_aggregationSelector;
	_cardinalitySelector;
	constructor(options) {
		this._aggregationSelector =
			options?.aggregationSelector ?? DEFAULT_AGGREGATION_SELECTOR;
		this._aggregationTemporalitySelector =
			options?.aggregationTemporalitySelector ??
				DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
		this._metricProducers = options?.metricProducers ?? [];
		this._cardinalitySelector = options?.cardinalitySelector;
	}
	setMetricProducer(metricProducer) {
		if (this._sdkMetricProducer) {
			throw new Error('MetricReader can not be bound to a MeterProvider again.');
		}
		this._sdkMetricProducer = metricProducer;
		this.onInitialized();
	}
	selectAggregation(instrumentType) {
		return this._aggregationSelector(instrumentType);
	}
	selectAggregationTemporality(instrumentType) {
		return this._aggregationTemporalitySelector(instrumentType);
	}
	selectCardinalityLimit(instrumentType) {
		return this._cardinalitySelector
			? this._cardinalitySelector(instrumentType)
			: 2000;
	}
	onInitialized() {
	}
	async collect(options) {
		if (this._sdkMetricProducer === undefined) {
			throw new Error('MetricReader is not bound to a MetricProducer');
		}
		if (this._shutdown) {
			throw new Error('MetricReader is shutdown');
		}
		const [sdkCollectionResults, ...additionalCollectionResults] = await Promise.all([
			this._sdkMetricProducer.collect({
				timeoutMillis: options?.timeoutMillis,
			}),
			...this._metricProducers.map(producer => producer.collect({
				timeoutMillis: options?.timeoutMillis,
			})),
		]);
		const errors = sdkCollectionResults.errors.concat(FlatMap(additionalCollectionResults, result => result.errors));
		const resource = sdkCollectionResults.resourceMetrics.resource;
		const scopeMetrics = sdkCollectionResults.resourceMetrics.scopeMetrics.concat(FlatMap(additionalCollectionResults, result => result.resourceMetrics.scopeMetrics));
		return {
			resourceMetrics: {
				resource,
				scopeMetrics,
			},
			errors,
		};
	}
	async shutdown(options) {
		if (this._shutdown) {
			api.diag.error('Cannot call shutdown twice.');
			return;
		}
		if (options?.timeoutMillis == null) {
			await this.onShutdown();
		}
		else {
			await callWithTimeout(this.onShutdown(), options.timeoutMillis);
		}
		this._shutdown = true;
	}
	async forceFlush(options) {
		if (this._shutdown) {
			api.diag.warn('Cannot forceFlush on already shutdown MetricReader.');
			return;
		}
		if (options?.timeoutMillis == null) {
			await this.onForceFlush();
			return;
		}
		await callWithTimeout(this.onForceFlush(), options.timeoutMillis);
	}
}

class PeriodicExportingMetricReader extends MetricReader {
	_interval;
	_exporter;
	_exportInterval;
	_exportTimeout;
	constructor(options) {
		super({
			aggregationSelector: options.exporter.selectAggregation?.bind(options.exporter),
			aggregationTemporalitySelector: options.exporter.selectAggregationTemporality?.bind(options.exporter),
			metricProducers: options.metricProducers,
		});
		if (options.exportIntervalMillis !== undefined &&
			options.exportIntervalMillis <= 0) {
			throw Error('exportIntervalMillis must be greater than 0');
		}
		if (options.exportTimeoutMillis !== undefined &&
			options.exportTimeoutMillis <= 0) {
			throw Error('exportTimeoutMillis must be greater than 0');
		}
		if (options.exportTimeoutMillis !== undefined &&
			options.exportIntervalMillis !== undefined &&
			options.exportIntervalMillis < options.exportTimeoutMillis) {
			throw Error('exportIntervalMillis must be greater than or equal to exportTimeoutMillis');
		}
		this._exportInterval = options.exportIntervalMillis ?? 60000;
		this._exportTimeout = options.exportTimeoutMillis ?? 30000;
		this._exporter = options.exporter;
	}
	async _runOnce() {
		try {
			await callWithTimeout(this._doRun(), this._exportTimeout);
		}
		catch (err) {
			if (err instanceof TimeoutError) {
				api.diag.error('Export took longer than %s milliseconds and timed out.', this._exportTimeout);
				return;
			}
			globalErrorHandler(err);
		}
	}
	async _doRun() {
		const { resourceMetrics, errors } = await this.collect({
			timeoutMillis: this._exportTimeout,
		});
		if (errors.length > 0) {
			api.diag.error('PeriodicExportingMetricReader: metrics collection errors', ...errors);
		}
		if (resourceMetrics.resource.asyncAttributesPending) {
			try {
				await resourceMetrics.resource.waitForAsyncAttributes?.();
			}
			catch (e) {
				api.diag.debug('Error while resolving async portion of resource: ', e);
				globalErrorHandler(e);
			}
		}
		if (resourceMetrics.scopeMetrics.length === 0) {
			return;
		}
		const result = await internal._export(this._exporter, resourceMetrics);
		if (result.code !== ExportResultCode.SUCCESS) {
			throw new Error(`PeriodicExportingMetricReader: metrics export failed (error ${result.error})`);
		}
	}
	onInitialized() {
		this._interval = setInterval(() => {
			void this._runOnce();
		}, this._exportInterval);
		unrefTimer(this._interval);
	}
	async onForceFlush() {
		await this._runOnce();
		await this._exporter.forceFlush();
	}
	async onShutdown() {
		if (this._interval) {
			clearInterval(this._interval);
		}
		await this.onForceFlush();
		await this._exporter.shutdown();
	}
}

class InMemoryMetricExporter {
	_shutdown = false;
	_aggregationTemporality;
	_metrics = [];
	constructor(aggregationTemporality) {
		this._aggregationTemporality = aggregationTemporality;
	}
	export(metrics, resultCallback) {
		if (this._shutdown) {
			setTimeout(() => resultCallback({ code: ExportResultCode.FAILED }), 0);
			return;
		}
		this._metrics.push(metrics);
		setTimeout(() => resultCallback({ code: ExportResultCode.SUCCESS }), 0);
	}
	getMetrics() {
		return this._metrics;
	}
	forceFlush() {
		return Promise.resolve();
	}
	reset() {
		this._metrics = [];
	}
	selectAggregationTemporality(_instrumentType) {
		return this._aggregationTemporality;
	}
	shutdown() {
		this._shutdown = true;
		return Promise.resolve();
	}
}

class ConsoleMetricExporter {
	_shutdown = false;
	_temporalitySelector;
	constructor(options) {
		this._temporalitySelector =
			options?.temporalitySelector ?? DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
	}
	export(metrics, resultCallback) {
		if (this._shutdown) {
			setImmediate(resultCallback, { code: ExportResultCode.FAILED });
			return;
		}
		return ConsoleMetricExporter._sendMetrics(metrics, resultCallback);
	}
	forceFlush() {
		return Promise.resolve();
	}
	selectAggregationTemporality(_instrumentType) {
		return this._temporalitySelector(_instrumentType);
	}
	shutdown() {
		this._shutdown = true;
		return Promise.resolve();
	}
	static _sendMetrics(metrics, done) {
		for (const scopeMetrics of metrics.scopeMetrics) {
			for (const metric of scopeMetrics.metrics) {
				console.dir({
					descriptor: metric.descriptor,
					dataPointType: metric.dataPointType,
					dataPoints: metric.dataPoints,
				}, { depth: null });
			}
		}
		done({ code: ExportResultCode.SUCCESS });
	}
}

class ViewRegistry {
	_registeredViews = [];
	addView(view) {
		this._registeredViews.push(view);
	}
	findViews(instrument, meter) {
		const views = this._registeredViews.filter(registeredView => {
			return (this._matchInstrument(registeredView.instrumentSelector, instrument) &&
				this._matchMeter(registeredView.meterSelector, meter));
		});
		return views;
	}
	_matchInstrument(selector, instrument) {
		return ((selector.getType() === undefined ||
			instrument.type === selector.getType()) &&
			selector.getNameFilter().match(instrument.name) &&
			selector.getUnitFilter().match(instrument.unit));
	}
	_matchMeter(selector, meter) {
		return (selector.getNameFilter().match(meter.name) &&
			(meter.version === undefined ||
				selector.getVersionFilter().match(meter.version)) &&
			(meter.schemaUrl === undefined ||
				selector.getSchemaUrlFilter().match(meter.schemaUrl)));
	}
}

function createInstrumentDescriptor(name, type, options) {
	if (!isValidName(name)) {
		diag.warn(`Invalid metric name: "${name}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
	}
	return {
		name,
		type,
		description: options?.description ?? '',
		unit: options?.unit ?? '',
		valueType: options?.valueType ?? ValueType.DOUBLE,
		advice: options?.advice ?? {},
	};
}
function createInstrumentDescriptorWithView(view, instrument) {
	return {
		name: view.name ?? instrument.name,
		description: view.description ?? instrument.description,
		type: instrument.type,
		unit: instrument.unit,
		valueType: instrument.valueType,
		advice: instrument.advice,
	};
}
function isDescriptorCompatibleWith(descriptor, otherDescriptor) {
	return (equalsCaseInsensitive(descriptor.name, otherDescriptor.name) &&
		descriptor.unit === otherDescriptor.unit &&
		descriptor.type === otherDescriptor.type &&
		descriptor.valueType === otherDescriptor.valueType);
}
const NAME_REGEXP = /^[a-z][a-z0-9_.\-/]{0,254}$/i;
function isValidName(name) {
	return name.match(NAME_REGEXP) != null;
}

class SyncInstrument {
	_writableMetricStorage;
	_descriptor;
	constructor(_writableMetricStorage, _descriptor) {
		this._writableMetricStorage = _writableMetricStorage;
		this._descriptor = _descriptor;
	}
	_record(value, attributes = {}, context$1 = context.active()) {
		if (typeof value !== 'number') {
			diag.warn(`non-number value provided to metric ${this._descriptor.name}: ${value}`);
			return;
		}
		if (this._descriptor.valueType === ValueType.INT &&
			!Number.isInteger(value)) {
			diag.warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`);
			value = Math.trunc(value);
			if (!Number.isInteger(value)) {
				return;
			}
		}
		this._writableMetricStorage.record(value, attributes, context$1, millisToHrTime(Date.now()));
	}
}
class UpDownCounterInstrument extends SyncInstrument {
	add(value, attributes, ctx) {
		this._record(value, attributes, ctx);
	}
}
class CounterInstrument extends SyncInstrument {
	add(value, attributes, ctx) {
		if (value < 0) {
			diag.warn(`negative value provided to counter ${this._descriptor.name}: ${value}`);
			return;
		}
		this._record(value, attributes, ctx);
	}
}
class GaugeInstrument extends SyncInstrument {
	record(value, attributes, ctx) {
		this._record(value, attributes, ctx);
	}
}
class HistogramInstrument extends SyncInstrument {
	record(value, attributes, ctx) {
		if (value < 0) {
			diag.warn(`negative value provided to histogram ${this._descriptor.name}: ${value}`);
			return;
		}
		this._record(value, attributes, ctx);
	}
}
class ObservableInstrument {
	_observableRegistry;
	_metricStorages;
	_descriptor;
	constructor(descriptor, metricStorages, _observableRegistry) {
		this._observableRegistry = _observableRegistry;
		this._descriptor = descriptor;
		this._metricStorages = metricStorages;
	}
	addCallback(callback) {
		this._observableRegistry.addCallback(callback, this);
	}
	removeCallback(callback) {
		this._observableRegistry.removeCallback(callback, this);
	}
}
class ObservableCounterInstrument extends ObservableInstrument {
}
class ObservableGaugeInstrument extends ObservableInstrument {
}
class ObservableUpDownCounterInstrument extends ObservableInstrument {
}
function isObservableInstrument(it) {
	return it instanceof ObservableInstrument;
}

class Meter {
	_meterSharedState;
	constructor(_meterSharedState) {
		this._meterSharedState = _meterSharedState;
	}
	createGauge(name, options) {
		const descriptor = createInstrumentDescriptor(name, InstrumentType.GAUGE, options);
		const storage = this._meterSharedState.registerMetricStorage(descriptor);
		return new GaugeInstrument(storage, descriptor);
	}
	createHistogram(name, options) {
		const descriptor = createInstrumentDescriptor(name, InstrumentType.HISTOGRAM, options);
		const storage = this._meterSharedState.registerMetricStorage(descriptor);
		return new HistogramInstrument(storage, descriptor);
	}
	createCounter(name, options) {
		const descriptor = createInstrumentDescriptor(name, InstrumentType.COUNTER, options);
		const storage = this._meterSharedState.registerMetricStorage(descriptor);
		return new CounterInstrument(storage, descriptor);
	}
	createUpDownCounter(name, options) {
		const descriptor = createInstrumentDescriptor(name, InstrumentType.UP_DOWN_COUNTER, options);
		const storage = this._meterSharedState.registerMetricStorage(descriptor);
		return new UpDownCounterInstrument(storage, descriptor);
	}
	createObservableGauge(name, options) {
		const descriptor = createInstrumentDescriptor(name, InstrumentType.OBSERVABLE_GAUGE, options);
		const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
		return new ObservableGaugeInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
	}
	createObservableCounter(name, options) {
		const descriptor = createInstrumentDescriptor(name, InstrumentType.OBSERVABLE_COUNTER, options);
		const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
		return new ObservableCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
	}
	createObservableUpDownCounter(name, options) {
		const descriptor = createInstrumentDescriptor(name, InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, options);
		const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
		return new ObservableUpDownCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
	}
	addBatchObservableCallback(callback, observables) {
		this._meterSharedState.observableRegistry.addBatchCallback(callback, observables);
	}
	removeBatchObservableCallback(callback, observables) {
		this._meterSharedState.observableRegistry.removeBatchCallback(callback, observables);
	}
}

class MetricStorage {
	_instrumentDescriptor;
	constructor(_instrumentDescriptor) {
		this._instrumentDescriptor = _instrumentDescriptor;
	}
	getInstrumentDescriptor() {
		return this._instrumentDescriptor;
	}
	updateDescription(description) {
		this._instrumentDescriptor = createInstrumentDescriptor(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
			description: description,
			valueType: this._instrumentDescriptor.valueType,
			unit: this._instrumentDescriptor.unit,
			advice: this._instrumentDescriptor.advice,
		});
	}
}

class HashMap {
	_hash;
	_valueMap = new Map();
	_keyMap = new Map();
	constructor(_hash) {
		this._hash = _hash;
	}
	get(key, hashCode) {
		hashCode ??= this._hash(key);
		return this._valueMap.get(hashCode);
	}
	getOrDefault(key, defaultFactory) {
		const hash = this._hash(key);
		if (this._valueMap.has(hash)) {
			return this._valueMap.get(hash);
		}
		const val = defaultFactory();
		if (!this._keyMap.has(hash)) {
			this._keyMap.set(hash, key);
		}
		this._valueMap.set(hash, val);
		return val;
	}
	set(key, value, hashCode) {
		hashCode ??= this._hash(key);
		if (!this._keyMap.has(hashCode)) {
			this._keyMap.set(hashCode, key);
		}
		this._valueMap.set(hashCode, value);
	}
	has(key, hashCode) {
		hashCode ??= this._hash(key);
		return this._valueMap.has(hashCode);
	}
	*keys() {
		const keyIterator = this._keyMap.entries();
		let next = keyIterator.next();
		while (next.done !== true) {
			yield [next.value[1], next.value[0]];
			next = keyIterator.next();
		}
	}
	*entries() {
		const valueIterator = this._valueMap.entries();
		let next = valueIterator.next();
		while (next.done !== true) {
			yield [this._keyMap.get(next.value[0]), next.value[1], next.value[0]];
			next = valueIterator.next();
		}
	}
	get size() {
		return this._valueMap.size;
	}
}
class AttributeHashMap extends HashMap {
	constructor() {
		super(hashAttributes);
	}
}

class DeltaMetricProcessor {
	_aggregator;
	_activeCollectionStorage = new AttributeHashMap();
	_cumulativeMemoStorage = new AttributeHashMap();
	_cardinalityLimit;
	_overflowAttributes = { 'otel.metric.overflow': true };
	_overflowHashCode;
	constructor(_aggregator, aggregationCardinalityLimit) {
		this._aggregator = _aggregator;
		this._cardinalityLimit = (aggregationCardinalityLimit ?? 2000) - 1;
		this._overflowHashCode = hashAttributes(this._overflowAttributes);
	}
	record(value, attributes, _context, collectionTime) {
		let accumulation = this._activeCollectionStorage.get(attributes);
		if (!accumulation) {
			if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
				const overflowAccumulation = this._activeCollectionStorage.getOrDefault(this._overflowAttributes, () => this._aggregator.createAccumulation(collectionTime));
				overflowAccumulation?.record(value);
				return;
			}
			accumulation = this._aggregator.createAccumulation(collectionTime);
			this._activeCollectionStorage.set(attributes, accumulation);
		}
		accumulation?.record(value);
	}
	batchCumulate(measurements, collectionTime) {
		Array.from(measurements.entries()).forEach(([attributes, value, hashCode]) => {
			const accumulation = this._aggregator.createAccumulation(collectionTime);
			accumulation?.record(value);
			let delta = accumulation;
			if (this._cumulativeMemoStorage.has(attributes, hashCode)) {
				const previous = this._cumulativeMemoStorage.get(attributes, hashCode);
				delta = this._aggregator.diff(previous, accumulation);
			}
			else {
				if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
					attributes = this._overflowAttributes;
					hashCode = this._overflowHashCode;
					if (this._cumulativeMemoStorage.has(attributes, hashCode)) {
						const previous = this._cumulativeMemoStorage.get(attributes, hashCode);
						delta = this._aggregator.diff(previous, accumulation);
					}
				}
			}
			if (this._activeCollectionStorage.has(attributes, hashCode)) {
				const active = this._activeCollectionStorage.get(attributes, hashCode);
				delta = this._aggregator.merge(active, delta);
			}
			this._cumulativeMemoStorage.set(attributes, accumulation, hashCode);
			this._activeCollectionStorage.set(attributes, delta, hashCode);
		});
	}
	collect() {
		const unreportedDelta = this._activeCollectionStorage;
		this._activeCollectionStorage = new AttributeHashMap();
		return unreportedDelta;
	}
}

class TemporalMetricProcessor {
	_aggregator;
	_unreportedAccumulations = new Map();
	_reportHistory = new Map();
	constructor(_aggregator, collectorHandles) {
		this._aggregator = _aggregator;
		collectorHandles.forEach(handle => {
			this._unreportedAccumulations.set(handle, []);
		});
	}
	buildMetrics(collector, instrumentDescriptor, currentAccumulations, collectionTime) {
		this._stashAccumulations(currentAccumulations);
		const unreportedAccumulations = this._getMergedUnreportedAccumulations(collector);
		let result = unreportedAccumulations;
		let aggregationTemporality;
		if (this._reportHistory.has(collector)) {
			const last = this._reportHistory.get(collector);
			const lastCollectionTime = last.collectionTime;
			aggregationTemporality = last.aggregationTemporality;
			if (aggregationTemporality === AggregationTemporality.CUMULATIVE) {
				result = TemporalMetricProcessor.merge(last.accumulations, unreportedAccumulations, this._aggregator);
			}
			else {
				result = TemporalMetricProcessor.calibrateStartTime(last.accumulations, unreportedAccumulations, lastCollectionTime);
			}
		}
		else {
			aggregationTemporality = collector.selectAggregationTemporality(instrumentDescriptor.type);
		}
		this._reportHistory.set(collector, {
			accumulations: result,
			collectionTime,
			aggregationTemporality,
		});
		const accumulationRecords = AttributesMapToAccumulationRecords(result);
		if (accumulationRecords.length === 0) {
			return undefined;
		}
		return this._aggregator.toMetricData(instrumentDescriptor, aggregationTemporality, accumulationRecords,
		collectionTime);
	}
	_stashAccumulations(currentAccumulation) {
		const registeredCollectors = this._unreportedAccumulations.keys();
		for (const collector of registeredCollectors) {
			let stash = this._unreportedAccumulations.get(collector);
			if (stash === undefined) {
				stash = [];
				this._unreportedAccumulations.set(collector, stash);
			}
			stash.push(currentAccumulation);
		}
	}
	_getMergedUnreportedAccumulations(collector) {
		let result = new AttributeHashMap();
		const unreportedList = this._unreportedAccumulations.get(collector);
		this._unreportedAccumulations.set(collector, []);
		if (unreportedList === undefined) {
			return result;
		}
		for (const it of unreportedList) {
			result = TemporalMetricProcessor.merge(result, it, this._aggregator);
		}
		return result;
	}
	static merge(last, current, aggregator) {
		const result = last;
		const iterator = current.entries();
		let next = iterator.next();
		while (next.done !== true) {
			const [key, record, hash] = next.value;
			if (last.has(key, hash)) {
				const lastAccumulation = last.get(key, hash);
				const accumulation = aggregator.merge(lastAccumulation, record);
				result.set(key, accumulation, hash);
			}
			else {
				result.set(key, record, hash);
			}
			next = iterator.next();
		}
		return result;
	}
	static calibrateStartTime(last, current, lastCollectionTime) {
		for (const [key, hash] of last.keys()) {
			const currentAccumulation = current.get(key, hash);
			currentAccumulation?.setStartTime(lastCollectionTime);
		}
		return current;
	}
}
function AttributesMapToAccumulationRecords(map) {
	return Array.from(map.entries());
}

class AsyncMetricStorage extends MetricStorage {
	_attributesProcessor;
	_aggregationCardinalityLimit;
	_deltaMetricStorage;
	_temporalMetricStorage;
	constructor(_instrumentDescriptor, aggregator, _attributesProcessor, collectorHandles, _aggregationCardinalityLimit) {
		super(_instrumentDescriptor);
		this._attributesProcessor = _attributesProcessor;
		this._aggregationCardinalityLimit = _aggregationCardinalityLimit;
		this._deltaMetricStorage = new DeltaMetricProcessor(aggregator, this._aggregationCardinalityLimit);
		this._temporalMetricStorage = new TemporalMetricProcessor(aggregator, collectorHandles);
	}
	record(measurements, observationTime) {
		const processed = new AttributeHashMap();
		Array.from(measurements.entries()).forEach(([attributes, value]) => {
			processed.set(this._attributesProcessor.process(attributes), value);
		});
		this._deltaMetricStorage.batchCumulate(processed, observationTime);
	}
	collect(collector, collectionTime) {
		const accumulations = this._deltaMetricStorage.collect();
		return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
	}
}

function getIncompatibilityDetails(existing, otherDescriptor) {
	let incompatibility = '';
	if (existing.unit !== otherDescriptor.unit) {
		incompatibility += `\t- Unit '${existing.unit}' does not match '${otherDescriptor.unit}'\n`;
	}
	if (existing.type !== otherDescriptor.type) {
		incompatibility += `\t- Type '${existing.type}' does not match '${otherDescriptor.type}'\n`;
	}
	if (existing.valueType !== otherDescriptor.valueType) {
		incompatibility += `\t- Value Type '${existing.valueType}' does not match '${otherDescriptor.valueType}'\n`;
	}
	if (existing.description !== otherDescriptor.description) {
		incompatibility += `\t- Description '${existing.description}' does not match '${otherDescriptor.description}'\n`;
	}
	return incompatibility;
}
function getValueTypeConflictResolutionRecipe(existing, otherDescriptor) {
	return `\t- use valueType '${existing.valueType}' on instrument creation or use an instrument name other than '${otherDescriptor.name}'`;
}
function getUnitConflictResolutionRecipe(existing, otherDescriptor) {
	return `\t- use unit '${existing.unit}' on instrument creation or use an instrument name other than '${otherDescriptor.name}'`;
}
function getTypeConflictResolutionRecipe(existing, otherDescriptor) {
	const selector = {
		name: otherDescriptor.name,
		type: otherDescriptor.type,
		unit: otherDescriptor.unit,
	};
	const selectorString = JSON.stringify(selector);
	return `\t- create a new view with a name other than '${existing.name}' and InstrumentSelector '${selectorString}'`;
}
function getDescriptionResolutionRecipe(existing, otherDescriptor) {
	const selector = {
		name: otherDescriptor.name,
		type: otherDescriptor.type,
		unit: otherDescriptor.unit,
	};
	const selectorString = JSON.stringify(selector);
	return `\t- create a new view with a name other than '${existing.name}' and InstrumentSelector '${selectorString}'
	\t- OR - create a new view with the name ${existing.name} and description '${existing.description}' and InstrumentSelector ${selectorString}
	\t- OR - create a new view with the name ${otherDescriptor.name} and description '${existing.description}' and InstrumentSelector ${selectorString}`;
}
function getConflictResolutionRecipe(existing, otherDescriptor) {
	if (existing.valueType !== otherDescriptor.valueType) {
		return getValueTypeConflictResolutionRecipe(existing, otherDescriptor);
	}
	if (existing.unit !== otherDescriptor.unit) {
		return getUnitConflictResolutionRecipe(existing, otherDescriptor);
	}
	if (existing.type !== otherDescriptor.type) {
		return getTypeConflictResolutionRecipe(existing, otherDescriptor);
	}
	if (existing.description !== otherDescriptor.description) {
		return getDescriptionResolutionRecipe(existing, otherDescriptor);
	}
	return '';
}

class MetricStorageRegistry {
	_sharedRegistry = new Map();
	_perCollectorRegistry = new Map();
	static create() {
		return new MetricStorageRegistry();
	}
	getStorages(collector) {
		let storages = [];
		for (const metricStorages of this._sharedRegistry.values()) {
			storages = storages.concat(metricStorages);
		}
		const perCollectorStorages = this._perCollectorRegistry.get(collector);
		if (perCollectorStorages != null) {
			for (const metricStorages of perCollectorStorages.values()) {
				storages = storages.concat(metricStorages);
			}
		}
		return storages;
	}
	register(storage) {
		this._registerStorage(storage, this._sharedRegistry);
	}
	registerForCollector(collector, storage) {
		let storageMap = this._perCollectorRegistry.get(collector);
		if (storageMap == null) {
			storageMap = new Map();
			this._perCollectorRegistry.set(collector, storageMap);
		}
		this._registerStorage(storage, storageMap);
	}
	findOrUpdateCompatibleStorage(expectedDescriptor) {
		const storages = this._sharedRegistry.get(expectedDescriptor.name);
		if (storages === undefined) {
			return null;
		}
		return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
	}
	findOrUpdateCompatibleCollectorStorage(collector, expectedDescriptor) {
		const storageMap = this._perCollectorRegistry.get(collector);
		if (storageMap === undefined) {
			return null;
		}
		const storages = storageMap.get(expectedDescriptor.name);
		if (storages === undefined) {
			return null;
		}
		return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
	}
	_registerStorage(storage, storageMap) {
		const descriptor = storage.getInstrumentDescriptor();
		const storages = storageMap.get(descriptor.name);
		if (storages === undefined) {
			storageMap.set(descriptor.name, [storage]);
			return;
		}
		storages.push(storage);
	}
	_findOrUpdateCompatibleStorage(expectedDescriptor, existingStorages) {
		let compatibleStorage = null;
		for (const existingStorage of existingStorages) {
			const existingDescriptor = existingStorage.getInstrumentDescriptor();
			if (isDescriptorCompatibleWith(existingDescriptor, expectedDescriptor)) {
				if (existingDescriptor.description !== expectedDescriptor.description) {
					if (expectedDescriptor.description.length >
						existingDescriptor.description.length) {
						existingStorage.updateDescription(expectedDescriptor.description);
					}
					api.diag.warn('A view or instrument with the name ', expectedDescriptor.name, ' has already been registered, but has a different description and is incompatible with another registered view.\n', 'Details:\n', getIncompatibilityDetails(existingDescriptor, expectedDescriptor), 'The longer description will be used.\nTo resolve the conflict:', getConflictResolutionRecipe(existingDescriptor, expectedDescriptor));
				}
				compatibleStorage = existingStorage;
			}
			else {
				api.diag.warn('A view or instrument with the name ', expectedDescriptor.name, ' has already been registered and is incompatible with another registered view.\n', 'Details:\n', getIncompatibilityDetails(existingDescriptor, expectedDescriptor), 'To resolve the conflict:\n', getConflictResolutionRecipe(existingDescriptor, expectedDescriptor));
			}
		}
		return compatibleStorage;
	}
}

class MultiMetricStorage {
	_backingStorages;
	constructor(_backingStorages) {
		this._backingStorages = _backingStorages;
	}
	record(value, attributes, context, recordTime) {
		this._backingStorages.forEach(it => {
			it.record(value, attributes, context, recordTime);
		});
	}
}

class ObservableResultImpl {
	_instrumentName;
	_valueType;
	_buffer = new AttributeHashMap();
	constructor(_instrumentName, _valueType) {
		this._instrumentName = _instrumentName;
		this._valueType = _valueType;
	}
	observe(value, attributes = {}) {
		if (typeof value !== 'number') {
			diag.warn(`non-number value provided to metric ${this._instrumentName}: ${value}`);
			return;
		}
		if (this._valueType === ValueType.INT && !Number.isInteger(value)) {
			diag.warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`);
			value = Math.trunc(value);
			if (!Number.isInteger(value)) {
				return;
			}
		}
		this._buffer.set(attributes, value);
	}
}
class BatchObservableResultImpl {
	_buffer = new Map();
	observe(metric, value, attributes = {}) {
		if (!isObservableInstrument(metric)) {
			return;
		}
		let map = this._buffer.get(metric);
		if (map == null) {
			map = new AttributeHashMap();
			this._buffer.set(metric, map);
		}
		if (typeof value !== 'number') {
			diag.warn(`non-number value provided to metric ${metric._descriptor.name}: ${value}`);
			return;
		}
		if (metric._descriptor.valueType === ValueType.INT &&
			!Number.isInteger(value)) {
			diag.warn(`INT value type cannot accept a floating-point value for ${metric._descriptor.name}, ignoring the fractional digits.`);
			value = Math.trunc(value);
			if (!Number.isInteger(value)) {
				return;
			}
		}
		map.set(attributes, value);
	}
}

class ObservableRegistry {
	_callbacks = [];
	_batchCallbacks = [];
	addCallback(callback, instrument) {
		const idx = this._findCallback(callback, instrument);
		if (idx >= 0) {
			return;
		}
		this._callbacks.push({ callback, instrument });
	}
	removeCallback(callback, instrument) {
		const idx = this._findCallback(callback, instrument);
		if (idx < 0) {
			return;
		}
		this._callbacks.splice(idx, 1);
	}
	addBatchCallback(callback, instruments) {
		const observableInstruments = new Set(instruments.filter(isObservableInstrument));
		if (observableInstruments.size === 0) {
			diag.error('BatchObservableCallback is not associated with valid instruments', instruments);
			return;
		}
		const idx = this._findBatchCallback(callback, observableInstruments);
		if (idx >= 0) {
			return;
		}
		this._batchCallbacks.push({ callback, instruments: observableInstruments });
	}
	removeBatchCallback(callback, instruments) {
		const observableInstruments = new Set(instruments.filter(isObservableInstrument));
		const idx = this._findBatchCallback(callback, observableInstruments);
		if (idx < 0) {
			return;
		}
		this._batchCallbacks.splice(idx, 1);
	}
	async observe(collectionTime, timeoutMillis) {
		const callbackFutures = this._observeCallbacks(collectionTime, timeoutMillis);
		const batchCallbackFutures = this._observeBatchCallbacks(collectionTime, timeoutMillis);
		const results = await PromiseAllSettled([
			...callbackFutures,
			...batchCallbackFutures,
		]);
		const rejections = results
			.filter(isPromiseAllSettledRejectionResult)
			.map(it => it.reason);
		return rejections;
	}
	_observeCallbacks(observationTime, timeoutMillis) {
		return this._callbacks.map(async ({ callback, instrument }) => {
			const observableResult = new ObservableResultImpl(instrument._descriptor.name, instrument._descriptor.valueType);
			let callPromise = Promise.resolve(callback(observableResult));
			if (timeoutMillis != null) {
				callPromise = callWithTimeout(callPromise, timeoutMillis);
			}
			await callPromise;
			instrument._metricStorages.forEach(metricStorage => {
				metricStorage.record(observableResult._buffer, observationTime);
			});
		});
	}
	_observeBatchCallbacks(observationTime, timeoutMillis) {
		return this._batchCallbacks.map(async ({ callback, instruments }) => {
			const observableResult = new BatchObservableResultImpl();
			let callPromise = Promise.resolve(callback(observableResult));
			if (timeoutMillis != null) {
				callPromise = callWithTimeout(callPromise, timeoutMillis);
			}
			await callPromise;
			instruments.forEach(instrument => {
				const buffer = observableResult._buffer.get(instrument);
				if (buffer == null) {
					return;
				}
				instrument._metricStorages.forEach(metricStorage => {
					metricStorage.record(buffer, observationTime);
				});
			});
		});
	}
	_findCallback(callback, instrument) {
		return this._callbacks.findIndex(record => {
			return record.callback === callback && record.instrument === instrument;
		});
	}
	_findBatchCallback(callback, instruments) {
		return this._batchCallbacks.findIndex(record => {
			return (record.callback === callback &&
				setEquals(record.instruments, instruments));
		});
	}
}

class SyncMetricStorage extends MetricStorage {
	_attributesProcessor;
	_aggregationCardinalityLimit;
	_deltaMetricStorage;
	_temporalMetricStorage;
	constructor(instrumentDescriptor, aggregator, _attributesProcessor, collectorHandles, _aggregationCardinalityLimit) {
		super(instrumentDescriptor);
		this._attributesProcessor = _attributesProcessor;
		this._aggregationCardinalityLimit = _aggregationCardinalityLimit;
		this._deltaMetricStorage = new DeltaMetricProcessor(aggregator, this._aggregationCardinalityLimit);
		this._temporalMetricStorage = new TemporalMetricProcessor(aggregator, collectorHandles);
	}
	record(value, attributes, context, recordTime) {
		attributes = this._attributesProcessor.process(attributes, context);
		this._deltaMetricStorage.record(value, attributes, context, recordTime);
	}
	collect(collector, collectionTime) {
		const accumulations = this._deltaMetricStorage.collect();
		return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
	}
}

class NoopAttributesProcessor {
	process(incoming, _context) {
		return incoming;
	}
}
class MultiAttributesProcessor {
	_processors;
	constructor(_processors) {
		this._processors = _processors;
	}
	process(incoming, context) {
		let filteredAttributes = incoming;
		for (const processor of this._processors) {
			filteredAttributes = processor.process(filteredAttributes, context);
		}
		return filteredAttributes;
	}
}
class AllowListProcessor {
	_allowedAttributeNames;
	constructor(_allowedAttributeNames) {
		this._allowedAttributeNames = _allowedAttributeNames;
	}
	process(incoming, _context) {
		const filteredAttributes = {};
		Object.keys(incoming)
			.filter(attributeName => this._allowedAttributeNames.includes(attributeName))
			.forEach(attributeName => (filteredAttributes[attributeName] = incoming[attributeName]));
		return filteredAttributes;
	}
}
class DenyListProcessor {
	_deniedAttributeNames;
	constructor(_deniedAttributeNames) {
		this._deniedAttributeNames = _deniedAttributeNames;
	}
	process(incoming, _context) {
		const filteredAttributes = {};
		Object.keys(incoming)
			.filter(attributeName => !this._deniedAttributeNames.includes(attributeName))
			.forEach(attributeName => (filteredAttributes[attributeName] = incoming[attributeName]));
		return filteredAttributes;
	}
}
function createNoopAttributesProcessor() {
	return NOOP;
}
function createMultiAttributesProcessor(processors) {
	return new MultiAttributesProcessor(processors);
}
function createAllowListAttributesProcessor(attributeAllowList) {
	return new AllowListProcessor(attributeAllowList);
}
function createDenyListAttributesProcessor(attributeDenyList) {
	return new DenyListProcessor(attributeDenyList);
}
const NOOP = new NoopAttributesProcessor();

class MeterSharedState {
	_meterProviderSharedState;
	_instrumentationScope;
	metricStorageRegistry = new MetricStorageRegistry();
	observableRegistry = new ObservableRegistry();
	meter;
	constructor(_meterProviderSharedState, _instrumentationScope) {
		this._meterProviderSharedState = _meterProviderSharedState;
		this._instrumentationScope = _instrumentationScope;
		this.meter = new Meter(this);
	}
	registerMetricStorage(descriptor) {
		const storages = this._registerMetricStorage(descriptor, SyncMetricStorage);
		if (storages.length === 1) {
			return storages[0];
		}
		return new MultiMetricStorage(storages);
	}
	registerAsyncMetricStorage(descriptor) {
		const storages = this._registerMetricStorage(descriptor, AsyncMetricStorage);
		return storages;
	}
	async collect(collector, collectionTime, options) {
		const errors = await this.observableRegistry.observe(collectionTime, options?.timeoutMillis);
		const storages = this.metricStorageRegistry.getStorages(collector);
		if (storages.length === 0) {
			return null;
		}
		const metricDataList = storages
			.map(metricStorage => {
			return metricStorage.collect(collector, collectionTime);
		})
			.filter(isNotNullish);
		if (metricDataList.length === 0) {
			return { errors };
		}
		return {
			scopeMetrics: {
				scope: this._instrumentationScope,
				metrics: metricDataList,
			},
			errors,
		};
	}
	_registerMetricStorage(descriptor, MetricStorageType) {
		const views = this._meterProviderSharedState.viewRegistry.findViews(descriptor, this._instrumentationScope);
		let storages = views.map(view => {
			const viewDescriptor = createInstrumentDescriptorWithView(view, descriptor);
			const compatibleStorage = this.metricStorageRegistry.findOrUpdateCompatibleStorage(viewDescriptor);
			if (compatibleStorage != null) {
				return compatibleStorage;
			}
			const aggregator = view.aggregation.createAggregator(viewDescriptor);
			const viewStorage = new MetricStorageType(viewDescriptor, aggregator, view.attributesProcessor, this._meterProviderSharedState.metricCollectors, view.aggregationCardinalityLimit);
			this.metricStorageRegistry.register(viewStorage);
			return viewStorage;
		});
		if (storages.length === 0) {
			const perCollectorAggregations = this._meterProviderSharedState.selectAggregations(descriptor.type);
			const collectorStorages = perCollectorAggregations.map(([collector, aggregation]) => {
				const compatibleStorage = this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(collector, descriptor);
				if (compatibleStorage != null) {
					return compatibleStorage;
				}
				const aggregator = aggregation.createAggregator(descriptor);
				const cardinalityLimit = collector.selectCardinalityLimit(descriptor.type);
				const storage = new MetricStorageType(descriptor, aggregator, createNoopAttributesProcessor(), [collector], cardinalityLimit);
				this.metricStorageRegistry.registerForCollector(collector, storage);
				return storage;
			});
			storages = storages.concat(collectorStorages);
		}
		return storages;
	}
}

class MeterProviderSharedState {
	resource;
	viewRegistry = new ViewRegistry();
	metricCollectors = [];
	meterSharedStates = new Map();
	constructor(resource) {
		this.resource = resource;
	}
	getMeterSharedState(instrumentationScope) {
		const id = instrumentationScopeId(instrumentationScope);
		let meterSharedState = this.meterSharedStates.get(id);
		if (meterSharedState == null) {
			meterSharedState = new MeterSharedState(this, instrumentationScope);
			this.meterSharedStates.set(id, meterSharedState);
		}
		return meterSharedState;
	}
	selectAggregations(instrumentType) {
		const result = [];
		for (const collector of this.metricCollectors) {
			result.push([
				collector,
				toAggregation(collector.selectAggregation(instrumentType)),
			]);
		}
		return result;
	}
}

class MetricCollector {
	_sharedState;
	_metricReader;
	constructor(_sharedState, _metricReader) {
		this._sharedState = _sharedState;
		this._metricReader = _metricReader;
	}
	async collect(options) {
		const collectionTime = millisToHrTime(Date.now());
		const scopeMetrics = [];
		const errors = [];
		const meterCollectionPromises = Array.from(this._sharedState.meterSharedStates.values()).map(async (meterSharedState) => {
			const current = await meterSharedState.collect(this, collectionTime, options);
			if (current?.scopeMetrics != null) {
				scopeMetrics.push(current.scopeMetrics);
			}
			if (current?.errors != null) {
				errors.push(...current.errors);
			}
		});
		await Promise.all(meterCollectionPromises);
		return {
			resourceMetrics: {
				resource: this._sharedState.resource,
				scopeMetrics: scopeMetrics,
			},
			errors: errors,
		};
	}
	async forceFlush(options) {
		await this._metricReader.forceFlush(options);
	}
	async shutdown(options) {
		await this._metricReader.shutdown(options);
	}
	selectAggregationTemporality(instrumentType) {
		return this._metricReader.selectAggregationTemporality(instrumentType);
	}
	selectAggregation(instrumentType) {
		return this._metricReader.selectAggregation(instrumentType);
	}
	selectCardinalityLimit(instrumentType) {
		return this._metricReader.selectCardinalityLimit?.(instrumentType) ?? 2000;
	}
}

const ESCAPE = /[\^$\\.+?()[\]{}|]/g;
class PatternPredicate {
	_matchAll;
	_regexp;
	constructor(pattern) {
		if (pattern === '*') {
			this._matchAll = true;
			this._regexp = /.*/;
		}
		else {
			this._matchAll = false;
			this._regexp = new RegExp(PatternPredicate.escapePattern(pattern));
		}
	}
	match(str) {
		if (this._matchAll) {
			return true;
		}
		return this._regexp.test(str);
	}
	static escapePattern(pattern) {
		return `^${pattern.replace(ESCAPE, '\\$&').replace('*', '.*')}$`;
	}
	static hasWildcard(pattern) {
		return pattern.includes('*');
	}
}
class ExactPredicate {
	_matchAll;
	_pattern;
	constructor(pattern) {
		this._matchAll = pattern === undefined;
		this._pattern = pattern;
	}
	match(str) {
		if (this._matchAll) {
			return true;
		}
		if (str === this._pattern) {
			return true;
		}
		return false;
	}
}

class InstrumentSelector {
	_nameFilter;
	_type;
	_unitFilter;
	constructor(criteria) {
		this._nameFilter = new PatternPredicate(criteria?.name ?? '*');
		this._type = criteria?.type;
		this._unitFilter = new ExactPredicate(criteria?.unit);
	}
	getType() {
		return this._type;
	}
	getNameFilter() {
		return this._nameFilter;
	}
	getUnitFilter() {
		return this._unitFilter;
	}
}

class MeterSelector {
	_nameFilter;
	_versionFilter;
	_schemaUrlFilter;
	constructor(criteria) {
		this._nameFilter = new ExactPredicate(criteria?.name);
		this._versionFilter = new ExactPredicate(criteria?.version);
		this._schemaUrlFilter = new ExactPredicate(criteria?.schemaUrl);
	}
	getNameFilter() {
		return this._nameFilter;
	}
	getVersionFilter() {
		return this._versionFilter;
	}
	getSchemaUrlFilter() {
		return this._schemaUrlFilter;
	}
}

function isSelectorNotProvided(options) {
	return (options.instrumentName == null &&
		options.instrumentType == null &&
		options.instrumentUnit == null &&
		options.meterName == null &&
		options.meterVersion == null &&
		options.meterSchemaUrl == null);
}
function validateViewOptions(viewOptions) {
	if (isSelectorNotProvided(viewOptions)) {
		throw new Error('Cannot create view with no selector arguments supplied');
	}
	if (viewOptions.name != null &&
		(viewOptions?.instrumentName == null ||
			PatternPredicate.hasWildcard(viewOptions.instrumentName))) {
		throw new Error('Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.');
	}
}
class View {
	name;
	description;
	aggregation;
	attributesProcessor;
	instrumentSelector;
	meterSelector;
	aggregationCardinalityLimit;
	constructor(viewOptions) {
		validateViewOptions(viewOptions);
		if (viewOptions.attributesProcessors != null) {
			this.attributesProcessor = createMultiAttributesProcessor(viewOptions.attributesProcessors);
		}
		else {
			this.attributesProcessor = createNoopAttributesProcessor();
		}
		this.name = viewOptions.name;
		this.description = viewOptions.description;
		this.aggregation = toAggregation(viewOptions.aggregation ?? { type: AggregationType.DEFAULT });
		this.instrumentSelector = new InstrumentSelector({
			name: viewOptions.instrumentName,
			type: viewOptions.instrumentType,
			unit: viewOptions.instrumentUnit,
		});
		this.meterSelector = new MeterSelector({
			name: viewOptions.meterName,
			version: viewOptions.meterVersion,
			schemaUrl: viewOptions.meterSchemaUrl,
		});
		this.aggregationCardinalityLimit = viewOptions.aggregationCardinalityLimit;
	}
}

class MeterProvider {
	_sharedState;
	_shutdown = false;
	constructor(options) {
		this._sharedState = new MeterProviderSharedState(options?.resource ?? defaultResource());
		if (options?.views != null && options.views.length > 0) {
			for (const viewOption of options.views) {
				this._sharedState.viewRegistry.addView(new View(viewOption));
			}
		}
		if (options?.readers != null && options.readers.length > 0) {
			for (const metricReader of options.readers) {
				const collector = new MetricCollector(this._sharedState, metricReader);
				metricReader.setMetricProducer(collector);
				this._sharedState.metricCollectors.push(collector);
			}
		}
	}
	getMeter(name, version = '', options = {}) {
		if (this._shutdown) {
			diag.warn('A shutdown MeterProvider cannot provide a Meter');
			return createNoopMeter();
		}
		return this._sharedState.getMeterSharedState({
			name,
			version,
			schemaUrl: options.schemaUrl,
		}).meter;
	}
	async shutdown(options) {
		if (this._shutdown) {
			diag.warn('shutdown may only be called once per MeterProvider');
			return;
		}
		this._shutdown = true;
		await Promise.all(this._sharedState.metricCollectors.map(collector => {
			return collector.shutdown(options);
		}));
	}
	async forceFlush(options) {
		if (this._shutdown) {
			diag.warn('invalid attempt to force flush after MeterProvider shutdown');
			return;
		}
		await Promise.all(this._sharedState.metricCollectors.map(collector => {
			return collector.forceFlush(options);
		}));
	}
}

export { AggregationTemporality, AggregationType, ConsoleMetricExporter, DataPointType, InMemoryMetricExporter, InstrumentType, MeterProvider, MetricReader, PeriodicExportingMetricReader, TimeoutError, createAllowListAttributesProcessor, createDenyListAttributesProcessor };
