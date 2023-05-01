import { logs } from "../opentelemetry/api-logs.js";
import { BatchLogRecordProcessor, LoggerProvider, LogRecordExporter, ReadableLogRecord } from "../opentelemetry/sdk-logs.js";
import { SpanAttributes } from "../api.ts";

// import { OTLP } from "../opentelemetry/exporter-metrics-otlp-http.js";

import { baggageUtils, ExportResult, ExportResultCode } from "../opentelemetry/core.js";

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
import { IResource } from "../opentelemetry/resources.d.ts";

const DEFAULT_COLLECTOR_RESOURCE_PATH = 'v1/logs';
const DEFAULT_COLLECTOR_URL = `http://localhost:4318/${DEFAULT_COLLECTOR_RESOURCE_PATH}`;


class OTLPLogExporterBrowserProxy extends OTLPFetchExporterBase<
  ReadableLogRecord,
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

  convert(logs: ReadableLogRecord[]): LogPayload {
    return toLogPayload(logs[0].resource, logs);
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

class OTLPLogRecordExporter implements LogRecordExporter {
  export(logs: ReadableLogRecord[], resCb: (result: ExportResult) => void) {
    if (logs.length == 0) {
      return resCb({ code: ExportResultCode.SUCCESS });
    }
    new Promise<void>((ok, fail) =>
      new OTLPLogExporterBrowserProxy().send(logs, ok, fail))
    .then(
      () => resCb({ code: ExportResultCode.SUCCESS }),
      (error) => resCb({ code: ExportResultCode.FAILED, error }));
  }
  async shutdown() {}
}

export class DenoLoggingProvider extends LoggerProvider {
  constructor(opts?: {
    resource?: IResource,
  }) {
    super(opts);

    logs.setGlobalLoggerProvider(this);

    this.addLogRecordProcessor(
      new BatchLogRecordProcessor(new OTLPLogRecordExporter())
    );
  }
}

// btw, events are event.name and event.domain

type LogPayload = ReturnType<typeof toLogPayload>;
function toLogPayload(resource: Resource | undefined, allLogs: ReadableLogRecord[]) {
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
