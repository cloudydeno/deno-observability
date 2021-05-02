import { OpenMetric } from '../sinks/openmetrics/types.ts';
import { DefaultRegistry } from '../sinks/openmetrics/registry.ts';

const seenResources = new Set<string>();

export function* scrapeDenoMetrics() {
  yield* buildDenoOpsMetrics(Deno.metrics());
  yield* buildDenoResMetrics(Deno.resources());

  // maybe record heap if the API is available
  // since 1.9 always callable, but only typed in unstable
  const {memoryUsage} = Deno as {
    memoryUsage?: () => MemoryUsage;
  };
  if (memoryUsage) {
    yield* buildDenoMemoryMetrics(memoryUsage());
  }
}

// Always register us in the default registry
DefaultRegistry.sources.push({
  scrapeMetrics: scrapeDenoMetrics,
});

export function* buildDenoOpsMetrics(metrics: Deno.Metrics): Generator<OpenMetric> {
  // API which might be exposed if Deno is running w/ --unstable
  // Feel for it instead of actually needing --unstable types to compile
  // https://github.com/denoland/deno/pull/9240/files
  const perOps = (metrics as unknown as {ops?: Record<string,Deno.Metrics>}).ops;
  if (perOps) {
    // Clean op names a little bit
    yield* buildDenoPerOpMetrics(Object
      .entries(perOps)
      .map(([opId, metrics]) => {
        const opName = opId.replace(/^op_/, '').replace(/_a?sync$/, '');
        return [`,deno_op=${JSON.stringify(opName)}`, metrics];
      }));

  } else {
    // If per-op API isn't available then just don't attach a tag
    yield* buildDenoPerOpMetrics([['', metrics]]);
  }
}

export function* buildDenoPerOpMetrics(ops: Array<[string,Deno.Metrics]>): Generator<OpenMetric> {
  yield {
    prefix: 'deno_ops_dispatched',
    type: 'counter',
    values: new Map(ops.flatMap(([opFacet, metrics]): [string, number][] => [
      [`_total{op_type="sync"${opFacet}}`, metrics.opsDispatchedSync],
      [`_total{op_type="async"${opFacet}}`, metrics.opsDispatchedAsync],
      [`_total{op_type="async_unref"}${opFacet}`, metrics.opsDispatchedAsyncUnref],
    ]).filter(x => x[1] > 0))};
  yield {
    prefix: 'deno_ops_completed',
    type: 'counter',
    values: new Map(ops.flatMap(([opFacet, metrics]): [string, number][] => [
      [`_total{op_type="sync"${opFacet}}`, metrics.opsCompletedSync],
      [`_total{op_type="async"${opFacet}}`, metrics.opsCompletedAsync],
      [`_total{op_type="async_unref"${opFacet}}`, metrics.opsCompletedAsyncUnref],
    ]).filter(x => x[1] > 0))};

  yield {
    prefix: 'deno_ops_sent_bytes',
    type: 'counter',
    unit: 'bytes',
    values: new Map(ops.flatMap(([opFacet, metrics]): [string, number][] => [
      [`_total{send_slot="control"${opFacet}}`, metrics.bytesSentControl],
      [`_total{send_slot="data"${opFacet}}`, metrics.bytesSentData],
    ]).filter(x => x[1] > 0))};
  yield {
    prefix: 'deno_ops_received_bytes',
    type: 'counter',
    unit: 'bytes',
    values: new Map(ops.flatMap(([opFacet, metrics]): [string, number][] => [
      [`_total{recv_slot="response"${opFacet}}`, metrics.bytesReceived],
    ]))};
}

export function* buildDenoResMetrics(resources: Deno.ResourceMap): Generator<OpenMetric> {
  // Seed our map with all relevant zeros
  const typeCounts = new Map<string, number>(Array
    .from(seenResources).map(x => [x, 0]));

  for (const rawResource of Object.values(resources) as unknown[]) {
    const resType = typeof rawResource == 'string' ? rawResource : 'unknown';
    const resMetric = `{res_type=${JSON.stringify(resType)}}`;

    let existing = typeCounts.get(resMetric);
    if (existing == null) {
      existing = 0;
      typeCounts.set(resMetric, existing);
      seenResources.add(resMetric);
    }
    typeCounts.set(resMetric, existing + 1);
  }

  yield {
    prefix: 'deno_open_resources',
    type: 'gauge',
    values: typeCounts,
  };
}

export function* buildDenoMemoryMetrics(stats: MemoryUsage): Generator<OpenMetric> {
  yield {
    prefix: `deno_memory_rss_bytes`,
    type: 'gauge',
    unit: 'bytes',
    singleValue: stats.rss,
  };
  yield {
    prefix: `deno_memory_heap_total_bytes`,
    type: 'gauge',
    unit: 'bytes',
    singleValue: stats.heapTotal,
  };
  yield {
    prefix: `deno_memory_heap_used_bytes`,
    type: 'gauge',
    unit: 'bytes',
    singleValue: stats.heapUsed,
  };
  yield {
    prefix: `deno_memory_external_bytes`,
    type: 'gauge',
    unit: 'bytes',
    singleValue: stats.external,
  };
}

interface MemoryUsage {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
}
