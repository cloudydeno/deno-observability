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
/// <reference types="./api-logs.d.ts" />

var SeverityNumber;
(function (SeverityNumber) {
	SeverityNumber[SeverityNumber["UNSPECIFIED"] = 0] = "UNSPECIFIED";
	SeverityNumber[SeverityNumber["TRACE"] = 1] = "TRACE";
	SeverityNumber[SeverityNumber["TRACE2"] = 2] = "TRACE2";
	SeverityNumber[SeverityNumber["TRACE3"] = 3] = "TRACE3";
	SeverityNumber[SeverityNumber["TRACE4"] = 4] = "TRACE4";
	SeverityNumber[SeverityNumber["DEBUG"] = 5] = "DEBUG";
	SeverityNumber[SeverityNumber["DEBUG2"] = 6] = "DEBUG2";
	SeverityNumber[SeverityNumber["DEBUG3"] = 7] = "DEBUG3";
	SeverityNumber[SeverityNumber["DEBUG4"] = 8] = "DEBUG4";
	SeverityNumber[SeverityNumber["INFO"] = 9] = "INFO";
	SeverityNumber[SeverityNumber["INFO2"] = 10] = "INFO2";
	SeverityNumber[SeverityNumber["INFO3"] = 11] = "INFO3";
	SeverityNumber[SeverityNumber["INFO4"] = 12] = "INFO4";
	SeverityNumber[SeverityNumber["WARN"] = 13] = "WARN";
	SeverityNumber[SeverityNumber["WARN2"] = 14] = "WARN2";
	SeverityNumber[SeverityNumber["WARN3"] = 15] = "WARN3";
	SeverityNumber[SeverityNumber["WARN4"] = 16] = "WARN4";
	SeverityNumber[SeverityNumber["ERROR"] = 17] = "ERROR";
	SeverityNumber[SeverityNumber["ERROR2"] = 18] = "ERROR2";
	SeverityNumber[SeverityNumber["ERROR3"] = 19] = "ERROR3";
	SeverityNumber[SeverityNumber["ERROR4"] = 20] = "ERROR4";
	SeverityNumber[SeverityNumber["FATAL"] = 21] = "FATAL";
	SeverityNumber[SeverityNumber["FATAL2"] = 22] = "FATAL2";
	SeverityNumber[SeverityNumber["FATAL3"] = 23] = "FATAL3";
	SeverityNumber[SeverityNumber["FATAL4"] = 24] = "FATAL4";
})(SeverityNumber || (SeverityNumber = {}));

class NoopLogger {
	emit(_logRecord) { }
}
const NOOP_LOGGER = new NoopLogger();

class NoopLoggerProvider {
	getLogger(_name, _version, _options) {
		return new NoopLogger();
	}
}
const NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();

class ProxyLogger {
	constructor(_provider, name, version, options) {
		this._provider = _provider;
		this.name = name;
		this.version = version;
		this.options = options;
	}
	emit(logRecord) {
		this._getLogger().emit(logRecord);
	}
	_getLogger() {
		if (this._delegate) {
			return this._delegate;
		}
		const logger = this._provider.getDelegateLogger(this.name, this.version, this.options);
		if (!logger) {
			return NOOP_LOGGER;
		}
		this._delegate = logger;
		return this._delegate;
	}
}

class ProxyLoggerProvider {
	getLogger(name, version, options) {
		return (this.getDelegateLogger(name, version, options) ??
			new ProxyLogger(this, name, version, options));
	}
	getDelegate() {
		return this._delegate ?? NOOP_LOGGER_PROVIDER;
	}
	setDelegate(delegate) {
		this._delegate = delegate;
	}
	getDelegateLogger(name, version, options) {
		return this._delegate?.getLogger(name, version, options);
	}
}

const _globalThis = typeof globalThis === 'object' ? globalThis : global;

const GLOBAL_LOGS_API_KEY = Symbol.for('io.opentelemetry.js.api.logs');
const _global = _globalThis;
function makeGetter(requiredVersion, instance, fallback) {
	return (version) => version === requiredVersion ? instance : fallback;
}
const API_BACKWARDS_COMPATIBILITY_VERSION = 1;

class LogsAPI {
	constructor() {
		this._proxyLoggerProvider = new ProxyLoggerProvider();
	}
	static getInstance() {
		if (!this._instance) {
			this._instance = new LogsAPI();
		}
		return this._instance;
	}
	setGlobalLoggerProvider(provider) {
		if (_global[GLOBAL_LOGS_API_KEY]) {
			return this.getLoggerProvider();
		}
		_global[GLOBAL_LOGS_API_KEY] = makeGetter(API_BACKWARDS_COMPATIBILITY_VERSION, provider, NOOP_LOGGER_PROVIDER);
		this._proxyLoggerProvider.setDelegate(provider);
		return provider;
	}
	getLoggerProvider() {
		return (_global[GLOBAL_LOGS_API_KEY]?.(API_BACKWARDS_COMPATIBILITY_VERSION) ??
			this._proxyLoggerProvider);
	}
	getLogger(name, version, options) {
		return this.getLoggerProvider().getLogger(name, version, options);
	}
	disable() {
		delete _global[GLOBAL_LOGS_API_KEY];
		this._proxyLoggerProvider = new ProxyLoggerProvider();
	}
}

const logs = LogsAPI.getInstance();

export { NOOP_LOGGER, NOOP_LOGGER_PROVIDER, NoopLogger, NoopLoggerProvider, ProxyLogger, ProxyLoggerProvider, SeverityNumber, logs };
