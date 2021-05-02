export type MetricType =
| "unknown"
| "gauge"
| "counter"
| "stateset"
| "info"
| "histogram"
| "gaugehistogram"
| "summary";

export interface MetricMetadata {
  prefix: string;
  type: MetricType;
  unit?: string;
  help?: string;
  singleValue?: number | string;
  values?: Map<string, number | string>;
}

// 
export type OpenMetric = MetricMetadata & ({
  singleValue: number | string;
  values?: undefined;
} | {
  singleValue?: undefined;
  values: Map<string, number | string>;
});
