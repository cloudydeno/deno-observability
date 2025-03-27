import {
  context,
  diag,
  DiagConsoleLogger,
  DiagLogger,
  metrics,
  propagation,
  trace,
  type Attributes,
  type TextMapPropagator,
} from "./opentelemetry/api.js";
import { logs } from "./opentelemetry/api-logs.js";
import {
  CompositePropagator,
  diagLogLevelFromString,
  getBooleanFromEnv,
  getNumberFromEnv,
  getStringFromEnv,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "./opentelemetry/core.js";
import {
  type Instrumentation,
  registerInstrumentations,
} from "./opentelemetry/instrumentation.js";
import {
  detectResources,
  envDetector,
  hostDetector,
  osDetector,
  resourceFromAttributes,
  type Resource,
  type ResourceDetector,
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
  type IMetricReader,
  type ViewOptions,
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
    metricReader?: IMetricReader;
    views?: Array<ViewOptions>;
    instrumentations?: (Instrumentation | Instrumentation[])[];
    resource?: Resource;
    resourceDetectors?: Array<ResourceDetector>;
    mergeResourceWithDefaults?: boolean;
    sampler?: Sampler;
    // serviceName excluded, seems to duplicate resourceAttrs
    spanProcessors?: SpanProcessor[];
    traceExporter?: SpanExporter;
    spanLimits?: SpanLimits;
    idGenerator?: IdGenerator;
  } = {}) {
    // const env = getEnv();

    const logLevel = getStringFromEnv('OTEL_LOG_LEVEL');
    if (props.diagLogger || logLevel) {
      diag.setLogger(props.diagLogger ?? new DiagConsoleLogger(), diagLogLevelFromString(logLevel));
    }

    this.resource = detectResources({
      detectors: props.resourceDetectors ?? getDefaultDetectors(),
    });
    if (props.resource) {
      this.resource = this.resource.merge(props.resource);
    }
    if (props.resourceAttrs) {
      this.resource = this.resource.merge(resourceFromAttributes(props.resourceAttrs));
    }

    if (getBooleanFromEnv('OTEL_SDK_DISABLED')) {
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
      trace.setGlobalTracerProvider(this.tracer);
      context.setGlobalContextManager(new DenoAsyncHooksContextManager().enable());
      propagation.setGlobalPropagator(props.textMapPropagator ?? new CompositePropagator({
        propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
      }));
    }

    const exportIntervalMillis = props.metricsExportIntervalMillis ?? getNumberFromEnv('OTEL_METRIC_EXPORT_INTERVAL');
    const exportTimeoutMillis = getNumberFromEnv('OTEL_METRIC_EXPORT_TIMEOUT');
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

function getDefaultDetectors(): Array<ResourceDetector> {
  // We first check for Deno Deploy then decide what we want to detect based on that
  const denoDeployDetector = new DenoDeployDetector();
  const runtimeDetectors =
    Object.keys(denoDeployDetector.detect()?.attributes ?? {}).length
      ? [denoDeployDetector]
      : [
          new DenoProcessDetector(),
          hostDetector,
          osDetector,
        ];

  return [
    new DenoRuntimeDetector(),
    ...runtimeDetectors,
    envDetector,
  ];
}
