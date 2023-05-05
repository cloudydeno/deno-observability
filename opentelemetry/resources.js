/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="./resources.d.ts" />

import { diag } from './api.js';
import { SemanticResourceAttributes } from './semantic-conventions.js';
import { SDK_INFO, getEnv } from './core.js';




function defaultServiceName() {
	return `unknown_service:deno`;
}

const normalizeArch = (archString) => ({
	'x64_64': 'amd64',
	'aarch64': 'arm64',
})[archString] ?? archString;
const normalizeType = (os) => os;

async function getMachineId() {
	const paths = ['/etc/machine-id', '/var/lib/dbus/machine-id'];
	for (const path of paths) {
		try {
			const result = await Deno.readTextFile(path);
			return result.trim();
		}
		catch (e) {
			diag.debug(`error reading machine id: ${e}`);
		}
	}
	return '';
}

class HostDetectorSync {
	detect(_config) {
		const attributes = {
			[SemanticResourceAttributes.HOST_NAME]: Deno.hostname?.(),
			[SemanticResourceAttributes.HOST_ARCH]: normalizeArch(Deno.build.arch),
		};
		return new Resource(attributes, this._getAsyncAttributes());
	}
	_getAsyncAttributes() {
		return getMachineId().then(machineId => {
			const attributes = {};
			if (machineId) {
				attributes[SemanticResourceAttributes.HOST_ID] = machineId;
			}
			return attributes;
		});
	}
}
const hostDetectorSync = new HostDetectorSync();

class HostDetector {
	detect(_config) {
		return Promise.resolve(hostDetectorSync.detect(_config));
	}
}
const hostDetector = new HostDetector();

class OSDetectorSync {
	detect(_config) {
		const attributes = {
			[SemanticResourceAttributes.OS_TYPE]: Deno.build.os,
			[SemanticResourceAttributes.OS_VERSION]: Deno.osRelease(),
		};
		return new Resource(attributes);
	}
}
const osDetectorSync = new OSDetectorSync();

class OSDetector {
	detect(_config) {
		return Promise.resolve(osDetectorSync.detect(_config));
	}
}
const osDetector = new OSDetector();

