import {
  diag,
  DiagConsoleLogger,
  DiagLogger,
  metrics,
  type Attributes,
  type TextMapPropagator,
} from "./opentelemetry/api.js";
import { logs } from "./opentelemetry/api-logs.js";
import { getEnv } from "./opentelemetry/core.js";
import { type Instrumentation, registerInstrumentations } from "./opentelemetry/instrumentation.js";
import {
  type DetectorSync, IResource, Resource,
  detectResourcesSync,
  envDetectorSync,
  hostDetectorSync,
  osDetectorSync,
} from "./opentelemetry/resources.js";

// The SDKs for each signal
import {
  BasicTracerProvider,
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  type IdGenerator,
  type Sampler,
  type SpanExporter,
  type SpanLimits,
  type SpanProcessor,
} from "./opentelemetry/sdk-trace-base.js";
import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
  type MetricReader,
  type View,
} from "./opentelemetry/sdk-metrics.js";
import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
  type LogRecordProcessor,
} from "./opentelemetry/sdk-logs.js";

// OTLP JSON exporters for each signal
import { OTLPLogExporter } from "./opentelemetry/exporter-logs-otlp-http.js";
import { OTLPMetricExporter } from "./opentelemetry/exporter-metrics-otlp-http.js";
import { OTLPTraceExporter } from "./opentelemetry/exporter-trace-otlp-http.js";

// Our Deno-specific implementations
import {
  DenoDeployDetector,
  DenoProcessDetector,
  DenoRuntimeDetector,
} from "./otel-platform/detectors.ts";
import {
  DenoAsyncHooksContextManager,
} from "./otel-platform/context-manager.ts";

import { getDenoAutoInstrumentations } from "./instrumentation/auto.ts";

function getEnvList(key: string) {
  // similar rules to https://github.com/open-telemetry/opentelemetry-js/blob/2053f0d3a44631ade77ea04f656056a2c8a2ae76/experimental/packages/opentelemetry-sdk-node/src/utils.ts#L84
  return Deno.env.get(key)?.split(',').map(x => x.trim()).flatMap(x => x && x != 'null' ? [x] : []) ?? [];
}
function getEnvExporters(key: string, defaultVal: string, label: string) {
  const list = getEnvList(key);
  if (list.length == 0) {
    diag.info(`${key} is empty. Using default "${defaultVal}" exporter.`);
    list.push(defaultVal);
  }
  if (list.includes('none')) {
    diag.info(`${key} contains "none". ${label} provider will not be initialized.`);
    list.length == 0;
  }
  return list;
}
function getEnvInt(key: string) {
  return [Deno.env.get(key)].flatMap(x => x ? [parseInt(x, 10)] : []).at(0);
}

/**
 * A one-stop shop to provide a tracer, a meter, and a logger.
 * Transmits all signals by OTLP by default, except that
 * the metrics exporter is only enabled when a reader interval is set.
 * Can also export to console as per the standard otel environment variables.
 */
export class DenoTelemetrySdk {

  public readonly resource: Resource;
  public readonly tracer?: BasicTracerProvider;
  public readonly meter?: MeterProvider;
  public readonly logger?: LoggerProvider;

