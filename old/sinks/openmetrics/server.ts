// The 'communal' metrics storage
import { MetricsRegistry, DefaultRegistry } from './registry.ts';

// Load some default instrumentation
import '../../sources/deno.ts';
import '../../sources/linux-procfs.ts';
import { serve, ServerRequest } from "../../sources/http-server.ts";
// import { serve, ServerRequest } from "https://deno.land/std@0.105.0/http/server.ts";

export * from './exposition.ts';
export * from './registry.ts';
export * from './types.ts';

export function runMetricsServer(opts: {
  /** The port to listen on */
  port: number | 'random';
  /** A literal IP address or host name that can be resolved to an IP address.
   * If not specified, defaults to `0.0.0.0`. */
  hostname?: string;
  /** A specific metrics registry to serve data from, if not the default. */
  registry?: MetricsRegistry;
}) {

  const server = serve({ ...opts,
    port: opts.port === 'random' ? 0 : opts.port,
    // TODO: tag our server metrics as 'role=metrics' somehow
  });

  // go work the server on its own
  (async function() {
    for await (const req of server) {

      if (req.url === '/metrics' && req.method === 'GET') {
        respondToScrape(req, opts.registry);
        continue;
      }

      req.respond({ status: 404, body: "Not Found\n" });
    }
  }());

  return server;
}

/** Utility function that responds to commonplace http.ServerRequest requests */
export function respondToScrape(req: ServerRequest, registry = DefaultRegistry) {
  const {text, contentType} = registry
    .buildScrapeText(req.headers.get('user-agent'));

  req.respond({
    body: text,
    headers: new Headers({
      'content-type': contentType,
    }),
  });
}
