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
/// <reference types="./context-zone-peer-dep.d.ts" />

import { ROOT_CONTEXT } from './api.js';

function isListenerObject(obj = {}) {
	return (typeof obj.addEventListener === 'function' &&
		typeof obj.removeEventListener === 'function');
}

const ZONE_CONTEXT_KEY = 'OT_ZONE_CONTEXT';
class ZoneContextManager {
	constructor() {
		this._enabled = false;
		this._zoneCounter = 0;
	}
	_activeContextFromZone(activeZone) {
		return (activeZone && activeZone.get(ZONE_CONTEXT_KEY)) || ROOT_CONTEXT;
	}
	_bindFunction(context, target) {
		const manager = this;
		const contextWrapper = function (...args) {
			return manager.with(context, () => target.apply(this, args));
		};
		Object.defineProperty(contextWrapper, 'length', {
			enumerable: false,
			configurable: true,
			writable: false,
			value: target.length,
		});
		return contextWrapper;
	}
	_bindListener(context, obj) {
		const target = obj;
		if (target.__ot_listeners !== undefined) {
			return obj;
		}
		target.__ot_listeners = {};
		if (typeof target.addEventListener === 'function') {
			target.addEventListener = this._patchAddEventListener(target, target.addEventListener, context);
		}
		if (typeof target.removeEventListener === 'function') {
			target.removeEventListener = this._patchRemoveEventListener(target, target.removeEventListener);
		}
		return obj;
	}
	_createZoneName() {
		this._zoneCounter++;
		const random = Math.random();
		return `${this._zoneCounter}-${random}`;
	}
	_createZone(zoneName, context) {
		return Zone.current.fork({
			name: zoneName,
			properties: {
				[ZONE_CONTEXT_KEY]: context,
			},
		});
	}
	_getActiveZone() {
		return Zone.current;
	}
	_patchAddEventListener(target, original, context) {
		const contextManager = this;
		return function (event, listener, opts) {
			if (target.__ot_listeners === undefined) {
				target.__ot_listeners = {};
			}
			let listeners = target.__ot_listeners[event];
			if (listeners === undefined) {
				listeners = new WeakMap();
				target.__ot_listeners[event] = listeners;
			}
			const patchedListener = contextManager.bind(context, listener);
			listeners.set(listener, patchedListener);
			return original.call(this, event, patchedListener, opts);
		};
	}
	_patchRemoveEventListener(target, original) {
		return function (event, listener) {
			if (target.__ot_listeners === undefined ||
				target.__ot_listeners[event] === undefined) {
				return original.call(this, event, listener);
			}
			const events = target.__ot_listeners[event];
			const patchedListener = events.get(listener);
			events.delete(listener);
			return original.call(this, event, patchedListener || listener);
		};
	}
	active() {
		if (!this._enabled) {
			return ROOT_CONTEXT;
		}
		const activeZone = this._getActiveZone();
		const active = this._activeContextFromZone(activeZone);
		if (active) {
			return active;
		}
		return ROOT_CONTEXT;
	}
	bind(context, target) {
		if (context === undefined) {
			context = this.active();
		}
		if (typeof target === 'function') {
			return this._bindFunction(context, target);
		}
		else if (isListenerObject(target)) {
			this._bindListener(context, target);
		}
		return target;
	}
	disable() {
		this._enabled = false;
		return this;
	}
	enable() {
		this._enabled = true;
		return this;
	}
	with(context, fn, thisArg, ...args) {
		const zoneName = this._createZoneName();
		const newZone = this._createZone(zoneName, context);
		return newZone.run(fn, thisArg, args);
	}
}

export { ZoneContextManager };
