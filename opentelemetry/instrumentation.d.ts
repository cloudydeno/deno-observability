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

import { TracerProvider, MeterProvider, DiagLogger, Meter, Tracer } from './api.d.ts';
import { LoggerProvider, Logger } from './api-logs.d.ts';

/** Interface Instrumentation to apply patch. */
interface Instrumentation {
	/** Instrumentation Name  */
	instrumentationName: string;
	/** Instrumentation Version  */
	instrumentationVersion: string;
	/**
	* Instrumentation Description - please describe all useful information
	* as Instrumentation might patch different version of different modules,
	* or support different browsers etc.
	*/
	instrumentationDescription?: string;
	/** Method to disable the instrumentation  */
	disable(): void;
	/** Method to enable the instrumentation  */
	enable(): void;
	/** Method to set tracer provider  */
	setTracerProvider(tracerProvider: TracerProvider): void;
	/** Method to set meter provider  */
	setMeterProvider(meterProvider: MeterProvider): void;
	/** Method to set logger provider  */
	setLoggerProvider?(loggerProvider: LoggerProvider): void;
	/** Method to set instrumentation config  */
	setConfig(config: InstrumentationConfig): void;
	/** Method to get instrumentation config  */
	getConfig(): InstrumentationConfig;
	/**
	* Contains all supported versions.
	* All versions must be compatible with [semver](https://semver.org/spec/v2.0.0.html) format.
	* If the version is not supported, we won't apply instrumentation patch (see `enable` method).
	* If omitted, all versions of the module will be patched.
	*/
	supportedVersions?: string[];
}
interface InstrumentationConfig {
	/**
	* Whether to enable the plugin.
	* @default true
	*/
	enabled?: boolean;
}
/**
 * This interface defines the params that are be added to the wrapped function
 * using the "shimmer.wrap"
 */
interface ShimWrapped extends Function {
	__wrapped: boolean;
	__unwrap: Function;
	__original: Function;
}
interface InstrumentationModuleFile {
	/** Name of file to be patched with relative path */
	name: string;
	moduleExports?: unknown;
	/** Supported version this file */
	supportedVersions: string[];
	/** Method to patch the instrumentation  */
	patch(moduleExports: unknown, moduleVersion?: string): unknown;
	/** Method to patch the instrumentation  */
	/** Method to unpatch the instrumentation  */
	unpatch(moduleExports?: unknown, moduleVersion?: string): void;
}
interface InstrumentationModuleDefinition {
	/** Module name or path  */
	name: string;
	moduleExports?: any;
	/** Instrumented module version */
	moduleVersion?: string;
	/** Supported version of module  */
	supportedVersions: string[];
	/** Module internal files to be patched  */
	files: InstrumentationModuleFile[];
	/** If set to true, the includePrerelease check will be included when calling semver.satisfies */
	includePrerelease?: boolean;
	/** Method to patch the instrumentation  */
	patch?: (moduleExports: any, moduleVersion?: string) => any;
	/** Method to unpatch the instrumentation  */
	unpatch?: (moduleExports: any, moduleVersion?: string) => void;
}

/**
 * Base abstract internal class for instrumenting node and web plugins
 */
declare abstract class InstrumentationAbstract implements Instrumentation {
	readonly instrumentationName: string;
	readonly instrumentationVersion: string;
	protected _config: InstrumentationConfig;
	private _tracer;
	private _meter;
	private _logger;
	protected _diag: DiagLogger;
	constructor(instrumentationName: string, instrumentationVersion: string, config?: InstrumentationConfig);
	protected _wrap: <Nodule extends object, FieldName extends keyof Nodule>(nodule: Nodule, name: FieldName, wrapper: (original: Nodule[FieldName]) => Nodule[FieldName]) => void;
	protected _unwrap: <Nodule extends object>(nodule: Nodule, name: keyof Nodule) => void;
	protected _massWrap: <Nodule extends object, FieldName extends keyof Nodule>(nodules: Nodule[], names: FieldName[], wrapper: (original: Nodule[FieldName]) => Nodule[FieldName]) => void;
	protected _massUnwrap: <Nodule extends object>(nodules: Nodule[], names: (keyof Nodule)[]) => void;
	protected get meter(): Meter;
	/**
	* Sets MeterProvider to this plugin
	* @param meterProvider
	*/
	setMeterProvider(meterProvider: MeterProvider): void;
	protected get logger(): Logger;
	/**
	* Sets LoggerProvider to this plugin
	* @param loggerProvider
	*/
	setLoggerProvider(loggerProvider: LoggerProvider): void;
	/**
	* @experimental
	*
	* Get module definitions defined by {@link init}.
	* This can be used for experimental compile-time instrumentation.
	*
	* @returns an array of {@link InstrumentationModuleDefinition}
	*/
	getModuleDefinitions(): InstrumentationModuleDefinition[];
	/**
	* Sets the new metric instruments with the current Meter.
	*/
	protected _updateMetricInstruments(): void;
	getConfig(): InstrumentationConfig;
	/**
	* Sets InstrumentationConfig to this plugin
	* @param InstrumentationConfig
	*/
	setConfig(config?: InstrumentationConfig): void;
	/**
	* Sets TraceProvider to this plugin
	* @param tracerProvider
	*/
	setTracerProvider(tracerProvider: TracerProvider): void;
	protected get tracer(): Tracer;
	abstract enable(): void;
	abstract disable(): void;
	/**
	* Init method in which plugin should define _modules and patches for
	* methods.
	*/
	protected abstract init(): InstrumentationModuleDefinition | InstrumentationModuleDefinition[] | void;
}

