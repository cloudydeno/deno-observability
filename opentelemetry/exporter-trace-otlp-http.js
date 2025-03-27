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
/// <reference types="./exporter-trace-otlp-http.d.ts" />

import { OTLPExporterBase } from './otlp-exporter-base.js';
import { JsonTraceSerializer } from './otlp-transformer.js';
import { createOtlpHttpExportDelegate, convertLegacyHttpOptions } from './otlp-exporter-base.js';

const VERSION = "0.200.0";

class OTLPTraceExporter extends OTLPExporterBase {
	constructor(config = {}) {
		super(createOtlpHttpExportDelegate(convertLegacyHttpOptions(config, 'TRACES', 'v1/traces', {
			'User-Agent': `Deno/${Deno.version.deno} OTel-OTLP-Exporter-JavaScript/${VERSION}`,
			'Content-Type': 'application/json',
		}), JsonTraceSerializer));
	}
}

export { OTLPTraceExporter };
