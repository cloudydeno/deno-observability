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

import { TextMapPropagator, Context, TextMapSetter, TextMapGetter } from './api.js';

/** Enumeration of B3 inject encodings */
declare enum B3InjectEncoding {
	SINGLE_HEADER = 0,
	MULTI_HEADER = 1
}
/** Configuration for the B3Propagator */
interface B3PropagatorConfig {
	injectEncoding?: B3InjectEncoding;
}

/**
 * Propagator that extracts B3 context in both single and multi-header variants,
 * with configurable injection format defaulting to B3 single-header. Due to
 * the asymmetry in injection and extraction formats this is not suitable to
 * be implemented as a composite propagator.
 * Based on: https://github.com/openzipkin/b3-propagation
 */
declare class B3Propagator implements TextMapPropagator {
	private readonly _b3MultiPropagator;
	private readonly _b3SinglePropagator;
	private readonly _inject;
	readonly _fields: string[];
	constructor(config?: B3PropagatorConfig);
	inject(context: Context, carrier: unknown, setter: TextMapSetter): void;
	extract(context: Context, carrier: unknown, getter: TextMapGetter): Context;
	fields(): string[];
}

/** B3 single-header key */
declare const B3_CONTEXT_HEADER = "b3";
declare const X_B3_TRACE_ID = "x-b3-traceid";
declare const X_B3_SPAN_ID = "x-b3-spanid";
declare const X_B3_SAMPLED = "x-b3-sampled";
declare const X_B3_PARENT_SPAN_ID = "x-b3-parentspanid";
declare const X_B3_FLAGS = "x-b3-flags";

export { B3InjectEncoding, B3Propagator, B3PropagatorConfig, B3_CONTEXT_HEADER, X_B3_FLAGS, X_B3_PARENT_SPAN_ID, X_B3_SAMPLED, X_B3_SPAN_ID, X_B3_TRACE_ID };
