import { registerDenoRuntimeMetrics } from "../instrumentation/deno-runtime.ts";

registerDenoRuntimeMetrics({
  enabledMetrics: [
    'memory_usage',
    'open_resources',
    'ops_dispatched',
    'ops_inflight',
  ],
});
