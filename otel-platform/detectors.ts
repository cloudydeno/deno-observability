import {
  type DetectedResource,
  type ResourceDetector,
} from "../opentelemetry/resources.js";
import {
  ATTR_CLOUD_PLATFORM,
  ATTR_CLOUD_PROVIDER,
  ATTR_CLOUD_REGION,
  ATTR_DEPLOYMENT_ENVIRONMENT,
  ATTR_FAAS_VERSION,
  ATTR_PROCESS_COMMAND,
  ATTR_PROCESS_COMMAND_ARGS,
  ATTR_PROCESS_EXECUTABLE_PATH,
  ATTR_PROCESS_PID,
  ATTR_PROCESS_RUNTIME_DESCRIPTION,
  ATTR_PROCESS_RUNTIME_NAME,
  ATTR_PROCESS_RUNTIME_VERSION,
} from "../opentelemetry/semantic-conventions.js";

const runtimeAttrs = {
  [ATTR_PROCESS_RUNTIME_NAME]: 'deno',
  // [ATTR_PROCESS_RUNTIME_DESCRIPTION]: 'Deno Runtime',
};
export class DenoRuntimeDetector implements ResourceDetector {
  detect(): DetectedResource {
    const isDeno = typeof Deno !== 'undefined';
    if (!isDeno) {
      return { attributes: {} };
    }

    // Deno Deploy does this:
    if (!Deno.version?.deno) {
      return { attributes: {
        ...runtimeAttrs,
        [ATTR_PROCESS_RUNTIME_DESCRIPTION]: 'Deno Deploy hosted runtime',
      }};
    }

    return { attributes: {
      ...runtimeAttrs,
      [ATTR_PROCESS_RUNTIME_VERSION]: Deno.version.deno,
    }};
  }
}

export class DenoDeployDetector implements ResourceDetector {
  detect(): DetectedResource {
    // Deno Deploy doesn't have permissions
    const canGet = (Deno.permissions.querySync?.({
      name: 'env',
      variable: 'DENO_DEPLOYMENT_ID',
    }).state ?? 'granted') === 'granted';
    if (!canGet) {
      return { attributes: {} };
    }

    const deployVersion = Deno.env.get('DENO_DEPLOYMENT_ID');
    const deployRegion = Deno.env.get('DENO_REGION');
    if (!deployRegion && !deployVersion) {
      return { attributes: {} };
    }

    return { attributes: {
      [ATTR_DEPLOYMENT_ENVIRONMENT]: 'production', // TODO: main branch or not?
      [ATTR_FAAS_VERSION]: deployVersion,
      [ATTR_CLOUD_REGION]: deployRegion,
      [ATTR_CLOUD_PROVIDER]: 'deno',
      [ATTR_CLOUD_PLATFORM]: 'deno_deploy',
    }};
  }
}

const processAttrs = {
  [ATTR_PROCESS_PID]: Deno.pid,
  [ATTR_PROCESS_COMMAND_ARGS]: Deno.args,
};
export class DenoProcessDetector implements ResourceDetector {
  detect(): DetectedResource {
    //@ts-ignore deno deploy currently lacks querySync, but can take the action
    const canRead = (Deno.permissions.querySync?.({name: 'read'}).state == 'granted') ?? true;
    if (!canRead) return { attributes: processAttrs };

    return { attributes: {
      ...processAttrs,
      [ATTR_PROCESS_EXECUTABLE_PATH]: Deno.execPath(),
      [ATTR_PROCESS_COMMAND]: Deno.mainModule,
    }};
  }
}
