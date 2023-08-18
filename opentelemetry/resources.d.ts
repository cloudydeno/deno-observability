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

import { SpanAttributes } from './api.d.ts';

/**
 * ResourceDetectionConfig provides an interface for configuring resource auto-detection.
 */
interface ResourceDetectionConfig {
	detectors?: Array<Detector | DetectorSync>;
}

/**
 * An interface that represents a resource. A Resource describes the entity for which signals (metrics or trace) are
 * collected.
 *
 */
interface IResource {
	/**
	* Check if async attributes have resolved. This is useful to avoid awaiting
	* waitForAsyncAttributes (which will introduce asynchronous behavior) when not necessary.
	*
	* @returns true if the resource "attributes" property is not yet settled to its final value
	*/
	asyncAttributesPending?: boolean;
	/**
	* @returns the Resource's attributes.
	*/
	readonly attributes: ResourceAttributes;
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
	merge(other: IResource | null): IResource;
}

/**
 * Interface for Resource attributes.
 * General `Attributes` interface is added in api v1.1.0.
 * To backward support older api (1.0.x), the deprecated `SpanAttributes` is used here.
 */
declare type ResourceAttributes = SpanAttributes;
/**
 * @deprecated please use {@link DetectorSync}
 */
interface Detector {
	detect(config?: ResourceDetectionConfig): Promise<IResource>;
}
/**
 * Interface for a synchronous Resource Detector. In order to detect attributes asynchronously, a detector
 * can pass a Promise as the second parameter to the Resource constructor.
 */
interface DetectorSync {
	detect(config?: ResourceDetectionConfig): IResource;
}

/**
 * A Resource describes the entity for which a signals (metrics or trace) are
 * collected.
 */
declare class Resource implements IResource {
	static readonly EMPTY: Resource;
	private _syncAttributes?;
	private _asyncAttributesPromise?;
	private _attributes?;
	/**
	* Check if async attributes have resolved. This is useful to avoid awaiting
	* waitForAsyncAttributes (which will introduce asynchronous behavior) when not necessary.
	*
	* @returns true if the resource "attributes" property is not yet settled to its final value
	*/
	asyncAttributesPending?: boolean;
	/**
	* Returns an empty Resource
	*/
	static empty(): IResource;
	/**
	* Returns a Resource that identifies the SDK in use.
	*/
	static default(): IResource;
	constructor(
	/**
	* A dictionary of attributes with string keys and values that provide
	* information about the entity as numbers, strings or booleans
	* TODO: Consider to add check/validation on attributes.
	*/
	attributes: ResourceAttributes, asyncAttributesPromise?: Promise<ResourceAttributes>);
	get attributes(): ResourceAttributes;
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
	merge(other: IResource | null): IResource;
}

declare function defaultServiceName(): string;

/**
 * HostDetector detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */
declare class HostDetector implements Detector {
	detect(_config?: ResourceDetectionConfig): Promise<IResource>;
}
declare const hostDetector: HostDetector;

/**
 * OSDetector detects the resources related to the operating system (OS) on
 * which the process represented by this resource is running.
 */
declare class OSDetector implements Detector {
	detect(_config?: ResourceDetectionConfig): Promise<IResource>;
}
declare const osDetector: OSDetector;

/**
 * HostDetectorSync detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */
declare class HostDetectorSync implements DetectorSync {
	detect(_config?: ResourceDetectionConfig): Resource;
	private _getAsyncAttributes;
}
declare const hostDetectorSync: HostDetectorSync;

/**
 * OSDetectorSync detects the resources related to the operating system (OS) on
 * which the process represented by this resource is running.
 */
declare class OSDetectorSync implements DetectorSync {
	detect(_config?: ResourceDetectionConfig): Resource;
}
declare const osDetectorSync: OSDetectorSync;

/**
 * ProcessDetector will be used to detect the resources related current process running
 * and being instrumented from the NodeJS Process module.
 */
declare class ProcessDetector implements Detector {
	detect(config?: ResourceDetectionConfig): Promise<IResource>;
}
declare const processDetector: ProcessDetector;

/**
 * ProcessDetectorSync will be used to detect the resources related current process running
 * and being instrumented from the NodeJS Process module.
 */
declare class ProcessDetectorSync implements DetectorSync {
	detect(_config?: ResourceDetectionConfig): IResource;
}
declare const processDetectorSync: ProcessDetectorSync;

/**
 * BrowserDetector will be used to detect the resources related to browser.
 */
declare class BrowserDetector implements Detector {
	detect(config?: ResourceDetectionConfig): Promise<IResource>;
}
declare const browserDetector: BrowserDetector;

/**
 * EnvDetector can be used to detect the presence of and create a Resource
 * from the OTEL_RESOURCE_ATTRIBUTES environment variable.
 */
declare class EnvDetector implements Detector {
	/**
	* Returns a {@link Resource} populated with attributes from the
	* OTEL_RESOURCE_ATTRIBUTES environment variable. Note this is an async
	* function to conform to the Detector interface.
	*
	* @param config The resource detection config
	*/
	detect(config?: ResourceDetectionConfig): Promise<IResource>;
}
declare const envDetector: EnvDetector;

/**
 * BrowserDetectorSync will be used to detect the resources related to browser.
 */
declare class BrowserDetectorSync implements DetectorSync {
	detect(config?: ResourceDetectionConfig): IResource;
	/**
	* Validates process resource attribute map from process variables
	*
	* @param browserResource The un-sanitized resource attributes from process as key/value pairs.
	* @param config: Config
	* @returns The sanitized resource attributes.
	*/
	private _getResourceAttributes;
}
declare const browserDetectorSync: BrowserDetectorSync;

/**
 * EnvDetectorSync can be used to detect the presence of and create a Resource
 * from the OTEL_RESOURCE_ATTRIBUTES environment variable.
 */
declare class EnvDetectorSync implements DetectorSync {
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
	detect(_config?: ResourceDetectionConfig): IResource;
	/**
	* Creates an attribute map from the OTEL_RESOURCE_ATTRIBUTES environment
	* variable.
	*
	* OTEL_RESOURCE_ATTRIBUTES: A comma-separated list of attributes describing
	* the source in more detail, e.g. “key1=val1,key2=val2”. Domain names and
	* paths are accepted as attribute keys. Values may be quoted or unquoted in
	* general. If a value contains whitespaces, =, or " characters, it must
	* always be quoted.
	*
	* @param rawEnvAttributes The resource attributes as a comma-seperated list
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
declare const envDetectorSync: EnvDetectorSync;

/**
 * Runs all resource detectors and returns the results merged into a single Resource. Promise
 * does not resolve until all the underlying detectors have resolved, unlike
 * detectResourcesSync.
 *
 * @deprecated use detectResourcesSync() instead.
 * @param config Configuration for resource detection
 */
declare const detectResources: (config?: ResourceDetectionConfig) => Promise<IResource>;
/**
 * Runs all resource detectors synchronously, merging their results. In case of attribute collision later resources will take precedence.
 *
 * @param config Configuration for resource detection
 */
declare const detectResourcesSync: (config?: ResourceDetectionConfig) => IResource;

export { Detector, DetectorSync, IResource, Resource, ResourceAttributes, ResourceDetectionConfig, browserDetector, browserDetectorSync, defaultServiceName, detectResources, detectResourcesSync, envDetector, envDetectorSync, hostDetector, hostDetectorSync, osDetector, osDetectorSync, processDetector, processDetectorSync };
