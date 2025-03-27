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

import { TracerProvider, MeterProvider, Span, DiagLogger, Meter, Tracer } from './api.d.ts';
import { LoggerProvider, Logger } from './api-logs.d.ts';

/** Interface Instrumentation to apply patch. */
interface Instrumentation<ConfigType extends InstrumentationConfig = InstrumentationConfig> {
	/** Instrumentation Name  */
	instrumentationName: string;
	/** Instrumentation Version  */
	instrumentationVersion: string;
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
	setConfig(config: ConfigType): void;
	/** Method to get instrumentation config  */
	getConfig(): ConfigType;
}
/**
 * Base interface for configuration options common to all instrumentations.
 * This interface can be extended by individual instrumentations to include
 * additional configuration options specific to that instrumentation.
 * All configuration options must be optional.
 */
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
	/** Supported versions for the file.
	*
	* A module version is supported if one of the supportedVersions in the array satisfies the module version.
	* The syntax of the version is checked with a function compatible
	* with [node-semver's `satisfies()` function](https://github.com/npm/node-semver#ranges-1).
	* If the version is not supported, we won't apply instrumentation patch.
	* If omitted, all versions of the module will be patched.
	*
	* It is recommended to always specify a range that is bound to a major version, to avoid breaking changes.
	* New major versions should be reviewed and tested before being added to the supportedVersions array.
	*
	* Example: ['>=1.2.3 <3']
	*/
	supportedVersions: string[];
	/** Method to patch the instrumentation  */
	patch(moduleExports: unknown, moduleVersion?: string): unknown;
	/** Method to unpatch the instrumentation  */
	unpatch(moduleExports?: unknown, moduleVersion?: string): void;
}
interface InstrumentationModuleDefinition {
	/** Module name or path  */
	name: string;
	moduleExports?: any;
	/** Instrumented module version */
	moduleVersion?: string;
	/** Supported version of module.
	*
	* A module version is supported if one of the supportedVersions in the array satisfies the module version.
	* The syntax of the version is checked with the `satisfies` function of
	* "The [semantic versioner](https://semver.org) for npm".
	* If the version is not supported, we won't apply instrumentation patch (see `enable` method).
	* If omitted, all versions of the module will be patched.
	*
	* It is recommended to always specify a range that is bound to a major version, to avoid breaking changes.
	* New major versions should be reviewed and tested before being added to the supportedVersions array.
	*
	* Example: ['>=1.2.3 <3']
	*/
	supportedVersions: string[];
	/** Module internal files to be patched  */
	files: InstrumentationModuleFile[];
	/** If set to true, the includePrerelease check will be included when calling semver.satisfies */
	includePrerelease?: boolean;
	/** Method to patch the instrumentation  */
	patch?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
	((moduleExports: any, moduleVersion?: string | undefined) => any) | undefined;
	/** Method to unpatch the instrumentation  */
	unpatch?: ((moduleExports: any, moduleVersion?: string | undefined) => void) | undefined;
}
/**
 * SpanCustomizationHook is a common way for instrumentations to expose extension points
 * where users can add custom behavior to a span based on info object passed to the hook at different times of the span lifecycle.
 * This is an advanced feature, commonly used to add additional or non-spec-compliant attributes to the span,
 * capture payloads, modify the span in some way, or carry some other side effect.
 *
 * The hook is registered with the instrumentation specific config by implementing an handler function with this signature,
 * and if the hook is present, it will be called with the span and the event information
 * when the event is emitted.
 *
 * When and under what conditions the hook is called and what data is passed
 * in the info argument, is specific to each instrumentation and life-cycle event
 * and should be documented where it is used.
 *
 * Instrumentation may define multiple hooks, for different spans, or different span life-cycle events.
 */
type SpanCustomizationHook<SpanCustomizationInfoType> = (span: Span, info: SpanCustomizationInfoType) => void;

interface AutoLoaderResult {
	instrumentations: Instrumentation[];
}
interface AutoLoaderOptions {
	instrumentations?: (Instrumentation | Instrumentation[])[];
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

/**
 * Base abstract internal class for instrumenting node and web plugins
 */
declare abstract class InstrumentationAbstract<ConfigType extends InstrumentationConfig = InstrumentationConfig> implements Instrumentation<ConfigType> {
	readonly instrumentationName: string;
	readonly instrumentationVersion: string;
	protected _config: ConfigType;
	private _tracer;
	private _meter;
	private _logger;
	protected _diag: DiagLogger;
	constructor(instrumentationName: string, instrumentationVersion: string, config: ConfigType);
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
	getConfig(): ConfigType;
	/**
	* Sets InstrumentationConfig to this plugin
	* @param config
	*/
	setConfig(config: ConfigType): void;
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
	/**
	* Execute span customization hook, if configured, and log any errors.
	* Any semantics of the trigger and info are defined by the specific instrumentation.
	* @param hookHandler The optional hook handler which the user has configured via instrumentation config
	* @param triggerName The name of the trigger for executing the hook for logging purposes
	* @param span The span to which the hook should be applied
	* @param info The info object to be passed to the hook, with useful data the hook may use
	*/
	protected _runSpanCustomizationHook<SpanCustomizationInfoType>(hookHandler: SpanCustomizationHook<SpanCustomizationInfoType> | undefined, triggerName: string, span: Span, info: SpanCustomizationInfoType): void;
}

/**
 * Base abstract class for instrumenting web plugins
 */
declare abstract class InstrumentationBase<ConfigType extends InstrumentationConfig = InstrumentationConfig> extends InstrumentationAbstract<ConfigType> implements Instrumentation<ConfigType> {
	constructor(instrumentationName: string, instrumentationVersion: string, config: ConfigType);
}

declare class InstrumentationNodeModuleDefinition implements InstrumentationModuleDefinition {
	name: string;
	supportedVersions: string[];
	patch?: ((exports: any, moduleVersion?: string) => any) | undefined;
	unpatch?: ((exports: any, moduleVersion?: string) => void) | undefined;
	files: InstrumentationModuleFile[];
	constructor(name: string, supportedVersions: string[], patch?: ((exports: any, moduleVersion?: string) => any) | undefined, unpatch?: ((exports: any, moduleVersion?: string) => void) | undefined, files?: InstrumentationModuleFile[]);
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

export { AutoLoaderOptions, AutoLoaderResult, Instrumentation, InstrumentationBase, InstrumentationConfig, InstrumentationModuleDefinition, InstrumentationModuleFile, InstrumentationNodeModuleDefinition, InstrumentationNodeModuleFile, ShimWrapped, SpanCustomizationHook, isWrapped, registerInstrumentations, safeExecuteInTheMiddle, safeExecuteInTheMiddleAsync };
