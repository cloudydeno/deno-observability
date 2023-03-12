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
  const tracer = provider.getTracer('http');
  return async (req: Request, connInfo: ConnInfo) => {

    const url = new URL(req.url);
    const ctx = propagation.extract(ROOT_CONTEXT, req.headers, HeadersGetter);
    return tracer.startActiveSpan(`${req.method} ${url.pathname}`, {
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
    }, ctx, async (serverSpan) => {
      try {

        // The actual call to user code
        const resp = await inner(req, connInfo);

        serverSpan.setAttribute('http.status_code', resp.status);
        if (resp.statusText) {
          serverSpan.setAttribute('http.status_text', resp.statusText);
        }
        return resp;

      } catch (err) {
        serverSpan.recordException(err);
        throw err;
      } finally {
        // TODO: body may still be streaming for an arbitrary amount of time
        serverSpan.end();
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
