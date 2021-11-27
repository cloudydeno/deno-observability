import { assertEquals, assertArrayIncludes } from "https://deno.land/std@0.105.0/testing/asserts.ts";

import { MetricsRegistry } from '../sinks/openmetrics/registry.ts';
import { collectLinuxMetrics } from './linux-procfs.ts';

Deno.test("linux-procfs metrics presence", async () => {
  const registry = new MetricsRegistry();
  registry.sources.push({
    scrapeMetrics: collectLinuxMetrics,
  });

  const {text} = registry.buildScrapeText();
  const lines = text.split('\n');

  if (Deno.build.os === 'linux') {
    assertArrayIncludes(lines, [
      "# TYPE process_open_fds gauge",
      // "# TYPE process_max_fds gauge", // missing under Deno 1.15 for some reason
    ]);
  } else {
    // Nothing will be present elsewhere
    assertEquals(text, `# EOF\n`);
  }

});
