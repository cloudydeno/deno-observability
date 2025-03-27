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
/// <reference types="./core.d.ts" />

import { createContextKey, baggageEntryMetadataFromString, propagation, diag, trace, isSpanContextValid, TraceFlags, DiagLogLevel, context } from './api.js';
import { SEMRESATTRS_TELEMETRY_SDK_NAME, SEMRESATTRS_PROCESS_RUNTIME_NAME, SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, TELEMETRYSDKLANGUAGEVALUES_NODEJS, SEMRESATTRS_TELEMETRY_SDK_VERSION } from './semantic-conventions.js';

const SUPPRESS_TRACING_KEY = createContextKey('OpenTelemetry SDK Context Key SUPPRESS_TRACING');
function suppressTracing(context) {
	return context.setValue(SUPPRESS_TRACING_KEY, true);
}
function unsuppressTracing(context) {
	return context.deleteValue(SUPPRESS_TRACING_KEY);
}
function isTracingSuppressed(context) {
	return context.getValue(SUPPRESS_TRACING_KEY) === true;
}

const BAGGAGE_KEY_PAIR_SEPARATOR = '=';
const BAGGAGE_PROPERTIES_SEPARATOR = ';';
const BAGGAGE_ITEMS_SEPARATOR = ',';
const BAGGAGE_HEADER = 'baggage';
const BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
const BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
const BAGGAGE_MAX_TOTAL_LENGTH = 8192;

