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
/// <reference types="./propagator-b3.d.ts" />

import { isTracingSuppressed } from './core.js';
import { createContextKey, trace, isSpanContextValid, TraceFlags, isValidTraceId, isValidSpanId } from './api.js';

const B3_DEBUG_FLAG_KEY = createContextKey('OpenTelemetry Context Key B3 Debug Flag');

const B3_CONTEXT_HEADER = 'b3';
const X_B3_TRACE_ID = 'x-b3-traceid';
const X_B3_SPAN_ID = 'x-b3-spanid';
const X_B3_SAMPLED = 'x-b3-sampled';
const X_B3_PARENT_SPAN_ID = 'x-b3-parentspanid';
const X_B3_FLAGS = 'x-b3-flags';

const VALID_SAMPLED_VALUES = new Set([true, 'true', 'True', '1', 1]);
const VALID_UNSAMPLED_VALUES = new Set([false, 'false', 'False', '0', 0]);
function isValidSampledValue(sampled) {
	return sampled === TraceFlags.SAMPLED || sampled === TraceFlags.NONE;
}
function parseHeader(header) {
	return Array.isArray(header) ? header[0] : header;
}
function getHeaderValue(carrier, getter, key) {
	const header = getter.get(carrier, key);
	return parseHeader(header);
}
function getTraceId(carrier, getter) {
	const traceId = getHeaderValue(carrier, getter, X_B3_TRACE_ID);
	if (typeof traceId === 'string') {
		return traceId.padStart(32, '0');
	}
	return '';
}
function getSpanId(carrier, getter) {
	const spanId = getHeaderValue(carrier, getter, X_B3_SPAN_ID);
	if (typeof spanId === 'string') {
		return spanId;
	}
	return '';
}
function getDebug(carrier, getter) {
	const debug = getHeaderValue(carrier, getter, X_B3_FLAGS);
	return debug === '1' ? '1' : undefined;
}
function getTraceFlags(carrier, getter) {
	const traceFlags = getHeaderValue(carrier, getter, X_B3_SAMPLED);
	const debug = getDebug(carrier, getter);
	if (debug === '1' || VALID_SAMPLED_VALUES.has(traceFlags)) {
		return TraceFlags.SAMPLED;
	}
	if (traceFlags === undefined || VALID_UNSAMPLED_VALUES.has(traceFlags)) {
		return TraceFlags.NONE;
	}
	return;
}
class B3MultiPropagator {
	inject(context, carrier, setter) {
		const spanContext = trace.getSpanContext(context);
		if (!spanContext ||
			!isSpanContextValid(spanContext) ||
			isTracingSuppressed(context))
			return;
		const debug = context.getValue(B3_DEBUG_FLAG_KEY);
		setter.set(carrier, X_B3_TRACE_ID, spanContext.traceId);
		setter.set(carrier, X_B3_SPAN_ID, spanContext.spanId);
		if (debug === '1') {
			setter.set(carrier, X_B3_FLAGS, debug);
		}
		else if (spanContext.traceFlags !== undefined) {
			setter.set(carrier, X_B3_SAMPLED, (TraceFlags.SAMPLED & spanContext.traceFlags) === TraceFlags.SAMPLED
				? '1'
				: '0');
		}
	}
	extract(context, carrier, getter) {
		const traceId = getTraceId(carrier, getter);
		const spanId = getSpanId(carrier, getter);
		const traceFlags = getTraceFlags(carrier, getter);
		const debug = getDebug(carrier, getter);
		if (isValidTraceId(traceId) &&
			isValidSpanId(spanId) &&
			isValidSampledValue(traceFlags)) {
			context = context.setValue(B3_DEBUG_FLAG_KEY, debug);
			return trace.setSpanContext(context, {
				traceId,
				spanId,
				isRemote: true,
				traceFlags,
			});
		}
		return context;
	}
	fields() {
		return [
			X_B3_TRACE_ID,
			X_B3_SPAN_ID,
			X_B3_FLAGS,
			X_B3_SAMPLED,
			X_B3_PARENT_SPAN_ID,
		];
	}
}

