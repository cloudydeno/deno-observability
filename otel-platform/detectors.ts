import { DetectorSync, Resource } from "../opentelemetry/resources.js";
import {
  SEMRESATTRS_CLOUD_PLATFORM,
  SEMRESATTRS_CLOUD_PROVIDER,
  SEMRESATTRS_CLOUD_REGION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_FAAS_VERSION,
  SEMRESATTRS_PROCESS_COMMAND,
  SEMRESATTRS_PROCESS_COMMAND_ARGS,
  SEMRESATTRS_PROCESS_EXECUTABLE_PATH,
  SEMRESATTRS_PROCESS_PID,
  SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION,
  SEMRESATTRS_PROCESS_RUNTIME_NAME,
  SEMRESATTRS_PROCESS_RUNTIME_VERSION,
} from "../opentelemetry/semantic-conventions.js";

const runtimeResource = new Resource({
  [SEMRESATTRS_PROCESS_RUNTIME_NAME]: 'deno',
  // [SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION]: 'Deno Runtime',
});
export class DenoRuntimeDetector implements DetectorSync {
  detect() {
    const isDeno = typeof Deno !== 'undefined';
    if (!isDeno) {
      return Resource.empty();
    }

    // Deno Deploy does this:
    if (!Deno.version?.deno) {
      return runtimeResource.merge(new Resource({
        [SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION]: 'Deno Deploy hosted runtime',
      }));
    }

    return runtimeResource.merge(new Resource({
      [SEMRESATTRS_PROCESS_RUNTIME_VERSION]: Deno.version.deno,
    }));
  }
}

export class DenoDeployDetector implements DetectorSync {
  detect() {
    // Deno Deploy doesn't have permissions
    const canGet = (Deno.permissions.querySync?.({
      name: 'env',
      variable: 'DENO_DEPLOYMENT_ID',
    }).state ?? 'granted') === 'granted';
    if (!canGet) {
      return Resource.empty();
    }

    const deployVersion = Deno.env.get('DENO_DEPLOYMENT_ID');
    const deployRegion = Deno.env.get('DENO_REGION');
    if (!deployRegion && !deployVersion) {
      return Resource.empty();
    }

    return new Resource({
      [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: 'production', // TODO: main branch or not?
      [SEMRESATTRS_FAAS_VERSION]: deployVersion,
      [SEMRESATTRS_CLOUD_REGION]: deployRegion,
      [SEMRESATTRS_CLOUD_PROVIDER]: 'deno',
      [SEMRESATTRS_CLOUD_PLATFORM]: 'deno_deploy',
    });
  }
}

const processResource = new Resource({
  [SEMRESATTRS_PROCESS_PID]: Deno.pid,
  [SEMRESATTRS_PROCESS_COMMAND_ARGS]: Deno.args,
});
export class DenoProcessDetector implements DetectorSync {
  detect() {
    //@ts-expect-error deno deploy currently lacks querySync, but can take the action
    const canRead = (Deno.permissions.querySync?.({name: 'read'}).state == 'granted') ?? true;
    if (!canRead) return processResource;

    return processResource.merge(new Resource({
      [SEMRESATTRS_PROCESS_EXECUTABLE_PATH]: Deno.execPath(),
      [SEMRESATTRS_PROCESS_COMMAND]: Deno.mainModule,
    }));
  }
}
