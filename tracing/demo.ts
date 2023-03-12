#!/usr/bin/env -S deno run --watch --allow-read --allow-sys=hostname --allow-env --allow-net
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// import { B3Propagator } from 'npm:@opentelemetry/propagator-b3';
import { CloudPropagator } from 'npm:@google-cloud/opentelemetry-cloud-trace-propagator';

import { DenoFetchInstrumentation } from './instrumentation/fetch.ts';
import { GcpBatchSpanExporter } from "./gcp-exporter.ts";
import { httpTracer } from "./http-server.ts";
import { DenoTracerProvider, registerInstrumentations } from "./mod.ts";

const provider = new DenoTracerProvider();
provider.addBatchSpanProcessor(new GcpBatchSpanExporter());
provider.register({
  propagator: new CloudPropagator(),
});

registerInstrumentations({
  instrumentations: [
    new DenoFetchInstrumentation(),
  ],
});

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log(req.method, url.pathname);

  if (url.pathname == '/inner') {
    await getData();
    return new Response(await getData());
  }

  const body1 = await getData();
  const body2 = await fetch('http://localhost:8000/inner').then(x => x.text());
  return new Response(JSON.stringify({ body1, body2 }));
}

async function getData() {
  const resp = await fetch("https://httpbin.org/get");
  // trace.getSpan(context.active())?.addEvent('fetching-single-span-completed');
  const body = await resp.text();
  return body;
}

await serve(httpTracer(provider, handler));
