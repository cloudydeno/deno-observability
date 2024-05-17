import { DiagConsoleLogger, type TextMapPropagator, diag, metrics, Attributes, DiagLogger } from "./opentelemetry/api.js";
import { logs } from "./opentelemetry/api-logs.js";

import { OTLPMetricExporterBase } from "./opentelemetry/exporter-metrics-otlp-http.js";
import { type InstrumentationOption, registerInstrumentations } from "./opentelemetry/instrumentation.js";

import {
  type DetectorSync, Resource,
  detectResourcesSync,
  envDetectorSync,
  hostDetectorSync,
  osDetectorSync,
} from "./opentelemetry/resources.js";

// The SDKs for each signal
import { BasicTracerProvider, BatchSpanProcessor, SpanExporter, type IdGenerator, type Sampler } from "./opentelemetry/sdk-trace-base.js";
import { MeterProvider, PeriodicExportingMetricReader, type View } from "./opentelemetry/sdk-metrics.js";
import { BatchLogRecordProcessor, LogRecordExporter, LoggerProvider } from "./opentelemetry/sdk-logs.js";

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
} from "./otel-platform/otlp-json-exporters.ts";

import { getEnv } from "./opentelemetry/core.js";
import { getDenoAutoInstrumentations } from "./instrumentation/auto.ts";

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
    diagLogger?: DiagLogger;
    detectors?: DetectorSync[];
    resource?: Resource;
    resourceAttrs?: Attributes;
    instrumentations?: InstrumentationOption[];
    propagator?: TextMapPropagator;
    idGenerator?: IdGenerator;
    sampler?: Sampler;
    metricsExportIntervalMillis?: number;
    metricsViews?: View[];
    otlpEndpointBase?: string;
    tracesExporter?: SpanExporter;
    // metricsExporter?: ;
    logsExporter?: LogRecordExporter;
  }) {

    // if (env.OTEL_SDK_DISABLED) {
    //   return this; // TODO: better?
    // }

    const env = getEnv();
    diag.setLogger(props?.diagLogger ?? new DiagConsoleLogger(), env.OTEL_LOG_LEVEL);

    this.resource = detectResourcesSync({
      detectors: props?.detectors ?? getDefaultDetectors(),
    });
    if (props?.resource) {
      this.resource = this.resource.merge(props.resource);
    }
    if (props?.resourceAttrs) {
      this.resource = this.resource.merge(new Resource(props.resourceAttrs));
    }

    this.tracer = new BasicTracerProvider({
      resource: this.resource,
      idGenerator: props?.idGenerator,
      sampler: props?.sampler,
    });
    this.tracer.register({
      contextManager: new DenoAsyncHooksContextManager().enable(),
      propagator: props?.propagator,
    });

    this.tracer.addSpanProcessor(new BatchSpanProcessor(props?.tracesExporter
      ?? new OTLPTracesExporter({
        resourceBase: props?.otlpEndpointBase,
      })));

    this.meter = new MeterProvider({
      resource: this.resource,
      views: props?.metricsViews,
      // Metrics export on a fixed timer, so make the user opt-in to them
      readers: ((props?.metricsExportIntervalMillis ?? 0) > 0) ? [
        new PeriodicExportingMetricReader({
          exporter: new OTLPMetricExporterBase(new OTLPMetricsExporter({
            resourceBase: props?.otlpEndpointBase,
          })),
          exportIntervalMillis: props?.metricsExportIntervalMillis,
        })
      ] : [],
    });
    metrics.setGlobalMeterProvider(this.meter);

    this.logger = new LoggerProvider({
      resource: this.resource,
    });
    logs.setGlobalLoggerProvider(this.logger);

    this.logger.addLogRecordProcessor(new BatchLogRecordProcessor(props?.logsExporter
      ?? new OTLPLogsExporter({
        resourceBase: props?.otlpEndpointBase,
      })));

    registerInstrumentations({
      tracerProvider: this.tracer,
      meterProvider: this.meter,
      loggerProvider: this.logger,
      instrumentations: props?.instrumentations ?? getDenoAutoInstrumentations(),
    });
  }
}

function getDefaultDetectors(): DetectorSync[] {
  // We first check for Deno Deploy then decide what we want to detect based on that
  const denoDeployDetector = new DenoDeployDetector();
  const runtimeDetectors =
    Object.keys(denoDeployDetector.detect().attributes).length
      ? [denoDeployDetector]
      : [
          new DenoRuntimeDetector(),
          new DenoProcessDetector(),
          hostDetectorSync,
          osDetectorSync,
        ];

  return [
    ...runtimeDetectors,
    envDetectorSync,
  ];
}
