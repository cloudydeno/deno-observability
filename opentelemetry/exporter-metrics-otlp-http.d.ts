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

import { OTLPExporterConfigBase, OTLPExporterBase, IOtlpExportDelegate, OTLPExporterNodeConfigBase } from './otlp-exporter-base.d.ts';
import { AggregationTemporality, AggregationSelector, AggregationTemporalitySelector, ResourceMetrics, PushMetricExporter, InstrumentType, AggregationOption } from './sdk-metrics.d.ts';

interface OTLPMetricExporterOptions extends OTLPExporterConfigBase {
	temporalityPreference?: AggregationTemporalityPreference | AggregationTemporality;
	aggregationPreference?: AggregationSelector;
}
declare enum AggregationTemporalityPreference {
	DELTA = 0,
	CUMULATIVE = 1,
	LOWMEMORY = 2
}

declare const CumulativeTemporalitySelector: AggregationTemporalitySelector;
declare const DeltaTemporalitySelector: AggregationTemporalitySelector;
declare const LowMemoryTemporalitySelector: AggregationTemporalitySelector;
declare class OTLPMetricExporterBase extends OTLPExporterBase<ResourceMetrics> implements PushMetricExporter {
	private readonly _aggregationTemporalitySelector;
	private readonly _aggregationSelector;
	constructor(delegate: IOtlpExportDelegate<ResourceMetrics>, config?: OTLPMetricExporterOptions);
	selectAggregation(instrumentType: InstrumentType): AggregationOption;
	selectAggregationTemporality(instrumentType: InstrumentType): AggregationTemporality;
}

/**
 * OTLP Metric Exporter for Node.js
 */
declare class OTLPMetricExporter extends OTLPMetricExporterBase {
	constructor(config?: OTLPExporterNodeConfigBase & OTLPMetricExporterOptions);
}

export { AggregationTemporalityPreference, CumulativeTemporalitySelector, DeltaTemporalitySelector, LowMemoryTemporalitySelector, OTLPMetricExporter, OTLPMetricExporterBase, OTLPMetricExporterOptions };
