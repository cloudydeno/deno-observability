import { InstrumentationBase } from "../opentelemetry/instrumentation.js";

import { DenoRuntimeInstrumentation } from "./deno-runtime.ts";
import { FetchInstrumentation } from "./fetch.ts";
import { SubProcessInstrumentation } from "./subprocess.ts";

export function getDenoAutoInstrumentations() {
  const instrs: InstrumentationBase[] = [
    new FetchInstrumentation(),
  ];

  // Rough check to exclude Deno Deploy, which doesn't have subprocesses etc.
  if (Deno.version?.deno) {
    instrs.push(new SubProcessInstrumentation());
    instrs.push(new DenoRuntimeInstrumentation());
  }

  return instrs;
}
