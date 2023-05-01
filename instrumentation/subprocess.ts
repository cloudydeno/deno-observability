// import {
//   isWrapped,
//   InstrumentationBase,
//   type InstrumentationConfig,
// } from 'npm:@opentelemetry/instrumentation';

import {
  isWrapped,
  InstrumentationBase,
  type InstrumentationConfig,
} from "../opentelemetry/instrumentation.js";

export class SubProcessInstrumentation extends InstrumentationBase {
  readonly component: string = 'subprocess';
  moduleName = this.component;

  constructor(config?: InstrumentationConfig) {
    super('subprocess', '0.1.0', config);
  }

  init(): void {}

  /**
   * Patches the constructor of fetch
   */
  private _patchConstructor(): (original: typeof Deno.run) => typeof Deno.run {
    return original => {
      const plugin = this;
      return function patchConstructor(
        this: typeof Deno,
        opt: Parameters<typeof Deno.run>[0]
      ): Deno.Process {

        const span = plugin.tracer.startSpan(`${opt.cmd[0]}`, {
          attributes: {
            'exec.argv': opt.cmd.map(x => x.toString()),
            'component': plugin.moduleName,
          },
        });

        try {
          const proc = original(opt);
          proc.status().then(status => {
            span.setAttribute('exec.exit_code', status.code);
            if (status.signal) {
              span.setAttribute('exec.signal', status.signal);
            }
          }).finally(() => {
            span.end();
          });
          return proc;
        } catch (err) {
          span.recordException(err);
          throw err;
        }

      };
    };
  }

  /**
   * implements enable function
   */
  override enable(): void {
    if (isWrapped(Deno.run)) {
      this._unwrap(Deno, 'run');
      this._diag.debug('removing previous patch for constructor');
    }
    this._wrap(Deno, 'run', this._patchConstructor());
  }

  /**
   * implements unpatch function
   */
  override disable(): void {
    this._unwrap(Deno, 'run');
  }
}
