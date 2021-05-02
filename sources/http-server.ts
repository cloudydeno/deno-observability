import { OpenMetric } from '../sinks/openmetrics/types.ts';
import { DefaultRegistry } from '../sinks/openmetrics/registry.ts';

import * as http from 'https://deno.land/std@0.95.0/http/server.ts';
export type {
  Response,
  HTTPOptions, HTTPSOptions,
} from 'https://deno.land/std@0.95.0/http/server.ts';
export {
  ServerRequest,
} from 'https://deno.land/std@0.95.0/http/server.ts';

import { STATUS_TEXT } from "https://deno.land/std@0.95.0/http/http_status.ts";

const encoder = new TextEncoder();

export class Server extends http.Server {
  constructor(private realServer: http.Server) {
    super(realServer.listener);
    DefaultRegistry.sources.push(this);
  }
  #inFlight = 0;
  #served = 0;
  #totalTime = 0;
  #within10ms = 0;
  #within100ms = 0;
  #within1000ms = 0;
  #respSizing: ResponseSize = {bodyBytes: 0,headerBytes: 0,framingBytes: 0};
  #counters = new Map<string,number>();

  close(): void {
    this.realServer.close();
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<http.ServerRequest> {
    for await (const req of this.realServer) {
      this.#inFlight++;
      const d0 = performance.now();
      const originalRespFunc = req.respond;
      req.respond = async (resp: http.Response) => {
        // const d1 = performance.now();
        const counterKey = `{code="${resp.status || 200}",method=${JSON.stringify(req.method.toLowerCase())}}`;

        // Transmit the body, intercepting body size
        const responseSize = spyResponseSize(resp);
        await originalRespFunc.call(req, resp);
        const respSizing = await responseSize;

        const d2 = performance.now();

        // Lots of final tallies!
        const totalMillis = d2-d0;
        this.#inFlight--;
        this.#served++;
        this.#totalTime += totalMillis;
        this.#respSizing.bodyBytes += respSizing.bodyBytes;
        this.#respSizing.framingBytes += respSizing.framingBytes;
        this.#respSizing.headerBytes += respSizing.headerBytes;
        if (totalMillis <   10) this.#within10ms++;
        if (totalMillis <  100) this.#within100ms++;
        if (totalMillis < 1000) this.#within1000ms++;

        const counter = this.#counters.get(counterKey) ?? 0;
        this.#counters.set(counterKey, counter + 1);
      };

      yield req;
    }
  }

  *scrapeMetrics(): Generator<OpenMetric> {

    yield {
      prefix: "denohttp_handled_requests",
      type: 'counter',
      help: `Number of HTTP requests that have been received and responded to in full.`,
      values: this.#counters};

    yield {
      prefix: "denohttp_requests_in_flight",
      type: 'gauge',
      help: `Current number of HTTP requests being served.`,
      singleValue: this.#inFlight};

    yield {
      prefix: "denohttp_request_duration_seconds",
      type: 'histogram',
      unit: 'seconds',
      help: `A histogram of the HTTP request durations, including writing a response.`,
      values: new Map([
        ['_bucket{le="0.01"}', this.#within10ms],
        ['_bucket{le="0.1"}', this.#within100ms],
        ['_bucket{le="1"}', this.#within1000ms],
        ['_bucket{le="+Inf"}', this.#served],
        ['_sum', this.#totalTime / 1000],
        ['_count', this.#served],
      ])};

    yield {
      prefix: "denohttp_response_bytes",
      type: 'counter',
      unit: 'bytes',
      help: `Number of bytes transmitted in response to HTTP requests.`,
      values: new Map([
        ['_total{purpose="body"}', this.#respSizing.bodyBytes],
        ['_total{purpose="framing"}', this.#respSizing.framingBytes],
        ['_total{purpose="header"}', this.#respSizing.headerBytes],
      ])};

  }
}


// recreate the signatures of https://deno.land/std@0.84.0/http/server.ts
// should make this module easy to drop into whatever

/**
 * Create a HTTP server
 */
export function serve(addr: string | http.HTTPOptions): Server {
  return new Server(http.serve(addr));
}
/**
 * Start an HTTP server with given options and request handler
 */
export async function listenAndServe(
  addr: string | http.HTTPOptions,
  handler: (req: http.ServerRequest) => void,
): Promise<void> {
  const server = serve(addr);

  for await (const request of server) {
    handler(request);
  }
}
/**
 * Create an HTTPS server with given options
 */
export function serveTLS(options: http.HTTPSOptions): Server {
  return new Server(http.serveTLS(options));
}
/**
 * Start an HTTPS server with given options and request handler
 */
export async function listenAndServeTLS(
  options: http.HTTPSOptions,
  handler: (req: http.ServerRequest) => void,
): Promise<void> {
  const server = serveTLS(options);

  for await (const request of server) {
    handler(request);
  }
}


// Intercept response bodies in order to observe size,
// even if a streaming body is being sent

interface ResponseSize {
  framingBytes: number;
  headerBytes: number;
  bodyBytes: number;
}

function spyResponseSize(r: http.Response): Promise<ResponseSize> {

  // TODO: just ignoring trailers for now
  if (r.trailers) console.error(`WARN: HTTP response included trailer headers, which will not be counted towards HTTP server metrics`);

  const statusCode = r.status || 200;
  const statusText = STATUS_TEXT.get(statusCode) ?? '';

  if (!r.body) {
    r.body = new Uint8Array();
  }
  if (typeof r.body === "string") {
    r.body = encoder.encode(r.body);
  }

  const size = {
    framingBytes: `HTTP/1.1 ${statusCode} ${statusText}\r\n\r\n`.length,
    headerBytes: 0,
    bodyBytes: -1,
  };

  const headers = r.headers ?? new Headers();
  for (const [key, val] of headers) {
    size.headerBytes += val.length + key.length + 4;
  }

  if (r.body && !headers.get("content-length")) {
    if (r.body instanceof Uint8Array) {
      size.headerBytes += `content-length: ${r.body.byteLength}\r\n`.length;
    } else if (!headers.get("transfer-encoding")) {
      size.headerBytes += "transfer-encoding: chunked\r\n".length;
    }
  }

  if (r.body instanceof Uint8Array) {
    size.bodyBytes = r.body.byteLength;

  } else if (headers.has("content-length")) {
    const contentLength = headers.get("content-length");
    size.bodyBytes = parseInt(contentLength ?? '0');

  } else {
    // Streaming bodies are fun!
    // Let's divide between body and framing tallies.
    size.bodyBytes = 0;
    const realBody = r.body;
    return new Promise(ok => {
      r.body = {
        read(b) {
          const real = realBody.read(b);
          real.then(x => {
            if (x == null) {
              size.framingBytes += 5;
              ok(size);
            } else if (x > 1) {
              size.bodyBytes += x;
              size.framingBytes += x.toString(16).length + 4
            }
          })
          return real;
        },
      };
    });
  }

  return Promise.resolve(size);
}
