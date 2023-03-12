
import {
  BasicTracerProvider,
  BatchSpanProcessor,
  BufferConfig,
  SpanExporter,
  type SDKRegistrationConfig,
} from 'npm:@opentelemetry/sdk-trace-base';

import { AsyncLocalStorageContextManager } from 'npm:@opentelemetry/context-async-hooks';

export { registerInstrumentations } from 'npm:@opentelemetry/instrumentation';

export class DenoTracerProvider extends BasicTracerProvider {

  register(config?: SDKRegistrationConfig) {
    super.register({
      contextManager: new AsyncLocalStorageContextManager(),
      ...config,
    });
  }

  addBatchSpanProcessor(exporter: SpanExporter, config?: BufferConfig) {
    this.addSpanProcessor(new BatchSpanProcessor(exporter, config));
  }

}
