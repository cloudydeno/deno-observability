export { trace, context, type Context } from './api.ts';
// export { Resource } from "npm:@opentelemetry/resources";
export { Resource } from "https://esm.sh/@opentelemetry/resources@1.9.1";
export { DenoTracerProvider } from './tracer-provider.ts';

export { httpTracer } from './instrumentation/http-server.ts';
export { SubProcessInstrumentation } from './instrumentation/subprocess.ts'
export { DenoFetchInstrumentation } from './instrumentation/fetch.ts'

export { OTLPTraceFetchExporter } from './exporters/oltp-fetch.ts';


import { context, type Context } from './api.ts';
export async function* asyncGeneratorWithContext<T, TReturn, TNext>(
  operationContext: Context,
  operation: () => AsyncGenerator<T, TReturn, TNext>,
): AsyncGenerator<T, TReturn, TNext> {
  const generator = context.with(operationContext, operation)
  const next = context.bind(operationContext, generator.next.bind(generator))

  let result: IteratorResult<T, TReturn> = await next()

  while (!result.done) {
    const nextParam = yield result.value
    result = await next(nextParam)
  }

  return result.value
}
