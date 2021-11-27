import { assertEquals, assertArrayIncludes, assertMatch } from "https://deno.land/std@0.105.0/testing/asserts.ts";

import { runMetricsServer, MetricsRegistry } from './server.ts';
import { scrapeDenoMetrics } from '../../sources/deno.ts';

function setupMetricServer(sources: Array<'deno' | 'denohttp'> = ['deno', 'denohttp']) {
  const registry = new MetricsRegistry();
  if (sources.includes('deno')) registry.sources.push({
    scrapeMetrics: scrapeDenoMetrics,
  });

  const server = runMetricsServer({ port: 0, hostname: 'localhost', registry });
  if (sources.includes('denohttp')) registry.sources.push(server);

  const {port} = server.listener.addr as Deno.NetAddr;
  const url = `http://localhost:${port}`;
  return {registry, server, url};
}

Deno.test("basics", async () => {
  const {server, url} = setupMetricServer();

  const resp = await fetch(`${url}/metrics`);
  assertEquals(resp.status, 200);
  const text = await resp.text();
  assertMatch(text, /^deno_ops_completed_total{op_type="sync",deno_op="metrics"} \d+($| )/m);
  assertArrayIncludes(text.split('\n'), [
    '# TYPE deno_memory_rss_bytes gauge',
    '# UNIT deno_memory_rss_bytes bytes',
    'deno_open_resources{res_type="stdin"} 1',
    'deno_open_resources{res_type="tcpListener"} 1',
    'denohttp_requests_in_flight 1',
    '# EOF',
  ]);

  server.close();
});

Deno.test("datadog compatibility", async () => {
  const {server, url} = setupMetricServer();

  const resp = await fetch(`${url}/metrics`, {
    headers: {
      'User-Agent': 'Datadog Agent/0.0.0',
    }});
    assertEquals(resp.status, 200);
    const text = await resp.text();
    assertMatch(text, /^deno_ops_completed_total{op_type="sync",deno_op="metrics"} \d+($| )/m);
    assertArrayIncludes(text.split('\n'), [
      '# TYPE deno_memory_rss_bytes gauge',
  ]);

  server.close();
});

Deno.test("browser compatibility", async () => {
  const {server, url} = setupMetricServer(['deno']);

  const resp = await fetch(`${url}/metrics`, {
    headers: {
      'User-Agent': "Mozilla/5.0 (X11; CrOS x86_64 13505.73.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.109 Safari/537.36",
    }});
  assertEquals(resp.status, 200);
  assertEquals(resp.headers.get('content-type'), 'text/plain');
  const text = await resp.text();
  assertMatch(text, /^deno_ops_completed_total{op_type="sync",deno_op="metrics"} \d+($| )/m);
  assertArrayIncludes(text.split('\n'), [
    '# TYPE deno_memory_rss_bytes gauge', // openmetrics, not prometheus
    '# EOF',
  ]);

  server.close();
});

Deno.test("no root route", async () => {
  const {server, url} = setupMetricServer([]);

  const resp = await fetch(`${url}/not-found`);
  assertEquals(resp.status, 404);
  await resp.text();

  server.close();
});