class ProcessDetectorSync {
	detect(_config) {
		const attributes = {
			[SemanticResourceAttributes.PROCESS_PID]: process.pid,
			[SemanticResourceAttributes.PROCESS_EXECUTABLE_NAME]: process.title,
			[SemanticResourceAttributes.PROCESS_EXECUTABLE_PATH]: process.execPath,
			[SemanticResourceAttributes.PROCESS_COMMAND_ARGS]: [
				process.argv[0],
				...process.execArgv,
				...process.argv.slice(1),
			],
			[SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: process.versions.node,
			[SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'nodejs',
			[SemanticResourceAttributes.PROCESS_RUNTIME_DESCRIPTION]: 'Node.js',
		};
		if (process.argv.length > 1) {
			attributes[SemanticResourceAttributes.PROCESS_COMMAND] = process.argv[1];
		}
		try {
			const userInfo = os.userInfo();
			attributes[SemanticResourceAttributes.PROCESS_OWNER] = userInfo.username;
		}
		catch (e) {
			diag.debug(`error obtaining process owner: ${e}`);
		}
		return new Resource(attributes);
	}
}
const processDetectorSync = new ProcessDetectorSync();

class ProcessDetector {
	detect(config) {
		return Promise.resolve(processDetectorSync.detect(config));
	}
}
const processDetector = new ProcessDetector();

class Resource {
	constructor(
	attributes, asyncAttributesPromise) {
		this._attributes = attributes;
		this.asyncAttributesPending = asyncAttributesPromise != null;
		this._syncAttributes = this._attributes ?? {};
		this._asyncAttributesPromise = asyncAttributesPromise?.then(asyncAttributes => {
			this._attributes = Object.assign({}, this._attributes, asyncAttributes);
			this.asyncAttributesPending = false;
			return asyncAttributes;
		}, err => {
			diag.debug("a resource's async attributes promise rejected: %s", err);
			this.asyncAttributesPending = false;
			return {};
		});
	}
	static empty() {
		return Resource.EMPTY;
	}
	static default() {
		return new Resource({
			[SemanticResourceAttributes.SERVICE_NAME]: defaultServiceName(),
			[SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]: SDK_INFO[SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE],
			[SemanticResourceAttributes.TELEMETRY_SDK_NAME]: SDK_INFO[SemanticResourceAttributes.TELEMETRY_SDK_NAME],
			[SemanticResourceAttributes.TELEMETRY_SDK_VERSION]: SDK_INFO[SemanticResourceAttributes.TELEMETRY_SDK_VERSION],
		});
	}
	get attributes() {
		if (this.asyncAttributesPending) {
			diag.error('Accessing resource attributes before async attributes settled');
		}
		return this._attributes ?? {};
	}
	async waitForAsyncAttributes() {
		if (this.asyncAttributesPending) {
			await this._asyncAttributesPromise;
		}
	}
	merge(other) {
		if (!other)
			return this;
		const mergedSyncAttributes = {
			...this._syncAttributes,
			...(other._syncAttributes ?? other.attributes),
		};
		if (!this._asyncAttributesPromise &&
			!other._asyncAttributesPromise) {
			return new Resource(mergedSyncAttributes);
		}
		const mergedAttributesPromise = Promise.all([
			this._asyncAttributesPromise,
			other._asyncAttributesPromise,
		]).then(([thisAsyncAttributes, otherAsyncAttributes]) => {
			return {
				...this._syncAttributes,
				...thisAsyncAttributes,
				...(other._syncAttributes ?? other.attributes),
				...otherAsyncAttributes,
			};
		});
		return new Resource(mergedSyncAttributes, mergedAttributesPromise);
	}
}
Resource.EMPTY = new Resource({});

class BrowserDetector {
	detect(config) {
		return Promise.resolve(browserDetectorSync.detect(config));
	}
}
const browserDetector = new BrowserDetector();

class EnvDetectorSync {
	constructor() {
		this._MAX_LENGTH = 255;
		this._COMMA_SEPARATOR = ',';
		this._LABEL_KEY_VALUE_SPLITTER = '=';
		this._ERROR_MESSAGE_INVALID_CHARS = 'should be a ASCII string with a length greater than 0 and not exceed ' +
			this._MAX_LENGTH +
			' characters.';
		this._ERROR_MESSAGE_INVALID_VALUE = 'should be a ASCII string with a length not exceed ' +
			this._MAX_LENGTH +
			' characters.';
	}
	detect(_config) {
		const attributes = {};
		const env = getEnv();
		const rawAttributes = env.OTEL_RESOURCE_ATTRIBUTES;
		const serviceName = env.OTEL_SERVICE_NAME;
		if (rawAttributes) {
			try {
				const parsedAttributes = this._parseResourceAttributes(rawAttributes);
				Object.assign(attributes, parsedAttributes);
			}
			catch (e) {
				diag.debug(`EnvDetector failed: ${e.message}`);
			}
		}
		if (serviceName) {
			attributes[SemanticResourceAttributes.SERVICE_NAME] = serviceName;
		}
		return new Resource(attributes);
	}
	_parseResourceAttributes(rawEnvAttributes) {
		if (!rawEnvAttributes)
			return {};
		const attributes = {};
		const rawAttributes = rawEnvAttributes.split(this._COMMA_SEPARATOR, -1);
		for (const rawAttribute of rawAttributes) {
			const keyValuePair = rawAttribute.split(this._LABEL_KEY_VALUE_SPLITTER, -1);
			if (keyValuePair.length !== 2) {
				continue;
			}
			let [key, value] = keyValuePair;
			key = key.trim();
			value = value.trim().split(/^"|"$/).join('');
			if (!this._isValidAndNotEmpty(key)) {
				throw new Error(`Attribute key ${this._ERROR_MESSAGE_INVALID_CHARS}`);
			}
			if (!this._isValid(value)) {
				throw new Error(`Attribute value ${this._ERROR_MESSAGE_INVALID_VALUE}`);
			}
			attributes[key] = decodeURIComponent(value);
		}
		return attributes;
	}
	_isValid(name) {
		return name.length <= this._MAX_LENGTH && this._isBaggageOctetString(name);
	}
	_isBaggageOctetString(str) {
		for (let i = 0; i < str.length; i++) {
			const ch = str.charCodeAt(i);
			if (ch < 0x21 || ch === 0x2c || ch === 0x3b || ch === 0x5c || ch > 0x7e) {
				return false;
			}
		}
		return true;
	}
	_isValidAndNotEmpty(str) {
		return str.length > 0 && this._isValid(str);
	}
}
const envDetectorSync = new EnvDetectorSync();

class EnvDetector {
	detect(config) {
		return Promise.resolve(envDetectorSync.detect(config));
	}
}
const envDetector = new EnvDetector();

class BrowserDetectorSync {
	detect(config) {
		const isBrowser = typeof navigator !== 'undefined';
		if (!isBrowser) {
			return Resource.empty();
		}
		const browserResource = {
			[SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'browser',
			[SemanticResourceAttributes.PROCESS_RUNTIME_DESCRIPTION]: 'Web Browser',
			[SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: navigator.userAgent,
		};
		return this._getResourceAttributes(browserResource, config);
	}
	_getResourceAttributes(browserResource, _config) {
		if (browserResource[SemanticResourceAttributes.PROCESS_RUNTIME_VERSION] === '') {
			diag.debug('BrowserDetector failed: Unable to find required browser resources. ');
			return Resource.empty();
		}
		else {
			return new Resource({
				...browserResource,
			});
		}
	}
}
const browserDetectorSync = new BrowserDetectorSync();

const isPromiseLike = (val) => {
	return (val !== null && typeof val === 'object' && typeof val.then === 'function');
};

const detectResources = async (config = {}) => {
	const resources = await Promise.all((config.detectors || []).map(async (d) => {
		try {
			const resource = await d.detect(config);
			diag.debug(`${d.constructor.name} found resource.`, resource);
			return resource;
		}
		catch (e) {
			diag.debug(`${d.constructor.name} failed: ${e.message}`);
			return Resource.empty();
		}
	}));
	logResources(resources);
	return resources.reduce((acc, resource) => acc.merge(resource), Resource.empty());
};
const detectResourcesSync = (config = {}) => {
	const resources = (config.detectors ?? []).map((d) => {
		try {
			const resourceOrPromise = d.detect(config);
			let resource;
			if (isPromiseLike(resourceOrPromise)) {
				const createPromise = async () => {
					const resolvedResource = await resourceOrPromise;
					return resolvedResource.attributes;
				};
				resource = new Resource({}, createPromise());
			}
			else {
				resource = resourceOrPromise;
			}
			if (resource.waitForAsyncAttributes) {
				void resource
					.waitForAsyncAttributes()
					.then(() => diag.debug(`${d.constructor.name} found resource.`, resource));
			}
			else {
				diag.debug(`${d.constructor.name} found resource.`, resource);
			}
			return resource;
		}
		catch (e) {
			diag.error(`${d.constructor.name} failed: ${e.message}`);
			return Resource.empty();
		}
	});
	const mergedResources = resources.reduce((acc, resource) => acc.merge(resource), Resource.empty());
	if (mergedResources.waitForAsyncAttributes) {
		void mergedResources.waitForAsyncAttributes().then(() => {
			logResources(resources);
		});
	}
	return mergedResources;
};
const logResources = (resources) => {
	resources.forEach(resource => {
		if (Object.keys(resource.attributes).length > 0) {
			const resourceDebugString = JSON.stringify(resource.attributes, null, 4);
			diag.verbose(resourceDebugString);
		}
	});
};

export { Resource, browserDetector, browserDetectorSync, defaultServiceName, detectResources, detectResourcesSync, envDetector, envDetectorSync, hostDetector, hostDetectorSync, osDetector, osDetectorSync, processDetector, processDetectorSync };