  constructor(props: {
    // our custom stuff:
    diagLogger?: DiagLogger;
    resourceAttrs?: Attributes;
    metricsExportIntervalMillis?: number;

    // mirroring NodeSDKConfiguration:
    // autoDetectResources excluded, just pass [] to resourceDetectors
    // contextManager excluded, deno-specific is always used
    textMapPropagator?: TextMapPropagator;
    logRecordProcessors?: Array<LogRecordProcessor>;
    metricReader?: MetricReader;
    views?: Array<View>;
    instrumentations?: (Instrumentation | Instrumentation[])[];
    resource?: IResource;
    resourceDetectors?: Array<DetectorSync>;
    mergeResourceWithDefaults?: boolean;
    sampler?: Sampler;
    // serviceName excluded, seems to duplicate resourceAttrs
    spanProcessors?: SpanProcessor[];
    traceExporter?: SpanExporter;
    spanLimits?: SpanLimits;
    idGenerator?: IdGenerator;
  } = {}) {
    const env = getEnv();

    if (Deno.env.has('OTEL_LOG_LEVEL')) {
      diag.setLogger(props.diagLogger ?? new DiagConsoleLogger(), env.OTEL_LOG_LEVEL);
    }

    this.resource = detectResourcesSync({
      detectors: props.resourceDetectors ?? getDefaultDetectors(),
    });
    if (props.resource) {
      this.resource = this.resource.merge(props.resource);
    }
    if (props.resourceAttrs) {
      this.resource = this.resource.merge(new Resource(props.resourceAttrs));
    }

    if (env.OTEL_SDK_DISABLED) {
      return this;
    }

    const spanProcessors = props.spanProcessors
      ?? (props.traceExporter
        ? [new BatchSpanProcessor(props.traceExporter)]
        : getEnvExporters('OTEL_TRACES_EXPORTER', 'otlp', 'Trace').flatMap(key => {
            switch (key) {
              case 'otlp': return new BatchSpanProcessor(new OTLPTraceExporter());
              case 'console': return new SimpleSpanProcessor(new ConsoleSpanExporter());
              default: diag.warn(`Unsupported OTEL_TRACES_EXPORTER value: "${key}". Supported values are: otlp, console, none.`);
            }
            return [];
          }));

    this.tracer = new BasicTracerProvider({
      resource: this.resource,
      sampler: props.sampler,
      spanLimits: props.spanLimits,
      idGenerator: props.idGenerator,
      spanProcessors,
    });

    // Only register if there is a span processor
    if (spanProcessors.length) {
      this.tracer.register({
        contextManager: new DenoAsyncHooksContextManager().enable(),
        propagator: props.textMapPropagator,
      });
    }

    const exportIntervalMillis = props.metricsExportIntervalMillis ?? getEnvInt('OTEL_METRIC_EXPORT_INTERVAL');
    const exportTimeoutMillis = getEnvInt('OTEL_METRIC_EXPORT_TIMEOUT');
    // Metrics export on a fixed timer, so make the user opt-in to them
    // If there aren't any parameters or envvars for metrics we'll default to 'none'
    const readerDefault = exportIntervalMillis ? 'otlp' : 'none';
    const meterReaders = props.metricReader
      ? [props.metricReader]
      : getEnvExporters('OTEL_METRICS_EXPORTER', readerDefault, 'Metric').flatMap(key => {
          switch (key) {
            case 'otlp':
              return new PeriodicExportingMetricReader({
                exporter: new OTLPMetricExporter(),
                exportIntervalMillis: exportIntervalMillis ?? 60000,
                exportTimeoutMillis: exportTimeoutMillis ?? 30000,
              });
            case 'console':
              return new PeriodicExportingMetricReader({
                exporter: new ConsoleMetricExporter(),
              });
            default: diag.warn(`Unsupported OTEL_METRICS_EXPORTER value: "${key}". Supported values are: otlp, console, none.`);
          }
          return [];
        });
    this.meter = new MeterProvider({
      resource: this.resource,
      views: props.views,
      readers: meterReaders,
    });
    metrics.setGlobalMeterProvider(this.meter);

    this.logger = new LoggerProvider({
      resource: this.resource,
    });
    logs.setGlobalLoggerProvider(this.logger);

    const logProcs = props.logRecordProcessors
      ?? getEnvExporters('OTEL_LOGS_EXPORTER', 'otlp', 'Logger').flatMap(key => {
          switch (key) {
            case 'otlp': return new BatchLogRecordProcessor(new OTLPLogExporter());
            case 'console': return new SimpleLogRecordProcessor(new ConsoleLogRecordExporter());
            default: diag.warn(`Unsupported OTEL_LOGS_EXPORTER value: "${key}". Supported values are: otlp, console, none.`);
          }
          return [];
        });
    for (const proc of logProcs) {
      this.logger.addLogRecordProcessor(proc);
    }

    registerInstrumentations({
      tracerProvider: this.tracer,
      meterProvider: this.meter,
      loggerProvider: this.logger,
      instrumentations: props.instrumentations ?? getDenoAutoInstrumentations(),
    });
  }

  public async forceFlush() {
    await Promise.all([
      this.tracer?.forceFlush(),
      this.meter?.forceFlush(),
      this.logger?.forceFlush(),
    ]);
  }

  public async shutdown() {
    await Promise.all([
      this.tracer?.shutdown(),
      this.meter?.shutdown(),
      this.logger?.shutdown(),
    ]);
  }
}

function getDefaultDetectors(): DetectorSync[] {
  // We first check for Deno Deploy then decide what we want to detect based on that
  const denoDeployDetector = new DenoDeployDetector();
  const runtimeDetectors =
    Object.keys(denoDeployDetector.detect().attributes).length
      ? [denoDeployDetector]
      : [
          new DenoProcessDetector(),
          hostDetectorSync,
          osDetectorSync,
        ];

  return [
    new DenoRuntimeDetector(),
    ...runtimeDetectors,
    envDetectorSync,
  ];
}
