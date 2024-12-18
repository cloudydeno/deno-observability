import {
  type Attributes,
  type ObservableGauge,
  type ObservableResult,
  ValueType,
} from "../opentelemetry/api.js";
import {
  InstrumentationBase,
  type InstrumentationConfig,
} from "../opentelemetry/instrumentation.js";

export class DenoRuntimeInstrumentation extends InstrumentationBase {
  readonly component: string = 'deno-runtime';
  moduleName = this.component;

  constructor(config?: InstrumentationConfig) {
    super('deno-runtime', '0.1.0', {enabled: false});
  }

  metrics!: {
    memoryUsage: ObservableGauge<Attributes>;
  };

  protected init() {}

  private gatherMemoryUsage = (x: ObservableResult<Attributes>) => {
    const usage = Deno.memoryUsage();
    x.observe(usage.rss, {"deno.memory.type": "rss"});
    x.observe(usage.heapTotal, {"deno.memory.type": "heap_total"});
    x.observe(usage.heapUsed, {"deno.memory.type": "heap_used"});
    x.observe(usage.external, {"deno.memory.type": "external"});
  }

  enable() {
    this.metrics ??= {
      memoryUsage: this.meter
        .createObservableGauge("deno.memory_usage", {
          valueType: ValueType.INT,
        }),
    };

    this.metrics.memoryUsage.addCallback(this.gatherMemoryUsage);
  }

  disable() {
    this.metrics.memoryUsage.removeCallback(this.gatherMemoryUsage);
  }
}
