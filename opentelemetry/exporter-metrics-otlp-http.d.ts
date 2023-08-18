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

import { OTLPExporterConfigBase, OTLPExporterBase } from './otlp-exporter-base.d.ts';
import { AggregationTemporality, AggregationTemporalitySelector, ResourceMetrics, PushMetricExporter, InstrumentType } from './sdk-metrics.d.ts';
import { ExportResult } from './core.d.ts';
import { IExportMetricsServiceRequest } from './otlp-transformer.d.ts';

interface OTLPMetricExporterOptions extends OTLPExporterConfigBase {
	temporalityPreference?: AggregationTemporalityPreference | AggregationTemporality;
}
declare enum AggregationTemporalityPreference {
	DELTA = 0,
	CUMULATIVE = 1,
	LOWMEMORY = 2
}

declare const CumulativeTemporalitySelector: AggregationTemporalitySelector;
declare const DeltaTemporalitySelector: AggregationTemporalitySelector;
declare const LowMemoryTemporalitySelector: AggregationTemporalitySelector;
declare class OTLPMetricExporterBase<T extends OTLPExporterBase<OTLPMetricExporterOptions, ResourceMetrics, IExportMetricsServiceRequest>> implements PushMetricExporter {
	_otlpExporter: T;
	private _aggregationTemporalitySelector;
	constructor(exporter: T, config?: OTLPMetricExporterOptions);
	export(metrics: ResourceMetrics, resultCallback: (result: ExportResult) => void): void;
	shutdown(): Promise<void>;
	forceFlush(): Promise<void>;
	selectAggregationTemporality(instrumentType: InstrumentType): AggregationTemporality;
}

export { AggregationTemporalityPreference, CumulativeTemporalitySelector, DeltaTemporalitySelector, LowMemoryTemporalitySelector, OTLPMetricExporterBase, OTLPMetricExporterOptions };
