// https://github.com/DataDog/dd-opentelemetry-exporter-js/blob/master/src/datadogPropagator.ts

/*
 * Unless explicitly stated otherwise all files in this repository are licensed
 * under the Apache 2.0 license (see LICENSE).
 * This product includes software developed at Datadog (https://www.datadoghq.com/).
 * Copyright 2020 Datadog, Inc.
 */

// import {
//   Context,
//   trace,
//   isSpanContextValid,
//   TextMapGetter,
//   TextMapPropagator,
//   TextMapSetter,
//   TraceFlags,
//   SpanContext,
// } from 'npm:@opentelemetry/api';
// import { TraceState } from 'npm:@opentelemetry/core';

import {
  Context,
  trace,
  isSpanContextValid,
  TextMapGetter,
  TextMapPropagator,
  TextMapSetter,
  TraceFlags,
  SpanContext,
} from "../api.ts";
import { TraceState } from "https://esm.sh/@opentelemetry/core@1.9.1";

const VALID_TRACEID_REGEX = /^([0-9a-f]{16}){1,2}$/i;
const VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
const INVALID_ID_REGEX = /^0+$/i;

function isValidTraceId(traceId: string): boolean {
  return VALID_TRACEID_REGEX.test(traceId) && !INVALID_ID_REGEX.test(traceId);
}

function isValidSpanId(spanId: string): boolean {
  return VALID_SPANID_REGEX.test(spanId) && !INVALID_ID_REGEX.test(spanId);
}

/**
 * Propagator for the Datadog HTTP header format.
 * Based on: https://github.com/DataDog/dd-trace-js/blob/master/packages/dd-trace/src/opentracing/propagation/text_map.js
 */
export class DatadogPropagator implements TextMapPropagator {
  inject(context: Context, carrier: unknown, setter: TextMapSetter): void {
    const spanContext = trace.getSpanContext(context);

    if (!spanContext || !isSpanContextValid(spanContext)) return;

    if (
      isValidTraceId(spanContext.traceId) &&
      isValidSpanId(spanContext.spanId)
    ) {
      const ddTraceId = id(spanContext.traceId).toString(10);
      const ddSpanId = id(spanContext.spanId).toString(10);

      setter.set(carrier, DatadogPropagationDefaults.X_DD_TRACE_ID, ddTraceId);
      setter.set(carrier, DatadogPropagationDefaults.X_DD_PARENT_ID, ddSpanId);

      // Current Otel-DD exporter behavior in other languages is to set to zero if falsey
      setter.set(
        carrier,
        DatadogPropagationDefaults.X_DD_SAMPLING_PRIORITY,
        (TraceFlags.SAMPLED & spanContext.traceFlags) === TraceFlags.SAMPLED
          ? '1'
          : '0'
      );

      // Current Otel-DD exporter behavior in other languages is to only set origin tag
      // if it exists, otherwise don't set header
      if (
        spanContext.traceState !== undefined &&
        spanContext.traceState.get(DatadogDefaults.OT_ALLOWED_DD_ORIGIN)
      ) {
        const originString: string =
          spanContext.traceState.get(DatadogDefaults.OT_ALLOWED_DD_ORIGIN) ||
          '';

        setter.set(
          carrier,
          DatadogPropagationDefaults.X_DD_ORIGIN,
          originString
        );
      }
    }
  }

