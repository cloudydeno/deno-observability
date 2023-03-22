import {
  MeterProvider,
  MeterProviderOptions,
  PeriodicExportingMetricReader,
  PushMetricExporter,
  ResourceMetrics,
} from "https://esm.sh/@opentelemetry/sdk-metrics@1.10.0";
import {
  OTLPMetricExporterBase,
  type OTLPMetricExporterOptions,
} from "https://esm.sh/@opentelemetry/exporter-metrics-otlp-http@0.36.0"
import {
  baggageUtils,
} from "https://esm.sh/@opentelemetry/core@1.10.0";
import {
  type OTLPExporterConfigBase,
  appendResourcePathToUrl,
  appendRootPathToUrlIfNeeded,
} from "https://esm.sh/@opentelemetry/otlp-exporter-base@0.36.0";
import {
  createExportMetricsServiceRequest,
  type IExportMetricsServiceRequest,
} from 'https://esm.sh/@opentelemetry/otlp-transformer@0.36.0';

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
