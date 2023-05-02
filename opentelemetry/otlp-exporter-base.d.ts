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

import { BindOnceFuture, ExportResult } from './core.d.ts';

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
 * Interface for handling export service errors
 */
interface ExportServiceError {
	name: string;
	code: number;
	details: string;
	metadata: {
		[key: string]: unknown;
	};
	message: string;
	stack: string;
}
/**
 * Collector Exporter base config
 */
interface OTLPExporterConfigBase {
	headers?: Partial<Record<string, unknown>>;
	hostname?: string;
	url?: string;
	concurrencyLimit?: number;
	/** Maximum time the OTLP exporter will wait for each batch export.
	* The default value is 10000ms. */
	timeoutMillis?: number;
}

/**
 * Collector Exporter abstract base class
 */
declare abstract class OTLPExporterBase<T extends OTLPExporterConfigBase, ExportItem, ServiceRequest> {
	readonly url: string;
	readonly hostname: string | undefined;
	readonly timeoutMillis: number;
	protected _concurrencyLimit: number;
	protected _sendingPromises: Promise<unknown>[];
	protected _shutdownOnce: BindOnceFuture<void>;
	/**
	* @param config
	*/
	constructor(config?: T);
	/**
	* Export items.
	* @param items
	* @param resultCallback
	*/
	export(items: ExportItem[], resultCallback: (result: ExportResult) => void): void;
	private _export;
	/**
	* Shutdown the exporter.
	*/
	shutdown(): Promise<void>;
	/**
	* Called by _shutdownOnce with BindOnceFuture
	*/
	private _shutdown;
	abstract onShutdown(): void;
	abstract onInit(config: T): void;
	abstract send(items: ExportItem[], onSuccess: () => void, onError: (error: OTLPExporterError) => void): void;
	abstract getDefaultUrl(config: T): string;
	abstract convert(objects: ExportItem[]): ServiceRequest;
}

/**
 * Parses headers from config leaving only those that have defined values
 * @param partialHeaders
 */
declare function parseHeaders(partialHeaders?: Partial<Record<string, unknown>>): Record<string, string>;
/**
 * Adds path (version + signal) to a no per-signal endpoint
 * @param url
 * @param path
 * @returns url + path
 */
declare function appendResourcePathToUrl(url: string, path: string): string;
/**
 * Adds root path to signal specific endpoint when endpoint contains no path part and no root path
 * @param url
 * @returns url
 */
declare function appendRootPathToUrlIfNeeded(url: string): string;
/**
 * Configure exporter trace timeout value from passed in value or environment variables
 * @param timeoutMillis
 * @returns timeout value in milliseconds
 */
declare function configureExporterTimeout(timeoutMillis: number | undefined): number;
declare function invalidTimeout(timeout: number, defaultTimeout: number): number;

export { ExportServiceError, OTLPExporterBase, OTLPExporterConfigBase, OTLPExporterError, appendResourcePathToUrl, appendRootPathToUrlIfNeeded, configureExporterTimeout, invalidTimeout, parseHeaders };