const B3_CONTEXT_REGEX = /((?:[0-9a-f]{16}){1,2})-([0-9a-f]{16})(?:-([01d](?![0-9a-f])))?(?:-([0-9a-f]{16}))?/;
const PADDING = '0'.repeat(16);
const SAMPLED_VALUES = new Set(['d', '1']);
const DEBUG_STATE = 'd';
function convertToTraceId128(traceId) {
	return traceId.length === 32 ? traceId : `${PADDING}${traceId}`;
}
function convertToTraceFlags(samplingState) {
	if (samplingState && SAMPLED_VALUES.has(samplingState)) {
		return TraceFlags.SAMPLED;
	}
	return TraceFlags.NONE;
}
class B3SinglePropagator {
	inject(context, carrier, setter) {
		const spanContext = trace.getSpanContext(context);
		if (!spanContext ||
			!isSpanContextValid(spanContext) ||
			isTracingSuppressed(context))
			return;
		const samplingState = context.getValue(B3_DEBUG_FLAG_KEY) || spanContext.traceFlags & 0x1;
		const value = `${spanContext.traceId}-${spanContext.spanId}-${samplingState}`;
		setter.set(carrier, B3_CONTEXT_HEADER, value);
	}
	extract(context, carrier, getter) {
		const header = getter.get(carrier, B3_CONTEXT_HEADER);
		const b3Context = Array.isArray(header) ? header[0] : header;
		if (typeof b3Context !== 'string')
			return context;
		const match = b3Context.match(B3_CONTEXT_REGEX);
		if (!match)
			return context;
		const [, extractedTraceId, spanId, samplingState] = match;
		const traceId = convertToTraceId128(extractedTraceId);
		if (!isValidTraceId(traceId) || !isValidSpanId(spanId))
			return context;
		const traceFlags = convertToTraceFlags(samplingState);
		if (samplingState === DEBUG_STATE) {
			context = context.setValue(B3_DEBUG_FLAG_KEY, samplingState);
		}
		return trace.setSpanContext(context, {
			traceId,
			spanId,
			isRemote: true,
			traceFlags,
		});
	}
	fields() {
		return [B3_CONTEXT_HEADER];
	}
}

var B3InjectEncoding;
(function (B3InjectEncoding) {
	B3InjectEncoding[B3InjectEncoding["SINGLE_HEADER"] = 0] = "SINGLE_HEADER";
	B3InjectEncoding[B3InjectEncoding["MULTI_HEADER"] = 1] = "MULTI_HEADER";
})(B3InjectEncoding || (B3InjectEncoding = {}));

class B3Propagator {
	_b3MultiPropagator = new B3MultiPropagator();
	_b3SinglePropagator = new B3SinglePropagator();
	_inject;
	_fields;
	constructor(config = {}) {
		if (config.injectEncoding === B3InjectEncoding.MULTI_HEADER) {
			this._inject = this._b3MultiPropagator.inject;
			this._fields = this._b3MultiPropagator.fields();
		}
		else {
			this._inject = this._b3SinglePropagator.inject;
			this._fields = this._b3SinglePropagator.fields();
		}
	}
	inject(context, carrier, setter) {
		if (isTracingSuppressed(context)) {
			return;
		}
		this._inject(context, carrier, setter);
	}
	extract(context, carrier, getter) {
		const header = getter.get(carrier, B3_CONTEXT_HEADER);
		const b3Context = Array.isArray(header) ? header[0] : header;
		if (b3Context) {
			return this._b3SinglePropagator.extract(context, carrier, getter);
		}
		else {
			return this._b3MultiPropagator.extract(context, carrier, getter);
		}
	}
	fields() {
		return this._fields;
	}
}

export { B3InjectEncoding, B3Propagator, B3_CONTEXT_HEADER, X_B3_FLAGS, X_B3_PARENT_SPAN_ID, X_B3_SAMPLED, X_B3_SPAN_ID, X_B3_TRACE_ID };
