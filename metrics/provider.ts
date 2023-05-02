import {
  MeterProvider,
  MeterProviderOptions,
  PeriodicExportingMetricReader,
  PushMetricExporter,
} from "../opentelemetry/sdk-metrics.js";

import { metrics } from "../opentelemetry/api.js";

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
