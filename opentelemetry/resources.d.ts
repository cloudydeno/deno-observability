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

import { AttributeValue, Attributes } from './api.d.ts';

/**
 * Interface for a Resource Detector.
 * A resource detector returns a set of detected resource attributes.
 * A detected resource attribute may be an {@link AttributeValue} or a Promise of an AttributeValue.
 */
interface ResourceDetector {
	/**
	* Detect resource attributes.
	*
	* @returns a {@link DetectedResource} object containing detected resource attributes
	*/
	detect(config?: ResourceDetectionConfig): DetectedResource;
}
type DetectedResource = {
	/**
	* Detected resource attributes.
	*/
	attributes?: DetectedResourceAttributes;
};
/**
 * An object representing detected resource attributes.
 * Value may be {@link AttributeValue}s, a promise to an {@link AttributeValue}, or undefined.
 */
type DetectedResourceAttributeValue = MaybePromise<AttributeValue | undefined>;
/**
 * An object representing detected resource attributes.
 * Values may be {@link AttributeValue}s or a promise to an {@link AttributeValue}.
 */
type DetectedResourceAttributes = Record<string, DetectedResourceAttributeValue>;
type MaybePromise<T> = T | Promise<T>;
type RawResourceAttribute = [
	string,
	MaybePromise<AttributeValue | undefined>
];

/**
 * ResourceDetectionConfig provides an interface for configuring resource auto-detection.
 */
interface ResourceDetectionConfig {
	detectors?: Array<ResourceDetector>;
}

/**
 * An interface that represents a resource. A Resource describes the entity for which signals (metrics or trace) are
 * collected.
 *
 */
interface Resource {
	/**
	* Check if async attributes have resolved. This is useful to avoid awaiting
	* waitForAsyncAttributes (which will introduce asynchronous behavior) when not necessary.
	*
	* @returns true if the resource "attributes" property is not yet settled to its final value
	*/
	readonly asyncAttributesPending?: boolean;
	/**
	* @returns the Resource's attributes.
	*/
	readonly attributes: Attributes;
	/**
	* Returns a promise that will never be rejected. Resolves when all async attributes have finished being added to
	* this Resource's attributes. This is useful in exporters to block until resource detection
	* has finished.
	*/
	waitForAsyncAttributes?(): Promise<void>;
	/**
	* Returns a new, merged {@link Resource} by merging the current Resource
	* with the other Resource. In case of a collision, other Resource takes
	* precedence.
	*
	* @param other the Resource that will be merged with this.
	* @returns the newly merged Resource.
	*/
	merge(other: Resource | null): Resource;
	getRawAttributes(): RawResourceAttribute[];
}

/**
 * Runs all resource detectors and returns the results merged into a single Resource.
 *
 * @param config Configuration for resource detection
 */
declare const detectResources: (config?: ResourceDetectionConfig) => Resource;

/**
 * EnvDetector can be used to detect the presence of and create a Resource
 * from the OTEL_RESOURCE_ATTRIBUTES environment variable.
 */
declare class EnvDetector implements ResourceDetector {
	private readonly _MAX_LENGTH;
	private readonly _COMMA_SEPARATOR;
	private readonly _LABEL_KEY_VALUE_SPLITTER;
	private readonly _ERROR_MESSAGE_INVALID_CHARS;
	private readonly _ERROR_MESSAGE_INVALID_VALUE;
	/**
	* Returns a {@link Resource} populated with attributes from the
	* OTEL_RESOURCE_ATTRIBUTES environment variable. Note this is an async
	* function to conform to the Detector interface.
	*
	* @param config The resource detection config
	*/
	detect(_config?: ResourceDetectionConfig): DetectedResource;
	/**
	* Creates an attribute map from the OTEL_RESOURCE_ATTRIBUTES environment
	* variable.
	*
	* OTEL_RESOURCE_ATTRIBUTES: A comma-separated list of attributes describing
	* the source in more detail, e.g. “key1=val1,key2=val2”. Domain names and
	* paths are accepted as attribute keys. Values may be quoted or unquoted in
	* general. If a value contains whitespace, =, or " characters, it must
	* always be quoted.
	*
	* @param rawEnvAttributes The resource attributes as a comma-separated list
	* of key/value pairs.
	* @returns The sanitized resource attributes.
	*/
	private _parseResourceAttributes;
	/**
	* Determines whether the given String is a valid printable ASCII string with
	* a length not exceed _MAX_LENGTH characters.
	*
	* @param str The String to be validated.
	* @returns Whether the String is valid.
	*/
	private _isValid;
	private _isBaggageOctetString;
	/**
	* Determines whether the given String is a valid printable ASCII string with
	* a length greater than 0 and not exceed _MAX_LENGTH characters.
	*
	* @param str The String to be validated.
	* @returns Whether the String is valid and not empty.
	*/
	private _isValidAndNotEmpty;
}
declare const envDetector: EnvDetector;

/**
 * HostDetector detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */
declare class HostDetector implements ResourceDetector {
	detect(_config?: ResourceDetectionConfig): DetectedResource;
}
declare const hostDetector: HostDetector;

/**
 * OSDetector detects the resources related to the operating system (OS) on
 * which the process represented by this resource is running.
 */
declare class OSDetector implements ResourceDetector {
	detect(_config?: ResourceDetectionConfig): DetectedResource;
}
declare const osDetector: OSDetector;

/**
 * ProcessDetector will be used to detect the resources related current process running
 * and being instrumented from the NodeJS Process module.
 */
declare class ProcessDetector implements ResourceDetector {
	detect(_config?: ResourceDetectionConfig): DetectedResource;
}
declare const processDetector: ProcessDetector;

/**
 * ServiceInstanceIdDetector detects the resources related to the service instance ID.
 */
declare class ServiceInstanceIdDetector implements ResourceDetector {
	detect(_config?: ResourceDetectionConfig): DetectedResource;
}
/**
 * @experimental
 */
declare const serviceInstanceIdDetector: ServiceInstanceIdDetector;

declare function resourceFromAttributes(attributes: DetectedResourceAttributes): Resource;
declare function emptyResource(): Resource;
declare function defaultResource(): Resource;

declare function defaultServiceName(): string;

export { DetectedResource, DetectedResourceAttributes, MaybePromise, RawResourceAttribute, Resource, ResourceDetectionConfig, ResourceDetector, defaultResource, defaultServiceName, detectResources, emptyResource, envDetector, hostDetector, osDetector, processDetector, resourceFromAttributes, serviceInstanceIdDetector };
