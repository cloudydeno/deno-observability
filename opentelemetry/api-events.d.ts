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

import { TimeInput, Attributes, Context } from './api.d.ts';
import { AnyValue, SeverityNumber } from './api-logs.d.ts';

interface Event {
	/**
	* The time when the event occurred as UNIX Epoch time in nanoseconds.
	*/
	timestamp?: TimeInput;
	/**
	* The name of the event.
	*/
	name: string;
	/**
	* Data that describes the event.
	* Intended to be used by instrumentation libraries.
	*/
	data?: AnyValue;
	/**
	* Additional attributes that describe the event.
	*/
	attributes?: Attributes;
	/**
	* Numerical value of the severity.
	*/
	severityNumber?: SeverityNumber;
	/**
	* The Context associated with the Event.
	*/
	context?: Context;
}

interface EventLogger {
	/**
	* Emit an event. This method should only be used by instrumentations emitting events.
	*
	* @param event
	*/
	emit(event: Event): void;
}

interface EventLoggerOptions {
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
 * A registry for creating named {@link EventLogger}s.
 */
interface EventLoggerProvider {
	/**
	* Returns an EventLogger, creating one if one with the given name, version, and
	* schemaUrl pair is not already created.
	*
	* @param name The name of the event logger or instrumentation library.
	* @param version The version of the event logger or instrumentation library.
	* @param options The options of the event logger or instrumentation library.
	* @returns EventLogger An event logger with the given name and version.
	*/
	getEventLogger(name: string, version?: string, options?: EventLoggerOptions): EventLogger;
}

declare class EventsAPI {
	private static _instance?;
	private constructor();
	static getInstance(): EventsAPI;
	setGlobalEventLoggerProvider(provider: EventLoggerProvider): EventLoggerProvider;
	/**
	* Returns the global event logger provider.
	*
	* @returns EventLoggerProvider
	*/
	getEventLoggerProvider(): EventLoggerProvider;
	/**
	* Returns a event logger from the global event logger provider.
	*
	* @returns EventLogger
	*/
	getEventLogger(name: string, version?: string, options?: EventLoggerOptions): EventLogger;
	/** Remove the global event logger provider */
	disable(): void;
}

declare const events: EventsAPI;

export { Event, EventLogger, EventLoggerOptions, EventLoggerProvider, events };
