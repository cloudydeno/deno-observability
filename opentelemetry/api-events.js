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
/// <reference types="./api-events.d.ts" />

const _globalThis = typeof globalThis === 'object' ? globalThis : global;

const GLOBAL_EVENTS_API_KEY = Symbol.for('io.opentelemetry.js.api.events');
const _global = _globalThis;
function makeGetter(requiredVersion, instance, fallback) {
	return (version) => version === requiredVersion ? instance : fallback;
}
const API_BACKWARDS_COMPATIBILITY_VERSION = 1;

class NoopEventLogger {
	emit(_event) { }
}

class NoopEventLoggerProvider {
	getEventLogger(_name, _version, _options) {
		return new NoopEventLogger();
	}
}
const NOOP_EVENT_LOGGER_PROVIDER = new NoopEventLoggerProvider();

class EventsAPI {
	constructor() { }
	static getInstance() {
		if (!this._instance) {
			this._instance = new EventsAPI();
		}
		return this._instance;
	}
	setGlobalEventLoggerProvider(provider) {
		if (_global[GLOBAL_EVENTS_API_KEY]) {
			return this.getEventLoggerProvider();
		}
		_global[GLOBAL_EVENTS_API_KEY] = makeGetter(API_BACKWARDS_COMPATIBILITY_VERSION, provider, NOOP_EVENT_LOGGER_PROVIDER);
		return provider;
	}
	getEventLoggerProvider() {
		return (_global[GLOBAL_EVENTS_API_KEY]?.(API_BACKWARDS_COMPATIBILITY_VERSION) ??
			NOOP_EVENT_LOGGER_PROVIDER);
	}
	getEventLogger(name, version, options) {
		return this.getEventLoggerProvider().getEventLogger(name, version, options);
	}
	disable() {
		delete _global[GLOBAL_EVENTS_API_KEY];
	}
}

const events = EventsAPI.getInstance();

export { events };
