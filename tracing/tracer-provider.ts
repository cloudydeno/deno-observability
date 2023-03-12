
// import {
//   BasicTracerProvider,
//   BatchSpanProcessor,
//   type BufferConfig,
//   SpanExporter,
//   type TracerConfig,
//   type SDKRegistrationConfig,
// } from 'npm:@opentelemetry/sdk-trace-base';
// import { InstrumentationOption, registerInstrumentations } from 'npm:@opentelemetry/instrumentation';
// import { TextMapPropagator } from 'npm:@opentelemetry/api';
// import { AsyncLocalStorageContextManager } from 'npm:@opentelemetry/context-async-hooks';

import {
  BasicTracerProvider,
  BatchSpanProcessor,
  type BufferConfig,
  SpanExporter,
  type TracerConfig,
  type SDKRegistrationConfig,
} from "https://esm.sh/@opentelemetry/sdk-trace-base@1.9.1";
import { InstrumentationOption, registerInstrumentations } from "https://esm.sh/@opentelemetry/instrumentation@0.35.1";
import { TextMapPropagator } from './api.ts';
import { AsyncLocalStorageContextManager } from "https://esm.sh/@opentelemetry/context-async-hooks@1.9.1";

export class DenoTracerProvider extends BasicTracerProvider {

  constructor(config?: TracerConfig & {
    instrumentations?: InstrumentationOption[];
    propagator?: TextMapPropagator<unknown>;
    batchSpanProcessors?: SpanExporter[];
  }) {
    super(config);

    this.register({
      contextManager: new AsyncLocalStorageContextManager(),
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
