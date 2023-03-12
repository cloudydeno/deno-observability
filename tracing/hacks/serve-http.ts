const tracer = trace.getTracer('http');

// This doesn't seem to work. Deno.serveHttp is based on promises,
// so we are not in a position of continuing the caller above us in a new context.

const original = Deno.serveHttp;
Deno.serveHttp = (conn: Deno.Conn): Deno.HttpConn => {
  const realConn = original(conn);

  return {
    close: () => realConn.close(),
    nextRequest: async (): Promise<Deno.RequestEvent | null> => {
      const evt = await realConn.nextRequest();
      if (!evt) return evt;

      const url = new URL(evt.request.url);
      const ctx = propagation.extract(ROOT_CONTEXT, evt.request.headers, HeadersGetter);
      const singleSpan = tracer.startSpan(`${evt.request.method} ${url.pathname}`, {
        kind: SpanKind.SERVER,
        attributes: {
          'http.method': evt.request.method,
          'http.url': evt.request.url,
          'http.host': url.host,
          'http.scheme': url.protocol.split(':')[0],
          'http.user_agent': evt.request.headers.get('user-agent') ?? undefined,
          // 'http.request_content_length': '/http/request/size',
          // 'http.response_content_length': '/http/response/size',
          // 'http.route': '/http/route',
        },
      }, ctx);

      // context.active().setValue(Symbol("OpenTelemetry Context Key SPAN"), singleSpan);
      // console.log(context.active())
      return context.with<[],() => PromiseLike<Deno.RequestEvent>>(ctx, () => {
        return {
          then(cb?: ((val: Deno.RequestEvent) => Deno.RequestEvent) | null, cb2?: ((err: unknown) => void) | null) { cb?.({
            request: evt.request,
            respondWith: async (resp: Response) => {

              singleSpan.setAttribute('http.status_code', resp.status);
              if (resp.statusText) {
                singleSpan.setAttribute('http.status_text', resp.statusText);
              }

              try {

                await tracer.startActiveSpan('write response headers', () => evt.respondWith(resp));

              } finally {
                singleSpan.end();
              }
            },
          }) },
        };
      });
    },
    rid: realConn.rid,
    [Symbol.asyncIterator]: realConn[Symbol.asyncIterator],
  }
}







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

// function httpTracer(provider: TracerProvider, inner: Handler): Handler {
//   return async (req: Request, connInfo: ConnInfo) => {

//     return await context.with(trace.setSpan(ctx, singleSpan), async () => {
//       try {

//         // The actual call to user code
//         const resp = await inner(req, connInfo);

//         singleSpan.setAttribute('http.status_code', resp.status);
//         if (resp.statusText) {
//           singleSpan.setAttribute('http.status_text', resp.statusText);
//         }
//         return resp;

//       } catch (err) {
//         singleSpan.recordException(err);
//         throw err;
//       } finally {
//         // TODO: body may still be streaming for an arbitrary amount of time
//         singleSpan.end();
//       }
//     });
//   };
// }

const HeadersGetter: TextMapGetter<Headers> = {
  get(h,k) { return h.get(k) ?? undefined; },
  keys(h) { return Array.from(h.keys()); },
};
