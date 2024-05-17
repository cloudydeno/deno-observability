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
/// <reference types="./otlp-exporter-base.d.ts" />

import { diag } from './api.js';
import { getEnv, BindOnceFuture, ExportResultCode } from './core.js';

const DEFAULT_TRACE_TIMEOUT = 10000;
function parseHeaders(partialHeaders = {}) {
	const headers = {};
	Object.entries(partialHeaders).forEach(([key, value]) => {
		if (typeof value !== 'undefined') {
			headers[key] = String(value);
		}
		else {
			diag.warn(`Header "${key}" has invalid value (${value}) and will be ignored`);
		}
	});
	return headers;
}
function appendResourcePathToUrl(url, path) {
	if (!url.endsWith('/')) {
		url = url + '/';
	}
	return url + path;
}
function appendRootPathToUrlIfNeeded(url) {
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.pathname === '') {
			parsedUrl.pathname = parsedUrl.pathname + '/';
		}
		return parsedUrl.toString();
	}
	catch {
		diag.warn(`Could not parse export URL: '${url}'`);
		return url;
	}
}
function configureExporterTimeout(timeoutMillis) {
	if (typeof timeoutMillis === 'number') {
		if (timeoutMillis <= 0) {
			return invalidTimeout(timeoutMillis, DEFAULT_TRACE_TIMEOUT);
		}
		return timeoutMillis;
	}
	else {
		return getExporterTimeoutFromEnv();
	}
}
function getExporterTimeoutFromEnv() {
	const definedTimeout = Number(getEnv().OTEL_EXPORTER_OTLP_TRACES_TIMEOUT ??
		getEnv().OTEL_EXPORTER_OTLP_TIMEOUT);
	if (definedTimeout <= 0) {
		return invalidTimeout(definedTimeout, DEFAULT_TRACE_TIMEOUT);
	}
	else {
		return definedTimeout;
	}
}
function invalidTimeout(timeout, defaultTimeout) {
	diag.warn('Timeout must be greater than 0', timeout);
	return defaultTimeout;
}

class OTLPExporterBase {
	constructor(config = {}) {
		this._sendingPromises = [];
		this.url = this.getDefaultUrl(config);
		if (typeof config.hostname === 'string') {
			this.hostname = config.hostname;
		}
		this.shutdown = this.shutdown.bind(this);
		this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
		this._concurrencyLimit =
			typeof config.concurrencyLimit === 'number'
				? config.concurrencyLimit
				: 30;
		this.timeoutMillis = configureExporterTimeout(config.timeoutMillis);
		this.onInit(config);
	}
	export(items, resultCallback) {
		if (this._shutdownOnce.isCalled) {
			resultCallback({
				code: ExportResultCode.FAILED,
				error: new Error('Exporter has been shutdown'),
			});
			return;
		}
		if (this._sendingPromises.length >= this._concurrencyLimit) {
			resultCallback({
				code: ExportResultCode.FAILED,
				error: new Error('Concurrent export limit reached'),
			});
			return;
		}
		this._export(items)
			.then(() => {
			resultCallback({ code: ExportResultCode.SUCCESS });
		})
			.catch((error) => {
			resultCallback({ code: ExportResultCode.FAILED, error });
		});
	}
	_export(items) {
		return new Promise((resolve, reject) => {
			try {
				diag.debug('items to be sent', items);
				this.send(items, resolve, reject);
			}
			catch (e) {
				reject(e);
			}
		});
	}
	shutdown() {
		return this._shutdownOnce.call();
	}
	forceFlush() {
		return Promise.all(this._sendingPromises).then(() => {
		});
	}
	_shutdown() {
		diag.debug('shutdown started');
		this.onShutdown();
		return this.forceFlush();
	}
}

class OTLPExporterError extends Error {
	constructor(message, code, data) {
		super(message);
		this.name = 'OTLPExporterError';
		this.data = data;
		this.code = code;
	}
}

export { OTLPExporterBase, OTLPExporterError, appendResourcePathToUrl, appendRootPathToUrlIfNeeded, configureExporterTimeout, invalidTimeout, parseHeaders };
