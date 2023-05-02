import { logs } from "../opentelemetry/api-logs.js";
import { BatchLogRecordProcessor, LoggerProvider, LogRecordExporter } from "../opentelemetry/sdk-logs.js";

import { IResource } from "../opentelemetry/resources.js";

export class DenoLoggingProvider extends LoggerProvider {
  constructor(config?: {
    resource?: IResource,
    batchLogExporters?: LogRecordExporter[];
  }) {
    super(config);

    logs.setGlobalLoggerProvider(this);

    for (const exporter of config?.batchLogExporters ?? []) {
      this.addLogRecordProcessor(new BatchLogRecordProcessor(exporter));
    }
  }
}

// btw, events are event.name and event.domain
