import { OpenMetric } from './types.ts';
import {
  buildExposition, bestFormatForAgent,
} from './exposition.ts';

export interface MetricsSource {
  scrapeMetrics(): Generator<OpenMetric>;
}

export class MetricsRegistry implements MetricsSource {
  sources = new Array<MetricsSource>();

  *scrapeMetrics() {
    for (const source of this.sources) {
      yield* source.scrapeMetrics();
    }
  }

  buildScrapeText(userAgent?: string | null) {
    return buildExposition(this.scrapeMetrics(), bestFormatForAgent(userAgent));
  }

}

// TODO: consider how this would work between different module versions
export const DefaultRegistry = new MetricsRegistry();
