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
/// <reference types="./otlp-transformer.d.ts" />

import { hexToBinary, hrTimeToNanoseconds } from './core.js';
import { ValueType } from './api.js';
import { DataPointType, AggregationTemporality } from './sdk-metrics.js';

function hrTimeToNanos(hrTime) {
	const NANOSECONDS = BigInt(1000000000);
	return BigInt(hrTime[0]) * NANOSECONDS + BigInt(hrTime[1]);
}
function toLongBits(value) {
	const low = Number(BigInt.asUintN(32, value));
	const high = Number(BigInt.asUintN(32, value >> BigInt(32)));
	return { low, high };
}
function encodeAsLongBits(hrTime) {
	const nanos = hrTimeToNanos(hrTime);
	return toLongBits(nanos);
}
function encodeAsString(hrTime) {
	const nanos = hrTimeToNanos(hrTime);
	return nanos.toString();
}
const encodeTimestamp = typeof BigInt !== 'undefined' ? encodeAsString : hrTimeToNanoseconds;
function identity(value) {
	return value;
}
function optionalHexToBinary(str) {
	if (str === undefined)
		return undefined;
	return hexToBinary(str);
}
const DEFAULT_ENCODER = {
	encodeHrTime: encodeAsLongBits,
	encodeSpanContext: hexToBinary,
	encodeOptionalSpanContext: optionalHexToBinary,
};
function getOtlpEncoder(options) {
	if (options === undefined) {
		return DEFAULT_ENCODER;
	}
	const useLongBits = options.useLongBits ?? true;
	const useHex = options.useHex ?? false;
	return {
		encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
		encodeSpanContext: useHex ? identity : hexToBinary,
		encodeOptionalSpanContext: useHex ? identity : optionalHexToBinary,
	};
}

var ESpanKind;
(function (ESpanKind) {
	ESpanKind[ESpanKind["SPAN_KIND_UNSPECIFIED"] = 0] = "SPAN_KIND_UNSPECIFIED";
	ESpanKind[ESpanKind["SPAN_KIND_INTERNAL"] = 1] = "SPAN_KIND_INTERNAL";
	ESpanKind[ESpanKind["SPAN_KIND_SERVER"] = 2] = "SPAN_KIND_SERVER";
	ESpanKind[ESpanKind["SPAN_KIND_CLIENT"] = 3] = "SPAN_KIND_CLIENT";
	ESpanKind[ESpanKind["SPAN_KIND_PRODUCER"] = 4] = "SPAN_KIND_PRODUCER";
	ESpanKind[ESpanKind["SPAN_KIND_CONSUMER"] = 5] = "SPAN_KIND_CONSUMER";
})(ESpanKind || (ESpanKind = {}));

function createInstrumentationScope(scope) {
	return {
		name: scope.name,
		version: scope.version,
	};
}
function toAttributes(attributes) {
	return Object.keys(attributes).map(key => toKeyValue(key, attributes[key]));
}
function toKeyValue(key, value) {
	return {
		key: key,
		value: toAnyValue(value),
	};
}
function toAnyValue(value) {
	const t = typeof value;
	if (t === 'string')
		return { stringValue: value };
	if (t === 'number') {
		if (!Number.isInteger(value))
			return { doubleValue: value };
		return { intValue: value };
	}
	if (t === 'boolean')
		return { boolValue: value };
	if (value instanceof Uint8Array)
		return { bytesValue: value };
	if (Array.isArray(value))
		return { arrayValue: { values: value.map(toAnyValue) } };
	if (t === 'object' && value != null)
		return {
			kvlistValue: {
				values: Object.entries(value).map(([k, v]) => toKeyValue(k, v)),
			},
		};
	return {};
}

function sdkSpanToOtlpSpan(span, encoder) {
	const ctx = span.spanContext();
	const status = span.status;
	return {
		traceId: encoder.encodeSpanContext(ctx.traceId),
		spanId: encoder.encodeSpanContext(ctx.spanId),
		parentSpanId: encoder.encodeOptionalSpanContext(span.parentSpanId),
		traceState: ctx.traceState?.serialize(),
		name: span.name,
		kind: span.kind == null ? 0 : span.kind + 1,
		startTimeUnixNano: encoder.encodeHrTime(span.startTime),
		endTimeUnixNano: encoder.encodeHrTime(span.endTime),
		attributes: toAttributes(span.attributes),
		droppedAttributesCount: span.droppedAttributesCount,
		events: span.events.map(event => toOtlpSpanEvent(event, encoder)),
		droppedEventsCount: span.droppedEventsCount,
		status: {
			code: status.code,
			message: status.message,
		},
		links: span.links.map(link => toOtlpLink(link, encoder)),
		droppedLinksCount: span.droppedLinksCount,
	};
}
function toOtlpLink(link, encoder) {
	return {
		attributes: link.attributes ? toAttributes(link.attributes) : [],
		spanId: encoder.encodeSpanContext(link.context.spanId),
		traceId: encoder.encodeSpanContext(link.context.traceId),
		traceState: link.context.traceState?.serialize(),
		droppedAttributesCount: link.droppedAttributesCount || 0,
	};
}
function toOtlpSpanEvent(timedEvent, encoder) {
	return {
		attributes: timedEvent.attributes
			? toAttributes(timedEvent.attributes)
			: [],
		name: timedEvent.name,
		timeUnixNano: encoder.encodeHrTime(timedEvent.time),
		droppedAttributesCount: timedEvent.droppedAttributesCount || 0,
	};
}

function createResource(resource) {
	return {
		attributes: toAttributes(resource.attributes),
		droppedAttributesCount: 0,
	};
}

function createExportTraceServiceRequest(spans, options) {
	const encoder = getOtlpEncoder(options);
	return {
		resourceSpans: spanRecordsToResourceSpans(spans, encoder),
	};
}
function createResourceMap$1(readableSpans) {
	const resourceMap = new Map();
	for (const record of readableSpans) {
		let ilmMap = resourceMap.get(record.resource);
		if (!ilmMap) {
			ilmMap = new Map();
			resourceMap.set(record.resource, ilmMap);
		}
		const instrumentationLibraryKey = `${record.instrumentationLibrary.name}@${record.instrumentationLibrary.version || ''}:${record.instrumentationLibrary.schemaUrl || ''}`;
		let records = ilmMap.get(instrumentationLibraryKey);
		if (!records) {
			records = [];
			ilmMap.set(instrumentationLibraryKey, records);
		}
		records.push(record);
	}
	return resourceMap;
}
function spanRecordsToResourceSpans(readableSpans, encoder) {
	const resourceMap = createResourceMap$1(readableSpans);
	const out = [];
	const entryIterator = resourceMap.entries();
	let entry = entryIterator.next();
	while (!entry.done) {
		const [resource, ilmMap] = entry.value;
		const scopeResourceSpans = [];
		const ilmIterator = ilmMap.values();
		let ilmEntry = ilmIterator.next();
		while (!ilmEntry.done) {
			const scopeSpans = ilmEntry.value;
			if (scopeSpans.length > 0) {
				const spans = scopeSpans.map(readableSpan => sdkSpanToOtlpSpan(readableSpan, encoder));
				scopeResourceSpans.push({
					scope: createInstrumentationScope(scopeSpans[0].instrumentationLibrary),
					spans: spans,
					schemaUrl: scopeSpans[0].instrumentationLibrary.schemaUrl,
				});
			}
			ilmEntry = ilmIterator.next();
		}
		const transformedSpans = {
			resource: createResource(resource),
			scopeSpans: scopeResourceSpans,
			schemaUrl: undefined,
		};
		out.push(transformedSpans);
		entry = entryIterator.next();
	}
	return out;
}

function toResourceMetrics(resourceMetrics, options) {
	const encoder = getOtlpEncoder(options);
	return {
		resource: createResource(resourceMetrics.resource),
		schemaUrl: undefined,
		scopeMetrics: toScopeMetrics(resourceMetrics.scopeMetrics, encoder),
	};
}
function toScopeMetrics(scopeMetrics, encoder) {
	return Array.from(scopeMetrics.map(metrics => ({
		scope: createInstrumentationScope(metrics.scope),
		metrics: metrics.metrics.map(metricData => toMetric(metricData, encoder)),
		schemaUrl: metrics.scope.schemaUrl,
	})));
}
function toMetric(metricData, encoder) {
	const out = {
		name: metricData.descriptor.name,
		description: metricData.descriptor.description,
		unit: metricData.descriptor.unit,
	};
	const aggregationTemporality = toAggregationTemporality(metricData.aggregationTemporality);
	switch (metricData.dataPointType) {
		case DataPointType.SUM:
			out.sum = {
				aggregationTemporality,
				isMonotonic: metricData.isMonotonic,
				dataPoints: toSingularDataPoints(metricData, encoder),
			};
			break;
		case DataPointType.GAUGE:
			out.gauge = {
				dataPoints: toSingularDataPoints(metricData, encoder),
			};
			break;
		case DataPointType.HISTOGRAM:
			out.histogram = {
				aggregationTemporality,
				dataPoints: toHistogramDataPoints(metricData, encoder),
			};
			break;
		case DataPointType.EXPONENTIAL_HISTOGRAM:
			out.exponentialHistogram = {
				aggregationTemporality,
				dataPoints: toExponentialHistogramDataPoints(metricData, encoder),
			};
			break;
	}
	return out;
}
function toSingularDataPoint(dataPoint, valueType, encoder) {
	const out = {
		attributes: toAttributes(dataPoint.attributes),
		startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
		timeUnixNano: encoder.encodeHrTime(dataPoint.endTime),
	};
	switch (valueType) {
		case ValueType.INT:
			out.asInt = dataPoint.value;
			break;
		case ValueType.DOUBLE:
			out.asDouble = dataPoint.value;
			break;
	}
	return out;
}
function toSingularDataPoints(metricData, encoder) {
	return metricData.dataPoints.map(dataPoint => {
		return toSingularDataPoint(dataPoint, metricData.descriptor.valueType, encoder);
	});
}
function toHistogramDataPoints(metricData, encoder) {
	return metricData.dataPoints.map(dataPoint => {
		const histogram = dataPoint.value;
		return {
			attributes: toAttributes(dataPoint.attributes),
			bucketCounts: histogram.buckets.counts,
			explicitBounds: histogram.buckets.boundaries,
			count: histogram.count,
			sum: histogram.sum,
			min: histogram.min,
			max: histogram.max,
			startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
			timeUnixNano: encoder.encodeHrTime(dataPoint.endTime),
		};
	});
}
function toExponentialHistogramDataPoints(metricData, encoder) {
	return metricData.dataPoints.map(dataPoint => {
		const histogram = dataPoint.value;
		return {
			attributes: toAttributes(dataPoint.attributes),
			count: histogram.count,
			min: histogram.min,
			max: histogram.max,
			sum: histogram.sum,
			positive: {
				offset: histogram.positive.offset,
				bucketCounts: histogram.positive.bucketCounts,
			},
			negative: {
				offset: histogram.negative.offset,
				bucketCounts: histogram.negative.bucketCounts,
			},
			scale: histogram.scale,
			zeroCount: histogram.zeroCount,
			startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
			timeUnixNano: encoder.encodeHrTime(dataPoint.endTime),
		};
	});
}
function toAggregationTemporality(temporality) {
	switch (temporality) {
		case AggregationTemporality.DELTA:
			return 1 ;
		case AggregationTemporality.CUMULATIVE:
			return 2 ;
	}
}

function createExportMetricsServiceRequest(resourceMetrics, options) {
	return {
		resourceMetrics: resourceMetrics.map(metrics => toResourceMetrics(metrics, options)),
	};
}

function createExportLogsServiceRequest(logRecords, options) {
	const encoder = getOtlpEncoder(options);
	return {
		resourceLogs: logRecordsToResourceLogs(logRecords, encoder),
	};
}
function createResourceMap(logRecords) {
	const resourceMap = new Map();
	for (const record of logRecords) {
		const { resource, instrumentationScope: { name, version = '', schemaUrl = '' }, } = record;
		let ismMap = resourceMap.get(resource);
		if (!ismMap) {
			ismMap = new Map();
			resourceMap.set(resource, ismMap);
		}
		const ismKey = `${name}@${version}:${schemaUrl}`;
		let records = ismMap.get(ismKey);
		if (!records) {
			records = [];
			ismMap.set(ismKey, records);
		}
		records.push(record);
	}
	return resourceMap;
}
function logRecordsToResourceLogs(logRecords, encoder) {
	const resourceMap = createResourceMap(logRecords);
	return Array.from(resourceMap, ([resource, ismMap]) => ({
		resource: createResource(resource),
		scopeLogs: Array.from(ismMap, ([, scopeLogs]) => {
			return {
				scope: createInstrumentationScope(scopeLogs[0].instrumentationScope),
				logRecords: scopeLogs.map(log => toLogRecord(log, encoder)),
				schemaUrl: scopeLogs[0].instrumentationScope.schemaUrl,
			};
		}),
		schemaUrl: undefined,
	}));
}
function toLogRecord(log, encoder) {
	return {
		timeUnixNano: encoder.encodeHrTime(log.hrTime),
		observedTimeUnixNano: encoder.encodeHrTime(log.hrTimeObserved),
		severityNumber: toSeverityNumber(log.severityNumber),
		severityText: log.severityText,
		body: toAnyValue(log.body),
		attributes: toLogAttributes(log.attributes),
		droppedAttributesCount: log.droppedAttributesCount,
		flags: log.spanContext?.traceFlags,
		traceId: encoder.encodeOptionalSpanContext(log.spanContext?.traceId),
		spanId: encoder.encodeOptionalSpanContext(log.spanContext?.spanId),
	};
}
function toSeverityNumber(severityNumber) {
	return severityNumber;
}
function toLogAttributes(attributes) {
	return Object.keys(attributes).map(key => toKeyValue(key, attributes[key]));
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var indexMinimal = {};

var minimal$1 = {};

var aspromise;
var hasRequiredAspromise;
function requireAspromise () {
	if (hasRequiredAspromise) return aspromise;
	hasRequiredAspromise = 1;
	aspromise = asPromise;
	function asPromise(fn, ctx) {
	    var params  = new Array(arguments.length - 1),
	        offset  = 0,
	        index   = 2,
	        pending = true;
	    while (index < arguments.length)
	        params[offset++] = arguments[index++];
	    return new Promise(function executor(resolve, reject) {
	        params[offset] = function callback(err) {
	            if (pending) {
	                pending = false;
	                if (err)
	                    reject(err);
	                else {
	                    var params = new Array(arguments.length - 1),
	                        offset = 0;
	                    while (offset < params.length)
	                        params[offset++] = arguments[offset];
	                    resolve.apply(null, params);
	                }
	            }
	        };
	        try {
	            fn.apply(ctx || null, params);
	        } catch (err) {
	            if (pending) {
	                pending = false;
	                reject(err);
	            }
	        }
	    });
	}
	return aspromise;
}

var base64$1 = {};

var hasRequiredBase64;
function requireBase64 () {
	if (hasRequiredBase64) return base64$1;
	hasRequiredBase64 = 1;
	(function (exports) {
		var base64 = exports;
		base64.length = function length(string) {
		    var p = string.length;
		    if (!p)
		        return 0;
		    var n = 0;
		    while (--p % 4 > 1 && string.charAt(p) === "=")
		        ++n;
		    return Math.ceil(string.length * 3) / 4 - n;
		};
		var b64 = new Array(64);
		var s64 = new Array(123);
		for (var i = 0; i < 64;)
		    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
		base64.encode = function encode(buffer, start, end) {
		    var parts = null,
		        chunk = [];
		    var i = 0,
		        j = 0,
		        t;
		    while (start < end) {
		        var b = buffer[start++];
		        switch (j) {
		            case 0:
		                chunk[i++] = b64[b >> 2];
		                t = (b & 3) << 4;
		                j = 1;
		                break;
		            case 1:
		                chunk[i++] = b64[t | b >> 4];
		                t = (b & 15) << 2;
		                j = 2;
		                break;
		            case 2:
		                chunk[i++] = b64[t | b >> 6];
		                chunk[i++] = b64[b & 63];
		                j = 0;
		                break;
		        }
		        if (i > 8191) {
		            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
		            i = 0;
		        }
		    }
		    if (j) {
		        chunk[i++] = b64[t];
		        chunk[i++] = 61;
		        if (j === 1)
		            chunk[i++] = 61;
		    }
		    if (parts) {
		        if (i)
		            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
		        return parts.join("");
		    }
		    return String.fromCharCode.apply(String, chunk.slice(0, i));
		};
		var invalidEncoding = "invalid encoding";
		base64.decode = function decode(string, buffer, offset) {
		    var start = offset;
		    var j = 0,
		        t;
		    for (var i = 0; i < string.length;) {
		        var c = string.charCodeAt(i++);
		        if (c === 61 && j > 1)
		            break;
		        if ((c = s64[c]) === undefined)
		            throw Error(invalidEncoding);
		        switch (j) {
		            case 0:
		                t = c;
		                j = 1;
		                break;
		            case 1:
		                buffer[offset++] = t << 2 | (c & 48) >> 4;
		                t = c;
		                j = 2;
		                break;
		            case 2:
		                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
		                t = c;
		                j = 3;
		                break;
		            case 3:
		                buffer[offset++] = (t & 3) << 6 | c;
		                j = 0;
		                break;
		        }
		    }
		    if (j === 1)
		        throw Error(invalidEncoding);
		    return offset - start;
		};
		base64.test = function test(string) {
		    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
		};
	} (base64$1));
	return base64$1;
}

var eventemitter;
var hasRequiredEventemitter;
function requireEventemitter () {
	if (hasRequiredEventemitter) return eventemitter;
	hasRequiredEventemitter = 1;
	eventemitter = EventEmitter;
	function EventEmitter() {
	    this._listeners = {};
	}
	EventEmitter.prototype.on = function on(evt, fn, ctx) {
	    (this._listeners[evt] || (this._listeners[evt] = [])).push({
	        fn  : fn,
	        ctx : ctx || this
	    });
	    return this;
	};
	EventEmitter.prototype.off = function off(evt, fn) {
	    if (evt === undefined)
	        this._listeners = {};
	    else {
	        if (fn === undefined)
	            this._listeners[evt] = [];
	        else {
	            var listeners = this._listeners[evt];
	            for (var i = 0; i < listeners.length;)
	                if (listeners[i].fn === fn)
	                    listeners.splice(i, 1);
	                else
	                    ++i;
	        }
	    }
	    return this;
	};
	EventEmitter.prototype.emit = function emit(evt) {
	    var listeners = this._listeners[evt];
	    if (listeners) {
	        var args = [],
	            i = 1;
	        for (; i < arguments.length;)
	            args.push(arguments[i++]);
	        for (i = 0; i < listeners.length;)
	            listeners[i].fn.apply(listeners[i++].ctx, args);
	    }
	    return this;
	};
	return eventemitter;
}

var float;
var hasRequiredFloat;
function requireFloat () {
	if (hasRequiredFloat) return float;
	hasRequiredFloat = 1;
	float = factory(factory);
	function factory(exports) {
	    if (typeof Float32Array !== "undefined") (function() {
	        var f32 = new Float32Array([ -0 ]),
	            f8b = new Uint8Array(f32.buffer),
	            le  = f8b[3] === 128;
	        function writeFloat_f32_cpy(val, buf, pos) {
	            f32[0] = val;
	            buf[pos    ] = f8b[0];
	            buf[pos + 1] = f8b[1];
	            buf[pos + 2] = f8b[2];
	            buf[pos + 3] = f8b[3];
	        }
	        function writeFloat_f32_rev(val, buf, pos) {
	            f32[0] = val;
	            buf[pos    ] = f8b[3];
	            buf[pos + 1] = f8b[2];
	            buf[pos + 2] = f8b[1];
	            buf[pos + 3] = f8b[0];
	        }
	        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
	        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
	        function readFloat_f32_cpy(buf, pos) {
	            f8b[0] = buf[pos    ];
	            f8b[1] = buf[pos + 1];
	            f8b[2] = buf[pos + 2];
	            f8b[3] = buf[pos + 3];
	            return f32[0];
	        }
	        function readFloat_f32_rev(buf, pos) {
	            f8b[3] = buf[pos    ];
	            f8b[2] = buf[pos + 1];
	            f8b[1] = buf[pos + 2];
	            f8b[0] = buf[pos + 3];
	            return f32[0];
	        }
	        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
	        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
	    })(); else (function() {
	        function writeFloat_ieee754(writeUint, val, buf, pos) {
	            var sign = val < 0 ? 1 : 0;
	            if (sign)
	                val = -val;
	            if (val === 0)
	                writeUint(1 / val > 0 ?  0 :  2147483648, buf, pos);
	            else if (isNaN(val))
	                writeUint(2143289344, buf, pos);
	            else if (val > 3.4028234663852886e+38)
	                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
	            else if (val < 1.1754943508222875e-38)
	                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
	            else {
	                var exponent = Math.floor(Math.log(val) / Math.LN2),
	                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
	                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
	            }
	        }
	        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
	        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
	        function readFloat_ieee754(readUint, buf, pos) {
	            var uint = readUint(buf, pos),
	                sign = (uint >> 31) * 2 + 1,
	                exponent = uint >>> 23 & 255,
	                mantissa = uint & 8388607;
	            return exponent === 255
	                ? mantissa
	                ? NaN
	                : sign * Infinity
	                : exponent === 0
	                ? sign * 1.401298464324817e-45 * mantissa
	                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
	        }
	        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
	        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
	    })();
	    if (typeof Float64Array !== "undefined") (function() {
	        var f64 = new Float64Array([-0]),
	            f8b = new Uint8Array(f64.buffer),
	            le  = f8b[7] === 128;
	        function writeDouble_f64_cpy(val, buf, pos) {
	            f64[0] = val;
	            buf[pos    ] = f8b[0];
	            buf[pos + 1] = f8b[1];
	            buf[pos + 2] = f8b[2];
	            buf[pos + 3] = f8b[3];
	            buf[pos + 4] = f8b[4];
	            buf[pos + 5] = f8b[5];
	            buf[pos + 6] = f8b[6];
	            buf[pos + 7] = f8b[7];
	        }
	        function writeDouble_f64_rev(val, buf, pos) {
	            f64[0] = val;
	            buf[pos    ] = f8b[7];
	            buf[pos + 1] = f8b[6];
	            buf[pos + 2] = f8b[5];
	            buf[pos + 3] = f8b[4];
	            buf[pos + 4] = f8b[3];
	            buf[pos + 5] = f8b[2];
	            buf[pos + 6] = f8b[1];
	            buf[pos + 7] = f8b[0];
	        }
	        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
	        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
	        function readDouble_f64_cpy(buf, pos) {
	            f8b[0] = buf[pos    ];
	            f8b[1] = buf[pos + 1];
	            f8b[2] = buf[pos + 2];
	            f8b[3] = buf[pos + 3];
	            f8b[4] = buf[pos + 4];
	            f8b[5] = buf[pos + 5];
	            f8b[6] = buf[pos + 6];
	            f8b[7] = buf[pos + 7];
	            return f64[0];
	        }
	        function readDouble_f64_rev(buf, pos) {
	            f8b[7] = buf[pos    ];
	            f8b[6] = buf[pos + 1];
	            f8b[5] = buf[pos + 2];
	            f8b[4] = buf[pos + 3];
	            f8b[3] = buf[pos + 4];
	            f8b[2] = buf[pos + 5];
	            f8b[1] = buf[pos + 6];
	            f8b[0] = buf[pos + 7];
	            return f64[0];
	        }
	        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
	        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
	    })(); else (function() {
	        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
	            var sign = val < 0 ? 1 : 0;
	            if (sign)
	                val = -val;
	            if (val === 0) {
	                writeUint(0, buf, pos + off0);
	                writeUint(1 / val > 0 ?  0 :  2147483648, buf, pos + off1);
	            } else if (isNaN(val)) {
	                writeUint(0, buf, pos + off0);
	                writeUint(2146959360, buf, pos + off1);
	            } else if (val > 1.7976931348623157e+308) {
	                writeUint(0, buf, pos + off0);
	                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
	            } else {
	                var mantissa;
	                if (val < 2.2250738585072014e-308) {
	                    mantissa = val / 5e-324;
	                    writeUint(mantissa >>> 0, buf, pos + off0);
	                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
	                } else {
	                    var exponent = Math.floor(Math.log(val) / Math.LN2);
	                    if (exponent === 1024)
	                        exponent = 1023;
	                    mantissa = val * Math.pow(2, -exponent);
	                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
	                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
	                }
	            }
	        }
	        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
	        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
	        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
	            var lo = readUint(buf, pos + off0),
	                hi = readUint(buf, pos + off1);
	            var sign = (hi >> 31) * 2 + 1,
	                exponent = hi >>> 20 & 2047,
	                mantissa = 4294967296 * (hi & 1048575) + lo;
	            return exponent === 2047
	                ? mantissa
	                ? NaN
	                : sign * Infinity
	                : exponent === 0
	                ? sign * 5e-324 * mantissa
	                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
	        }
	        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
	        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
	    })();
	    return exports;
	}
	function writeUintLE(val, buf, pos) {
	    buf[pos    ] =  val        & 255;
	    buf[pos + 1] =  val >>> 8  & 255;
	    buf[pos + 2] =  val >>> 16 & 255;
	    buf[pos + 3] =  val >>> 24;
	}
	function writeUintBE(val, buf, pos) {
	    buf[pos    ] =  val >>> 24;
	    buf[pos + 1] =  val >>> 16 & 255;
	    buf[pos + 2] =  val >>> 8  & 255;
	    buf[pos + 3] =  val        & 255;
	}
	function readUintLE(buf, pos) {
	    return (buf[pos    ]
	          | buf[pos + 1] << 8
	          | buf[pos + 2] << 16
	          | buf[pos + 3] << 24) >>> 0;
	}
	function readUintBE(buf, pos) {
	    return (buf[pos    ] << 24
	          | buf[pos + 1] << 16
	          | buf[pos + 2] << 8
	          | buf[pos + 3]) >>> 0;
	}
	return float;
}

var inquire_1;
var hasRequiredInquire;
function requireInquire () {
	if (hasRequiredInquire) return inquire_1;
	hasRequiredInquire = 1;
	inquire_1 = inquire;
	function inquire(moduleName) {
	    try {
	        var mod = eval("quire".replace(/^/,"re"))(moduleName);
	        if (mod && (mod.length || Object.keys(mod).length))
	            return mod;
	    } catch (e) {}
	    return null;
	}
	return inquire_1;
}

var utf8$2 = {};

var hasRequiredUtf8;
function requireUtf8 () {
	if (hasRequiredUtf8) return utf8$2;
	hasRequiredUtf8 = 1;
	(function (exports) {
		var utf8 = exports;
		utf8.length = function utf8_length(string) {
		    var len = 0,
		        c = 0;
		    for (var i = 0; i < string.length; ++i) {
		        c = string.charCodeAt(i);
		        if (c < 128)
		            len += 1;
		        else if (c < 2048)
		            len += 2;
		        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
		            ++i;
		            len += 4;
		        } else
		            len += 3;
		    }
		    return len;
		};
		utf8.read = function utf8_read(buffer, start, end) {
		    var len = end - start;
		    if (len < 1)
		        return "";
		    var parts = null,
		        chunk = [],
		        i = 0,
		        t;
		    while (start < end) {
		        t = buffer[start++];
		        if (t < 128)
		            chunk[i++] = t;
		        else if (t > 191 && t < 224)
		            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
		        else if (t > 239 && t < 365) {
		            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
		            chunk[i++] = 0xD800 + (t >> 10);
		            chunk[i++] = 0xDC00 + (t & 1023);
		        } else
		            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
		        if (i > 8191) {
		            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
		            i = 0;
		        }
		    }
		    if (parts) {
		        if (i)
		            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
		        return parts.join("");
		    }
		    return String.fromCharCode.apply(String, chunk.slice(0, i));
		};
		utf8.write = function utf8_write(string, buffer, offset) {
		    var start = offset,
		        c1,
		        c2;
		    for (var i = 0; i < string.length; ++i) {
		        c1 = string.charCodeAt(i);
		        if (c1 < 128) {
		            buffer[offset++] = c1;
		        } else if (c1 < 2048) {
		            buffer[offset++] = c1 >> 6       | 192;
		            buffer[offset++] = c1       & 63 | 128;
		        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
		            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
		            ++i;
		            buffer[offset++] = c1 >> 18      | 240;
		            buffer[offset++] = c1 >> 12 & 63 | 128;
		            buffer[offset++] = c1 >> 6  & 63 | 128;
		            buffer[offset++] = c1       & 63 | 128;
		        } else {
		            buffer[offset++] = c1 >> 12      | 224;
		            buffer[offset++] = c1 >> 6  & 63 | 128;
		            buffer[offset++] = c1       & 63 | 128;
		        }
		    }
		    return offset - start;
		};
	} (utf8$2));
	return utf8$2;
}

var pool_1;
var hasRequiredPool;
function requirePool () {
	if (hasRequiredPool) return pool_1;
	hasRequiredPool = 1;
	pool_1 = pool;
	function pool(alloc, slice, size) {
	    var SIZE   = size || 8192;
	    var MAX    = SIZE >>> 1;
	    var slab   = null;
	    var offset = SIZE;
	    return function pool_alloc(size) {
	        if (size < 1 || size > MAX)
	            return alloc(size);
	        if (offset + size > SIZE) {
	            slab = alloc(SIZE);
	            offset = 0;
	        }
	        var buf = slice.call(slab, offset, offset += size);
	        if (offset & 7)
	            offset = (offset | 7) + 1;
	        return buf;
	    };
	}
	return pool_1;
}

var longbits;
var hasRequiredLongbits;
function requireLongbits () {
	if (hasRequiredLongbits) return longbits;
	hasRequiredLongbits = 1;
	longbits = LongBits;
	var util = requireMinimal();
	function LongBits(lo, hi) {
	    this.lo = lo >>> 0;
	    this.hi = hi >>> 0;
	}
	var zero = LongBits.zero = new LongBits(0, 0);
	zero.toNumber = function() { return 0; };
	zero.zzEncode = zero.zzDecode = function() { return this; };
	zero.length = function() { return 1; };
	var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
	LongBits.fromNumber = function fromNumber(value) {
	    if (value === 0)
	        return zero;
	    var sign = value < 0;
	    if (sign)
	        value = -value;
	    var lo = value >>> 0,
	        hi = (value - lo) / 4294967296 >>> 0;
	    if (sign) {
	        hi = ~hi >>> 0;
	        lo = ~lo >>> 0;
	        if (++lo > 4294967295) {
	            lo = 0;
	            if (++hi > 4294967295)
	                hi = 0;
	        }
	    }
	    return new LongBits(lo, hi);
	};
	LongBits.from = function from(value) {
	    if (typeof value === "number")
	        return LongBits.fromNumber(value);
	    if (util.isString(value)) {
	        if (util.Long)
	            value = util.Long.fromString(value);
	        else
	            return LongBits.fromNumber(parseInt(value, 10));
	    }
	    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
	};
	LongBits.prototype.toNumber = function toNumber(unsigned) {
	    if (!unsigned && this.hi >>> 31) {
	        var lo = ~this.lo + 1 >>> 0,
	            hi = ~this.hi     >>> 0;
	        if (!lo)
	            hi = hi + 1 >>> 0;
	        return -(lo + hi * 4294967296);
	    }
	    return this.lo + this.hi * 4294967296;
	};
	LongBits.prototype.toLong = function toLong(unsigned) {
	    return util.Long
	        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
	        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
	};
	var charCodeAt = String.prototype.charCodeAt;
	LongBits.fromHash = function fromHash(hash) {
	    if (hash === zeroHash)
	        return zero;
	    return new LongBits(
	        ( charCodeAt.call(hash, 0)
	        | charCodeAt.call(hash, 1) << 8
	        | charCodeAt.call(hash, 2) << 16
	        | charCodeAt.call(hash, 3) << 24) >>> 0
	    ,
	        ( charCodeAt.call(hash, 4)
	        | charCodeAt.call(hash, 5) << 8
	        | charCodeAt.call(hash, 6) << 16
	        | charCodeAt.call(hash, 7) << 24) >>> 0
	    );
	};
	LongBits.prototype.toHash = function toHash() {
	    return String.fromCharCode(
	        this.lo        & 255,
	        this.lo >>> 8  & 255,
	        this.lo >>> 16 & 255,
	        this.lo >>> 24      ,
	        this.hi        & 255,
	        this.hi >>> 8  & 255,
	        this.hi >>> 16 & 255,
	        this.hi >>> 24
	    );
	};
	LongBits.prototype.zzEncode = function zzEncode() {
	    var mask =   this.hi >> 31;
	    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
	    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
	    return this;
	};
	LongBits.prototype.zzDecode = function zzDecode() {
	    var mask = -(this.lo & 1);
	    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
	    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
	    return this;
	};
	LongBits.prototype.length = function length() {
	    var part0 =  this.lo,
	        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
	        part2 =  this.hi >>> 24;
	    return part2 === 0
	         ? part1 === 0
	           ? part0 < 16384
	             ? part0 < 128 ? 1 : 2
	             : part0 < 2097152 ? 3 : 4
	           : part1 < 16384
	             ? part1 < 128 ? 5 : 6
	             : part1 < 2097152 ? 7 : 8
	         : part2 < 128 ? 9 : 10;
	};
	return longbits;
}

