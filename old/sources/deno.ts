import { OpenMetric } from '../sinks/openmetrics/types.ts';
import { DefaultRegistry } from '../sinks/openmetrics/registry.ts';

const seenResources = new Set<string>();

export function* scrapeDenoMetrics() {
  yield* buildDenoOpsMetrics(Deno.metrics());
  yield* buildDenoResMetrics(Deno.resources());
  yield* buildDenoMemoryMetrics(Deno.memoryUsage());
}

// Always register us in the default registry
DefaultRegistry.sources.push({
  scrapeMetrics: scrapeDenoMetrics,
});

export function* buildDenoOpsMetrics(metrics: Deno.Metrics): Generator<OpenMetric> {
  // Clean op names a little bit
  yield* buildDenoPerOpMetrics(Object
    .entries(metrics.ops)
    .filter(x => x[1])
    .map(([opId, metrics]) => {
      const opName = opId.replace(/^op_/, '').replace(/_a?sync$/, '');
      return [`,deno_op=${JSON.stringify(opName)}`, metrics];
    }));
}

export function* buildDenoPerOpMetrics(ops: Array<[string,Deno.OpMetrics]>): Generator<OpenMetric> {
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
  // send/received fields are still present, but always 0's nowadays
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
