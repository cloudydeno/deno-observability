// import {
//   appendResourcePathToUrl,
//   appendRootPathToUrlIfNeeded,
//   OTLPExporterBase,
//   OTLPExporterError,
//   OTLPExporterConfigBase,
//   parseHeaders,
// } from "npm:@opentelemetry/otlp-exporter-base";
// import {
//   baggageUtils,
// } from "npm:@opentelemetry/core";
// import type {
//   ReadableSpan,
//   SpanExporter,
// } from "npm:@opentelemetry/sdk-trace-base";
// import {
//   createExportTraceServiceRequest,
//   IExportTraceServiceRequest,
// } from "npm:@opentelemetry/otlp-transformer";

import {
  appendResourcePathToUrl,
  appendRootPathToUrlIfNeeded,
  OTLPExporterBase,
  OTLPExporterError,
  OTLPExporterConfigBase,
  parseHeaders,
} from "https://esm.sh/@opentelemetry/otlp-exporter-base@0.36.0";
import {
  baggageUtils,
} from "https://esm.sh/@opentelemetry/core@1.10.0";
import type {
  ReadableSpan,
  SpanExporter,
} from "https://esm.sh/@opentelemetry/sdk-trace-base@1.10.0";
import {
  createExportTraceServiceRequest,
  IExportTraceServiceRequest,
} from "https://esm.sh/@opentelemetry/otlp-transformer@0.36.0";

/**
 * Collector Metric Exporter abstract base class
 */
export abstract class OTLPFetchExporterBase<
  ExportItem,
  ServiceRequest
> extends OTLPExporterBase<
  OTLPExporterConfigBase,
  ExportItem,
  ServiceRequest
> {
  protected _headers: Headers;

   constructor(config: OTLPExporterConfigBase = {}) {
    super(config);
    this._headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...parseHeaders(config.headers),
      ...baggageUtils.parseKeyPairsIntoRecord(
        Deno.env.get('OTEL_EXPORTER_OTLP_HEADERS'),
      ),
    });
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
      // diag.debug('Shutdown already started. Cannot send objects');
      return;
    }

    console.info(`OLTP push to ${new URL(this.url).pathname} with`, items.length, 'spans...');
    // console.log(JSON.stringify(this.convert(items)))
    const promise = fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(this.convert(items)),
      headers: this._headers,
      signal: AbortSignal.timeout(this.timeoutMillis),
    }).catch(err => {
      console.error('OLTP failed:', err.message);
      throw new OTLPExporterError(err.message);
    }).then(resp => {
      console.info('OLTP response:', resp.status);
      if (!resp.ok) throw new OTLPExporterError(
        `HTTP ${resp.statusText ?? 'error'} from ${this.url}`, resp.status);
    }).then(onSuccess, onError);

    // TODO: retry etc.
    // https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/otlp-exporter-base/src/platform/browser/util.ts

    // this._sendingPromises.push(promise);
    // const popPromise = () => {
    //   const index = this._sendingPromises.indexOf(promise);
    //   this._sendingPromises.splice(index, 1);
    // };
    // promise.then(popPromise, popPromise);
  }

}


const DEFAULT_COLLECTOR_RESOURCE_PATH = 'v1/traces';
const DEFAULT_COLLECTOR_URL = `http://localhost:4318/${DEFAULT_COLLECTOR_RESOURCE_PATH}`;

/**
 * Collector Trace Exporter for Deno using fetch()
 */
export class OTLPTraceFetchExporter
  extends OTLPFetchExporterBase<ReadableSpan, IExportTraceServiceRequest>
  implements SpanExporter
{
  constructor(config: OTLPExporterConfigBase = {}) {
    super(config);
    for (const [key, val] of Object.entries(baggageUtils.parseKeyPairsIntoRecord(
      Deno.env.get('OTEL_EXPORTER_OTLP_TRACES_HEADERS'),
    ))) {
      this._headers.set(key, val);
    };
  }

  convert(spans: ReadableSpan[]): IExportTraceServiceRequest {
    return createExportTraceServiceRequest(spans, true);
  }

  getDefaultUrl(config: OTLPExporterConfigBase): string {
    return typeof config.url === 'string'
      ? config.url
      : Deno.env.get('OTEL_EXPORTER_OTLP_TRACES_ENDPOINT')
      ? appendRootPathToUrlIfNeeded(Deno.env.get('OTEL_EXPORTER_OTLP_TRACES_ENDPOINT')!)
      : Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT')
      ? appendResourcePathToUrl(
          Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT')!,
          DEFAULT_COLLECTOR_RESOURCE_PATH
        )
      : DEFAULT_COLLECTOR_URL;
  }
}
