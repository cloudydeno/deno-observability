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
/// <reference types="./instrumentation.d.ts" />

import { trace, metrics, diag } from './api.js';
import { logs } from './api-logs.js';
import * as shimmer from 'https://esm.sh/shimmer@1.2.1';

function enableInstrumentations(instrumentations, tracerProvider, meterProvider, loggerProvider) {
	for (let i = 0, j = instrumentations.length; i < j; i++) {
		const instrumentation = instrumentations[i];
		if (tracerProvider) {
			instrumentation.setTracerProvider(tracerProvider);
		}
		if (meterProvider) {
			instrumentation.setMeterProvider(meterProvider);
		}
		if (loggerProvider && instrumentation.setLoggerProvider) {
			instrumentation.setLoggerProvider(loggerProvider);
		}
		if (!instrumentation.getConfig().enabled) {
			instrumentation.enable();
		}
	}
}
function disableInstrumentations(instrumentations) {
	instrumentations.forEach(instrumentation => instrumentation.disable());
}

function registerInstrumentations(options) {
	const tracerProvider = options.tracerProvider || trace.getTracerProvider();
	const meterProvider = options.meterProvider || metrics.getMeterProvider();
	const loggerProvider = options.loggerProvider || logs.getLoggerProvider();
	const instrumentations = options.instrumentations?.flat() ?? [];
	enableInstrumentations(instrumentations, tracerProvider, meterProvider, loggerProvider);
	return () => {
		disableInstrumentations(instrumentations);
	};
}

class InstrumentationAbstract {
	instrumentationName;
	instrumentationVersion;
	_config = {};
	_tracer;
	_meter;
	_logger;
	_diag;
	constructor(instrumentationName, instrumentationVersion, config) {
		this.instrumentationName = instrumentationName;
		this.instrumentationVersion = instrumentationVersion;
		this.setConfig(config);
		this._diag = diag.createComponentLogger({
			namespace: instrumentationName,
		});
		this._tracer = trace.getTracer(instrumentationName, instrumentationVersion);
		this._meter = metrics.getMeter(instrumentationName, instrumentationVersion);
		this._logger = logs.getLogger(instrumentationName, instrumentationVersion);
		this._updateMetricInstruments();
	}
	_wrap = shimmer.wrap;
	_unwrap = shimmer.unwrap;
	_massWrap = shimmer.massWrap;
	_massUnwrap = shimmer.massUnwrap;
	get meter() {
		return this._meter;
	}
	setMeterProvider(meterProvider) {
		this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
		this._updateMetricInstruments();
	}
	get logger() {
		return this._logger;
	}
	setLoggerProvider(loggerProvider) {
		this._logger = loggerProvider.getLogger(this.instrumentationName, this.instrumentationVersion);
	}
	getModuleDefinitions() {
		const initResult = this.init() ?? [];
		if (!Array.isArray(initResult)) {
			return [initResult];
		}
		return initResult;
	}
	_updateMetricInstruments() {
		return;
	}
	getConfig() {
		return this._config;
	}
	setConfig(config) {
		this._config = {
			enabled: true,
			...config,
		};
	}
	setTracerProvider(tracerProvider) {
		this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
	}
	get tracer() {
		return this._tracer;
	}
	_runSpanCustomizationHook(hookHandler, triggerName, span, info) {
		if (!hookHandler) {
			return;
		}
		try {
			hookHandler(span, info);
		}
		catch (e) {
			this._diag.error(`Error running span customization hook due to exception in handler`, { triggerName }, e);
		}
	}
}

class InstrumentationBase extends InstrumentationAbstract {
	constructor(instrumentationName, instrumentationVersion, config) {
		super(instrumentationName, instrumentationVersion, config);
		if (this._config.enabled) {
			this.enable();
		}
	}
}

function normalize(path) {
	diag.warn('Path normalization is not implemented for this platform. To silence this warning, ensure no node-specific instrumentations are loaded, and node-specific types (e.g. InstrumentationNodeModuleFile), are not used in a browser context)');
	return path;
}

class InstrumentationNodeModuleDefinition {
	name;
	supportedVersions;
	patch;
	unpatch;
	files;
	constructor(name, supportedVersions,
	patch,
	unpatch, files) {
		this.name = name;
		this.supportedVersions = supportedVersions;
		this.patch = patch;
		this.unpatch = unpatch;
		this.files = files || [];
	}
}

class InstrumentationNodeModuleFile {
	supportedVersions;
	patch;
	unpatch;
	name;
	constructor(name, supportedVersions,
	patch,
	unpatch) {
		this.supportedVersions = supportedVersions;
		this.patch = patch;
		this.unpatch = unpatch;
		this.name = normalize(name);
	}
}

function safeExecuteInTheMiddle(execute, onFinish, preventThrowingError) {
	let error;
	let result;
	try {
		result = execute();
	}
	catch (e) {
		error = e;
	}
	finally {
		onFinish(error, result);
		if (error && !preventThrowingError) {
			throw error;
		}
		return result;
	}
}
async function safeExecuteInTheMiddleAsync(execute, onFinish, preventThrowingError) {
	let error;
	let result;
	try {
		result = await execute();
	}
	catch (e) {
		error = e;
	}
	finally {
		onFinish(error, result);
		if (error && !preventThrowingError) {
			throw error;
		}
		return result;
	}
}
function isWrapped(func) {
	return (typeof func === 'function' &&
		typeof func.__original === 'function' &&
		typeof func.__unwrap === 'function' &&
		func.__wrapped === true);
}

export { InstrumentationBase, InstrumentationNodeModuleDefinition, InstrumentationNodeModuleFile, isWrapped, registerInstrumentations, safeExecuteInTheMiddle, safeExecuteInTheMiddleAsync };
