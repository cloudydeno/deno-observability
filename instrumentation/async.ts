import {
  type Span,
  SpanKind,
  SpanStatusCode,
  context,
  trace,
} from "../api.ts";

// Richer version of this here:
// https://github.com/danopia/dist-app-meteor/blob/main/imports/lib/tracing.ts

const tracer = trace.getTracer('async_func');

export async function traceAsyncFunc<T>(spanName: string, func: (span: Span) => Promise<T>) {
  const span = tracer.startSpan(spanName, {
    kind: SpanKind.INTERNAL,
  });
  try {
    const spanContext = trace.setSpan(context.active(), span);
    const result = await context.with(spanContext, () => func(span));
    span.end();
    return result;
  } catch (err) {
    span.recordException(err as Error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: err.message,
    });
    span.end();
    throw err;
  }
}
