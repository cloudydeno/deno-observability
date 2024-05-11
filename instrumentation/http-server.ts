import { NetTransportValues, SemanticAttributes } from "../opentelemetry/semantic-conventions.js";
import {
  metrics,
  propagation,
  ROOT_CONTEXT,
  SpanKind,
  trace,
  ValueType,
  type TextMapGetter,
} from "../opentelemetry/api.js";

export function httpTracer(inner: Deno.ServeHandler, opts?: {
  extractTraceContext?: boolean;
}): Deno.ServeHandler {

  // Deno Deploy passes a trace context into the app but doesn't give us its spans
  // So we disable context extraction by default on Deno Deploy
  const extractTraceContext = opts?.extractTraceContext ?? !Deno.env.get('DENO_DEPLOYMENT_ID');

  // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/http.md
  const tracer = trace.getTracer('http');

  // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/semantic_conventions/http-metrics.md
  const myMeter = metrics.getMeter('http');
  const durationMetric = myMeter.createHistogram('http.server.duration', {valueType: ValueType.DOUBLE});
  const inflightMetric = myMeter.createUpDownCounter('http.server.active_requests', {valueType: ValueType.INT});

  return (req: Request, connInfo: Deno.ServeHandlerInfo) => {
    const d0 = performance.now();
    const url = new URL(req.url);

    const reqMetricAttrs = {
      [SemanticAttributes.HTTP_SCHEME]: url.protocol.split(':')[0],
      [SemanticAttributes.HTTP_METHOD]: req.method,
      [SemanticAttributes.NET_HOST_NAME]: url.host, // not sure why metrics spec wants it this way
    };
    inflightMetric.add(1, reqMetricAttrs);

    const ctx = extractTraceContext
      ? propagation.extract(ROOT_CONTEXT, req.headers, HeadersGetter)
      : ROOT_CONTEXT;

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

        if (connInfo.remoteAddr.transport == 'tcp') {
          serverSpan.setAttributes({
            [SemanticAttributes.NET_TRANSPORT]: NetTransportValues.IP_TCP,
            [SemanticAttributes.NET_PEER_IP]: connInfo.remoteAddr.hostname,
            [SemanticAttributes.NET_PEER_PORT]: connInfo.remoteAddr.port,
            ['net.sock.family']: connInfo.remoteAddr.hostname.includes(':') ? 'inet6' : 'inet',
          })
        // Unix sockets are currently behind --unstable so we can't just ref Deno.ServeUnixHandler today
        // } else if (connInfo.localAddr.transport == 'unix' || connInfo.localAddr.transport == 'unixpacket') {
        //   serverSpan.setAttributes({
        //     [SemanticAttributes.NET_TRANSPORT]: NetTransportValues.UNIX,
        //     ['net.sock.family']: 'unix',
        //   })
        }

        // The actual call to user code
        const resp = await inner(req, connInfo);

        serverSpan.addEvent('returned-http-response');
        serverSpan.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, resp.status);
        if (resp.statusText) {
          serverSpan.setAttribute('http.status_text', resp.statusText);
        }

        // Don't snoop the response body if it's not present, including for websockets
        if (resp.body == null) {
          inflightMetric.add(-1, reqMetricAttrs);
          serverSpan.end();
          return resp;
        }

        const respSnoop = snoopStream(resp.body);
        respSnoop.finalSize.then(size => {
          serverSpan.setAttribute(SemanticAttributes.HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, size);
        }).catch(err => {
          serverSpan.recordException(err);
          console.error(`pipeTo failed: ${err.message ?? err}`);
        }).finally(() => {
          inflightMetric.add(-1, reqMetricAttrs);
          serverSpan.end();
        });

        return new Response(respSnoop.newBody, resp);

      } catch (err) {
        serverSpan.recordException(err);
        serverSpan.end();
        inflightMetric.add(-1, reqMetricAttrs);
        console.error('httpTracer Error:', err);
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
