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
import * as shimmer from 'https://esm.sh/shimmer';

function parseInstrumentationOptions(options = []) {
	let instrumentations = [];
	for (let i = 0, j = options.length; i < j; i++) {
		const option = options[i];
		if (Array.isArray(option)) {
			const results = parseInstrumentationOptions(option);
			instrumentations = instrumentations.concat(results.instrumentations);
		}
		else if (typeof option === 'function') {
			instrumentations.push(new option());
		}
		else if (option.instrumentationName) {
			instrumentations.push(option);
		}
	}
	return { instrumentations };
}
function enableInstrumentations(instrumentations, tracerProvider, meterProvider) {
	for (let i = 0, j = instrumentations.length; i < j; i++) {
		const instrumentation = instrumentations[i];
		if (tracerProvider) {
			instrumentation.setTracerProvider(tracerProvider);
		}
		if (meterProvider) {
			instrumentation.setMeterProvider(meterProvider);
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
	const { instrumentations } = parseInstrumentationOptions(options.instrumentations);
	const tracerProvider = options.tracerProvider || trace.getTracerProvider();
	const meterProvider = options.meterProvider || metrics.getMeterProvider();
	enableInstrumentations(instrumentations, tracerProvider, meterProvider);
	return () => {
		disableInstrumentations(instrumentations);
	};
}

class InstrumentationAbstract {
	constructor(instrumentationName, instrumentationVersion, config = {}) {
		this.instrumentationName = instrumentationName;
		this.instrumentationVersion = instrumentationVersion;
		this._wrap = shimmer.wrap;
		this._unwrap = shimmer.unwrap;
		this._massWrap = shimmer.massWrap;
		this._massUnwrap = shimmer.massUnwrap;
		this._config = {
			enabled: true,
			...config,
		};
		this._diag = diag.createComponentLogger({
			namespace: instrumentationName,
		});
		this._tracer = trace.getTracer(instrumentationName, instrumentationVersion);
		this._meter = metrics.getMeter(instrumentationName, instrumentationVersion);
		this._updateMetricInstruments();
	}
	get meter() {
		return this._meter;
	}
	setMeterProvider(meterProvider) {
		this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
		this._updateMetricInstruments();
	}
	_updateMetricInstruments() {
		return;
	}
	getConfig() {
		return this._config;
	}
	setConfig(config = {}) {
		this._config = Object.assign({}, config);
	}
	setTracerProvider(tracerProvider) {
		this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
	}
	get tracer() {
		return this._tracer;
	}
}

class InstrumentationBase extends InstrumentationAbstract {
	constructor(instrumentationName, instrumentationVersion, config = {}) {
		super(instrumentationName, instrumentationVersion, config);
		if (this._config.enabled) {
			this.enable();
		}
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

export { InstrumentationBase, isWrapped, registerInstrumentations, safeExecuteInTheMiddle, safeExecuteInTheMiddleAsync };
