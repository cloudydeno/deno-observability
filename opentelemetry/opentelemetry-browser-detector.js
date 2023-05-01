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
/// <reference types="./opentelemetry-browser-detector.d.ts" />

import { diag } from './api.js';
import { Resource } from './resources.js';

const BROWSER_ATTRIBUTES = {
	PLATFORM: 'browser.platform',
	BRANDS: 'browser.brands',
	MOBILE: 'browser.mobile',
	LANGUAGE: 'browser.language',
	USER_AGENT: 'browser.user_agent',
};

class BrowserDetector {
	async detect(config) {
		const isBrowser = typeof navigator !== 'undefined';
		if (!isBrowser) {
			return Resource.empty();
		}
		const browserResource = getBrowserAttributes();
		return this._getResourceAttributes(browserResource, config);
	}
	_getResourceAttributes(browserResource, _config) {
		if (!browserResource[BROWSER_ATTRIBUTES.USER_AGENT] &&
			!browserResource[BROWSER_ATTRIBUTES.PLATFORM]) {
			diag.debug('BrowserDetector failed: Unable to find required browser resources. ');
			return Resource.empty();
		}
		else {
			return new Resource(browserResource);
		}
	}
}
function getBrowserAttributes() {
	const browserAttribs = {};
	const userAgentData = navigator
		.userAgentData;
	if (userAgentData) {
		browserAttribs[BROWSER_ATTRIBUTES.PLATFORM] = userAgentData.platform;
		browserAttribs[BROWSER_ATTRIBUTES.BRANDS] = userAgentData.brands.map(b => `${b.brand} ${b.version}`);
		browserAttribs[BROWSER_ATTRIBUTES.MOBILE] = userAgentData.mobile;
	}
	else {
		browserAttribs[BROWSER_ATTRIBUTES.USER_AGENT] = navigator.userAgent;
	}
	browserAttribs[BROWSER_ATTRIBUTES.LANGUAGE] = navigator.language;
	return browserAttribs;
}
const browserDetector = new BrowserDetector();

export { browserDetector };
