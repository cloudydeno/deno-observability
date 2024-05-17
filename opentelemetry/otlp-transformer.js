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

import { hexToBase64, hrTimeToNanoseconds } from './core.js';
import { ValueType } from './api.js';
import { DataPointType, AggregationTemporality } from './sdk-metrics.js';

const NANOSECONDS = BigInt(1000000000);
function hrTimeToNanos(hrTime) {
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
function optionalHexToBase64(str) {
	if (str === undefined)
		return undefined;
	return hexToBase64(str);
}
const DEFAULT_ENCODER = {
	encodeHrTime: encodeAsLongBits,
	encodeSpanContext: hexToBase64,
	encodeOptionalSpanContext: optionalHexToBase64,
};
function getOtlpEncoder(options) {
	if (options === undefined) {
		return DEFAULT_ENCODER;
	}
	const useLongBits = options.useLongBits ?? true;
	const useHex = options.useHex ?? false;
	return {
		encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
		encodeSpanContext: useHex ? identity : hexToBase64,
		encodeOptionalSpanContext: useHex ? identity : optionalHexToBase64,
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
				const { name, version, schemaUrl } = scopeSpans[0].instrumentationLibrary;
				const spans = scopeSpans.map(readableSpan => sdkSpanToOtlpSpan(readableSpan, encoder));
				scopeResourceSpans.push({
					scope: { name, version },
					spans: spans,
					schemaUrl: schemaUrl,
				});
			}
			ilmEntry = ilmIterator.next();
		}
		const transformedSpans = {
			resource: {
				attributes: toAttributes(resource.attributes),
				droppedAttributesCount: 0,
			},
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
		resource: {
			attributes: toAttributes(resourceMetrics.resource.attributes),
			droppedAttributesCount: 0,
		},
		schemaUrl: undefined,
		scopeMetrics: toScopeMetrics(resourceMetrics.scopeMetrics, encoder),
	};
}
function toScopeMetrics(scopeMetrics, encoder) {
	return Array.from(scopeMetrics.map(metrics => ({
		scope: {
			name: metrics.scope.name,
			version: metrics.scope.version,
		},
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
		resource: {
			attributes: toAttributes(resource.attributes),
			droppedAttributesCount: 0,
		},
		scopeLogs: Array.from(ismMap, ([, scopeLogs]) => {
			const { instrumentationScope: { name, version, schemaUrl }, } = scopeLogs[0];
			return {
				scope: { name, version },
				logRecords: scopeLogs.map(log => toLogRecord(log, encoder)),
				schemaUrl,
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
		droppedAttributesCount: 0,
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

export { ESpanKind, createExportLogsServiceRequest, createExportMetricsServiceRequest, createExportTraceServiceRequest, encodeAsLongBits, encodeAsString, getOtlpEncoder, hrTimeToNanos, toLongBits };
