import { Context, ContextManager, ROOT_CONTEXT } from "../api.ts";

interface HookCallbacks {
  init: (promise: Promise<unknown>) => void
  before: (promise: Promise<unknown>) => void
  after: (promise: Promise<unknown>) => void
  resolve: (promise: Promise<unknown>) => void
}

const enabledCallbacks = new Set<HookCallbacks>();

let hasBeenSet = false;
function maybeSetHooks() {
  if (hasBeenSet) return;
  hasBeenSet = true;

  //@ts-expect-error Unstable?
  Deno[Deno.internal].core.setPromiseHooks(
    (promise: Promise<unknown>) => {
      for (const { init } of enabledCallbacks) {
        init(promise);
      }
    },
    (promise: Promise<unknown>) => {
      for (const { before } of enabledCallbacks) {
        before(promise);
      }
    },
    (promise: Promise<unknown>) => {
      for (const { after } of enabledCallbacks) {
        after(promise);
      }
    },
    (promise: Promise<unknown>) => {
      for (const { resolve } of enabledCallbacks) {
        resolve(promise);
      }
    },
  );
}

// Lots of this is copied from opentelemetry
// because AbstractAsyncHooksContextManager isn't exported

abstract class AbstractAsyncHooksContextManager
  implements ContextManager
{
  abstract active(): Context;

  abstract with<A extends unknown[], F extends (...args: A) => ReturnType<F>>(
    context: Context,
    fn: F,
    thisArg?: ThisParameterType<F>,
    ...args: A
  ): ReturnType<F>;

  abstract enable(): this;

  abstract disable(): this;

  /**
   * Binds a the certain context or the active one to the target function and then returns the target
   * @param context A context (span) to be bind to target
   * @param target a function or event emitter. When target or one of its callbacks is called,
   *  the provided context will be used as the active context for the duration of the call.
   */
  bind<T>(context: Context, target: T): T {
    if (typeof target === 'function') {
      return this._bindFunction(context, target);
    }
    return target;
  }

  private _bindFunction<T extends Function>(context: Context, target: T): T {
    const manager = this;
    const contextWrapper = function (this: never, ...args: unknown[]) {
      return manager.with(context, () => target.apply(this, args));
    };
    Object.defineProperty(contextWrapper, 'length', {
      enumerable: false,
      configurable: true,
      writable: false,
      value: target.length,
    });
    /**
     * It isn't possible to tell Typescript that contextWrapper is the same as T
     * so we forced to cast as any here.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return contextWrapper as any;
  }
}

const originalSetTimeout = setTimeout;
const originalSetInterval = setInterval;
const originalQueueMicrotask = queueMicrotask;

export class DenoAsyncHooksContextManager extends AbstractAsyncHooksContextManager {
  private _contexts: Map<Promise<unknown>, Context> = new Map();
  private _stack: Array<Context | undefined> = [];
  private _callbacks: HookCallbacks = {
    init: (promise) => {
      const context = this._stack[this._stack.length - 1];
      if (context !== undefined) {
        this._contexts.set(promise, context);
      }
    },
    before: (promise) => {
      const context = this._contexts.get(promise);
      if (context !== undefined) {
        this._enterContext(context);
      }
    },
    after: () => {
      this._exitContext();
    },
    resolve: (promise) => {
      this._contexts.delete(promise);
    }
  }

  active(): Context {
    return this._stack[this._stack.length - 1] ?? ROOT_CONTEXT;
  }

  with<A extends unknown[], F extends (...args: A) => ReturnType<F>>(
    context: Context,
    fn: F,
    thisArg?: ThisParameterType<F>,
    ...args: A
  ): ReturnType<F> {
    this._enterContext(context);
    try {
      return fn.call(thisArg!, ...args);
    } finally {
      this._exitContext();
    }
  }

  enable(): this {
    maybeSetHooks();
    enabledCallbacks.add(this._callbacks);

    globalThis.setTimeout = (cb, delay) => originalSetTimeout(this.bind(this.active(), cb), delay);
    globalThis.setInterval = (cb, delay) => originalSetInterval(this.bind(this.active(), cb), delay);
    globalThis.queueMicrotask = (cb) => originalQueueMicrotask(this.bind(this.active(), cb));
    return this;
  }

  disable(): this {
    enabledCallbacks.delete(this._callbacks);
    this._contexts.clear();
    this._stack = [];

    globalThis.setTimeout = originalSetTimeout;
    globalThis.setInterval = originalSetInterval;
    globalThis.queueMicrotask = originalQueueMicrotask;
    return this;
  }

  private _enterContext(context: Context) {
    this._stack.push(context);
  }

  private _exitContext() {
    this._stack.pop();
  }
}