  extract(context: Context, carrier: unknown, getter: TextMapGetter): Context {
    const traceIdHeader = getter.get(
      carrier,
      DatadogPropagationDefaults.X_DD_TRACE_ID
    );
    const spanIdHeader = getter.get(
      carrier,
      DatadogPropagationDefaults.X_DD_PARENT_ID
    );
    const sampledHeader = getter.get(
      carrier,
      DatadogPropagationDefaults.X_DD_SAMPLING_PRIORITY
    );
    const originHeader = getter.get(
      carrier,
      DatadogPropagationDefaults.X_DD_ORIGIN
    );

    // I suppose header formats can format these as arrays
    // keeping this from b3propagator
    const traceIdHeaderValue = Array.isArray(traceIdHeader)
      ? traceIdHeader[0]
      : traceIdHeader;
    const spanIdHeaderValue = Array.isArray(spanIdHeader)
      ? spanIdHeader[0]
      : spanIdHeader;

    const sampled = Array.isArray(sampledHeader)
      ? sampledHeader[0]
      : sampledHeader;

    const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;

    // check if we've extracted a trace and span
    if (!traceIdHeaderValue || !spanIdHeaderValue) {
      return context;
    }

    // TODO: is this accurate?
    const traceId = '0000000000000000'+id(traceIdHeaderValue, 10).toString();
    const spanId = id(spanIdHeaderValue, 10).toString();

    if (isValidTraceId(traceId) && isValidSpanId(spanId)) {
      const contextOptions: SpanContext = {
        traceId: traceId,
        spanId: spanId,
        isRemote: true,
        traceFlags: isNaN(Number(sampled)) ? TraceFlags.NONE : Number(sampled),
      };

      if (origin) {
        contextOptions[DatadogDefaults.TRACE_STATE] = new TraceState(
          `${DatadogDefaults.OT_ALLOWED_DD_ORIGIN}=${origin}`
        );
      }
      return trace.setSpanContext(context, contextOptions);
    }
    return context;
  }

  fields(): string[] {
    return [];
  }
}



enum DatadogDefaults {
  /** The datadog formatted origin tag */
  DD_ORIGIN = '_dd_origin',
  /** The otel compliant formatted origin tag */
  OT_ALLOWED_DD_ORIGIN = 'dd_origin',
  /** The otel tracestate key */
  TRACE_STATE = 'traceState',
  /** The datadog formatted sample rate key */
  SAMPLE_RATE_METRIC_KEY = '_sample_rate',
  /** The otel attribute for error type */
  ERR_NAME_SUBSTRING = '.error_name',
  /** The datadog env tag */
  ENV_KEY = 'env',
  /** The datadog version tag */
  VERSION_KEY = 'version',
  /** The datadog error tag name */
  ERROR_TAG = 'error',
  /** A datadog error tag's value */
  ERROR = 1,
  /** The datadog error type tag name */
  ERROR_TYPE_TAG = 'error.type',
  /** A datadog error type's default value */
  ERROR_TYPE_DEFAULT_VALUE = 'ERROR',
  /** The datadog error message tag name */
  ERROR_MSG_TAG = 'error.msg',
  /** The datadog span kind tag name */
  SPAN_KIND = 'span.kind',
  /** The datadog span type tag name */
  SPAN_TYPE = 'span.type',
  /** The datadog resource tag name */
  RESOURCE_TAG = 'resource.name',
  /** The datadog service tag name */
  SERVICE_TAG = 'service.name',
  /** The datadog span kind client name */
  CLIENT = 'client',
  /** The datadog span kind server name */
  SERVER = 'server',
  /** The datadog span kind consumer name */
  PRODUCER = 'worker',
  /** The datadog span kind consumer name */
  CONSUMER = 'worker',
  /** The datadog span kind internal name */
  INTERNAL = 'internal',
  /** The otel traceId name */
  TRACE_ID = 'traceId',
  /** The otel spanId name */
  SPAN_ID = 'spanId',
  /** The otel http method attribute name */
  HTTP_METHOD = 'http.method',
  /** The otel http target attribute name */
  HTTP_TARGET = 'http.target',
}

enum DatadogPropagationDefaults {
  /** The default datadog trace id header*/
  X_DD_TRACE_ID = 'x-datadog-trace-id',
  /** The default datadog parent span id header*/
  X_DD_PARENT_ID = 'x-datadog-parent-id',
  /** The default datadog sampling priority header*/
  X_DD_SAMPLING_PRIORITY = 'x-datadog-sampling-priority',
  /** The default datadog origin header*/
  X_DD_ORIGIN = 'x-datadog-origin',
}



const UINT_MAX = 4294967296

const data = new Uint8Array(8 * 8192)
const zeroId = new Uint8Array(8)

