import { context, trace } from "../api.ts";

const orig = Deno.run;

const tracer = trace.getTracer('subprocess');

Deno.run = function<T extends Deno.RunOptions = Deno.RunOptions>(opt: T): Deno.Process<T> {

  const span = tracer.startSpan(`${opt.cmd[0]}`, {
    attributes: {
      'exec.argv': opt.cmd.map(x => x.toString()),
    },
  });

  try {
    const proc = orig(opt);
    proc.status().finally(() => span.end());
    return proc;
  } catch (err) {
    span.recordException(err);
    throw err;
  }
}