var hasRequiredMinimal;
function requireMinimal () {
	if (hasRequiredMinimal) return minimal$1;
	hasRequiredMinimal = 1;
	(function (exports) {
		var util = exports;
		util.asPromise = requireAspromise();
		util.base64 = requireBase64();
		util.EventEmitter = requireEventemitter();
		util.float = requireFloat();
		util.inquire = requireInquire();
		util.utf8 = requireUtf8();
		util.pool = requirePool();
		util.LongBits = requireLongbits();
		util.isNode = Boolean(typeof commonjsGlobal !== "undefined"
		                   && commonjsGlobal
		                   && commonjsGlobal.process
		                   && commonjsGlobal.process.versions
		                   && commonjsGlobal.process.versions.node);
		util.global = util.isNode && commonjsGlobal
		           || typeof window !== "undefined" && window
		           || typeof self   !== "undefined" && self
		           || commonjsGlobal;
		util.emptyArray = Object.freeze ? Object.freeze([]) :  [];
		util.emptyObject = Object.freeze ? Object.freeze({}) :  {};
		util.isInteger = Number.isInteger ||  function isInteger(value) {
		    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
		};
		util.isString = function isString(value) {
		    return typeof value === "string" || value instanceof String;
		};
		util.isObject = function isObject(value) {
		    return value && typeof value === "object";
		};
		util.isset =
		util.isSet = function isSet(obj, prop) {
		    var value = obj[prop];
		    if (value != null && obj.hasOwnProperty(prop))
		        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
		    return false;
		};
		util.Buffer = (function() {
		    try {
		        var Buffer = util.inquire("buffer").Buffer;
		        return Buffer.prototype.utf8Write ? Buffer :  null;
		    } catch (e) {
		        return null;
		    }
		})();
		util._Buffer_from = null;
		util._Buffer_allocUnsafe = null;
		util.newBuffer = function newBuffer(sizeOrArray) {
		    return typeof sizeOrArray === "number"
		        ? util.Buffer
		            ? util._Buffer_allocUnsafe(sizeOrArray)
		            : new util.Array(sizeOrArray)
		        : util.Buffer
		            ? util._Buffer_from(sizeOrArray)
		            : typeof Uint8Array === "undefined"
		                ? sizeOrArray
		                : new Uint8Array(sizeOrArray);
		};
		util.Array = typeof Uint8Array !== "undefined" ? Uint8Array  : Array;
		util.Long =  util.global.dcodeIO &&  util.global.dcodeIO.Long
		         ||  util.global.Long
		         || util.inquire("long");
		util.key2Re = /^true|false|0|1$/;
		util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
		util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
		util.longToHash = function longToHash(value) {
		    return value
		        ? util.LongBits.from(value).toHash()
		        : util.LongBits.zeroHash;
		};
		util.longFromHash = function longFromHash(hash, unsigned) {
		    var bits = util.LongBits.fromHash(hash);
		    if (util.Long)
		        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
		    return bits.toNumber(Boolean(unsigned));
		};
		function merge(dst, src, ifNotSet) {
		    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
		        if (dst[keys[i]] === undefined || !ifNotSet)
		            dst[keys[i]] = src[keys[i]];
		    return dst;
		}
		util.merge = merge;
		util.lcFirst = function lcFirst(str) {
		    return str.charAt(0).toLowerCase() + str.substring(1);
		};
		function newError(name) {
		    function CustomError(message, properties) {
		        if (!(this instanceof CustomError))
		            return new CustomError(message, properties);
		        Object.defineProperty(this, "message", { get: function() { return message; } });
		        if (Error.captureStackTrace)
		            Error.captureStackTrace(this, CustomError);
		        else
		            Object.defineProperty(this, "stack", { value: new Error().stack || "" });
		        if (properties)
		            merge(this, properties);
		    }
		    CustomError.prototype = Object.create(Error.prototype, {
		        constructor: {
		            value: CustomError,
		            writable: true,
		            enumerable: false,
		            configurable: true,
		        },
		        name: {
		            get: function get() { return name; },
		            set: undefined,
		            enumerable: false,
		            configurable: true,
		        },
		        toString: {
		            value: function value() { return this.name + ": " + this.message; },
		            writable: true,
		            enumerable: false,
		            configurable: true,
		        },
		    });
		    return CustomError;
		}
		util.newError = newError;
		util.ProtocolError = newError("ProtocolError");
		util.oneOfGetter = function getOneOf(fieldNames) {
		    var fieldMap = {};
		    for (var i = 0; i < fieldNames.length; ++i)
		        fieldMap[fieldNames[i]] = 1;
		    return function() {
		        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
		            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
		                return keys[i];
		    };
		};
		util.oneOfSetter = function setOneOf(fieldNames) {
		    return function(name) {
		        for (var i = 0; i < fieldNames.length; ++i)
		            if (fieldNames[i] !== name)
		                delete this[fieldNames[i]];
		    };
		};
		util.toJSONOptions = {
		    longs: String,
		    enums: String,
		    bytes: String,
		    json: true
		};
		util._configure = function() {
		    var Buffer = util.Buffer;
		    if (!Buffer) {
		        util._Buffer_from = util._Buffer_allocUnsafe = null;
		        return;
		    }
		    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
		        function Buffer_from(value, encoding) {
		            return new Buffer(value, encoding);
		        };
		    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
		        function Buffer_allocUnsafe(size) {
		            return new Buffer(size);
		        };
		};
	} (minimal$1));
	return minimal$1;
}

var writer = Writer$1;
var util$4      = requireMinimal();
var BufferWriter$1;
var LongBits$1  = util$4.LongBits,
	base64    = util$4.base64,
	utf8$1      = util$4.utf8;
function Op(fn, len, val) {
	this.fn = fn;
	this.len = len;
	this.next = undefined;
	this.val = val;
}
function noop() {}
function State(writer) {
	this.head = writer.head;
	this.tail = writer.tail;
	this.len = writer.len;
	this.next = writer.states;
}
function Writer$1() {
	this.len = 0;
	this.head = new Op(noop, 0, 0);
	this.tail = this.head;
	this.states = null;
}
var create$1 = function create() {
	return util$4.Buffer
		? function create_buffer_setup() {
			return (Writer$1.create = function create_buffer() {
				return new BufferWriter$1();
			})();
		}
		: function create_array() {
			return new Writer$1();
		};
};
Writer$1.create = create$1();
Writer$1.alloc = function alloc(size) {
	return new util$4.Array(size);
};
if (util$4.Array !== Array)
	Writer$1.alloc = util$4.pool(Writer$1.alloc, util$4.Array.prototype.subarray);
Writer$1.prototype._push = function push(fn, len, val) {
	this.tail = this.tail.next = new Op(fn, len, val);
	this.len += len;
	return this;
};
function writeByte(val, buf, pos) {
	buf[pos] = val & 255;
}
function writeVarint32(val, buf, pos) {
	while (val > 127) {
		buf[pos++] = val & 127 | 128;
		val >>>= 7;
	}
	buf[pos] = val;
}
function VarintOp(len, val) {
	this.len = len;
	this.next = undefined;
	this.val = val;
}
VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;
Writer$1.prototype.uint32 = function write_uint32(value) {
	this.len += (this.tail = this.tail.next = new VarintOp(
		(value = value >>> 0)
				< 128       ? 1
		: value < 16384     ? 2
		: value < 2097152   ? 3
		: value < 268435456 ? 4
		:                     5,
	value)).len;
	return this;
};
Writer$1.prototype.int32 = function write_int32(value) {
	return value < 0
		? this._push(writeVarint64, 10, LongBits$1.fromNumber(value))
		: this.uint32(value);
};
Writer$1.prototype.sint32 = function write_sint32(value) {
	return this.uint32((value << 1 ^ value >> 31) >>> 0);
};
function writeVarint64(val, buf, pos) {
	while (val.hi) {
		buf[pos++] = val.lo & 127 | 128;
		val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
		val.hi >>>= 7;
	}
	while (val.lo > 127) {
		buf[pos++] = val.lo & 127 | 128;
		val.lo = val.lo >>> 7;
	}
	buf[pos++] = val.lo;
}
Writer$1.prototype.uint64 = function write_uint64(value) {
	var bits = LongBits$1.from(value);
	return this._push(writeVarint64, bits.length(), bits);
};
Writer$1.prototype.int64 = Writer$1.prototype.uint64;
Writer$1.prototype.sint64 = function write_sint64(value) {
	var bits = LongBits$1.from(value).zzEncode();
	return this._push(writeVarint64, bits.length(), bits);
};
Writer$1.prototype.bool = function write_bool(value) {
	return this._push(writeByte, 1, value ? 1 : 0);
};
function writeFixed32(val, buf, pos) {
	buf[pos    ] =  val         & 255;
	buf[pos + 1] =  val >>> 8   & 255;
	buf[pos + 2] =  val >>> 16  & 255;
	buf[pos + 3] =  val >>> 24;
}
Writer$1.prototype.fixed32 = function write_fixed32(value) {
	return this._push(writeFixed32, 4, value >>> 0);
};
Writer$1.prototype.sfixed32 = Writer$1.prototype.fixed32;
Writer$1.prototype.fixed64 = function write_fixed64(value) {
	var bits = LongBits$1.from(value);
	return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};
Writer$1.prototype.sfixed64 = Writer$1.prototype.fixed64;
Writer$1.prototype.float = function write_float(value) {
	return this._push(util$4.float.writeFloatLE, 4, value);
};
Writer$1.prototype.double = function write_double(value) {
	return this._push(util$4.float.writeDoubleLE, 8, value);
};
var writeBytes = util$4.Array.prototype.set
	? function writeBytes_set(val, buf, pos) {
		buf.set(val, pos);
	}
	: function writeBytes_for(val, buf, pos) {
		for (var i = 0; i < val.length; ++i)
			buf[pos + i] = val[i];
	};
Writer$1.prototype.bytes = function write_bytes(value) {
	var len = value.length >>> 0;
	if (!len)
		return this._push(writeByte, 1, 0);
	if (util$4.isString(value)) {
		var buf = Writer$1.alloc(len = base64.length(value));
		base64.decode(value, buf, 0);
		value = buf;
	}
	return this.uint32(len)._push(writeBytes, len, value);
};
Writer$1.prototype.string = function write_string(value) {
	var len = utf8$1.length(value);
	return len
		? this.uint32(len)._push(utf8$1.write, len, value)
		: this._push(writeByte, 1, 0);
};
Writer$1.prototype.fork = function fork() {
	this.states = new State(this);
	this.head = this.tail = new Op(noop, 0, 0);
	this.len = 0;
	return this;
};
Writer$1.prototype.reset = function reset() {
	if (this.states) {
		this.head   = this.states.head;
		this.tail   = this.states.tail;
		this.len    = this.states.len;
		this.states = this.states.next;
	} else {
		this.head = this.tail = new Op(noop, 0, 0);
		this.len  = 0;
	}
	return this;
};
Writer$1.prototype.ldelim = function ldelim() {
	var head = this.head,
		tail = this.tail,
		len  = this.len;
	this.reset().uint32(len);
	if (len) {
		this.tail.next = head.next;
		this.tail = tail;
		this.len += len;
	}
	return this;
};
Writer$1.prototype.finish = function finish() {
	var head = this.head.next,
		buf  = this.constructor.alloc(this.len),
		pos  = 0;
	while (head) {
		head.fn(head.val, buf, pos);
		pos += head.len;
		head = head.next;
	}
	return buf;
};
Writer$1._configure = function(BufferWriter_) {
	BufferWriter$1 = BufferWriter_;
	Writer$1.create = create$1();
	BufferWriter$1._configure();
};
getDefaultExportFromCjs(writer);

var writer_buffer = BufferWriter;
var Writer = writer;
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
var util$3 = requireMinimal();
function BufferWriter() {
	Writer.call(this);
}
BufferWriter._configure = function () {
	BufferWriter.alloc = util$3._Buffer_allocUnsafe;
	BufferWriter.writeBytesBuffer = util$3.Buffer && util$3.Buffer.prototype instanceof Uint8Array && util$3.Buffer.prototype.set.name === "set"
		? function writeBytesBuffer_set(val, buf, pos) {
		buf.set(val, pos);
		}
		: function writeBytesBuffer_copy(val, buf, pos) {
		if (val.copy)
			val.copy(buf, pos, 0, val.length);
		else for (var i = 0; i < val.length;)
			buf[pos++] = val[i++];
		};
};
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
	if (util$3.isString(value))
		value = util$3._Buffer_from(value, "base64");
	var len = value.length >>> 0;
	this.uint32(len);
	if (len)
		this._push(BufferWriter.writeBytesBuffer, len, value);
	return this;
};
function writeStringBuffer(val, buf, pos) {
	if (val.length < 40)
		util$3.utf8.write(val, buf, pos);
	else if (buf.utf8Write)
		buf.utf8Write(val, pos);
	else
		buf.write(val, pos);
}
BufferWriter.prototype.string = function write_string_buffer(value) {
	var len = util$3.Buffer.byteLength(value);
	this.uint32(len);
	if (len)
		this._push(writeStringBuffer, len, value);
	return this;
};
BufferWriter._configure();
getDefaultExportFromCjs(writer_buffer);

var reader = Reader$1;
var util$2      = requireMinimal();
var BufferReader$1;
var LongBits  = util$2.LongBits,
	utf8      = util$2.utf8;
function indexOutOfRange(reader, writeLength) {
	return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}
function Reader$1(buffer) {
	this.buf = buffer;
	this.pos = 0;
	this.len = buffer.length;
}
var create_array = typeof Uint8Array !== "undefined"
	? function create_typed_array(buffer) {
		if (buffer instanceof Uint8Array || Array.isArray(buffer))
			return new Reader$1(buffer);
		throw Error("illegal buffer");
	}
	: function create_array(buffer) {
		if (Array.isArray(buffer))
			return new Reader$1(buffer);
		throw Error("illegal buffer");
	};
var create = function create() {
	return util$2.Buffer
		? function create_buffer_setup(buffer) {
			return (Reader$1.create = function create_buffer(buffer) {
				return util$2.Buffer.isBuffer(buffer)
					? new BufferReader$1(buffer)
					: create_array(buffer);
			})(buffer);
		}
		: create_array;
};
Reader$1.create = create();
Reader$1.prototype._slice = util$2.Array.prototype.subarray ||  util$2.Array.prototype.slice;
Reader$1.prototype.uint32 = (function read_uint32_setup() {
	var value = 4294967295;
	return function read_uint32() {
		value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
		value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
		value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
		value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
		value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;
		if ((this.pos += 5) > this.len) {
			this.pos = this.len;
			throw indexOutOfRange(this, 10);
		}
		return value;
	};
})();
Reader$1.prototype.int32 = function read_int32() {
	return this.uint32() | 0;
};
Reader$1.prototype.sint32 = function read_sint32() {
	var value = this.uint32();
	return value >>> 1 ^ -(value & 1) | 0;
};
function readLongVarint() {
	var bits = new LongBits(0, 0);
	var i = 0;
	if (this.len - this.pos > 4) {
		for (; i < 4; ++i) {
			bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
			if (this.buf[this.pos++] < 128)
				return bits;
		}
		bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
		bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
		if (this.buf[this.pos++] < 128)
			return bits;
		i = 0;
	} else {
		for (; i < 3; ++i) {
			if (this.pos >= this.len)
				throw indexOutOfRange(this);
			bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
			if (this.buf[this.pos++] < 128)
				return bits;
		}
		bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
		return bits;
	}
	if (this.len - this.pos > 4) {
		for (; i < 5; ++i) {
			bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
			if (this.buf[this.pos++] < 128)
				return bits;
		}
	} else {
		for (; i < 5; ++i) {
			if (this.pos >= this.len)
				throw indexOutOfRange(this);
			bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
			if (this.buf[this.pos++] < 128)
				return bits;
		}
	}
	throw Error("invalid varint encoding");
}
Reader$1.prototype.bool = function read_bool() {
	return this.uint32() !== 0;
};
function readFixed32_end(buf, end) {
	return (buf[end - 4]
		| buf[end - 3] << 8
		| buf[end - 2] << 16
		| buf[end - 1] << 24) >>> 0;
}
Reader$1.prototype.fixed32 = function read_fixed32() {
	if (this.pos + 4 > this.len)
		throw indexOutOfRange(this, 4);
	return readFixed32_end(this.buf, this.pos += 4);
};
Reader$1.prototype.sfixed32 = function read_sfixed32() {
	if (this.pos + 4 > this.len)
		throw indexOutOfRange(this, 4);
	return readFixed32_end(this.buf, this.pos += 4) | 0;
};
function readFixed64() {
	if (this.pos + 8 > this.len)
		throw indexOutOfRange(this, 8);
	return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}
Reader$1.prototype.float = function read_float() {
	if (this.pos + 4 > this.len)
		throw indexOutOfRange(this, 4);
	var value = util$2.float.readFloatLE(this.buf, this.pos);
	this.pos += 4;
	return value;
};
Reader$1.prototype.double = function read_double() {
	if (this.pos + 8 > this.len)
		throw indexOutOfRange(this, 4);
	var value = util$2.float.readDoubleLE(this.buf, this.pos);
	this.pos += 8;
	return value;
};
Reader$1.prototype.bytes = function read_bytes() {
	var length = this.uint32(),
		start  = this.pos,
		end    = this.pos + length;
	if (end > this.len)
		throw indexOutOfRange(this, length);
	this.pos += length;
	if (Array.isArray(this.buf))
		return this.buf.slice(start, end);
	if (start === end) {
		var nativeBuffer = util$2.Buffer;
		return nativeBuffer
			? nativeBuffer.alloc(0)
			: new this.buf.constructor(0);
	}
	return this._slice.call(this.buf, start, end);
};
Reader$1.prototype.string = function read_string() {
	var bytes = this.bytes();
	return utf8.read(bytes, 0, bytes.length);
};
Reader$1.prototype.skip = function skip(length) {
	if (typeof length === "number") {
		if (this.pos + length > this.len)
			throw indexOutOfRange(this, length);
		this.pos += length;
	} else {
		do {
			if (this.pos >= this.len)
				throw indexOutOfRange(this);
		} while (this.buf[this.pos++] & 128);
	}
	return this;
};
Reader$1.prototype.skipType = function(wireType) {
	switch (wireType) {
		case 0:
			this.skip();
			break;
		case 1:
			this.skip(8);
			break;
		case 2:
			this.skip(this.uint32());
			break;
		case 3:
			while ((wireType = this.uint32() & 7) !== 4) {
				this.skipType(wireType);
			}
			break;
		case 5:
			this.skip(4);
			break;
		default:
			throw Error("invalid wire type " + wireType + " at offset " + this.pos);
	}
	return this;
};
Reader$1._configure = function(BufferReader_) {
	BufferReader$1 = BufferReader_;
	Reader$1.create = create();
	BufferReader$1._configure();
	var fn = util$2.Long ? "toLong" :  "toNumber";
	util$2.merge(Reader$1.prototype, {
		int64: function read_int64() {
			return readLongVarint.call(this)[fn](false);
		},
		uint64: function read_uint64() {
			return readLongVarint.call(this)[fn](true);
		},
		sint64: function read_sint64() {
			return readLongVarint.call(this).zzDecode()[fn](false);
		},
		fixed64: function read_fixed64() {
			return readFixed64.call(this)[fn](true);
		},
		sfixed64: function read_sfixed64() {
			return readFixed64.call(this)[fn](false);
		}
	});
};
getDefaultExportFromCjs(reader);

var reader_buffer = BufferReader;
var Reader = reader;
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
var util$1 = requireMinimal();
function BufferReader(buffer) {
	Reader.call(this, buffer);
}
BufferReader._configure = function () {
	if (util$1.Buffer)
		BufferReader.prototype._slice = util$1.Buffer.prototype.slice;
};
BufferReader.prototype.string = function read_string_buffer() {
	var len = this.uint32();
	return this.buf.utf8Slice
		? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len))
		: this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
};
BufferReader._configure();
getDefaultExportFromCjs(reader_buffer);

var rpc = {};

var service = Service;
var util = requireMinimal();
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
function Service(rpcImpl, requestDelimited, responseDelimited) {
	if (typeof rpcImpl !== "function")
		throw TypeError("rpcImpl must be a function");
	util.EventEmitter.call(this);
	this.rpcImpl = rpcImpl;
	this.requestDelimited = Boolean(requestDelimited);
	this.responseDelimited = Boolean(responseDelimited);
}
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
	if (!request)
		throw TypeError("request must be specified");
	var self = this;
	if (!callback)
		return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);
	if (!self.rpcImpl) {
		setTimeout(function() { callback(Error("already ended")); }, 0);
		return undefined;
	}
	try {
		return self.rpcImpl(
			method,
			requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
			function rpcCallback(err, response) {
				if (err) {
					self.emit("error", err, method);
					return callback(err);
				}
				if (response === null) {
					self.end( true);
					return undefined;
				}
				if (!(response instanceof responseCtor)) {
					try {
						response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
					} catch (err) {
						self.emit("error", err, method);
						return callback(err);
					}
				}
				self.emit("data", response, method);
				return callback(null, response);
			}
		);
	} catch (err) {
		self.emit("error", err, method);
		setTimeout(function() { callback(err); }, 0);
		return undefined;
	}
};
Service.prototype.end = function end(endedByRPC) {
	if (this.rpcImpl) {
		if (!endedByRPC)
			this.rpcImpl(null, null, null);
		this.rpcImpl = null;
		this.emit("end").off();
	}
	return this;
};
getDefaultExportFromCjs(service);

(function (exports) {
	var rpc = exports;
	rpc.Service = service;
} (rpc));
getDefaultExportFromCjs(rpc);

var roots = {};
getDefaultExportFromCjs(roots);

(function (exports) {
	var protobuf = exports;
	protobuf.build = "minimal";
	protobuf.Writer       = writer;
	protobuf.BufferWriter = writer_buffer;
	protobuf.Reader       = reader;
	protobuf.BufferReader = reader_buffer;
	protobuf.util         = requireMinimal();
	protobuf.rpc          = rpc;
	protobuf.roots        = roots;
	protobuf.configure    = configure;
	function configure() {
	    protobuf.util._configure();
	    protobuf.Writer._configure(protobuf.BufferWriter);
	    protobuf.Reader._configure(protobuf.BufferReader);
	}
	configure();
} (indexMinimal));
getDefaultExportFromCjs(indexMinimal);

var minimal = indexMinimal;
getDefaultExportFromCjs(minimal);

