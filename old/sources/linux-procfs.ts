import { OpenMetric } from '../sinks/openmetrics/types.ts';
import { DefaultRegistry } from '../sinks/openmetrics/registry.ts';

// Check if we can access /proc/self at all
// This can fail for two main reasons:
//   1. --allow-read=/proc/self (or wider) not given
//   2. Not on a Linuxy system (or procfs otherwise not available)
let canScrape = false;
try {
  Deno.readDirSync("/proc/self/fd");
  canScrape = true;
} catch {}

// If we can operate at all, register us in the default registry
if (canScrape) {
  DefaultRegistry.sources.push({
    scrapeMetrics: collectLinuxMetrics,
  });
}


export function* collectLinuxMetrics(): Generator<OpenMetric> {

  try {
    const fds = Deno.readDirSync("/proc/self/fd");
    let count = -1; // disregard our own fd from reading the dir
    for (const _ of fds) {
      count++;
    }

    yield {
      prefix: 'process_open_fds',
      type: 'gauge',
      help: 'Number of open file descriptors.',
      singleValue: count};

  } catch {}

  try {
    const limits = Deno.readTextFileSync('/proc/self/limits');
    const lines = limits.split('\n');
    let maxFds = -1;
    for (const line of lines) {
      if (line.startsWith('Max open files')) {
        const parts = line.split(/  +/);
        maxFds = parseInt(parts[1]);
        break;
      }
    }

    if (maxFds >= 0) yield {
      prefix: 'process_max_fds',
      type: 'gauge',
      help: 'Maximum number of open file descriptors.',
      singleValue: maxFds};

  } catch {}

}
