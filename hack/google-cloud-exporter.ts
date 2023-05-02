import { ServiceAccount, ShortLivedToken } from "https://crux.land/32WBxC#google-service-account";

import { SpanExporter, ReadableSpan } from "../opentelemetry/sdk-trace-base.js";
import { ExportResult, ExportResultCode } from "../opentelemetry/core.js";
import { IResource } from "../opentelemetry/resources.js";

import { AttributeValue, HrTime, Link, SpanAttributes, SpanKind, SpanStatus, SpanStatusCode } from "../opentelemetry/api.js";

const gac = Deno.env.get('GOOGLE_APPLICATION_CREDENTIALS');
const sa = await (gac
  ? (gac.startsWith('{')
    ? ServiceAccount.loadFromJsonString(gac)
    : ServiceAccount.readFromFile(gac))
  : ServiceAccount.loadFromJson({type: 'metadata_service_account'}));
const projectId = await sa.getProjectId();

export class GcpBatchSpanExporter implements SpanExporter {
  export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
    this.exportAsync(spans).then(
      () => resultCallback({ code: ExportResultCode.SUCCESS }),
      err => resultCallback({ code: ExportResultCode.FAILED, error: err }),
    );
  }
  async exportAsync(spans: ReadableSpan[]) {
    try {
      const token = await sa.issueToken(['https://www.googleapis.com/auth/cloud-platform']);
      await sendSpans(token, spans.map(getReadableSpanTransformer(projectId)));
    } catch (err) {
      console.error('GcpBatchSpanExporter:', err.message);
      throw err;
    }
  }
  async shutdown(): Promise<void> {
    // throw new Error("Method not implemented.");
  }
}

function getReadableSpanTransformer(
  projectId: string,
  resourceFilter?: RegExp | undefined,
  stringifyArrayAttributes?: boolean
): (span: ReadableSpan) => GcpSpan {
  return span => {
    // @todo get dropped attribute count from sdk ReadableSpan
    const attributes = mergeAttributes(
      transformAttributes(
        {
          ...span.attributes,
          // [AGENT_LABEL_KEY]: AGENT_LABEL_VALUE,
        },
        stringifyArrayAttributes
      ),
      // Add in special g.co/r resource labels
      transformResourceToAttributes(
        span.resource,
        projectId,
        resourceFilter,
        stringifyArrayAttributes
      )
    );

    const out: GcpSpan = {
      attributes,
      displayName: stringToTruncatableString(span.name),
      links: {
        link: span.links.map(getLinkTransformer(stringifyArrayAttributes)),
      },
      endTime: transformTime(span.endTime),
      startTime: transformTime(span.startTime),
      name: `projects/${projectId}/traces/${span.spanContext().traceId}/spans/${
        span.spanContext().spanId
      }`,
      spanKind: transformKind(span.kind),
      spanId: span.spanContext().spanId,
      sameProcessAsParentSpan: !span.spanContext().isRemote,
      status: transformStatus(span.status),
      timeEvents: {
        timeEvent: span.events.map(e => ({
          time: transformTime(e.time),
          annotation: {
            attributes: transformAttributes(
              e.attributes ?? {},
              stringifyArrayAttributes
            ),
            description: stringToTruncatableString(e.name),
          },
        })),
      },
    };

    if (span.parentSpanId) {
      out.parentSpanId = span.parentSpanId;
    }

    return out;
  };
}

export async function sendSpans(token: ShortLivedToken, spans: GcpSpan[]) {
  // console.log(JSON.stringify(spans))
  const resp = await fetch(`https://cloudtrace.googleapis.com/v2/projects/${projectId}/traces:batchWrite`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify({ spans }),
  });
  console.error({
    traceStatus: resp.status,
    spanCount: spans.length,
    body: await resp.json(),
  });
  if (!resp.ok) throw new Error(`Cloud Trace gave HTTP ${resp.status}`);
}

type TruncatableString = {
  "value": string,
  "truncatedByteCount"?: number,
};

