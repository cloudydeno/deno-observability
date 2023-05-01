import {
  MeterProvider,
  MeterProviderOptions,
  PeriodicExportingMetricReader,
  PushMetricExporter,
  ResourceMetrics,
} from "../opentelemetry/sdk-metrics.js";
import {
  OTLPMetricExporterBase,
  type OTLPMetricExporterOptions,
} from "../opentelemetry/exporter-metrics-otlp-http.js";
import {
  baggageUtils,
} from "../opentelemetry/core.js";
import {
  type OTLPExporterConfigBase,
  appendResourcePathToUrl,
  appendRootPathToUrlIfNeeded,
} from "../opentelemetry/otlp-exporter-base.js";
import {
  createExportMetricsServiceRequest,
  type IExportMetricsServiceRequest,
} from '../opentelemetry/otlp-transformer.js';

import { metrics } from "../api.ts";
import { OTLPFetchExporterBase } from "../exporters/oltp-fetch.ts";

const DEFAULT_COLLECTOR_RESOURCE_PATH = 'v1/metrics';
const DEFAULT_COLLECTOR_URL = `http://localhost:4318/${DEFAULT_COLLECTOR_RESOURCE_PATH}`;

class OTLPExporterDeno extends OTLPFetchExporterBase<
  ResourceMetrics,
  IExportMetricsServiceRequest
> {
  constructor(config?: OTLPMetricExporterOptions & OTLPExporterConfigBase) {
    super(config);
    this._headers = Object.assign(
      this._headers,
      baggageUtils.parseKeyPairsIntoRecord(
        Deno.env.get("OTEL_EXPORTER_OTLP_METRICS_HEADERS")
      )
    );
  }

  getDefaultUrl(config: OTLPExporterConfigBase): string {
    return typeof config.url === 'string'
      ? config.url
      : Deno.env.get("OTEL_EXPORTER_OTLP_METRICS_ENDPOINT")
      ? appendRootPathToUrlIfNeeded(
          Deno.env.get("OTEL_EXPORTER_OTLP_METRICS_ENDPOINT")!
        )
      : Deno.env.get("OTEL_EXPORTER_OTLP_ENDPOINT")
      ? appendResourcePathToUrl(
          Deno.env.get("OTEL_EXPORTER_OTLP_ENDPOINT")!,
          DEFAULT_COLLECTOR_RESOURCE_PATH
        )
      : DEFAULT_COLLECTOR_URL;
  }

  convert(metrics: ResourceMetrics[]): IExportMetricsServiceRequest {
    return createExportMetricsServiceRequest(metrics);
  }
}

/**
 * Collector Metric Exporter for Web
 */
export class OTLPMetricExporter extends OTLPMetricExporterBase<OTLPExporterDeno> {
  constructor(config?: OTLPExporterConfigBase & OTLPMetricExporterOptions) {
    super(new OTLPExporterDeno(config), config);
  }
}

export class DenoMetricsProvider extends MeterProvider {
  constructor(config?: MeterProviderOptions & {
    metricExporter?: PushMetricExporter;
    metricExporterInterval?: number,
  }) {
    super(config);

    metrics.setGlobalMeterProvider(this);

    if (config?.metricExporter) {
      this.addMetricReader(new PeriodicExportingMetricReader({
        exporter: config.metricExporter,
        exportIntervalMillis: config.metricExporterInterval ?? 20_000,
      }));
    }
  }
}
