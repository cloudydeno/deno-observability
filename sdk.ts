import { DiagConsoleLogger, type TextMapPropagator, diag, metrics, DiagLogLevel } from "./opentelemetry/api.js";
import { logs } from "./opentelemetry/api-logs.js";

import { OTLPMetricExporterBase } from "./opentelemetry/exporter-metrics-otlp-http.js";
import { type InstrumentationOption, registerInstrumentations } from "./opentelemetry/instrumentation.js";

import {
  type DetectorSync,
  type Resource,
  detectResourcesSync,
  envDetectorSync,
  hostDetectorSync,
  osDetectorSync,
} from "./opentelemetry/resources.js";

// The SDKs for each signal
import { BasicTracerProvider, BatchSpanProcessor, type IdGenerator, type Sampler } from "./opentelemetry/sdk-trace-base.js";
import { MeterProvider, PeriodicExportingMetricReader, type View } from "./opentelemetry/sdk-metrics.js";
import { BatchLogRecordProcessor, LoggerProvider } from "./opentelemetry/sdk-logs.js";

// Our Deno-specific implementations
import {
  DenoDeployDetector,
  DenoProcessDetector,
  DenoRuntimeDetector,
} from "./otel-platform/detectors.ts";
import {
  DenoAsyncHooksContextManager,
} from "./otel-platform/context-manager.ts";
import {
  OTLPTracesExporter,
  OTLPMetricsExporter,
  OTLPLogsExporter,
} from "./otel-platform/otlp-exporters.ts";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO); // TODO: level from envvar

/**
 * A one-stop shop to provide a tracer, a meter, and a logger.
 * Transmits all signals by OTLP.
 */
export class DenoTelemetrySdk {

  public readonly resource: Resource;
  public readonly tracer: BasicTracerProvider;
  public readonly meter: MeterProvider;
  public readonly logger: LoggerProvider;

  constructor(props?: {
    detectors?: DetectorSync[];
    resource?: Resource;
    instrumentations?: InstrumentationOption[];
    propagator?: TextMapPropagator;
    idGenerator?: IdGenerator;
    sampler?: Sampler;
    metricsExportIntervalMillis?: number;
    metricsViews?: View[];
    otlpEndpointBase?: string;
  }) {

    this.resource = detectResourcesSync({
      detectors: props?.detectors ?? [
        new DenoRuntimeDetector(),
        new DenoDeployDetector(),
        new DenoProcessDetector(),
        hostDetectorSync,
        osDetectorSync,
        envDetectorSync,
      ],
    }).merge(props?.resource ?? null);


    this.tracer = new BasicTracerProvider({
      resource: this.resource,
      idGenerator: props?.idGenerator,
      sampler: props?.sampler,
    });

    this.tracer.register({
      contextManager: new DenoAsyncHooksContextManager().enable(),
      propagator: props?.propagator,
    });

    this.tracer.addSpanProcessor(new BatchSpanProcessor(new OTLPTracesExporter({
      resourceBase: props?.otlpEndpointBase,
    })));


    this.meter = new MeterProvider({
      resource: this.resource,
      views: props?.metricsViews,
    });
    metrics.setGlobalMeterProvider(this.meter);

    // Metrics export on a fixed timer, so let the user disable the requests entirely
    if (props?.metricsExportIntervalMillis !== 0) {
      this.meter.addMetricReader(new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporterBase(new OTLPMetricsExporter({
          resourceBase: props?.otlpEndpointBase,
        })),
        exportIntervalMillis: props?.metricsExportIntervalMillis ?? 20_000,
      }));
    }

    this.logger = new LoggerProvider({
      resource: this.resource,
    });
    logs.setGlobalLoggerProvider(this.logger);

    this.logger.addLogRecordProcessor(new BatchLogRecordProcessor(new OTLPLogsExporter({
      resourceBase: props?.otlpEndpointBase,
    })));

    if (props?.instrumentations) {
      registerInstrumentations({
        tracerProvider: this.tracer,
        meterProvider: this.meter,
        instrumentations: props.instrumentations,
      });
    }

    // registerDenoRuntimeMetrics();
  }
}
