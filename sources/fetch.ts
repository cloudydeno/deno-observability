import { OpenMetric } from '../sinks/openmetrics/types.ts';
import { DefaultRegistry, MetricsRegistry } from '../sinks/openmetrics/registry.ts';
const originalFetch = globalThis.fetch;

export type FetchFacet = 'host' | 'method' | 'status';
export function makeFetch(
  registry: MetricsRegistry,
  dimensions: FetchFacet[] = ['host', 'method', 'status'],
) {
  const dimSet = new Set(dimensions);

  let inFlight = 0;
  // let totalReqs = 0;
  // let totalTime = 0;
  const respSizing: ResponseSize = {bodyBytes: 0, headerBytes: 0, framingBytes: 0};
  const counters = new Map<string,number>();
  const timers = new Map<string,number>();

  registry.sources.push({ *scrapeMetrics(): Generator<OpenMetric> {

    yield {
      prefix: "fetch_finished_requests",
      type: 'counter',
      help: `Number of HTTP requests that have been sent and responded to in full.`,
      // values: new Map([['_total', totalReqs]])};
      values: counters};

    yield {
      prefix: "fetch_requests_in_flight",
      type: 'gauge',
      help: `Current number of outgoing HTTP requests.`,
      singleValue: inFlight};

    yield {
      prefix: "fetch_request_duration_seconds",
      type: 'summary',
      unit: 'seconds',
      help: `A histogram of the HTTP request durations, including receiving a response.`,
      values: timers};

    // yield {
    //   prefix: "fetch_response_bytes",
    //   type: 'counter',
    //   unit: 'bytes',
    //   help: `Number of bytes transmitted in response to HTTP requests.`,
    //   values: new Map([
    //     ['_total{purpose="body"}', respSizing.bodyBytes],
    //     ['_total{purpose="framing"}', respSizing.framingBytes],
    //     ['_total{purpose="header"}', respSizing.headerBytes],
    //   ])};

  }});

  return async function (
    input: Request | URL | string,
    init?: RequestInit,
  ): Promise<Response> {

    const {hostname} = (input instanceof URL)
      ? input
      : new URL((typeof input === 'string')
        ? input
        : input.url);
    const method = (init?.method ?? (input as Request).method ?? 'GET').toLowerCase();

    inFlight++;
    const d0 = performance.now();

    const promise = originalFetch(input, init);

    // TODO: what does this do to uncaught errors?

    promise
      .then(resp => resp.status.toString(), err => "error")
      .then(code => {

        // console.log(method, hostname, resp.status);
        const facets = new Array<string>();
        if (dimSet.has('host')) facets.push(`hostname=${JSON.stringify(hostname)}`);
        if (dimSet.has('status')) facets.push(`code="${code}"`);
        if (dimSet.has('method')) facets.push(`method=${JSON.stringify(method)}`);
        const facetStr = facets.join(',');
        const counterKey = '_total' + (facetStr ? `{${facetStr}}` : '');

        const d1 = performance.now();
        const totalMillis = d1-d0;

        inFlight--;
        // totalReqs++;
        // totalTime += totalMillis;

        const counter = counters.get(counterKey) ?? 0;
        counters.set(counterKey, counter + 1);

        const timerFacet = `{hostname=${JSON.stringify(hostname)}}`
        const counterA = timers.get('_sum'+timerFacet) ?? 0;
        timers.set('_sum'+timerFacet, counterA + (totalMillis / 1000));
        const counterB = timers.get('_count'+timerFacet) ?? 0;
        timers.set('_count'+timerFacet, counterB + 1);

        timers
      });

    return promise;
  }
}

export const fetch: typeof globalThis.fetch = makeFetch(DefaultRegistry);

export function replaceGlobalFetch() {
  globalThis.fetch = fetch;
}


// TODO:
// Intercept response bodies in order to observe size,
// even if a streaming body is being received

interface ResponseSize {
  framingBytes: number;
  headerBytes: number;
  bodyBytes: number;
}
