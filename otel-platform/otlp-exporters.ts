import {
  type SpanAttributes,
  context,
  diag,
} from "../opentelemetry/api.js";
import {
  ExportResult,
  ExportResultCode,
  baggageUtils,
  suppressTracing,
} from "../opentelemetry/core.js";
import {
  type Resource,
} from "../opentelemetry/resources.js";

import {
  appendResourcePathToUrl,
  appendRootPathToUrlIfNeeded,
  OTLPExporterBase,
  OTLPExporterError,
  type OTLPExporterConfigBase,
  parseHeaders,
} from "../opentelemetry/otlp-exporter-base.js";
import {
  createExportMetricsServiceRequest,
  createExportTraceServiceRequest,
  type IAnyValue,
  type IExportMetricsServiceRequest,
  type IExportTraceServiceRequest,
  type IKeyValue,
} from "../opentelemetry/otlp-transformer.js";

import type {
  ReadableSpan,
  SpanExporter,
} from "../opentelemetry/sdk-trace-base.d.ts";
import type {
  ReadableLogRecord,
  LogRecordExporter,
} from "../opentelemetry/sdk-logs.d.ts";
import type {
  ResourceMetrics,
} from "../opentelemetry/sdk-metrics.d.ts";

type FetchExporterOpts = OTLPExporterConfigBase & {
  defaultPath: string;
  envKey: string;
};

/**
 * Collector Metric Exporter abstract base class
 */
abstract class OTLPFetchExporterBase<
  ExportItem,
  ServiceRequest
> extends OTLPExporterBase<
  FetchExporterOpts,
  ExportItem,
  ServiceRequest
> {
  protected _headers: Headers;

  constructor(
    config: FetchExporterOpts,
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

  getDefaultUrl(config: FetchExporterOpts): string {
    if (typeof config.url === 'string') return config.url;
    return Deno.env.get(`OTEL_EXPORTER_OTLP_${config.envKey}_ENDPOINT`)
      ?? appendResourcePathToUrl(
          Deno.env.get("OTEL_EXPORTER_OTLP_ENDPOINT") ?? 'http://localhost:4318',
          config.defaultPath);
  }

  onInit(): void {
    window.addEventListener('unload', this.shutdown);
  }

  onShutdown(): void {
    window.removeEventListener('unload', this.shutdown);
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

    diag.debug(`OLTP push to ${new URL(this.url).pathname} with ${items.length} spans...`);
    fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(this.convert(items)),
      headers: this._headers,
      signal: AbortSignal.timeout(this.timeoutMillis),
    }).catch(err => {
      diag.error(`OLTP failed: ${err.message}`);
      throw new OTLPExporterError(err.message);
    }).then(resp => {
      diag.debug(`OLTP response: ${resp.status}`);
      if (!resp.ok) {
        resp.text().then(text => diag.debug(text));
        throw new OTLPExporterError(`HTTP ${resp.statusText ?? 'error'} from ${this.url}`, resp.status);
      } else {
        resp.body?.cancel();
      }
    }).then(onSuccess, onError);

    // TODO: retry etc.
    // https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/otlp-exporter-base/src/platform/browser/util.ts
  }
}

/**
 * Collector Trace Exporter for Deno using fetch()
 */
export class OTLPTracesExporter
  extends OTLPFetchExporterBase<ReadableSpan, IExportTraceServiceRequest>
  implements SpanExporter
{
  constructor(config: OTLPExporterConfigBase = {}) {
    super({ ...config,
      envKey: 'TRACES',
      defaultPath: 'v1/traces',
    });
  }

  convert(spans: ReadableSpan[]): IExportTraceServiceRequest {
    return createExportTraceServiceRequest(spans, true);
  }
}

// usage: new OTLPMetricExporterBase(new OTLPExporterDeno())
export class OTLPMetricsExporter extends OTLPFetchExporterBase<
  ResourceMetrics,
  IExportMetricsServiceRequest
> {
  constructor(config?: OTLPExporterConfigBase) {
    super({ ...config,
      envKey: 'METRICS',
      defaultPath: 'v1/metrics',
    });
  }

  convert(metrics: ResourceMetrics[]): IExportMetricsServiceRequest {
    return createExportMetricsServiceRequest(metrics);
  }
}

export class OTLPLogsExporter extends OTLPFetchExporterBase<
  ReadableLogRecord,
  LogPayload
> implements LogRecordExporter {
  constructor(config?: OTLPExporterConfigBase) {
    super({ ...config,
      envKey: 'LOGS',
      defaultPath: 'v1/logs',
    });
  }

  convert(logs: ReadableLogRecord[]): LogPayload {
    return toLogPayload(logs[0].resource, logs);
  }
}

// btw, events are event.name and event.domain

type LogPayload = ReturnType<typeof toLogPayload>;
function toLogPayload(resource: Resource | undefined, allLogs: ReadableLogRecord[]) {
  return {
    "resourceLogs": [{
      resource: resource ? {
        attributes: toAttributes(resource.attributes),
        droppedAttributesCount: 0,
      } : {},
      scopeLogs: allLogs.map(logItem => ({
        scope: {
          name: logItem.instrumentationScope.name,
          version: logItem.instrumentationScope.version,
          // attributes: toAttributes(logItem.),
        },
        schemaUrl: logItem.instrumentationScope.schemaUrl,
        logRecords: [{
          timeUnixNano: `${logItem.hrTime[0]}${logItem.hrTime[1].toString().padStart(9, '0')}`,
          severityNumber: logItem.severityNumber,
          severityText: logItem.severityText,
          // name: 'TODO: logger name',
          body: toAnyValue(logItem.body),
          attributes: toAttributes(logItem.attributes ?? {}),
          droppedAttributesCount: 0,
          traceId: logItem.spanContext?.traceId,
          spanId: logItem.spanContext?.spanId,
        }],
      })),
    }],
  };
}


// https://github.com/open-telemetry/opentelemetry-js/blob/ecb5ebe86eebc5a1880041b2523adf5f6d022282/experimental/packages/otlp-transformer/src/common/internal.ts#L19
function toAttributes(attributes: SpanAttributes): IKeyValue[] {
  return Object.keys(attributes).map(key => toKeyValue(key, attributes[key]));
}
function toKeyValue(key: string, value: unknown): IKeyValue {
  return {
    key: key,
    value: toAnyValue(value),
  };
}
function toAnyValue(value: unknown): IAnyValue {
  const t = typeof value;
  if (t === 'string') return { stringValue: value as string };
  if (t === 'number') {
    if (!Number.isInteger(value)) return { doubleValue: value as number };
    return { intValue: value as number };
  }
  if (t === 'boolean') return { boolValue: value as boolean };
  if (value instanceof Uint8Array) return { bytesValue: value };
  if (Array.isArray(value))
    return { arrayValue: { values: value.map(toAnyValue) } };
  if (t === 'object' && value != null)
    return {
      kvlistValue: {
        values: Object.entries(value as object).map(([k, v]) =>
          toKeyValue(k, v)
        ),
      },
    };

  return {};
}