function serializeKeyPairs(keyPairs) {
	return keyPairs.reduce((hValue, current) => {
		const value = `${hValue}${hValue !== '' ? BAGGAGE_ITEMS_SEPARATOR : ''}${current}`;
		return value.length > BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
	}, '');
}
function getKeyPairs(baggage) {
	return baggage.getAllEntries().map(([key, value]) => {
		let entry = `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
		if (value.metadata !== undefined) {
			entry += BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
		}
		return entry;
	});
}
function parsePairKeyValue(entry) {
	const valueProps = entry.split(BAGGAGE_PROPERTIES_SEPARATOR);
	if (valueProps.length <= 0)
		return;
	const keyPairPart = valueProps.shift();
	if (!keyPairPart)
		return;
	const separatorIndex = keyPairPart.indexOf(BAGGAGE_KEY_PAIR_SEPARATOR);
	if (separatorIndex <= 0)
		return;
	const key = decodeURIComponent(keyPairPart.substring(0, separatorIndex).trim());
	const value = decodeURIComponent(keyPairPart.substring(separatorIndex + 1).trim());
	let metadata;
	if (valueProps.length > 0) {
		metadata = baggageEntryMetadataFromString(valueProps.join(BAGGAGE_PROPERTIES_SEPARATOR));
	}
	return { key, value, metadata };
}
function parseKeyPairsIntoRecord(value) {
	if (typeof value !== 'string' || value.length === 0)
		return {};
	return value
		.split(BAGGAGE_ITEMS_SEPARATOR)
		.map(entry => {
		return parsePairKeyValue(entry);
	})
		.filter(keyPair => keyPair !== undefined && keyPair.value.length > 0)
		.reduce((headers, keyPair) => {
		headers[keyPair.key] = keyPair.value;
		return headers;
	}, {});
}

class W3CBaggagePropagator {
	inject(context, carrier, setter) {
		const baggage = propagation.getBaggage(context);
		if (!baggage || isTracingSuppressed(context))
			return;
		const keyPairs = getKeyPairs(baggage)
			.filter((pair) => {
			return pair.length <= BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
		})
			.slice(0, BAGGAGE_MAX_NAME_VALUE_PAIRS);
		const headerValue = serializeKeyPairs(keyPairs);
		if (headerValue.length > 0) {
			setter.set(carrier, BAGGAGE_HEADER, headerValue);
		}
	}
	extract(context, carrier, getter) {
		const headerValue = getter.get(carrier, BAGGAGE_HEADER);
		const baggageString = Array.isArray(headerValue)
			? headerValue.join(BAGGAGE_ITEMS_SEPARATOR)
			: headerValue;
		if (!baggageString)
			return context;
		const baggage = {};
		if (baggageString.length === 0) {
			return context;
		}
		const pairs = baggageString.split(BAGGAGE_ITEMS_SEPARATOR);
		pairs.forEach(entry => {
			const keyPair = parsePairKeyValue(entry);
			if (keyPair) {
				const baggageEntry = { value: keyPair.value };
				if (keyPair.metadata) {
					baggageEntry.metadata = keyPair.metadata;
				}
				baggage[keyPair.key] = baggageEntry;
			}
		});
		if (Object.entries(baggage).length === 0) {
			return context;
		}
		return propagation.setBaggage(context, propagation.createBaggage(baggage));
	}
	fields() {
		return [BAGGAGE_HEADER];
	}
}

class AnchoredClock {
	_monotonicClock;
	_epochMillis;
	_performanceMillis;
	constructor(systemClock, monotonicClock) {
		this._monotonicClock = monotonicClock;
		this._epochMillis = systemClock.now();
		this._performanceMillis = monotonicClock.now();
	}
	now() {
		const delta = this._monotonicClock.now() - this._performanceMillis;
		return this._epochMillis + delta;
	}
}

function sanitizeAttributes(attributes) {
	const out = {};
	if (typeof attributes !== 'object' || attributes == null) {
		return out;
	}
	for (const [key, val] of Object.entries(attributes)) {
		if (!isAttributeKey(key)) {
			diag.warn(`Invalid attribute key: ${key}`);
			continue;
		}
		if (!isAttributeValue(val)) {
			diag.warn(`Invalid attribute value set for key: ${key}`);
			continue;
		}
		if (Array.isArray(val)) {
			out[key] = val.slice();
		}
		else {
			out[key] = val;
		}
	}
	return out;
}
function isAttributeKey(key) {
	return typeof key === 'string' && key.length > 0;
}
function isAttributeValue(val) {
	if (val == null) {
		return true;
	}
	if (Array.isArray(val)) {
		return isHomogeneousAttributeValueArray(val);
	}
	return isValidPrimitiveAttributeValue(val);
}
function isHomogeneousAttributeValueArray(arr) {
	let type;
	for (const element of arr) {
		if (element == null)
			continue;
		if (!type) {
			if (isValidPrimitiveAttributeValue(element)) {
				type = typeof element;
				continue;
			}
			return false;
		}
		if (typeof element === type) {
			continue;
		}
		return false;
	}
	return true;
}
function isValidPrimitiveAttributeValue(val) {
	switch (typeof val) {
		case 'number':
		case 'boolean':
		case 'string':
			return true;
	}
	return false;
}

function loggingErrorHandler() {
	return (ex) => {
		diag.error(stringifyException(ex));
	};
}
function stringifyException(ex) {
	if (typeof ex === 'string') {
		return ex;
	}
	else {
		return JSON.stringify(flattenException(ex));
	}
}
function flattenException(ex) {
	const result = {};
	let current = ex;
	while (current !== null) {
		Object.getOwnPropertyNames(current).forEach(propertyName => {
			if (result[propertyName])
				return;
			const value = current[propertyName];
			if (value) {
				result[propertyName] = String(value);
			}
		});
		current = Object.getPrototypeOf(current);
	}
	return result;
}

let delegateHandler = loggingErrorHandler();
function setGlobalErrorHandler(handler) {
	delegateHandler = handler;
}
function globalErrorHandler(ex) {
	try {
		delegateHandler(ex);
	}
	catch { }
}

function getNumberFromEnv(key) {
	const raw = Deno.env.get(key);
	if (raw == null || raw.trim() === '') {
		return undefined;
	}
	const value = Number(raw);
	if (isNaN(value)) {
		diag.warn(`Unknown value ${JSON.stringify(raw)} for ${key}, expected a number, using defaults`);
		return undefined;
	}
	return value;
}
function getStringFromEnv(key) {
	const raw = Deno.env.get(key);
	if (raw == null || raw.trim() === '') {
		return undefined;
	}
	return raw;
}
function getBooleanFromEnv(key) {
	const raw = Deno.env.get(key)?.trim().toLowerCase();
	if (raw == null || raw === '') {
		return false;
	}
	if (raw === 'true') {
		return true;
	}
	else if (raw === 'false') {
		return false;
	}
	else {
		diag.warn(`Unknown value ${JSON.stringify(raw)} for ${key}, expected 'true' or 'false', falling back to 'false' (default)`);
		return false;
	}
}
function getStringListFromEnv(key) {
	return getStringFromEnv(key)
		?.split(',')
		.map(v => v.trim())
		.filter(s => s !== '');
}

const _globalThis = typeof globalThis === 'object' ? globalThis : global;

const otperformance = performance;

const VERSION$1 = "2.0.0";

const SDK_INFO = {
	[SEMRESATTRS_TELEMETRY_SDK_NAME]: 'opentelemetry',
	[SEMRESATTRS_PROCESS_RUNTIME_NAME]: 'deno',
	[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE]: TELEMETRYSDKLANGUAGEVALUES_NODEJS,
	[SEMRESATTRS_TELEMETRY_SDK_VERSION]: VERSION$1,
};

function unrefTimer(timer) {
	Deno.unrefTimer?.(timer);
}

const NANOSECOND_DIGITS = 9;
const NANOSECOND_DIGITS_IN_MILLIS = 6;
const MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
const SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
function millisToHrTime(epochMillis) {
	const epochSeconds = epochMillis / 1000;
	const seconds = Math.trunc(epochSeconds);
	const nanos = Math.round((epochMillis % 1000) * MILLISECONDS_TO_NANOSECONDS);
	return [seconds, nanos];
}
function getTimeOrigin() {
	let timeOrigin = otperformance.timeOrigin;
	if (typeof timeOrigin !== 'number') {
		const perf = otperformance;
		timeOrigin = perf.timing && perf.timing.fetchStart;
	}
	return timeOrigin;
}
function hrTime(performanceNow) {
	const timeOrigin = millisToHrTime(getTimeOrigin());
	const now = millisToHrTime(typeof performanceNow === 'number' ? performanceNow : otperformance.now());
	return addHrTimes(timeOrigin, now);
}
function timeInputToHrTime(time) {
	if (isTimeInputHrTime(time)) {
		return time;
	}
	else if (typeof time === 'number') {
		if (time < getTimeOrigin()) {
			return hrTime(time);
		}
		else {
			return millisToHrTime(time);
		}
	}
	else if (time instanceof Date) {
		return millisToHrTime(time.getTime());
	}
	else {
		throw TypeError('Invalid input type');
	}
}
function hrTimeDuration(startTime, endTime) {
	let seconds = endTime[0] - startTime[0];
	let nanos = endTime[1] - startTime[1];
	if (nanos < 0) {
		seconds -= 1;
		nanos += SECOND_TO_NANOSECONDS;
	}
	return [seconds, nanos];
}
function hrTimeToTimeStamp(time) {
	const precision = NANOSECOND_DIGITS;
	const tmp = `${'0'.repeat(precision)}${time[1]}Z`;
	const nanoString = tmp.substring(tmp.length - precision - 1);
	const date = new Date(time[0] * 1000).toISOString();
	return date.replace('000Z', nanoString);
}
function hrTimeToNanoseconds(time) {
	return time[0] * SECOND_TO_NANOSECONDS + time[1];
}
function hrTimeToMilliseconds(time) {
	return time[0] * 1e3 + time[1] / 1e6;
}
function hrTimeToMicroseconds(time) {
	return time[0] * 1e6 + time[1] / 1e3;
}
function isTimeInputHrTime(value) {
	return (Array.isArray(value) &&
		value.length === 2 &&
		typeof value[0] === 'number' &&
		typeof value[1] === 'number');
}
function isTimeInput(value) {
	return (isTimeInputHrTime(value) ||
		typeof value === 'number' ||
		value instanceof Date);
}
function addHrTimes(time1, time2) {
	const out = [time1[0] + time2[0], time1[1] + time2[1]];
	if (out[1] >= SECOND_TO_NANOSECONDS) {
		out[1] -= SECOND_TO_NANOSECONDS;
		out[0] += 1;
	}
	return out;
}

var ExportResultCode;
(function (ExportResultCode) {
	ExportResultCode[ExportResultCode["SUCCESS"] = 0] = "SUCCESS";
	ExportResultCode[ExportResultCode["FAILED"] = 1] = "FAILED";
})(ExportResultCode || (ExportResultCode = {}));

class CompositePropagator {
	_propagators;
	_fields;
	constructor(config = {}) {
		this._propagators = config.propagators ?? [];
		this._fields = Array.from(new Set(this._propagators
			.map(p => (typeof p.fields === 'function' ? p.fields() : []))
			.reduce((x, y) => x.concat(y), [])));
	}
	inject(context, carrier, setter) {
		for (const propagator of this._propagators) {
			try {
				propagator.inject(context, carrier, setter);
			}
			catch (err) {
				diag.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
			}
		}
	}
	extract(context, carrier, getter) {
		return this._propagators.reduce((ctx, propagator) => {
			try {
				return propagator.extract(ctx, carrier, getter);
			}
			catch (err) {
				diag.warn(`Failed to extract with ${propagator.constructor.name}. Err: ${err.message}`);
			}
			return ctx;
		}, context);
	}
	fields() {
		return this._fields.slice();
	}
}

const VALID_KEY_CHAR_RANGE = '[_0-9a-z-*/]';
const VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
const VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
const VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
const VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
const INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
function validateKey(key) {
	return VALID_KEY_REGEX.test(key);
}
function validateValue(value) {
	return (VALID_VALUE_BASE_REGEX.test(value) &&
		!INVALID_VALUE_COMMA_EQUAL_REGEX.test(value));
}

const MAX_TRACE_STATE_ITEMS = 32;
const MAX_TRACE_STATE_LEN = 512;
const LIST_MEMBERS_SEPARATOR = ',';
const LIST_MEMBER_KEY_VALUE_SPLITTER = '=';
class TraceState {
	_internalState = new Map();
	constructor(rawTraceState) {
		if (rawTraceState)
			this._parse(rawTraceState);
	}
	set(key, value) {
		const traceState = this._clone();
		if (traceState._internalState.has(key)) {
			traceState._internalState.delete(key);
		}
		traceState._internalState.set(key, value);
		return traceState;
	}
	unset(key) {
		const traceState = this._clone();
		traceState._internalState.delete(key);
		return traceState;
	}
	get(key) {
		return this._internalState.get(key);
	}
	serialize() {
		return this._keys()
			.reduce((agg, key) => {
			agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
			return agg;
		}, [])
			.join(LIST_MEMBERS_SEPARATOR);
	}
	_parse(rawTraceState) {
		if (rawTraceState.length > MAX_TRACE_STATE_LEN)
			return;
		this._internalState = rawTraceState
			.split(LIST_MEMBERS_SEPARATOR)
			.reverse()
			.reduce((agg, part) => {
			const listMember = part.trim();
			const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
			if (i !== -1) {
				const key = listMember.slice(0, i);
				const value = listMember.slice(i + 1, part.length);
				if (validateKey(key) && validateValue(value)) {
					agg.set(key, value);
				}
			}
			return agg;
		}, new Map());
		if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
			this._internalState = new Map(Array.from(this._internalState.entries())
				.reverse()
				.slice(0, MAX_TRACE_STATE_ITEMS));
		}
	}
	_keys() {
		return Array.from(this._internalState.keys()).reverse();
	}
	_clone() {
		const traceState = new TraceState();
		traceState._internalState = new Map(this._internalState);
		return traceState;
	}
}

const TRACE_PARENT_HEADER = 'traceparent';
const TRACE_STATE_HEADER = 'tracestate';
const VERSION = '00';
const VERSION_PART = '(?!ff)[\\da-f]{2}';
const TRACE_ID_PART = '(?![0]{32})[\\da-f]{32}';
const PARENT_ID_PART = '(?![0]{16})[\\da-f]{16}';
const FLAGS_PART = '[\\da-f]{2}';
const TRACE_PARENT_REGEX = new RegExp(`^\\s?(${VERSION_PART})-(${TRACE_ID_PART})-(${PARENT_ID_PART})-(${FLAGS_PART})(-.*)?\\s?$`);
function parseTraceParent(traceParent) {
	const match = TRACE_PARENT_REGEX.exec(traceParent);
	if (!match)
		return null;
	if (match[1] === '00' && match[5])
		return null;
	return {
		traceId: match[2],
		spanId: match[3],
		traceFlags: parseInt(match[4], 16),
	};
}
class W3CTraceContextPropagator {
	inject(context, carrier, setter) {
		const spanContext = trace.getSpanContext(context);
		if (!spanContext ||
			isTracingSuppressed(context) ||
			!isSpanContextValid(spanContext))
			return;
		const traceParent = `${VERSION}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || TraceFlags.NONE).toString(16)}`;
		setter.set(carrier, TRACE_PARENT_HEADER, traceParent);
		if (spanContext.traceState) {
			setter.set(carrier, TRACE_STATE_HEADER, spanContext.traceState.serialize());
		}
	}
	extract(context, carrier, getter) {
		const traceParentHeader = getter.get(carrier, TRACE_PARENT_HEADER);
		if (!traceParentHeader)
			return context;
		const traceParent = Array.isArray(traceParentHeader)
			? traceParentHeader[0]
			: traceParentHeader;
		if (typeof traceParent !== 'string')
			return context;
		const spanContext = parseTraceParent(traceParent);
		if (!spanContext)
			return context;
		spanContext.isRemote = true;
		const traceStateHeader = getter.get(carrier, TRACE_STATE_HEADER);
		if (traceStateHeader) {
			const state = Array.isArray(traceStateHeader)
				? traceStateHeader.join(',')
				: traceStateHeader;
			spanContext.traceState = new TraceState(typeof state === 'string' ? state : undefined);
		}
		return trace.setSpanContext(context, spanContext);
	}
	fields() {
		return [TRACE_PARENT_HEADER, TRACE_STATE_HEADER];
	}
}

const RPC_METADATA_KEY = createContextKey('OpenTelemetry SDK Context Key RPC_METADATA');
var RPCType;
(function (RPCType) {
	RPCType["HTTP"] = "http";
})(RPCType || (RPCType = {}));
function setRPCMetadata(context, meta) {
	return context.setValue(RPC_METADATA_KEY, meta);
}
function deleteRPCMetadata(context) {
	return context.deleteValue(RPC_METADATA_KEY);
}
function getRPCMetadata(context) {
	return context.getValue(RPC_METADATA_KEY);
}

const objectTag = '[object Object]';
const nullTag = '[object Null]';
const undefinedTag = '[object Undefined]';
const funcProto = Function.prototype;
const funcToString = funcProto.toString;
const objectCtorString = funcToString.call(Object);
const getPrototypeOf = Object.getPrototypeOf;
const objectProto = Object.prototype;
const hasOwnProperty = objectProto.hasOwnProperty;
const symToStringTag = Symbol ? Symbol.toStringTag : undefined;
const nativeObjectToString = objectProto.toString;
function isPlainObject(value) {
	if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
		return false;
	}
	const proto = getPrototypeOf(value);
	if (proto === null) {
		return true;
	}
	const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	return (typeof Ctor == 'function' &&
		Ctor instanceof Ctor &&
		funcToString.call(Ctor) === objectCtorString);
}
function isObjectLike(value) {
	return value != null && typeof value == 'object';
}
function baseGetTag(value) {
	if (value == null) {
		return value === undefined ? undefinedTag : nullTag;
	}
	return symToStringTag && symToStringTag in Object(value)
		? getRawTag(value)
		: objectToString(value);
}
function getRawTag(value) {
	const isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
	let unmasked = false;
	try {
		value[symToStringTag] = undefined;
		unmasked = true;
	}
	catch (e) {
	}
	const result = nativeObjectToString.call(value);
	if (unmasked) {
		if (isOwn) {
			value[symToStringTag] = tag;
		}
		else {
			delete value[symToStringTag];
		}
	}
	return result;
}
function objectToString(value) {
	return nativeObjectToString.call(value);
}

const MAX_LEVEL = 20;
function merge(...args) {
	let result = args.shift();
	const objects = new WeakMap();
	while (args.length > 0) {
		result = mergeTwoObjects(result, args.shift(), 0, objects);
	}
	return result;
}
function takeValue(value) {
	if (isArray(value)) {
		return value.slice();
	}
	return value;
}
function mergeTwoObjects(one, two, level = 0, objects) {
	let result;
	if (level > MAX_LEVEL) {
		return undefined;
	}
	level++;
	if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
		result = takeValue(two);
	}
	else if (isArray(one)) {
		result = one.slice();
		if (isArray(two)) {
			for (let i = 0, j = two.length; i < j; i++) {
				result.push(takeValue(two[i]));
			}
		}
		else if (isObject(two)) {
			const keys = Object.keys(two);
			for (let i = 0, j = keys.length; i < j; i++) {
				const key = keys[i];
				result[key] = takeValue(two[key]);
			}
		}
	}
	else if (isObject(one)) {
		if (isObject(two)) {
			if (!shouldMerge(one, two)) {
				return two;
			}
			result = Object.assign({}, one);
			const keys = Object.keys(two);
			for (let i = 0, j = keys.length; i < j; i++) {
				const key = keys[i];
				const twoValue = two[key];
				if (isPrimitive(twoValue)) {
					if (typeof twoValue === 'undefined') {
						delete result[key];
					}
					else {
						result[key] = twoValue;
					}
				}
				else {
					const obj1 = result[key];
					const obj2 = twoValue;
					if (wasObjectReferenced(one, key, objects) ||
						wasObjectReferenced(two, key, objects)) {
						delete result[key];
					}
					else {
						if (isObject(obj1) && isObject(obj2)) {
							const arr1 = objects.get(obj1) || [];
							const arr2 = objects.get(obj2) || [];
							arr1.push({ obj: one, key });
							arr2.push({ obj: two, key });
							objects.set(obj1, arr1);
							objects.set(obj2, arr2);
						}
						result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
					}
				}
			}
		}
		else {
			result = two;
		}
	}
	return result;
}
function wasObjectReferenced(obj, key, objects) {
	const arr = objects.get(obj[key]) || [];
	for (let i = 0, j = arr.length; i < j; i++) {
		const info = arr[i];
		if (info.key === key && info.obj === obj) {
			return true;
		}
	}
	return false;
}
function isArray(value) {
	return Array.isArray(value);
}
function isFunction(value) {
	return typeof value === 'function';
}
function isObject(value) {
	return (!isPrimitive(value) &&
		!isArray(value) &&
		!isFunction(value) &&
		typeof value === 'object');
}
function isPrimitive(value) {
	return (typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		typeof value === 'undefined' ||
		value instanceof Date ||
		value instanceof RegExp ||
		value === null);
}
function shouldMerge(one, two) {
	if (!isPlainObject(one) || !isPlainObject(two)) {
		return false;
	}
	return true;
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

function urlMatches(url, urlToMatch) {
	if (typeof urlToMatch === 'string') {
		return url === urlToMatch;
	}
	else {
		return !!url.match(urlToMatch);
	}
}
function isUrlIgnored(url, ignoredUrls) {
	if (!ignoredUrls) {
		return false;
	}
	for (const ignoreUrl of ignoredUrls) {
		if (urlMatches(url, ignoreUrl)) {
			return true;
		}
	}
	return false;
}

class Deferred {
	_promise;
	_resolve;
	_reject;
	constructor() {
		this._promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}
	get promise() {
		return this._promise;
	}
	resolve(val) {
		this._resolve(val);
	}
	reject(err) {
		this._reject(err);
	}
}

class BindOnceFuture {
	_callback;
	_that;
	_isCalled = false;
	_deferred = new Deferred();
	constructor(_callback, _that) {
		this._callback = _callback;
		this._that = _that;
	}
	get isCalled() {
		return this._isCalled;
	}
	get promise() {
		return this._deferred.promise;
	}
	call(...args) {
		if (!this._isCalled) {
			this._isCalled = true;
			try {
				Promise.resolve(this._callback.call(this._that, ...args)).then(val => this._deferred.resolve(val), err => this._deferred.reject(err));
			}
			catch (err) {
				this._deferred.reject(err);
			}
		}
		return this._deferred.promise;
	}
}

const logLevelMap = {
	ALL: DiagLogLevel.ALL,
	VERBOSE: DiagLogLevel.VERBOSE,
	DEBUG: DiagLogLevel.DEBUG,
	INFO: DiagLogLevel.INFO,
	WARN: DiagLogLevel.WARN,
	ERROR: DiagLogLevel.ERROR,
	NONE: DiagLogLevel.NONE,
};
function diagLogLevelFromString(value) {
	if (value == null) {
		return undefined;
	}
	const resolvedLogLevel = logLevelMap[value.toUpperCase()];
	if (resolvedLogLevel == null) {
		diag.warn(`Unknown log level "${value}", expected one of ${Object.keys(logLevelMap)}, using default`);
		return DiagLogLevel.INFO;
	}
	return resolvedLogLevel;
}

function _export(exporter, arg) {
	return new Promise(resolve => {
		context.with(suppressTracing(context.active()), () => {
			exporter.export(arg, (result) => {
				resolve(result);
			});
		});
	});
}

const internal = {
	_export,
};

export { AnchoredClock, BindOnceFuture, CompositePropagator, ExportResultCode, RPCType, SDK_INFO, TRACE_PARENT_HEADER, TRACE_STATE_HEADER, TimeoutError, TraceState, W3CBaggagePropagator, W3CTraceContextPropagator, _globalThis, addHrTimes, callWithTimeout, deleteRPCMetadata, diagLogLevelFromString, getBooleanFromEnv, getNumberFromEnv, getRPCMetadata, getStringFromEnv, getStringListFromEnv, getTimeOrigin, globalErrorHandler, hrTime, hrTimeDuration, hrTimeToMicroseconds, hrTimeToMilliseconds, hrTimeToNanoseconds, hrTimeToTimeStamp, internal, isAttributeValue, isTimeInput, isTimeInputHrTime, isTracingSuppressed, isUrlIgnored, loggingErrorHandler, merge, millisToHrTime, otperformance, parseKeyPairsIntoRecord, parseTraceParent, sanitizeAttributes, setGlobalErrorHandler, setRPCMetadata, suppressTracing, timeInputToHrTime, unrefTimer, unsuppressTracing, urlMatches };
