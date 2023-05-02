import { DetectorSync, Resource } from "../opentelemetry/resources.js";
import { SemanticResourceAttributes } from "../opentelemetry/semantic-conventions.js";

export class DenoRuntimeDetector implements DetectorSync {
  detect() {

    const isDeno = typeof Deno !== 'undefined';
    if (!isDeno) {
      return Resource.empty();
    }

    return new Resource({
      [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'deno',
      [SemanticResourceAttributes.PROCESS_RUNTIME_DESCRIPTION]: 'Deno Runtime',
      [SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: Deno.version?.deno,
    });
  }
}

export class DenoDeployDetector implements DetectorSync {
  detect() {
    // Deno Deploy doesn't have permissions
    if (Deno.permissions.querySync({
      name: 'env',
      variable: 'DENO_DEPLOYMENT_ID',
    }).state !== 'granted') {
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

export class DenoProcessDetector implements DetectorSync {
	detect() {
    // deno deploy currently lacks querySync, but can read
    const canRead = (Deno.permissions.querySync?.({name: 'read'}).state == 'granted') ?? true;
		return new Resource({
			[SemanticResourceAttributes.PROCESS_PID]: Deno.pid,
			[SemanticResourceAttributes.PROCESS_COMMAND_ARGS]: Deno.args,
			[SemanticResourceAttributes.PROCESS_EXECUTABLE_PATH]: canRead && Deno.execPath(),
      [SemanticResourceAttributes.PROCESS_COMMAND]: canRead && Deno.mainModule,
		});
	}
}
