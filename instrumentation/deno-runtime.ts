import { metrics, ValueType } from "../api.ts";

const meter = metrics.getMeter("deno.runtime");

export function registerDenoRuntimeMetrics(options?: {
  enabledMetrics?: Array<
  | "open_resources"
  | "memory_usage"
  | "ops_dispatched"
  | "ops_completed"
  | "ops_inflight"
  >;
}) {
  if (options?.enabledMetrics) {
    if (options.enabledMetrics.includes("open_resources")) {
      denoOpenResources();
    }
    if (options.enabledMetrics.includes("memory_usage")) {
      denoMemoryUsage();
    }
    if (options.enabledMetrics.some(x => x.startsWith("ops_"))) {
      denoOpMetrics({
        reportDispatched: options.enabledMetrics.includes("ops_dispatched"),
        reportCompleted: options.enabledMetrics.includes("ops_completed"),
        reportInflight: options.enabledMetrics.includes("ops_inflight"),
      });
    }
  } else {
    denoOpenResources();
    denoMemoryUsage();
    denoOpMetrics({
      reportDispatched: true,
      reportCompleted: false,
      reportInflight: true,
    });
  }
}

function denoOpenResources() {
  meter
    .createObservableUpDownCounter("deno.open_resources", {valueType: ValueType.INT})
    .addCallback(x => {
      for (const entry of Object
        .values(Deno.resources())
        .reduce<Map<string,number>>((acc,x) => (acc.set(x, 1 + (acc.get(x) ?? 0)), acc), new Map())
      ) {
        x.observe(entry[1], { 'deno.resource.type': entry[0] });
      }
    });
}

function denoMemoryUsage() {
  meter.createObservableGauge("deno.memory_usage", {valueType: ValueType.INT})
    .addCallback(x => {
      const usage = Deno.memoryUsage();
      x.observe(usage.rss, {"deno.memory.type": "rss"});
      x.observe(usage.heapTotal, {"deno.memory.type": "heap_total"});
      x.observe(usage.heapUsed, {"deno.memory.type": "heap_used"});
      x.observe(usage.external, {"deno.memory.type": "external"});
    });
}

function denoOpMetrics(options: {
  reportDispatched: boolean;
  reportCompleted: boolean;
  reportInflight: boolean;
}) {
  const dispatchedCtr = meter.createObservableCounter("deno.ops_dispatched", {valueType: ValueType.INT});
  const completedCtr = meter.createObservableCounter("deno.ops_completed", {valueType: ValueType.INT});
  const inflightCtr = meter.createObservableUpDownCounter("deno.ops_inflight", {valueType: ValueType.INT});
  meter.addBatchObservableCallback(x => {
    for (const [op, data] of Object.entries(Deno.metrics().ops)) {
      if (data.opsDispatched == 0) continue;
      if (options.reportDispatched) x.observe(dispatchedCtr, data.opsDispatched, { "deno.op": op });
      if (options.reportCompleted) x.observe(completedCtr, data.opsCompleted, { "deno.op": op });
      if (options.reportInflight) x.observe(inflightCtr, data.opsDispatched - data.opsCompleted, { "deno.op": op });
    }
  }, [dispatchedCtr, completedCtr, inflightCtr]);

}
