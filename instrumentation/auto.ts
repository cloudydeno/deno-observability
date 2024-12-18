import { InstrumentationBase } from "../opentelemetry/instrumentation.js";

import { DenoCommandInstrumentation } from "./deno-command.ts";
import { DenoKvInstrumentation } from "./deno-kv.ts";
import { DenoRuntimeInstrumentation } from "./deno-runtime.ts";
import { FetchInstrumentation } from "./fetch.ts";

export function getDenoAutoInstrumentations() {
  const instrs: InstrumentationBase[] = [
    new FetchInstrumentation(),
  ];

  // Rough check to exclude Deno Deploy, which doesn't have subprocesses etc.
  if (Deno.version?.deno) {
    instrs.push(new DenoCommandInstrumentation());
    instrs.push(new DenoRuntimeInstrumentation());
  }

  if ('Kv' in Deno) {
    instrs.push(new DenoKvInstrumentation());
  }

  return instrs;
}
