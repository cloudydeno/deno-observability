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

import { ExportResultCode, parseKeyPairsIntoRecord } from './core.js';
import { diag } from './api.js';

class OTLPExporterBase {
	_delegate;
	constructor(_delegate) {
		this._delegate = _delegate;
	}
	export(items, resultCallback) {
		this._delegate.export(items, resultCallback);
	}
	forceFlush() {
		return this._delegate.forceFlush();
	}
	shutdown() {
		return this._delegate.shutdown();
	}
}

class OTLPExporterError extends Error {
	code;
	name = 'OTLPExporterError';
	data;
	constructor(message, code, data) {
		super(message);
		this.data = data;
		this.code = code;
	}
}

function validateTimeoutMillis(timeoutMillis) {
	if (Number.isFinite(timeoutMillis) && timeoutMillis > 0) {
		return timeoutMillis;
	}
	throw new Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${timeoutMillis}')`);
}
function wrapStaticHeadersInFunction(headers) {
	if (headers == null) {
		return undefined;
	}
	return () => headers;
}
function mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
	return {
		timeoutMillis: validateTimeoutMillis(userProvidedConfiguration.timeoutMillis ??
			fallbackConfiguration.timeoutMillis ??
			defaultConfiguration.timeoutMillis),
		concurrencyLimit: userProvidedConfiguration.concurrencyLimit ??
			fallbackConfiguration.concurrencyLimit ??
			defaultConfiguration.concurrencyLimit,
		compression: userProvidedConfiguration.compression ??
			fallbackConfiguration.compression ??
			defaultConfiguration.compression,
	};
}
function getSharedConfigurationDefaults() {
	return {
		timeoutMillis: 10000,
		concurrencyLimit: 30,
		compression: 'none',
	};
}

var CompressionAlgorithm;
(function (CompressionAlgorithm) {
	CompressionAlgorithm["NONE"] = "none";
	CompressionAlgorithm["GZIP"] = "gzip";
})(CompressionAlgorithm || (CompressionAlgorithm = {}));

class BoundedQueueExportPromiseHandler {
	_concurrencyLimit;
	_sendingPromises = [];
	constructor(concurrencyLimit) {
		this._concurrencyLimit = concurrencyLimit;
	}
	pushPromise(promise) {
		if (this.hasReachedLimit()) {
			throw new Error('Concurrency Limit reached');
		}
		this._sendingPromises.push(promise);
		const popPromise = () => {
			const index = this._sendingPromises.indexOf(promise);
			this._sendingPromises.splice(index, 1);
		};
		promise.then(popPromise, popPromise);
	}
	hasReachedLimit() {
		return this._sendingPromises.length >= this._concurrencyLimit;
	}
	async awaitAll() {
		await Promise.all(this._sendingPromises);
	}
}
function createBoundedQueueExportPromiseHandler(options) {
	return new BoundedQueueExportPromiseHandler(options.concurrencyLimit);
}

function isPartialSuccessResponse(response) {
	return Object.prototype.hasOwnProperty.call(response, 'partialSuccess');
}
function createLoggingPartialSuccessResponseHandler() {
	return {
		handleResponse(response) {
			if (response == null ||
				!isPartialSuccessResponse(response) ||
				response.partialSuccess == null ||
				Object.keys(response.partialSuccess).length === 0) {
				return;
			}
			diag.warn('Received Partial Success response:', JSON.stringify(response.partialSuccess));
		},
	};
}

