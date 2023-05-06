// This whole file has type issues and needs revising.
// @ts-nocheck

import { Span, SpanKind } from "../opentelemetry/api.js";
import {
  isWrapped,
  InstrumentationBase,
  type InstrumentationConfig,
} from "../opentelemetry/instrumentation.js";

const listSpans = new WeakMap<Deno.KvListIterator<unknown>, {span: Span, docCount: number}>();

export class DenoKvInstrumentation extends InstrumentationBase {
  readonly component: string = 'deno-kv';
  moduleName = this.component;

  constructor(config?: InstrumentationConfig) {
    super('deno-kv', '0.1.0', config);
  }

  init(): void {}

  private _patchGet(): (original: typeof Deno.Kv.prototype.get) => typeof Deno.Kv.prototype.get {
    return original => {
      const plugin = this;
      return async function patchGet(
        this: Deno.Kv,
        key: Deno.KvKey,
        opts?: {},
      ): Promise<Deno.KvEntryMaybe<unknown>> {

        const span = plugin.tracer.startSpan(`KV get`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'db.system': 'deno-kv',
            'db.operation': 'get',
            'deno.kv.key': key,
            'deno.kv.consistency_level': opts?.consistency ?? 'strong',
          },
        });

        try {
          const result = await original.call(this, key, opts);
          span.setAttributes({
            // 'deno.kv.exists': result.value !== 'null',
            'deno.kv.versionstamp': result.versionstamp,
          });
          span.end();
          return result;
        } catch (err) {
          span.recordException(err);
          span.end();
          throw err;
        }
      };
    };
  }

  private _patchGetMany(): (original: typeof Deno.Kv.prototype.getMany) => typeof Deno.Kv.prototype.getMany {
    return original => {
      const plugin = this;
      return async function patchGetMany(
        this: Deno.Kv,
        keys: Deno.KvKey[],
        opts?: {
          consistency?: Deno.KvConsistencyLevel;
        },
      ): Promise<readonly Deno.KvEntryMaybe<unknown>[]> {

        const span = plugin.tracer.startSpan(`KV getMany`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'db.system': 'deno-kv',
            'db.operation': 'getMany',
            'deno.kv.keys': keys,
            'deno.kv.consistency_level': opts?.consistency ?? 'strong',
          },
        });

        try {
          const result = await original.call(this, keys, opts);
          span.setAttributes({
            // 'deno.kv.exists': result.value !== 'null',
            'deno.kv.versionstamps': result.map(x => x.versionstamp),
          });
          span.end();
          return result;
        } catch (err) {
          span.recordException(err);
          span.end();
          throw err;
        }
      };
    };
  }

  private _patchList(): (original: typeof Deno.Kv.prototype.list) => typeof Deno.Kv.prototype.list {
    return original => {
      const plugin = this;
      return function patchList(
        this: Deno.Kv,
        selector: Deno.KvListSelector,
        opts?: Deno.KvListOptions,
      ): Deno.KvListIterator<unknown> {

        const span = plugin.tracer.startSpan(`KV list`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'db.system': 'deno-kv',
            'db.operation': 'list',
            'deno.kv.consistency_level': opts?.consistency ?? 'strong',
          },
        });
        for (const [k, v] of Object.entries(selector)) {
          span.setAttribute(`deno.kv.selector.${k}`, v);
        }
        for (const [k, v] of Object.entries(opts ?? {})) {
          if (k == 'consistency') continue;
          span.setAttribute(`deno.kv.list.${k}`, v);
        }

        try {
          const result = original.call(this, selector, opts);
          listSpans.set(result, {span, docCount: 0});
          return result;
        } catch (err) {
          span.recordException(err);
          span.end();
          throw err;
        }
      };
    };
  }

  private _patchSet(): (original: typeof Deno.Kv.prototype.set) => typeof Deno.Kv.prototype.set {
    return original => {
      const plugin = this;
      return async function patchGet(
        this: Deno.Kv,
        key: Deno.KvKey,
        value: unknown,
      ): Promise<Deno.KvCommitResult> {

        const span = plugin.tracer.startSpan(`KV set`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'db.system': 'deno-kv',
            'db.operation': 'set',
            'deno.kv.key': key,
          },
        });

        try {
          const result = await original.call(this, key, value);
          span.setAttributes({
            'deno.kv.versionstamp': result.versionstamp,
          });
          span.end();
          return result;
        } catch (err) {
          span.recordException(err);
          span.end();
          throw err;
        }
      };
    };
  }

  private _patchDelete(): (original: typeof Deno.Kv.prototype.delete) => typeof Deno.Kv.prototype.delete {
    return original => {
      const plugin = this;
      return async function patchGet(
        this: Deno.Kv,
        key: Deno.KvKey,
      ): Promise<void> {

        const span = plugin.tracer.startSpan(`KV delete`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'db.system': 'deno-kv',
            'db.operation': 'delete',
            'deno.kv.key': key,
          },
        });

        try {
          const result = await original.call(this, key);
          span.end();
          return result;
        } catch (err) {
          span.recordException(err);
          span.end();
          throw err;
        }
      };
    };
  }

  private _patchAtomicCommit(): (original: typeof Deno.AtomicOperation.prototype.commit) => typeof Deno.AtomicOperation.prototype.commit{
    return original => {
      const plugin = this;
      return function patchCommit(
        this: Deno.AtomicOperation,
      ): Promise<Deno.KvCommitResult | Deno.KvCommitError> {

        const span = plugin.tracer.startSpan(`KV commit`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'db.system': 'deno-kv',
            'db.operation': 'commit',
            // 'deno.kv.keys': key,
          },
        });

        try {
          const result = original.call(this);
          span.end();
          return result;
        } catch (err) {
          span.recordException(err);
          span.end();
          throw err;
        }

      };
    };
  }

  private _patchListNext(): (original: typeof Deno.KvListIterator.prototype.next) => typeof Deno.KvListIterator.prototype.next{
    return original => {
      return async function patchListNext(
        this: Deno.KvListIterator<unknown>,
      ): Promise<IteratorResult<Deno.KvEntry<unknown>, undefined>> {

        const ref = listSpans.get(this);
        try {
          const result = await original.call(this);
          if (ref) {
            if (result.done) {
              ref.span.setAttributes({
                'deno.kv.returned_keys': ref.docCount as number,
              });
              ref.span.end();
              listSpans.delete(this);
            } else {
              if (ref.docCount == 0) {
                ref.span.addEvent('first-result');
              }
              ref.docCount++;
            }
          }
          return result;
        } catch (err) {
          ref?.span.recordException(err);
          ref?.span.end();
          listSpans.delete(this);
          throw err;
        }
      };
    };
  }

  /**
   * implements enable function
   */
  override async enable() {
    const AtomicOperation = await Deno.openKv(':memory:').then(x => x.atomic().constructor);

    if (isWrapped(Deno.Kv.prototype['get'])) {
      this._unwrap(Deno.Kv.prototype, 'get');
      this._diag.debug('removing previous patch for KV.get');
    }
    this._wrap(Deno.Kv.prototype, 'get', this._patchGet());

    if (isWrapped(Deno.Kv.prototype['getMany'])) {
      this._unwrap(Deno.Kv.prototype, 'getMany');
      this._diag.debug('removing previous patch for KV.getMany');
    }
    this._wrap(Deno.Kv.prototype, 'getMany', this._patchGetMany());

    if (isWrapped(Deno.Kv.prototype['list'])) {
      this._unwrap(Deno.Kv.prototype, 'list');
      this._diag.debug('removing previous patch for KV.list');
    }
    this._wrap(Deno.Kv.prototype, 'list', this._patchList());

    if (isWrapped(Deno.Kv.prototype['set'])) {
      this._unwrap(Deno.Kv.prototype, 'set');
      this._diag.debug('removing previous patch for KV.set');
    }
    this._wrap(Deno.Kv.prototype, 'set', this._patchSet());

    if (isWrapped(Deno.Kv.prototype['delete'])) {
      this._unwrap(Deno.Kv.prototype, 'delete');
      this._diag.debug('removing previous patch for KV.delete');
    }
    this._wrap(Deno.Kv.prototype, 'delete', this._patchDelete());

    if (isWrapped(AtomicOperation.prototype['commit'])) {
      this._unwrap(AtomicOperation.prototype, 'commit');
      this._diag.debug('removing previous patch for AtomicOperation.commit');
    }
    this._wrap(AtomicOperation.prototype, 'commit', this._patchAtomicCommit());


    if (isWrapped(Deno.KvListIterator.prototype['next'])) {
      this._unwrap(Deno.KvListIterator.prototype, 'next');
      this._diag.debug('removing previous patch for KvListIterator.next');
    }
    this._wrap(Deno.KvListIterator.prototype, 'next', this._patchListNext())
  }

  /**
   * implements unpatch function
   */
  override async disable() {
    const AtomicOperation = await Deno.openKv(':memory:').then(x => x.atomic().constructor);

    this._unwrap(Deno.Kv.prototype, 'get');
    this._unwrap(Deno.Kv.prototype, 'getMany');
    this._unwrap(Deno.Kv.prototype, 'list');
    this._unwrap(Deno.Kv.prototype, 'set');
    this._unwrap(Deno.Kv.prototype, 'delete');
    this._unwrap(AtomicOperation.prototype, 'commit');
    this._unwrap(Deno.KvListIterator.prototype, 'next');
  }
}