type Attributes = {
  "attributeMap": Record<string, {
    "stringValue": TruncatableString,
  } | {
    "intValue": string,
  } | {
    "boolValue": boolean,
  }>,
  "droppedAttributesCount"?: number,
};

export type GcpSpan = {
  "name": string,
  "spanId": string,
  "parentSpanId"?: string,
  "displayName"?: TruncatableString,
  "startTime": string,
  "endTime"?: string,
  "attributes"?: Attributes,
  "stackTrace"?: {
    "stackFrames"?: {
      "frame": {
        "functionName"?: TruncatableString,
        "originalFunctionName"?: TruncatableString,
        "fileName"?: TruncatableString,
        "lineNumber"?: string,
        "columnNumber"?: string,
        "loadModule"?: {
          "module"?: TruncatableString,
          "buildId"?: TruncatableString,
        },
        "sourceVersion"?: TruncatableString,
      }[],
      "droppedFramesCount"?: number;
    }
    "stackTraceHashId"?: number;
  },
  "timeEvents"?: {
    "timeEvent": {
      "time": string,
      // Union field value can be only one of the following:
      "annotation"?: {
        "description"?: TruncatableString,
        "attributes"?: Attributes,
      },
      "messageEvent"?: {
        "type": "TYPE_UNSPECIFIED" | "SENT" | "RECEIVED",
        "id": string,
        "uncompressedSizeBytes": string,
        "compressedSizeBytes": string
      }
    }[],
    "droppedAnnotationsCount"?: number,
    "droppedMessageEventsCount"?: number,
  },
  "links"?: {
    "link": GcpLink[],
    "droppedLinksCount"?: number,
  },
  "status"?: { // TODO: gRPC status enum `google.rpc.Code`
    "code": number,
    "message"?: string,
    "details"?: Record<Exclude<string,'@type'>,unknown> & {'@type': string };
  },
  "sameProcessAsParentSpan"?: boolean,
  "childSpanCount"?: number,
  "spanKind": "SPAN_KIND_UNSPECIFIED" | "INTERNAL" | "SERVER" | "CLIENT" | "PRODUCER" | "CONSUMER",
}
type GcpLink = {
  "traceId": string,
  "spanId": string,
  "type": "TYPE_UNSPECIFIED" | "CHILD_LINKED_SPAN" | "PARENT_LINKED_SPAN",
  "attributes": Attributes,
};


function transformStatus(status: SpanStatus) {
  switch (status.code) {
    case SpanStatusCode.UNSET:
      return undefined;
    case SpanStatusCode.OK:
      return {code: 0};
    case SpanStatusCode.ERROR:
      return {code: 2, message: status.message};
    default: {
      exhaust(status.code);
      // TODO: log failed mapping
      return {code: 2, message: status.message};
    }
  }
}

function transformKind(kind: SpanKind): GcpSpan['spanKind'] {
  switch (kind) {
    case SpanKind.INTERNAL:
      return "INTERNAL";
    case SpanKind.SERVER:
      return "SERVER";
    case SpanKind.CLIENT:
      return "CLIENT";
    case SpanKind.PRODUCER:
      return "PRODUCER";
    case SpanKind.CONSUMER:
      return "CONSUMER";
    default: {
      return "SPAN_KIND_UNSPECIFIED";
    }
  }
}

/**
 * Assert switch case is exhaustive
 */
function exhaust(switchValue: never) {
  return switchValue;
}

function transformTime(time: HrTime) {
  // try allow highres time via ISO strings
  return `${new Date(time[0] * 1000).toISOString().split('.')[0]}${(time[1]/1e9).toString().slice(1)}Z`;
  // return {
  //   seconds: time[0],
  //   nanos: time[1],
  // };
}

function getLinkTransformer(
  stringifyArrayAttributes?: boolean
) {
  return (link: Link): GcpLink => ({
    attributes: transformAttributes(
      link.attributes ?? {},
      stringifyArrayAttributes
    ),
    spanId: link.context.spanId,
    traceId: link.context.traceId,
    type: "TYPE_UNSPECIFIED",
  });
}

