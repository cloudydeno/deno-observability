import type { ConnInfo, Handler } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  context,
  propagation,
  ROOT_CONTEXT,
  SpanKind,
  trace,
  type TextMapGetter,
  type TracerProvider,
} from 'npm:@opentelemetry/api';

export function httpTracer(provider: TracerProvider, inner: Handler): Handler {
  const webTracerWithZone = provider.getTracer('example-tracer-deno');
  return async (req: Request, connInfo: ConnInfo) => {

    const url = new URL(req.url);
    const ctx = propagation.extract(ROOT_CONTEXT, req.headers, HeadersGetter);
    const singleSpan = webTracerWithZone.startSpan(`${req.method} ${url.pathname}`, {
      kind: SpanKind.SERVER,
      attributes: {
        'http.method': req.method,
        'http.url': req.url,
        'http.host': url.host,
        'http.scheme': url.protocol.split(':')[0],
        'http.user_agent': req.headers.get('user-agent') ?? undefined,
        // 'http.request_content_length': '/http/request/size',
        // 'http.response_content_length': '/http/response/size',
        // 'http.route': '/http/route',
      },
    }, ctx);
    return await context.with(trace.setSpan(ctx, singleSpan), async () => {
      try {

        // The actual call to user code
        const resp = await inner(req, connInfo);

        singleSpan.setAttribute('http.status_code', resp.status);
        if (resp.statusText) {
          singleSpan.setAttribute('http.status_text', resp.statusText);
        }
        return resp;

      } catch (err) {
        singleSpan.recordException(err);
        throw err;
      } finally {
        // TODO: body may still be streaming for an arbitrary amount of time
        singleSpan.end();
      }
    });
  };
}

const HeadersGetter: TextMapGetter<Headers> = {
  get(h,k) { return h.get(k) ?? undefined; },
  keys(h) { return Array.from(h.keys()); },
};
