
import {
  BasicTracerProvider,
  BatchSpanProcessor,
  type BufferConfig,
  SpanExporter,
  type TracerConfig,
  type SDKRegistrationConfig,
} from 'npm:@opentelemetry/sdk-trace-base';
import { InstrumentationOption, registerInstrumentations } from 'npm:@opentelemetry/instrumentation';
import { TextMapPropagator } from 'npm:@opentelemetry/api';

import { AsyncLocalStorageContextManager } from 'npm:@opentelemetry/context-async-hooks';

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
