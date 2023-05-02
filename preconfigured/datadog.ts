import { Resource } from "../opentelemetry/resources.js";

import {
  DenoFetchInstrumentation,
  SubProcessInstrumentation,
} from "../mod.ts";
import {
  DatadogPropagator,
} from "../tracing/propagators/datadog.ts";
import { DenoTelemetrySdk } from "../sdk.ts";

/**
 * An observability SDK intended for programs running in
 * a Kubernetes cluster with a Datadog OpenTelemetry agent available.
 */
export const sdk = new DenoTelemetrySdk({
  resource: new Resource({
    'service.name': Deno.env.get('DD_SERVICE'),
    'service.version': Deno.env.get('DD_VERSION'),
    'deployment.environment': Deno.env.get('DD_ENV'),
  }),
  instrumentations: [
    new DenoFetchInstrumentation(),
    new SubProcessInstrumentation(),
  ],
  propagator: new DatadogPropagator(),
  otlpEndpointBase: Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT')
    ?? `http://${Deno.env.get('DD_AGENT_HOST') ?? 'localhost'}:4318`,
});
