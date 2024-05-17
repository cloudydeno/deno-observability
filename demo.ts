#!/usr/bin/env -S deno run --watch --allow-read --allow-sys=hostname,osRelease --allow-env --allow-net --allow-run=uptime,sleep,ping
import { metrics, trace, ValueType } from "./opentelemetry/api.js";
import { logs } from "./opentelemetry/api-logs.js";
import { SEMATTRS_HTTP_METHOD } from "./opentelemetry/semantic-conventions.js";

import { DenoTelemetrySdk } from './sdk.ts'
import { httpTracer } from "./instrumentation/http-server.ts";

new DenoTelemetrySdk({
  resourceAttrs: {
    'service.name': 'observability-demo',
    'deployment.environment': 'local',
    'service.version': 'adhoc',
  },
});

// You could 'get' these APIs from the sdk instance fields,
// but it's better to decouple your application logic from your loading of the SDK

const logger = logs.getLogger('demo.ts');
logger.emit({
  body: 'im alive',
});

const myMeter = metrics.getMeter('my-service-meter');
const test3 = myMeter.createCounter('test3', { valueType: ValueType.INT });
const test2 = myMeter.createHistogram('test2', { valueType: ValueType.DOUBLE });

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log(req.method, url.pathname);

  test3.add(1, {[SEMATTRS_HTTP_METHOD]: req.method});
  test2.record(50+Math.round(Math.random()*25), {[SEMATTRS_HTTP_METHOD]: req.method});

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

Deno.serve(httpTracer(handler));