class OTLPExportDelegate {
	_transport;
	_serializer;
	_responseHandler;
	_promiseQueue;
	_timeout;
	_diagLogger;
	constructor(_transport, _serializer, _responseHandler, _promiseQueue, _timeout) {
		this._transport = _transport;
		this._serializer = _serializer;
		this._responseHandler = _responseHandler;
		this._promiseQueue = _promiseQueue;
		this._timeout = _timeout;
		this._diagLogger = diag.createComponentLogger({
			namespace: 'OTLPExportDelegate',
		});
	}
	export(internalRepresentation, resultCallback) {
		this._diagLogger.debug('items to be sent', internalRepresentation);
		if (this._promiseQueue.hasReachedLimit()) {
			resultCallback({
				code: ExportResultCode.FAILED,
				error: new Error('Concurrent export limit reached'),
			});
			return;
		}
		const serializedRequest = this._serializer.serializeRequest(internalRepresentation);
		if (serializedRequest == null) {
			resultCallback({
				code: ExportResultCode.FAILED,
				error: new Error('Nothing to send'),
			});
			return;
		}
		this._promiseQueue.pushPromise(this._transport.send(serializedRequest, this._timeout).then(response => {
			if (response.status === 'success') {
				if (response.data != null) {
					try {
						this._responseHandler.handleResponse(this._serializer.deserializeResponse(response.data));
					}
					catch (e) {
						this._diagLogger.warn('Export succeeded but could not deserialize response - is the response specification compliant?', e, response.data);
					}
				}
				resultCallback({
					code: ExportResultCode.SUCCESS,
				});
				return;
			}
			else if (response.status === 'failure' && response.error) {
				resultCallback({
					code: ExportResultCode.FAILED,
					error: response.error,
				});
				return;
			}
			else if (response.status === 'retryable') {
				resultCallback({
					code: ExportResultCode.FAILED,
					error: new OTLPExporterError('Export failed with retryable status'),
				});
			}
			else {
				resultCallback({
					code: ExportResultCode.FAILED,
					error: new OTLPExporterError('Export failed with unknown error'),
				});
			}
		}, reason => resultCallback({
			code: ExportResultCode.FAILED,
			error: reason,
		})));
	}
	forceFlush() {
		return this._promiseQueue.awaitAll();
	}
	async shutdown() {
		this._diagLogger.debug('shutdown started');
		await this.forceFlush();
		this._transport.shutdown();
	}
}
function createOtlpExportDelegate(components, settings) {
	return new OTLPExportDelegate(components.transport, components.serializer, createLoggingPartialSuccessResponseHandler(), components.promiseHandler, settings.timeout);
}

function createOtlpNetworkExportDelegate(options, serializer, transport) {
	return createOtlpExportDelegate({
		transport: transport,
		serializer,
		promiseHandler: createBoundedQueueExportPromiseHandler(options),
	}, { timeout: options.timeoutMillis });
}

function isExportRetryable(statusCode) {
	const retryCodes = [429, 502, 503, 504];
	return retryCodes.includes(statusCode);
}
function parseRetryAfterToMills(retryAfter) {
	if (retryAfter == null) {
		return undefined;
	}
	const seconds = Number.parseInt(retryAfter, 10);
	if (Number.isInteger(seconds)) {
		return seconds > 0 ? seconds * 1000 : -1;
	}
	const delay = new Date(retryAfter).getTime() - Date.now();
	if (delay >= 0) {
		return delay;
	}
	return 0;
}

class HttpExporterTransport {
	_parameters;
	constructor(_parameters) {
		this._parameters = _parameters;
	}
	async send(data, timeoutMillis) {
		const headers = new Headers(this._parameters.headers());
		let body = ReadableStream.from([data]);
		if (this._parameters.compression == 'gzip') {
			headers.set('content-encoding', 'gzip');
			body = body.pipeThrough(new CompressionStream('gzip'));
		}
		return await fetch(this._parameters.url, {
			method: 'POST',
			body, headers,
			signal: AbortSignal.timeout(timeoutMillis),
		}).then(async (res) => {
			if (res.ok) {
				const data = new Uint8Array(await res.arrayBuffer());
				return { status: 'success', data };
			}
			if (isExportRetryable(res.status)) {
				const retryInMillis = parseRetryAfterToMills(res.headers.get('retry-after'));
				return { status: 'retryable', retryInMillis };
			}
			const error = new OTLPExporterError(res.statusText, res.status, await res.text());
			return { status: 'failure', error };
		}).catch(error => ({ status: 'failure', error }));
	}
	shutdown() { }
}
function createHttpExporterTransport(parameters) {
	return new HttpExporterTransport(parameters);
}

