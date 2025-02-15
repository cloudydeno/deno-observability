import { diag } from "../opentelemetry/api.js";
import { baggageUtils } from "../opentelemetry/core.js";
import {
  appendResourcePathToUrl,
  OTLPExporterBase,
  OTLPExporterError,
  type OTLPExporterConfigBase,
  parseHeaders,
} from "../opentelemetry/otlp-exporter-base.js";
import {
  JsonLogsSerializer,
  JsonMetricsSerializer,
  JsonTraceSerializer,
  type IExportLogsServiceResponse,
  type IExportMetricsServiceResponse,
  type IExportTraceServiceResponse,
  type ISerializer,
} from "../opentelemetry/otlp-transformer.js";

import type {
  ReadableSpan,
  SpanExporter,
} from "../opentelemetry/sdk-trace-base.d.ts";
import type {
  ResourceMetrics,
} from "../opentelemetry/sdk-metrics.d.ts";
import type {
  ReadableLogRecord,
  LogRecordExporter,
} from "../opentelemetry/sdk-logs.d.ts";

type AbstractExporterOpts = OTLPExporterConfigBase & {
  resourceBase?: string;
  resourcePath: string;
  envKey: string;
};

type ExporterOpts = OTLPExporterConfigBase & {
  resourceBase?: string;
}

/**
 * Collector Metric Exporter abstract base class
 */
abstract class OTLPFetchExporterBase<
  ExportItem,
  ServiceResponse
> extends OTLPExporterBase<
  AbstractExporterOpts,
  ExportItem
> {
  protected _headers: Headers;

  constructor(
    config: AbstractExporterOpts,
    private readonly serializer: ISerializer<ExportItem[], ServiceResponse>,
  ) {
    super(config);
    this._headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...parseHeaders(config.headers),
      ...baggageUtils.parseKeyPairsIntoRecord(
        Deno.env.get('OTEL_EXPORTER_OTLP_HEADERS'),
      ),
      ...baggageUtils.parseKeyPairsIntoRecord(
        Deno.env.get(`OTEL_EXPORTER_OTLP_${config.envKey}_HEADERS`),
      ),
    });
  }

  getDefaultUrl(config: AbstractExporterOpts): string {
    if (typeof config.url === 'string') return config.url;
    return Deno.env.get(`OTEL_EXPORTER_OTLP_${config.envKey}_ENDPOINT`)
      ?? appendResourcePathToUrl(
          config.resourceBase
            ?? Deno.env.get("OTEL_EXPORTER_OTLP_ENDPOINT")
            ?? 'http://localhost:4318',
          config.resourcePath);
  }

  onInit(): void {
    globalThis.addEventListener('unload', this.shutdown);
  }

  onShutdown(): void {
    globalThis.removeEventListener('unload', this.shutdown);
  }

  send(
    items: ExportItem[],
    onSuccess: () => void,
    onError: (error: OTLPExporterError) => void
  ): void {
    if (this._shutdownOnce.isCalled) {
      diag.debug('Shutdown already started. Cannot send objects');
      return;
    }

    diag.debug(`OTLP push to ${new URL(this.url).pathname} with ${items.length} items...`);
    fetch(this.url, {
      method: 'POST',
      body: this.serializer.serializeRequest(items),
      headers: this._headers,
      signal: AbortSignal.timeout(this.timeoutMillis),
    }).catch(err => {
      diag.debug(`OTLP failed: ${err.message}`);
      throw new OTLPExporterError(err.message);
    }).then(resp => {
      diag.debug(`OTLP response: ${resp.status}`);
      if (!resp.ok) {
        resp.text().then(text => diag.debug(text));
        throw new OTLPExporterError(`HTTP ${resp.statusText ?? 'error'} from ${this.url}`, resp.status);
      } else {
        // this.serializer.deserializeResponse(resp.arrayBuffer())
        resp.body?.cancel();
      }
    }).then(onSuccess, onError);

    // TODO: retry etc.
    // https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/otlp-exporter-base/src/platform/browser/util.ts
  }
}

/**
 * JSON-based Trace Exporter for Deno using fetch()
 */
export class OTLPTracesExporter
  extends OTLPFetchExporterBase<ReadableSpan, IExportTraceServiceResponse>
  implements SpanExporter
{
  constructor(config?: ExporterOpts) {
    super({
      resourcePath: 'v1/traces',
      ...config,
      envKey: 'TRACES',
    }, JsonTraceSerializer);
  }
}

/**
 * JSON-based Metrics Exporter for Deno using fetch()
 * usage: new OTLPMetricExporterBase(new OTLPExporterDeno())
 */
export class OTLPMetricsExporter
  extends OTLPFetchExporterBase<ResourceMetrics, IExportMetricsServiceResponse>
{
  constructor(config?: ExporterOpts) {
    super({
      resourcePath: 'v1/metrics',
      ...config,
      envKey: 'METRICS',
    }, JsonMetricsSerializer);
  }
}

/**
 * JSON-based Logs Exporter for Deno using fetch()
 */
export class OTLPLogsExporter
  extends OTLPFetchExporterBase<ReadableLogRecord, IExportLogsServiceResponse>
  implements LogRecordExporter
{
  constructor(config?: ExporterOpts) {
    super({
      resourcePath: 'v1/logs',
      ...config,
      envKey: 'LOGS',
    }, JsonLogsSerializer);
  }
}
// btw, events are event.name and event.domain
