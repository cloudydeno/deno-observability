import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
} from "../opentelemetry/api.js";
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

import {
  DenoFetchInstrumentation,
  DenoTracerProvider,
  OTLPTraceFetchExporter,
  Resource,
} from "../mod.ts";
import {
  DatadogPropagator,
} from "../tracing/propagators/datadog.ts";
import {
  DenoMetricsProvider,
  OTLPMetricExporter,
} from "../metrics/provider.ts";

const resource = new Resource({
  'service.name': Deno.env.get('DD_SERVICE'),
  'service.version': Deno.env.get('DD_VERSION'),
  'deployment.environment': Deno.env.get('DD_ENV'),
});

const otlpEndpoint = Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT')
    || `http://${Deno.env.get('DD_AGENT_HOST') ?? 'localhost'}:4318`;

new DenoMetricsProvider({
  resource,
  metricExporter: new OTLPMetricExporter({
    url: new URL('v1/metrics', otlpEndpoint).toString()
  }),
});

new DenoTracerProvider({
  resource,
  propagator: new DatadogPropagator(),
  instrumentations: [
    new DenoFetchInstrumentation(),
  ],
  batchSpanProcessors: [
    new OTLPTraceFetchExporter({
      url: new URL('v1/traces', otlpEndpoint).toString(),
    }),
  ],
});
