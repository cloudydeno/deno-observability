import { Logger, LoggerOptions, LoggerProvider, LogRecord, logs } from "../opentelemetry/api-logs.js";
import { Attributes, context, SpanAttributes, trace } from "../api.ts";

// import { OTLP } from "../opentelemetry/exporter-metrics-otlp-http.js";

import { baggageUtils, suppressTracing } from "../opentelemetry/core.js";

import {
  // OTLPExporterBrowserBase,
  type OTLPExporterConfigBase,
  appendResourcePathToUrl,
  appendRootPathToUrlIfNeeded,
} from "../opentelemetry/otlp-exporter-base.js";
import type {
  IAnyValue,
  IKeyValue,
} from '../opentelemetry/otlp-transformer.js';
import { OTLPFetchExporterBase } from "../exporters/oltp-fetch.ts";
import { Resource } from "../mod.ts";

const DEFAULT_COLLECTOR_RESOURCE_PATH = 'v1/logs';
const DEFAULT_COLLECTOR_URL = `http://localhost:4318/${DEFAULT_COLLECTOR_RESOURCE_PATH}`;


class OTLPLogExporterBrowserProxy extends OTLPFetchExporterBase<
  LogPayload,
  LogPayload
> {
  constructor(config?: OTLPExporterConfigBase) {
    super(config);
    this._headers = Object.assign(
      this._headers,
      baggageUtils.parseKeyPairsIntoRecord(
        Deno.env.get("OTEL_EXPORTER_OTLP_LOGS_HEADERS")
      )
    );
  }

  getDefaultUrl(config: OTLPExporterConfigBase): string {
    return typeof config.url === 'string'
      ? config.url
      : Deno.env.get("OTEL_EXPORTER_OTLP_LOGS_ENDPOINT")
      ? appendRootPathToUrlIfNeeded(
          Deno.env.get("OTEL_EXPORTER_OTLP_LOGS_ENDPOINT")!
        )
      : Deno.env.get("OTEL_EXPORTER_OTLP_ENDPOINT")
      ? appendResourcePathToUrl(
          Deno.env.get("OTEL_EXPORTER_OTLP_ENDPOINT")!,
          DEFAULT_COLLECTOR_RESOURCE_PATH
        )
      : DEFAULT_COLLECTOR_URL;
  }

  convert(logs: LogPayload[]): LogPayload {
    return logs[0];
  }
}

// /**
//  * Collector Metric Exporter for Web
//  */
// export class OTLPMetricExporter extends OTLPMetricExporterBase<OTLPExporterBrowserProxy> {
//   constructor(config?: OTLPExporterConfigBase & OTLPMetricExporterOptions) {
//     super(new OTLPExporterBrowserProxy(config), config);
//   }
// }



export class DenoLoggingProvider implements LoggerProvider {
  resource?: Resource;
  constructor(config?: {
    resource?: Resource,
  }) {
    // super(config);
    this.resource = config?.resource;

    logs.setGlobalLoggerProvider(this);

    // if (config?.metricExporter) {
    //   this.addMetricReader(new PeriodicExportingMetricReader({
    //     exporter: config.metricExporter,
    //     exportIntervalMillis: config.metricExporterInterval ?? 10_000,
    //   }));
    // }

    setInterval(context.bind(suppressTracing(context.active()), () => {
      if (!TODOpendinglogs.length) return;
      const payload = toLogPayload(this.resource, TODOpendinglogs);
      TODOpendinglogs.length = 0;
      new Promise<void>((ok,fail) =>
        new OTLPLogExporterBrowserProxy().send([payload], ok, fail));
    }), 5000);
  }
  getLogger(name: string, version?: string, options?: LoggerOptions): DenoLogger {
    return new DenoLogger(name, version, options);
  }
}

// btw, events are event.name and event.domain

const TODOpendinglogs: {
  record: LogRecord;
  scope: {
    name: string,
    version?: string,
    attributes: Attributes;
    schemaUrl?: string;
  };
}[] = [];
type LogPayload = ReturnType<typeof toLogPayload>;
function toLogPayload(resource: Resource | undefined, allLogs: typeof TODOpendinglogs) {
  // {"resourceLogs":[
  //   {"resource":{"attributes":[
  //     {"key":"resource-attr","value":{"stringValue":"resource-attr-val-1"}}]},
  //    "scopeLogs":[{
  //      "scope":{},"logRecords":[{
  //        "timeUnixNano":"1678709014775000789","severityNumber":9,"severityText":"Info",
  //        "name":"logA","body":{"stringValue":"This is a log message"},
  //        "attributes":[{"key":"app","value":{"stringValue":"server"}},{"key":"instance_num","value":{"intValue":"1"}}],
  //        "droppedAttributesCount":1,
  //        "traceId":"08040201000000000000000000000000","spanId":"0102040800000000"},
  //       {"timeUnixNano":"1678709014775000789","severityNumber":9,"severityText":"Info","name":"logB","body":{"stringValue":"something happened"},"attributes":[{"key":"customer","value":{"stringValue":"acme"}},{"key":"env","value":{"stringValue":"dev"}}],"droppedAttributesCount":1,"traceId":"","spanId":""}]}]}]}'
  return {
    "resourceLogs": [{
      resource: resource ? {
        attributes: toAttributes(resource.attributes),
        droppedAttributesCount: 0,
      } : {},
      scopeLogs: allLogs.map(logItem => ({
        scope: {
          name: logItem.scope.name,
          version: logItem.scope.version,
          attributes: toAttributes(logItem.scope.attributes),
        },
        schemaUrl: logItem.scope.schemaUrl,
        logRecords: [logItem.record].map(log => ({
          timeUnixNano: log.timestamp?.toFixed(0),
          severityNumber: log.severityNumber,
          severityText: log.severityText,
          // name: 'TODO: logger name',
          body: toAnyValue(log.body),
          attributes: toAttributes(log.attributes ?? {}),
          droppedAttributesCount: 0,
          traceId: log.traceId,
          spanId: log.spanId,
        })),
      })),
    }],
  };
}

export class DenoLogger implements Logger {
  attributes: Attributes;
  schemaUrl?: string;
  constructor(
    public readonly name: string,
    public readonly version?: string,
    options?: LoggerOptions,
  ) {
    this.attributes = options?.scopeAttributes ?? {};
    this.schemaUrl = options?.schemaUrl;
  }

  emit(logRecord: LogRecord): void {
    const spanCtx = trace.getActiveSpan()?.spanContext();
    TODOpendinglogs.push({
      scope: {
        name: this.name,
        version: this.version,
        attributes: this.attributes,
      },
      record: {
        timestamp: Date.now() * 1_000_000,
        ...logRecord,
        spanId: spanCtx?.spanId,
        traceId: spanCtx?.traceId,
        traceFlags: spanCtx?.traceFlags,
      },
    });
  }
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
