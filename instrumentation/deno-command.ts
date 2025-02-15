import { type Span, SpanStatusCode } from "../opentelemetry/api.js";
import type { Attributes } from "../opentelemetry/api.js";
import {
  isWrapped,
  InstrumentationBase,
  type InstrumentationConfig,
} from "../opentelemetry/instrumentation.js";

function wrapChildPromise<T extends Deno.CommandStatus>(span: Span, promise: Promise<T>) {
  return promise.then(status => {
    recordChildExit(span, status);
    return status;
  }, err => {
    recordChildFailed(span, err as Error)
    return Promise.reject(err);
  });
}
function recordChildExit(span: Span, output: Deno.CommandStatus) {
  span.setAttribute('exec.success', output.success);
  span.setAttribute('exec.exit_code', output.code);
  if (output.signal) {
    span.setAttribute('exec.signal', output.signal);
  }
  span.setStatus({
    code: SpanStatusCode.OK,
  });
}
function recordSpawnFailed(span: Span, err: Error) {
  // This is hit when the requested program doesn't exist, for example
  span.recordException(err);
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: 'Failed to launch subprocess',
  });
}
function recordChildFailed(span: Span, err: Error) {
  // I'm not sure what situation hits this.
  span.recordException(err);
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: `Subprocess failed: ${err.message}`,
  });
}

export class DenoCommandInstrumentation extends InstrumentationBase {
  readonly component: string = 'Deno.Command';
  moduleName = this.component;

  constructor(config: InstrumentationConfig = {}) {
    super('Deno.Command', '0.1.0', config);
  }

  init(): void {}

  /**
   * Patches the constructor of Command
   */
  private _patchConstructor(): (original: typeof Deno.Command) => typeof Deno.Command {
    // deno-lint-ignore no-this-alias
    const plugin = this;

    // We need to capture the arguments to the constructor, and also override the methods
    // Let's see if subclassing will get us close enough without causing other issues
    return original => class InstrumentedCommand extends original {
      constructor(program: string | URL, opts: Deno.CommandOptions) {
        super(program, opts);

        this._spanName = `exec: ${program.toString().split('/').at(-1)}`;
        this._attributes = {
          'exec.command': program.toString(),
          'exec.arguments': opts.args?.map(x => x.toString()) ?? [],
          // 'component': plugin.moduleName,
        }
      }
      private readonly _spanName: string; // Maybe we can accept an attributes->string transformer?
      private readonly _attributes: Attributes;
      private _span: Span | null = null;

      override output(): Promise<Deno.CommandOutput> {
        // output() can be called after spawn() - we don't want to double-instrument in that case
        if (this._span) return super.output();

        const span = this._span ??= plugin.tracer.startSpan(this._spanName, this._attributes);
        try {
          return wrapChildPromise(span, super.output())
            .finally(() => span.end());
        } catch (err) {
          // The child failed before making a promise.
          recordSpawnFailed(span, err as Error);
          span.end();
          throw err;
        }
      }
      override outputSync(): Deno.CommandOutput {
        const span = this._span ??= plugin.tracer.startSpan(this._spanName, this._attributes);
        try {
          const output = super.outputSync();
          recordChildExit(span, output);
          span.end();
          return output;
        } catch (err) {
          // The child at some point, likely when spawning, we assume that.
          recordSpawnFailed(span, err as Error);
          span.end();
          throw err;
        }
      }
      override spawn(): Deno.ChildProcess {
        const span = this._span ??= plugin.tracer.startSpan(this._spanName, this._attributes);
        try {
          const process = super.spawn();
          // We replace the promise so that the calling code can catch our pass-thru rejection
          Object.defineProperty(process, 'status', {
            writable: false,
            value: wrapChildPromise(span, process.status)
              .finally(() => span.end()),
          });
          return process;
        } catch (err) {
          // The child failed before making a promise.
          recordSpawnFailed(span, err as Error);
          span.end();
          throw err;
        }
      }
    };
  }

  /**
   * implements enable function
   */
  override enable(): void {
    if (isWrapped(Deno.Command)) {
      this._unwrap(Deno, 'Command');
      this._diag.debug('removing previous patch for constructor');
    }
    this._wrap(Deno, 'Command', this._patchConstructor());
  }

  /**
   * implements unpatch function
   */
  override disable(): void {
    this._unwrap(Deno, 'Command');
  }
}
