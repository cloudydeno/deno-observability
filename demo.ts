#!/usr/bin/env -S deno run --watch --allow-read --allow-sys=hostname --allow-env --allow-net --allow-run=uptime,sleep,ping
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

import { DenoFetchInstrumentation } from './instrumentation/fetch.ts';
import { DenoTracerProvider, httpTracer, trace } from "./mod.ts";
import { Resource } from "./opentelemetry/resources.js";
import { SubProcessInstrumentation } from './instrumentation/subprocess.ts';
import { registerDenoRuntimeMetrics } from './instrumentation/deno-runtime.ts';
import { DenoLoggingProvider } from "./logging/provider.ts";
import { DenoMetricsProvider } from "./metrics/provider.ts";
import { diag, metrics, ValueType, DiagConsoleLogger } from "./api.ts";
import { SemanticAttributes } from "./opentelemetry/semantic-conventions.js";
import { OTLPLogsExporter, OTLPMetricsExporter, OTLPTracesExporter } from "./otel-platform/otlp-exporters.ts";
import { OTLPMetricExporterBase } from "./opentelemetry/exporter-metrics-otlp-http.js";

diag.setLogger(new DiagConsoleLogger());

const resource = new Resource({
  'service.name': 'observability-demo',
  'deployment.environment': 'local',
  'service.version': 'adhoc',
});

const logger = new DenoLoggingProvider({
  resource,
  batchLogExporters: [
    new OTLPLogsExporter(),
  ],
}).getLogger('demo.ts');

new DenoMetricsProvider({
  resource,
  metricExporter: new OTLPMetricExporterBase(new OTLPMetricsExporter()),
});

registerDenoRuntimeMetrics();

const myMeter = metrics.getMeter('my-service-meter');
const test3 = myMeter.createCounter('test3', {valueType: ValueType.INT})
const test2 = myMeter.createHistogram('test2', {valueType: ValueType.INT})

logger.emit({
  body: 'im alive',
});

const traceProvider = new DenoTracerProvider({
  resource,
  // propagator: new GoogleCloudPropagator(),
  // propagator: new DatadogPropagator(),
  instrumentations: [
    new DenoFetchInstrumentation(),
    new SubProcessInstrumentation(),
  ],
  batchSpanProcessors: [
    new OTLPTracesExporter(),
  ],
});

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log(req.method, url.pathname);


  test3.add(1, {[SemanticAttributes.HTTP_METHOD]: req.method});
  test2.record(50+Math.round(Math.random()*25), {[SemanticAttributes.HTTP_METHOD]: req.method});

  logger.emit({
    body: 'hello world',
  });


  if (url.pathname == '/inner') {
    await getData();
    return new Response(JSON.stringify({
      headers: Object.fromEntries(req.headers),
      remote: await getData(),
    }, null, 2));
  }

  if (url.pathname == '/uptime') {
    const text = await new Promise<string>(ok => setTimeout(async () => {
      const proc = Deno.run({
        cmd: ['uptime'],
        stdin: 'null',
        stdout: 'piped',
        stderr: 'inherit',
      });
      const text = await new Response(proc.stdout.readable).text();
      await proc.status();
      ok(text);
    }, 50));
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