function transformAttributes(
  attributes: SpanAttributes,
  stringifyArrayAttributes?: boolean
): Attributes {
  const changedAttributes = transformAttributeNames(attributes);
  return spanAttributesToGCTAttributes(
    changedAttributes,
    stringifyArrayAttributes
  );
}

function spanAttributesToGCTAttributes(
  attributes: SpanAttributes,
  stringifyArrayAttributes?: boolean
): Attributes {
  const attributeMap = transformAttributeValues(
    attributes,
    stringifyArrayAttributes
  );
  return {
    attributeMap,
    droppedAttributesCount:
      Object.keys(attributes).length - Object.keys(attributeMap).length,
  };
}

function mergeAttributes(...attributeList: Attributes[]): Attributes {
  const attributesOut = {
    attributeMap: {},
    droppedAttributesCount: 0,
  };
  attributeList.forEach(attributes => {
    Object.assign(attributesOut.attributeMap, attributes.attributeMap);
    attributesOut.droppedAttributesCount +=
      attributes.droppedAttributesCount ?? 0;
  });
  return attributesOut;
}

function transformResourceToAttributes(
  resource: IResource,
  projectId: string,
  resourceFilter?: RegExp,
  stringifyArrayAttributes?: boolean
): Attributes {
  // const monitoredResource = mapOtelResourceToMonitoredResource(resource, true);
  const attributes: SpanAttributes = {};

  if (resourceFilter) {
    Object.keys(resource.attributes)
      .filter(key => resourceFilter.test(key))
      .forEach(key => {
        attributes[key] = resource.attributes[key];
      });
  }

  // // global is the "default" so just skip
  // if (monitoredResource.type !== 'global') {
  //   Object.keys(monitoredResource.labels).forEach(labelKey => {
  //     const key = `g.co/r/${monitoredResource.type}/${labelKey}`;
  //     attributes[key] = monitoredResource.labels[labelKey];
  //   });
  // }
  return spanAttributesToGCTAttributes(attributes, stringifyArrayAttributes);
}

function transformAttributeValues(
  attributes: SpanAttributes,
  stringifyArrayAttributes?: boolean
): Attributes['attributeMap'] {
  const out: Attributes['attributeMap'] = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined) {
      continue;
    }
    const attributeValue = valueToAttributeValue(
      value,
      stringifyArrayAttributes
    );
    if (attributeValue !== undefined) {
      out[key] = attributeValue;
    }
  }
  return out;
}

function stringToTruncatableString(value: string): TruncatableString {
  return {value};
}

function valueToAttributeValue(
  value: AttributeValue,
  stringifyArrayAttributes?: boolean
): Attributes['attributeMap'][string] | undefined {
  switch (typeof value) {
    case 'number':
      // TODO: Consider to change to doubleValue when available in V2 API.
      return {intValue: String(Math.round(value))};
    case 'boolean':
      return {boolValue: value};
    case 'string':
      return {stringValue: stringToTruncatableString(value)};
    default:
      if (stringifyArrayAttributes) {
        return {stringValue: stringToTruncatableString(JSON.stringify(value))};
      }

      // TODO: Handle array types without stringification once API level support is added
      return undefined;
  }
}

const HTTP_ATTRIBUTE_MAPPING: {[key: string]: string} = {
  'http.method': '/http/method',
  'http.url': '/http/url',
  'http.host': '/http/host',
  'http.scheme': '/http/client_protocol',
  'http.status_code': '/http/status_code',
  'http.user_agent': '/http/user_agent',
  'http.request_content_length': '/http/request/size',
  'http.response_content_length': '/http/response/size',
  'http.route': '/http/route',
};
function transformAttributeNames(
  attributes: SpanAttributes
): SpanAttributes {
  const out: SpanAttributes = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (HTTP_ATTRIBUTE_MAPPING[key]) {
      out[HTTP_ATTRIBUTE_MAPPING[key]] = value;
    } else {
      out[key] = value;
    }
  }
  return out;
}
