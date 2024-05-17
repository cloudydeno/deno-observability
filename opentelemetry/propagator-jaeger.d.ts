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

import { TextMapPropagator, Context, TextMapSetter, TextMapGetter } from './api.d.ts';

interface JaegerPropagatorConfig {
	customTraceHeader?: string;
	customBaggageHeaderPrefix?: string;
}

declare const UBER_TRACE_ID_HEADER = "uber-trace-id";
declare const UBER_BAGGAGE_HEADER_PREFIX = "uberctx";
/**
 * Propagates {@link SpanContext} through Trace Context format propagation.
 * {trace-id}:{span-id}:{parent-span-id}:{flags}
 * {trace-id}
 * 64-bit or 128-bit random number in base16 format.
 * Can be variable length, shorter values are 0-padded on the left.
 * Value of 0 is invalid.
 * {span-id}
 * 64-bit random number in base16 format.
 * {parent-span-id}
 * Set to 0 because this field is deprecated.
 * {flags}
 * One byte bitmap, as two hex digits.
 * Inspired by jaeger-client-node project.
 */
declare class JaegerPropagator implements TextMapPropagator {
	private readonly _jaegerTraceHeader;
	private readonly _jaegerBaggageHeaderPrefix;
	constructor(customTraceHeader?: string);
	constructor(config?: JaegerPropagatorConfig);
	inject(context: Context, carrier: unknown, setter: TextMapSetter): void;
	extract(context: Context, carrier: unknown, getter: TextMapGetter): Context;
	fields(): string[];
}

export { JaegerPropagator, UBER_BAGGAGE_HEADER_PREFIX, UBER_TRACE_ID_HEADER };
