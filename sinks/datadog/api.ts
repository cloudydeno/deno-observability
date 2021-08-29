import DatadogApi from "https://deno.land/x/datadog_api@v0.1.4/client.ts";

// subset of Deno.env
interface EnvGetter {
  get(key: string): string | undefined;
};

export function clientFromEnvironment(env: EnvGetter, required = false) {
  // start with no-op client
  let api: DatadogClient = {
    async fetchJson() { return {}; },
  };

  // upgrade to real client if possible
  try {
    const apiKey = env.get("DATADOG_API_KEY") || env.get("DD_API_KEY");
    const appKey = env.get("DATADOG_APP_KEY") || env.get("DD_APP_KEY");
    if (!apiKey) throw new Error(
      `Export DATADOG_API_KEY (and probably DATADOG_APP_KEY) to use Datadog`,
    );
    api = new DatadogApi({
      apiKey, appKey,
      apiBase: env.get("DATADOG_HOST"),
    });

  } catch (err) {
    if (required) throw err;
    console.error(`WARN: Datadog reporting disabled: ${err.message || err}`)
  }

  return api;
}

// TODO: should be exposed from /x/datadog_api
export interface DatadogClient {
  fetchJson(opts: {
    method: 'GET' | 'POST';
    path: string;
    query?: URLSearchParams;
    body?: unknown;
  }): Promise<unknown>;
}