var $protobuf = minimal;
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
$root.opentelemetry = (function () {
	var opentelemetry = {};
	opentelemetry.proto = (function () {
		var proto = {};
		proto.common = (function () {
			var common = {};
			common.v1 = (function () {
				var v1 = {};
				v1.AnyValue = (function () {
					function AnyValue(properties) {
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					AnyValue.prototype.stringValue = null;
					AnyValue.prototype.boolValue = null;
					AnyValue.prototype.intValue = null;
					AnyValue.prototype.doubleValue = null;
					AnyValue.prototype.arrayValue = null;
					AnyValue.prototype.kvlistValue = null;
					AnyValue.prototype.bytesValue = null;
					var $oneOfFields;
					Object.defineProperty(AnyValue.prototype, "value", {
						get: $util.oneOfGetter($oneOfFields = ["stringValue", "boolValue", "intValue", "doubleValue", "arrayValue", "kvlistValue", "bytesValue"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					AnyValue.create = function create(properties) {
						return new AnyValue(properties);
					};
					AnyValue.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
							writer.uint32( 10).string(message.stringValue);
						if (message.boolValue != null && Object.hasOwnProperty.call(message, "boolValue"))
							writer.uint32( 16).bool(message.boolValue);
						if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue"))
							writer.uint32( 24).int64(message.intValue);
						if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue"))
							writer.uint32( 33).double(message.doubleValue);
						if (message.arrayValue != null && Object.hasOwnProperty.call(message, "arrayValue"))
							$root.opentelemetry.proto.common.v1.ArrayValue.encode(message.arrayValue, writer.uint32( 42).fork()).ldelim();
						if (message.kvlistValue != null && Object.hasOwnProperty.call(message, "kvlistValue"))
							$root.opentelemetry.proto.common.v1.KeyValueList.encode(message.kvlistValue, writer.uint32( 50).fork()).ldelim();
						if (message.bytesValue != null && Object.hasOwnProperty.call(message, "bytesValue"))
							writer.uint32( 58).bytes(message.bytesValue);
						return writer;
					};
					AnyValue.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					AnyValue.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.AnyValue();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.stringValue = reader.string();
								break;
								}
								case 2: {
								message.boolValue = reader.bool();
								break;
								}
								case 3: {
								message.intValue = reader.int64();
								break;
								}
								case 4: {
								message.doubleValue = reader.double();
								break;
								}
								case 5: {
								message.arrayValue = $root.opentelemetry.proto.common.v1.ArrayValue.decode(reader, reader.uint32());
								break;
								}
								case 6: {
								message.kvlistValue = $root.opentelemetry.proto.common.v1.KeyValueList.decode(reader, reader.uint32());
								break;
								}
								case 7: {
								message.bytesValue = reader.bytes();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					AnyValue.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					AnyValue.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						var properties = {};
						if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
							properties.value = 1;
							if (!$util.isString(message.stringValue))
								return "stringValue: string expected";
						}
						if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
							if (properties.value === 1)
								return "value: multiple values";
							properties.value = 1;
							if (typeof message.boolValue !== "boolean")
								return "boolValue: boolean expected";
						}
						if (message.intValue != null && message.hasOwnProperty("intValue")) {
							if (properties.value === 1)
								return "value: multiple values";
							properties.value = 1;
							if (!$util.isInteger(message.intValue) && !(message.intValue && $util.isInteger(message.intValue.low) && $util.isInteger(message.intValue.high)))
								return "intValue: integer|Long expected";
						}
						if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
							if (properties.value === 1)
								return "value: multiple values";
							properties.value = 1;
							if (typeof message.doubleValue !== "number")
								return "doubleValue: number expected";
						}
						if (message.arrayValue != null && message.hasOwnProperty("arrayValue")) {
							if (properties.value === 1)
								return "value: multiple values";
							properties.value = 1;
							{
								var error = $root.opentelemetry.proto.common.v1.ArrayValue.verify(message.arrayValue);
								if (error)
								return "arrayValue." + error;
							}
						}
						if (message.kvlistValue != null && message.hasOwnProperty("kvlistValue")) {
							if (properties.value === 1)
								return "value: multiple values";
							properties.value = 1;
							{
								var error = $root.opentelemetry.proto.common.v1.KeyValueList.verify(message.kvlistValue);
								if (error)
								return "kvlistValue." + error;
							}
						}
						if (message.bytesValue != null && message.hasOwnProperty("bytesValue")) {
							if (properties.value === 1)
								return "value: multiple values";
							properties.value = 1;
							if (!(message.bytesValue && typeof message.bytesValue.length === "number" || $util.isString(message.bytesValue)))
								return "bytesValue: buffer expected";
						}
						return null;
					};
					AnyValue.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.common.v1.AnyValue)
							return object;
						var message = new $root.opentelemetry.proto.common.v1.AnyValue();
						if (object.stringValue != null)
							message.stringValue = String(object.stringValue);
						if (object.boolValue != null)
							message.boolValue = Boolean(object.boolValue);
						if (object.intValue != null)
							if ($util.Long)
								(message.intValue = $util.Long.fromValue(object.intValue)).unsigned = false;
							else if (typeof object.intValue === "string")
								message.intValue = parseInt(object.intValue, 10);
							else if (typeof object.intValue === "number")
								message.intValue = object.intValue;
							else if (typeof object.intValue === "object")
								message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
						if (object.doubleValue != null)
							message.doubleValue = Number(object.doubleValue);
						if (object.arrayValue != null) {
							if (typeof object.arrayValue !== "object")
								throw TypeError(".opentelemetry.proto.common.v1.AnyValue.arrayValue: object expected");
							message.arrayValue = $root.opentelemetry.proto.common.v1.ArrayValue.fromObject(object.arrayValue);
						}
						if (object.kvlistValue != null) {
							if (typeof object.kvlistValue !== "object")
								throw TypeError(".opentelemetry.proto.common.v1.AnyValue.kvlistValue: object expected");
							message.kvlistValue = $root.opentelemetry.proto.common.v1.KeyValueList.fromObject(object.kvlistValue);
						}
						if (object.bytesValue != null)
							if (typeof object.bytesValue === "string")
								$util.base64.decode(object.bytesValue, message.bytesValue = $util.newBuffer($util.base64.length(object.bytesValue)), 0);
							else if (object.bytesValue.length >= 0)
								message.bytesValue = object.bytesValue;
						return message;
					};
					AnyValue.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
							object.stringValue = message.stringValue;
							if (options.oneofs)
								object.value = "stringValue";
						}
						if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
							object.boolValue = message.boolValue;
							if (options.oneofs)
								object.value = "boolValue";
						}
						if (message.intValue != null && message.hasOwnProperty("intValue")) {
							if (typeof message.intValue === "number")
								object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
							else
								object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
							if (options.oneofs)
								object.value = "intValue";
						}
						if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
							object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
							if (options.oneofs)
								object.value = "doubleValue";
						}
						if (message.arrayValue != null && message.hasOwnProperty("arrayValue")) {
							object.arrayValue = $root.opentelemetry.proto.common.v1.ArrayValue.toObject(message.arrayValue, options);
							if (options.oneofs)
								object.value = "arrayValue";
						}
						if (message.kvlistValue != null && message.hasOwnProperty("kvlistValue")) {
							object.kvlistValue = $root.opentelemetry.proto.common.v1.KeyValueList.toObject(message.kvlistValue, options);
							if (options.oneofs)
								object.value = "kvlistValue";
						}
						if (message.bytesValue != null && message.hasOwnProperty("bytesValue")) {
							object.bytesValue = options.bytes === String ? $util.base64.encode(message.bytesValue, 0, message.bytesValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.bytesValue) : message.bytesValue;
							if (options.oneofs)
								object.value = "bytesValue";
						}
						return object;
					};
					AnyValue.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					AnyValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.common.v1.AnyValue";
					};
					return AnyValue;
				})();
				v1.ArrayValue = (function () {
					function ArrayValue(properties) {
						this.values = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ArrayValue.prototype.values = $util.emptyArray;
					ArrayValue.create = function create(properties) {
						return new ArrayValue(properties);
					};
					ArrayValue.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.values != null && message.values.length)
							for (var i = 0; i < message.values.length; ++i)
								$root.opentelemetry.proto.common.v1.AnyValue.encode(message.values[i], writer.uint32( 10).fork()).ldelim();
						return writer;
					};
					ArrayValue.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ArrayValue.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.ArrayValue();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.values && message.values.length))
								message.values = [];
								message.values.push($root.opentelemetry.proto.common.v1.AnyValue.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ArrayValue.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ArrayValue.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.values != null && message.hasOwnProperty("values")) {
							if (!Array.isArray(message.values))
								return "values: array expected";
							for (var i = 0; i < message.values.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.AnyValue.verify(message.values[i]);
								if (error)
								return "values." + error;
							}
						}
						return null;
					};
					ArrayValue.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.common.v1.ArrayValue)
							return object;
						var message = new $root.opentelemetry.proto.common.v1.ArrayValue();
						if (object.values) {
							if (!Array.isArray(object.values))
								throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: array expected");
							message.values = [];
							for (var i = 0; i < object.values.length; ++i) {
								if (typeof object.values[i] !== "object")
								throw TypeError(".opentelemetry.proto.common.v1.ArrayValue.values: object expected");
								message.values[i] = $root.opentelemetry.proto.common.v1.AnyValue.fromObject(object.values[i]);
							}
						}
						return message;
					};
					ArrayValue.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.values = [];
						if (message.values && message.values.length) {
							object.values = [];
							for (var j = 0; j < message.values.length; ++j)
								object.values[j] = $root.opentelemetry.proto.common.v1.AnyValue.toObject(message.values[j], options);
						}
						return object;
					};
					ArrayValue.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ArrayValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.common.v1.ArrayValue";
					};
					return ArrayValue;
				})();
				v1.KeyValueList = (function () {
					function KeyValueList(properties) {
						this.values = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					KeyValueList.prototype.values = $util.emptyArray;
					KeyValueList.create = function create(properties) {
						return new KeyValueList(properties);
					};
					KeyValueList.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.values != null && message.values.length)
							for (var i = 0; i < message.values.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.values[i], writer.uint32( 10).fork()).ldelim();
						return writer;
					};
					KeyValueList.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					KeyValueList.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.KeyValueList();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.values && message.values.length))
								message.values = [];
								message.values.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					KeyValueList.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					KeyValueList.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.values != null && message.hasOwnProperty("values")) {
							if (!Array.isArray(message.values))
								return "values: array expected";
							for (var i = 0; i < message.values.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.values[i]);
								if (error)
								return "values." + error;
							}
						}
						return null;
					};
					KeyValueList.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.common.v1.KeyValueList)
							return object;
						var message = new $root.opentelemetry.proto.common.v1.KeyValueList();
						if (object.values) {
							if (!Array.isArray(object.values))
								throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: array expected");
							message.values = [];
							for (var i = 0; i < object.values.length; ++i) {
								if (typeof object.values[i] !== "object")
								throw TypeError(".opentelemetry.proto.common.v1.KeyValueList.values: object expected");
								message.values[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.values[i]);
							}
						}
						return message;
					};
					KeyValueList.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.values = [];
						if (message.values && message.values.length) {
							object.values = [];
							for (var j = 0; j < message.values.length; ++j)
								object.values[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.values[j], options);
						}
						return object;
					};
					KeyValueList.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					KeyValueList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.common.v1.KeyValueList";
					};
					return KeyValueList;
				})();
				v1.KeyValue = (function () {
					function KeyValue(properties) {
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					KeyValue.prototype.key = null;
					KeyValue.prototype.value = null;
					KeyValue.create = function create(properties) {
						return new KeyValue(properties);
					};
					KeyValue.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.key != null && Object.hasOwnProperty.call(message, "key"))
							writer.uint32( 10).string(message.key);
						if (message.value != null && Object.hasOwnProperty.call(message, "value"))
							$root.opentelemetry.proto.common.v1.AnyValue.encode(message.value, writer.uint32( 18).fork()).ldelim();
						return writer;
					};
					KeyValue.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					KeyValue.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.KeyValue();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.key = reader.string();
								break;
								}
								case 2: {
								message.value = $root.opentelemetry.proto.common.v1.AnyValue.decode(reader, reader.uint32());
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					KeyValue.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					KeyValue.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.key != null && message.hasOwnProperty("key"))
							if (!$util.isString(message.key))
								return "key: string expected";
						if (message.value != null && message.hasOwnProperty("value")) {
							var error = $root.opentelemetry.proto.common.v1.AnyValue.verify(message.value);
							if (error)
								return "value." + error;
						}
						return null;
					};
					KeyValue.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.common.v1.KeyValue)
							return object;
						var message = new $root.opentelemetry.proto.common.v1.KeyValue();
						if (object.key != null)
							message.key = String(object.key);
						if (object.value != null) {
							if (typeof object.value !== "object")
								throw TypeError(".opentelemetry.proto.common.v1.KeyValue.value: object expected");
							message.value = $root.opentelemetry.proto.common.v1.AnyValue.fromObject(object.value);
						}
						return message;
					};
					KeyValue.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.defaults) {
							object.key = "";
							object.value = null;
						}
						if (message.key != null && message.hasOwnProperty("key"))
							object.key = message.key;
						if (message.value != null && message.hasOwnProperty("value"))
							object.value = $root.opentelemetry.proto.common.v1.AnyValue.toObject(message.value, options);
						return object;
					};
					KeyValue.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					KeyValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.common.v1.KeyValue";
					};
					return KeyValue;
				})();
				v1.InstrumentationScope = (function () {
					function InstrumentationScope(properties) {
						this.attributes = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					InstrumentationScope.prototype.name = null;
					InstrumentationScope.prototype.version = null;
					InstrumentationScope.prototype.attributes = $util.emptyArray;
					InstrumentationScope.prototype.droppedAttributesCount = null;
					InstrumentationScope.create = function create(properties) {
						return new InstrumentationScope(properties);
					};
					InstrumentationScope.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.name != null && Object.hasOwnProperty.call(message, "name"))
							writer.uint32( 10).string(message.name);
						if (message.version != null && Object.hasOwnProperty.call(message, "version"))
							writer.uint32( 18).string(message.version);
						if (message.attributes != null && message.attributes.length)
							for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 26).fork()).ldelim();
						if (message.droppedAttributesCount != null && Object.hasOwnProperty.call(message, "droppedAttributesCount"))
							writer.uint32( 32).uint32(message.droppedAttributesCount);
						return writer;
					};
					InstrumentationScope.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					InstrumentationScope.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.common.v1.InstrumentationScope();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.name = reader.string();
								break;
								}
								case 2: {
								message.version = reader.string();
								break;
								}
								case 3: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 4: {
								message.droppedAttributesCount = reader.uint32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					InstrumentationScope.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					InstrumentationScope.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.name != null && message.hasOwnProperty("name"))
							if (!$util.isString(message.name))
								return "name: string expected";
						if (message.version != null && message.hasOwnProperty("version"))
							if (!$util.isString(message.version))
								return "version: string expected";
						if (message.attributes != null && message.hasOwnProperty("attributes")) {
							if (!Array.isArray(message.attributes))
								return "attributes: array expected";
							for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
							}
						}
						if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
							if (!$util.isInteger(message.droppedAttributesCount))
								return "droppedAttributesCount: integer expected";
						return null;
					};
					InstrumentationScope.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.common.v1.InstrumentationScope)
							return object;
						var message = new $root.opentelemetry.proto.common.v1.InstrumentationScope();
						if (object.name != null)
							message.name = String(object.name);
						if (object.version != null)
							message.version = String(object.version);
						if (object.attributes) {
							if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: array expected");
							message.attributes = [];
							for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.common.v1.InstrumentationScope.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
							}
						}
						if (object.droppedAttributesCount != null)
							message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
						return message;
					};
					InstrumentationScope.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.attributes = [];
						if (options.defaults) {
							object.name = "";
							object.version = "";
							object.droppedAttributesCount = 0;
						}
						if (message.name != null && message.hasOwnProperty("name"))
							object.name = message.name;
						if (message.version != null && message.hasOwnProperty("version"))
							object.version = message.version;
						if (message.attributes && message.attributes.length) {
							object.attributes = [];
							for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
						}
						if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
							object.droppedAttributesCount = message.droppedAttributesCount;
						return object;
					};
					InstrumentationScope.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					InstrumentationScope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.common.v1.InstrumentationScope";
					};
					return InstrumentationScope;
				})();
				return v1;
			})();
			return common;
		})();
		proto.resource = (function () {
			var resource = {};
			resource.v1 = (function () {
				var v1 = {};
				v1.Resource = (function () {
					function Resource(properties) {
						this.attributes = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Resource.prototype.attributes = $util.emptyArray;
					Resource.prototype.droppedAttributesCount = null;
					Resource.create = function create(properties) {
						return new Resource(properties);
					};
					Resource.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.attributes != null && message.attributes.length)
							for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 10).fork()).ldelim();
						if (message.droppedAttributesCount != null && Object.hasOwnProperty.call(message, "droppedAttributesCount"))
							writer.uint32( 16).uint32(message.droppedAttributesCount);
						return writer;
					};
					Resource.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Resource.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.resource.v1.Resource();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.droppedAttributesCount = reader.uint32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Resource.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Resource.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.attributes != null && message.hasOwnProperty("attributes")) {
							if (!Array.isArray(message.attributes))
								return "attributes: array expected";
							for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
							}
						}
						if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
							if (!$util.isInteger(message.droppedAttributesCount))
								return "droppedAttributesCount: integer expected";
						return null;
					};
					Resource.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.resource.v1.Resource)
							return object;
						var message = new $root.opentelemetry.proto.resource.v1.Resource();
						if (object.attributes) {
							if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: array expected");
							message.attributes = [];
							for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.resource.v1.Resource.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
							}
						}
						if (object.droppedAttributesCount != null)
							message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
						return message;
					};
					Resource.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.attributes = [];
						if (options.defaults)
							object.droppedAttributesCount = 0;
						if (message.attributes && message.attributes.length) {
							object.attributes = [];
							for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
						}
						if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
							object.droppedAttributesCount = message.droppedAttributesCount;
						return object;
					};
					Resource.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Resource.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.resource.v1.Resource";
					};
					return Resource;
				})();
				return v1;
			})();
			return resource;
		})();
		proto.trace = (function () {
			var trace = {};
			trace.v1 = (function () {
				var v1 = {};
				v1.TracesData = (function () {
					function TracesData(properties) {
						this.resourceSpans = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					TracesData.prototype.resourceSpans = $util.emptyArray;
					TracesData.create = function create(properties) {
						return new TracesData(properties);
					};
					TracesData.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.resourceSpans != null && message.resourceSpans.length)
							for (var i = 0; i < message.resourceSpans.length; ++i)
								$root.opentelemetry.proto.trace.v1.ResourceSpans.encode(message.resourceSpans[i], writer.uint32( 10).fork()).ldelim();
						return writer;
					};
					TracesData.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					TracesData.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.TracesData();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.resourceSpans && message.resourceSpans.length))
								message.resourceSpans = [];
								message.resourceSpans.push($root.opentelemetry.proto.trace.v1.ResourceSpans.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					TracesData.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					TracesData.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.resourceSpans != null && message.hasOwnProperty("resourceSpans")) {
							if (!Array.isArray(message.resourceSpans))
								return "resourceSpans: array expected";
							for (var i = 0; i < message.resourceSpans.length; ++i) {
								var error = $root.opentelemetry.proto.trace.v1.ResourceSpans.verify(message.resourceSpans[i]);
								if (error)
								return "resourceSpans." + error;
							}
						}
						return null;
					};
					TracesData.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.trace.v1.TracesData)
							return object;
						var message = new $root.opentelemetry.proto.trace.v1.TracesData();
						if (object.resourceSpans) {
							if (!Array.isArray(object.resourceSpans))
								throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: array expected");
							message.resourceSpans = [];
							for (var i = 0; i < object.resourceSpans.length; ++i) {
								if (typeof object.resourceSpans[i] !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.TracesData.resourceSpans: object expected");
								message.resourceSpans[i] = $root.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(object.resourceSpans[i]);
							}
						}
						return message;
					};
					TracesData.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.resourceSpans = [];
						if (message.resourceSpans && message.resourceSpans.length) {
							object.resourceSpans = [];
							for (var j = 0; j < message.resourceSpans.length; ++j)
								object.resourceSpans[j] = $root.opentelemetry.proto.trace.v1.ResourceSpans.toObject(message.resourceSpans[j], options);
						}
						return object;
					};
					TracesData.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					TracesData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.trace.v1.TracesData";
					};
					return TracesData;
				})();
				v1.ResourceSpans = (function () {
					function ResourceSpans(properties) {
						this.scopeSpans = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ResourceSpans.prototype.resource = null;
					ResourceSpans.prototype.scopeSpans = $util.emptyArray;
					ResourceSpans.prototype.schemaUrl = null;
					ResourceSpans.create = function create(properties) {
						return new ResourceSpans(properties);
					};
					ResourceSpans.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.resource != null && Object.hasOwnProperty.call(message, "resource"))
							$root.opentelemetry.proto.resource.v1.Resource.encode(message.resource, writer.uint32( 10).fork()).ldelim();
						if (message.scopeSpans != null && message.scopeSpans.length)
							for (var i = 0; i < message.scopeSpans.length; ++i)
								$root.opentelemetry.proto.trace.v1.ScopeSpans.encode(message.scopeSpans[i], writer.uint32( 18).fork()).ldelim();
						if (message.schemaUrl != null && Object.hasOwnProperty.call(message, "schemaUrl"))
							writer.uint32( 26).string(message.schemaUrl);
						return writer;
					};
					ResourceSpans.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ResourceSpans.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.ResourceSpans();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.resource = $root.opentelemetry.proto.resource.v1.Resource.decode(reader, reader.uint32());
								break;
								}
								case 2: {
								if (!(message.scopeSpans && message.scopeSpans.length))
								message.scopeSpans = [];
								message.scopeSpans.push($root.opentelemetry.proto.trace.v1.ScopeSpans.decode(reader, reader.uint32()));
								break;
								}
								case 3: {
								message.schemaUrl = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ResourceSpans.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ResourceSpans.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.resource != null && message.hasOwnProperty("resource")) {
							var error = $root.opentelemetry.proto.resource.v1.Resource.verify(message.resource);
							if (error)
								return "resource." + error;
						}
						if (message.scopeSpans != null && message.hasOwnProperty("scopeSpans")) {
							if (!Array.isArray(message.scopeSpans))
								return "scopeSpans: array expected";
							for (var i = 0; i < message.scopeSpans.length; ++i) {
								var error = $root.opentelemetry.proto.trace.v1.ScopeSpans.verify(message.scopeSpans[i]);
								if (error)
								return "scopeSpans." + error;
							}
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							if (!$util.isString(message.schemaUrl))
								return "schemaUrl: string expected";
						return null;
					};
					ResourceSpans.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.trace.v1.ResourceSpans)
							return object;
						var message = new $root.opentelemetry.proto.trace.v1.ResourceSpans();
						if (object.resource != null) {
							if (typeof object.resource !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.resource: object expected");
							message.resource = $root.opentelemetry.proto.resource.v1.Resource.fromObject(object.resource);
						}
						if (object.scopeSpans) {
							if (!Array.isArray(object.scopeSpans))
								throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: array expected");
							message.scopeSpans = [];
							for (var i = 0; i < object.scopeSpans.length; ++i) {
								if (typeof object.scopeSpans[i] !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.ResourceSpans.scopeSpans: object expected");
								message.scopeSpans[i] = $root.opentelemetry.proto.trace.v1.ScopeSpans.fromObject(object.scopeSpans[i]);
							}
						}
						if (object.schemaUrl != null)
							message.schemaUrl = String(object.schemaUrl);
						return message;
					};
					ResourceSpans.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.scopeSpans = [];
						if (options.defaults) {
							object.resource = null;
							object.schemaUrl = "";
						}
						if (message.resource != null && message.hasOwnProperty("resource"))
							object.resource = $root.opentelemetry.proto.resource.v1.Resource.toObject(message.resource, options);
						if (message.scopeSpans && message.scopeSpans.length) {
							object.scopeSpans = [];
							for (var j = 0; j < message.scopeSpans.length; ++j)
								object.scopeSpans[j] = $root.opentelemetry.proto.trace.v1.ScopeSpans.toObject(message.scopeSpans[j], options);
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							object.schemaUrl = message.schemaUrl;
						return object;
					};
					ResourceSpans.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ResourceSpans.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.trace.v1.ResourceSpans";
					};
					return ResourceSpans;
				})();
				v1.ScopeSpans = (function () {
					function ScopeSpans(properties) {
						this.spans = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ScopeSpans.prototype.scope = null;
					ScopeSpans.prototype.spans = $util.emptyArray;
					ScopeSpans.prototype.schemaUrl = null;
					ScopeSpans.create = function create(properties) {
						return new ScopeSpans(properties);
					};
					ScopeSpans.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.scope != null && Object.hasOwnProperty.call(message, "scope"))
							$root.opentelemetry.proto.common.v1.InstrumentationScope.encode(message.scope, writer.uint32( 10).fork()).ldelim();
						if (message.spans != null && message.spans.length)
							for (var i = 0; i < message.spans.length; ++i)
								$root.opentelemetry.proto.trace.v1.Span.encode(message.spans[i], writer.uint32( 18).fork()).ldelim();
						if (message.schemaUrl != null && Object.hasOwnProperty.call(message, "schemaUrl"))
							writer.uint32( 26).string(message.schemaUrl);
						return writer;
					};
					ScopeSpans.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ScopeSpans.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.ScopeSpans();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.decode(reader, reader.uint32());
								break;
								}
								case 2: {
								if (!(message.spans && message.spans.length))
								message.spans = [];
								message.spans.push($root.opentelemetry.proto.trace.v1.Span.decode(reader, reader.uint32()));
								break;
								}
								case 3: {
								message.schemaUrl = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ScopeSpans.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ScopeSpans.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.scope != null && message.hasOwnProperty("scope")) {
							var error = $root.opentelemetry.proto.common.v1.InstrumentationScope.verify(message.scope);
							if (error)
								return "scope." + error;
						}
						if (message.spans != null && message.hasOwnProperty("spans")) {
							if (!Array.isArray(message.spans))
								return "spans: array expected";
							for (var i = 0; i < message.spans.length; ++i) {
								var error = $root.opentelemetry.proto.trace.v1.Span.verify(message.spans[i]);
								if (error)
								return "spans." + error;
							}
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							if (!$util.isString(message.schemaUrl))
								return "schemaUrl: string expected";
						return null;
					};
					ScopeSpans.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.trace.v1.ScopeSpans)
							return object;
						var message = new $root.opentelemetry.proto.trace.v1.ScopeSpans();
						if (object.scope != null) {
							if (typeof object.scope !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.scope: object expected");
							message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(object.scope);
						}
						if (object.spans) {
							if (!Array.isArray(object.spans))
								throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: array expected");
							message.spans = [];
							for (var i = 0; i < object.spans.length; ++i) {
								if (typeof object.spans[i] !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.ScopeSpans.spans: object expected");
								message.spans[i] = $root.opentelemetry.proto.trace.v1.Span.fromObject(object.spans[i]);
							}
						}
						if (object.schemaUrl != null)
							message.schemaUrl = String(object.schemaUrl);
						return message;
					};
					ScopeSpans.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.spans = [];
						if (options.defaults) {
							object.scope = null;
							object.schemaUrl = "";
						}
						if (message.scope != null && message.hasOwnProperty("scope"))
							object.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.toObject(message.scope, options);
						if (message.spans && message.spans.length) {
							object.spans = [];
							for (var j = 0; j < message.spans.length; ++j)
								object.spans[j] = $root.opentelemetry.proto.trace.v1.Span.toObject(message.spans[j], options);
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							object.schemaUrl = message.schemaUrl;
						return object;
					};
					ScopeSpans.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ScopeSpans.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.trace.v1.ScopeSpans";
					};
					return ScopeSpans;
				})();
				v1.Span = (function () {
					function Span(properties) {
						this.attributes = [];
						this.events = [];
						this.links = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Span.prototype.traceId = null;
					Span.prototype.spanId = null;
					Span.prototype.traceState = null;
					Span.prototype.parentSpanId = null;
					Span.prototype.name = null;
					Span.prototype.kind = null;
					Span.prototype.startTimeUnixNano = null;
					Span.prototype.endTimeUnixNano = null;
					Span.prototype.attributes = $util.emptyArray;
					Span.prototype.droppedAttributesCount = null;
					Span.prototype.events = $util.emptyArray;
					Span.prototype.droppedEventsCount = null;
					Span.prototype.links = $util.emptyArray;
					Span.prototype.droppedLinksCount = null;
					Span.prototype.status = null;
					Span.create = function create(properties) {
						return new Span(properties);
					};
					Span.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.traceId != null && Object.hasOwnProperty.call(message, "traceId"))
							writer.uint32( 10).bytes(message.traceId);
						if (message.spanId != null && Object.hasOwnProperty.call(message, "spanId"))
							writer.uint32( 18).bytes(message.spanId);
						if (message.traceState != null && Object.hasOwnProperty.call(message, "traceState"))
							writer.uint32( 26).string(message.traceState);
						if (message.parentSpanId != null && Object.hasOwnProperty.call(message, "parentSpanId"))
							writer.uint32( 34).bytes(message.parentSpanId);
						if (message.name != null && Object.hasOwnProperty.call(message, "name"))
							writer.uint32( 42).string(message.name);
						if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
							writer.uint32( 48).int32(message.kind);
						if (message.startTimeUnixNano != null && Object.hasOwnProperty.call(message, "startTimeUnixNano"))
							writer.uint32( 57).fixed64(message.startTimeUnixNano);
						if (message.endTimeUnixNano != null && Object.hasOwnProperty.call(message, "endTimeUnixNano"))
							writer.uint32( 65).fixed64(message.endTimeUnixNano);
						if (message.attributes != null && message.attributes.length)
							for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 74).fork()).ldelim();
						if (message.droppedAttributesCount != null && Object.hasOwnProperty.call(message, "droppedAttributesCount"))
							writer.uint32( 80).uint32(message.droppedAttributesCount);
						if (message.events != null && message.events.length)
							for (var i = 0; i < message.events.length; ++i)
								$root.opentelemetry.proto.trace.v1.Span.Event.encode(message.events[i], writer.uint32( 90).fork()).ldelim();
						if (message.droppedEventsCount != null && Object.hasOwnProperty.call(message, "droppedEventsCount"))
							writer.uint32( 96).uint32(message.droppedEventsCount);
						if (message.links != null && message.links.length)
							for (var i = 0; i < message.links.length; ++i)
								$root.opentelemetry.proto.trace.v1.Span.Link.encode(message.links[i], writer.uint32( 106).fork()).ldelim();
						if (message.droppedLinksCount != null && Object.hasOwnProperty.call(message, "droppedLinksCount"))
							writer.uint32( 112).uint32(message.droppedLinksCount);
						if (message.status != null && Object.hasOwnProperty.call(message, "status"))
							$root.opentelemetry.proto.trace.v1.Status.encode(message.status, writer.uint32( 122).fork()).ldelim();
						return writer;
					};
					Span.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Span.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.Span();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.traceId = reader.bytes();
								break;
								}
								case 2: {
								message.spanId = reader.bytes();
								break;
								}
								case 3: {
								message.traceState = reader.string();
								break;
								}
								case 4: {
								message.parentSpanId = reader.bytes();
								break;
								}
								case 5: {
								message.name = reader.string();
								break;
								}
								case 6: {
								message.kind = reader.int32();
								break;
								}
								case 7: {
								message.startTimeUnixNano = reader.fixed64();
								break;
								}
								case 8: {
								message.endTimeUnixNano = reader.fixed64();
								break;
								}
								case 9: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 10: {
								message.droppedAttributesCount = reader.uint32();
								break;
								}
								case 11: {
								if (!(message.events && message.events.length))
								message.events = [];
								message.events.push($root.opentelemetry.proto.trace.v1.Span.Event.decode(reader, reader.uint32()));
								break;
								}
								case 12: {
								message.droppedEventsCount = reader.uint32();
								break;
								}
								case 13: {
								if (!(message.links && message.links.length))
								message.links = [];
								message.links.push($root.opentelemetry.proto.trace.v1.Span.Link.decode(reader, reader.uint32()));
								break;
								}
								case 14: {
								message.droppedLinksCount = reader.uint32();
								break;
								}
								case 15: {
								message.status = $root.opentelemetry.proto.trace.v1.Status.decode(reader, reader.uint32());
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Span.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Span.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.traceId != null && message.hasOwnProperty("traceId"))
							if (!(message.traceId && typeof message.traceId.length === "number" || $util.isString(message.traceId)))
								return "traceId: buffer expected";
						if (message.spanId != null && message.hasOwnProperty("spanId"))
							if (!(message.spanId && typeof message.spanId.length === "number" || $util.isString(message.spanId)))
								return "spanId: buffer expected";
						if (message.traceState != null && message.hasOwnProperty("traceState"))
							if (!$util.isString(message.traceState))
								return "traceState: string expected";
						if (message.parentSpanId != null && message.hasOwnProperty("parentSpanId"))
							if (!(message.parentSpanId && typeof message.parentSpanId.length === "number" || $util.isString(message.parentSpanId)))
								return "parentSpanId: buffer expected";
						if (message.name != null && message.hasOwnProperty("name"))
							if (!$util.isString(message.name))
								return "name: string expected";
						if (message.kind != null && message.hasOwnProperty("kind"))
							switch (message.kind) {
								default:
								return "kind: enum value expected";
								case 0:
								case 1:
								case 2:
								case 3:
								case 4:
								case 5:
								break;
							}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (!$util.isInteger(message.startTimeUnixNano) && !(message.startTimeUnixNano && $util.isInteger(message.startTimeUnixNano.low) && $util.isInteger(message.startTimeUnixNano.high)))
								return "startTimeUnixNano: integer|Long expected";
						if (message.endTimeUnixNano != null && message.hasOwnProperty("endTimeUnixNano"))
							if (!$util.isInteger(message.endTimeUnixNano) && !(message.endTimeUnixNano && $util.isInteger(message.endTimeUnixNano.low) && $util.isInteger(message.endTimeUnixNano.high)))
								return "endTimeUnixNano: integer|Long expected";
						if (message.attributes != null && message.hasOwnProperty("attributes")) {
							if (!Array.isArray(message.attributes))
								return "attributes: array expected";
							for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
							}
						}
						if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
							if (!$util.isInteger(message.droppedAttributesCount))
								return "droppedAttributesCount: integer expected";
						if (message.events != null && message.hasOwnProperty("events")) {
							if (!Array.isArray(message.events))
								return "events: array expected";
							for (var i = 0; i < message.events.length; ++i) {
								var error = $root.opentelemetry.proto.trace.v1.Span.Event.verify(message.events[i]);
								if (error)
								return "events." + error;
							}
						}
						if (message.droppedEventsCount != null && message.hasOwnProperty("droppedEventsCount"))
							if (!$util.isInteger(message.droppedEventsCount))
								return "droppedEventsCount: integer expected";
						if (message.links != null && message.hasOwnProperty("links")) {
							if (!Array.isArray(message.links))
								return "links: array expected";
							for (var i = 0; i < message.links.length; ++i) {
								var error = $root.opentelemetry.proto.trace.v1.Span.Link.verify(message.links[i]);
								if (error)
								return "links." + error;
							}
						}
						if (message.droppedLinksCount != null && message.hasOwnProperty("droppedLinksCount"))
							if (!$util.isInteger(message.droppedLinksCount))
								return "droppedLinksCount: integer expected";
						if (message.status != null && message.hasOwnProperty("status")) {
							var error = $root.opentelemetry.proto.trace.v1.Status.verify(message.status);
							if (error)
								return "status." + error;
						}
						return null;
					};
					Span.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.trace.v1.Span)
							return object;
						var message = new $root.opentelemetry.proto.trace.v1.Span();
						if (object.traceId != null)
							if (typeof object.traceId === "string")
								$util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
							else if (object.traceId.length >= 0)
								message.traceId = object.traceId;
						if (object.spanId != null)
							if (typeof object.spanId === "string")
								$util.base64.decode(object.spanId, message.spanId = $util.newBuffer($util.base64.length(object.spanId)), 0);
							else if (object.spanId.length >= 0)
								message.spanId = object.spanId;
						if (object.traceState != null)
							message.traceState = String(object.traceState);
						if (object.parentSpanId != null)
							if (typeof object.parentSpanId === "string")
								$util.base64.decode(object.parentSpanId, message.parentSpanId = $util.newBuffer($util.base64.length(object.parentSpanId)), 0);
							else if (object.parentSpanId.length >= 0)
								message.parentSpanId = object.parentSpanId;
						if (object.name != null)
							message.name = String(object.name);
						switch (object.kind) {
							default:
								if (typeof object.kind === "number") {
								message.kind = object.kind;
								break;
								}
								break;
							case "SPAN_KIND_UNSPECIFIED":
							case 0:
								message.kind = 0;
								break;
							case "SPAN_KIND_INTERNAL":
							case 1:
								message.kind = 1;
								break;
							case "SPAN_KIND_SERVER":
							case 2:
								message.kind = 2;
								break;
							case "SPAN_KIND_CLIENT":
							case 3:
								message.kind = 3;
								break;
							case "SPAN_KIND_PRODUCER":
							case 4:
								message.kind = 4;
								break;
							case "SPAN_KIND_CONSUMER":
							case 5:
								message.kind = 5;
								break;
						}
						if (object.startTimeUnixNano != null)
							if ($util.Long)
								(message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
							else if (typeof object.startTimeUnixNano === "string")
								message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
							else if (typeof object.startTimeUnixNano === "number")
								message.startTimeUnixNano = object.startTimeUnixNano;
							else if (typeof object.startTimeUnixNano === "object")
								message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
						if (object.endTimeUnixNano != null)
							if ($util.Long)
								(message.endTimeUnixNano = $util.Long.fromValue(object.endTimeUnixNano)).unsigned = false;
							else if (typeof object.endTimeUnixNano === "string")
								message.endTimeUnixNano = parseInt(object.endTimeUnixNano, 10);
							else if (typeof object.endTimeUnixNano === "number")
								message.endTimeUnixNano = object.endTimeUnixNano;
							else if (typeof object.endTimeUnixNano === "object")
								message.endTimeUnixNano = new $util.LongBits(object.endTimeUnixNano.low >>> 0, object.endTimeUnixNano.high >>> 0).toNumber();
						if (object.attributes) {
							if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: array expected");
							message.attributes = [];
							for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.Span.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
							}
						}
						if (object.droppedAttributesCount != null)
							message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
						if (object.events) {
							if (!Array.isArray(object.events))
								throw TypeError(".opentelemetry.proto.trace.v1.Span.events: array expected");
							message.events = [];
							for (var i = 0; i < object.events.length; ++i) {
								if (typeof object.events[i] !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.Span.events: object expected");
								message.events[i] = $root.opentelemetry.proto.trace.v1.Span.Event.fromObject(object.events[i]);
							}
						}
						if (object.droppedEventsCount != null)
							message.droppedEventsCount = object.droppedEventsCount >>> 0;
						if (object.links) {
							if (!Array.isArray(object.links))
								throw TypeError(".opentelemetry.proto.trace.v1.Span.links: array expected");
							message.links = [];
							for (var i = 0; i < object.links.length; ++i) {
								if (typeof object.links[i] !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.Span.links: object expected");
								message.links[i] = $root.opentelemetry.proto.trace.v1.Span.Link.fromObject(object.links[i]);
							}
						}
						if (object.droppedLinksCount != null)
							message.droppedLinksCount = object.droppedLinksCount >>> 0;
						if (object.status != null) {
							if (typeof object.status !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.Span.status: object expected");
							message.status = $root.opentelemetry.proto.trace.v1.Status.fromObject(object.status);
						}
						return message;
					};
					Span.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults) {
							object.attributes = [];
							object.events = [];
							object.links = [];
						}
						if (options.defaults) {
							if (options.bytes === String)
								object.traceId = "";
							else {
								object.traceId = [];
								if (options.bytes !== Array)
								object.traceId = $util.newBuffer(object.traceId);
							}
							if (options.bytes === String)
								object.spanId = "";
							else {
								object.spanId = [];
								if (options.bytes !== Array)
								object.spanId = $util.newBuffer(object.spanId);
							}
							object.traceState = "";
							if (options.bytes === String)
								object.parentSpanId = "";
							else {
								object.parentSpanId = [];
								if (options.bytes !== Array)
								object.parentSpanId = $util.newBuffer(object.parentSpanId);
							}
							object.name = "";
							object.kind = options.enums === String ? "SPAN_KIND_UNSPECIFIED" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.startTimeUnixNano = options.longs === String ? "0" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.endTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.endTimeUnixNano = options.longs === String ? "0" : 0;
							object.droppedAttributesCount = 0;
							object.droppedEventsCount = 0;
							object.droppedLinksCount = 0;
							object.status = null;
						}
						if (message.traceId != null && message.hasOwnProperty("traceId"))
							object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
						if (message.spanId != null && message.hasOwnProperty("spanId"))
							object.spanId = options.bytes === String ? $util.base64.encode(message.spanId, 0, message.spanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.spanId) : message.spanId;
						if (message.traceState != null && message.hasOwnProperty("traceState"))
							object.traceState = message.traceState;
						if (message.parentSpanId != null && message.hasOwnProperty("parentSpanId"))
							object.parentSpanId = options.bytes === String ? $util.base64.encode(message.parentSpanId, 0, message.parentSpanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.parentSpanId) : message.parentSpanId;
						if (message.name != null && message.hasOwnProperty("name"))
							object.name = message.name;
						if (message.kind != null && message.hasOwnProperty("kind"))
							object.kind = options.enums === String ? $root.opentelemetry.proto.trace.v1.Span.SpanKind[message.kind] === undefined ? message.kind : $root.opentelemetry.proto.trace.v1.Span.SpanKind[message.kind] : message.kind;
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (typeof message.startTimeUnixNano === "number")
								object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
							else
								object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
						if (message.endTimeUnixNano != null && message.hasOwnProperty("endTimeUnixNano"))
							if (typeof message.endTimeUnixNano === "number")
								object.endTimeUnixNano = options.longs === String ? String(message.endTimeUnixNano) : message.endTimeUnixNano;
							else
								object.endTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.endTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.endTimeUnixNano.low >>> 0, message.endTimeUnixNano.high >>> 0).toNumber() : message.endTimeUnixNano;
						if (message.attributes && message.attributes.length) {
							object.attributes = [];
							for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
						}
						if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
							object.droppedAttributesCount = message.droppedAttributesCount;
						if (message.events && message.events.length) {
							object.events = [];
							for (var j = 0; j < message.events.length; ++j)
								object.events[j] = $root.opentelemetry.proto.trace.v1.Span.Event.toObject(message.events[j], options);
						}
						if (message.droppedEventsCount != null && message.hasOwnProperty("droppedEventsCount"))
							object.droppedEventsCount = message.droppedEventsCount;
						if (message.links && message.links.length) {
							object.links = [];
							for (var j = 0; j < message.links.length; ++j)
								object.links[j] = $root.opentelemetry.proto.trace.v1.Span.Link.toObject(message.links[j], options);
						}
						if (message.droppedLinksCount != null && message.hasOwnProperty("droppedLinksCount"))
							object.droppedLinksCount = message.droppedLinksCount;
						if (message.status != null && message.hasOwnProperty("status"))
							object.status = $root.opentelemetry.proto.trace.v1.Status.toObject(message.status, options);
						return object;
					};
					Span.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Span.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.trace.v1.Span";
					};
					Span.SpanKind = (function () {
						var valuesById = {}, values = Object.create(valuesById);
						values[valuesById[0] = "SPAN_KIND_UNSPECIFIED"] = 0;
						values[valuesById[1] = "SPAN_KIND_INTERNAL"] = 1;
						values[valuesById[2] = "SPAN_KIND_SERVER"] = 2;
						values[valuesById[3] = "SPAN_KIND_CLIENT"] = 3;
						values[valuesById[4] = "SPAN_KIND_PRODUCER"] = 4;
						values[valuesById[5] = "SPAN_KIND_CONSUMER"] = 5;
						return values;
					})();
					Span.Event = (function () {
						function Event(properties) {
							this.attributes = [];
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						Event.prototype.timeUnixNano = null;
						Event.prototype.name = null;
						Event.prototype.attributes = $util.emptyArray;
						Event.prototype.droppedAttributesCount = null;
						Event.create = function create(properties) {
							return new Event(properties);
						};
						Event.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.timeUnixNano != null && Object.hasOwnProperty.call(message, "timeUnixNano"))
								writer.uint32( 9).fixed64(message.timeUnixNano);
							if (message.name != null && Object.hasOwnProperty.call(message, "name"))
								writer.uint32( 18).string(message.name);
							if (message.attributes != null && message.attributes.length)
								for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 26).fork()).ldelim();
							if (message.droppedAttributesCount != null && Object.hasOwnProperty.call(message, "droppedAttributesCount"))
								writer.uint32( 32).uint32(message.droppedAttributesCount);
							return writer;
						};
						Event.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						Event.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.Span.Event();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.timeUnixNano = reader.fixed64();
								break;
								}
								case 2: {
								message.name = reader.string();
								break;
								}
								case 3: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 4: {
								message.droppedAttributesCount = reader.uint32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						Event.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						Event.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
								if (!$util.isInteger(message.timeUnixNano) && !(message.timeUnixNano && $util.isInteger(message.timeUnixNano.low) && $util.isInteger(message.timeUnixNano.high)))
								return "timeUnixNano: integer|Long expected";
							if (message.name != null && message.hasOwnProperty("name"))
								if (!$util.isString(message.name))
								return "name: string expected";
							if (message.attributes != null && message.hasOwnProperty("attributes")) {
								if (!Array.isArray(message.attributes))
								return "attributes: array expected";
								for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
								}
							}
							if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
								if (!$util.isInteger(message.droppedAttributesCount))
								return "droppedAttributesCount: integer expected";
							return null;
						};
						Event.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.trace.v1.Span.Event)
								return object;
							var message = new $root.opentelemetry.proto.trace.v1.Span.Event();
							if (object.timeUnixNano != null)
								if ($util.Long)
								(message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
								else if (typeof object.timeUnixNano === "string")
								message.timeUnixNano = parseInt(object.timeUnixNano, 10);
								else if (typeof object.timeUnixNano === "number")
								message.timeUnixNano = object.timeUnixNano;
								else if (typeof object.timeUnixNano === "object")
								message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
							if (object.name != null)
								message.name = String(object.name);
							if (object.attributes) {
								if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: array expected");
								message.attributes = [];
								for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.Span.Event.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
								}
							}
							if (object.droppedAttributesCount != null)
								message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
							return message;
						};
						Event.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.arrays || options.defaults)
								object.attributes = [];
							if (options.defaults) {
								if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
								}
								else
								object.timeUnixNano = options.longs === String ? "0" : 0;
								object.name = "";
								object.droppedAttributesCount = 0;
							}
							if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
								if (typeof message.timeUnixNano === "number")
								object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
								else
								object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
							if (message.name != null && message.hasOwnProperty("name"))
								object.name = message.name;
							if (message.attributes && message.attributes.length) {
								object.attributes = [];
								for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
							}
							if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
								object.droppedAttributesCount = message.droppedAttributesCount;
							return object;
						};
						Event.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						Event.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.trace.v1.Span.Event";
						};
						return Event;
					})();
					Span.Link = (function () {
						function Link(properties) {
							this.attributes = [];
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						Link.prototype.traceId = null;
						Link.prototype.spanId = null;
						Link.prototype.traceState = null;
						Link.prototype.attributes = $util.emptyArray;
						Link.prototype.droppedAttributesCount = null;
						Link.create = function create(properties) {
							return new Link(properties);
						};
						Link.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.traceId != null && Object.hasOwnProperty.call(message, "traceId"))
								writer.uint32( 10).bytes(message.traceId);
							if (message.spanId != null && Object.hasOwnProperty.call(message, "spanId"))
								writer.uint32( 18).bytes(message.spanId);
							if (message.traceState != null && Object.hasOwnProperty.call(message, "traceState"))
								writer.uint32( 26).string(message.traceState);
							if (message.attributes != null && message.attributes.length)
								for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 34).fork()).ldelim();
							if (message.droppedAttributesCount != null && Object.hasOwnProperty.call(message, "droppedAttributesCount"))
								writer.uint32( 40).uint32(message.droppedAttributesCount);
							return writer;
						};
						Link.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						Link.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.Span.Link();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.traceId = reader.bytes();
								break;
								}
								case 2: {
								message.spanId = reader.bytes();
								break;
								}
								case 3: {
								message.traceState = reader.string();
								break;
								}
								case 4: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 5: {
								message.droppedAttributesCount = reader.uint32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						Link.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						Link.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.traceId != null && message.hasOwnProperty("traceId"))
								if (!(message.traceId && typeof message.traceId.length === "number" || $util.isString(message.traceId)))
								return "traceId: buffer expected";
							if (message.spanId != null && message.hasOwnProperty("spanId"))
								if (!(message.spanId && typeof message.spanId.length === "number" || $util.isString(message.spanId)))
								return "spanId: buffer expected";
							if (message.traceState != null && message.hasOwnProperty("traceState"))
								if (!$util.isString(message.traceState))
								return "traceState: string expected";
							if (message.attributes != null && message.hasOwnProperty("attributes")) {
								if (!Array.isArray(message.attributes))
								return "attributes: array expected";
								for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
								}
							}
							if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
								if (!$util.isInteger(message.droppedAttributesCount))
								return "droppedAttributesCount: integer expected";
							return null;
						};
						Link.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.trace.v1.Span.Link)
								return object;
							var message = new $root.opentelemetry.proto.trace.v1.Span.Link();
							if (object.traceId != null)
								if (typeof object.traceId === "string")
								$util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
								else if (object.traceId.length >= 0)
								message.traceId = object.traceId;
							if (object.spanId != null)
								if (typeof object.spanId === "string")
								$util.base64.decode(object.spanId, message.spanId = $util.newBuffer($util.base64.length(object.spanId)), 0);
								else if (object.spanId.length >= 0)
								message.spanId = object.spanId;
							if (object.traceState != null)
								message.traceState = String(object.traceState);
							if (object.attributes) {
								if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: array expected");
								message.attributes = [];
								for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.trace.v1.Span.Link.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
								}
							}
							if (object.droppedAttributesCount != null)
								message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
							return message;
						};
						Link.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.arrays || options.defaults)
								object.attributes = [];
							if (options.defaults) {
								if (options.bytes === String)
								object.traceId = "";
								else {
								object.traceId = [];
								if (options.bytes !== Array)
								object.traceId = $util.newBuffer(object.traceId);
								}
								if (options.bytes === String)
								object.spanId = "";
								else {
								object.spanId = [];
								if (options.bytes !== Array)
								object.spanId = $util.newBuffer(object.spanId);
								}
								object.traceState = "";
								object.droppedAttributesCount = 0;
							}
							if (message.traceId != null && message.hasOwnProperty("traceId"))
								object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
							if (message.spanId != null && message.hasOwnProperty("spanId"))
								object.spanId = options.bytes === String ? $util.base64.encode(message.spanId, 0, message.spanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.spanId) : message.spanId;
							if (message.traceState != null && message.hasOwnProperty("traceState"))
								object.traceState = message.traceState;
							if (message.attributes && message.attributes.length) {
								object.attributes = [];
								for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
							}
							if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
								object.droppedAttributesCount = message.droppedAttributesCount;
							return object;
						};
						Link.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						Link.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.trace.v1.Span.Link";
						};
						return Link;
					})();
					return Span;
				})();
				v1.Status = (function () {
					function Status(properties) {
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Status.prototype.message = null;
					Status.prototype.code = null;
					Status.create = function create(properties) {
						return new Status(properties);
					};
					Status.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.message != null && Object.hasOwnProperty.call(message, "message"))
							writer.uint32( 18).string(message.message);
						if (message.code != null && Object.hasOwnProperty.call(message, "code"))
							writer.uint32( 24).int32(message.code);
						return writer;
					};
					Status.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Status.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.trace.v1.Status();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 2: {
								message.message = reader.string();
								break;
								}
								case 3: {
								message.code = reader.int32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Status.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Status.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.message != null && message.hasOwnProperty("message"))
							if (!$util.isString(message.message))
								return "message: string expected";
						if (message.code != null && message.hasOwnProperty("code"))
							switch (message.code) {
								default:
								return "code: enum value expected";
								case 0:
								case 1:
								case 2:
								break;
							}
						return null;
					};
					Status.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.trace.v1.Status)
							return object;
						var message = new $root.opentelemetry.proto.trace.v1.Status();
						if (object.message != null)
							message.message = String(object.message);
						switch (object.code) {
							default:
								if (typeof object.code === "number") {
								message.code = object.code;
								break;
								}
								break;
							case "STATUS_CODE_UNSET":
							case 0:
								message.code = 0;
								break;
							case "STATUS_CODE_OK":
							case 1:
								message.code = 1;
								break;
							case "STATUS_CODE_ERROR":
							case 2:
								message.code = 2;
								break;
						}
						return message;
					};
					Status.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.defaults) {
							object.message = "";
							object.code = options.enums === String ? "STATUS_CODE_UNSET" : 0;
						}
						if (message.message != null && message.hasOwnProperty("message"))
							object.message = message.message;
						if (message.code != null && message.hasOwnProperty("code"))
							object.code = options.enums === String ? $root.opentelemetry.proto.trace.v1.Status.StatusCode[message.code] === undefined ? message.code : $root.opentelemetry.proto.trace.v1.Status.StatusCode[message.code] : message.code;
						return object;
					};
					Status.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Status.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.trace.v1.Status";
					};
					Status.StatusCode = (function () {
						var valuesById = {}, values = Object.create(valuesById);
						values[valuesById[0] = "STATUS_CODE_UNSET"] = 0;
						values[valuesById[1] = "STATUS_CODE_OK"] = 1;
						values[valuesById[2] = "STATUS_CODE_ERROR"] = 2;
						return values;
					})();
					return Status;
				})();
				return v1;
			})();
			return trace;
		})();
		proto.collector = (function () {
			var collector = {};
			collector.trace = (function () {
				var trace = {};
				trace.v1 = (function () {
					var v1 = {};
					v1.TraceService = (function () {
						function TraceService(rpcImpl, requestDelimited, responseDelimited) {
							$protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
						}
						(TraceService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = TraceService;
						TraceService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
							return new this(rpcImpl, requestDelimited, responseDelimited);
						};
						Object.defineProperty(TraceService.prototype["export"] = function export_(request, callback) {
							return this.rpcCall(export_, $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest, $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse, request, callback);
						}, "name", { value: "Export" });
						return TraceService;
					})();
					v1.ExportTraceServiceRequest = (function () {
						function ExportTraceServiceRequest(properties) {
							this.resourceSpans = [];
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportTraceServiceRequest.prototype.resourceSpans = $util.emptyArray;
						ExportTraceServiceRequest.create = function create(properties) {
							return new ExportTraceServiceRequest(properties);
						};
						ExportTraceServiceRequest.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.resourceSpans != null && message.resourceSpans.length)
								for (var i = 0; i < message.resourceSpans.length; ++i)
								$root.opentelemetry.proto.trace.v1.ResourceSpans.encode(message.resourceSpans[i], writer.uint32( 10).fork()).ldelim();
							return writer;
						};
						ExportTraceServiceRequest.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportTraceServiceRequest.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								if (!(message.resourceSpans && message.resourceSpans.length))
								message.resourceSpans = [];
								message.resourceSpans.push($root.opentelemetry.proto.trace.v1.ResourceSpans.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportTraceServiceRequest.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportTraceServiceRequest.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.resourceSpans != null && message.hasOwnProperty("resourceSpans")) {
								if (!Array.isArray(message.resourceSpans))
								return "resourceSpans: array expected";
								for (var i = 0; i < message.resourceSpans.length; ++i) {
								var error = $root.opentelemetry.proto.trace.v1.ResourceSpans.verify(message.resourceSpans[i]);
								if (error)
								return "resourceSpans." + error;
								}
							}
							return null;
						};
						ExportTraceServiceRequest.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest)
								return object;
							var message = new $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest();
							if (object.resourceSpans) {
								if (!Array.isArray(object.resourceSpans))
								throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: array expected");
								message.resourceSpans = [];
								for (var i = 0; i < object.resourceSpans.length; ++i) {
								if (typeof object.resourceSpans[i] !== "object")
								throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest.resourceSpans: object expected");
								message.resourceSpans[i] = $root.opentelemetry.proto.trace.v1.ResourceSpans.fromObject(object.resourceSpans[i]);
								}
							}
							return message;
						};
						ExportTraceServiceRequest.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.arrays || options.defaults)
								object.resourceSpans = [];
							if (message.resourceSpans && message.resourceSpans.length) {
								object.resourceSpans = [];
								for (var j = 0; j < message.resourceSpans.length; ++j)
								object.resourceSpans[j] = $root.opentelemetry.proto.trace.v1.ResourceSpans.toObject(message.resourceSpans[j], options);
							}
							return object;
						};
						ExportTraceServiceRequest.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportTraceServiceRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest";
						};
						return ExportTraceServiceRequest;
					})();
					v1.ExportTraceServiceResponse = (function () {
						function ExportTraceServiceResponse(properties) {
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportTraceServiceResponse.prototype.partialSuccess = null;
						ExportTraceServiceResponse.create = function create(properties) {
							return new ExportTraceServiceResponse(properties);
						};
						ExportTraceServiceResponse.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.partialSuccess != null && Object.hasOwnProperty.call(message, "partialSuccess"))
								$root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.encode(message.partialSuccess, writer.uint32( 10).fork()).ldelim();
							return writer;
						};
						ExportTraceServiceResponse.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportTraceServiceResponse.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.partialSuccess = $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.decode(reader, reader.uint32());
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportTraceServiceResponse.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportTraceServiceResponse.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess")) {
								var error = $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.verify(message.partialSuccess);
								if (error)
								return "partialSuccess." + error;
							}
							return null;
						};
						ExportTraceServiceResponse.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse)
								return object;
							var message = new $root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse();
							if (object.partialSuccess != null) {
								if (typeof object.partialSuccess !== "object")
								throw TypeError(".opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse.partialSuccess: object expected");
								message.partialSuccess = $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.fromObject(object.partialSuccess);
							}
							return message;
						};
						ExportTraceServiceResponse.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.defaults)
								object.partialSuccess = null;
							if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess"))
								object.partialSuccess = $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess.toObject(message.partialSuccess, options);
							return object;
						};
						ExportTraceServiceResponse.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportTraceServiceResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse";
						};
						return ExportTraceServiceResponse;
					})();
					v1.ExportTracePartialSuccess = (function () {
						function ExportTracePartialSuccess(properties) {
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportTracePartialSuccess.prototype.rejectedSpans = null;
						ExportTracePartialSuccess.prototype.errorMessage = null;
						ExportTracePartialSuccess.create = function create(properties) {
							return new ExportTracePartialSuccess(properties);
						};
						ExportTracePartialSuccess.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.rejectedSpans != null && Object.hasOwnProperty.call(message, "rejectedSpans"))
								writer.uint32( 8).int64(message.rejectedSpans);
							if (message.errorMessage != null && Object.hasOwnProperty.call(message, "errorMessage"))
								writer.uint32( 18).string(message.errorMessage);
							return writer;
						};
						ExportTracePartialSuccess.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportTracePartialSuccess.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.rejectedSpans = reader.int64();
								break;
								}
								case 2: {
								message.errorMessage = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportTracePartialSuccess.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportTracePartialSuccess.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.rejectedSpans != null && message.hasOwnProperty("rejectedSpans"))
								if (!$util.isInteger(message.rejectedSpans) && !(message.rejectedSpans && $util.isInteger(message.rejectedSpans.low) && $util.isInteger(message.rejectedSpans.high)))
								return "rejectedSpans: integer|Long expected";
							if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
								if (!$util.isString(message.errorMessage))
								return "errorMessage: string expected";
							return null;
						};
						ExportTracePartialSuccess.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess)
								return object;
							var message = new $root.opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess();
							if (object.rejectedSpans != null)
								if ($util.Long)
								(message.rejectedSpans = $util.Long.fromValue(object.rejectedSpans)).unsigned = false;
								else if (typeof object.rejectedSpans === "string")
								message.rejectedSpans = parseInt(object.rejectedSpans, 10);
								else if (typeof object.rejectedSpans === "number")
								message.rejectedSpans = object.rejectedSpans;
								else if (typeof object.rejectedSpans === "object")
								message.rejectedSpans = new $util.LongBits(object.rejectedSpans.low >>> 0, object.rejectedSpans.high >>> 0).toNumber();
							if (object.errorMessage != null)
								message.errorMessage = String(object.errorMessage);
							return message;
						};
						ExportTracePartialSuccess.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.defaults) {
								if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.rejectedSpans = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
								}
								else
								object.rejectedSpans = options.longs === String ? "0" : 0;
								object.errorMessage = "";
							}
							if (message.rejectedSpans != null && message.hasOwnProperty("rejectedSpans"))
								if (typeof message.rejectedSpans === "number")
								object.rejectedSpans = options.longs === String ? String(message.rejectedSpans) : message.rejectedSpans;
								else
								object.rejectedSpans = options.longs === String ? $util.Long.prototype.toString.call(message.rejectedSpans) : options.longs === Number ? new $util.LongBits(message.rejectedSpans.low >>> 0, message.rejectedSpans.high >>> 0).toNumber() : message.rejectedSpans;
							if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
								object.errorMessage = message.errorMessage;
							return object;
						};
						ExportTracePartialSuccess.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportTracePartialSuccess.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.trace.v1.ExportTracePartialSuccess";
						};
						return ExportTracePartialSuccess;
					})();
					return v1;
				})();
				return trace;
			})();
			collector.metrics = (function () {
				var metrics = {};
				metrics.v1 = (function () {
					var v1 = {};
					v1.MetricsService = (function () {
						function MetricsService(rpcImpl, requestDelimited, responseDelimited) {
							$protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
						}
						(MetricsService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = MetricsService;
						MetricsService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
							return new this(rpcImpl, requestDelimited, responseDelimited);
						};
						Object.defineProperty(MetricsService.prototype["export"] = function export_(request, callback) {
							return this.rpcCall(export_, $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest, $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse, request, callback);
						}, "name", { value: "Export" });
						return MetricsService;
					})();
					v1.ExportMetricsServiceRequest = (function () {
						function ExportMetricsServiceRequest(properties) {
							this.resourceMetrics = [];
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportMetricsServiceRequest.prototype.resourceMetrics = $util.emptyArray;
						ExportMetricsServiceRequest.create = function create(properties) {
							return new ExportMetricsServiceRequest(properties);
						};
						ExportMetricsServiceRequest.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.resourceMetrics != null && message.resourceMetrics.length)
								for (var i = 0; i < message.resourceMetrics.length; ++i)
								$root.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(message.resourceMetrics[i], writer.uint32( 10).fork()).ldelim();
							return writer;
						};
						ExportMetricsServiceRequest.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportMetricsServiceRequest.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								if (!(message.resourceMetrics && message.resourceMetrics.length))
								message.resourceMetrics = [];
								message.resourceMetrics.push($root.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportMetricsServiceRequest.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportMetricsServiceRequest.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.resourceMetrics != null && message.hasOwnProperty("resourceMetrics")) {
								if (!Array.isArray(message.resourceMetrics))
								return "resourceMetrics: array expected";
								for (var i = 0; i < message.resourceMetrics.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(message.resourceMetrics[i]);
								if (error)
								return "resourceMetrics." + error;
								}
							}
							return null;
						};
						ExportMetricsServiceRequest.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest)
								return object;
							var message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest();
							if (object.resourceMetrics) {
								if (!Array.isArray(object.resourceMetrics))
								throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: array expected");
								message.resourceMetrics = [];
								for (var i = 0; i < object.resourceMetrics.length; ++i) {
								if (typeof object.resourceMetrics[i] !== "object")
								throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest.resourceMetrics: object expected");
								message.resourceMetrics[i] = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(object.resourceMetrics[i]);
								}
							}
							return message;
						};
						ExportMetricsServiceRequest.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.arrays || options.defaults)
								object.resourceMetrics = [];
							if (message.resourceMetrics && message.resourceMetrics.length) {
								object.resourceMetrics = [];
								for (var j = 0; j < message.resourceMetrics.length; ++j)
								object.resourceMetrics[j] = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(message.resourceMetrics[j], options);
							}
							return object;
						};
						ExportMetricsServiceRequest.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportMetricsServiceRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest";
						};
						return ExportMetricsServiceRequest;
					})();
					v1.ExportMetricsServiceResponse = (function () {
						function ExportMetricsServiceResponse(properties) {
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportMetricsServiceResponse.prototype.partialSuccess = null;
						ExportMetricsServiceResponse.create = function create(properties) {
							return new ExportMetricsServiceResponse(properties);
						};
						ExportMetricsServiceResponse.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.partialSuccess != null && Object.hasOwnProperty.call(message, "partialSuccess"))
								$root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.encode(message.partialSuccess, writer.uint32( 10).fork()).ldelim();
							return writer;
						};
						ExportMetricsServiceResponse.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportMetricsServiceResponse.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.partialSuccess = $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.decode(reader, reader.uint32());
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportMetricsServiceResponse.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportMetricsServiceResponse.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess")) {
								var error = $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.verify(message.partialSuccess);
								if (error)
								return "partialSuccess." + error;
							}
							return null;
						};
						ExportMetricsServiceResponse.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse)
								return object;
							var message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse();
							if (object.partialSuccess != null) {
								if (typeof object.partialSuccess !== "object")
								throw TypeError(".opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse.partialSuccess: object expected");
								message.partialSuccess = $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.fromObject(object.partialSuccess);
							}
							return message;
						};
						ExportMetricsServiceResponse.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.defaults)
								object.partialSuccess = null;
							if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess"))
								object.partialSuccess = $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess.toObject(message.partialSuccess, options);
							return object;
						};
						ExportMetricsServiceResponse.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportMetricsServiceResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse";
						};
						return ExportMetricsServiceResponse;
					})();
					v1.ExportMetricsPartialSuccess = (function () {
						function ExportMetricsPartialSuccess(properties) {
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportMetricsPartialSuccess.prototype.rejectedDataPoints = null;
						ExportMetricsPartialSuccess.prototype.errorMessage = null;
						ExportMetricsPartialSuccess.create = function create(properties) {
							return new ExportMetricsPartialSuccess(properties);
						};
						ExportMetricsPartialSuccess.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.rejectedDataPoints != null && Object.hasOwnProperty.call(message, "rejectedDataPoints"))
								writer.uint32( 8).int64(message.rejectedDataPoints);
							if (message.errorMessage != null && Object.hasOwnProperty.call(message, "errorMessage"))
								writer.uint32( 18).string(message.errorMessage);
							return writer;
						};
						ExportMetricsPartialSuccess.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportMetricsPartialSuccess.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.rejectedDataPoints = reader.int64();
								break;
								}
								case 2: {
								message.errorMessage = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportMetricsPartialSuccess.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportMetricsPartialSuccess.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.rejectedDataPoints != null && message.hasOwnProperty("rejectedDataPoints"))
								if (!$util.isInteger(message.rejectedDataPoints) && !(message.rejectedDataPoints && $util.isInteger(message.rejectedDataPoints.low) && $util.isInteger(message.rejectedDataPoints.high)))
								return "rejectedDataPoints: integer|Long expected";
							if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
								if (!$util.isString(message.errorMessage))
								return "errorMessage: string expected";
							return null;
						};
						ExportMetricsPartialSuccess.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess)
								return object;
							var message = new $root.opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess();
							if (object.rejectedDataPoints != null)
								if ($util.Long)
								(message.rejectedDataPoints = $util.Long.fromValue(object.rejectedDataPoints)).unsigned = false;
								else if (typeof object.rejectedDataPoints === "string")
								message.rejectedDataPoints = parseInt(object.rejectedDataPoints, 10);
								else if (typeof object.rejectedDataPoints === "number")
								message.rejectedDataPoints = object.rejectedDataPoints;
								else if (typeof object.rejectedDataPoints === "object")
								message.rejectedDataPoints = new $util.LongBits(object.rejectedDataPoints.low >>> 0, object.rejectedDataPoints.high >>> 0).toNumber();
							if (object.errorMessage != null)
								message.errorMessage = String(object.errorMessage);
							return message;
						};
						ExportMetricsPartialSuccess.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.defaults) {
								if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.rejectedDataPoints = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
								}
								else
								object.rejectedDataPoints = options.longs === String ? "0" : 0;
								object.errorMessage = "";
							}
							if (message.rejectedDataPoints != null && message.hasOwnProperty("rejectedDataPoints"))
								if (typeof message.rejectedDataPoints === "number")
								object.rejectedDataPoints = options.longs === String ? String(message.rejectedDataPoints) : message.rejectedDataPoints;
								else
								object.rejectedDataPoints = options.longs === String ? $util.Long.prototype.toString.call(message.rejectedDataPoints) : options.longs === Number ? new $util.LongBits(message.rejectedDataPoints.low >>> 0, message.rejectedDataPoints.high >>> 0).toNumber() : message.rejectedDataPoints;
							if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
								object.errorMessage = message.errorMessage;
							return object;
						};
						ExportMetricsPartialSuccess.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportMetricsPartialSuccess.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.metrics.v1.ExportMetricsPartialSuccess";
						};
						return ExportMetricsPartialSuccess;
					})();
					return v1;
				})();
				return metrics;
			})();
			collector.logs = (function () {
				var logs = {};
				logs.v1 = (function () {
					var v1 = {};
					v1.LogsService = (function () {
						function LogsService(rpcImpl, requestDelimited, responseDelimited) {
							$protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
						}
						(LogsService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = LogsService;
						LogsService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
							return new this(rpcImpl, requestDelimited, responseDelimited);
						};
						Object.defineProperty(LogsService.prototype["export"] = function export_(request, callback) {
							return this.rpcCall(export_, $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest, $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse, request, callback);
						}, "name", { value: "Export" });
						return LogsService;
					})();
					v1.ExportLogsServiceRequest = (function () {
						function ExportLogsServiceRequest(properties) {
							this.resourceLogs = [];
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportLogsServiceRequest.prototype.resourceLogs = $util.emptyArray;
						ExportLogsServiceRequest.create = function create(properties) {
							return new ExportLogsServiceRequest(properties);
						};
						ExportLogsServiceRequest.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.resourceLogs != null && message.resourceLogs.length)
								for (var i = 0; i < message.resourceLogs.length; ++i)
								$root.opentelemetry.proto.logs.v1.ResourceLogs.encode(message.resourceLogs[i], writer.uint32( 10).fork()).ldelim();
							return writer;
						};
						ExportLogsServiceRequest.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportLogsServiceRequest.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								if (!(message.resourceLogs && message.resourceLogs.length))
								message.resourceLogs = [];
								message.resourceLogs.push($root.opentelemetry.proto.logs.v1.ResourceLogs.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportLogsServiceRequest.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportLogsServiceRequest.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.resourceLogs != null && message.hasOwnProperty("resourceLogs")) {
								if (!Array.isArray(message.resourceLogs))
								return "resourceLogs: array expected";
								for (var i = 0; i < message.resourceLogs.length; ++i) {
								var error = $root.opentelemetry.proto.logs.v1.ResourceLogs.verify(message.resourceLogs[i]);
								if (error)
								return "resourceLogs." + error;
								}
							}
							return null;
						};
						ExportLogsServiceRequest.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest)
								return object;
							var message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest();
							if (object.resourceLogs) {
								if (!Array.isArray(object.resourceLogs))
								throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: array expected");
								message.resourceLogs = [];
								for (var i = 0; i < object.resourceLogs.length; ++i) {
								if (typeof object.resourceLogs[i] !== "object")
								throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest.resourceLogs: object expected");
								message.resourceLogs[i] = $root.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(object.resourceLogs[i]);
								}
							}
							return message;
						};
						ExportLogsServiceRequest.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.arrays || options.defaults)
								object.resourceLogs = [];
							if (message.resourceLogs && message.resourceLogs.length) {
								object.resourceLogs = [];
								for (var j = 0; j < message.resourceLogs.length; ++j)
								object.resourceLogs[j] = $root.opentelemetry.proto.logs.v1.ResourceLogs.toObject(message.resourceLogs[j], options);
							}
							return object;
						};
						ExportLogsServiceRequest.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportLogsServiceRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest";
						};
						return ExportLogsServiceRequest;
					})();
					v1.ExportLogsServiceResponse = (function () {
						function ExportLogsServiceResponse(properties) {
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportLogsServiceResponse.prototype.partialSuccess = null;
						ExportLogsServiceResponse.create = function create(properties) {
							return new ExportLogsServiceResponse(properties);
						};
						ExportLogsServiceResponse.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.partialSuccess != null && Object.hasOwnProperty.call(message, "partialSuccess"))
								$root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.encode(message.partialSuccess, writer.uint32( 10).fork()).ldelim();
							return writer;
						};
						ExportLogsServiceResponse.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportLogsServiceResponse.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.partialSuccess = $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.decode(reader, reader.uint32());
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportLogsServiceResponse.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportLogsServiceResponse.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess")) {
								var error = $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.verify(message.partialSuccess);
								if (error)
								return "partialSuccess." + error;
							}
							return null;
						};
						ExportLogsServiceResponse.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse)
								return object;
							var message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse();
							if (object.partialSuccess != null) {
								if (typeof object.partialSuccess !== "object")
								throw TypeError(".opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse.partialSuccess: object expected");
								message.partialSuccess = $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.fromObject(object.partialSuccess);
							}
							return message;
						};
						ExportLogsServiceResponse.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.defaults)
								object.partialSuccess = null;
							if (message.partialSuccess != null && message.hasOwnProperty("partialSuccess"))
								object.partialSuccess = $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess.toObject(message.partialSuccess, options);
							return object;
						};
						ExportLogsServiceResponse.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportLogsServiceResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse";
						};
						return ExportLogsServiceResponse;
					})();
					v1.ExportLogsPartialSuccess = (function () {
						function ExportLogsPartialSuccess(properties) {
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ExportLogsPartialSuccess.prototype.rejectedLogRecords = null;
						ExportLogsPartialSuccess.prototype.errorMessage = null;
						ExportLogsPartialSuccess.create = function create(properties) {
							return new ExportLogsPartialSuccess(properties);
						};
						ExportLogsPartialSuccess.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.rejectedLogRecords != null && Object.hasOwnProperty.call(message, "rejectedLogRecords"))
								writer.uint32( 8).int64(message.rejectedLogRecords);
							if (message.errorMessage != null && Object.hasOwnProperty.call(message, "errorMessage"))
								writer.uint32( 18).string(message.errorMessage);
							return writer;
						};
						ExportLogsPartialSuccess.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ExportLogsPartialSuccess.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.rejectedLogRecords = reader.int64();
								break;
								}
								case 2: {
								message.errorMessage = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ExportLogsPartialSuccess.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ExportLogsPartialSuccess.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.rejectedLogRecords != null && message.hasOwnProperty("rejectedLogRecords"))
								if (!$util.isInteger(message.rejectedLogRecords) && !(message.rejectedLogRecords && $util.isInteger(message.rejectedLogRecords.low) && $util.isInteger(message.rejectedLogRecords.high)))
								return "rejectedLogRecords: integer|Long expected";
							if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
								if (!$util.isString(message.errorMessage))
								return "errorMessage: string expected";
							return null;
						};
						ExportLogsPartialSuccess.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess)
								return object;
							var message = new $root.opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess();
							if (object.rejectedLogRecords != null)
								if ($util.Long)
								(message.rejectedLogRecords = $util.Long.fromValue(object.rejectedLogRecords)).unsigned = false;
								else if (typeof object.rejectedLogRecords === "string")
								message.rejectedLogRecords = parseInt(object.rejectedLogRecords, 10);
								else if (typeof object.rejectedLogRecords === "number")
								message.rejectedLogRecords = object.rejectedLogRecords;
								else if (typeof object.rejectedLogRecords === "object")
								message.rejectedLogRecords = new $util.LongBits(object.rejectedLogRecords.low >>> 0, object.rejectedLogRecords.high >>> 0).toNumber();
							if (object.errorMessage != null)
								message.errorMessage = String(object.errorMessage);
							return message;
						};
						ExportLogsPartialSuccess.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.defaults) {
								if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.rejectedLogRecords = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
								}
								else
								object.rejectedLogRecords = options.longs === String ? "0" : 0;
								object.errorMessage = "";
							}
							if (message.rejectedLogRecords != null && message.hasOwnProperty("rejectedLogRecords"))
								if (typeof message.rejectedLogRecords === "number")
								object.rejectedLogRecords = options.longs === String ? String(message.rejectedLogRecords) : message.rejectedLogRecords;
								else
								object.rejectedLogRecords = options.longs === String ? $util.Long.prototype.toString.call(message.rejectedLogRecords) : options.longs === Number ? new $util.LongBits(message.rejectedLogRecords.low >>> 0, message.rejectedLogRecords.high >>> 0).toNumber() : message.rejectedLogRecords;
							if (message.errorMessage != null && message.hasOwnProperty("errorMessage"))
								object.errorMessage = message.errorMessage;
							return object;
						};
						ExportLogsPartialSuccess.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ExportLogsPartialSuccess.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.collector.logs.v1.ExportLogsPartialSuccess";
						};
						return ExportLogsPartialSuccess;
					})();
					return v1;
				})();
				return logs;
			})();
			return collector;
		})();
		proto.metrics = (function () {
			var metrics = {};
			metrics.v1 = (function () {
				var v1 = {};
				v1.MetricsData = (function () {
					function MetricsData(properties) {
						this.resourceMetrics = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					MetricsData.prototype.resourceMetrics = $util.emptyArray;
					MetricsData.create = function create(properties) {
						return new MetricsData(properties);
					};
					MetricsData.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.resourceMetrics != null && message.resourceMetrics.length)
							for (var i = 0; i < message.resourceMetrics.length; ++i)
								$root.opentelemetry.proto.metrics.v1.ResourceMetrics.encode(message.resourceMetrics[i], writer.uint32( 10).fork()).ldelim();
						return writer;
					};
					MetricsData.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					MetricsData.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.MetricsData();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.resourceMetrics && message.resourceMetrics.length))
								message.resourceMetrics = [];
								message.resourceMetrics.push($root.opentelemetry.proto.metrics.v1.ResourceMetrics.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					MetricsData.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					MetricsData.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.resourceMetrics != null && message.hasOwnProperty("resourceMetrics")) {
							if (!Array.isArray(message.resourceMetrics))
								return "resourceMetrics: array expected";
							for (var i = 0; i < message.resourceMetrics.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.verify(message.resourceMetrics[i]);
								if (error)
								return "resourceMetrics." + error;
							}
						}
						return null;
					};
					MetricsData.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.MetricsData)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.MetricsData();
						if (object.resourceMetrics) {
							if (!Array.isArray(object.resourceMetrics))
								throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: array expected");
							message.resourceMetrics = [];
							for (var i = 0; i < object.resourceMetrics.length; ++i) {
								if (typeof object.resourceMetrics[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.MetricsData.resourceMetrics: object expected");
								message.resourceMetrics[i] = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.fromObject(object.resourceMetrics[i]);
							}
						}
						return message;
					};
					MetricsData.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.resourceMetrics = [];
						if (message.resourceMetrics && message.resourceMetrics.length) {
							object.resourceMetrics = [];
							for (var j = 0; j < message.resourceMetrics.length; ++j)
								object.resourceMetrics[j] = $root.opentelemetry.proto.metrics.v1.ResourceMetrics.toObject(message.resourceMetrics[j], options);
						}
						return object;
					};
					MetricsData.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					MetricsData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.MetricsData";
					};
					return MetricsData;
				})();
				v1.ResourceMetrics = (function () {
					function ResourceMetrics(properties) {
						this.scopeMetrics = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ResourceMetrics.prototype.resource = null;
					ResourceMetrics.prototype.scopeMetrics = $util.emptyArray;
					ResourceMetrics.prototype.schemaUrl = null;
					ResourceMetrics.create = function create(properties) {
						return new ResourceMetrics(properties);
					};
					ResourceMetrics.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.resource != null && Object.hasOwnProperty.call(message, "resource"))
							$root.opentelemetry.proto.resource.v1.Resource.encode(message.resource, writer.uint32( 10).fork()).ldelim();
						if (message.scopeMetrics != null && message.scopeMetrics.length)
							for (var i = 0; i < message.scopeMetrics.length; ++i)
								$root.opentelemetry.proto.metrics.v1.ScopeMetrics.encode(message.scopeMetrics[i], writer.uint32( 18).fork()).ldelim();
						if (message.schemaUrl != null && Object.hasOwnProperty.call(message, "schemaUrl"))
							writer.uint32( 26).string(message.schemaUrl);
						return writer;
					};
					ResourceMetrics.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ResourceMetrics.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ResourceMetrics();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.resource = $root.opentelemetry.proto.resource.v1.Resource.decode(reader, reader.uint32());
								break;
								}
								case 2: {
								if (!(message.scopeMetrics && message.scopeMetrics.length))
								message.scopeMetrics = [];
								message.scopeMetrics.push($root.opentelemetry.proto.metrics.v1.ScopeMetrics.decode(reader, reader.uint32()));
								break;
								}
								case 3: {
								message.schemaUrl = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ResourceMetrics.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ResourceMetrics.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.resource != null && message.hasOwnProperty("resource")) {
							var error = $root.opentelemetry.proto.resource.v1.Resource.verify(message.resource);
							if (error)
								return "resource." + error;
						}
						if (message.scopeMetrics != null && message.hasOwnProperty("scopeMetrics")) {
							if (!Array.isArray(message.scopeMetrics))
								return "scopeMetrics: array expected";
							for (var i = 0; i < message.scopeMetrics.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.ScopeMetrics.verify(message.scopeMetrics[i]);
								if (error)
								return "scopeMetrics." + error;
							}
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							if (!$util.isString(message.schemaUrl))
								return "schemaUrl: string expected";
						return null;
					};
					ResourceMetrics.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.ResourceMetrics)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.ResourceMetrics();
						if (object.resource != null) {
							if (typeof object.resource !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.resource: object expected");
							message.resource = $root.opentelemetry.proto.resource.v1.Resource.fromObject(object.resource);
						}
						if (object.scopeMetrics) {
							if (!Array.isArray(object.scopeMetrics))
								throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: array expected");
							message.scopeMetrics = [];
							for (var i = 0; i < object.scopeMetrics.length; ++i) {
								if (typeof object.scopeMetrics[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ResourceMetrics.scopeMetrics: object expected");
								message.scopeMetrics[i] = $root.opentelemetry.proto.metrics.v1.ScopeMetrics.fromObject(object.scopeMetrics[i]);
							}
						}
						if (object.schemaUrl != null)
							message.schemaUrl = String(object.schemaUrl);
						return message;
					};
					ResourceMetrics.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.scopeMetrics = [];
						if (options.defaults) {
							object.resource = null;
							object.schemaUrl = "";
						}
						if (message.resource != null && message.hasOwnProperty("resource"))
							object.resource = $root.opentelemetry.proto.resource.v1.Resource.toObject(message.resource, options);
						if (message.scopeMetrics && message.scopeMetrics.length) {
							object.scopeMetrics = [];
							for (var j = 0; j < message.scopeMetrics.length; ++j)
								object.scopeMetrics[j] = $root.opentelemetry.proto.metrics.v1.ScopeMetrics.toObject(message.scopeMetrics[j], options);
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							object.schemaUrl = message.schemaUrl;
						return object;
					};
					ResourceMetrics.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ResourceMetrics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.ResourceMetrics";
					};
					return ResourceMetrics;
				})();
				v1.ScopeMetrics = (function () {
					function ScopeMetrics(properties) {
						this.metrics = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ScopeMetrics.prototype.scope = null;
					ScopeMetrics.prototype.metrics = $util.emptyArray;
					ScopeMetrics.prototype.schemaUrl = null;
					ScopeMetrics.create = function create(properties) {
						return new ScopeMetrics(properties);
					};
					ScopeMetrics.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.scope != null && Object.hasOwnProperty.call(message, "scope"))
							$root.opentelemetry.proto.common.v1.InstrumentationScope.encode(message.scope, writer.uint32( 10).fork()).ldelim();
						if (message.metrics != null && message.metrics.length)
							for (var i = 0; i < message.metrics.length; ++i)
								$root.opentelemetry.proto.metrics.v1.Metric.encode(message.metrics[i], writer.uint32( 18).fork()).ldelim();
						if (message.schemaUrl != null && Object.hasOwnProperty.call(message, "schemaUrl"))
							writer.uint32( 26).string(message.schemaUrl);
						return writer;
					};
					ScopeMetrics.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ScopeMetrics.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ScopeMetrics();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.decode(reader, reader.uint32());
								break;
								}
								case 2: {
								if (!(message.metrics && message.metrics.length))
								message.metrics = [];
								message.metrics.push($root.opentelemetry.proto.metrics.v1.Metric.decode(reader, reader.uint32()));
								break;
								}
								case 3: {
								message.schemaUrl = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ScopeMetrics.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ScopeMetrics.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.scope != null && message.hasOwnProperty("scope")) {
							var error = $root.opentelemetry.proto.common.v1.InstrumentationScope.verify(message.scope);
							if (error)
								return "scope." + error;
						}
						if (message.metrics != null && message.hasOwnProperty("metrics")) {
							if (!Array.isArray(message.metrics))
								return "metrics: array expected";
							for (var i = 0; i < message.metrics.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.Metric.verify(message.metrics[i]);
								if (error)
								return "metrics." + error;
							}
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							if (!$util.isString(message.schemaUrl))
								return "schemaUrl: string expected";
						return null;
					};
					ScopeMetrics.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.ScopeMetrics)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.ScopeMetrics();
						if (object.scope != null) {
							if (typeof object.scope !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.scope: object expected");
							message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(object.scope);
						}
						if (object.metrics) {
							if (!Array.isArray(object.metrics))
								throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: array expected");
							message.metrics = [];
							for (var i = 0; i < object.metrics.length; ++i) {
								if (typeof object.metrics[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ScopeMetrics.metrics: object expected");
								message.metrics[i] = $root.opentelemetry.proto.metrics.v1.Metric.fromObject(object.metrics[i]);
							}
						}
						if (object.schemaUrl != null)
							message.schemaUrl = String(object.schemaUrl);
						return message;
					};
					ScopeMetrics.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.metrics = [];
						if (options.defaults) {
							object.scope = null;
							object.schemaUrl = "";
						}
						if (message.scope != null && message.hasOwnProperty("scope"))
							object.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.toObject(message.scope, options);
						if (message.metrics && message.metrics.length) {
							object.metrics = [];
							for (var j = 0; j < message.metrics.length; ++j)
								object.metrics[j] = $root.opentelemetry.proto.metrics.v1.Metric.toObject(message.metrics[j], options);
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							object.schemaUrl = message.schemaUrl;
						return object;
					};
					ScopeMetrics.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ScopeMetrics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.ScopeMetrics";
					};
					return ScopeMetrics;
				})();
				v1.Metric = (function () {
					function Metric(properties) {
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Metric.prototype.name = null;
					Metric.prototype.description = null;
					Metric.prototype.unit = null;
					Metric.prototype.gauge = null;
					Metric.prototype.sum = null;
					Metric.prototype.histogram = null;
					Metric.prototype.exponentialHistogram = null;
					Metric.prototype.summary = null;
					var $oneOfFields;
					Object.defineProperty(Metric.prototype, "data", {
						get: $util.oneOfGetter($oneOfFields = ["gauge", "sum", "histogram", "exponentialHistogram", "summary"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					Metric.create = function create(properties) {
						return new Metric(properties);
					};
					Metric.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.name != null && Object.hasOwnProperty.call(message, "name"))
							writer.uint32( 10).string(message.name);
						if (message.description != null && Object.hasOwnProperty.call(message, "description"))
							writer.uint32( 18).string(message.description);
						if (message.unit != null && Object.hasOwnProperty.call(message, "unit"))
							writer.uint32( 26).string(message.unit);
						if (message.gauge != null && Object.hasOwnProperty.call(message, "gauge"))
							$root.opentelemetry.proto.metrics.v1.Gauge.encode(message.gauge, writer.uint32( 42).fork()).ldelim();
						if (message.sum != null && Object.hasOwnProperty.call(message, "sum"))
							$root.opentelemetry.proto.metrics.v1.Sum.encode(message.sum, writer.uint32( 58).fork()).ldelim();
						if (message.histogram != null && Object.hasOwnProperty.call(message, "histogram"))
							$root.opentelemetry.proto.metrics.v1.Histogram.encode(message.histogram, writer.uint32( 74).fork()).ldelim();
						if (message.exponentialHistogram != null && Object.hasOwnProperty.call(message, "exponentialHistogram"))
							$root.opentelemetry.proto.metrics.v1.ExponentialHistogram.encode(message.exponentialHistogram, writer.uint32( 82).fork()).ldelim();
						if (message.summary != null && Object.hasOwnProperty.call(message, "summary"))
							$root.opentelemetry.proto.metrics.v1.Summary.encode(message.summary, writer.uint32( 90).fork()).ldelim();
						return writer;
					};
					Metric.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Metric.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Metric();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.name = reader.string();
								break;
								}
								case 2: {
								message.description = reader.string();
								break;
								}
								case 3: {
								message.unit = reader.string();
								break;
								}
								case 5: {
								message.gauge = $root.opentelemetry.proto.metrics.v1.Gauge.decode(reader, reader.uint32());
								break;
								}
								case 7: {
								message.sum = $root.opentelemetry.proto.metrics.v1.Sum.decode(reader, reader.uint32());
								break;
								}
								case 9: {
								message.histogram = $root.opentelemetry.proto.metrics.v1.Histogram.decode(reader, reader.uint32());
								break;
								}
								case 10: {
								message.exponentialHistogram = $root.opentelemetry.proto.metrics.v1.ExponentialHistogram.decode(reader, reader.uint32());
								break;
								}
								case 11: {
								message.summary = $root.opentelemetry.proto.metrics.v1.Summary.decode(reader, reader.uint32());
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Metric.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Metric.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						var properties = {};
						if (message.name != null && message.hasOwnProperty("name"))
							if (!$util.isString(message.name))
								return "name: string expected";
						if (message.description != null && message.hasOwnProperty("description"))
							if (!$util.isString(message.description))
								return "description: string expected";
						if (message.unit != null && message.hasOwnProperty("unit"))
							if (!$util.isString(message.unit))
								return "unit: string expected";
						if (message.gauge != null && message.hasOwnProperty("gauge")) {
							properties.data = 1;
							{
								var error = $root.opentelemetry.proto.metrics.v1.Gauge.verify(message.gauge);
								if (error)
								return "gauge." + error;
							}
						}
						if (message.sum != null && message.hasOwnProperty("sum")) {
							if (properties.data === 1)
								return "data: multiple values";
							properties.data = 1;
							{
								var error = $root.opentelemetry.proto.metrics.v1.Sum.verify(message.sum);
								if (error)
								return "sum." + error;
							}
						}
						if (message.histogram != null && message.hasOwnProperty("histogram")) {
							if (properties.data === 1)
								return "data: multiple values";
							properties.data = 1;
							{
								var error = $root.opentelemetry.proto.metrics.v1.Histogram.verify(message.histogram);
								if (error)
								return "histogram." + error;
							}
						}
						if (message.exponentialHistogram != null && message.hasOwnProperty("exponentialHistogram")) {
							if (properties.data === 1)
								return "data: multiple values";
							properties.data = 1;
							{
								var error = $root.opentelemetry.proto.metrics.v1.ExponentialHistogram.verify(message.exponentialHistogram);
								if (error)
								return "exponentialHistogram." + error;
							}
						}
						if (message.summary != null && message.hasOwnProperty("summary")) {
							if (properties.data === 1)
								return "data: multiple values";
							properties.data = 1;
							{
								var error = $root.opentelemetry.proto.metrics.v1.Summary.verify(message.summary);
								if (error)
								return "summary." + error;
							}
						}
						return null;
					};
					Metric.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.Metric)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.Metric();
						if (object.name != null)
							message.name = String(object.name);
						if (object.description != null)
							message.description = String(object.description);
						if (object.unit != null)
							message.unit = String(object.unit);
						if (object.gauge != null) {
							if (typeof object.gauge !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Metric.gauge: object expected");
							message.gauge = $root.opentelemetry.proto.metrics.v1.Gauge.fromObject(object.gauge);
						}
						if (object.sum != null) {
							if (typeof object.sum !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Metric.sum: object expected");
							message.sum = $root.opentelemetry.proto.metrics.v1.Sum.fromObject(object.sum);
						}
						if (object.histogram != null) {
							if (typeof object.histogram !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Metric.histogram: object expected");
							message.histogram = $root.opentelemetry.proto.metrics.v1.Histogram.fromObject(object.histogram);
						}
						if (object.exponentialHistogram != null) {
							if (typeof object.exponentialHistogram !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Metric.exponentialHistogram: object expected");
							message.exponentialHistogram = $root.opentelemetry.proto.metrics.v1.ExponentialHistogram.fromObject(object.exponentialHistogram);
						}
						if (object.summary != null) {
							if (typeof object.summary !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Metric.summary: object expected");
							message.summary = $root.opentelemetry.proto.metrics.v1.Summary.fromObject(object.summary);
						}
						return message;
					};
					Metric.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.defaults) {
							object.name = "";
							object.description = "";
							object.unit = "";
						}
						if (message.name != null && message.hasOwnProperty("name"))
							object.name = message.name;
						if (message.description != null && message.hasOwnProperty("description"))
							object.description = message.description;
						if (message.unit != null && message.hasOwnProperty("unit"))
							object.unit = message.unit;
						if (message.gauge != null && message.hasOwnProperty("gauge")) {
							object.gauge = $root.opentelemetry.proto.metrics.v1.Gauge.toObject(message.gauge, options);
							if (options.oneofs)
								object.data = "gauge";
						}
						if (message.sum != null && message.hasOwnProperty("sum")) {
							object.sum = $root.opentelemetry.proto.metrics.v1.Sum.toObject(message.sum, options);
							if (options.oneofs)
								object.data = "sum";
						}
						if (message.histogram != null && message.hasOwnProperty("histogram")) {
							object.histogram = $root.opentelemetry.proto.metrics.v1.Histogram.toObject(message.histogram, options);
							if (options.oneofs)
								object.data = "histogram";
						}
						if (message.exponentialHistogram != null && message.hasOwnProperty("exponentialHistogram")) {
							object.exponentialHistogram = $root.opentelemetry.proto.metrics.v1.ExponentialHistogram.toObject(message.exponentialHistogram, options);
							if (options.oneofs)
								object.data = "exponentialHistogram";
						}
						if (message.summary != null && message.hasOwnProperty("summary")) {
							object.summary = $root.opentelemetry.proto.metrics.v1.Summary.toObject(message.summary, options);
							if (options.oneofs)
								object.data = "summary";
						}
						return object;
					};
					Metric.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Metric.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.Metric";
					};
					return Metric;
				})();
				v1.Gauge = (function () {
					function Gauge(properties) {
						this.dataPoints = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Gauge.prototype.dataPoints = $util.emptyArray;
					Gauge.create = function create(properties) {
						return new Gauge(properties);
					};
					Gauge.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.dataPoints != null && message.dataPoints.length)
							for (var i = 0; i < message.dataPoints.length; ++i)
								$root.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(message.dataPoints[i], writer.uint32( 10).fork()).ldelim();
						return writer;
					};
					Gauge.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Gauge.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Gauge();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.dataPoints && message.dataPoints.length))
								message.dataPoints = [];
								message.dataPoints.push($root.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Gauge.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Gauge.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.dataPoints != null && message.hasOwnProperty("dataPoints")) {
							if (!Array.isArray(message.dataPoints))
								return "dataPoints: array expected";
							for (var i = 0; i < message.dataPoints.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(message.dataPoints[i]);
								if (error)
								return "dataPoints." + error;
							}
						}
						return null;
					};
					Gauge.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.Gauge)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.Gauge();
						if (object.dataPoints) {
							if (!Array.isArray(object.dataPoints))
								throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: array expected");
							message.dataPoints = [];
							for (var i = 0; i < object.dataPoints.length; ++i) {
								if (typeof object.dataPoints[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Gauge.dataPoints: object expected");
								message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(object.dataPoints[i]);
							}
						}
						return message;
					};
					Gauge.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.dataPoints = [];
						if (message.dataPoints && message.dataPoints.length) {
							object.dataPoints = [];
							for (var j = 0; j < message.dataPoints.length; ++j)
								object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(message.dataPoints[j], options);
						}
						return object;
					};
					Gauge.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Gauge.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.Gauge";
					};
					return Gauge;
				})();
				v1.Sum = (function () {
					function Sum(properties) {
						this.dataPoints = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Sum.prototype.dataPoints = $util.emptyArray;
					Sum.prototype.aggregationTemporality = null;
					Sum.prototype.isMonotonic = null;
					Sum.create = function create(properties) {
						return new Sum(properties);
					};
					Sum.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.dataPoints != null && message.dataPoints.length)
							for (var i = 0; i < message.dataPoints.length; ++i)
								$root.opentelemetry.proto.metrics.v1.NumberDataPoint.encode(message.dataPoints[i], writer.uint32( 10).fork()).ldelim();
						if (message.aggregationTemporality != null && Object.hasOwnProperty.call(message, "aggregationTemporality"))
							writer.uint32( 16).int32(message.aggregationTemporality);
						if (message.isMonotonic != null && Object.hasOwnProperty.call(message, "isMonotonic"))
							writer.uint32( 24).bool(message.isMonotonic);
						return writer;
					};
					Sum.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Sum.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Sum();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.dataPoints && message.dataPoints.length))
								message.dataPoints = [];
								message.dataPoints.push($root.opentelemetry.proto.metrics.v1.NumberDataPoint.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.aggregationTemporality = reader.int32();
								break;
								}
								case 3: {
								message.isMonotonic = reader.bool();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Sum.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Sum.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.dataPoints != null && message.hasOwnProperty("dataPoints")) {
							if (!Array.isArray(message.dataPoints))
								return "dataPoints: array expected";
							for (var i = 0; i < message.dataPoints.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.verify(message.dataPoints[i]);
								if (error)
								return "dataPoints." + error;
							}
						}
						if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
							switch (message.aggregationTemporality) {
								default:
								return "aggregationTemporality: enum value expected";
								case 0:
								case 1:
								case 2:
								break;
							}
						if (message.isMonotonic != null && message.hasOwnProperty("isMonotonic"))
							if (typeof message.isMonotonic !== "boolean")
								return "isMonotonic: boolean expected";
						return null;
					};
					Sum.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.Sum)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.Sum();
						if (object.dataPoints) {
							if (!Array.isArray(object.dataPoints))
								throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: array expected");
							message.dataPoints = [];
							for (var i = 0; i < object.dataPoints.length; ++i) {
								if (typeof object.dataPoints[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Sum.dataPoints: object expected");
								message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.fromObject(object.dataPoints[i]);
							}
						}
						switch (object.aggregationTemporality) {
							default:
								if (typeof object.aggregationTemporality === "number") {
								message.aggregationTemporality = object.aggregationTemporality;
								break;
								}
								break;
							case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
							case 0:
								message.aggregationTemporality = 0;
								break;
							case "AGGREGATION_TEMPORALITY_DELTA":
							case 1:
								message.aggregationTemporality = 1;
								break;
							case "AGGREGATION_TEMPORALITY_CUMULATIVE":
							case 2:
								message.aggregationTemporality = 2;
								break;
						}
						if (object.isMonotonic != null)
							message.isMonotonic = Boolean(object.isMonotonic);
						return message;
					};
					Sum.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.dataPoints = [];
						if (options.defaults) {
							object.aggregationTemporality = options.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
							object.isMonotonic = false;
						}
						if (message.dataPoints && message.dataPoints.length) {
							object.dataPoints = [];
							for (var j = 0; j < message.dataPoints.length; ++j)
								object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.NumberDataPoint.toObject(message.dataPoints[j], options);
						}
						if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
							object.aggregationTemporality = options.enums === String ? $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] === undefined ? message.aggregationTemporality : $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] : message.aggregationTemporality;
						if (message.isMonotonic != null && message.hasOwnProperty("isMonotonic"))
							object.isMonotonic = message.isMonotonic;
						return object;
					};
					Sum.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Sum.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.Sum";
					};
					return Sum;
				})();
				v1.Histogram = (function () {
					function Histogram(properties) {
						this.dataPoints = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Histogram.prototype.dataPoints = $util.emptyArray;
					Histogram.prototype.aggregationTemporality = null;
					Histogram.create = function create(properties) {
						return new Histogram(properties);
					};
					Histogram.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.dataPoints != null && message.dataPoints.length)
							for (var i = 0; i < message.dataPoints.length; ++i)
								$root.opentelemetry.proto.metrics.v1.HistogramDataPoint.encode(message.dataPoints[i], writer.uint32( 10).fork()).ldelim();
						if (message.aggregationTemporality != null && Object.hasOwnProperty.call(message, "aggregationTemporality"))
							writer.uint32( 16).int32(message.aggregationTemporality);
						return writer;
					};
					Histogram.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Histogram.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Histogram();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.dataPoints && message.dataPoints.length))
								message.dataPoints = [];
								message.dataPoints.push($root.opentelemetry.proto.metrics.v1.HistogramDataPoint.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.aggregationTemporality = reader.int32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Histogram.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Histogram.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.dataPoints != null && message.hasOwnProperty("dataPoints")) {
							if (!Array.isArray(message.dataPoints))
								return "dataPoints: array expected";
							for (var i = 0; i < message.dataPoints.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.HistogramDataPoint.verify(message.dataPoints[i]);
								if (error)
								return "dataPoints." + error;
							}
						}
						if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
							switch (message.aggregationTemporality) {
								default:
								return "aggregationTemporality: enum value expected";
								case 0:
								case 1:
								case 2:
								break;
							}
						return null;
					};
					Histogram.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.Histogram)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.Histogram();
						if (object.dataPoints) {
							if (!Array.isArray(object.dataPoints))
								throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: array expected");
							message.dataPoints = [];
							for (var i = 0; i < object.dataPoints.length; ++i) {
								if (typeof object.dataPoints[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Histogram.dataPoints: object expected");
								message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.HistogramDataPoint.fromObject(object.dataPoints[i]);
							}
						}
						switch (object.aggregationTemporality) {
							default:
								if (typeof object.aggregationTemporality === "number") {
								message.aggregationTemporality = object.aggregationTemporality;
								break;
								}
								break;
							case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
							case 0:
								message.aggregationTemporality = 0;
								break;
							case "AGGREGATION_TEMPORALITY_DELTA":
							case 1:
								message.aggregationTemporality = 1;
								break;
							case "AGGREGATION_TEMPORALITY_CUMULATIVE":
							case 2:
								message.aggregationTemporality = 2;
								break;
						}
						return message;
					};
					Histogram.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.dataPoints = [];
						if (options.defaults)
							object.aggregationTemporality = options.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
						if (message.dataPoints && message.dataPoints.length) {
							object.dataPoints = [];
							for (var j = 0; j < message.dataPoints.length; ++j)
								object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.HistogramDataPoint.toObject(message.dataPoints[j], options);
						}
						if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
							object.aggregationTemporality = options.enums === String ? $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] === undefined ? message.aggregationTemporality : $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] : message.aggregationTemporality;
						return object;
					};
					Histogram.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Histogram.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.Histogram";
					};
					return Histogram;
				})();
				v1.ExponentialHistogram = (function () {
					function ExponentialHistogram(properties) {
						this.dataPoints = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ExponentialHistogram.prototype.dataPoints = $util.emptyArray;
					ExponentialHistogram.prototype.aggregationTemporality = null;
					ExponentialHistogram.create = function create(properties) {
						return new ExponentialHistogram(properties);
					};
					ExponentialHistogram.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.dataPoints != null && message.dataPoints.length)
							for (var i = 0; i < message.dataPoints.length; ++i)
								$root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.encode(message.dataPoints[i], writer.uint32( 10).fork()).ldelim();
						if (message.aggregationTemporality != null && Object.hasOwnProperty.call(message, "aggregationTemporality"))
							writer.uint32( 16).int32(message.aggregationTemporality);
						return writer;
					};
					ExponentialHistogram.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ExponentialHistogram.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogram();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.dataPoints && message.dataPoints.length))
								message.dataPoints = [];
								message.dataPoints.push($root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.aggregationTemporality = reader.int32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ExponentialHistogram.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ExponentialHistogram.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.dataPoints != null && message.hasOwnProperty("dataPoints")) {
							if (!Array.isArray(message.dataPoints))
								return "dataPoints: array expected";
							for (var i = 0; i < message.dataPoints.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.verify(message.dataPoints[i]);
								if (error)
								return "dataPoints." + error;
							}
						}
						if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
							switch (message.aggregationTemporality) {
								default:
								return "aggregationTemporality: enum value expected";
								case 0:
								case 1:
								case 2:
								break;
							}
						return null;
					};
					ExponentialHistogram.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.ExponentialHistogram)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogram();
						if (object.dataPoints) {
							if (!Array.isArray(object.dataPoints))
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: array expected");
							message.dataPoints = [];
							for (var i = 0; i < object.dataPoints.length; ++i) {
								if (typeof object.dataPoints[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogram.dataPoints: object expected");
								message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.fromObject(object.dataPoints[i]);
							}
						}
						switch (object.aggregationTemporality) {
							default:
								if (typeof object.aggregationTemporality === "number") {
								message.aggregationTemporality = object.aggregationTemporality;
								break;
								}
								break;
							case "AGGREGATION_TEMPORALITY_UNSPECIFIED":
							case 0:
								message.aggregationTemporality = 0;
								break;
							case "AGGREGATION_TEMPORALITY_DELTA":
							case 1:
								message.aggregationTemporality = 1;
								break;
							case "AGGREGATION_TEMPORALITY_CUMULATIVE":
							case 2:
								message.aggregationTemporality = 2;
								break;
						}
						return message;
					};
					ExponentialHistogram.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.dataPoints = [];
						if (options.defaults)
							object.aggregationTemporality = options.enums === String ? "AGGREGATION_TEMPORALITY_UNSPECIFIED" : 0;
						if (message.dataPoints && message.dataPoints.length) {
							object.dataPoints = [];
							for (var j = 0; j < message.dataPoints.length; ++j)
								object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.toObject(message.dataPoints[j], options);
						}
						if (message.aggregationTemporality != null && message.hasOwnProperty("aggregationTemporality"))
							object.aggregationTemporality = options.enums === String ? $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] === undefined ? message.aggregationTemporality : $root.opentelemetry.proto.metrics.v1.AggregationTemporality[message.aggregationTemporality] : message.aggregationTemporality;
						return object;
					};
					ExponentialHistogram.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ExponentialHistogram.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.ExponentialHistogram";
					};
					return ExponentialHistogram;
				})();
				v1.Summary = (function () {
					function Summary(properties) {
						this.dataPoints = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Summary.prototype.dataPoints = $util.emptyArray;
					Summary.create = function create(properties) {
						return new Summary(properties);
					};
					Summary.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.dataPoints != null && message.dataPoints.length)
							for (var i = 0; i < message.dataPoints.length; ++i)
								$root.opentelemetry.proto.metrics.v1.SummaryDataPoint.encode(message.dataPoints[i], writer.uint32( 10).fork()).ldelim();
						return writer;
					};
					Summary.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Summary.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Summary();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.dataPoints && message.dataPoints.length))
								message.dataPoints = [];
								message.dataPoints.push($root.opentelemetry.proto.metrics.v1.SummaryDataPoint.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Summary.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Summary.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.dataPoints != null && message.hasOwnProperty("dataPoints")) {
							if (!Array.isArray(message.dataPoints))
								return "dataPoints: array expected";
							for (var i = 0; i < message.dataPoints.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.verify(message.dataPoints[i]);
								if (error)
								return "dataPoints." + error;
							}
						}
						return null;
					};
					Summary.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.Summary)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.Summary();
						if (object.dataPoints) {
							if (!Array.isArray(object.dataPoints))
								throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: array expected");
							message.dataPoints = [];
							for (var i = 0; i < object.dataPoints.length; ++i) {
								if (typeof object.dataPoints[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Summary.dataPoints: object expected");
								message.dataPoints[i] = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.fromObject(object.dataPoints[i]);
							}
						}
						return message;
					};
					Summary.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.dataPoints = [];
						if (message.dataPoints && message.dataPoints.length) {
							object.dataPoints = [];
							for (var j = 0; j < message.dataPoints.length; ++j)
								object.dataPoints[j] = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.toObject(message.dataPoints[j], options);
						}
						return object;
					};
					Summary.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Summary.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.Summary";
					};
					return Summary;
				})();
				v1.AggregationTemporality = (function () {
					var valuesById = {}, values = Object.create(valuesById);
					values[valuesById[0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0;
					values[valuesById[1] = "AGGREGATION_TEMPORALITY_DELTA"] = 1;
					values[valuesById[2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2;
					return values;
				})();
				v1.DataPointFlags = (function () {
					var valuesById = {}, values = Object.create(valuesById);
					values[valuesById[0] = "DATA_POINT_FLAGS_DO_NOT_USE"] = 0;
					values[valuesById[1] = "DATA_POINT_FLAGS_NO_RECORDED_VALUE_MASK"] = 1;
					return values;
				})();
				v1.NumberDataPoint = (function () {
					function NumberDataPoint(properties) {
						this.attributes = [];
						this.exemplars = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					NumberDataPoint.prototype.attributes = $util.emptyArray;
					NumberDataPoint.prototype.startTimeUnixNano = null;
					NumberDataPoint.prototype.timeUnixNano = null;
					NumberDataPoint.prototype.asDouble = null;
					NumberDataPoint.prototype.asInt = null;
					NumberDataPoint.prototype.exemplars = $util.emptyArray;
					NumberDataPoint.prototype.flags = null;
					var $oneOfFields;
					Object.defineProperty(NumberDataPoint.prototype, "value", {
						get: $util.oneOfGetter($oneOfFields = ["asDouble", "asInt"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					NumberDataPoint.create = function create(properties) {
						return new NumberDataPoint(properties);
					};
					NumberDataPoint.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.startTimeUnixNano != null && Object.hasOwnProperty.call(message, "startTimeUnixNano"))
							writer.uint32( 17).fixed64(message.startTimeUnixNano);
						if (message.timeUnixNano != null && Object.hasOwnProperty.call(message, "timeUnixNano"))
							writer.uint32( 25).fixed64(message.timeUnixNano);
						if (message.asDouble != null && Object.hasOwnProperty.call(message, "asDouble"))
							writer.uint32( 33).double(message.asDouble);
						if (message.exemplars != null && message.exemplars.length)
							for (var i = 0; i < message.exemplars.length; ++i)
								$root.opentelemetry.proto.metrics.v1.Exemplar.encode(message.exemplars[i], writer.uint32( 42).fork()).ldelim();
						if (message.asInt != null && Object.hasOwnProperty.call(message, "asInt"))
							writer.uint32( 49).sfixed64(message.asInt);
						if (message.attributes != null && message.attributes.length)
							for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 58).fork()).ldelim();
						if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
							writer.uint32( 64).uint32(message.flags);
						return writer;
					};
					NumberDataPoint.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					NumberDataPoint.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.NumberDataPoint();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 7: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.startTimeUnixNano = reader.fixed64();
								break;
								}
								case 3: {
								message.timeUnixNano = reader.fixed64();
								break;
								}
								case 4: {
								message.asDouble = reader.double();
								break;
								}
								case 6: {
								message.asInt = reader.sfixed64();
								break;
								}
								case 5: {
								if (!(message.exemplars && message.exemplars.length))
								message.exemplars = [];
								message.exemplars.push($root.opentelemetry.proto.metrics.v1.Exemplar.decode(reader, reader.uint32()));
								break;
								}
								case 8: {
								message.flags = reader.uint32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					NumberDataPoint.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					NumberDataPoint.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						var properties = {};
						if (message.attributes != null && message.hasOwnProperty("attributes")) {
							if (!Array.isArray(message.attributes))
								return "attributes: array expected";
							for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
							}
						}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (!$util.isInteger(message.startTimeUnixNano) && !(message.startTimeUnixNano && $util.isInteger(message.startTimeUnixNano.low) && $util.isInteger(message.startTimeUnixNano.high)))
								return "startTimeUnixNano: integer|Long expected";
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (!$util.isInteger(message.timeUnixNano) && !(message.timeUnixNano && $util.isInteger(message.timeUnixNano.low) && $util.isInteger(message.timeUnixNano.high)))
								return "timeUnixNano: integer|Long expected";
						if (message.asDouble != null && message.hasOwnProperty("asDouble")) {
							properties.value = 1;
							if (typeof message.asDouble !== "number")
								return "asDouble: number expected";
						}
						if (message.asInt != null && message.hasOwnProperty("asInt")) {
							if (properties.value === 1)
								return "value: multiple values";
							properties.value = 1;
							if (!$util.isInteger(message.asInt) && !(message.asInt && $util.isInteger(message.asInt.low) && $util.isInteger(message.asInt.high)))
								return "asInt: integer|Long expected";
						}
						if (message.exemplars != null && message.hasOwnProperty("exemplars")) {
							if (!Array.isArray(message.exemplars))
								return "exemplars: array expected";
							for (var i = 0; i < message.exemplars.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.Exemplar.verify(message.exemplars[i]);
								if (error)
								return "exemplars." + error;
							}
						}
						if (message.flags != null && message.hasOwnProperty("flags"))
							if (!$util.isInteger(message.flags))
								return "flags: integer expected";
						return null;
					};
					NumberDataPoint.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.NumberDataPoint)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.NumberDataPoint();
						if (object.attributes) {
							if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: array expected");
							message.attributes = [];
							for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
							}
						}
						if (object.startTimeUnixNano != null)
							if ($util.Long)
								(message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
							else if (typeof object.startTimeUnixNano === "string")
								message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
							else if (typeof object.startTimeUnixNano === "number")
								message.startTimeUnixNano = object.startTimeUnixNano;
							else if (typeof object.startTimeUnixNano === "object")
								message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
						if (object.timeUnixNano != null)
							if ($util.Long)
								(message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
							else if (typeof object.timeUnixNano === "string")
								message.timeUnixNano = parseInt(object.timeUnixNano, 10);
							else if (typeof object.timeUnixNano === "number")
								message.timeUnixNano = object.timeUnixNano;
							else if (typeof object.timeUnixNano === "object")
								message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
						if (object.asDouble != null)
							message.asDouble = Number(object.asDouble);
						if (object.asInt != null)
							if ($util.Long)
								(message.asInt = $util.Long.fromValue(object.asInt)).unsigned = false;
							else if (typeof object.asInt === "string")
								message.asInt = parseInt(object.asInt, 10);
							else if (typeof object.asInt === "number")
								message.asInt = object.asInt;
							else if (typeof object.asInt === "object")
								message.asInt = new $util.LongBits(object.asInt.low >>> 0, object.asInt.high >>> 0).toNumber();
						if (object.exemplars) {
							if (!Array.isArray(object.exemplars))
								throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: array expected");
							message.exemplars = [];
							for (var i = 0; i < object.exemplars.length; ++i) {
								if (typeof object.exemplars[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.NumberDataPoint.exemplars: object expected");
								message.exemplars[i] = $root.opentelemetry.proto.metrics.v1.Exemplar.fromObject(object.exemplars[i]);
							}
						}
						if (object.flags != null)
							message.flags = object.flags >>> 0;
						return message;
					};
					NumberDataPoint.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults) {
							object.exemplars = [];
							object.attributes = [];
						}
						if (options.defaults) {
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.startTimeUnixNano = options.longs === String ? "0" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.timeUnixNano = options.longs === String ? "0" : 0;
							object.flags = 0;
						}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (typeof message.startTimeUnixNano === "number")
								object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
							else
								object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (typeof message.timeUnixNano === "number")
								object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
							else
								object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
						if (message.asDouble != null && message.hasOwnProperty("asDouble")) {
							object.asDouble = options.json && !isFinite(message.asDouble) ? String(message.asDouble) : message.asDouble;
							if (options.oneofs)
								object.value = "asDouble";
						}
						if (message.exemplars && message.exemplars.length) {
							object.exemplars = [];
							for (var j = 0; j < message.exemplars.length; ++j)
								object.exemplars[j] = $root.opentelemetry.proto.metrics.v1.Exemplar.toObject(message.exemplars[j], options);
						}
						if (message.asInt != null && message.hasOwnProperty("asInt")) {
							if (typeof message.asInt === "number")
								object.asInt = options.longs === String ? String(message.asInt) : message.asInt;
							else
								object.asInt = options.longs === String ? $util.Long.prototype.toString.call(message.asInt) : options.longs === Number ? new $util.LongBits(message.asInt.low >>> 0, message.asInt.high >>> 0).toNumber() : message.asInt;
							if (options.oneofs)
								object.value = "asInt";
						}
						if (message.attributes && message.attributes.length) {
							object.attributes = [];
							for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
						}
						if (message.flags != null && message.hasOwnProperty("flags"))
							object.flags = message.flags;
						return object;
					};
					NumberDataPoint.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					NumberDataPoint.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.NumberDataPoint";
					};
					return NumberDataPoint;
				})();
				v1.HistogramDataPoint = (function () {
					function HistogramDataPoint(properties) {
						this.attributes = [];
						this.bucketCounts = [];
						this.explicitBounds = [];
						this.exemplars = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					HistogramDataPoint.prototype.attributes = $util.emptyArray;
					HistogramDataPoint.prototype.startTimeUnixNano = null;
					HistogramDataPoint.prototype.timeUnixNano = null;
					HistogramDataPoint.prototype.count = null;
					HistogramDataPoint.prototype.sum = null;
					HistogramDataPoint.prototype.bucketCounts = $util.emptyArray;
					HistogramDataPoint.prototype.explicitBounds = $util.emptyArray;
					HistogramDataPoint.prototype.exemplars = $util.emptyArray;
					HistogramDataPoint.prototype.flags = null;
					HistogramDataPoint.prototype.min = null;
					HistogramDataPoint.prototype.max = null;
					var $oneOfFields;
					Object.defineProperty(HistogramDataPoint.prototype, "_sum", {
						get: $util.oneOfGetter($oneOfFields = ["sum"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					Object.defineProperty(HistogramDataPoint.prototype, "_min", {
						get: $util.oneOfGetter($oneOfFields = ["min"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					Object.defineProperty(HistogramDataPoint.prototype, "_max", {
						get: $util.oneOfGetter($oneOfFields = ["max"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					HistogramDataPoint.create = function create(properties) {
						return new HistogramDataPoint(properties);
					};
					HistogramDataPoint.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.startTimeUnixNano != null && Object.hasOwnProperty.call(message, "startTimeUnixNano"))
							writer.uint32( 17).fixed64(message.startTimeUnixNano);
						if (message.timeUnixNano != null && Object.hasOwnProperty.call(message, "timeUnixNano"))
							writer.uint32( 25).fixed64(message.timeUnixNano);
						if (message.count != null && Object.hasOwnProperty.call(message, "count"))
							writer.uint32( 33).fixed64(message.count);
						if (message.sum != null && Object.hasOwnProperty.call(message, "sum"))
							writer.uint32( 41).double(message.sum);
						if (message.bucketCounts != null && message.bucketCounts.length) {
							writer.uint32( 50).fork();
							for (var i = 0; i < message.bucketCounts.length; ++i)
								writer.fixed64(message.bucketCounts[i]);
							writer.ldelim();
						}
						if (message.explicitBounds != null && message.explicitBounds.length) {
							writer.uint32( 58).fork();
							for (var i = 0; i < message.explicitBounds.length; ++i)
								writer.double(message.explicitBounds[i]);
							writer.ldelim();
						}
						if (message.exemplars != null && message.exemplars.length)
							for (var i = 0; i < message.exemplars.length; ++i)
								$root.opentelemetry.proto.metrics.v1.Exemplar.encode(message.exemplars[i], writer.uint32( 66).fork()).ldelim();
						if (message.attributes != null && message.attributes.length)
							for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 74).fork()).ldelim();
						if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
							writer.uint32( 80).uint32(message.flags);
						if (message.min != null && Object.hasOwnProperty.call(message, "min"))
							writer.uint32( 89).double(message.min);
						if (message.max != null && Object.hasOwnProperty.call(message, "max"))
							writer.uint32( 97).double(message.max);
						return writer;
					};
					HistogramDataPoint.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					HistogramDataPoint.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.HistogramDataPoint();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 9: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.startTimeUnixNano = reader.fixed64();
								break;
								}
								case 3: {
								message.timeUnixNano = reader.fixed64();
								break;
								}
								case 4: {
								message.count = reader.fixed64();
								break;
								}
								case 5: {
								message.sum = reader.double();
								break;
								}
								case 6: {
								if (!(message.bucketCounts && message.bucketCounts.length))
								message.bucketCounts = [];
								if ((tag & 7) === 2) {
								var end2 = reader.uint32() + reader.pos;
								while (reader.pos < end2)
								message.bucketCounts.push(reader.fixed64());
								}
								else
								message.bucketCounts.push(reader.fixed64());
								break;
								}
								case 7: {
								if (!(message.explicitBounds && message.explicitBounds.length))
								message.explicitBounds = [];
								if ((tag & 7) === 2) {
								var end2 = reader.uint32() + reader.pos;
								while (reader.pos < end2)
								message.explicitBounds.push(reader.double());
								}
								else
								message.explicitBounds.push(reader.double());
								break;
								}
								case 8: {
								if (!(message.exemplars && message.exemplars.length))
								message.exemplars = [];
								message.exemplars.push($root.opentelemetry.proto.metrics.v1.Exemplar.decode(reader, reader.uint32()));
								break;
								}
								case 10: {
								message.flags = reader.uint32();
								break;
								}
								case 11: {
								message.min = reader.double();
								break;
								}
								case 12: {
								message.max = reader.double();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					HistogramDataPoint.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					HistogramDataPoint.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.attributes != null && message.hasOwnProperty("attributes")) {
							if (!Array.isArray(message.attributes))
								return "attributes: array expected";
							for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
							}
						}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (!$util.isInteger(message.startTimeUnixNano) && !(message.startTimeUnixNano && $util.isInteger(message.startTimeUnixNano.low) && $util.isInteger(message.startTimeUnixNano.high)))
								return "startTimeUnixNano: integer|Long expected";
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (!$util.isInteger(message.timeUnixNano) && !(message.timeUnixNano && $util.isInteger(message.timeUnixNano.low) && $util.isInteger(message.timeUnixNano.high)))
								return "timeUnixNano: integer|Long expected";
						if (message.count != null && message.hasOwnProperty("count"))
							if (!$util.isInteger(message.count) && !(message.count && $util.isInteger(message.count.low) && $util.isInteger(message.count.high)))
								return "count: integer|Long expected";
						if (message.sum != null && message.hasOwnProperty("sum")) {
							if (typeof message.sum !== "number")
								return "sum: number expected";
						}
						if (message.bucketCounts != null && message.hasOwnProperty("bucketCounts")) {
							if (!Array.isArray(message.bucketCounts))
								return "bucketCounts: array expected";
							for (var i = 0; i < message.bucketCounts.length; ++i)
								if (!$util.isInteger(message.bucketCounts[i]) && !(message.bucketCounts[i] && $util.isInteger(message.bucketCounts[i].low) && $util.isInteger(message.bucketCounts[i].high)))
								return "bucketCounts: integer|Long[] expected";
						}
						if (message.explicitBounds != null && message.hasOwnProperty("explicitBounds")) {
							if (!Array.isArray(message.explicitBounds))
								return "explicitBounds: array expected";
							for (var i = 0; i < message.explicitBounds.length; ++i)
								if (typeof message.explicitBounds[i] !== "number")
								return "explicitBounds: number[] expected";
						}
						if (message.exemplars != null && message.hasOwnProperty("exemplars")) {
							if (!Array.isArray(message.exemplars))
								return "exemplars: array expected";
							for (var i = 0; i < message.exemplars.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.Exemplar.verify(message.exemplars[i]);
								if (error)
								return "exemplars." + error;
							}
						}
						if (message.flags != null && message.hasOwnProperty("flags"))
							if (!$util.isInteger(message.flags))
								return "flags: integer expected";
						if (message.min != null && message.hasOwnProperty("min")) {
							if (typeof message.min !== "number")
								return "min: number expected";
						}
						if (message.max != null && message.hasOwnProperty("max")) {
							if (typeof message.max !== "number")
								return "max: number expected";
						}
						return null;
					};
					HistogramDataPoint.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.HistogramDataPoint)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.HistogramDataPoint();
						if (object.attributes) {
							if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: array expected");
							message.attributes = [];
							for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
							}
						}
						if (object.startTimeUnixNano != null)
							if ($util.Long)
								(message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
							else if (typeof object.startTimeUnixNano === "string")
								message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
							else if (typeof object.startTimeUnixNano === "number")
								message.startTimeUnixNano = object.startTimeUnixNano;
							else if (typeof object.startTimeUnixNano === "object")
								message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
						if (object.timeUnixNano != null)
							if ($util.Long)
								(message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
							else if (typeof object.timeUnixNano === "string")
								message.timeUnixNano = parseInt(object.timeUnixNano, 10);
							else if (typeof object.timeUnixNano === "number")
								message.timeUnixNano = object.timeUnixNano;
							else if (typeof object.timeUnixNano === "object")
								message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
						if (object.count != null)
							if ($util.Long)
								(message.count = $util.Long.fromValue(object.count)).unsigned = false;
							else if (typeof object.count === "string")
								message.count = parseInt(object.count, 10);
							else if (typeof object.count === "number")
								message.count = object.count;
							else if (typeof object.count === "object")
								message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber();
						if (object.sum != null)
							message.sum = Number(object.sum);
						if (object.bucketCounts) {
							if (!Array.isArray(object.bucketCounts))
								throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.bucketCounts: array expected");
							message.bucketCounts = [];
							for (var i = 0; i < object.bucketCounts.length; ++i)
								if ($util.Long)
								(message.bucketCounts[i] = $util.Long.fromValue(object.bucketCounts[i])).unsigned = false;
								else if (typeof object.bucketCounts[i] === "string")
								message.bucketCounts[i] = parseInt(object.bucketCounts[i], 10);
								else if (typeof object.bucketCounts[i] === "number")
								message.bucketCounts[i] = object.bucketCounts[i];
								else if (typeof object.bucketCounts[i] === "object")
								message.bucketCounts[i] = new $util.LongBits(object.bucketCounts[i].low >>> 0, object.bucketCounts[i].high >>> 0).toNumber();
						}
						if (object.explicitBounds) {
							if (!Array.isArray(object.explicitBounds))
								throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.explicitBounds: array expected");
							message.explicitBounds = [];
							for (var i = 0; i < object.explicitBounds.length; ++i)
								message.explicitBounds[i] = Number(object.explicitBounds[i]);
						}
						if (object.exemplars) {
							if (!Array.isArray(object.exemplars))
								throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: array expected");
							message.exemplars = [];
							for (var i = 0; i < object.exemplars.length; ++i) {
								if (typeof object.exemplars[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.HistogramDataPoint.exemplars: object expected");
								message.exemplars[i] = $root.opentelemetry.proto.metrics.v1.Exemplar.fromObject(object.exemplars[i]);
							}
						}
						if (object.flags != null)
							message.flags = object.flags >>> 0;
						if (object.min != null)
							message.min = Number(object.min);
						if (object.max != null)
							message.max = Number(object.max);
						return message;
					};
					HistogramDataPoint.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults) {
							object.bucketCounts = [];
							object.explicitBounds = [];
							object.exemplars = [];
							object.attributes = [];
						}
						if (options.defaults) {
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.startTimeUnixNano = options.longs === String ? "0" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.timeUnixNano = options.longs === String ? "0" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.count = options.longs === String ? "0" : 0;
							object.flags = 0;
						}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (typeof message.startTimeUnixNano === "number")
								object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
							else
								object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (typeof message.timeUnixNano === "number")
								object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
							else
								object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
						if (message.count != null && message.hasOwnProperty("count"))
							if (typeof message.count === "number")
								object.count = options.longs === String ? String(message.count) : message.count;
							else
								object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber() : message.count;
						if (message.sum != null && message.hasOwnProperty("sum")) {
							object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
							if (options.oneofs)
								object._sum = "sum";
						}
						if (message.bucketCounts && message.bucketCounts.length) {
							object.bucketCounts = [];
							for (var j = 0; j < message.bucketCounts.length; ++j)
								if (typeof message.bucketCounts[j] === "number")
								object.bucketCounts[j] = options.longs === String ? String(message.bucketCounts[j]) : message.bucketCounts[j];
								else
								object.bucketCounts[j] = options.longs === String ? $util.Long.prototype.toString.call(message.bucketCounts[j]) : options.longs === Number ? new $util.LongBits(message.bucketCounts[j].low >>> 0, message.bucketCounts[j].high >>> 0).toNumber() : message.bucketCounts[j];
						}
						if (message.explicitBounds && message.explicitBounds.length) {
							object.explicitBounds = [];
							for (var j = 0; j < message.explicitBounds.length; ++j)
								object.explicitBounds[j] = options.json && !isFinite(message.explicitBounds[j]) ? String(message.explicitBounds[j]) : message.explicitBounds[j];
						}
						if (message.exemplars && message.exemplars.length) {
							object.exemplars = [];
							for (var j = 0; j < message.exemplars.length; ++j)
								object.exemplars[j] = $root.opentelemetry.proto.metrics.v1.Exemplar.toObject(message.exemplars[j], options);
						}
						if (message.attributes && message.attributes.length) {
							object.attributes = [];
							for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
						}
						if (message.flags != null && message.hasOwnProperty("flags"))
							object.flags = message.flags;
						if (message.min != null && message.hasOwnProperty("min")) {
							object.min = options.json && !isFinite(message.min) ? String(message.min) : message.min;
							if (options.oneofs)
								object._min = "min";
						}
						if (message.max != null && message.hasOwnProperty("max")) {
							object.max = options.json && !isFinite(message.max) ? String(message.max) : message.max;
							if (options.oneofs)
								object._max = "max";
						}
						return object;
					};
					HistogramDataPoint.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					HistogramDataPoint.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.HistogramDataPoint";
					};
					return HistogramDataPoint;
				})();
				v1.ExponentialHistogramDataPoint = (function () {
					function ExponentialHistogramDataPoint(properties) {
						this.attributes = [];
						this.exemplars = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ExponentialHistogramDataPoint.prototype.attributes = $util.emptyArray;
					ExponentialHistogramDataPoint.prototype.startTimeUnixNano = null;
					ExponentialHistogramDataPoint.prototype.timeUnixNano = null;
					ExponentialHistogramDataPoint.prototype.count = null;
					ExponentialHistogramDataPoint.prototype.sum = null;
					ExponentialHistogramDataPoint.prototype.scale = null;
					ExponentialHistogramDataPoint.prototype.zeroCount = null;
					ExponentialHistogramDataPoint.prototype.positive = null;
					ExponentialHistogramDataPoint.prototype.negative = null;
					ExponentialHistogramDataPoint.prototype.flags = null;
					ExponentialHistogramDataPoint.prototype.exemplars = $util.emptyArray;
					ExponentialHistogramDataPoint.prototype.min = null;
					ExponentialHistogramDataPoint.prototype.max = null;
					ExponentialHistogramDataPoint.prototype.zeroThreshold = null;
					var $oneOfFields;
					Object.defineProperty(ExponentialHistogramDataPoint.prototype, "_sum", {
						get: $util.oneOfGetter($oneOfFields = ["sum"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					Object.defineProperty(ExponentialHistogramDataPoint.prototype, "_min", {
						get: $util.oneOfGetter($oneOfFields = ["min"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					Object.defineProperty(ExponentialHistogramDataPoint.prototype, "_max", {
						get: $util.oneOfGetter($oneOfFields = ["max"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					ExponentialHistogramDataPoint.create = function create(properties) {
						return new ExponentialHistogramDataPoint(properties);
					};
					ExponentialHistogramDataPoint.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.attributes != null && message.attributes.length)
							for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 10).fork()).ldelim();
						if (message.startTimeUnixNano != null && Object.hasOwnProperty.call(message, "startTimeUnixNano"))
							writer.uint32( 17).fixed64(message.startTimeUnixNano);
						if (message.timeUnixNano != null && Object.hasOwnProperty.call(message, "timeUnixNano"))
							writer.uint32( 25).fixed64(message.timeUnixNano);
						if (message.count != null && Object.hasOwnProperty.call(message, "count"))
							writer.uint32( 33).fixed64(message.count);
						if (message.sum != null && Object.hasOwnProperty.call(message, "sum"))
							writer.uint32( 41).double(message.sum);
						if (message.scale != null && Object.hasOwnProperty.call(message, "scale"))
							writer.uint32( 48).sint32(message.scale);
						if (message.zeroCount != null && Object.hasOwnProperty.call(message, "zeroCount"))
							writer.uint32( 57).fixed64(message.zeroCount);
						if (message.positive != null && Object.hasOwnProperty.call(message, "positive"))
							$root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(message.positive, writer.uint32( 66).fork()).ldelim();
						if (message.negative != null && Object.hasOwnProperty.call(message, "negative"))
							$root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.encode(message.negative, writer.uint32( 74).fork()).ldelim();
						if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
							writer.uint32( 80).uint32(message.flags);
						if (message.exemplars != null && message.exemplars.length)
							for (var i = 0; i < message.exemplars.length; ++i)
								$root.opentelemetry.proto.metrics.v1.Exemplar.encode(message.exemplars[i], writer.uint32( 90).fork()).ldelim();
						if (message.min != null && Object.hasOwnProperty.call(message, "min"))
							writer.uint32( 97).double(message.min);
						if (message.max != null && Object.hasOwnProperty.call(message, "max"))
							writer.uint32( 105).double(message.max);
						if (message.zeroThreshold != null && Object.hasOwnProperty.call(message, "zeroThreshold"))
							writer.uint32( 113).double(message.zeroThreshold);
						return writer;
					};
					ExponentialHistogramDataPoint.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ExponentialHistogramDataPoint.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.startTimeUnixNano = reader.fixed64();
								break;
								}
								case 3: {
								message.timeUnixNano = reader.fixed64();
								break;
								}
								case 4: {
								message.count = reader.fixed64();
								break;
								}
								case 5: {
								message.sum = reader.double();
								break;
								}
								case 6: {
								message.scale = reader.sint32();
								break;
								}
								case 7: {
								message.zeroCount = reader.fixed64();
								break;
								}
								case 8: {
								message.positive = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(reader, reader.uint32());
								break;
								}
								case 9: {
								message.negative = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.decode(reader, reader.uint32());
								break;
								}
								case 10: {
								message.flags = reader.uint32();
								break;
								}
								case 11: {
								if (!(message.exemplars && message.exemplars.length))
								message.exemplars = [];
								message.exemplars.push($root.opentelemetry.proto.metrics.v1.Exemplar.decode(reader, reader.uint32()));
								break;
								}
								case 12: {
								message.min = reader.double();
								break;
								}
								case 13: {
								message.max = reader.double();
								break;
								}
								case 14: {
								message.zeroThreshold = reader.double();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ExponentialHistogramDataPoint.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ExponentialHistogramDataPoint.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.attributes != null && message.hasOwnProperty("attributes")) {
							if (!Array.isArray(message.attributes))
								return "attributes: array expected";
							for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
							}
						}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (!$util.isInteger(message.startTimeUnixNano) && !(message.startTimeUnixNano && $util.isInteger(message.startTimeUnixNano.low) && $util.isInteger(message.startTimeUnixNano.high)))
								return "startTimeUnixNano: integer|Long expected";
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (!$util.isInteger(message.timeUnixNano) && !(message.timeUnixNano && $util.isInteger(message.timeUnixNano.low) && $util.isInteger(message.timeUnixNano.high)))
								return "timeUnixNano: integer|Long expected";
						if (message.count != null && message.hasOwnProperty("count"))
							if (!$util.isInteger(message.count) && !(message.count && $util.isInteger(message.count.low) && $util.isInteger(message.count.high)))
								return "count: integer|Long expected";
						if (message.sum != null && message.hasOwnProperty("sum")) {
							if (typeof message.sum !== "number")
								return "sum: number expected";
						}
						if (message.scale != null && message.hasOwnProperty("scale"))
							if (!$util.isInteger(message.scale))
								return "scale: integer expected";
						if (message.zeroCount != null && message.hasOwnProperty("zeroCount"))
							if (!$util.isInteger(message.zeroCount) && !(message.zeroCount && $util.isInteger(message.zeroCount.low) && $util.isInteger(message.zeroCount.high)))
								return "zeroCount: integer|Long expected";
						if (message.positive != null && message.hasOwnProperty("positive")) {
							var error = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(message.positive);
							if (error)
								return "positive." + error;
						}
						if (message.negative != null && message.hasOwnProperty("negative")) {
							var error = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.verify(message.negative);
							if (error)
								return "negative." + error;
						}
						if (message.flags != null && message.hasOwnProperty("flags"))
							if (!$util.isInteger(message.flags))
								return "flags: integer expected";
						if (message.exemplars != null && message.hasOwnProperty("exemplars")) {
							if (!Array.isArray(message.exemplars))
								return "exemplars: array expected";
							for (var i = 0; i < message.exemplars.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.Exemplar.verify(message.exemplars[i]);
								if (error)
								return "exemplars." + error;
							}
						}
						if (message.min != null && message.hasOwnProperty("min")) {
							if (typeof message.min !== "number")
								return "min: number expected";
						}
						if (message.max != null && message.hasOwnProperty("max")) {
							if (typeof message.max !== "number")
								return "max: number expected";
						}
						if (message.zeroThreshold != null && message.hasOwnProperty("zeroThreshold"))
							if (typeof message.zeroThreshold !== "number")
								return "zeroThreshold: number expected";
						return null;
					};
					ExponentialHistogramDataPoint.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint();
						if (object.attributes) {
							if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: array expected");
							message.attributes = [];
							for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
							}
						}
						if (object.startTimeUnixNano != null)
							if ($util.Long)
								(message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
							else if (typeof object.startTimeUnixNano === "string")
								message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
							else if (typeof object.startTimeUnixNano === "number")
								message.startTimeUnixNano = object.startTimeUnixNano;
							else if (typeof object.startTimeUnixNano === "object")
								message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
						if (object.timeUnixNano != null)
							if ($util.Long)
								(message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
							else if (typeof object.timeUnixNano === "string")
								message.timeUnixNano = parseInt(object.timeUnixNano, 10);
							else if (typeof object.timeUnixNano === "number")
								message.timeUnixNano = object.timeUnixNano;
							else if (typeof object.timeUnixNano === "object")
								message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
						if (object.count != null)
							if ($util.Long)
								(message.count = $util.Long.fromValue(object.count)).unsigned = false;
							else if (typeof object.count === "string")
								message.count = parseInt(object.count, 10);
							else if (typeof object.count === "number")
								message.count = object.count;
							else if (typeof object.count === "object")
								message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber();
						if (object.sum != null)
							message.sum = Number(object.sum);
						if (object.scale != null)
							message.scale = object.scale | 0;
						if (object.zeroCount != null)
							if ($util.Long)
								(message.zeroCount = $util.Long.fromValue(object.zeroCount)).unsigned = false;
							else if (typeof object.zeroCount === "string")
								message.zeroCount = parseInt(object.zeroCount, 10);
							else if (typeof object.zeroCount === "number")
								message.zeroCount = object.zeroCount;
							else if (typeof object.zeroCount === "object")
								message.zeroCount = new $util.LongBits(object.zeroCount.low >>> 0, object.zeroCount.high >>> 0).toNumber();
						if (object.positive != null) {
							if (typeof object.positive !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.positive: object expected");
							message.positive = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(object.positive);
						}
						if (object.negative != null) {
							if (typeof object.negative !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.negative: object expected");
							message.negative = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.fromObject(object.negative);
						}
						if (object.flags != null)
							message.flags = object.flags >>> 0;
						if (object.exemplars) {
							if (!Array.isArray(object.exemplars))
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: array expected");
							message.exemplars = [];
							for (var i = 0; i < object.exemplars.length; ++i) {
								if (typeof object.exemplars[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.exemplars: object expected");
								message.exemplars[i] = $root.opentelemetry.proto.metrics.v1.Exemplar.fromObject(object.exemplars[i]);
							}
						}
						if (object.min != null)
							message.min = Number(object.min);
						if (object.max != null)
							message.max = Number(object.max);
						if (object.zeroThreshold != null)
							message.zeroThreshold = Number(object.zeroThreshold);
						return message;
					};
					ExponentialHistogramDataPoint.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults) {
							object.attributes = [];
							object.exemplars = [];
						}
						if (options.defaults) {
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.startTimeUnixNano = options.longs === String ? "0" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.timeUnixNano = options.longs === String ? "0" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.count = options.longs === String ? "0" : 0;
							object.scale = 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.zeroCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.zeroCount = options.longs === String ? "0" : 0;
							object.positive = null;
							object.negative = null;
							object.flags = 0;
							object.zeroThreshold = 0;
						}
						if (message.attributes && message.attributes.length) {
							object.attributes = [];
							for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
						}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (typeof message.startTimeUnixNano === "number")
								object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
							else
								object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (typeof message.timeUnixNano === "number")
								object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
							else
								object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
						if (message.count != null && message.hasOwnProperty("count"))
							if (typeof message.count === "number")
								object.count = options.longs === String ? String(message.count) : message.count;
							else
								object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber() : message.count;
						if (message.sum != null && message.hasOwnProperty("sum")) {
							object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
							if (options.oneofs)
								object._sum = "sum";
						}
						if (message.scale != null && message.hasOwnProperty("scale"))
							object.scale = message.scale;
						if (message.zeroCount != null && message.hasOwnProperty("zeroCount"))
							if (typeof message.zeroCount === "number")
								object.zeroCount = options.longs === String ? String(message.zeroCount) : message.zeroCount;
							else
								object.zeroCount = options.longs === String ? $util.Long.prototype.toString.call(message.zeroCount) : options.longs === Number ? new $util.LongBits(message.zeroCount.low >>> 0, message.zeroCount.high >>> 0).toNumber() : message.zeroCount;
						if (message.positive != null && message.hasOwnProperty("positive"))
							object.positive = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(message.positive, options);
						if (message.negative != null && message.hasOwnProperty("negative"))
							object.negative = $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.toObject(message.negative, options);
						if (message.flags != null && message.hasOwnProperty("flags"))
							object.flags = message.flags;
						if (message.exemplars && message.exemplars.length) {
							object.exemplars = [];
							for (var j = 0; j < message.exemplars.length; ++j)
								object.exemplars[j] = $root.opentelemetry.proto.metrics.v1.Exemplar.toObject(message.exemplars[j], options);
						}
						if (message.min != null && message.hasOwnProperty("min")) {
							object.min = options.json && !isFinite(message.min) ? String(message.min) : message.min;
							if (options.oneofs)
								object._min = "min";
						}
						if (message.max != null && message.hasOwnProperty("max")) {
							object.max = options.json && !isFinite(message.max) ? String(message.max) : message.max;
							if (options.oneofs)
								object._max = "max";
						}
						if (message.zeroThreshold != null && message.hasOwnProperty("zeroThreshold"))
							object.zeroThreshold = options.json && !isFinite(message.zeroThreshold) ? String(message.zeroThreshold) : message.zeroThreshold;
						return object;
					};
					ExponentialHistogramDataPoint.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ExponentialHistogramDataPoint.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint";
					};
					ExponentialHistogramDataPoint.Buckets = (function () {
						function Buckets(properties) {
							this.bucketCounts = [];
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						Buckets.prototype.offset = null;
						Buckets.prototype.bucketCounts = $util.emptyArray;
						Buckets.create = function create(properties) {
							return new Buckets(properties);
						};
						Buckets.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
								writer.uint32( 8).sint32(message.offset);
							if (message.bucketCounts != null && message.bucketCounts.length) {
								writer.uint32( 18).fork();
								for (var i = 0; i < message.bucketCounts.length; ++i)
								writer.uint64(message.bucketCounts[i]);
								writer.ldelim();
							}
							return writer;
						};
						Buckets.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						Buckets.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.offset = reader.sint32();
								break;
								}
								case 2: {
								if (!(message.bucketCounts && message.bucketCounts.length))
								message.bucketCounts = [];
								if ((tag & 7) === 2) {
								var end2 = reader.uint32() + reader.pos;
								while (reader.pos < end2)
								message.bucketCounts.push(reader.uint64());
								}
								else
								message.bucketCounts.push(reader.uint64());
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						Buckets.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						Buckets.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.offset != null && message.hasOwnProperty("offset"))
								if (!$util.isInteger(message.offset))
								return "offset: integer expected";
							if (message.bucketCounts != null && message.hasOwnProperty("bucketCounts")) {
								if (!Array.isArray(message.bucketCounts))
								return "bucketCounts: array expected";
								for (var i = 0; i < message.bucketCounts.length; ++i)
								if (!$util.isInteger(message.bucketCounts[i]) && !(message.bucketCounts[i] && $util.isInteger(message.bucketCounts[i].low) && $util.isInteger(message.bucketCounts[i].high)))
								return "bucketCounts: integer|Long[] expected";
							}
							return null;
						};
						Buckets.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets)
								return object;
							var message = new $root.opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets();
							if (object.offset != null)
								message.offset = object.offset | 0;
							if (object.bucketCounts) {
								if (!Array.isArray(object.bucketCounts))
								throw TypeError(".opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets.bucketCounts: array expected");
								message.bucketCounts = [];
								for (var i = 0; i < object.bucketCounts.length; ++i)
								if ($util.Long)
								(message.bucketCounts[i] = $util.Long.fromValue(object.bucketCounts[i])).unsigned = true;
								else if (typeof object.bucketCounts[i] === "string")
								message.bucketCounts[i] = parseInt(object.bucketCounts[i], 10);
								else if (typeof object.bucketCounts[i] === "number")
								message.bucketCounts[i] = object.bucketCounts[i];
								else if (typeof object.bucketCounts[i] === "object")
								message.bucketCounts[i] = new $util.LongBits(object.bucketCounts[i].low >>> 0, object.bucketCounts[i].high >>> 0).toNumber(true);
							}
							return message;
						};
						Buckets.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.arrays || options.defaults)
								object.bucketCounts = [];
							if (options.defaults)
								object.offset = 0;
							if (message.offset != null && message.hasOwnProperty("offset"))
								object.offset = message.offset;
							if (message.bucketCounts && message.bucketCounts.length) {
								object.bucketCounts = [];
								for (var j = 0; j < message.bucketCounts.length; ++j)
								if (typeof message.bucketCounts[j] === "number")
								object.bucketCounts[j] = options.longs === String ? String(message.bucketCounts[j]) : message.bucketCounts[j];
								else
								object.bucketCounts[j] = options.longs === String ? $util.Long.prototype.toString.call(message.bucketCounts[j]) : options.longs === Number ? new $util.LongBits(message.bucketCounts[j].low >>> 0, message.bucketCounts[j].high >>> 0).toNumber(true) : message.bucketCounts[j];
							}
							return object;
						};
						Buckets.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						Buckets.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.ExponentialHistogramDataPoint.Buckets";
						};
						return Buckets;
					})();
					return ExponentialHistogramDataPoint;
				})();
				v1.SummaryDataPoint = (function () {
					function SummaryDataPoint(properties) {
						this.attributes = [];
						this.quantileValues = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					SummaryDataPoint.prototype.attributes = $util.emptyArray;
					SummaryDataPoint.prototype.startTimeUnixNano = null;
					SummaryDataPoint.prototype.timeUnixNano = null;
					SummaryDataPoint.prototype.count = null;
					SummaryDataPoint.prototype.sum = null;
					SummaryDataPoint.prototype.quantileValues = $util.emptyArray;
					SummaryDataPoint.prototype.flags = null;
					SummaryDataPoint.create = function create(properties) {
						return new SummaryDataPoint(properties);
					};
					SummaryDataPoint.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.startTimeUnixNano != null && Object.hasOwnProperty.call(message, "startTimeUnixNano"))
							writer.uint32( 17).fixed64(message.startTimeUnixNano);
						if (message.timeUnixNano != null && Object.hasOwnProperty.call(message, "timeUnixNano"))
							writer.uint32( 25).fixed64(message.timeUnixNano);
						if (message.count != null && Object.hasOwnProperty.call(message, "count"))
							writer.uint32( 33).fixed64(message.count);
						if (message.sum != null && Object.hasOwnProperty.call(message, "sum"))
							writer.uint32( 41).double(message.sum);
						if (message.quantileValues != null && message.quantileValues.length)
							for (var i = 0; i < message.quantileValues.length; ++i)
								$root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.encode(message.quantileValues[i], writer.uint32( 50).fork()).ldelim();
						if (message.attributes != null && message.attributes.length)
							for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 58).fork()).ldelim();
						if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
							writer.uint32( 64).uint32(message.flags);
						return writer;
					};
					SummaryDataPoint.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					SummaryDataPoint.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.SummaryDataPoint();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 7: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.startTimeUnixNano = reader.fixed64();
								break;
								}
								case 3: {
								message.timeUnixNano = reader.fixed64();
								break;
								}
								case 4: {
								message.count = reader.fixed64();
								break;
								}
								case 5: {
								message.sum = reader.double();
								break;
								}
								case 6: {
								if (!(message.quantileValues && message.quantileValues.length))
								message.quantileValues = [];
								message.quantileValues.push($root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.decode(reader, reader.uint32()));
								break;
								}
								case 8: {
								message.flags = reader.uint32();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					SummaryDataPoint.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					SummaryDataPoint.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.attributes != null && message.hasOwnProperty("attributes")) {
							if (!Array.isArray(message.attributes))
								return "attributes: array expected";
							for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
							}
						}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (!$util.isInteger(message.startTimeUnixNano) && !(message.startTimeUnixNano && $util.isInteger(message.startTimeUnixNano.low) && $util.isInteger(message.startTimeUnixNano.high)))
								return "startTimeUnixNano: integer|Long expected";
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (!$util.isInteger(message.timeUnixNano) && !(message.timeUnixNano && $util.isInteger(message.timeUnixNano.low) && $util.isInteger(message.timeUnixNano.high)))
								return "timeUnixNano: integer|Long expected";
						if (message.count != null && message.hasOwnProperty("count"))
							if (!$util.isInteger(message.count) && !(message.count && $util.isInteger(message.count.low) && $util.isInteger(message.count.high)))
								return "count: integer|Long expected";
						if (message.sum != null && message.hasOwnProperty("sum"))
							if (typeof message.sum !== "number")
								return "sum: number expected";
						if (message.quantileValues != null && message.hasOwnProperty("quantileValues")) {
							if (!Array.isArray(message.quantileValues))
								return "quantileValues: array expected";
							for (var i = 0; i < message.quantileValues.length; ++i) {
								var error = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.verify(message.quantileValues[i]);
								if (error)
								return "quantileValues." + error;
							}
						}
						if (message.flags != null && message.hasOwnProperty("flags"))
							if (!$util.isInteger(message.flags))
								return "flags: integer expected";
						return null;
					};
					SummaryDataPoint.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.SummaryDataPoint)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.SummaryDataPoint();
						if (object.attributes) {
							if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: array expected");
							message.attributes = [];
							for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
							}
						}
						if (object.startTimeUnixNano != null)
							if ($util.Long)
								(message.startTimeUnixNano = $util.Long.fromValue(object.startTimeUnixNano)).unsigned = false;
							else if (typeof object.startTimeUnixNano === "string")
								message.startTimeUnixNano = parseInt(object.startTimeUnixNano, 10);
							else if (typeof object.startTimeUnixNano === "number")
								message.startTimeUnixNano = object.startTimeUnixNano;
							else if (typeof object.startTimeUnixNano === "object")
								message.startTimeUnixNano = new $util.LongBits(object.startTimeUnixNano.low >>> 0, object.startTimeUnixNano.high >>> 0).toNumber();
						if (object.timeUnixNano != null)
							if ($util.Long)
								(message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
							else if (typeof object.timeUnixNano === "string")
								message.timeUnixNano = parseInt(object.timeUnixNano, 10);
							else if (typeof object.timeUnixNano === "number")
								message.timeUnixNano = object.timeUnixNano;
							else if (typeof object.timeUnixNano === "object")
								message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
						if (object.count != null)
							if ($util.Long)
								(message.count = $util.Long.fromValue(object.count)).unsigned = false;
							else if (typeof object.count === "string")
								message.count = parseInt(object.count, 10);
							else if (typeof object.count === "number")
								message.count = object.count;
							else if (typeof object.count === "object")
								message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber();
						if (object.sum != null)
							message.sum = Number(object.sum);
						if (object.quantileValues) {
							if (!Array.isArray(object.quantileValues))
								throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: array expected");
							message.quantileValues = [];
							for (var i = 0; i < object.quantileValues.length; ++i) {
								if (typeof object.quantileValues[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.SummaryDataPoint.quantileValues: object expected");
								message.quantileValues[i] = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.fromObject(object.quantileValues[i]);
							}
						}
						if (object.flags != null)
							message.flags = object.flags >>> 0;
						return message;
					};
					SummaryDataPoint.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults) {
							object.quantileValues = [];
							object.attributes = [];
						}
						if (options.defaults) {
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.startTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.startTimeUnixNano = options.longs === String ? "0" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.timeUnixNano = options.longs === String ? "0" : 0;
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.count = options.longs === String ? "0" : 0;
							object.sum = 0;
							object.flags = 0;
						}
						if (message.startTimeUnixNano != null && message.hasOwnProperty("startTimeUnixNano"))
							if (typeof message.startTimeUnixNano === "number")
								object.startTimeUnixNano = options.longs === String ? String(message.startTimeUnixNano) : message.startTimeUnixNano;
							else
								object.startTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.startTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.startTimeUnixNano.low >>> 0, message.startTimeUnixNano.high >>> 0).toNumber() : message.startTimeUnixNano;
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (typeof message.timeUnixNano === "number")
								object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
							else
								object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
						if (message.count != null && message.hasOwnProperty("count"))
							if (typeof message.count === "number")
								object.count = options.longs === String ? String(message.count) : message.count;
							else
								object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber() : message.count;
						if (message.sum != null && message.hasOwnProperty("sum"))
							object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
						if (message.quantileValues && message.quantileValues.length) {
							object.quantileValues = [];
							for (var j = 0; j < message.quantileValues.length; ++j)
								object.quantileValues[j] = $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile.toObject(message.quantileValues[j], options);
						}
						if (message.attributes && message.attributes.length) {
							object.attributes = [];
							for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
						}
						if (message.flags != null && message.hasOwnProperty("flags"))
							object.flags = message.flags;
						return object;
					};
					SummaryDataPoint.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					SummaryDataPoint.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.SummaryDataPoint";
					};
					SummaryDataPoint.ValueAtQuantile = (function () {
						function ValueAtQuantile(properties) {
							if (properties)
								for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
						}
						ValueAtQuantile.prototype.quantile = null;
						ValueAtQuantile.prototype.value = null;
						ValueAtQuantile.create = function create(properties) {
							return new ValueAtQuantile(properties);
						};
						ValueAtQuantile.encode = function encode(message, writer) {
							if (!writer)
								writer = $Writer.create();
							if (message.quantile != null && Object.hasOwnProperty.call(message, "quantile"))
								writer.uint32( 9).double(message.quantile);
							if (message.value != null && Object.hasOwnProperty.call(message, "value"))
								writer.uint32( 17).double(message.value);
							return writer;
						};
						ValueAtQuantile.encodeDelimited = function encodeDelimited(message, writer) {
							return this.encode(message, writer).ldelim();
						};
						ValueAtQuantile.decode = function decode(reader, length) {
							if (!(reader instanceof $Reader))
								reader = $Reader.create(reader);
							var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile();
							while (reader.pos < end) {
								var tag = reader.uint32();
								switch (tag >>> 3) {
								case 1: {
								message.quantile = reader.double();
								break;
								}
								case 2: {
								message.value = reader.double();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
								}
							}
							return message;
						};
						ValueAtQuantile.decodeDelimited = function decodeDelimited(reader) {
							if (!(reader instanceof $Reader))
								reader = new $Reader(reader);
							return this.decode(reader, reader.uint32());
						};
						ValueAtQuantile.verify = function verify(message) {
							if (typeof message !== "object" || message === null)
								return "object expected";
							if (message.quantile != null && message.hasOwnProperty("quantile"))
								if (typeof message.quantile !== "number")
								return "quantile: number expected";
							if (message.value != null && message.hasOwnProperty("value"))
								if (typeof message.value !== "number")
								return "value: number expected";
							return null;
						};
						ValueAtQuantile.fromObject = function fromObject(object) {
							if (object instanceof $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile)
								return object;
							var message = new $root.opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile();
							if (object.quantile != null)
								message.quantile = Number(object.quantile);
							if (object.value != null)
								message.value = Number(object.value);
							return message;
						};
						ValueAtQuantile.toObject = function toObject(message, options) {
							if (!options)
								options = {};
							var object = {};
							if (options.defaults) {
								object.quantile = 0;
								object.value = 0;
							}
							if (message.quantile != null && message.hasOwnProperty("quantile"))
								object.quantile = options.json && !isFinite(message.quantile) ? String(message.quantile) : message.quantile;
							if (message.value != null && message.hasOwnProperty("value"))
								object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
							return object;
						};
						ValueAtQuantile.prototype.toJSON = function toJSON() {
							return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
						};
						ValueAtQuantile.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
							if (typeUrlPrefix === undefined) {
								typeUrlPrefix = "type.googleapis.com";
							}
							return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.SummaryDataPoint.ValueAtQuantile";
						};
						return ValueAtQuantile;
					})();
					return SummaryDataPoint;
				})();
				v1.Exemplar = (function () {
					function Exemplar(properties) {
						this.filteredAttributes = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					Exemplar.prototype.filteredAttributes = $util.emptyArray;
					Exemplar.prototype.timeUnixNano = null;
					Exemplar.prototype.asDouble = null;
					Exemplar.prototype.asInt = null;
					Exemplar.prototype.spanId = null;
					Exemplar.prototype.traceId = null;
					var $oneOfFields;
					Object.defineProperty(Exemplar.prototype, "value", {
						get: $util.oneOfGetter($oneOfFields = ["asDouble", "asInt"]),
						set: $util.oneOfSetter($oneOfFields)
					});
					Exemplar.create = function create(properties) {
						return new Exemplar(properties);
					};
					Exemplar.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.timeUnixNano != null && Object.hasOwnProperty.call(message, "timeUnixNano"))
							writer.uint32( 17).fixed64(message.timeUnixNano);
						if (message.asDouble != null && Object.hasOwnProperty.call(message, "asDouble"))
							writer.uint32( 25).double(message.asDouble);
						if (message.spanId != null && Object.hasOwnProperty.call(message, "spanId"))
							writer.uint32( 34).bytes(message.spanId);
						if (message.traceId != null && Object.hasOwnProperty.call(message, "traceId"))
							writer.uint32( 42).bytes(message.traceId);
						if (message.asInt != null && Object.hasOwnProperty.call(message, "asInt"))
							writer.uint32( 49).sfixed64(message.asInt);
						if (message.filteredAttributes != null && message.filteredAttributes.length)
							for (var i = 0; i < message.filteredAttributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.filteredAttributes[i], writer.uint32( 58).fork()).ldelim();
						return writer;
					};
					Exemplar.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					Exemplar.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.metrics.v1.Exemplar();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 7: {
								if (!(message.filteredAttributes && message.filteredAttributes.length))
								message.filteredAttributes = [];
								message.filteredAttributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 2: {
								message.timeUnixNano = reader.fixed64();
								break;
								}
								case 3: {
								message.asDouble = reader.double();
								break;
								}
								case 6: {
								message.asInt = reader.sfixed64();
								break;
								}
								case 4: {
								message.spanId = reader.bytes();
								break;
								}
								case 5: {
								message.traceId = reader.bytes();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					Exemplar.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					Exemplar.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						var properties = {};
						if (message.filteredAttributes != null && message.hasOwnProperty("filteredAttributes")) {
							if (!Array.isArray(message.filteredAttributes))
								return "filteredAttributes: array expected";
							for (var i = 0; i < message.filteredAttributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.filteredAttributes[i]);
								if (error)
								return "filteredAttributes." + error;
							}
						}
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (!$util.isInteger(message.timeUnixNano) && !(message.timeUnixNano && $util.isInteger(message.timeUnixNano.low) && $util.isInteger(message.timeUnixNano.high)))
								return "timeUnixNano: integer|Long expected";
						if (message.asDouble != null && message.hasOwnProperty("asDouble")) {
							properties.value = 1;
							if (typeof message.asDouble !== "number")
								return "asDouble: number expected";
						}
						if (message.asInt != null && message.hasOwnProperty("asInt")) {
							if (properties.value === 1)
								return "value: multiple values";
							properties.value = 1;
							if (!$util.isInteger(message.asInt) && !(message.asInt && $util.isInteger(message.asInt.low) && $util.isInteger(message.asInt.high)))
								return "asInt: integer|Long expected";
						}
						if (message.spanId != null && message.hasOwnProperty("spanId"))
							if (!(message.spanId && typeof message.spanId.length === "number" || $util.isString(message.spanId)))
								return "spanId: buffer expected";
						if (message.traceId != null && message.hasOwnProperty("traceId"))
							if (!(message.traceId && typeof message.traceId.length === "number" || $util.isString(message.traceId)))
								return "traceId: buffer expected";
						return null;
					};
					Exemplar.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.metrics.v1.Exemplar)
							return object;
						var message = new $root.opentelemetry.proto.metrics.v1.Exemplar();
						if (object.filteredAttributes) {
							if (!Array.isArray(object.filteredAttributes))
								throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: array expected");
							message.filteredAttributes = [];
							for (var i = 0; i < object.filteredAttributes.length; ++i) {
								if (typeof object.filteredAttributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.metrics.v1.Exemplar.filteredAttributes: object expected");
								message.filteredAttributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.filteredAttributes[i]);
							}
						}
						if (object.timeUnixNano != null)
							if ($util.Long)
								(message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
							else if (typeof object.timeUnixNano === "string")
								message.timeUnixNano = parseInt(object.timeUnixNano, 10);
							else if (typeof object.timeUnixNano === "number")
								message.timeUnixNano = object.timeUnixNano;
							else if (typeof object.timeUnixNano === "object")
								message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
						if (object.asDouble != null)
							message.asDouble = Number(object.asDouble);
						if (object.asInt != null)
							if ($util.Long)
								(message.asInt = $util.Long.fromValue(object.asInt)).unsigned = false;
							else if (typeof object.asInt === "string")
								message.asInt = parseInt(object.asInt, 10);
							else if (typeof object.asInt === "number")
								message.asInt = object.asInt;
							else if (typeof object.asInt === "object")
								message.asInt = new $util.LongBits(object.asInt.low >>> 0, object.asInt.high >>> 0).toNumber();
						if (object.spanId != null)
							if (typeof object.spanId === "string")
								$util.base64.decode(object.spanId, message.spanId = $util.newBuffer($util.base64.length(object.spanId)), 0);
							else if (object.spanId.length >= 0)
								message.spanId = object.spanId;
						if (object.traceId != null)
							if (typeof object.traceId === "string")
								$util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
							else if (object.traceId.length >= 0)
								message.traceId = object.traceId;
						return message;
					};
					Exemplar.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.filteredAttributes = [];
						if (options.defaults) {
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.timeUnixNano = options.longs === String ? "0" : 0;
							if (options.bytes === String)
								object.spanId = "";
							else {
								object.spanId = [];
								if (options.bytes !== Array)
								object.spanId = $util.newBuffer(object.spanId);
							}
							if (options.bytes === String)
								object.traceId = "";
							else {
								object.traceId = [];
								if (options.bytes !== Array)
								object.traceId = $util.newBuffer(object.traceId);
							}
						}
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (typeof message.timeUnixNano === "number")
								object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
							else
								object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
						if (message.asDouble != null && message.hasOwnProperty("asDouble")) {
							object.asDouble = options.json && !isFinite(message.asDouble) ? String(message.asDouble) : message.asDouble;
							if (options.oneofs)
								object.value = "asDouble";
						}
						if (message.spanId != null && message.hasOwnProperty("spanId"))
							object.spanId = options.bytes === String ? $util.base64.encode(message.spanId, 0, message.spanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.spanId) : message.spanId;
						if (message.traceId != null && message.hasOwnProperty("traceId"))
							object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
						if (message.asInt != null && message.hasOwnProperty("asInt")) {
							if (typeof message.asInt === "number")
								object.asInt = options.longs === String ? String(message.asInt) : message.asInt;
							else
								object.asInt = options.longs === String ? $util.Long.prototype.toString.call(message.asInt) : options.longs === Number ? new $util.LongBits(message.asInt.low >>> 0, message.asInt.high >>> 0).toNumber() : message.asInt;
							if (options.oneofs)
								object.value = "asInt";
						}
						if (message.filteredAttributes && message.filteredAttributes.length) {
							object.filteredAttributes = [];
							for (var j = 0; j < message.filteredAttributes.length; ++j)
								object.filteredAttributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.filteredAttributes[j], options);
						}
						return object;
					};
					Exemplar.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					Exemplar.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.metrics.v1.Exemplar";
					};
					return Exemplar;
				})();
				return v1;
			})();
			return metrics;
		})();
		proto.logs = (function () {
			var logs = {};
			logs.v1 = (function () {
				var v1 = {};
				v1.LogsData = (function () {
					function LogsData(properties) {
						this.resourceLogs = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					LogsData.prototype.resourceLogs = $util.emptyArray;
					LogsData.create = function create(properties) {
						return new LogsData(properties);
					};
					LogsData.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.resourceLogs != null && message.resourceLogs.length)
							for (var i = 0; i < message.resourceLogs.length; ++i)
								$root.opentelemetry.proto.logs.v1.ResourceLogs.encode(message.resourceLogs[i], writer.uint32( 10).fork()).ldelim();
						return writer;
					};
					LogsData.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					LogsData.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.logs.v1.LogsData();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								if (!(message.resourceLogs && message.resourceLogs.length))
								message.resourceLogs = [];
								message.resourceLogs.push($root.opentelemetry.proto.logs.v1.ResourceLogs.decode(reader, reader.uint32()));
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					LogsData.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					LogsData.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.resourceLogs != null && message.hasOwnProperty("resourceLogs")) {
							if (!Array.isArray(message.resourceLogs))
								return "resourceLogs: array expected";
							for (var i = 0; i < message.resourceLogs.length; ++i) {
								var error = $root.opentelemetry.proto.logs.v1.ResourceLogs.verify(message.resourceLogs[i]);
								if (error)
								return "resourceLogs." + error;
							}
						}
						return null;
					};
					LogsData.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.logs.v1.LogsData)
							return object;
						var message = new $root.opentelemetry.proto.logs.v1.LogsData();
						if (object.resourceLogs) {
							if (!Array.isArray(object.resourceLogs))
								throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: array expected");
							message.resourceLogs = [];
							for (var i = 0; i < object.resourceLogs.length; ++i) {
								if (typeof object.resourceLogs[i] !== "object")
								throw TypeError(".opentelemetry.proto.logs.v1.LogsData.resourceLogs: object expected");
								message.resourceLogs[i] = $root.opentelemetry.proto.logs.v1.ResourceLogs.fromObject(object.resourceLogs[i]);
							}
						}
						return message;
					};
					LogsData.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.resourceLogs = [];
						if (message.resourceLogs && message.resourceLogs.length) {
							object.resourceLogs = [];
							for (var j = 0; j < message.resourceLogs.length; ++j)
								object.resourceLogs[j] = $root.opentelemetry.proto.logs.v1.ResourceLogs.toObject(message.resourceLogs[j], options);
						}
						return object;
					};
					LogsData.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					LogsData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.logs.v1.LogsData";
					};
					return LogsData;
				})();
				v1.ResourceLogs = (function () {
					function ResourceLogs(properties) {
						this.scopeLogs = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ResourceLogs.prototype.resource = null;
					ResourceLogs.prototype.scopeLogs = $util.emptyArray;
					ResourceLogs.prototype.schemaUrl = null;
					ResourceLogs.create = function create(properties) {
						return new ResourceLogs(properties);
					};
					ResourceLogs.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.resource != null && Object.hasOwnProperty.call(message, "resource"))
							$root.opentelemetry.proto.resource.v1.Resource.encode(message.resource, writer.uint32( 10).fork()).ldelim();
						if (message.scopeLogs != null && message.scopeLogs.length)
							for (var i = 0; i < message.scopeLogs.length; ++i)
								$root.opentelemetry.proto.logs.v1.ScopeLogs.encode(message.scopeLogs[i], writer.uint32( 18).fork()).ldelim();
						if (message.schemaUrl != null && Object.hasOwnProperty.call(message, "schemaUrl"))
							writer.uint32( 26).string(message.schemaUrl);
						return writer;
					};
					ResourceLogs.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ResourceLogs.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.logs.v1.ResourceLogs();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.resource = $root.opentelemetry.proto.resource.v1.Resource.decode(reader, reader.uint32());
								break;
								}
								case 2: {
								if (!(message.scopeLogs && message.scopeLogs.length))
								message.scopeLogs = [];
								message.scopeLogs.push($root.opentelemetry.proto.logs.v1.ScopeLogs.decode(reader, reader.uint32()));
								break;
								}
								case 3: {
								message.schemaUrl = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ResourceLogs.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ResourceLogs.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.resource != null && message.hasOwnProperty("resource")) {
							var error = $root.opentelemetry.proto.resource.v1.Resource.verify(message.resource);
							if (error)
								return "resource." + error;
						}
						if (message.scopeLogs != null && message.hasOwnProperty("scopeLogs")) {
							if (!Array.isArray(message.scopeLogs))
								return "scopeLogs: array expected";
							for (var i = 0; i < message.scopeLogs.length; ++i) {
								var error = $root.opentelemetry.proto.logs.v1.ScopeLogs.verify(message.scopeLogs[i]);
								if (error)
								return "scopeLogs." + error;
							}
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							if (!$util.isString(message.schemaUrl))
								return "schemaUrl: string expected";
						return null;
					};
					ResourceLogs.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.logs.v1.ResourceLogs)
							return object;
						var message = new $root.opentelemetry.proto.logs.v1.ResourceLogs();
						if (object.resource != null) {
							if (typeof object.resource !== "object")
								throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.resource: object expected");
							message.resource = $root.opentelemetry.proto.resource.v1.Resource.fromObject(object.resource);
						}
						if (object.scopeLogs) {
							if (!Array.isArray(object.scopeLogs))
								throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: array expected");
							message.scopeLogs = [];
							for (var i = 0; i < object.scopeLogs.length; ++i) {
								if (typeof object.scopeLogs[i] !== "object")
								throw TypeError(".opentelemetry.proto.logs.v1.ResourceLogs.scopeLogs: object expected");
								message.scopeLogs[i] = $root.opentelemetry.proto.logs.v1.ScopeLogs.fromObject(object.scopeLogs[i]);
							}
						}
						if (object.schemaUrl != null)
							message.schemaUrl = String(object.schemaUrl);
						return message;
					};
					ResourceLogs.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.scopeLogs = [];
						if (options.defaults) {
							object.resource = null;
							object.schemaUrl = "";
						}
						if (message.resource != null && message.hasOwnProperty("resource"))
							object.resource = $root.opentelemetry.proto.resource.v1.Resource.toObject(message.resource, options);
						if (message.scopeLogs && message.scopeLogs.length) {
							object.scopeLogs = [];
							for (var j = 0; j < message.scopeLogs.length; ++j)
								object.scopeLogs[j] = $root.opentelemetry.proto.logs.v1.ScopeLogs.toObject(message.scopeLogs[j], options);
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							object.schemaUrl = message.schemaUrl;
						return object;
					};
					ResourceLogs.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ResourceLogs.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.logs.v1.ResourceLogs";
					};
					return ResourceLogs;
				})();
				v1.ScopeLogs = (function () {
					function ScopeLogs(properties) {
						this.logRecords = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					ScopeLogs.prototype.scope = null;
					ScopeLogs.prototype.logRecords = $util.emptyArray;
					ScopeLogs.prototype.schemaUrl = null;
					ScopeLogs.create = function create(properties) {
						return new ScopeLogs(properties);
					};
					ScopeLogs.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.scope != null && Object.hasOwnProperty.call(message, "scope"))
							$root.opentelemetry.proto.common.v1.InstrumentationScope.encode(message.scope, writer.uint32( 10).fork()).ldelim();
						if (message.logRecords != null && message.logRecords.length)
							for (var i = 0; i < message.logRecords.length; ++i)
								$root.opentelemetry.proto.logs.v1.LogRecord.encode(message.logRecords[i], writer.uint32( 18).fork()).ldelim();
						if (message.schemaUrl != null && Object.hasOwnProperty.call(message, "schemaUrl"))
							writer.uint32( 26).string(message.schemaUrl);
						return writer;
					};
					ScopeLogs.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					ScopeLogs.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.logs.v1.ScopeLogs();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.decode(reader, reader.uint32());
								break;
								}
								case 2: {
								if (!(message.logRecords && message.logRecords.length))
								message.logRecords = [];
								message.logRecords.push($root.opentelemetry.proto.logs.v1.LogRecord.decode(reader, reader.uint32()));
								break;
								}
								case 3: {
								message.schemaUrl = reader.string();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					ScopeLogs.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					ScopeLogs.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.scope != null && message.hasOwnProperty("scope")) {
							var error = $root.opentelemetry.proto.common.v1.InstrumentationScope.verify(message.scope);
							if (error)
								return "scope." + error;
						}
						if (message.logRecords != null && message.hasOwnProperty("logRecords")) {
							if (!Array.isArray(message.logRecords))
								return "logRecords: array expected";
							for (var i = 0; i < message.logRecords.length; ++i) {
								var error = $root.opentelemetry.proto.logs.v1.LogRecord.verify(message.logRecords[i]);
								if (error)
								return "logRecords." + error;
							}
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							if (!$util.isString(message.schemaUrl))
								return "schemaUrl: string expected";
						return null;
					};
					ScopeLogs.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.logs.v1.ScopeLogs)
							return object;
						var message = new $root.opentelemetry.proto.logs.v1.ScopeLogs();
						if (object.scope != null) {
							if (typeof object.scope !== "object")
								throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.scope: object expected");
							message.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.fromObject(object.scope);
						}
						if (object.logRecords) {
							if (!Array.isArray(object.logRecords))
								throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: array expected");
							message.logRecords = [];
							for (var i = 0; i < object.logRecords.length; ++i) {
								if (typeof object.logRecords[i] !== "object")
								throw TypeError(".opentelemetry.proto.logs.v1.ScopeLogs.logRecords: object expected");
								message.logRecords[i] = $root.opentelemetry.proto.logs.v1.LogRecord.fromObject(object.logRecords[i]);
							}
						}
						if (object.schemaUrl != null)
							message.schemaUrl = String(object.schemaUrl);
						return message;
					};
					ScopeLogs.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.logRecords = [];
						if (options.defaults) {
							object.scope = null;
							object.schemaUrl = "";
						}
						if (message.scope != null && message.hasOwnProperty("scope"))
							object.scope = $root.opentelemetry.proto.common.v1.InstrumentationScope.toObject(message.scope, options);
						if (message.logRecords && message.logRecords.length) {
							object.logRecords = [];
							for (var j = 0; j < message.logRecords.length; ++j)
								object.logRecords[j] = $root.opentelemetry.proto.logs.v1.LogRecord.toObject(message.logRecords[j], options);
						}
						if (message.schemaUrl != null && message.hasOwnProperty("schemaUrl"))
							object.schemaUrl = message.schemaUrl;
						return object;
					};
					ScopeLogs.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					ScopeLogs.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.logs.v1.ScopeLogs";
					};
					return ScopeLogs;
				})();
				v1.SeverityNumber = (function () {
					var valuesById = {}, values = Object.create(valuesById);
					values[valuesById[0] = "SEVERITY_NUMBER_UNSPECIFIED"] = 0;
					values[valuesById[1] = "SEVERITY_NUMBER_TRACE"] = 1;
					values[valuesById[2] = "SEVERITY_NUMBER_TRACE2"] = 2;
					values[valuesById[3] = "SEVERITY_NUMBER_TRACE3"] = 3;
					values[valuesById[4] = "SEVERITY_NUMBER_TRACE4"] = 4;
					values[valuesById[5] = "SEVERITY_NUMBER_DEBUG"] = 5;
					values[valuesById[6] = "SEVERITY_NUMBER_DEBUG2"] = 6;
					values[valuesById[7] = "SEVERITY_NUMBER_DEBUG3"] = 7;
					values[valuesById[8] = "SEVERITY_NUMBER_DEBUG4"] = 8;
					values[valuesById[9] = "SEVERITY_NUMBER_INFO"] = 9;
					values[valuesById[10] = "SEVERITY_NUMBER_INFO2"] = 10;
					values[valuesById[11] = "SEVERITY_NUMBER_INFO3"] = 11;
					values[valuesById[12] = "SEVERITY_NUMBER_INFO4"] = 12;
					values[valuesById[13] = "SEVERITY_NUMBER_WARN"] = 13;
					values[valuesById[14] = "SEVERITY_NUMBER_WARN2"] = 14;
					values[valuesById[15] = "SEVERITY_NUMBER_WARN3"] = 15;
					values[valuesById[16] = "SEVERITY_NUMBER_WARN4"] = 16;
					values[valuesById[17] = "SEVERITY_NUMBER_ERROR"] = 17;
					values[valuesById[18] = "SEVERITY_NUMBER_ERROR2"] = 18;
					values[valuesById[19] = "SEVERITY_NUMBER_ERROR3"] = 19;
					values[valuesById[20] = "SEVERITY_NUMBER_ERROR4"] = 20;
					values[valuesById[21] = "SEVERITY_NUMBER_FATAL"] = 21;
					values[valuesById[22] = "SEVERITY_NUMBER_FATAL2"] = 22;
					values[valuesById[23] = "SEVERITY_NUMBER_FATAL3"] = 23;
					values[valuesById[24] = "SEVERITY_NUMBER_FATAL4"] = 24;
					return values;
				})();
				v1.LogRecordFlags = (function () {
					var valuesById = {}, values = Object.create(valuesById);
					values[valuesById[0] = "LOG_RECORD_FLAGS_DO_NOT_USE"] = 0;
					values[valuesById[255] = "LOG_RECORD_FLAGS_TRACE_FLAGS_MASK"] = 255;
					return values;
				})();
				v1.LogRecord = (function () {
					function LogRecord(properties) {
						this.attributes = [];
						if (properties)
							for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
								if (properties[keys[i]] != null)
								this[keys[i]] = properties[keys[i]];
					}
					LogRecord.prototype.timeUnixNano = null;
					LogRecord.prototype.observedTimeUnixNano = null;
					LogRecord.prototype.severityNumber = null;
					LogRecord.prototype.severityText = null;
					LogRecord.prototype.body = null;
					LogRecord.prototype.attributes = $util.emptyArray;
					LogRecord.prototype.droppedAttributesCount = null;
					LogRecord.prototype.flags = null;
					LogRecord.prototype.traceId = null;
					LogRecord.prototype.spanId = null;
					LogRecord.create = function create(properties) {
						return new LogRecord(properties);
					};
					LogRecord.encode = function encode(message, writer) {
						if (!writer)
							writer = $Writer.create();
						if (message.timeUnixNano != null && Object.hasOwnProperty.call(message, "timeUnixNano"))
							writer.uint32( 9).fixed64(message.timeUnixNano);
						if (message.severityNumber != null && Object.hasOwnProperty.call(message, "severityNumber"))
							writer.uint32( 16).int32(message.severityNumber);
						if (message.severityText != null && Object.hasOwnProperty.call(message, "severityText"))
							writer.uint32( 26).string(message.severityText);
						if (message.body != null && Object.hasOwnProperty.call(message, "body"))
							$root.opentelemetry.proto.common.v1.AnyValue.encode(message.body, writer.uint32( 42).fork()).ldelim();
						if (message.attributes != null && message.attributes.length)
							for (var i = 0; i < message.attributes.length; ++i)
								$root.opentelemetry.proto.common.v1.KeyValue.encode(message.attributes[i], writer.uint32( 50).fork()).ldelim();
						if (message.droppedAttributesCount != null && Object.hasOwnProperty.call(message, "droppedAttributesCount"))
							writer.uint32( 56).uint32(message.droppedAttributesCount);
						if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
							writer.uint32( 69).fixed32(message.flags);
						if (message.traceId != null && Object.hasOwnProperty.call(message, "traceId"))
							writer.uint32( 74).bytes(message.traceId);
						if (message.spanId != null && Object.hasOwnProperty.call(message, "spanId"))
							writer.uint32( 82).bytes(message.spanId);
						if (message.observedTimeUnixNano != null && Object.hasOwnProperty.call(message, "observedTimeUnixNano"))
							writer.uint32( 89).fixed64(message.observedTimeUnixNano);
						return writer;
					};
					LogRecord.encodeDelimited = function encodeDelimited(message, writer) {
						return this.encode(message, writer).ldelim();
					};
					LogRecord.decode = function decode(reader, length) {
						if (!(reader instanceof $Reader))
							reader = $Reader.create(reader);
						var end = length === undefined ? reader.len : reader.pos + length, message = new $root.opentelemetry.proto.logs.v1.LogRecord();
						while (reader.pos < end) {
							var tag = reader.uint32();
							switch (tag >>> 3) {
								case 1: {
								message.timeUnixNano = reader.fixed64();
								break;
								}
								case 11: {
								message.observedTimeUnixNano = reader.fixed64();
								break;
								}
								case 2: {
								message.severityNumber = reader.int32();
								break;
								}
								case 3: {
								message.severityText = reader.string();
								break;
								}
								case 5: {
								message.body = $root.opentelemetry.proto.common.v1.AnyValue.decode(reader, reader.uint32());
								break;
								}
								case 6: {
								if (!(message.attributes && message.attributes.length))
								message.attributes = [];
								message.attributes.push($root.opentelemetry.proto.common.v1.KeyValue.decode(reader, reader.uint32()));
								break;
								}
								case 7: {
								message.droppedAttributesCount = reader.uint32();
								break;
								}
								case 8: {
								message.flags = reader.fixed32();
								break;
								}
								case 9: {
								message.traceId = reader.bytes();
								break;
								}
								case 10: {
								message.spanId = reader.bytes();
								break;
								}
								default:
								reader.skipType(tag & 7);
								break;
							}
						}
						return message;
					};
					LogRecord.decodeDelimited = function decodeDelimited(reader) {
						if (!(reader instanceof $Reader))
							reader = new $Reader(reader);
						return this.decode(reader, reader.uint32());
					};
					LogRecord.verify = function verify(message) {
						if (typeof message !== "object" || message === null)
							return "object expected";
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (!$util.isInteger(message.timeUnixNano) && !(message.timeUnixNano && $util.isInteger(message.timeUnixNano.low) && $util.isInteger(message.timeUnixNano.high)))
								return "timeUnixNano: integer|Long expected";
						if (message.observedTimeUnixNano != null && message.hasOwnProperty("observedTimeUnixNano"))
							if (!$util.isInteger(message.observedTimeUnixNano) && !(message.observedTimeUnixNano && $util.isInteger(message.observedTimeUnixNano.low) && $util.isInteger(message.observedTimeUnixNano.high)))
								return "observedTimeUnixNano: integer|Long expected";
						if (message.severityNumber != null && message.hasOwnProperty("severityNumber"))
							switch (message.severityNumber) {
								default:
								return "severityNumber: enum value expected";
								case 0:
								case 1:
								case 2:
								case 3:
								case 4:
								case 5:
								case 6:
								case 7:
								case 8:
								case 9:
								case 10:
								case 11:
								case 12:
								case 13:
								case 14:
								case 15:
								case 16:
								case 17:
								case 18:
								case 19:
								case 20:
								case 21:
								case 22:
								case 23:
								case 24:
								break;
							}
						if (message.severityText != null && message.hasOwnProperty("severityText"))
							if (!$util.isString(message.severityText))
								return "severityText: string expected";
						if (message.body != null && message.hasOwnProperty("body")) {
							var error = $root.opentelemetry.proto.common.v1.AnyValue.verify(message.body);
							if (error)
								return "body." + error;
						}
						if (message.attributes != null && message.hasOwnProperty("attributes")) {
							if (!Array.isArray(message.attributes))
								return "attributes: array expected";
							for (var i = 0; i < message.attributes.length; ++i) {
								var error = $root.opentelemetry.proto.common.v1.KeyValue.verify(message.attributes[i]);
								if (error)
								return "attributes." + error;
							}
						}
						if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
							if (!$util.isInteger(message.droppedAttributesCount))
								return "droppedAttributesCount: integer expected";
						if (message.flags != null && message.hasOwnProperty("flags"))
							if (!$util.isInteger(message.flags))
								return "flags: integer expected";
						if (message.traceId != null && message.hasOwnProperty("traceId"))
							if (!(message.traceId && typeof message.traceId.length === "number" || $util.isString(message.traceId)))
								return "traceId: buffer expected";
						if (message.spanId != null && message.hasOwnProperty("spanId"))
							if (!(message.spanId && typeof message.spanId.length === "number" || $util.isString(message.spanId)))
								return "spanId: buffer expected";
						return null;
					};
					LogRecord.fromObject = function fromObject(object) {
						if (object instanceof $root.opentelemetry.proto.logs.v1.LogRecord)
							return object;
						var message = new $root.opentelemetry.proto.logs.v1.LogRecord();
						if (object.timeUnixNano != null)
							if ($util.Long)
								(message.timeUnixNano = $util.Long.fromValue(object.timeUnixNano)).unsigned = false;
							else if (typeof object.timeUnixNano === "string")
								message.timeUnixNano = parseInt(object.timeUnixNano, 10);
							else if (typeof object.timeUnixNano === "number")
								message.timeUnixNano = object.timeUnixNano;
							else if (typeof object.timeUnixNano === "object")
								message.timeUnixNano = new $util.LongBits(object.timeUnixNano.low >>> 0, object.timeUnixNano.high >>> 0).toNumber();
						if (object.observedTimeUnixNano != null)
							if ($util.Long)
								(message.observedTimeUnixNano = $util.Long.fromValue(object.observedTimeUnixNano)).unsigned = false;
							else if (typeof object.observedTimeUnixNano === "string")
								message.observedTimeUnixNano = parseInt(object.observedTimeUnixNano, 10);
							else if (typeof object.observedTimeUnixNano === "number")
								message.observedTimeUnixNano = object.observedTimeUnixNano;
							else if (typeof object.observedTimeUnixNano === "object")
								message.observedTimeUnixNano = new $util.LongBits(object.observedTimeUnixNano.low >>> 0, object.observedTimeUnixNano.high >>> 0).toNumber();
						switch (object.severityNumber) {
							default:
								if (typeof object.severityNumber === "number") {
								message.severityNumber = object.severityNumber;
								break;
								}
								break;
							case "SEVERITY_NUMBER_UNSPECIFIED":
							case 0:
								message.severityNumber = 0;
								break;
							case "SEVERITY_NUMBER_TRACE":
							case 1:
								message.severityNumber = 1;
								break;
							case "SEVERITY_NUMBER_TRACE2":
							case 2:
								message.severityNumber = 2;
								break;
							case "SEVERITY_NUMBER_TRACE3":
							case 3:
								message.severityNumber = 3;
								break;
							case "SEVERITY_NUMBER_TRACE4":
							case 4:
								message.severityNumber = 4;
								break;
							case "SEVERITY_NUMBER_DEBUG":
							case 5:
								message.severityNumber = 5;
								break;
							case "SEVERITY_NUMBER_DEBUG2":
							case 6:
								message.severityNumber = 6;
								break;
							case "SEVERITY_NUMBER_DEBUG3":
							case 7:
								message.severityNumber = 7;
								break;
							case "SEVERITY_NUMBER_DEBUG4":
							case 8:
								message.severityNumber = 8;
								break;
							case "SEVERITY_NUMBER_INFO":
							case 9:
								message.severityNumber = 9;
								break;
							case "SEVERITY_NUMBER_INFO2":
							case 10:
								message.severityNumber = 10;
								break;
							case "SEVERITY_NUMBER_INFO3":
							case 11:
								message.severityNumber = 11;
								break;
							case "SEVERITY_NUMBER_INFO4":
							case 12:
								message.severityNumber = 12;
								break;
							case "SEVERITY_NUMBER_WARN":
							case 13:
								message.severityNumber = 13;
								break;
							case "SEVERITY_NUMBER_WARN2":
							case 14:
								message.severityNumber = 14;
								break;
							case "SEVERITY_NUMBER_WARN3":
							case 15:
								message.severityNumber = 15;
								break;
							case "SEVERITY_NUMBER_WARN4":
							case 16:
								message.severityNumber = 16;
								break;
							case "SEVERITY_NUMBER_ERROR":
							case 17:
								message.severityNumber = 17;
								break;
							case "SEVERITY_NUMBER_ERROR2":
							case 18:
								message.severityNumber = 18;
								break;
							case "SEVERITY_NUMBER_ERROR3":
							case 19:
								message.severityNumber = 19;
								break;
							case "SEVERITY_NUMBER_ERROR4":
							case 20:
								message.severityNumber = 20;
								break;
							case "SEVERITY_NUMBER_FATAL":
							case 21:
								message.severityNumber = 21;
								break;
							case "SEVERITY_NUMBER_FATAL2":
							case 22:
								message.severityNumber = 22;
								break;
							case "SEVERITY_NUMBER_FATAL3":
							case 23:
								message.severityNumber = 23;
								break;
							case "SEVERITY_NUMBER_FATAL4":
							case 24:
								message.severityNumber = 24;
								break;
						}
						if (object.severityText != null)
							message.severityText = String(object.severityText);
						if (object.body != null) {
							if (typeof object.body !== "object")
								throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.body: object expected");
							message.body = $root.opentelemetry.proto.common.v1.AnyValue.fromObject(object.body);
						}
						if (object.attributes) {
							if (!Array.isArray(object.attributes))
								throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: array expected");
							message.attributes = [];
							for (var i = 0; i < object.attributes.length; ++i) {
								if (typeof object.attributes[i] !== "object")
								throw TypeError(".opentelemetry.proto.logs.v1.LogRecord.attributes: object expected");
								message.attributes[i] = $root.opentelemetry.proto.common.v1.KeyValue.fromObject(object.attributes[i]);
							}
						}
						if (object.droppedAttributesCount != null)
							message.droppedAttributesCount = object.droppedAttributesCount >>> 0;
						if (object.flags != null)
							message.flags = object.flags >>> 0;
						if (object.traceId != null)
							if (typeof object.traceId === "string")
								$util.base64.decode(object.traceId, message.traceId = $util.newBuffer($util.base64.length(object.traceId)), 0);
							else if (object.traceId.length >= 0)
								message.traceId = object.traceId;
						if (object.spanId != null)
							if (typeof object.spanId === "string")
								$util.base64.decode(object.spanId, message.spanId = $util.newBuffer($util.base64.length(object.spanId)), 0);
							else if (object.spanId.length >= 0)
								message.spanId = object.spanId;
						return message;
					};
					LogRecord.toObject = function toObject(message, options) {
						if (!options)
							options = {};
						var object = {};
						if (options.arrays || options.defaults)
							object.attributes = [];
						if (options.defaults) {
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.timeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.timeUnixNano = options.longs === String ? "0" : 0;
							object.severityNumber = options.enums === String ? "SEVERITY_NUMBER_UNSPECIFIED" : 0;
							object.severityText = "";
							object.body = null;
							object.droppedAttributesCount = 0;
							object.flags = 0;
							if (options.bytes === String)
								object.traceId = "";
							else {
								object.traceId = [];
								if (options.bytes !== Array)
								object.traceId = $util.newBuffer(object.traceId);
							}
							if (options.bytes === String)
								object.spanId = "";
							else {
								object.spanId = [];
								if (options.bytes !== Array)
								object.spanId = $util.newBuffer(object.spanId);
							}
							if ($util.Long) {
								var long = new $util.Long(0, 0, false);
								object.observedTimeUnixNano = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
							}
							else
								object.observedTimeUnixNano = options.longs === String ? "0" : 0;
						}
						if (message.timeUnixNano != null && message.hasOwnProperty("timeUnixNano"))
							if (typeof message.timeUnixNano === "number")
								object.timeUnixNano = options.longs === String ? String(message.timeUnixNano) : message.timeUnixNano;
							else
								object.timeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.timeUnixNano) : options.longs === Number ? new $util.LongBits(message.timeUnixNano.low >>> 0, message.timeUnixNano.high >>> 0).toNumber() : message.timeUnixNano;
						if (message.severityNumber != null && message.hasOwnProperty("severityNumber"))
							object.severityNumber = options.enums === String ? $root.opentelemetry.proto.logs.v1.SeverityNumber[message.severityNumber] === undefined ? message.severityNumber : $root.opentelemetry.proto.logs.v1.SeverityNumber[message.severityNumber] : message.severityNumber;
						if (message.severityText != null && message.hasOwnProperty("severityText"))
							object.severityText = message.severityText;
						if (message.body != null && message.hasOwnProperty("body"))
							object.body = $root.opentelemetry.proto.common.v1.AnyValue.toObject(message.body, options);
						if (message.attributes && message.attributes.length) {
							object.attributes = [];
							for (var j = 0; j < message.attributes.length; ++j)
								object.attributes[j] = $root.opentelemetry.proto.common.v1.KeyValue.toObject(message.attributes[j], options);
						}
						if (message.droppedAttributesCount != null && message.hasOwnProperty("droppedAttributesCount"))
							object.droppedAttributesCount = message.droppedAttributesCount;
						if (message.flags != null && message.hasOwnProperty("flags"))
							object.flags = message.flags;
						if (message.traceId != null && message.hasOwnProperty("traceId"))
							object.traceId = options.bytes === String ? $util.base64.encode(message.traceId, 0, message.traceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.traceId) : message.traceId;
						if (message.spanId != null && message.hasOwnProperty("spanId"))
							object.spanId = options.bytes === String ? $util.base64.encode(message.spanId, 0, message.spanId.length) : options.bytes === Array ? Array.prototype.slice.call(message.spanId) : message.spanId;
						if (message.observedTimeUnixNano != null && message.hasOwnProperty("observedTimeUnixNano"))
							if (typeof message.observedTimeUnixNano === "number")
								object.observedTimeUnixNano = options.longs === String ? String(message.observedTimeUnixNano) : message.observedTimeUnixNano;
							else
								object.observedTimeUnixNano = options.longs === String ? $util.Long.prototype.toString.call(message.observedTimeUnixNano) : options.longs === Number ? new $util.LongBits(message.observedTimeUnixNano.low >>> 0, message.observedTimeUnixNano.high >>> 0).toNumber() : message.observedTimeUnixNano;
						return object;
					};
					LogRecord.prototype.toJSON = function toJSON() {
						return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
					};
					LogRecord.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
						if (typeUrlPrefix === undefined) {
							typeUrlPrefix = "type.googleapis.com";
						}
						return typeUrlPrefix + "/opentelemetry.proto.logs.v1.LogRecord";
					};
					return LogRecord;
				})();
				return v1;
			})();
			return logs;
		})();
		return proto;
	})();
	return opentelemetry;
})();
var root = $root;
getDefaultExportFromCjs(root);

