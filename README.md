![Test CI](https://github.com/cloudydeno/deno-observability/workflows/CI/badge.svg?branch=main)

# deno-observability
Metrics exporting for Deno's runtime,
initially targetting OpenMetrics (Prometheus) and the Datadog API

## Project Status

The code in this repository will be in-flux until a v1.0 possibly eventually happens.
Right now I'm trying to reconsile the design differences between pushing & polling,
and figure out one way of instrumenting metrics
that will be able to transmit to different types of metric sinks.

## Prometheus Example

It's standard to run a Prometheus exporter on its own dedicated port
to keep it separate from whatever API you may be hosting.
Or if you aren't hosting an API at all, you may not already have any HTTP server.

Here's an example of that:

```typescript
import { runMetricsServer } from "https://deno.land/x/observability@v0.1.0/sinks/openmetrics/server.ts";

runMetricsServer({ port: 9090 });
console.log("Now serving http://localhost:9090/metrics");
```

You can also run the demo directly, which simulates extra HTTP traffic to make the metrics more full:

`deno run --allow-net https://deno.land/x/observability@v0.1.0/demo.ts`

If you would like to expose metrics on your existing web server,
you'll want to look at `mod.ts` for inspiration instead of importing it as-is.

## Deno Metrics

* `deno_ops_dispatched`: # of operations started, split into 3 categories
* `deno_ops_completed`: # of operations finished, split into 3 categories
* `deno_ops_sent_bytes_total`: # of bytes dispatched with all operations so far
    * There historically was a difference between 'control' and 'data' bytes.
        In recent Deno versions, all bytes are counted as 'data' bytes.
        The 'send_slot' facet is still included as a leftover of that.
* `deno_ops_received_bytes`: # of bytes received in response to an operation so far

* `deno_open_resources`: # of currently registered Deno resources, split by resource type.
    * A process starts up with 3: `stdin`, `stdout`, `stderr`.
    * Starting the metrics server will add 1 `tcpListener`.
    * Your metrics HTTP request seemingly always shows up as an additional `tcpStream`.
    * All other resources are from your application's own code (or libraries in use).

* `deno_memory_rss_bytes`: # of total resident bytes held by the Deno process
* `deno_memory_heap_total_bytes`: allocated size of the Deno heap space
* `deno_memory_heap_used_bytes`: used size of the Deno heap space
* `deno_memory_external_bytes`: Not Yet Implemented in Deno. Currently 0.

NOTE: If Deno is running with `--unstable`,
all the `deno_ops_` metrics will include a `deno_op` facet.

Please note that the `ops_..._bytes` metrics refer to bytes 'transfered' within your process,
between Javascript and the actual Deno runtime.
They are not directly related to bytes transfered over the network or similar metrics.
You'll want to monitor network bytes from a lower level source such as Docker or Kubernetes metrics
if that is an interesting metric to you.

Here's an example of the payload:

```
# TYPE deno_ops_dispatched counter
deno_ops_dispatched_total{op_type="sync"} 179
deno_ops_dispatched_total{op_type="async"} 252
# TYPE deno_ops_completed counter
deno_ops_completed_total{op_type="sync"} 179
deno_ops_completed_total{op_type="async"} 245
# TYPE deno_ops_sent_bytes counter
# UNIT deno_ops_sent_bytes bytes
deno_ops_sent_bytes_total{send_slot="data"} 1214641
# TYPE deno_ops_received_bytes counter
# UNIT deno_ops_received_bytes bytes
deno_ops_received_bytes_total{recv_slot="response"} 23640
# TYPE deno_open_resources gauge
deno_open_resources{res_type="stdin"} 1
deno_open_resources{res_type="stdout"} 1
deno_open_resources{res_type="stderr"} 1
deno_open_resources{res_type="tcpListener"} 1
deno_open_resources{res_type="child"} 30
deno_open_resources{res_type="tcpStream"} 2
# TYPE deno_memory_rss_bytes gauge
# UNIT deno_memory_rss_bytes bytes
deno_memory_rss_bytes 3232380
# TYPE deno_memory_heap_total_bytes gauge
# UNIT deno_memory_heap_total_bytes bytes
deno_memory_heap_total_bytes 3948544
# TYPE deno_memory_heap_used_bytes gauge
# UNIT deno_memory_heap_used_bytes bytes
deno_memory_heap_used_bytes 3690960
# TYPE deno_memory_external_bytes gauge
# UNIT deno_memory_external_bytes bytes
deno_memory_external_bytes 16384
```

## HTTP Server Metrics

* `denohttp_handled_requests`: Number of HTTP requests that have been received and responded to in full.
* `denohttp_requests_in_flight`: Current number of HTTP requests being served.
* `denohttp_request_duration_seconds`: A histogram of the HTTP request durations, including writing a response.
* `denohttp_response_bytes_total`: Number of bytes transmitted in response to HTTP requests. Includes a facet for which aspect of the HTTP response the bytes were a part of.

```
# TYPE denohttp_handled_requests counter
# HELP denohttp_handled_requests Number of HTTP requests that have been received and responded to in full.
denohttp_handled_requests{code="404",method="get"} 1218
denohttp_handled_requests{code="200",method="get"} 6
# TYPE denohttp_requests_in_flight gauge
# HELP denohttp_requests_in_flight Current number of HTTP requests being served.
denohttp_requests_in_flight 1
# TYPE denohttp_request_duration_seconds histogram
# UNIT denohttp_request_duration_seconds seconds
# HELP denohttp_request_duration_seconds A histogram of the HTTP request durations, including writing a response.
denohttp_request_duration_seconds_bucket{le="0.01"} 1219
denohttp_request_duration_seconds_bucket{le="0.1"} 1224
denohttp_request_duration_seconds_bucket{le="1"} 1224
denohttp_request_duration_seconds_bucket{le="+Inf"} 1224
denohttp_request_duration_seconds_sum 0.704
denohttp_request_duration_seconds_count 1224
# TYPE denohttp_response_bytes counter
# UNIT denohttp_response_bytes bytes
# HELP denohttp_response_bytes Number of bytes transmitted in response to HTTP requests.
denohttp_response_bytes_total{purpose="body"} 25247
denohttp_response_bytes_total{purpose="framing"} 31782
denohttp_response_bytes_total{purpose="header"} 24936
```

## TODO

* [x] Serve data from `Deno.metrics()`
* [x] Serve data from `Deno.resources()`
* [ ] Accept custom metrics from the user's code
* [ ] Include 'created' timestamp on counters to aid in monotonic tracking
* [ ] Publish on deno.land
* [ ] Keep track of previous metrics to include zero gauges in future bodies

## License

MIT
