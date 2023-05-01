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
/// <reference types="./api.d.ts" />

const _globalThis = typeof globalThis === 'object' ? globalThis : global;

const VERSION = "1.4.1";

const re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function _makeCompatibilityCheck(ownVersion) {
	const acceptedVersions = new Set([ownVersion]);
	const rejectedVersions = new Set();
	const myVersionMatch = ownVersion.match(re);
	if (!myVersionMatch) {
		return () => false;
	}
	const ownVersionParsed = {
		major: +myVersionMatch[1],
		minor: +myVersionMatch[2],
		patch: +myVersionMatch[3],
		prerelease: myVersionMatch[4],
	};
	if (ownVersionParsed.prerelease != null) {
		return function isExactmatch(globalVersion) {
			return globalVersion === ownVersion;
		};
	}
	function _reject(v) {
		rejectedVersions.add(v);
		return false;
	}
	function _accept(v) {
		acceptedVersions.add(v);
		return true;
	}
	return function isCompatible(globalVersion) {
		if (acceptedVersions.has(globalVersion)) {
			return true;
		}
		if (rejectedVersions.has(globalVersion)) {
			return false;
		}
		const globalVersionMatch = globalVersion.match(re);
		if (!globalVersionMatch) {
			return _reject(globalVersion);
		}
		const globalVersionParsed = {
			major: +globalVersionMatch[1],
			minor: +globalVersionMatch[2],
			patch: +globalVersionMatch[3],
			prerelease: globalVersionMatch[4],
		};
		if (globalVersionParsed.prerelease != null) {
			return _reject(globalVersion);
		}
		if (ownVersionParsed.major !== globalVersionParsed.major) {
			return _reject(globalVersion);
		}
		if (ownVersionParsed.major === 0) {
			if (ownVersionParsed.minor === globalVersionParsed.minor &&
				ownVersionParsed.patch <= globalVersionParsed.patch) {
				return _accept(globalVersion);
			}
			return _reject(globalVersion);
		}
		if (ownVersionParsed.minor <= globalVersionParsed.minor) {
			return _accept(globalVersion);
		}
		return _reject(globalVersion);
	};
}
const isCompatible = _makeCompatibilityCheck(VERSION);

