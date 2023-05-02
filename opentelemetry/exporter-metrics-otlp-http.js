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
/// <reference types="./exporter-metrics-otlp-http.d.ts" />

import { getEnv } from './core.js';
import { AggregationTemporality, InstrumentType } from './sdk-metrics.js';
import { diag } from './api.js';

const CumulativeTemporalitySelector = () => AggregationTemporality.CUMULATIVE;
const DeltaTemporalitySelector = (instrumentType) => {
	switch (instrumentType) {
		case InstrumentType.COUNTER:
		case InstrumentType.OBSERVABLE_COUNTER:
		case InstrumentType.HISTOGRAM:
		case InstrumentType.OBSERVABLE_GAUGE:
			return AggregationTemporality.DELTA;
		case InstrumentType.UP_DOWN_COUNTER:
		case InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
			return AggregationTemporality.CUMULATIVE;
	}
};
function chooseTemporalitySelectorFromEnvironment() {
	const env = getEnv();
	const configuredTemporality = env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE.trim().toLowerCase();
	if (configuredTemporality === 'cumulative') {
		return CumulativeTemporalitySelector;
	}
	if (configuredTemporality === 'delta') {
		return DeltaTemporalitySelector;
	}
	diag.warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`);
	return CumulativeTemporalitySelector;
}
function chooseTemporalitySelector(temporalityPreference) {
	if (temporalityPreference != null) {
		if (temporalityPreference === AggregationTemporality.DELTA) {
			return DeltaTemporalitySelector;
		}
		return CumulativeTemporalitySelector;
	}
	return chooseTemporalitySelectorFromEnvironment();
}
class OTLPMetricExporterBase {
	constructor(exporter, config) {
		this._otlpExporter = exporter;
		this._aggregationTemporalitySelector = chooseTemporalitySelector(config?.temporalityPreference);
	}
	export(metrics, resultCallback) {
		this._otlpExporter.export([metrics], resultCallback);
	}
	async shutdown() {
		await this._otlpExporter.shutdown();
	}
	forceFlush() {
		return Promise.resolve();
	}
	selectAggregationTemporality(instrumentType) {
		return this._aggregationTemporalitySelector(instrumentType);
	}
}

export { CumulativeTemporalitySelector, DeltaTemporalitySelector, OTLPMetricExporterBase };
