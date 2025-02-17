// We "set" the OTLP endpoint if it's not already there.
// This approach is simpler given that opentelemetry-js doesn't seem to
// have a clean way to set the base endpoint progammatically, only per-signal endpoints.
const agentHost = Deno.env.get('DD_AGENT_HOST');
if (!Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT') && agentHost) {
  Deno.env.set('OTEL_EXPORTER_OTLP_ENDPOINT', `http://${agentHost}:4318`);
}

import { DenoTelemetrySdk } from "../sdk.ts";
import { DatadogPropagator } from "../otel-platform/propagators/datadog.ts";

/**
 * An observability SDK intended for programs running in
 * a Kubernetes cluster with a Datadog OpenTelemetry agent available.
 */
export const sdk = new DenoTelemetrySdk({
  resourceAttrs: {
    'service.name': Deno.env.get('DD_SERVICE'),
    'service.version': Deno.env.get('DD_VERSION'),
    'deployment.environment': Deno.env.get('DD_ENV'),
  },
  propagator: new DatadogPropagator(),
  // When running with an agent, we assume an in-cluster situation where requests are cheap
  metricsExportIntervalMillis: 20_000,
});
