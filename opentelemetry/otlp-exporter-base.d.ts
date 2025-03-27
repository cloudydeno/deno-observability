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

import { ExportResult } from './core.d.ts';
import { ISerializer } from './otlp-transformer.d.ts';

interface ExportResponseSuccess {
	status: 'success';
	data?: Uint8Array;
}
interface ExportResponseFailure {
	status: 'failure';
	error: Error;
}
interface ExportResponseRetryable {
	status: 'retryable';
	retryInMillis?: number;
}
type ExportResponse = ExportResponseSuccess | ExportResponseFailure | ExportResponseRetryable;

interface IExporterTransport {
	send(data: Uint8Array, timeoutMillis: number): Promise<ExportResponse>;
	shutdown(): void;
}

/**
 * Internally shared export logic for OTLP.
 */
interface IOtlpExportDelegate<Internal> {
	export(internalRepresentation: Internal, resultCallback: (result: ExportResult) => void): void;
	forceFlush(): Promise<void>;
	shutdown(): Promise<void>;
}

declare class OTLPExporterBase<Internal> {
	private _delegate;
	constructor(_delegate: IOtlpExportDelegate<Internal>);
	/**
	* Export items.
	* @param items
	* @param resultCallback
	*/
	export(items: Internal, resultCallback: (result: ExportResult) => void): void;
	forceFlush(): Promise<void>;
	shutdown(): Promise<void>;
}

/**
 * Interface for handling error
 */
declare class OTLPExporterError extends Error {
	readonly code?: number;
	readonly name: string;
	readonly data?: string;
	constructor(message?: string, code?: number, data?: string);
}

/**
 * Configuration shared across all OTLP exporters
 *
 * Implementation note: anything added here MUST be
 * - platform-agnostic
 * - signal-agnostic
 * - transport-agnostic
 */
interface OtlpSharedConfiguration {
	timeoutMillis: number;
	concurrencyLimit: number;
	compression: 'gzip' | 'none';
}
/**
 * @param userProvidedConfiguration  Configuration options provided by the user in code.
 * @param fallbackConfiguration Fallback to use when the {@link userProvidedConfiguration} does not specify an option.
 * @param defaultConfiguration The defaults as defined by the exporter specification
 */
declare function mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration: Partial<OtlpSharedConfiguration>, fallbackConfiguration: Partial<OtlpSharedConfiguration>, defaultConfiguration: OtlpSharedConfiguration): OtlpSharedConfiguration;
declare function getSharedConfigurationDefaults(): OtlpSharedConfiguration;

interface OTLPExporterConfigBase {
	headers?: Record<string, string>;
	url?: string;
	concurrencyLimit?: number;
	/** Maximum time the OTLP exporter will wait for each batch export.
	* The default value is 10000ms. */
	timeoutMillis?: number;
}

/**
 * Collector Exporter node base config
 */
interface OTLPExporterNodeConfigBase extends OTLPExporterConfigBase {
	compression?: CompressionAlgorithm;
}
declare enum CompressionAlgorithm {
	NONE = "none",
	GZIP = "gzip"
}

declare function createOtlpNetworkExportDelegate<Internal, Response>(options: OtlpSharedConfiguration, serializer: ISerializer<Internal, Response>, transport: IExporterTransport): IOtlpExportDelegate<Internal>;

interface OtlpHttpConfiguration extends OtlpSharedConfiguration {
	url: string;
	headers: () => Record<string, string>;
}

declare function createOtlpHttpExportDelegate<Internal, Response>(options: OtlpHttpConfiguration, serializer: ISerializer<Internal, Response>): IOtlpExportDelegate<Internal>;

declare function getSharedConfigurationFromEnvironment(signalIdentifier: string): Partial<OtlpSharedConfiguration>;

/**
 * @deprecated this will be removed in 2.0
 * @param config
 * @param signalIdentifier
 * @param signalResourcePath
 * @param requiredHeaders
 */
declare function convertLegacyHttpOptions(config: OTLPExporterNodeConfigBase, signalIdentifier: string, signalResourcePath: string, requiredHeaders: Record<string, string>): OtlpHttpConfiguration;

export { CompressionAlgorithm, ExportResponse, ExportResponseFailure, ExportResponseRetryable, ExportResponseSuccess, IExporterTransport, IOtlpExportDelegate, OTLPExporterBase, OTLPExporterConfigBase, OTLPExporterError, OTLPExporterNodeConfigBase, OtlpSharedConfiguration, convertLegacyHttpOptions, createOtlpHttpExportDelegate, createOtlpNetworkExportDelegate, getSharedConfigurationDefaults, getSharedConfigurationFromEnvironment, mergeOtlpSharedConfigurationWithDefaults };
