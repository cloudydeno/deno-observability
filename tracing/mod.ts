export { trace, context, type Context } from '../api.ts';
// export { Resource } from "npm:@opentelemetry/resources";
export { DenoTracerProvider } from './provider.ts';

import { context, type Context } from '../api.ts';

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