const MAX_ATTEMPTS = 5;
const INITIAL_BACKOFF = 1000;
const MAX_BACKOFF = 5000;
const BACKOFF_MULTIPLIER = 1.5;
const JITTER = 0.2;
function getJitter() {
	return Math.random() * (2 * JITTER) - JITTER;
}
class RetryingTransport {
	_transport;
	constructor(_transport) {
		this._transport = _transport;
	}
	retry(data, timeoutMillis, inMillis) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this._transport.send(data, timeoutMillis).then(resolve, reject);
			}, inMillis);
		});
	}
	async send(data, timeoutMillis) {
		const deadline = Date.now() + timeoutMillis;
		let result = await this._transport.send(data, timeoutMillis);
		let attempts = MAX_ATTEMPTS;
		let nextBackoff = INITIAL_BACKOFF;
		while (result.status === 'retryable' && attempts > 0) {
			attempts--;
			const backoff = Math.max(Math.min(nextBackoff, MAX_BACKOFF) + getJitter(), 0);
			nextBackoff = nextBackoff * BACKOFF_MULTIPLIER;
			const retryInMillis = result.retryInMillis ?? backoff;
			const remainingTimeoutMillis = deadline - Date.now();
			if (retryInMillis > remainingTimeoutMillis) {
				return result;
			}
			result = await this.retry(data, remainingTimeoutMillis, retryInMillis);
		}
		return result;
	}
	shutdown() {
		return this._transport.shutdown();
	}
}
function createRetryingTransport(options) {
	return new RetryingTransport(options.transport);
}

function createOtlpHttpExportDelegate(options, serializer) {
	return createOtlpExportDelegate({
		transport: createRetryingTransport({
			transport: createHttpExporterTransport(options),
		}),
		serializer: serializer,
		promiseHandler: createBoundedQueueExportPromiseHandler(options),
	}, { timeout: options.timeoutMillis });
}

function parseAndValidateTimeoutFromEnv(timeoutEnvVar) {
	const envTimeout = Deno.env.get(timeoutEnvVar)?.trim();
	if (envTimeout != null && envTimeout !== '') {
		const definedTimeout = Number(envTimeout);
		if (Number.isFinite(definedTimeout) && definedTimeout > 0) {
			return definedTimeout;
		}
		diag.warn(`Configuration: ${timeoutEnvVar} is invalid, expected number greater than 0 (actual: ${envTimeout})`);
	}
	return undefined;
}
function getTimeoutFromEnv(signalIdentifier) {
	const specificTimeout = parseAndValidateTimeoutFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_TIMEOUT`);
	const nonSpecificTimeout = parseAndValidateTimeoutFromEnv('OTEL_EXPORTER_OTLP_TIMEOUT');
	return specificTimeout ?? nonSpecificTimeout;
}
function parseAndValidateCompressionFromEnv(compressionEnvVar) {
	const compression = Deno.env.get(compressionEnvVar)?.trim();
	if (compression === '') {
		return undefined;
	}
	if (compression == null || compression === 'none' || compression === 'gzip') {
		return compression;
	}
	diag.warn(`Configuration: ${compressionEnvVar} is invalid, expected 'none' or 'gzip' (actual: '${compression}')`);
	return undefined;
}
function getCompressionFromEnv(signalIdentifier) {
	const specificCompression = parseAndValidateCompressionFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_COMPRESSION`);
	const nonSpecificCompression = parseAndValidateCompressionFromEnv('OTEL_EXPORTER_OTLP_COMPRESSION');
	return specificCompression ?? nonSpecificCompression;
}
function getSharedConfigurationFromEnvironment(signalIdentifier) {
	return {
		timeoutMillis: getTimeoutFromEnv(signalIdentifier),
		compression: getCompressionFromEnv(signalIdentifier),
	};
}

function validateAndNormalizeHeaders(partialHeaders) {
	return () => {
		const headers = {};
		Object.entries(partialHeaders?.() ?? {}).forEach(([key, value]) => {
			if (typeof value !== 'undefined') {
				headers[key] = String(value);
			}
			else {
				diag.warn(`Header "${key}" has invalid value (${value}) and will be ignored`);
			}
		});
		return headers;
	};
}

function mergeHeaders(userProvidedHeaders, fallbackHeaders, defaultHeaders) {
	const requiredHeaders = {
		...defaultHeaders(),
	};
	const headers = {};
	return () => {
		if (fallbackHeaders != null) {
			Object.assign(headers, fallbackHeaders());
		}
		if (userProvidedHeaders != null) {
			Object.assign(headers, userProvidedHeaders());
		}
		return Object.assign(headers, requiredHeaders);
	};
}
function validateUserProvidedUrl(url) {
	if (url == null) {
		return undefined;
	}
	try {
		new URL(url);
		return url;
	}
	catch (e) {
		throw new Error(`Configuration: Could not parse user-provided export URL: '${url}'`);
	}
}
function mergeOtlpHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
	return {
		...mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
		headers: mergeHeaders(validateAndNormalizeHeaders(userProvidedConfiguration.headers), fallbackConfiguration.headers, defaultConfiguration.headers),
		url: validateUserProvidedUrl(userProvidedConfiguration.url) ??
			fallbackConfiguration.url ??
			defaultConfiguration.url,
	};
}
function getHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
	return {
		...getSharedConfigurationDefaults(),
		headers: () => requiredHeaders,
		url: 'http://localhost:4318/' + signalResourcePath,
	};
}

