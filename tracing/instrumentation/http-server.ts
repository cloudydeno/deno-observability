import { NetTransportValues, SemanticAttributes } from "https://esm.sh/@opentelemetry/semantic-conventions@1.9.1";
import {
  metrics,
  propagation,
  ROOT_CONTEXT,
  SpanKind,
  trace,
  ValueType,
  type TextMapGetter,
} from "../api.ts";

export function httpTracer(inner: Handler): Handler {

  // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/http.md
  const tracer = trace.getTracer('http');

  // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/semantic_conventions/http-metrics.md
  const myMeter = metrics.getMeter('http');
  const durationMetric = myMeter.createHistogram('http.server.duration', {valueType: ValueType.DOUBLE});
  const inflightMetric = myMeter.createCounter('http.server.active_requests', {valueType: ValueType.INT});

  return async (req: Request, connInfo: ConnInfo) => {
    const d0 = performance.now();
    const url = new URL(req.url);

    const reqMetricAttrs = {
      [SemanticAttributes.HTTP_SCHEME]: url.protocol.split(':')[0],
      [SemanticAttributes.HTTP_METHOD]: req.method,
      [SemanticAttributes.NET_HOST_NAME]: url.host, // not sure why metrics spec wants it this way
    };
    inflightMetric.add(1, reqMetricAttrs);

    const ctx = propagation.extract(ROOT_CONTEXT, req.headers, HeadersGetter);
    return tracer.startActiveSpan(`${req.method} ${url.pathname}`, {
      kind: SpanKind.SERVER,
      attributes: {
        [SemanticAttributes.HTTP_SCHEME]: url.protocol.split(':')[0],
        [SemanticAttributes.HTTP_METHOD]: req.method,
        [SemanticAttributes.HTTP_URL]: req.url,
        [SemanticAttributes.HTTP_HOST]: url.host,
        [SemanticAttributes.HTTP_USER_AGENT]: req.headers.get('user-agent') ?? undefined,
        [SemanticAttributes.HTTP_ROUTE]: url.pathname, // for datadog
        // 'http.request_content_length': '/http/request/size',
      },
    }, ctx, async (serverSpan) => {
      try {

        if (connInfo.localAddr.transport == 'tcp' && connInfo.remoteAddr.transport == 'tcp') {
          serverSpan.setAttributes({
            [SemanticAttributes.NET_TRANSPORT]: NetTransportValues.IP_TCP,
            [SemanticAttributes.NET_HOST_IP]: connInfo.localAddr.hostname,
            [SemanticAttributes.NET_HOST_PORT]: connInfo.localAddr.port,
            [SemanticAttributes.NET_PEER_IP]: connInfo.remoteAddr.hostname,
            [SemanticAttributes.NET_PEER_PORT]: connInfo.remoteAddr.port,
            ['net.sock.family']: connInfo.remoteAddr.hostname.includes(':') ? 'inet6' : 'inet',
          })
        } else if (connInfo.localAddr.transport == 'unix' || connInfo.localAddr.transport == 'unixpacket') {
          serverSpan.setAttributes({
            [SemanticAttributes.NET_TRANSPORT]: NetTransportValues.UNIX,
            ['net.sock.family']: 'unix',
          })
        }

        // The actual call to user code
        const resp = await inner(req, connInfo);

        serverSpan.addEvent('returned-http-response');
        serverSpan.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, resp.status);
        if (resp.statusText) {
          serverSpan.setAttribute('http.status_text', resp.statusText);
        }

        const respSnoop = snoopStream(resp.body);
        respSnoop.finalSize.then(size => {
          serverSpan.setAttribute(SemanticAttributes.HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, size);
        }).finally(() => {
          inflightMetric.add(-1, reqMetricAttrs);
          serverSpan.end();
        });

        return new Response(respSnoop.newBody, resp)

      } catch (err) {
        serverSpan.recordException(err);
        serverSpan.end();
        inflightMetric.add(-1, reqMetricAttrs);
        throw err;
      } finally {
        durationMetric.record(performance.now() - d0, reqMetricAttrs, ctx);
      }
    });
  };
}

const HeadersGetter: TextMapGetter<Headers> = {
  get(h,k) { return h.get(k) ?? undefined; },
  keys(h) { return Array.from(h.keys()); },
};

// Copies of /std/http/server.ts
interface ConnInfo {
  readonly localAddr: Deno.Addr;
  readonly remoteAddr: Deno.Addr;
}
type Handler = (
  request: Request,
  connInfo: ConnInfo,
) => Response | Promise<Response>;


function snoopStream(stream: ReadableStream<Uint8Array>|null) {
  if (stream) {
    // MITM the response stream so we can wait for the full body to transmit
    let byteSize = 0;
    // TODO: what are the perf and backpressure costs of this?
    const pipe = new TransformStream<Uint8Array,Uint8Array>({
      transform(chunk, ctlr) {
        byteSize += chunk.byteLength;
        return ctlr.enqueue(chunk);
      },
    }, { highWaterMark: 1 });

    return {
      newBody: pipe.readable,
      finalSize: stream.pipeTo(pipe.writable).then(() => byteSize),
    };

  } else {
    return {
      newBody: stream,
      finalSize: Promise.resolve(0),
    };
  }
}
