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

import { hrTimeToNanoseconds } from './core.js';
import { ValueType } from './api.js';
import { DataPointType, AggregationTemporality } from './sdk-metrics.js';

const MissingSerializer$2 = {
	serializeRequest: (arg) => { throw new Error('not implemented'); },
	deserializeResponse: (arg) => { throw new Error('not implemented'); },
};
const ProtobufLogsSerializer = MissingSerializer$2;

const MissingSerializer$1 = {
	serializeRequest: (arg) => { throw new Error('not implemented'); },
	deserializeResponse: (arg) => { throw new Error('not implemented'); },
};
const ProtobufMetricsSerializer = MissingSerializer$1;

const MissingSerializer = {
	serializeRequest: (arg) => { throw new Error('not implemented'); },
	deserializeResponse: (arg) => { throw new Error('not implemented'); },
};
const ProtobufTraceSerializer = MissingSerializer;

function intValue(charCode) {
	if (charCode >= 48 && charCode <= 57) {
		return charCode - 48;
	}
	if (charCode >= 97 && charCode <= 102) {
		return charCode - 87;
	}
	return charCode - 55;
}
function hexToBinary(hexStr) {
	const buf = new Uint8Array(hexStr.length / 2);
	let offset = 0;
	for (let i = 0; i < hexStr.length; i += 2) {
		const hi = intValue(hexStr.charCodeAt(i));
		const lo = intValue(hexStr.charCodeAt(i + 1));
		buf[offset++] = (hi << 4) | lo;
	}
	return buf;
}

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

function createResource(resource) {
	return {
		attributes: toAttributes(resource.attributes),
		droppedAttributesCount: 0,
	};
}
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

function createExportLogsServiceRequest(logRecords, options) {
	const encoder = getOtlpEncoder(options);
	return {
		resourceLogs: logRecordsToResourceLogs(logRecords, encoder),
	};
}
function createResourceMap$1(logRecords) {
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
	const resourceMap = createResourceMap$1(logRecords);
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

const JsonMetricsSerializer = {
	serializeRequest: (arg) => {
		const request = createExportMetricsServiceRequest([arg], {
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

function sdkSpanToOtlpSpan(span, encoder) {
	const ctx = span.spanContext();
	const status = span.status;
	const parentSpanId = span.parentSpanContext?.spanId
		? encoder.encodeSpanContext(span.parentSpanContext?.spanId)
		: undefined;
	return {
		traceId: encoder.encodeSpanContext(ctx.traceId),
		spanId: encoder.encodeSpanContext(ctx.spanId),
		parentSpanId: parentSpanId,
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
function createExportTraceServiceRequest(spans, options) {
	const encoder = getOtlpEncoder(options);
	return {
		resourceSpans: spanRecordsToResourceSpans(spans, encoder),
	};
}
function createResourceMap(readableSpans) {
	const resourceMap = new Map();
	for (const record of readableSpans) {
		let ilsMap = resourceMap.get(record.resource);
		if (!ilsMap) {
			ilsMap = new Map();
			resourceMap.set(record.resource, ilsMap);
		}
		const instrumentationScopeKey = `${record.instrumentationScope.name}@${record.instrumentationScope.version || ''}:${record.instrumentationScope.schemaUrl || ''}`;
		let records = ilsMap.get(instrumentationScopeKey);
		if (!records) {
			records = [];
			ilsMap.set(instrumentationScopeKey, records);
		}
		records.push(record);
	}
	return resourceMap;
}
function spanRecordsToResourceSpans(readableSpans, encoder) {
	const resourceMap = createResourceMap(readableSpans);
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
					scope: createInstrumentationScope(scopeSpans[0].instrumentationScope),
					spans: spans,
					schemaUrl: scopeSpans[0].instrumentationScope.schemaUrl,
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

export { JsonLogsSerializer, JsonMetricsSerializer, JsonTraceSerializer, ProtobufLogsSerializer, ProtobufMetricsSerializer, ProtobufTraceSerializer };
