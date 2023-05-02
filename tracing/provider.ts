import {
  BasicTracerProvider,
  BatchSpanProcessor,
  type BufferConfig,
  SpanExporter,
  type TracerConfig,
} from "../opentelemetry/sdk-trace-base.js";
import { InstrumentationOption, registerInstrumentations } from "../opentelemetry/instrumentation.js";
import { TextMapPropagator } from '../api.ts';
import { DenoAsyncHooksContextManager } from "./context-manager.ts";

export class DenoTracerProvider extends BasicTracerProvider {

  constructor(config?: TracerConfig & {
    instrumentations?: InstrumentationOption[];
    propagator?: TextMapPropagator<unknown>;
    batchSpanProcessors?: SpanExporter[];
  }) {
    super(config);

    const ctxMgr = new DenoAsyncHooksContextManager();
    ctxMgr.enable();
    this.register({
      contextManager: ctxMgr,
      propagator: config?.propagator,
    });

    if (config?.instrumentations) {
      registerInstrumentations({
        instrumentations: config.instrumentations,
      });
    }

    for (const processor of config?.batchSpanProcessors ?? []) {
      this.addBatchSpanProcessor(processor);
    }
  }

  addBatchSpanProcessor(exporter: SpanExporter, config?: BufferConfig) {
    this.addSpanProcessor(new BatchSpanProcessor(exporter, config));
  }
}