const major = VERSION.split('.')[0];
const GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for(`opentelemetry.js.api.${major}`);
const _global = _globalThis;
function registerGlobal(type, instance, diag, allowOverride = false) {
	var _a;
	const api = (_global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
		version: VERSION,
	});
	if (!allowOverride && api[type]) {
		const err = new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${type}`);
		diag.error(err.stack || err.message);
		return false;
	}
	if (api.version !== VERSION) {
		const err = new Error(`@opentelemetry/api: Registration of version v${api.version} for ${type} does not match previously registered API v${VERSION}`);
		diag.error(err.stack || err.message);
		return false;
	}
	api[type] = instance;
	diag.debug(`@opentelemetry/api: Registered a global for ${type} v${VERSION}.`);
	return true;
}
function getGlobal(type) {
	var _a, _b;
	const globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
	if (!globalVersion || !isCompatible(globalVersion)) {
		return;
	}
	return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag) {
	diag.debug(`@opentelemetry/api: Unregistering a global for ${type} v${VERSION}.`);
	const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
	if (api) {
		delete api[type];
	}
}

class DiagComponentLogger {
	constructor(props) {
		this._namespace = props.namespace || 'DiagComponentLogger';
	}
	debug(...args) {
		return logProxy('debug', this._namespace, args);
	}
	error(...args) {
		return logProxy('error', this._namespace, args);
	}
	info(...args) {
		return logProxy('info', this._namespace, args);
	}
	warn(...args) {
		return logProxy('warn', this._namespace, args);
	}
	verbose(...args) {
		return logProxy('verbose', this._namespace, args);
	}
}
function logProxy(funcName, namespace, args) {
	const logger = getGlobal('diag');
	if (!logger) {
		return;
	}
	args.unshift(namespace);
	return logger[funcName](...args);
}

var DiagLogLevel;
(function (DiagLogLevel) {
	DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
	DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
	DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
	DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
	DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
	DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
	DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {}));

function createLogLevelDiagLogger(maxLevel, logger) {
	if (maxLevel < DiagLogLevel.NONE) {
		maxLevel = DiagLogLevel.NONE;
	}
	else if (maxLevel > DiagLogLevel.ALL) {
		maxLevel = DiagLogLevel.ALL;
	}
	logger = logger || {};
	function _filterFunc(funcName, theLevel) {
		const theFunc = logger[funcName];
		if (typeof theFunc === 'function' && maxLevel >= theLevel) {
			return theFunc.bind(logger);
		}
		return function () { };
	}
	return {
		error: _filterFunc('error', DiagLogLevel.ERROR),
		warn: _filterFunc('warn', DiagLogLevel.WARN),
		info: _filterFunc('info', DiagLogLevel.INFO),
		debug: _filterFunc('debug', DiagLogLevel.DEBUG),
		verbose: _filterFunc('verbose', DiagLogLevel.VERBOSE),
	};
}

const API_NAME$4 = 'diag';
class DiagAPI {
	constructor() {
		function _logProxy(funcName) {
			return function (...args) {
				const logger = getGlobal('diag');
				if (!logger)
					return;
				return logger[funcName](...args);
			};
		}
		const self = this;
		const setLogger = (logger, optionsOrLogLevel = { logLevel: DiagLogLevel.INFO }) => {
			var _a, _b, _c;
			if (logger === self) {
				const err = new Error('Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation');
				self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
				return false;
			}
			if (typeof optionsOrLogLevel === 'number') {
				optionsOrLogLevel = {
					logLevel: optionsOrLogLevel,
				};
			}
			const oldLogger = getGlobal('diag');
			const newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
			if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
				const stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : '<failed to generate stacktrace>';
				oldLogger.warn(`Current logger will be overwritten from ${stack}`);
				newLogger.warn(`Current logger will overwrite one already registered from ${stack}`);
			}
			return registerGlobal('diag', newLogger, self, true);
		};
		self.setLogger = setLogger;
		self.disable = () => {
			unregisterGlobal(API_NAME$4, self);
		};
		self.createComponentLogger = (options) => {
			return new DiagComponentLogger(options);
		};
		self.verbose = _logProxy('verbose');
		self.debug = _logProxy('debug');
		self.info = _logProxy('info');
		self.warn = _logProxy('warn');
		self.error = _logProxy('error');
	}
	static instance() {
		if (!this._instance) {
			this._instance = new DiagAPI();
		}
		return this._instance;
	}
}

class BaggageImpl {
	constructor(entries) {
		this._entries = entries ? new Map(entries) : new Map();
	}
	getEntry(key) {
		const entry = this._entries.get(key);
		if (!entry) {
			return undefined;
		}
		return Object.assign({}, entry);
	}
	getAllEntries() {
		return Array.from(this._entries.entries()).map(([k, v]) => [k, v]);
	}
	setEntry(key, entry) {
		const newBaggage = new BaggageImpl(this._entries);
		newBaggage._entries.set(key, entry);
		return newBaggage;
	}
	removeEntry(key) {
		const newBaggage = new BaggageImpl(this._entries);
		newBaggage._entries.delete(key);
		return newBaggage;
	}
	removeEntries(...keys) {
		const newBaggage = new BaggageImpl(this._entries);
		for (const key of keys) {
			newBaggage._entries.delete(key);
		}
		return newBaggage;
	}
	clear() {
		return new BaggageImpl();
	}
}

const baggageEntryMetadataSymbol = Symbol('BaggageEntryMetadata');

const diag$1 = DiagAPI.instance();
function createBaggage(entries = {}) {
	return new BaggageImpl(new Map(Object.entries(entries)));
}
function baggageEntryMetadataFromString(str) {
	if (typeof str !== 'string') {
		diag$1.error(`Cannot create baggage metadata from unknown type: ${typeof str}`);
		str = '';
	}
	return {
		__TYPE__: baggageEntryMetadataSymbol,
		toString() {
			return str;
		},
	};
}

function createContextKey(description) {
	return Symbol.for(description);
}
class BaseContext {
	constructor(parentContext) {
		const self = this;
		self._currentContext = parentContext ? new Map(parentContext) : new Map();
		self.getValue = (key) => self._currentContext.get(key);
		self.setValue = (key, value) => {
			const context = new BaseContext(self._currentContext);
			context._currentContext.set(key, value);
			return context;
		};
		self.deleteValue = (key) => {
			const context = new BaseContext(self._currentContext);
			context._currentContext.delete(key);
			return context;
		};
	}
}
const ROOT_CONTEXT = new BaseContext();

const consoleMap = [
	{ n: 'error', c: 'error' },
	{ n: 'warn', c: 'warn' },
	{ n: 'info', c: 'info' },
	{ n: 'debug', c: 'debug' },
	{ n: 'verbose', c: 'trace' },
];
class DiagConsoleLogger {
	constructor() {
		function _consoleFunc(funcName) {
			return function (...args) {
				if (console) {
					let theFunc = console[funcName];
					if (typeof theFunc !== 'function') {
						theFunc = console.log;
					}
					if (typeof theFunc === 'function') {
						return theFunc.apply(console, args);
					}
				}
			};
		}
		for (let i = 0; i < consoleMap.length; i++) {
			this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
		}
	}
}

class NoopMeter {
	constructor() { }
	createHistogram(_name, _options) {
		return NOOP_HISTOGRAM_METRIC;
	}
	createCounter(_name, _options) {
		return NOOP_COUNTER_METRIC;
	}
	createUpDownCounter(_name, _options) {
		return NOOP_UP_DOWN_COUNTER_METRIC;
	}
	createObservableGauge(_name, _options) {
		return NOOP_OBSERVABLE_GAUGE_METRIC;
	}
	createObservableCounter(_name, _options) {
		return NOOP_OBSERVABLE_COUNTER_METRIC;
	}
	createObservableUpDownCounter(_name, _options) {
		return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
	}
	addBatchObservableCallback(_callback, _observables) { }
	removeBatchObservableCallback(_callback) { }
}
class NoopMetric {
}
class NoopCounterMetric extends NoopMetric {
	add(_value, _attributes) { }
}
class NoopUpDownCounterMetric extends NoopMetric {
	add(_value, _attributes) { }
}
class NoopHistogramMetric extends NoopMetric {
	record(_value, _attributes) { }
}
class NoopObservableMetric {
	addCallback(_callback) { }
	removeCallback(_callback) { }
}
class NoopObservableCounterMetric extends NoopObservableMetric {
}
class NoopObservableGaugeMetric extends NoopObservableMetric {
}
class NoopObservableUpDownCounterMetric extends NoopObservableMetric {
}
const NOOP_METER = new NoopMeter();
const NOOP_COUNTER_METRIC = new NoopCounterMetric();
const NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
const NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
const NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
const NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
const NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
function createNoopMeter() {
	return NOOP_METER;
}

var ValueType;
(function (ValueType) {
	ValueType[ValueType["INT"] = 0] = "INT";
	ValueType[ValueType["DOUBLE"] = 1] = "DOUBLE";
})(ValueType || (ValueType = {}));

const defaultTextMapGetter = {
	get(carrier, key) {
		if (carrier == null) {
			return undefined;
		}
		return carrier[key];
	},
	keys(carrier) {
		if (carrier == null) {
			return [];
		}
		return Object.keys(carrier);
	},
};
const defaultTextMapSetter = {
	set(carrier, key, value) {
		if (carrier == null) {
			return;
		}
		carrier[key] = value;
	},
};

class NoopContextManager {
	active() {
		return ROOT_CONTEXT;
	}
	with(_context, fn, thisArg, ...args) {
		return fn.call(thisArg, ...args);
	}
	bind(_context, target) {
		return target;
	}
	enable() {
		return this;
	}
	disable() {
		return this;
	}
}

const API_NAME$3 = 'context';
const NOOP_CONTEXT_MANAGER = new NoopContextManager();
class ContextAPI {
	constructor() { }
	static getInstance() {
		if (!this._instance) {
			this._instance = new ContextAPI();
		}
		return this._instance;
	}
	setGlobalContextManager(contextManager) {
		return registerGlobal(API_NAME$3, contextManager, DiagAPI.instance());
	}
	active() {
		return this._getContextManager().active();
	}
	with(context, fn, thisArg, ...args) {
		return this._getContextManager().with(context, fn, thisArg, ...args);
	}
	bind(context, target) {
		return this._getContextManager().bind(context, target);
	}
	_getContextManager() {
		return getGlobal(API_NAME$3) || NOOP_CONTEXT_MANAGER;
	}
	disable() {
		this._getContextManager().disable();
		unregisterGlobal(API_NAME$3, DiagAPI.instance());
	}
}

var TraceFlags;
(function (TraceFlags) {
	TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
	TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));

const INVALID_SPANID = '0000000000000000';
const INVALID_TRACEID = '00000000000000000000000000000000';
const INVALID_SPAN_CONTEXT = {
	traceId: INVALID_TRACEID,
	spanId: INVALID_SPANID,
	traceFlags: TraceFlags.NONE,
};

class NonRecordingSpan {
	constructor(_spanContext = INVALID_SPAN_CONTEXT) {
		this._spanContext = _spanContext;
	}
	spanContext() {
		return this._spanContext;
	}
	setAttribute(_key, _value) {
		return this;
	}
	setAttributes(_attributes) {
		return this;
	}
	addEvent(_name, _attributes) {
		return this;
	}
	setStatus(_status) {
		return this;
	}
	updateName(_name) {
		return this;
	}
	end(_endTime) { }
	isRecording() {
		return false;
	}
	recordException(_exception, _time) { }
}

const SPAN_KEY = createContextKey('OpenTelemetry Context Key SPAN');
function getSpan(context) {
	return context.getValue(SPAN_KEY) || undefined;
}
function getActiveSpan() {
	return getSpan(ContextAPI.getInstance().active());
}
function setSpan(context, span) {
	return context.setValue(SPAN_KEY, span);
}
function deleteSpan(context) {
	return context.deleteValue(SPAN_KEY);
}
function setSpanContext(context, spanContext) {
	return setSpan(context, new NonRecordingSpan(spanContext));
}
function getSpanContext(context) {
	var _a;
	return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
}

const VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
const VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
	return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
	return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
}
function isSpanContextValid(spanContext) {
	return (isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId));
}
function wrapSpanContext(spanContext) {
	return new NonRecordingSpan(spanContext);
}

const contextApi = ContextAPI.getInstance();
class NoopTracer {
	startSpan(name, options, context = contextApi.active()) {
		const root = Boolean(options === null || options === void 0 ? void 0 : options.root);
		if (root) {
			return new NonRecordingSpan();
		}
		const parentFromContext = context && getSpanContext(context);
		if (isSpanContext(parentFromContext) &&
			isSpanContextValid(parentFromContext)) {
			return new NonRecordingSpan(parentFromContext);
		}
		else {
			return new NonRecordingSpan();
		}
	}
	startActiveSpan(name, arg2, arg3, arg4) {
		let opts;
		let ctx;
		let fn;
		if (arguments.length < 2) {
			return;
		}
		else if (arguments.length === 2) {
			fn = arg2;
		}
		else if (arguments.length === 3) {
			opts = arg2;
			fn = arg3;
		}
		else {
			opts = arg2;
			ctx = arg3;
			fn = arg4;
		}
		const parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
		const span = this.startSpan(name, opts, parentContext);
		const contextWithSpanSet = setSpan(parentContext, span);
		return contextApi.with(contextWithSpanSet, fn, undefined, span);
	}
}
function isSpanContext(spanContext) {
	return (typeof spanContext === 'object' &&
		typeof spanContext['spanId'] === 'string' &&
		typeof spanContext['traceId'] === 'string' &&
		typeof spanContext['traceFlags'] === 'number');
}

const NOOP_TRACER = new NoopTracer();
class ProxyTracer {
	constructor(_provider, name, version, options) {
		this._provider = _provider;
		this.name = name;
		this.version = version;
		this.options = options;
	}
	startSpan(name, options, context) {
		return this._getTracer().startSpan(name, options, context);
	}
	startActiveSpan(_name, _options, _context, _fn) {
		const tracer = this._getTracer();
		return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
	}
	_getTracer() {
		if (this._delegate) {
			return this._delegate;
		}
		const tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
		if (!tracer) {
			return NOOP_TRACER;
		}
		this._delegate = tracer;
		return this._delegate;
	}
}

class NoopTracerProvider {
	getTracer(_name, _version, _options) {
		return new NoopTracer();
	}
}

const NOOP_TRACER_PROVIDER = new NoopTracerProvider();
class ProxyTracerProvider {
	getTracer(name, version, options) {
		var _a;
		return ((_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options));
	}
	getDelegate() {
		var _a;
		return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
	}
	setDelegate(delegate) {
		this._delegate = delegate;
	}
	getDelegateTracer(name, version, options) {
		var _a;
		return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
	}
}

var SamplingDecision;
(function (SamplingDecision) {
	SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
	SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
	SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
})(SamplingDecision || (SamplingDecision = {}));

var SpanKind;
(function (SpanKind) {
	SpanKind[SpanKind["INTERNAL"] = 0] = "INTERNAL";
	SpanKind[SpanKind["SERVER"] = 1] = "SERVER";
	SpanKind[SpanKind["CLIENT"] = 2] = "CLIENT";
	SpanKind[SpanKind["PRODUCER"] = 3] = "PRODUCER";
	SpanKind[SpanKind["CONSUMER"] = 4] = "CONSUMER";
})(SpanKind || (SpanKind = {}));

var SpanStatusCode;
(function (SpanStatusCode) {
	SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
	SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
	SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
})(SpanStatusCode || (SpanStatusCode = {}));

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
class TraceStateImpl {
	constructor(rawTraceState) {
		this._internalState = new Map();
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
		const traceState = new TraceStateImpl();
		traceState._internalState = new Map(this._internalState);
		return traceState;
	}
}

function createTraceState(rawTraceState) {
	return new TraceStateImpl(rawTraceState);
}

const context = ContextAPI.getInstance();

const diag = DiagAPI.instance();

class NoopMeterProvider {
	getMeter(_name, _version, _options) {
		return NOOP_METER;
	}
}
const NOOP_METER_PROVIDER = new NoopMeterProvider();

const API_NAME$2 = 'metrics';
class MetricsAPI {
	constructor() { }
	static getInstance() {
		if (!this._instance) {
			this._instance = new MetricsAPI();
		}
		return this._instance;
	}
	setGlobalMeterProvider(provider) {
		return registerGlobal(API_NAME$2, provider, DiagAPI.instance());
	}
	getMeterProvider() {
		return getGlobal(API_NAME$2) || NOOP_METER_PROVIDER;
	}
	getMeter(name, version, options) {
		return this.getMeterProvider().getMeter(name, version, options);
	}
	disable() {
		unregisterGlobal(API_NAME$2, DiagAPI.instance());
	}
}

const metrics = MetricsAPI.getInstance();

class NoopTextMapPropagator {
	inject(_context, _carrier) { }
	extract(context, _carrier) {
		return context;
	}
	fields() {
		return [];
	}
}

const BAGGAGE_KEY = createContextKey('OpenTelemetry Baggage Key');
function getBaggage(context) {
	return context.getValue(BAGGAGE_KEY) || undefined;
}
function getActiveBaggage() {
	return getBaggage(ContextAPI.getInstance().active());
}
function setBaggage(context, baggage) {
	return context.setValue(BAGGAGE_KEY, baggage);
}
function deleteBaggage(context) {
	return context.deleteValue(BAGGAGE_KEY);
}

const API_NAME$1 = 'propagation';
const NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
class PropagationAPI {
	constructor() {
		this.createBaggage = createBaggage;
		this.getBaggage = getBaggage;
		this.getActiveBaggage = getActiveBaggage;
		this.setBaggage = setBaggage;
		this.deleteBaggage = deleteBaggage;
	}
	static getInstance() {
		if (!this._instance) {
			this._instance = new PropagationAPI();
		}
		return this._instance;
	}
	setGlobalPropagator(propagator) {
		return registerGlobal(API_NAME$1, propagator, DiagAPI.instance());
	}
	inject(context, carrier, setter = defaultTextMapSetter) {
		return this._getGlobalPropagator().inject(context, carrier, setter);
	}
	extract(context, carrier, getter = defaultTextMapGetter) {
		return this._getGlobalPropagator().extract(context, carrier, getter);
	}
	fields() {
		return this._getGlobalPropagator().fields();
	}
	disable() {
		unregisterGlobal(API_NAME$1, DiagAPI.instance());
	}
	_getGlobalPropagator() {
		return getGlobal(API_NAME$1) || NOOP_TEXT_MAP_PROPAGATOR;
	}
}

const propagation = PropagationAPI.getInstance();

const API_NAME = 'trace';
class TraceAPI {
	constructor() {
		this._proxyTracerProvider = new ProxyTracerProvider();
		this.wrapSpanContext = wrapSpanContext;
		this.isSpanContextValid = isSpanContextValid;
		this.deleteSpan = deleteSpan;
		this.getSpan = getSpan;
		this.getActiveSpan = getActiveSpan;
		this.getSpanContext = getSpanContext;
		this.setSpan = setSpan;
		this.setSpanContext = setSpanContext;
	}
	static getInstance() {
		if (!this._instance) {
			this._instance = new TraceAPI();
		}
		return this._instance;
	}
	setGlobalTracerProvider(provider) {
		const success = registerGlobal(API_NAME, this._proxyTracerProvider, DiagAPI.instance());
		if (success) {
			this._proxyTracerProvider.setDelegate(provider);
		}
		return success;
	}
	getTracerProvider() {
		return getGlobal(API_NAME) || this._proxyTracerProvider;
	}
	getTracer(name, version) {
		return this.getTracerProvider().getTracer(name, version);
	}
	disable() {
		unregisterGlobal(API_NAME, DiagAPI.instance());
		this._proxyTracerProvider = new ProxyTracerProvider();
	}
}

const trace = TraceAPI.getInstance();

var index = {
	context,
	diag,
	metrics,
	propagation,
	trace,
};

export { DiagConsoleLogger, DiagLogLevel, INVALID_SPANID, INVALID_SPAN_CONTEXT, INVALID_TRACEID, ProxyTracer, ProxyTracerProvider, ROOT_CONTEXT, SamplingDecision, SpanKind, SpanStatusCode, TraceFlags, ValueType, baggageEntryMetadataFromString, context, createContextKey, createNoopMeter, createTraceState, index as default, defaultTextMapGetter, defaultTextMapSetter, diag, isSpanContextValid, isValidSpanId, isValidTraceId, metrics, propagation, trace };
