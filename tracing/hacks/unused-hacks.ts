// Not currently used/needed, keeping in git just in case

import { ConnInfo, Handler, serve } from "https://deno.land/std@0.177.0/http/server.ts";

import { context, propagation, ROOT_CONTEXT, SpanKind, SpanStatusCode, TextMapGetter, trace, TracerProvider } from 'npm:@opentelemetry/api';
import { BasicTracerProvider, BatchSpanProcessor, SamplingDecision } from 'npm:@opentelemetry/sdk-trace-base';
// import { OTLPTraceExporter } from 'npm:@opentelemetry/exporter-trace-otlp-http';
// import { WebTracerProvider } from 'npm:@opentelemetry/sdk-trace-web';
import { FetchInstrumentation } from 'npm:@opentelemetry/instrumentation-fetch';
// import { B3Propagator } from 'npm:@opentelemetry/propagator-b3';
import { registerInstrumentations } from 'npm:@opentelemetry/instrumentation';
import { GcpBatchSpanExporter } from "./gcp-exporter.ts";
import { CloudPropagator } from 'npm:@google-cloud/opentelemetry-cloud-trace-propagator';
import { AsyncLocalStorageContextManager } from 'npm:@opentelemetry/context-async-hooks';
// import { AsyncHooksContextManager } from "./deno-context.ts";

//Hacks - start
globalThis.document = {
  createElement: function() { //For this line - https://github.com/open-telemetry/opentelemetry-js/blob/bdb61f7e56b7fbe7d281262e69e5bc8683a52014/packages/opentelemetry-sdk-trace-web/src/utils.ts#L33
    return {
      protocol: ":", //For this line - https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/opentelemetry-instrumentation-xml-http-request/src/xhr.ts#L170
    };
  }
};
globalThis.location = {}; //For this line - https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-sdk-trace-web/src/utils.ts#L424

performance.clearResourceTimings = function() {}; //For this line and Deno Deploy bug - https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/opentelemetry-instrumentation-fetch/src/fetch.ts#L181
//Hacks - end

// // was WebTracerProvider, not sure what's different
// const provider = new BasicTracerProvider({
//   sampler: {shouldSample: () => ({decision: SamplingDecision.RECORD_AND_SAMPLED})},
// });

// // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
// provider.addSpanProcessor(new BatchSpanProcessor(new GcpBatchSpanWriter()))
// provider.register({
//   contextManager: new AsyncLocalStorageContextManager(),
//   propagator: new CloudPropagator(),
// });

// registerInstrumentations({
//   instrumentations: [
//     new FetchInstrumentation({
//       ignoreUrls: [/localhost:8090\/sockjs-node/],
//       propagateTraceHeaderCorsUrls: [
//         'https://cors-test.appspot.com/test',
//         'https://httpbin.org/get',
//       ],
//       clearTimingResources: true,
//     }),
//   ],
// });

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
    // console.log('got ctx', ctx)
    // webTracerWithZone.startSpan()
    return await context.with(trace.setSpan(ctx, singleSpan), async () => {
    // return await context.with(ctx, async () => {

      const resp = await inner(req, connInfo);

      try {
        singleSpan.setAttribute('http.status_code', resp.status);
        if (resp.statusText) {
          singleSpan.setAttribute('http.status_text', resp.statusText);
        }
        return resp;
      } catch (err) {
        singleSpan.recordException(err);
        throw err;
      } finally {
        singleSpan.end();
      }
    });
  };
}

const HeadersGetter: TextMapGetter<Headers> = {
  get(h,k) { return h.get(k) ?? undefined; },
  keys(h) { return Array.from(h.keys()); },
};
