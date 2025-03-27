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

import { getStringFromEnv } from './core.js';
import { AggregationTemporality, InstrumentType, AggregationType } from './sdk-metrics.js';
import { OTLPExporterBase, createOtlpHttpExportDelegate, convertLegacyHttpOptions } from './otlp-exporter-base.js';
import { diag } from './api.js';
import { JsonMetricsSerializer } from './otlp-transformer.js';

var AggregationTemporalityPreference;
(function (AggregationTemporalityPreference) {
	AggregationTemporalityPreference[AggregationTemporalityPreference["DELTA"] = 0] = "DELTA";
	AggregationTemporalityPreference[AggregationTemporalityPreference["CUMULATIVE"] = 1] = "CUMULATIVE";
	AggregationTemporalityPreference[AggregationTemporalityPreference["LOWMEMORY"] = 2] = "LOWMEMORY";
})(AggregationTemporalityPreference || (AggregationTemporalityPreference = {}));

const CumulativeTemporalitySelector = () => AggregationTemporality.CUMULATIVE;
const DeltaTemporalitySelector = (instrumentType) => {
	switch (instrumentType) {
		case InstrumentType.COUNTER:
		case InstrumentType.OBSERVABLE_COUNTER:
		case InstrumentType.GAUGE:
		case InstrumentType.HISTOGRAM:
		case InstrumentType.OBSERVABLE_GAUGE:
			return AggregationTemporality.DELTA;
		case InstrumentType.UP_DOWN_COUNTER:
		case InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
			return AggregationTemporality.CUMULATIVE;
	}
};
const LowMemoryTemporalitySelector = (instrumentType) => {
	switch (instrumentType) {
		case InstrumentType.COUNTER:
		case InstrumentType.HISTOGRAM:
			return AggregationTemporality.DELTA;
		case InstrumentType.GAUGE:
		case InstrumentType.UP_DOWN_COUNTER:
		case InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
		case InstrumentType.OBSERVABLE_COUNTER:
		case InstrumentType.OBSERVABLE_GAUGE:
			return AggregationTemporality.CUMULATIVE;
	}
};
function chooseTemporalitySelectorFromEnvironment() {
	const configuredTemporality = (getStringFromEnv('OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE') ??
		'cumulative').toLowerCase();
	if (configuredTemporality === 'cumulative') {
		return CumulativeTemporalitySelector;
	}
	if (configuredTemporality === 'delta') {
		return DeltaTemporalitySelector;
	}
	if (configuredTemporality === 'lowmemory') {
		return LowMemoryTemporalitySelector;
	}
	diag.warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${configuredTemporality}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`);
	return CumulativeTemporalitySelector;
}
function chooseTemporalitySelector(temporalityPreference) {
	if (temporalityPreference != null) {
		if (temporalityPreference === AggregationTemporalityPreference.DELTA) {
			return DeltaTemporalitySelector;
		}
		else if (temporalityPreference === AggregationTemporalityPreference.LOWMEMORY) {
			return LowMemoryTemporalitySelector;
		}
		return CumulativeTemporalitySelector;
	}
	return chooseTemporalitySelectorFromEnvironment();
}
const DEFAULT_AGGREGATION = Object.freeze({
	type: AggregationType.DEFAULT,
});
function chooseAggregationSelector(config) {
	return config?.aggregationPreference ?? (() => DEFAULT_AGGREGATION);
}
class OTLPMetricExporterBase extends OTLPExporterBase {
	_aggregationTemporalitySelector;
	_aggregationSelector;
	constructor(delegate, config) {
		super(delegate);
		this._aggregationSelector = chooseAggregationSelector(config);
		this._aggregationTemporalitySelector = chooseTemporalitySelector(config?.temporalityPreference);
	}
	selectAggregation(instrumentType) {
		return this._aggregationSelector(instrumentType);
	}
	selectAggregationTemporality(instrumentType) {
		return this._aggregationTemporalitySelector(instrumentType);
	}
}

const VERSION = "0.200.0";

const USER_AGENT = {
	'User-Agent': `Deno/${Deno.version.deno} OTel-OTLP-Exporter-JavaScript/${VERSION}`,
};
class OTLPMetricExporter extends OTLPMetricExporterBase {
	constructor(config) {
		super(createOtlpHttpExportDelegate(convertLegacyHttpOptions(config ?? {}, 'METRICS', 'v1/metrics', {
			...USER_AGENT,
			'Content-Type': 'application/json',
		}), JsonMetricsSerializer), config);
	}
}

export { AggregationTemporalityPreference, CumulativeTemporalitySelector, DeltaTemporalitySelector, LowMemoryTemporalitySelector, OTLPMetricExporter, OTLPMetricExporterBase };