const logsResponseType = root.opentelemetry.proto.collector.logs.v1
	.ExportLogsServiceResponse;
const logsRequestType = root.opentelemetry.proto.collector.logs.v1
	.ExportLogsServiceRequest;
const metricsResponseType = root.opentelemetry.proto.collector.metrics.v1
	.ExportMetricsServiceResponse;
const metricsRequestType = root.opentelemetry.proto.collector.metrics.v1
	.ExportMetricsServiceRequest;
const traceResponseType = root.opentelemetry.proto.collector.trace.v1
	.ExportTraceServiceResponse;
const traceRequestType = root.opentelemetry.proto.collector.trace.v1
	.ExportTraceServiceRequest;
const ProtobufLogsSerializer = {
	serializeRequest: (arg) => {
		const request = createExportLogsServiceRequest(arg);
		return logsRequestType.encode(request).finish();
	},
	deserializeResponse: (arg) => {
		return logsResponseType.decode(arg);
	},
};
const ProtobufMetricsSerializer = {
	serializeRequest: (arg) => {
		const request = createExportMetricsServiceRequest(arg);
		return metricsRequestType.encode(request).finish();
	},
	deserializeResponse: (arg) => {
		return metricsResponseType.decode(arg);
	},
};
const ProtobufTraceSerializer = {
	serializeRequest: (arg) => {
		const request = createExportTraceServiceRequest(arg);
		return traceRequestType.encode(request).finish();
	},
	deserializeResponse: (arg) => {
		return traceResponseType.decode(arg);
	},
};

