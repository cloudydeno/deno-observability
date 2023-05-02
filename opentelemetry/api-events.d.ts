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

import { Attributes } from './api.d.ts';

interface Event {
	/**
	* The time when the event occurred as UNIX Epoch time in nanoseconds.
	*/
	timestamp?: number;
	/**
	* The name of the event.
	*/
	name: string;
	/**
	* Additional attributes that describe the event.
	*/
	attributes?: Attributes;
	/**
	* 8 least significant bits are the trace flags as defined in W3C Trace Context specification.
	*/
	traceFlags?: number;
	/**
	* A unique identifier for a trace.
	*/
	traceId?: string;
	/**
	* A unique identifier for a span within a trace.
	*/
	spanId?: string;
}

interface EventEmitter {
	/**
	* Emit an event. This method should only be used by instrumentations emitting events.
	*
	* @param event
	*/
	emit(event: Event): void;
}

interface EventEmitterOptions {
	/**
	* The schemaUrl of the tracer or instrumentation library
	* @default ''
	*/
	schemaUrl?: string;
	/**
	* The instrumentation scope attributes to associate with emitted telemetry
	*/
	scopeAttributes?: Attributes;
}

/**
 * A registry for creating named {@link EventEmitter}s.
 */
interface EventEmitterProvider {
	/**
	* Returns an EventEmitter, creating one if one with the given name, version, and
	* schemaUrl pair is not already created.
	*
	* @param name The name of the event emitter or instrumentation library.
	* @param domain The domain for events created by the event emitter.
	* @param version The version of the event emitter or instrumentation library.
	* @param options The options of the event emitter or instrumentation library.
	* @returns EventEmitter An event emitter with the given name and version.
	*/
	getEventEmitter(name: string, domain: string, version?: string, options?: EventEmitterOptions): EventEmitter;
}

declare class EventsAPI {
	private static _instance?;
	private constructor();
	static getInstance(): EventsAPI;
	setGlobalEventEmitterProvider(provider: EventEmitterProvider): EventEmitterProvider;
	/**
	* Returns the global event emitter provider.
	*
	* @returns EventEmitterProvider
	*/
	getEventEmitterProvider(): EventEmitterProvider;
	/**
	* Returns a event emitter from the global event emitter provider.
	*
	* @returns EventEmitter
	*/
	getEventEmitter(name: string, domain: string, version?: string, options?: EventEmitterOptions): EventEmitter;
	/** Remove the global event emitter provider */
	disable(): void;
}

declare const events: EventsAPI;

export { Event, EventEmitter, EventEmitterOptions, EventEmitterProvider, events };
