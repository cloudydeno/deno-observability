#!/usr/bin/env -S deno run --watch --allow-read --allow-sys=hostname,osRelease --allow-env --allow-net --allow-run=uptime,sleep,ping,nonextant
import { metrics, trace, ValueType } from "./opentelemetry/api.js";
import { logs } from "./opentelemetry/api-logs.js";
import { ATTR_HTTP_METHOD } from "./opentelemetry/semantic-conventions.js";

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

  test3.add(1, {[ATTR_HTTP_METHOD]: req.method});
  test2.record(50+Math.round(Math.random()*25), {[ATTR_HTTP_METHOD]: req.method});

  if (url.pathname == '/log') {
    logger.emit({
      body: 'hello world',
    });
    return new Response('logged hello world');
  }

  if (url.pathname == '/inner') {
    await getData();
    return new Response(JSON.stringify({
      headers: Object.fromEntries(req.headers),
      remote: await getData(),
    }, null, 2));
  }

  if (url.pathname == '/uptime') {
    const text = await new Promise<string>(ok => setTimeout(async () => {
      const proc = await new Deno.Command('uptime', {
        stdin: 'null',
        stdout: 'piped',
        stderr: 'inherit',
      }).output();
      const text = new TextDecoder().decode(proc.stdout);
      ok(text);
    }, 50));
    return new Response(text);
  }

  if (url.pathname == '/failure') {
    try {
      await new Deno.Command('nonextant', {
        stdin: 'null',
        stdout: 'piped',
        stderr: 'inherit',
      }).output();
      return new Response('No failure happened??');
    } catch (thrown: unknown) {
      const err = thrown as Error;
      return new Response(`Failed as expected.\n${err.message}`);
    }
  }

  if (url.pathname == '/sleep') {

    // First, we spawn and gather the output as two chained steps.
    await new Deno.Command('sleep', {
      args: ['1'],
      stdin: 'null',
    }).spawn().output();

    // Second, we spawn and gather the output as two different steps on the Command.
    {
      const sleepCmd = new Deno.Command('sleep', {
        args: ['1'],
        stdin: 'null',
      });
      sleepCmd.spawn();
      await sleepCmd.output();
    }

    // Third, we run command in parallel, using the single-shot output() API.
    await Promise.all([1,2,3,4,5].map(x =>
      new Deno.Command('sleep', {
        args: [`${x}`],
        stdin: 'null',
      }).output()));

    // Fourth, we run the command with the synchronous single-shot API.
    // This is not ideal in a server but we need to make sure our instrument works regardless.
    new Deno.Command('sleep', {
      args: ['1'],
      stdin: 'null',
    }).outputSync();

    return new Response('done sleeping');
  }

  if (url.pathname == '/ping') {
    const proc = new Deno.Command('ping', {
      args: ['-c5', 'google.com'],
      stdin: 'null',
      stdout: 'piped',
      stderr: 'inherit',
    }).spawn();
    return new Response(proc.stdout);
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