const pad = (byte: number) => `${byte < 16 ? '0' : ''}${byte.toString(16)}`

let batch = 0

// Internal representation of a trace or span ID.
class Identifier {
  private _isUint64BE: boolean;
  private _buffer: Uint8Array;
  constructor (value?: string, radix = 16) {
    this._isUint64BE = true // msgpack-lite compatibility
    this._buffer = radix === 16
      ? createBuffer(value)
      : fromString(value ?? '', radix)
  }

  toString (radix = 16) {
    return radix === 16
      ? toHexString(this._buffer)
      : toNumberString(this._buffer, radix)
  }

  toBuffer () {
    return this._buffer
  }

  // msgpack-lite compatibility
  toArray () {
    if (this._buffer.length === 8) {
      return this._buffer
    }
    return this._buffer.slice(-8)
  }

  toJSON () {
    return this.toString()
  }
}

// Create a buffer, using an optional hexadecimal value if provided.
function createBuffer (value?: string) {
  if (value === '0') return zeroId
  if (!value) return pseudoRandom()

  const size = Math.ceil(value.length / 16) * 16
  const bytes = size / 2
  const buffer = new Uint8Array(bytes)

  value = value.padStart(size, '0')

  for (let i = 0; i < bytes; i++) {
    buffer[i] = parseInt(value.substring(i * 2, i * 2 + 2), 16)
  }

  return buffer
}

// Convert a numerical string to a buffer using the specified radix.
function fromString (str: string, raddix: number) {
  const buffer = new Uint8Array(8)
  const len = str.length

  let pos = 0
  let high = 0
  let low = 0

  if (str[0] === '-') pos++

  const sign = pos

  while (pos < len) {
    const chr = parseInt(str[pos++], raddix)

    if (!(chr >= 0)) break // NaN

    low = low * raddix + chr
    high = high * raddix + Math.floor(low / UINT_MAX)
    low %= UINT_MAX
  }

  if (sign) {
    high = ~high

    if (low) {
      low = UINT_MAX - low
    } else {
      high++
    }
  }

  writeUInt32BE(buffer, high, 0)
  writeUInt32BE(buffer, low, 4)

  return buffer
}

// Convert a buffer to a numerical string.
function toNumberString (buffer: Uint8Array, radix: number) {
  let high = readInt32(buffer, buffer.length - 8)
  let low = readInt32(buffer, buffer.length - 4)
  let str = ''

  radix = radix || 10

  while (1) {
    const mod = (high % radix) * UINT_MAX + low

    high = Math.floor(high / radix)
    low = Math.floor(mod / radix)
    str = (mod % radix).toString(radix) + str

    if (!high && !low) break
  }

  return str
}

// Convert a buffer to a hexadecimal string.
function toHexString (buffer: Uint8Array) {
  return [...buffer].map(pad).join('')
}

// Simple pseudo-random 64-bit ID generator.
function pseudoRandom () {
  if (batch === 0) {
    crypto.getRandomValues(data)
  }

  batch = (batch + 1) % 8192

  const offset = batch * 8

  return new Uint8Array([
    data[offset] & 0x7F, // only positive int64,
    data[offset + 1],
    data[offset + 2],
    data[offset + 3],
    data[offset + 4],
    data[offset + 5],
    data[offset + 6],
    data[offset + 7]
  ]);
}

// Read a buffer to unsigned integer bytes.
function readInt32 (buffer: Uint8Array, offset: number) {
  return (buffer[offset + 0] * 16777216) +
    (buffer[offset + 1] << 16) +
    (buffer[offset + 2] << 8) +
    buffer[offset + 3]
}

// Write unsigned integer bytes to a buffer.
function writeUInt32BE (buffer: Uint8Array, value: number, offset: number) {
  buffer[3 + offset] = value & 255
  value = value >> 8
  buffer[2 + offset] = value & 255
  value = value >> 8
  buffer[1 + offset] = value & 255
  value = value >> 8
  buffer[0 + offset] = value & 255
}

const id = (value: string, radix?: number) => new Identifier(value, radix)
