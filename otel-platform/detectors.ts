import { DetectorSync, Resource } from "../opentelemetry/resources.js";
import { SemanticResourceAttributes } from "../opentelemetry/semantic-conventions.js";

const runtimeResource = new Resource({
  [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'deno',
  // [SemanticResourceAttributes.PROCESS_RUNTIME_DESCRIPTION]: 'Deno Runtime',
});
export class DenoRuntimeDetector implements DetectorSync {
  detect() {
    const isDeno = typeof Deno !== 'undefined';
    if (!isDeno) {
      return Resource.empty();
    }

    // Deno Deploy does this:
    if (!Deno.version?.deno) return new Resource({
      [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'deno',
      [SemanticResourceAttributes.PROCESS_RUNTIME_DESCRIPTION]: 'Deno Deploy hosted runtime',
    });

    return runtimeResource.merge(new Resource({
      [SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: Deno.version.deno,
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
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'production', // TODO: main branch or not?
      [SemanticResourceAttributes.FAAS_VERSION]: deployVersion,
      [SemanticResourceAttributes.CLOUD_REGION]: deployRegion,
      [SemanticResourceAttributes.CLOUD_PROVIDER]: 'deno',
      [SemanticResourceAttributes.CLOUD_PLATFORM]: 'deno_deploy',
    });
  }
}

const processResource = new Resource({
  [SemanticResourceAttributes.PROCESS_PID]: Deno.pid,
  [SemanticResourceAttributes.PROCESS_COMMAND_ARGS]: Deno.args,
});
export class DenoProcessDetector implements DetectorSync {
  detect() {
    // deno deploy currently lacks querySync, but can read
    const canRead = (Deno.permissions.querySync?.({name: 'read'}).state == 'granted') ?? true;
    if (!canRead) return processResource;

    return processResource.merge(new Resource({
      [SemanticResourceAttributes.PROCESS_EXECUTABLE_PATH]: Deno.execPath(),
      [SemanticResourceAttributes.PROCESS_COMMAND]: Deno.mainModule,
    }));
  }
}
