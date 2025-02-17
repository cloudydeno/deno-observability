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

import { ReadableLogRecord } from './sdk-logs.d.ts';
import { ResourceMetrics } from './sdk-metrics.d.ts';
import { ReadableSpan } from './sdk-trace-base.d.ts';

interface IExportMetricsServiceResponse {
	/** ExportMetricsServiceResponse partialSuccess */
	partialSuccess?: IExportMetricsPartialSuccess;
}
interface IExportMetricsPartialSuccess {
	/** ExportMetricsPartialSuccess rejectedDataPoints */
	rejectedDataPoints?: number;
	/** ExportMetricsPartialSuccess errorMessage */
	errorMessage?: string;
}

interface IExportTraceServiceResponse {
	/** ExportTraceServiceResponse partialSuccess */
	partialSuccess?: IExportTracePartialSuccess;
}
interface IExportTracePartialSuccess {
	/** ExportLogsServiceResponse rejectedLogRecords */
	rejectedSpans?: number;
	/** ExportLogsServiceResponse errorMessage */
	errorMessage?: string;
}

interface IExportLogsServiceResponse {
	/** ExportLogsServiceResponse partialSuccess */
	partialSuccess?: IExportLogsPartialSuccess;
}
interface IExportLogsPartialSuccess {
	/** ExportLogsPartialSuccess rejectedLogRecords */
	rejectedLogRecords?: number;
	/** ExportLogsPartialSuccess errorMessage */
	errorMessage?: string;
}

/**
 * Serializes and deserializes the OTLP request/response to and from {@link Uint8Array}
 */
interface ISerializer<Request, Response> {
	serializeRequest(request: Request): Uint8Array | undefined;
	deserializeResponse(data: Uint8Array): Response;
}

declare const ProtobufLogsSerializer: ISerializer<any, any>;

declare const ProtobufMetricsSerializer: ISerializer<any, any>;

declare const ProtobufTraceSerializer: ISerializer<any, any>;

declare const JsonLogsSerializer: ISerializer<ReadableLogRecord[], IExportLogsServiceResponse>;

declare const JsonMetricsSerializer: ISerializer<ResourceMetrics, IExportMetricsServiceResponse>;

declare const JsonTraceSerializer: ISerializer<ReadableSpan[], IExportTraceServiceResponse>;

export { IExportLogsPartialSuccess, IExportLogsServiceResponse, IExportMetricsPartialSuccess, IExportMetricsServiceResponse, IExportTracePartialSuccess, IExportTraceServiceResponse, ISerializer, JsonLogsSerializer, JsonMetricsSerializer, JsonTraceSerializer, ProtobufLogsSerializer, ProtobufMetricsSerializer, ProtobufTraceSerializer };
