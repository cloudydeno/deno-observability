#!/usr/bin/env -S deno run --watch --allow-read --allow-sys=hostname --allow-env --allow-net --allow-run=uptime,sleep,ping
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

import { DenoFetchInstrumentation } from './instrumentation/fetch.ts';
import { GcpBatchSpanExporter } from "./exporters/google-cloud.ts";
import { DenoTracerProvider, httpTracer, OTLPTraceFetchExporter, trace } from "./mod.ts";
import { DatadogPropagator } from "./propagators/datadog.ts";
import { GoogleCloudPropagator } from "./propagators/google-cloud.ts";
import { Resource } from "npm:@opentelemetry/resources";
import { SubProcessInstrumentation } from './instrumentation/subprocess.ts';

const provider = new DenoTracerProvider({
  resource: new Resource({
    'service.name': 'observability-demo',
    'deployment.environment': 'local',
    'service.version': 'adhoc',
  }),
  propagator: new GoogleCloudPropagator(),
  // propagator: new DatadogPropagator(),
  instrumentations: [
    new DenoFetchInstrumentation(),
    new SubProcessInstrumentation(),
  ],
  batchSpanProcessors: [
    // new GcpBatchSpanExporter(),
    new OTLPTraceFetchExporter(),
  ],
});

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log(req.method, url.pathname);

  if (url.pathname == '/inner') {
    await getData();
    return new Response(JSON.stringify({
      headers: Object.fromEntries(req.headers),
      remote: await getData(),
    }, null, 2));
  }

  if (url.pathname == '/uptime') {
    // const text = await new Promise<string>(ok => setTimeout(async () => {
      const proc = Deno.run({
        cmd: ['uptime'],
        stdin: 'null',
        stdout: 'piped',
        stderr: 'inherit',
      });
      const text = await new Response(proc.stdout.readable).text();
      await proc.status();
      // ok(text);
    // }, 50));
    return new Response(text);
  }

  if (url.pathname == '/sleep') {
    const proc = Deno.run({
      cmd: ['sleep', '1'],
      stdin: 'null',
    });
    await proc.status();
    await Promise.all([1,2,3,4,5].map(x => {
      const proc = Deno.run({
        cmd: ['sleep', `${x}`],
        stdin: 'null',
      });
      return proc.status();
    }));
    const proc2 = Deno.run({
      cmd: ['sleep', '1'],
      stdin: 'null',
    });
    await proc2.status();
    return new Response('done');
  }

  if (url.pathname == '/ping') {
    const proc = Deno.run({
      cmd: ['ping', '-c5', 'google.com'],
      stdin: 'null',
      stdout: 'piped',
      stderr: 'inherit',
    });
    proc.status();
    return new Response(proc.stdout.readable);
  }

  if (url.pathname == '/') {
    const body1 = await getData();
    const body2 = await fetch('http://localhost:8000/inner').then(x => x.json());
    return new Response(JSON.stringify({
      headers: Object.fromEntries(req.headers),
      body1, body2,
    }, null, 2));
  }

  return new Response('404', { status: 404 });
}

async function getData() {
  const resp = await fetch("https://httpbin.org/get");
  trace.getActiveSpan()?.addEvent('fetching-single-span-completed');
  const body = await resp.json();
  return body;
}

await serve(httpTracer(handler));
