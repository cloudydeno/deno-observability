import { runMetricsServer } from './sinks/openmetrics/server.ts';
import { fetch } from './sources/fetch.ts';

// Start a web server for metrics
runMetricsServer({ port: 9090 });
console.log('Now serving http://localhost:9090/metrics');

// Hit ourselves to simulate continuous traffic over time
setInterval(() => {
  fetch('http://localhost:9090').then(x => x.text());
}, 2500);

// Make a dummy bad request
fetch('http://asdfffffff.com').catch(err => {});