const JsonTraceSerializer = {
	serializeRequest: (arg) => {
		const request = createExportTraceServiceRequest(arg, {
			useHex: true,
			useLongBits: false,
		});
		const encoder = new TextEncoder();
		return encoder.encode(JSON.stringify(request));
	},
	deserializeResponse: (arg) => {
		const decoder = new TextDecoder();
		return JSON.parse(decoder.decode(arg));
	},
};
const JsonMetricsSerializer = {
	serializeRequest: (arg) => {
		const request = createExportMetricsServiceRequest(arg, {
			useLongBits: false,
		});
		const encoder = new TextEncoder();
		return encoder.encode(JSON.stringify(request));
	},
	deserializeResponse: (arg) => {
		const decoder = new TextDecoder();
		return JSON.parse(decoder.decode(arg));
	},
};
const JsonLogsSerializer = {
	serializeRequest: (arg) => {
		const request = createExportLogsServiceRequest(arg, {
			useHex: true,
			useLongBits: false,
		});
		const encoder = new TextEncoder();
		return encoder.encode(JSON.stringify(request));
	},
	deserializeResponse: (arg) => {
		const decoder = new TextDecoder();
		return JSON.parse(decoder.decode(arg));
	},
};

export { ESpanKind, JsonLogsSerializer, JsonMetricsSerializer, JsonTraceSerializer, ProtobufLogsSerializer, ProtobufMetricsSerializer, ProtobufTraceSerializer, createExportLogsServiceRequest, createExportMetricsServiceRequest, createExportTraceServiceRequest, encodeAsLongBits, encodeAsString, getOtlpEncoder, hrTimeToNanos, toLongBits };
