export type Tags = Record<string, string>;

function listifyTags(obj: Tags = {}) {
  return Object.keys(obj)
    .filter(key => obj[key] !== null)
    .map(key => `${key}:${obj[key]}`);
}

class PointArray extends Array {
  constructor(
    public metric: string,
    public tagList: string[],
  ) {
    super();
  }
}

export class Datadog {
  globalTags: string[];
  apiRoot: string;
  gauges: Map<string,PointArray>;
  rates: Map<string,PointArray>;
  counts: Map<string,PointArray>;
  flushPeriod: number;
  flushTimer: number | null = null;

  constructor(
    public apiKey: string | false,
    public hostName: string,
    globalTags: Tags,
  ) {
    this.globalTags = listifyTags(globalTags);

    this.apiRoot = 'https://api.datadoghq.com/api';
    this.flushPeriod = 20; // seconds
    this.gauges = new Map();
    this.rates = new Map;
    this.counts = new Map;

    if (this.apiKey) {
      this.flushTimer = setInterval(this.flushNow.bind(this),
        this.flushPeriod * 1000);
      // TODO: Deno lacks unref
      // if (this.flushTimer.unref) {
      //   this.flushTimer.unref();
      //   // TODO: trigger final flush at shutdown
      // }
    } else {
      console.debug('WARN: DD_API_KEY not set, no metrics will be reported.');
    }
  }

  appendPoint(mapName: 'gauges' | 'rates' | 'counts', metric: string, value: number, tags?: Tags) {
    if (!this.apiKey) return;
    const tagList = listifyTags(tags).sort();
    const key = JSON.stringify([metric, tagList]);

    const map = this[mapName];
    const list = map.get(key);
    if (list) {
      list.push(value);
    } else {
      const list = new PointArray(metric, tagList);
      map.set(key, list);
      list.push(value);
    }
  }

  doHTTP(apiPath: string, payload: unknown) {
    if (!this.apiKey) return Promise.resolve(false);
    return fetch(`${this.apiRoot}${apiPath}?api_key=${this.apiKey}`, {
      method: 'POST',
      mode: 'no-cors', // we won't get any info about how the request went
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(err => {
      // TODO: cache and retry the request
      // don't we only get this in nodejs? because no-cors
      console.log('Datadog request failed:', err.message);
      return err;
    });
  }

  gauge(metric: string, value: number, tags?: Tags) {
    this.appendPoint('gauges', metric, value, tags);
  }
  rate(metric: string, value: number, tags?: Tags) {
    this.appendPoint('rates', metric, value, tags);
  }
  count(metric: string, value: number, tags?: Tags) {
    this.appendPoint('counts', metric, value, tags);
  }

  statusCheck(metric: string, status: number, message: string, tags?: Tags) {
    return this.doHTTP('/v1/check_run', {
      check: metric,
      timestamp: Math.floor(+new Date() / 1000),
      message, status,
      host_name: this.hostName,
      tags: this.globalTags.concat(listifyTags(tags)),
    });
  }

  stop() {
    if (!this.flushTimer) throw new Error(`Can't stop, already stopped.`);
    clearInterval(this.flushTimer);
    this.flushTimer = null;
  }

  async flushNow() {
    // report metrics as the middle of the batch
    // TODO: why?
    // TODO: batching points into chunks of 20/40/60 seconds in production
    const batchDate = Math.floor(+new Date() / 1000) - Math.round(this.flushPeriod / 2);
    const series = [];

    for (const array of this.gauges.values()) {
      if (array.length < 1) continue;
      let mean = array.reduce((acc, cur) => acc + cur, 0) / array.length;
      let max = array.sort((a, b) => b - a)[0];

      series.push({
        metric: array.metric,
        type: 'gauge',
        points: [[batchDate, mean]],
        host: this.hostName,
        tags: this.globalTags.concat(array.tagList),
      });
      series.push({
        metric: array.metric+'.max',
        type: 'gauge',
        points: [[batchDate, max]],
        host: this.hostName,
        tags: this.globalTags.concat(array.tagList),
      });
      array.length = 0;
    }

    for (const array of this.rates.values()) {
      let value = array[0] || 0;
      if (array.length > 1) {
        value = array.reduce((acc, cur) => acc + cur, 0) / array.length;
      }

      series.push({
        metric: array.metric,
        type: 'rate',
        interval: this.flushPeriod,
        points: [[batchDate, value]],
        host: this.hostName,
        tags: this.globalTags.concat(array.tagList),
      });
      array.length = 0;
    }

    for (const array of this.counts.values()) {
      const value = array.reduce((acc, cur) => acc + cur, 0);
      series.push({
        metric: array.metric,
        type: 'count',
        interval: this.flushPeriod,
        points: [[batchDate, value]],
        host: this.hostName,
        tags: this.globalTags.concat(array.tagList),
      });
      array.length = 0;
    }

    // Actually transmit data to Datadog
    await Promise.all([
      (series.length === 0) ? Promise.resolve() : this.doHTTP('/v1/series', {series}),
      this.statusCheck('process.alive', 0, 'Datadog pump is running'),
    ]);
  }
}


// TODO: deno really doesn't want to identify itself I guess

// // Grab first few bytes of any present IPv6 address
// const v6Prefix = Object
//   .values(os.networkInterfaces())
//   .map(x => x.find(y => y.family === 'IPv6' && !y.internal))
//   .filter(x => x)
//   .map(x => x.address.split(':').slice(0,3).join(':'))
//   [0] || null;

// // Grab launched package.json
// const {join, dirname} = require('path');
// const mainDir = dirname(require.main.path);
// const packageInfo = require(join(mainDir, 'package.json'));
// const packageName = packageInfo.name.replace(/^@/, '');

let apiKey: string | boolean = false;
let appName: string = Deno.mainModule;
try {
  apiKey = Deno.env.get('DD_API_KEY') ?? false;
  appName = Deno.env.get('DD_APP_NAME') ?? appName;
} catch (err) {}

let hostname = (Deno as {hostname?: () => string}).hostname?.() ?? 'deno';
const osRelease = (Deno as {osRelease?: () => string}).osRelease?.() ?? 'unknown';
try {
  hostname = Deno.env.get('DD_HOST_NAME') ?? hostname;
} catch (err) {}

// Set up the singleton metrics sender to share
const Singleton = new Datadog(
  apiKey, hostname, {
    app: appName,
    app_url: Deno.mainModule,
    // app_version: `${packageName}/${packageInfo.version}`,

    // host_ipv6: v6Prefix,
    // host_user: os.userInfo().username,
    host_os: `${Deno.build.os} ${osRelease}`,
  });

export default Singleton;
