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

import { Detector, ResourceDetectionConfig, IResource } from './resources.js';

/**
 * BrowserDetector will be used to detect the resources related to browser.
 */
declare class BrowserDetector implements Detector {
	detect(config?: ResourceDetectionConfig): Promise<IResource>;
	/**
	* Validates browser resource attribute map from browser variables
	*
	* @param browserResource The un-sanitized resource attributes from browser as key/value pairs.
	* @param config: Config
	* @returns The sanitized resource attributes.
	*/
	private _getResourceAttributes;
}
declare const browserDetector: BrowserDetector;

export { browserDetector };