function getStaticHeadersFromEnv(signalIdentifier) {
	const signalSpecificRawHeaders = Deno.env.get(`OTEL_EXPORTER_OTLP_${signalIdentifier}_HEADERS`)?.trim();
	const nonSignalSpecificRawHeaders = Deno.env.get('OTEL_EXPORTER_OTLP_HEADERS')?.trim();
	const signalSpecificHeaders = parseKeyPairsIntoRecord(signalSpecificRawHeaders);
	const nonSignalSpecificHeaders = parseKeyPairsIntoRecord(nonSignalSpecificRawHeaders);
	if (Object.keys(signalSpecificHeaders).length === 0 &&
		Object.keys(nonSignalSpecificHeaders).length === 0) {
		return undefined;
	}
	return Object.assign({}, parseKeyPairsIntoRecord(nonSignalSpecificRawHeaders), parseKeyPairsIntoRecord(signalSpecificRawHeaders));
}
function appendRootPathToUrlIfNeeded(url) {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.toString();
	}
	catch {
		diag.warn(`Configuration: Could not parse environment-provided export URL: '${url}', falling back to undefined`);
		return undefined;
	}
}
function appendResourcePathToUrl(url, path) {
	try {
		new URL(url);
	}
	catch {
		diag.warn(`Configuration: Could not parse environment-provided export URL: '${url}', falling back to undefined`);
		return undefined;
	}
	if (!url.endsWith('/')) {
		url = url + '/';
	}
	url += path;
	try {
		new URL(url);
	}
	catch {
		diag.warn(`Configuration: Provided URL appended with '${path}' is not a valid URL, using 'undefined' instead of '${url}'`);
		return undefined;
	}
	return url;
}
function getNonSpecificUrlFromEnv(signalResourcePath) {
	const envUrl = Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT')?.trim();
	if (envUrl == null || envUrl === '') {
		return undefined;
	}
	return appendResourcePathToUrl(envUrl, signalResourcePath);
}
function getSpecificUrlFromEnv(signalIdentifier) {
	const envUrl = Deno.env.get(`OTEL_EXPORTER_OTLP_${signalIdentifier}_ENDPOINT`)?.trim();
	if (envUrl == null || envUrl === '') {
		return undefined;
	}
	return appendRootPathToUrlIfNeeded(envUrl);
}
function getHttpConfigurationFromEnvironment(signalIdentifier, signalResourcePath) {
	return {
		...getSharedConfigurationFromEnvironment(signalIdentifier),
		url: getSpecificUrlFromEnv(signalIdentifier) ??
			getNonSpecificUrlFromEnv(signalResourcePath),
		headers: wrapStaticHeadersInFunction(getStaticHeadersFromEnv(signalIdentifier)),
	};
}

function convertLegacyHttpOptions(config, signalIdentifier, signalResourcePath, requiredHeaders) {
	if (config.metadata) {
		diag.warn('Metadata cannot be set when using http');
	}
	return mergeOtlpHttpConfigurationWithDefaults({
		url: config.url,
		headers: wrapStaticHeadersInFunction(config.headers),
		concurrencyLimit: config.concurrencyLimit,
		timeoutMillis: config.timeoutMillis,
		compression: config.compression,
	}, getHttpConfigurationFromEnvironment(signalIdentifier, signalResourcePath), getHttpConfigurationDefaults(requiredHeaders, signalResourcePath));
}

export { CompressionAlgorithm, OTLPExporterBase, OTLPExporterError, convertLegacyHttpOptions, createOtlpHttpExportDelegate, createOtlpNetworkExportDelegate, getSharedConfigurationDefaults, getSharedConfigurationFromEnvironment, mergeOtlpSharedConfigurationWithDefaults };