/**
 * Base abstract class for instrumenting web plugins
 */
declare abstract class InstrumentationBase extends InstrumentationAbstract implements Instrumentation {
	constructor(instrumentationName: string, instrumentationVersion: string, config?: InstrumentationConfig);
}

declare type InstrumentationOption = typeof InstrumentationBase | (typeof InstrumentationBase)[] | Instrumentation | Instrumentation[];
interface AutoLoaderResult {
	instrumentations: Instrumentation[];
}
interface AutoLoaderOptions {
	instrumentations?: InstrumentationOption[];
	tracerProvider?: TracerProvider;
	meterProvider?: MeterProvider;
	loggerProvider?: LoggerProvider;
}

/**
 * It will register instrumentations and plugins
 * @param options
 * @return returns function to unload instrumentation and plugins that were
 *   registered
 */
declare function registerInstrumentations(options: AutoLoaderOptions): () => void;

declare class InstrumentationNodeModuleDefinition implements InstrumentationModuleDefinition {
	name: string;
	supportedVersions: string[];
	patch?: ((exports: any, moduleVersion?: string | undefined) => any) | undefined;
	unpatch?: ((exports: any, moduleVersion?: string | undefined) => void) | undefined;
	files: InstrumentationModuleFile[];
	constructor(name: string, supportedVersions: string[], patch?: ((exports: any, moduleVersion?: string | undefined) => any) | undefined, unpatch?: ((exports: any, moduleVersion?: string | undefined) => void) | undefined, files?: InstrumentationModuleFile[]);
}

declare class InstrumentationNodeModuleFile implements InstrumentationModuleFile {
	supportedVersions: string[];
	patch: (moduleExports: any, moduleVersion?: string) => any;
	unpatch: (moduleExports?: any, moduleVersion?: string) => void;
	name: string;
	constructor(name: string, supportedVersions: string[], patch: (moduleExports: any, moduleVersion?: string) => any, unpatch: (moduleExports?: any, moduleVersion?: string) => void);
}

/**
 * function to execute patched function and being able to catch errors
 * @param execute - function to be executed
 * @param onFinish - callback to run when execute finishes
 */
declare function safeExecuteInTheMiddle<T>(execute: () => T, onFinish: (e: Error | undefined, result: T | undefined) => void, preventThrowingError?: boolean): T;
/**
 * Async function to execute patched function and being able to catch errors
 * @param execute - function to be executed
 * @param onFinish - callback to run when execute finishes
 */
declare function safeExecuteInTheMiddleAsync<T>(execute: () => T, onFinish: (e: Error | undefined, result: T | undefined) => void, preventThrowingError?: boolean): Promise<T>;
/**
 * Checks if certain function has been already wrapped
 * @param func
 */
declare function isWrapped(func: unknown): func is ShimWrapped;

export { AutoLoaderOptions, AutoLoaderResult, Instrumentation, InstrumentationBase, InstrumentationConfig, InstrumentationModuleDefinition, InstrumentationModuleFile, InstrumentationNodeModuleDefinition, InstrumentationNodeModuleFile, InstrumentationOption, ShimWrapped, isWrapped, registerInstrumentations, safeExecuteInTheMiddle, safeExecuteInTheMiddleAsync };
