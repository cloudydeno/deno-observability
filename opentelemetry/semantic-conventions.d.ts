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

/**
 * The full invoked ARN as provided on the `Context` passed to the function (`Lambda-Runtime-Invoked-Function-Arn` header on the `/runtime/invocation/next` applicable).
 *
 * Note: This may be different from `faas.id` if an alias is involved.
 *
 * @deprecated use ATTR_AWS_LAMBDA_INVOKED_ARN
 */
declare const SEMATTRS_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated use ATTR_DB_SYSTEM
 */
declare const SEMATTRS_DB_SYSTEM = "db.system";
/**
 * The connection string used to connect to the database. It is recommended to remove embedded credentials.
 *
 * @deprecated use ATTR_DB_CONNECTION_STRING
 */
declare const SEMATTRS_DB_CONNECTION_STRING = "db.connection_string";
/**
 * Username for accessing the database.
 *
 * @deprecated use ATTR_DB_USER
 */
declare const SEMATTRS_DB_USER = "db.user";
/**
 * The fully-qualified class name of the [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) driver used to connect.
 *
 * @deprecated use ATTR_DB_JDBC_DRIVER_CLASSNAME
 */
declare const SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
/**
 * If no [tech-specific attribute](#call-level-attributes-for-specific-technologies) is defined, this attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).
 *
 * Note: In some SQL databases, the database name to be used is called &#34;schema name&#34;.
 *
 * @deprecated use ATTR_DB_NAME
 */
declare const SEMATTRS_DB_NAME = "db.name";
/**
 * The database statement being executed.
 *
 * Note: The value may be sanitized to exclude sensitive information.
 *
 * @deprecated use ATTR_DB_STATEMENT
 */
declare const SEMATTRS_DB_STATEMENT = "db.statement";
/**
 * The name of the operation being executed, e.g. the [MongoDB command name](https://docs.mongodb.com/manual/reference/command/#database-operations) such as `findAndModify`, or the SQL keyword.
 *
 * Note: When setting this to an SQL keyword, it is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if the operation name is provided by the library being instrumented. If the SQL statement has an ambiguous operation, or performs more than one operation, this value may be omitted.
 *
 * @deprecated use ATTR_DB_OPERATION
 */
declare const SEMATTRS_DB_OPERATION = "db.operation";
/**
 * The Microsoft SQL Server [instance name](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) connecting to. This name is used to determine the port of a named instance.
 *
 * Note: If setting a `db.mssql.instance_name`, `net.peer.port` is no longer required (but still recommended if non-standard).
 *
 * @deprecated use ATTR_DB_MSSQL_INSTANCE_NAME
 */
declare const SEMATTRS_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
/**
 * The name of the keyspace being accessed. To be used instead of the generic `db.name` attribute.
 *
 * @deprecated use ATTR_DB_CASSANDRA_KEYSPACE
 */
declare const SEMATTRS_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
/**
 * The fetch size used for paging, i.e. how many rows will be returned at once.
 *
 * @deprecated use ATTR_DB_CASSANDRA_PAGE_SIZE
 */
declare const SEMATTRS_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated use ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL
 */
declare const SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
/**
 * The name of the primary table that the operation is acting upon, including the schema name (if applicable).
 *
 * Note: This mirrors the db.sql.table attribute but references cassandra rather than sql. It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
 *
 * @deprecated use ATTR_DB_CASSANDRA_TABLE
 */
declare const SEMATTRS_DB_CASSANDRA_TABLE = "db.cassandra.table";
/**
 * Whether or not the query is idempotent.
 *
 * @deprecated use ATTR_DB_CASSANDRA_IDEMPOTENCE
 */
declare const SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
/**
 * The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
 *
 * @deprecated use ATTR_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT
 */
declare const SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
/**
 * The ID of the coordinating node for a query.
 *
 * @deprecated use ATTR_DB_CASSANDRA_COORDINATOR_ID
 */
declare const SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
/**
 * The data center of the coordinating node for a query.
 *
 * @deprecated use ATTR_DB_CASSANDRA_COORDINATOR_DC
 */
declare const SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
/**
 * The [HBase namespace](https://hbase.apache.org/book.html#_namespace) being accessed. To be used instead of the generic `db.name` attribute.
 *
 * @deprecated use ATTR_DB_HBASE_NAMESPACE
 */
declare const SEMATTRS_DB_HBASE_NAMESPACE = "db.hbase.namespace";
/**
 * The index of the database being accessed as used in the [`SELECT` command](https://redis.io/commands/select), provided as an integer. To be used instead of the generic `db.name` attribute.
 *
 * @deprecated use ATTR_DB_REDIS_DATABASE_INDEX
 */
declare const SEMATTRS_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
/**
 * The collection being accessed within the database stated in `db.name`.
 *
 * @deprecated use ATTR_DB_MONGODB_COLLECTION
 */
declare const SEMATTRS_DB_MONGODB_COLLECTION = "db.mongodb.collection";
/**
 * The name of the primary table that the operation is acting upon, including the schema name (if applicable).
 *
 * Note: It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
 *
 * @deprecated use ATTR_DB_SQL_TABLE
 */
declare const SEMATTRS_DB_SQL_TABLE = "db.sql.table";
/**
 * The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
 *
 * @deprecated use ATTR_EXCEPTION_TYPE
 */
declare const SEMATTRS_EXCEPTION_TYPE = "exception.type";
/**
 * The exception message.
 *
 * @deprecated use ATTR_EXCEPTION_MESSAGE
 */
declare const SEMATTRS_EXCEPTION_MESSAGE = "exception.message";
/**
 * A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
 *
 * @deprecated use ATTR_EXCEPTION_STACKTRACE
 */
declare const SEMATTRS_EXCEPTION_STACKTRACE = "exception.stacktrace";
/**
* SHOULD be set to true if the exception event is recorded at a point where it is known that the exception is escaping the scope of the span.
*
* Note: An exception is considered to have escaped (or left) the scope of a span,
if that span is ended while the exception is still logically &#34;in flight&#34;.
This may be actually &#34;in flight&#34; in some languages (e.g. if the exception
is passed to a Context manager&#39;s `__exit__` method in Python) but will
usually be caught at the point of recording the exception in most languages.

It is usually not possible to determine at the point where an exception is thrown
whether it will escape the scope of a span.
However, it is trivial to know that an exception
will escape, if one checks for an active exception just before ending the span,
as done in the [example above](#exception-end-example).

It follows that an exception may still escape the scope of the span
even if the `exception.escaped` attribute was not set or set to false,
since the event might have been recorded at a time where it was not
clear whether the exception will escape.
*
* @deprecated use ATTR_EXCEPTION_ESCAPED
*/
declare const SEMATTRS_EXCEPTION_ESCAPED = "exception.escaped";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated use ATTR_FAAS_TRIGGER
 */
declare const SEMATTRS_FAAS_TRIGGER = "faas.trigger";
/**
 * The execution ID of the current function execution.
 *
 * @deprecated use ATTR_FAAS_EXECUTION
 */
declare const SEMATTRS_FAAS_EXECUTION = "faas.execution";
/**
 * The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
 *
 * @deprecated use ATTR_FAAS_DOCUMENT_COLLECTION
 */
declare const SEMATTRS_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
/**
 * Describes the type of the operation that was performed on the data.
 *
 * @deprecated use ATTR_FAAS_DOCUMENT_OPERATION
 */
declare const SEMATTRS_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
/**
 * A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
 *
 * @deprecated use ATTR_FAAS_DOCUMENT_TIME
 */
declare const SEMATTRS_FAAS_DOCUMENT_TIME = "faas.document.time";
/**
 * The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
 *
 * @deprecated use ATTR_FAAS_DOCUMENT_NAME
 */
declare const SEMATTRS_FAAS_DOCUMENT_NAME = "faas.document.name";
/**
 * A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
 *
 * @deprecated use ATTR_FAAS_TIME
 */
declare const SEMATTRS_FAAS_TIME = "faas.time";
/**
 * A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
 *
 * @deprecated use ATTR_FAAS_CRON
 */
declare const SEMATTRS_FAAS_CRON = "faas.cron";
/**
 * A boolean that is true if the serverless function is executed for the first time (aka cold-start).
 *
 * @deprecated use ATTR_FAAS_COLDSTART
 */
declare const SEMATTRS_FAAS_COLDSTART = "faas.coldstart";
/**
 * The name of the invoked function.
 *
 * Note: SHOULD be equal to the `faas.name` resource attribute of the invoked function.
 *
 * @deprecated use ATTR_FAAS_INVOKED_NAME
 */
declare const SEMATTRS_FAAS_INVOKED_NAME = "faas.invoked_name";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated use ATTR_FAAS_INVOKED_PROVIDER
 */
declare const SEMATTRS_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
/**
 * The cloud region of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.region` resource attribute of the invoked function.
 *
 * @deprecated use ATTR_FAAS_INVOKED_REGION
 */
declare const SEMATTRS_FAAS_INVOKED_REGION = "faas.invoked_region";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated use ATTR_NET_TRANSPORT
 */
declare const SEMATTRS_NET_TRANSPORT = "net.transport";
/**
 * Remote address of the peer (dotted decimal for IPv4 or [RFC5952](https://tools.ietf.org/html/rfc5952) for IPv6).
 *
 * @deprecated use ATTR_NET_PEER_IP
 */
declare const SEMATTRS_NET_PEER_IP = "net.peer.ip";
/**
 * Remote port number.
 *
 * @deprecated use ATTR_NET_PEER_PORT
 */
declare const SEMATTRS_NET_PEER_PORT = "net.peer.port";
/**
 * Remote hostname or similar, see note below.
 *
 * @deprecated use ATTR_NET_PEER_NAME
 */
declare const SEMATTRS_NET_PEER_NAME = "net.peer.name";
/**
 * Like `net.peer.ip` but for the host IP. Useful in case of a multi-IP host.
 *
 * @deprecated use ATTR_NET_HOST_IP
 */
declare const SEMATTRS_NET_HOST_IP = "net.host.ip";
/**
 * Like `net.peer.port` but for the host port.
 *
 * @deprecated use ATTR_NET_HOST_PORT
 */
declare const SEMATTRS_NET_HOST_PORT = "net.host.port";
/**
 * Local hostname or similar, see note below.
 *
 * @deprecated use ATTR_NET_HOST_NAME
 */
declare const SEMATTRS_NET_HOST_NAME = "net.host.name";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated use ATTR_NET_HOST_CONNECTION_TYPE
 */
declare const SEMATTRS_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated use ATTR_NET_HOST_CONNECTION_SUBTYPE
 */
declare const SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
/**
 * The name of the mobile carrier.
 *
 * @deprecated use ATTR_NET_HOST_CARRIER_NAME
 */
declare const SEMATTRS_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
/**
 * The mobile carrier country code.
 *
 * @deprecated use ATTR_NET_HOST_CARRIER_MCC
 */
declare const SEMATTRS_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
/**
 * The mobile carrier network code.
 *
 * @deprecated use ATTR_NET_HOST_CARRIER_MNC
 */
declare const SEMATTRS_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
/**
 * The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
 *
 * @deprecated use ATTR_NET_HOST_CARRIER_ICC
 */
declare const SEMATTRS_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
/**
 * The [`service.name`](../../resource/semantic_conventions/README.md#service) of the remote service. SHOULD be equal to the actual `service.name` resource attribute of the remote service if any.
 *
 * @deprecated use ATTR_PEER_SERVICE
 */
declare const SEMATTRS_PEER_SERVICE = "peer.service";
/**
 * Username or client_id extracted from the access token or [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) header in the inbound request from outside the system.
 *
 * @deprecated use ATTR_ENDUSER_ID
 */
declare const SEMATTRS_ENDUSER_ID = "enduser.id";
/**
 * Actual/assumed role the client is making the request under extracted from token or application security context.
 *
 * @deprecated use ATTR_ENDUSER_ROLE
 */
declare const SEMATTRS_ENDUSER_ROLE = "enduser.role";
/**
 * Scopes or granted authorities the client currently possesses extracted from token or application security context. The value would come from the scope associated with an [OAuth 2.0 Access Token](https://tools.ietf.org/html/rfc6749#section-3.3) or an attribute value in a [SAML 2.0 Assertion](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).
 *
 * @deprecated use ATTR_ENDUSER_SCOPE
 */
declare const SEMATTRS_ENDUSER_SCOPE = "enduser.scope";
/**
 * Current &#34;managed&#34; thread ID (as opposed to OS thread ID).
 *
 * @deprecated use ATTR_THREAD_ID
 */
declare const SEMATTRS_THREAD_ID = "thread.id";
/**
 * Current thread name.
 *
 * @deprecated use ATTR_THREAD_NAME
 */
declare const SEMATTRS_THREAD_NAME = "thread.name";
/**
 * The method or function name, or equivalent (usually rightmost part of the code unit&#39;s name).
 *
 * @deprecated use ATTR_CODE_FUNCTION
 */
declare const SEMATTRS_CODE_FUNCTION = "code.function";
/**
 * The &#34;namespace&#34; within which `code.function` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function` form a unique identifier for the code unit.
 *
 * @deprecated use ATTR_CODE_NAMESPACE
 */
declare const SEMATTRS_CODE_NAMESPACE = "code.namespace";
/**
 * The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
 *
 * @deprecated use ATTR_CODE_FILEPATH
 */
declare const SEMATTRS_CODE_FILEPATH = "code.filepath";
/**
 * The line number in `code.filepath` best representing the operation. It SHOULD point within the code unit named in `code.function`.
 *
 * @deprecated use ATTR_CODE_LINENO
 */
declare const SEMATTRS_CODE_LINENO = "code.lineno";
/**
 * HTTP request method.
 *
 * @deprecated use ATTR_HTTP_METHOD
 */
declare const SEMATTRS_HTTP_METHOD = "http.method";
/**
 * Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.
 *
 * Note: `http.url` MUST NOT contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case the attribute&#39;s value should be `https://www.example.com/`.
 *
 * @deprecated use ATTR_HTTP_URL
 */
declare const SEMATTRS_HTTP_URL = "http.url";
/**
 * The full request target as passed in a HTTP request line or equivalent.
 *
 * @deprecated use ATTR_HTTP_TARGET
 */
declare const SEMATTRS_HTTP_TARGET = "http.target";
/**
 * The value of the [HTTP host header](https://tools.ietf.org/html/rfc7230#section-5.4). An empty Host header should also be reported, see note.
 *
 * Note: When the header is present but empty the attribute SHOULD be set to the empty string. Note that this is a valid situation that is expected in certain cases, according the aforementioned [section of RFC 7230](https://tools.ietf.org/html/rfc7230#section-5.4). When the header is not set the attribute MUST NOT be set.
 *
 * @deprecated use ATTR_HTTP_HOST
 */
declare const SEMATTRS_HTTP_HOST = "http.host";
/**
 * The URI scheme identifying the used protocol.
 *
 * @deprecated use ATTR_HTTP_SCHEME
 */
declare const SEMATTRS_HTTP_SCHEME = "http.scheme";
/**
 * [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
 *
 * @deprecated use ATTR_HTTP_STATUS_CODE
 */
declare const SEMATTRS_HTTP_STATUS_CODE = "http.status_code";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated use ATTR_HTTP_FLAVOR
 */
declare const SEMATTRS_HTTP_FLAVOR = "http.flavor";
/**
 * Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client.
 *
 * @deprecated use ATTR_HTTP_USER_AGENT
 */
declare const SEMATTRS_HTTP_USER_AGENT = "http.user_agent";
/**
 * The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
 *
 * @deprecated use ATTR_HTTP_REQUEST_CONTENT_LENGTH
 */
declare const SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
/**
 * The size of the uncompressed request payload body after transport decoding. Not set if transport encoding not used.
 *
 * @deprecated use ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED
 */
declare const SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
/**
 * The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
 *
 * @deprecated use ATTR_HTTP_RESPONSE_CONTENT_LENGTH
 */
declare const SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
/**
 * The size of the uncompressed response payload body after transport decoding. Not set if transport encoding not used.
 *
 * @deprecated use ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED
 */
declare const SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
/**
 * The primary server name of the matched virtual host. This should be obtained via configuration. If no such configuration can be obtained, this attribute MUST NOT be set ( `net.host.name` should be used instead).
 *
 * Note: `http.url` is usually not readily available on the server side but would have to be assembled in a cumbersome and sometimes lossy process from other information (see e.g. open-telemetry/opentelemetry-python/pull/148). It is thus preferred to supply the raw data that is available.
 *
 * @deprecated use ATTR_HTTP_SERVER_NAME
 */
declare const SEMATTRS_HTTP_SERVER_NAME = "http.server_name";
/**
 * The matched route (path template).
 *
 * @deprecated use ATTR_HTTP_ROUTE
 */
declare const SEMATTRS_HTTP_ROUTE = "http.route";
/**
* The IP address of the original client behind all proxies, if known (e.g. from [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)).
*
* Note: This is not necessarily the same as `net.peer.ip`, which would
identify the network-level peer, which may be a proxy.

This attribute should be set when a source of information different
from the one used for `net.peer.ip`, is available even if that other
source just confirms the same value as `net.peer.ip`.
Rationale: For `net.peer.ip`, one typically does not know if it
comes from a proxy, reverse proxy, or the actual client. Setting
`http.client_ip` when it&#39;s the same as `net.peer.ip` means that
one is at least somewhat confident that the address is not that of
the closest proxy.
*
* @deprecated use ATTR_HTTP_CLIENT_IP
*/
declare const SEMATTRS_HTTP_CLIENT_IP = "http.client_ip";
/**
 * The keys in the `RequestItems` object field.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_TABLE_NAMES
 */
declare const SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
/**
 * The JSON-serialized value of each item in the `ConsumedCapacity` response field.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_CONSUMED_CAPACITY
 */
declare const SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
/**
 * The JSON-serialized value of the `ItemCollectionMetrics` response field.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_ITEM_COLLECTION_METRICS
 */
declare const SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
/**
 * The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY
 */
declare const SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
/**
 * The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY
 */
declare const SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
/**
 * The value of the `ConsistentRead` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_CONSISTENT_READ
 */
declare const SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
/**
 * The value of the `ProjectionExpression` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_PROJECTION
 */
declare const SEMATTRS_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
/**
 * The value of the `Limit` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_LIMIT
 */
declare const SEMATTRS_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
/**
 * The value of the `AttributesToGet` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_ATTRIBUTES_TO_GET
 */
declare const SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
/**
 * The value of the `IndexName` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_INDEX_NAME
 */
declare const SEMATTRS_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
/**
 * The value of the `Select` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_SELECT
 */
declare const SEMATTRS_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
/**
 * The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES
 */
declare const SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
/**
 * The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES
 */
declare const SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
/**
 * The value of the `ExclusiveStartTableName` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_EXCLUSIVE_START_TABLE
 */
declare const SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
/**
 * The the number of items in the `TableNames` response parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_TABLE_COUNT
 */
declare const SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
/**
 * The value of the `ScanIndexForward` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_SCAN_FORWARD
 */
declare const SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
/**
 * The value of the `Segment` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_SEGMENT
 */
declare const SEMATTRS_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
/**
 * The value of the `TotalSegments` request parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_TOTAL_SEGMENTS
 */
declare const SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
/**
 * The value of the `Count` response parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_COUNT
 */
declare const SEMATTRS_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
/**
 * The value of the `ScannedCount` response parameter.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_SCANNED_COUNT
 */
declare const SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
/**
 * The JSON-serialized value of each item in the `AttributeDefinitions` request field.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS
 */
declare const SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
/**
 * The JSON-serialized value of each item in the the `GlobalSecondaryIndexUpdates` request field.
 *
 * @deprecated use ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES
 */
declare const SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
/**
 * A string identifying the messaging system.
 *
 * @deprecated use ATTR_MESSAGING_SYSTEM
 */
declare const SEMATTRS_MESSAGING_SYSTEM = "messaging.system";
/**
 * The message destination name. This might be equal to the span name but is required nevertheless.
 *
 * @deprecated use ATTR_MESSAGING_DESTINATION
 */
declare const SEMATTRS_MESSAGING_DESTINATION = "messaging.destination";
/**
 * The kind of message destination.
 *
 * @deprecated use ATTR_MESSAGING_DESTINATION_KIND
 */
declare const SEMATTRS_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
/**
 * A boolean that is true if the message destination is temporary.
 *
 * @deprecated use ATTR_MESSAGING_TEMP_DESTINATION
 */
declare const SEMATTRS_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
/**
 * The name of the transport protocol.
 *
 * @deprecated use ATTR_MESSAGING_PROTOCOL
 */
declare const SEMATTRS_MESSAGING_PROTOCOL = "messaging.protocol";
/**
 * The version of the transport protocol.
 *
 * @deprecated use ATTR_MESSAGING_PROTOCOL_VERSION
 */
declare const SEMATTRS_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
/**
 * Connection string.
 *
 * @deprecated use ATTR_MESSAGING_URL
 */
declare const SEMATTRS_MESSAGING_URL = "messaging.url";
/**
 * A value used by the messaging system as an identifier for the message, represented as a string.
 *
 * @deprecated use ATTR_MESSAGING_MESSAGE_ID
 */
declare const SEMATTRS_MESSAGING_MESSAGE_ID = "messaging.message_id";
/**
 * The [conversation ID](#conversations) identifying the conversation to which the message belongs, represented as a string. Sometimes called &#34;Correlation ID&#34;.
 *
 * @deprecated use ATTR_MESSAGING_CONVERSATION_ID
 */
declare const SEMATTRS_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
/**
 * The (uncompressed) size of the message payload in bytes. Also use this attribute if it is unknown whether the compressed or uncompressed payload size is reported.
 *
 * @deprecated use ATTR_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES
 */
declare const SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
/**
 * The compressed size of the message payload in bytes.
 *
 * @deprecated use ATTR_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES
 */
declare const SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
/**
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
 *
 * @deprecated use ATTR_MESSAGING_OPERATION
 */
declare const SEMATTRS_MESSAGING_OPERATION = "messaging.operation";
/**
 * The identifier for the consumer receiving a message. For Kafka, set it to `{messaging.kafka.consumer_group} - {messaging.kafka.client_id}`, if both are present, or only `messaging.kafka.consumer_group`. For brokers, such as RabbitMQ and Artemis, set it to the `client_id` of the client consuming the message.
 *
 * @deprecated use ATTR_MESSAGING_CONSUMER_ID
 */
declare const SEMATTRS_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
/**
 * RabbitMQ message routing key.
 *
 * @deprecated use ATTR_MESSAGING_RABBITMQ_ROUTING_KEY
 */
declare const SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
/**
 * Message keys in Kafka are used for grouping alike messages to ensure they&#39;re processed on the same partition. They differ from `messaging.message_id` in that they&#39;re not unique. If the key is `null`, the attribute MUST NOT be set.
 *
 * Note: If the key type is not string, it&#39;s string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don&#39;t include its value.
 *
 * @deprecated use ATTR_MESSAGING_KAFKA_MESSAGE_KEY
 */
declare const SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
/**
 * Name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.
 *
 * @deprecated use ATTR_MESSAGING_KAFKA_CONSUMER_GROUP
 */
declare const SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
/**
 * Client Id for the Consumer or Producer that is handling the message.
 *
 * @deprecated use ATTR_MESSAGING_KAFKA_CLIENT_ID
 */
declare const SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
/**
 * Partition the message is sent to.
 *
 * @deprecated use ATTR_MESSAGING_KAFKA_PARTITION
 */
declare const SEMATTRS_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
/**
 * A boolean that is true if the message is a tombstone.
 *
 * @deprecated use ATTR_MESSAGING_KAFKA_TOMBSTONE
 */
declare const SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
/**
 * A string identifying the remoting system.
 *
 * @deprecated use ATTR_RPC_SYSTEM
 */
declare const SEMATTRS_RPC_SYSTEM = "rpc.system";
/**
 * The full (logical) name of the service being called, including its package name, if applicable.
 *
 * Note: This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
 *
 * @deprecated use ATTR_RPC_SERVICE
 */
declare const SEMATTRS_RPC_SERVICE = "rpc.service";
/**
 * The name of the (logical) method being called, must be equal to the $method part in the span name.
 *
 * Note: This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
 *
 * @deprecated use ATTR_RPC_METHOD
 */
declare const SEMATTRS_RPC_METHOD = "rpc.method";
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated use ATTR_RPC_GRPC_STATUS_CODE
 */
declare const SEMATTRS_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
/**
 * Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 does not specify this, the value can be omitted.
 *
 * @deprecated use ATTR_RPC_JSONRPC_VERSION
 */
declare const SEMATTRS_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
/**
 * `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
 *
 * @deprecated use ATTR_RPC_JSONRPC_REQUEST_ID
 */
declare const SEMATTRS_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
/**
 * `error.code` property of response if it is an error response.
 *
 * @deprecated use ATTR_RPC_JSONRPC_ERROR_CODE
 */
declare const SEMATTRS_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
/**
 * `error.message` property of response if it is an error response.
 *
 * @deprecated use ATTR_RPC_JSONRPC_ERROR_MESSAGE
 */
declare const SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
/**
 * Whether this is a received or sent message.
 *
 * @deprecated use ATTR_MESSAGE_TYPE
 */
declare const SEMATTRS_MESSAGE_TYPE = "message.type";
/**
 * MUST be calculated as two different counters starting from `1` one for sent messages and one for received message.
 *
 * Note: This way we guarantee that the values will be consistent between different implementations.
 *
 * @deprecated use ATTR_MESSAGE_ID
 */
declare const SEMATTRS_MESSAGE_ID = "message.id";
/**
 * Compressed size of the message in bytes.
 *
 * @deprecated use ATTR_MESSAGE_COMPRESSED_SIZE
 */
declare const SEMATTRS_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
/**
 * Uncompressed size of the message in bytes.
 *
 * @deprecated use ATTR_MESSAGE_UNCOMPRESSED_SIZE
 */
declare const SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
/**
 * Definition of available values for SemanticAttributes
 * This type is used for backward compatibility, you should use the individual exported
 * constants SemanticAttributes_XXXXX rather than the exported constant map. As any single reference
 * to a constant map value will result in all strings being included into your bundle.
 * @deprecated Use the SEMATTRS_XXXXX constants rather than the SemanticAttributes.XXXXX for bundle minification.
 */
declare type SemanticAttributes = {
	/**
	* The full invoked ARN as provided on the `Context` passed to the function (`Lambda-Runtime-Invoked-Function-Arn` header on the `/runtime/invocation/next` applicable).
	*
	* Note: This may be different from `faas.id` if an alias is involved.
	*/
	AWS_LAMBDA_INVOKED_ARN: 'aws.lambda.invoked_arn';
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*/
	DB_SYSTEM: 'db.system';
	/**
	* The connection string used to connect to the database. It is recommended to remove embedded credentials.
	*/
	DB_CONNECTION_STRING: 'db.connection_string';
	/**
	* Username for accessing the database.
	*/
	DB_USER: 'db.user';
	/**
	* The fully-qualified class name of the [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) driver used to connect.
	*/
	DB_JDBC_DRIVER_CLASSNAME: 'db.jdbc.driver_classname';
	/**
	* If no [tech-specific attribute](#call-level-attributes-for-specific-technologies) is defined, this attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).
	*
	* Note: In some SQL databases, the database name to be used is called &#34;schema name&#34;.
	*/
	DB_NAME: 'db.name';
	/**
	* The database statement being executed.
	*
	* Note: The value may be sanitized to exclude sensitive information.
	*/
	DB_STATEMENT: 'db.statement';
	/**
	* The name of the operation being executed, e.g. the [MongoDB command name](https://docs.mongodb.com/manual/reference/command/#database-operations) such as `findAndModify`, or the SQL keyword.
	*
	* Note: When setting this to an SQL keyword, it is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if the operation name is provided by the library being instrumented. If the SQL statement has an ambiguous operation, or performs more than one operation, this value may be omitted.
	*/
	DB_OPERATION: 'db.operation';
	/**
	* The Microsoft SQL Server [instance name](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) connecting to. This name is used to determine the port of a named instance.
	*
	* Note: If setting a `db.mssql.instance_name`, `net.peer.port` is no longer required (but still recommended if non-standard).
	*/
	DB_MSSQL_INSTANCE_NAME: 'db.mssql.instance_name';
	/**
	* The name of the keyspace being accessed. To be used instead of the generic `db.name` attribute.
	*/
	DB_CASSANDRA_KEYSPACE: 'db.cassandra.keyspace';
	/**
	* The fetch size used for paging, i.e. how many rows will be returned at once.
	*/
	DB_CASSANDRA_PAGE_SIZE: 'db.cassandra.page_size';
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*/
	DB_CASSANDRA_CONSISTENCY_LEVEL: 'db.cassandra.consistency_level';
	/**
	* The name of the primary table that the operation is acting upon, including the schema name (if applicable).
	*
	* Note: This mirrors the db.sql.table attribute but references cassandra rather than sql. It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
	*/
	DB_CASSANDRA_TABLE: 'db.cassandra.table';
	/**
	* Whether or not the query is idempotent.
	*/
	DB_CASSANDRA_IDEMPOTENCE: 'db.cassandra.idempotence';
	/**
	* The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
	*/
	DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT: 'db.cassandra.speculative_execution_count';
	/**
	* The ID of the coordinating node for a query.
	*/
	DB_CASSANDRA_COORDINATOR_ID: 'db.cassandra.coordinator.id';
	/**
	* The data center of the coordinating node for a query.
	*/
	DB_CASSANDRA_COORDINATOR_DC: 'db.cassandra.coordinator.dc';
	/**
	* The [HBase namespace](https://hbase.apache.org/book.html#_namespace) being accessed. To be used instead of the generic `db.name` attribute.
	*/
	DB_HBASE_NAMESPACE: 'db.hbase.namespace';
	/**
	* The index of the database being accessed as used in the [`SELECT` command](https://redis.io/commands/select), provided as an integer. To be used instead of the generic `db.name` attribute.
	*/
	DB_REDIS_DATABASE_INDEX: 'db.redis.database_index';
	/**
	* The collection being accessed within the database stated in `db.name`.
	*/
	DB_MONGODB_COLLECTION: 'db.mongodb.collection';
	/**
	* The name of the primary table that the operation is acting upon, including the schema name (if applicable).
	*
	* Note: It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
	*/
	DB_SQL_TABLE: 'db.sql.table';
	/**
	* The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
	*/
	EXCEPTION_TYPE: 'exception.type';
	/**
	* The exception message.
	*/
	EXCEPTION_MESSAGE: 'exception.message';
	/**
	* A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
	*/
	EXCEPTION_STACKTRACE: 'exception.stacktrace';
	/**
	* SHOULD be set to true if the exception event is recorded at a point where it is known that the exception is escaping the scope of the span.
	*
	* Note: An exception is considered to have escaped (or left) the scope of a span,
if that span is ended while the exception is still logically &#34;in flight&#34;.
This may be actually &#34;in flight&#34; in some languages (e.g. if the exception
is passed to a Context manager&#39;s `__exit__` method in Python) but will
usually be caught at the point of recording the exception in most languages.

It is usually not possible to determine at the point where an exception is thrown
whether it will escape the scope of a span.
However, it is trivial to know that an exception
will escape, if one checks for an active exception just before ending the span,
as done in the [example above](#exception-end-example).

It follows that an exception may still escape the scope of the span
even if the `exception.escaped` attribute was not set or set to false,
since the event might have been recorded at a time where it was not
clear whether the exception will escape.
	*/
	EXCEPTION_ESCAPED: 'exception.escaped';
	/**
	* Type of the trigger on which the function is executed.
	*/
	FAAS_TRIGGER: 'faas.trigger';
	/**
	* The execution ID of the current function execution.
	*/
	FAAS_EXECUTION: 'faas.execution';
	/**
	* The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
	*/
	FAAS_DOCUMENT_COLLECTION: 'faas.document.collection';
	/**
	* Describes the type of the operation that was performed on the data.
	*/
	FAAS_DOCUMENT_OPERATION: 'faas.document.operation';
	/**
	* A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
	*/
	FAAS_DOCUMENT_TIME: 'faas.document.time';
	/**
	* The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
	*/
	FAAS_DOCUMENT_NAME: 'faas.document.name';
	/**
	* A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
	*/
	FAAS_TIME: 'faas.time';
	/**
	* A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
	*/
	FAAS_CRON: 'faas.cron';
	/**
	* A boolean that is true if the serverless function is executed for the first time (aka cold-start).
	*/
	FAAS_COLDSTART: 'faas.coldstart';
	/**
	* The name of the invoked function.
	*
	* Note: SHOULD be equal to the `faas.name` resource attribute of the invoked function.
	*/
	FAAS_INVOKED_NAME: 'faas.invoked_name';
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*/
	FAAS_INVOKED_PROVIDER: 'faas.invoked_provider';
	/**
	* The cloud region of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.region` resource attribute of the invoked function.
	*/
	FAAS_INVOKED_REGION: 'faas.invoked_region';
	/**
	* Transport protocol used. See note below.
	*/
	NET_TRANSPORT: 'net.transport';
	/**
	* Remote address of the peer (dotted decimal for IPv4 or [RFC5952](https://tools.ietf.org/html/rfc5952) for IPv6).
	*/
	NET_PEER_IP: 'net.peer.ip';
	/**
	* Remote port number.
	*/
	NET_PEER_PORT: 'net.peer.port';
	/**
	* Remote hostname or similar, see note below.
	*/
	NET_PEER_NAME: 'net.peer.name';
	/**
	* Like `net.peer.ip` but for the host IP. Useful in case of a multi-IP host.
	*/
	NET_HOST_IP: 'net.host.ip';
	/**
	* Like `net.peer.port` but for the host port.
	*/
	NET_HOST_PORT: 'net.host.port';
	/**
	* Local hostname or similar, see note below.
	*/
	NET_HOST_NAME: 'net.host.name';
	/**
	* The internet connection type currently being used by the host.
	*/
	NET_HOST_CONNECTION_TYPE: 'net.host.connection.type';
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*/
	NET_HOST_CONNECTION_SUBTYPE: 'net.host.connection.subtype';
	/**
	* The name of the mobile carrier.
	*/
	NET_HOST_CARRIER_NAME: 'net.host.carrier.name';
	/**
	* The mobile carrier country code.
	*/
	NET_HOST_CARRIER_MCC: 'net.host.carrier.mcc';
	/**
	* The mobile carrier network code.
	*/
	NET_HOST_CARRIER_MNC: 'net.host.carrier.mnc';
	/**
	* The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
	*/
	NET_HOST_CARRIER_ICC: 'net.host.carrier.icc';
	/**
	* The [`service.name`](../../resource/semantic_conventions/README.md#service) of the remote service. SHOULD be equal to the actual `service.name` resource attribute of the remote service if any.
	*/
	PEER_SERVICE: 'peer.service';
	/**
	* Username or client_id extracted from the access token or [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) header in the inbound request from outside the system.
	*/
	ENDUSER_ID: 'enduser.id';
	/**
	* Actual/assumed role the client is making the request under extracted from token or application security context.
	*/
	ENDUSER_ROLE: 'enduser.role';
	/**
	* Scopes or granted authorities the client currently possesses extracted from token or application security context. The value would come from the scope associated with an [OAuth 2.0 Access Token](https://tools.ietf.org/html/rfc6749#section-3.3) or an attribute value in a [SAML 2.0 Assertion](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).
	*/
	ENDUSER_SCOPE: 'enduser.scope';
	/**
	* Current &#34;managed&#34; thread ID (as opposed to OS thread ID).
	*/
	THREAD_ID: 'thread.id';
	/**
	* Current thread name.
	*/
	THREAD_NAME: 'thread.name';
	/**
	* The method or function name, or equivalent (usually rightmost part of the code unit&#39;s name).
	*/
	CODE_FUNCTION: 'code.function';
	/**
	* The &#34;namespace&#34; within which `code.function` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function` form a unique identifier for the code unit.
	*/
	CODE_NAMESPACE: 'code.namespace';
	/**
	* The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
	*/
	CODE_FILEPATH: 'code.filepath';
	/**
	* The line number in `code.filepath` best representing the operation. It SHOULD point within the code unit named in `code.function`.
	*/
	CODE_LINENO: 'code.lineno';
	/**
	* HTTP request method.
	*/
	HTTP_METHOD: 'http.method';
	/**
	* Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.
	*
	* Note: `http.url` MUST NOT contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case the attribute&#39;s value should be `https://www.example.com/`.
	*/
	HTTP_URL: 'http.url';
	/**
	* The full request target as passed in a HTTP request line or equivalent.
	*/
	HTTP_TARGET: 'http.target';
	/**
	* The value of the [HTTP host header](https://tools.ietf.org/html/rfc7230#section-5.4). An empty Host header should also be reported, see note.
	*
	* Note: When the header is present but empty the attribute SHOULD be set to the empty string. Note that this is a valid situation that is expected in certain cases, according the aforementioned [section of RFC 7230](https://tools.ietf.org/html/rfc7230#section-5.4). When the header is not set the attribute MUST NOT be set.
	*/
	HTTP_HOST: 'http.host';
	/**
	* The URI scheme identifying the used protocol.
	*/
	HTTP_SCHEME: 'http.scheme';
	/**
	* [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
	*/
	HTTP_STATUS_CODE: 'http.status_code';
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*/
	HTTP_FLAVOR: 'http.flavor';
	/**
	* Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client.
	*/
	HTTP_USER_AGENT: 'http.user_agent';
	/**
	* The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
	*/
	HTTP_REQUEST_CONTENT_LENGTH: 'http.request_content_length';
	/**
	* The size of the uncompressed request payload body after transport decoding. Not set if transport encoding not used.
	*/
	HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED: 'http.request_content_length_uncompressed';
	/**
	* The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
	*/
	HTTP_RESPONSE_CONTENT_LENGTH: 'http.response_content_length';
	/**
	* The size of the uncompressed response payload body after transport decoding. Not set if transport encoding not used.
	*/
	HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED: 'http.response_content_length_uncompressed';
	/**
	* The primary server name of the matched virtual host. This should be obtained via configuration. If no such configuration can be obtained, this attribute MUST NOT be set ( `net.host.name` should be used instead).
	*
	* Note: `http.url` is usually not readily available on the server side but would have to be assembled in a cumbersome and sometimes lossy process from other information (see e.g. open-telemetry/opentelemetry-python/pull/148). It is thus preferred to supply the raw data that is available.
	*/
	HTTP_SERVER_NAME: 'http.server_name';
	/**
	* The matched route (path template).
	*/
	HTTP_ROUTE: 'http.route';
	/**
	* The IP address of the original client behind all proxies, if known (e.g. from [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)).
	*
	* Note: This is not necessarily the same as `net.peer.ip`, which would
identify the network-level peer, which may be a proxy.

This attribute should be set when a source of information different
from the one used for `net.peer.ip`, is available even if that other
source just confirms the same value as `net.peer.ip`.
Rationale: For `net.peer.ip`, one typically does not know if it
comes from a proxy, reverse proxy, or the actual client. Setting
`http.client_ip` when it&#39;s the same as `net.peer.ip` means that
one is at least somewhat confident that the address is not that of
the closest proxy.
	*/
	HTTP_CLIENT_IP: 'http.client_ip';
	/**
	* The keys in the `RequestItems` object field.
	*/
	AWS_DYNAMODB_TABLE_NAMES: 'aws.dynamodb.table_names';
	/**
	* The JSON-serialized value of each item in the `ConsumedCapacity` response field.
	*/
	AWS_DYNAMODB_CONSUMED_CAPACITY: 'aws.dynamodb.consumed_capacity';
	/**
	* The JSON-serialized value of the `ItemCollectionMetrics` response field.
	*/
	AWS_DYNAMODB_ITEM_COLLECTION_METRICS: 'aws.dynamodb.item_collection_metrics';
	/**
	* The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
	*/
	AWS_DYNAMODB_PROVISIONED_READ_CAPACITY: 'aws.dynamodb.provisioned_read_capacity';
	/**
	* The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
	*/
	AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY: 'aws.dynamodb.provisioned_write_capacity';
	/**
	* The value of the `ConsistentRead` request parameter.
	*/
	AWS_DYNAMODB_CONSISTENT_READ: 'aws.dynamodb.consistent_read';
	/**
	* The value of the `ProjectionExpression` request parameter.
	*/
	AWS_DYNAMODB_PROJECTION: 'aws.dynamodb.projection';
	/**
	* The value of the `Limit` request parameter.
	*/
	AWS_DYNAMODB_LIMIT: 'aws.dynamodb.limit';
	/**
	* The value of the `AttributesToGet` request parameter.
	*/
	AWS_DYNAMODB_ATTRIBUTES_TO_GET: 'aws.dynamodb.attributes_to_get';
	/**
	* The value of the `IndexName` request parameter.
	*/
	AWS_DYNAMODB_INDEX_NAME: 'aws.dynamodb.index_name';
	/**
	* The value of the `Select` request parameter.
	*/
	AWS_DYNAMODB_SELECT: 'aws.dynamodb.select';
	/**
	* The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field.
	*/
	AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES: 'aws.dynamodb.global_secondary_indexes';
	/**
	* The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
	*/
	AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES: 'aws.dynamodb.local_secondary_indexes';
	/**
	* The value of the `ExclusiveStartTableName` request parameter.
	*/
	AWS_DYNAMODB_EXCLUSIVE_START_TABLE: 'aws.dynamodb.exclusive_start_table';
	/**
	* The the number of items in the `TableNames` response parameter.
	*/
	AWS_DYNAMODB_TABLE_COUNT: 'aws.dynamodb.table_count';
	/**
	* The value of the `ScanIndexForward` request parameter.
	*/
	AWS_DYNAMODB_SCAN_FORWARD: 'aws.dynamodb.scan_forward';
	/**
	* The value of the `Segment` request parameter.
	*/
	AWS_DYNAMODB_SEGMENT: 'aws.dynamodb.segment';
	/**
	* The value of the `TotalSegments` request parameter.
	*/
	AWS_DYNAMODB_TOTAL_SEGMENTS: 'aws.dynamodb.total_segments';
	/**
	* The value of the `Count` response parameter.
	*/
	AWS_DYNAMODB_COUNT: 'aws.dynamodb.count';
	/**
	* The value of the `ScannedCount` response parameter.
	*/
	AWS_DYNAMODB_SCANNED_COUNT: 'aws.dynamodb.scanned_count';
	/**
	* The JSON-serialized value of each item in the `AttributeDefinitions` request field.
	*/
	AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS: 'aws.dynamodb.attribute_definitions';
	/**
	* The JSON-serialized value of each item in the the `GlobalSecondaryIndexUpdates` request field.
	*/
	AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES: 'aws.dynamodb.global_secondary_index_updates';
	/**
	* A string identifying the messaging system.
	*/
	MESSAGING_SYSTEM: 'messaging.system';
	/**
	* The message destination name. This might be equal to the span name but is required nevertheless.
	*/
	MESSAGING_DESTINATION: 'messaging.destination';
	/**
	* The kind of message destination.
	*/
	MESSAGING_DESTINATION_KIND: 'messaging.destination_kind';
	/**
	* A boolean that is true if the message destination is temporary.
	*/
	MESSAGING_TEMP_DESTINATION: 'messaging.temp_destination';
	/**
	* The name of the transport protocol.
	*/
	MESSAGING_PROTOCOL: 'messaging.protocol';
	/**
	* The version of the transport protocol.
	*/
	MESSAGING_PROTOCOL_VERSION: 'messaging.protocol_version';
	/**
	* Connection string.
	*/
	MESSAGING_URL: 'messaging.url';
	/**
	* A value used by the messaging system as an identifier for the message, represented as a string.
	*/
	MESSAGING_MESSAGE_ID: 'messaging.message_id';
	/**
	* The [conversation ID](#conversations) identifying the conversation to which the message belongs, represented as a string. Sometimes called &#34;Correlation ID&#34;.
	*/
	MESSAGING_CONVERSATION_ID: 'messaging.conversation_id';
	/**
	* The (uncompressed) size of the message payload in bytes. Also use this attribute if it is unknown whether the compressed or uncompressed payload size is reported.
	*/
	MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES: 'messaging.message_payload_size_bytes';
	/**
	* The compressed size of the message payload in bytes.
	*/
	MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES: 'messaging.message_payload_compressed_size_bytes';
	/**
	* A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
	*/
	MESSAGING_OPERATION: 'messaging.operation';
	/**
	* The identifier for the consumer receiving a message. For Kafka, set it to `{messaging.kafka.consumer_group} - {messaging.kafka.client_id}`, if both are present, or only `messaging.kafka.consumer_group`. For brokers, such as RabbitMQ and Artemis, set it to the `client_id` of the client consuming the message.
	*/
	MESSAGING_CONSUMER_ID: 'messaging.consumer_id';
	/**
	* RabbitMQ message routing key.
	*/
	MESSAGING_RABBITMQ_ROUTING_KEY: 'messaging.rabbitmq.routing_key';
	/**
	* Message keys in Kafka are used for grouping alike messages to ensure they&#39;re processed on the same partition. They differ from `messaging.message_id` in that they&#39;re not unique. If the key is `null`, the attribute MUST NOT be set.
	*
	* Note: If the key type is not string, it&#39;s string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don&#39;t include its value.
	*/
	MESSAGING_KAFKA_MESSAGE_KEY: 'messaging.kafka.message_key';
	/**
	* Name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.
	*/
	MESSAGING_KAFKA_CONSUMER_GROUP: 'messaging.kafka.consumer_group';
	/**
	* Client Id for the Consumer or Producer that is handling the message.
	*/
	MESSAGING_KAFKA_CLIENT_ID: 'messaging.kafka.client_id';
	/**
	* Partition the message is sent to.
	*/
	MESSAGING_KAFKA_PARTITION: 'messaging.kafka.partition';
	/**
	* A boolean that is true if the message is a tombstone.
	*/
	MESSAGING_KAFKA_TOMBSTONE: 'messaging.kafka.tombstone';
	/**
	* A string identifying the remoting system.
	*/
	RPC_SYSTEM: 'rpc.system';
	/**
	* The full (logical) name of the service being called, including its package name, if applicable.
	*
	* Note: This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
	*/
	RPC_SERVICE: 'rpc.service';
	/**
	* The name of the (logical) method being called, must be equal to the $method part in the span name.
	*
	* Note: This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
	*/
	RPC_METHOD: 'rpc.method';
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*/
	RPC_GRPC_STATUS_CODE: 'rpc.grpc.status_code';
	/**
	* Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 does not specify this, the value can be omitted.
	*/
	RPC_JSONRPC_VERSION: 'rpc.jsonrpc.version';
	/**
	* `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
	*/
	RPC_JSONRPC_REQUEST_ID: 'rpc.jsonrpc.request_id';
	/**
	* `error.code` property of response if it is an error response.
	*/
	RPC_JSONRPC_ERROR_CODE: 'rpc.jsonrpc.error_code';
	/**
	* `error.message` property of response if it is an error response.
	*/
	RPC_JSONRPC_ERROR_MESSAGE: 'rpc.jsonrpc.error_message';
	/**
	* Whether this is a received or sent message.
	*/
	MESSAGE_TYPE: 'message.type';
	/**
	* MUST be calculated as two different counters starting from `1` one for sent messages and one for received message.
	*
	* Note: This way we guarantee that the values will be consistent between different implementations.
	*/
	MESSAGE_ID: 'message.id';
	/**
	* Compressed size of the message in bytes.
	*/
	MESSAGE_COMPRESSED_SIZE: 'message.compressed_size';
	/**
	* Uncompressed size of the message in bytes.
	*/
	MESSAGE_UNCOMPRESSED_SIZE: 'message.uncompressed_size';
};
/**
 * Create exported Value Map for SemanticAttributes values
 * @deprecated Use the SEMATTRS_XXXXX constants rather than the SemanticAttributes.XXXXX for bundle minification
 */
declare const SemanticAttributes: SemanticAttributes;
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_OTHER_SQL.
 */
declare const DBSYSTEMVALUES_OTHER_SQL = "other_sql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MSSQL.
 */
declare const DBSYSTEMVALUES_MSSQL = "mssql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MYSQL.
 */
declare const DBSYSTEMVALUES_MYSQL = "mysql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_ORACLE.
 */
declare const DBSYSTEMVALUES_ORACLE = "oracle";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_DB2.
 */
declare const DBSYSTEMVALUES_DB2 = "db2";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_POSTGRESQL.
 */
declare const DBSYSTEMVALUES_POSTGRESQL = "postgresql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_REDSHIFT.
 */
declare const DBSYSTEMVALUES_REDSHIFT = "redshift";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_HIVE.
 */
declare const DBSYSTEMVALUES_HIVE = "hive";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_CLOUDSCAPE.
 */
declare const DBSYSTEMVALUES_CLOUDSCAPE = "cloudscape";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_HSQLDB.
 */
declare const DBSYSTEMVALUES_HSQLDB = "hsqldb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_PROGRESS.
 */
declare const DBSYSTEMVALUES_PROGRESS = "progress";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MAXDB.
 */
declare const DBSYSTEMVALUES_MAXDB = "maxdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_HANADB.
 */
declare const DBSYSTEMVALUES_HANADB = "hanadb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_INGRES.
 */
declare const DBSYSTEMVALUES_INGRES = "ingres";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_FIRSTSQL.
 */
declare const DBSYSTEMVALUES_FIRSTSQL = "firstsql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_EDB.
 */
declare const DBSYSTEMVALUES_EDB = "edb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_CACHE.
 */
declare const DBSYSTEMVALUES_CACHE = "cache";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_ADABAS.
 */
declare const DBSYSTEMVALUES_ADABAS = "adabas";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_FIREBIRD.
 */
declare const DBSYSTEMVALUES_FIREBIRD = "firebird";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_DERBY.
 */
declare const DBSYSTEMVALUES_DERBY = "derby";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_FILEMAKER.
 */
declare const DBSYSTEMVALUES_FILEMAKER = "filemaker";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_INFORMIX.
 */
declare const DBSYSTEMVALUES_INFORMIX = "informix";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_INSTANTDB.
 */
declare const DBSYSTEMVALUES_INSTANTDB = "instantdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_INTERBASE.
 */
declare const DBSYSTEMVALUES_INTERBASE = "interbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MARIADB.
 */
declare const DBSYSTEMVALUES_MARIADB = "mariadb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_NETEZZA.
 */
declare const DBSYSTEMVALUES_NETEZZA = "netezza";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_PERVASIVE.
 */
declare const DBSYSTEMVALUES_PERVASIVE = "pervasive";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_POINTBASE.
 */
declare const DBSYSTEMVALUES_POINTBASE = "pointbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_SQLITE.
 */
declare const DBSYSTEMVALUES_SQLITE = "sqlite";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_SYBASE.
 */
declare const DBSYSTEMVALUES_SYBASE = "sybase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_TERADATA.
 */
declare const DBSYSTEMVALUES_TERADATA = "teradata";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_VERTICA.
 */
declare const DBSYSTEMVALUES_VERTICA = "vertica";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_H2.
 */
declare const DBSYSTEMVALUES_H2 = "h2";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COLDFUSION.
 */
declare const DBSYSTEMVALUES_COLDFUSION = "coldfusion";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_CASSANDRA.
 */
declare const DBSYSTEMVALUES_CASSANDRA = "cassandra";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_HBASE.
 */
declare const DBSYSTEMVALUES_HBASE = "hbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MONGODB.
 */
declare const DBSYSTEMVALUES_MONGODB = "mongodb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_REDIS.
 */
declare const DBSYSTEMVALUES_REDIS = "redis";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COUCHBASE.
 */
declare const DBSYSTEMVALUES_COUCHBASE = "couchbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COUCHDB.
 */
declare const DBSYSTEMVALUES_COUCHDB = "couchdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COSMOSDB.
 */
declare const DBSYSTEMVALUES_COSMOSDB = "cosmosdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_DYNAMODB.
 */
declare const DBSYSTEMVALUES_DYNAMODB = "dynamodb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_NEO4J.
 */
declare const DBSYSTEMVALUES_NEO4J = "neo4j";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_GEODE.
 */
declare const DBSYSTEMVALUES_GEODE = "geode";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_ELASTICSEARCH.
 */
declare const DBSYSTEMVALUES_ELASTICSEARCH = "elasticsearch";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MEMCACHED.
 */
declare const DBSYSTEMVALUES_MEMCACHED = "memcached";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COCKROACHDB.
 */
declare const DBSYSTEMVALUES_COCKROACHDB = "cockroachdb";
/**
 * Identifies the Values for DbSystemValues enum definition
 *
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 * @deprecated Use the DBSYSTEMVALUES_XXXXX constants rather than the DbSystemValues.XXXXX for bundle minification.
 */
declare type DbSystemValues = {
	/** Some other SQL database. Fallback only. See notes. */
	OTHER_SQL: 'other_sql';
	/** Microsoft SQL Server. */
	MSSQL: 'mssql';
	/** MySQL. */
	MYSQL: 'mysql';
	/** Oracle Database. */
	ORACLE: 'oracle';
	/** IBM Db2. */
	DB2: 'db2';
	/** PostgreSQL. */
	POSTGRESQL: 'postgresql';
	/** Amazon Redshift. */
	REDSHIFT: 'redshift';
	/** Apache Hive. */
	HIVE: 'hive';
	/** Cloudscape. */
	CLOUDSCAPE: 'cloudscape';
	/** HyperSQL DataBase. */
	HSQLDB: 'hsqldb';
	/** Progress Database. */
	PROGRESS: 'progress';
	/** SAP MaxDB. */
	MAXDB: 'maxdb';
	/** SAP HANA. */
	HANADB: 'hanadb';
	/** Ingres. */
	INGRES: 'ingres';
	/** FirstSQL. */
	FIRSTSQL: 'firstsql';
	/** EnterpriseDB. */
	EDB: 'edb';
	/** InterSystems Caché. */
	CACHE: 'cache';
	/** Adabas (Adaptable Database System). */
	ADABAS: 'adabas';
	/** Firebird. */
	FIREBIRD: 'firebird';
	/** Apache Derby. */
	DERBY: 'derby';
	/** FileMaker. */
	FILEMAKER: 'filemaker';
	/** Informix. */
	INFORMIX: 'informix';
	/** InstantDB. */
	INSTANTDB: 'instantdb';
	/** InterBase. */
	INTERBASE: 'interbase';
	/** MariaDB. */
	MARIADB: 'mariadb';
	/** Netezza. */
	NETEZZA: 'netezza';
	/** Pervasive PSQL. */
	PERVASIVE: 'pervasive';
	/** PointBase. */
	POINTBASE: 'pointbase';
	/** SQLite. */
	SQLITE: 'sqlite';
	/** Sybase. */
	SYBASE: 'sybase';
	/** Teradata. */
	TERADATA: 'teradata';
	/** Vertica. */
	VERTICA: 'vertica';
	/** H2. */
	H2: 'h2';
	/** ColdFusion IMQ. */
	COLDFUSION: 'coldfusion';
	/** Apache Cassandra. */
	CASSANDRA: 'cassandra';
	/** Apache HBase. */
	HBASE: 'hbase';
	/** MongoDB. */
	MONGODB: 'mongodb';
	/** Redis. */
	REDIS: 'redis';
	/** Couchbase. */
	COUCHBASE: 'couchbase';
	/** CouchDB. */
	COUCHDB: 'couchdb';
	/** Microsoft Azure Cosmos DB. */
	COSMOSDB: 'cosmosdb';
	/** Amazon DynamoDB. */
	DYNAMODB: 'dynamodb';
	/** Neo4j. */
	NEO4J: 'neo4j';
	/** Apache Geode. */
	GEODE: 'geode';
	/** Elasticsearch. */
	ELASTICSEARCH: 'elasticsearch';
	/** Memcached. */
	MEMCACHED: 'memcached';
	/** CockroachDB. */
	COCKROACHDB: 'cockroachdb';
};
/**
 * The constant map of values for DbSystemValues.
 * @deprecated Use the DBSYSTEMVALUES_XXXXX constants rather than the DbSystemValues.XXXXX for bundle minification.
 */
declare const DbSystemValues: DbSystemValues;
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ALL = "all";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = "each_quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = "quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = "local_quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ONE = "one";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_TWO = "two";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_THREE = "three";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = "local_one";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ANY = "any";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = "serial";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL.
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = "local_serial";
/**
 * Identifies the Values for DbCassandraConsistencyLevelValues enum definition
 *
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 * @deprecated Use the DBCASSANDRACONSISTENCYLEVELVALUES_XXXXX constants rather than the DbCassandraConsistencyLevelValues.XXXXX for bundle minification.
 */
declare type DbCassandraConsistencyLevelValues = {
	/** all. */
	ALL: 'all';
	/** each_quorum. */
	EACH_QUORUM: 'each_quorum';
	/** quorum. */
	QUORUM: 'quorum';
	/** local_quorum. */
	LOCAL_QUORUM: 'local_quorum';
	/** one. */
	ONE: 'one';
	/** two. */
	TWO: 'two';
	/** three. */
	THREE: 'three';
	/** local_one. */
	LOCAL_ONE: 'local_one';
	/** any. */
	ANY: 'any';
	/** serial. */
	SERIAL: 'serial';
	/** local_serial. */
	LOCAL_SERIAL: 'local_serial';
};
/**
 * The constant map of values for DbCassandraConsistencyLevelValues.
 * @deprecated Use the DBCASSANDRACONSISTENCYLEVELVALUES_XXXXX constants rather than the DbCassandraConsistencyLevelValues.XXXXX for bundle minification.
 */
declare const DbCassandraConsistencyLevelValues: DbCassandraConsistencyLevelValues;
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_DATASOURCE.
 */
declare const FAASTRIGGERVALUES_DATASOURCE = "datasource";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_HTTP.
 */
declare const FAASTRIGGERVALUES_HTTP = "http";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_PUBSUB.
 */
declare const FAASTRIGGERVALUES_PUBSUB = "pubsub";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_TIMER.
 */
declare const FAASTRIGGERVALUES_TIMER = "timer";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_OTHER.
 */
declare const FAASTRIGGERVALUES_OTHER = "other";
/**
 * Identifies the Values for FaasTriggerValues enum definition
 *
 * Type of the trigger on which the function is executed.
 * @deprecated Use the FAASTRIGGERVALUES_XXXXX constants rather than the FaasTriggerValues.XXXXX for bundle minification.
 */
declare type FaasTriggerValues = {
	/** A response to some data source operation such as a database or filesystem read/write. */
	DATASOURCE: 'datasource';
	/** To provide an answer to an inbound HTTP request. */
	HTTP: 'http';
	/** A function is set to be executed when messages are sent to a messaging system. */
	PUBSUB: 'pubsub';
	/** A function is scheduled to be executed regularly. */
	TIMER: 'timer';
	/** If none of the others apply. */
	OTHER: 'other';
};
/**
 * The constant map of values for FaasTriggerValues.
 * @deprecated Use the FAASTRIGGERVALUES_XXXXX constants rather than the FaasTriggerValues.XXXXX for bundle minification.
 */
declare const FaasTriggerValues: FaasTriggerValues;
/**
 * Describes the type of the operation that was performed on the data.
 *
 * @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_INSERT.
 */
declare const FAASDOCUMENTOPERATIONVALUES_INSERT = "insert";
/**
 * Describes the type of the operation that was performed on the data.
 *
 * @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_EDIT.
 */
declare const FAASDOCUMENTOPERATIONVALUES_EDIT = "edit";
/**
 * Describes the type of the operation that was performed on the data.
 *
 * @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_DELETE.
 */
declare const FAASDOCUMENTOPERATIONVALUES_DELETE = "delete";
/**
 * Identifies the Values for FaasDocumentOperationValues enum definition
 *
 * Describes the type of the operation that was performed on the data.
 * @deprecated Use the FAASDOCUMENTOPERATIONVALUES_XXXXX constants rather than the FaasDocumentOperationValues.XXXXX for bundle minification.
 */
declare type FaasDocumentOperationValues = {
	/** When a new object is created. */
	INSERT: 'insert';
	/** When an object is modified. */
	EDIT: 'edit';
	/** When an object is deleted. */
	DELETE: 'delete';
};
/**
 * The constant map of values for FaasDocumentOperationValues.
 * @deprecated Use the FAASDOCUMENTOPERATIONVALUES_XXXXX constants rather than the FaasDocumentOperationValues.XXXXX for bundle minification.
 */
declare const FaasDocumentOperationValues: FaasDocumentOperationValues;
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_ALIBABA_CLOUD.
 */
declare const FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_AWS.
 */
declare const FAASINVOKEDPROVIDERVALUES_AWS = "aws";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_AZURE.
 */
declare const FAASINVOKEDPROVIDERVALUES_AZURE = "azure";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_GCP.
 */
declare const FAASINVOKEDPROVIDERVALUES_GCP = "gcp";
/**
 * Identifies the Values for FaasInvokedProviderValues enum definition
 *
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 * @deprecated Use the FAASINVOKEDPROVIDERVALUES_XXXXX constants rather than the FaasInvokedProviderValues.XXXXX for bundle minification.
 */
declare type FaasInvokedProviderValues = {
	/** Alibaba Cloud. */
	ALIBABA_CLOUD: 'alibaba_cloud';
	/** Amazon Web Services. */
	AWS: 'aws';
	/** Microsoft Azure. */
	AZURE: 'azure';
	/** Google Cloud Platform. */
	GCP: 'gcp';
};
/**
 * The constant map of values for FaasInvokedProviderValues.
 * @deprecated Use the FAASINVOKEDPROVIDERVALUES_XXXXX constants rather than the FaasInvokedProviderValues.XXXXX for bundle minification.
 */
declare const FaasInvokedProviderValues: FaasInvokedProviderValues;
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_IP_TCP.
 */
declare const NETTRANSPORTVALUES_IP_TCP = "ip_tcp";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_IP_UDP.
 */
declare const NETTRANSPORTVALUES_IP_UDP = "ip_udp";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_IP.
 */
declare const NETTRANSPORTVALUES_IP = "ip";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_UNIX.
 */
declare const NETTRANSPORTVALUES_UNIX = "unix";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_PIPE.
 */
declare const NETTRANSPORTVALUES_PIPE = "pipe";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_INPROC.
 */
declare const NETTRANSPORTVALUES_INPROC = "inproc";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_OTHER.
 */
declare const NETTRANSPORTVALUES_OTHER = "other";
/**
 * Identifies the Values for NetTransportValues enum definition
 *
 * Transport protocol used. See note below.
 * @deprecated Use the NETTRANSPORTVALUES_XXXXX constants rather than the NetTransportValues.XXXXX for bundle minification.
 */
declare type NetTransportValues = {
	/** ip_tcp. */
	IP_TCP: 'ip_tcp';
	/** ip_udp. */
	IP_UDP: 'ip_udp';
	/** Another IP-based protocol. */
	IP: 'ip';
	/** Unix Domain socket. See below. */
	UNIX: 'unix';
	/** Named or anonymous pipe. See note below. */
	PIPE: 'pipe';
	/** In-process communication. */
	INPROC: 'inproc';
	/** Something else (non IP-based). */
	OTHER: 'other';
};
/**
 * The constant map of values for NetTransportValues.
 * @deprecated Use the NETTRANSPORTVALUES_XXXXX constants rather than the NetTransportValues.XXXXX for bundle minification.
 */
declare const NetTransportValues: NetTransportValues;
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NET_HOST_CONNECTION_TYPE_VALUE_WIFI.
 */
declare const NETHOSTCONNECTIONTYPEVALUES_WIFI = "wifi";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NET_HOST_CONNECTION_TYPE_VALUE_WIRED.
 */
declare const NETHOSTCONNECTIONTYPEVALUES_WIRED = "wired";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NET_HOST_CONNECTION_TYPE_VALUE_CELL.
 */
declare const NETHOSTCONNECTIONTYPEVALUES_CELL = "cell";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NET_HOST_CONNECTION_TYPE_VALUE_UNAVAILABLE.
 */
declare const NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = "unavailable";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NET_HOST_CONNECTION_TYPE_VALUE_UNKNOWN.
 */
declare const NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = "unknown";
/**
 * Identifies the Values for NetHostConnectionTypeValues enum definition
 *
 * The internet connection type currently being used by the host.
 * @deprecated Use the NETHOSTCONNECTIONTYPEVALUES_XXXXX constants rather than the NetHostConnectionTypeValues.XXXXX for bundle minification.
 */
declare type NetHostConnectionTypeValues = {
	/** wifi. */
	WIFI: 'wifi';
	/** wired. */
	WIRED: 'wired';
	/** cell. */
	CELL: 'cell';
	/** unavailable. */
	UNAVAILABLE: 'unavailable';
	/** unknown. */
	UNKNOWN: 'unknown';
};
/**
 * The constant map of values for NetHostConnectionTypeValues.
 * @deprecated Use the NETHOSTCONNECTIONTYPEVALUES_XXXXX constants rather than the NetHostConnectionTypeValues.XXXXX for bundle minification.
 */
declare const NetHostConnectionTypeValues: NetHostConnectionTypeValues;
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_GPRS.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = "gprs";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_EDGE.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = "edge";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_UMTS.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = "umts";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_CDMA.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = "cdma";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_EVDO_0.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = "evdo_0";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_EVDO_A.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = "evdo_a";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_CDMA2000_1XRTT.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = "cdma2000_1xrtt";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_HSDPA.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = "hsdpa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_HSUPA.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = "hsupa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_HSPA.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = "hspa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_IDEN.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = "iden";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_EVDO_B.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = "evdo_b";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_LTE.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_LTE = "lte";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_EHRPD.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = "ehrpd";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_HSPAP.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = "hspap";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_GSM.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_GSM = "gsm";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_TD_SCDMA.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = "td_scdma";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_IWLAN.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = "iwlan";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_NR.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_NR = "nr";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_NRNSA.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = "nrnsa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NET_HOST_CONNECTION_SUBTYPE_VALUE_LTE_CA.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = "lte_ca";
/**
 * Identifies the Values for NetHostConnectionSubtypeValues enum definition
 *
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 * @deprecated Use the NETHOSTCONNECTIONSUBTYPEVALUES_XXXXX constants rather than the NetHostConnectionSubtypeValues.XXXXX for bundle minification.
 */
declare type NetHostConnectionSubtypeValues = {
	/** GPRS. */
	GPRS: 'gprs';
	/** EDGE. */
	EDGE: 'edge';
	/** UMTS. */
	UMTS: 'umts';
	/** CDMA. */
	CDMA: 'cdma';
	/** EVDO Rel. 0. */
	EVDO_0: 'evdo_0';
	/** EVDO Rev. A. */
	EVDO_A: 'evdo_a';
	/** CDMA2000 1XRTT. */
	CDMA2000_1XRTT: 'cdma2000_1xrtt';
	/** HSDPA. */
	HSDPA: 'hsdpa';
	/** HSUPA. */
	HSUPA: 'hsupa';
	/** HSPA. */
	HSPA: 'hspa';
	/** IDEN. */
	IDEN: 'iden';
	/** EVDO Rev. B. */
	EVDO_B: 'evdo_b';
	/** LTE. */
	LTE: 'lte';
	/** EHRPD. */
	EHRPD: 'ehrpd';
	/** HSPAP. */
	HSPAP: 'hspap';
	/** GSM. */
	GSM: 'gsm';
	/** TD-SCDMA. */
	TD_SCDMA: 'td_scdma';
	/** IWLAN. */
	IWLAN: 'iwlan';
	/** 5G NR (New Radio). */
	NR: 'nr';
	/** 5G NRNSA (New Radio Non-Standalone). */
	NRNSA: 'nrnsa';
	/** LTE CA. */
	LTE_CA: 'lte_ca';
};
/**
 * The constant map of values for NetHostConnectionSubtypeValues.
 * @deprecated Use the NETHOSTCONNECTIONSUBTYPEVALUES_XXXXX constants rather than the NetHostConnectionSubtypeValues.XXXXX for bundle minification.
 */
declare const NetHostConnectionSubtypeValues: NetHostConnectionSubtypeValues;
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_HTTP_1_0.
 */
declare const HTTPFLAVORVALUES_HTTP_1_0 = "1.0";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_HTTP_1_1.
 */
declare const HTTPFLAVORVALUES_HTTP_1_1 = "1.1";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_HTTP_2_0.
 */
declare const HTTPFLAVORVALUES_HTTP_2_0 = "2.0";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_SPDY.
 */
declare const HTTPFLAVORVALUES_SPDY = "SPDY";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_QUIC.
 */
declare const HTTPFLAVORVALUES_QUIC = "QUIC";
/**
 * Identifies the Values for HttpFlavorValues enum definition
 *
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 * @deprecated Use the HTTPFLAVORVALUES_XXXXX constants rather than the HttpFlavorValues.XXXXX for bundle minification.
 */
declare type HttpFlavorValues = {
	/** HTTP 1.0. */
	HTTP_1_0: '1.0';
	/** HTTP 1.1. */
	HTTP_1_1: '1.1';
	/** HTTP 2. */
	HTTP_2_0: '2.0';
	/** SPDY protocol. */
	SPDY: 'SPDY';
	/** QUIC protocol. */
	QUIC: 'QUIC';
};
/**
 * The constant map of values for HttpFlavorValues.
 * @deprecated Use the HTTPFLAVORVALUES_XXXXX constants rather than the HttpFlavorValues.XXXXX for bundle minification.
 */
declare const HttpFlavorValues: HttpFlavorValues;
/**
 * The kind of message destination.
 *
 * @deprecated Use MESSAGING_DESTINATION_KIND_VALUE_QUEUE.
 */
declare const MESSAGINGDESTINATIONKINDVALUES_QUEUE = "queue";
/**
 * The kind of message destination.
 *
 * @deprecated Use MESSAGING_DESTINATION_KIND_VALUE_TOPIC.
 */
declare const MESSAGINGDESTINATIONKINDVALUES_TOPIC = "topic";
/**
 * Identifies the Values for MessagingDestinationKindValues enum definition
 *
 * The kind of message destination.
 * @deprecated Use the MESSAGINGDESTINATIONKINDVALUES_XXXXX constants rather than the MessagingDestinationKindValues.XXXXX for bundle minification.
 */
declare type MessagingDestinationKindValues = {
	/** A message sent to a queue. */
	QUEUE: 'queue';
	/** A message sent to a topic. */
	TOPIC: 'topic';
};
/**
 * The constant map of values for MessagingDestinationKindValues.
 * @deprecated Use the MESSAGINGDESTINATIONKINDVALUES_XXXXX constants rather than the MessagingDestinationKindValues.XXXXX for bundle minification.
 */
declare const MessagingDestinationKindValues: MessagingDestinationKindValues;
/**
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
 *
 * @deprecated Use MESSAGING_OPERATION_VALUE_RECEIVE.
 */
declare const MESSAGINGOPERATIONVALUES_RECEIVE = "receive";
/**
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
 *
 * @deprecated Use MESSAGING_OPERATION_VALUE_PROCESS.
 */
declare const MESSAGINGOPERATIONVALUES_PROCESS = "process";
/**
 * Identifies the Values for MessagingOperationValues enum definition
 *
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
 * @deprecated Use the MESSAGINGOPERATIONVALUES_XXXXX constants rather than the MessagingOperationValues.XXXXX for bundle minification.
 */
declare type MessagingOperationValues = {
	/** receive. */
	RECEIVE: 'receive';
	/** process. */
	PROCESS: 'process';
};
/**
 * The constant map of values for MessagingOperationValues.
 * @deprecated Use the MESSAGINGOPERATIONVALUES_XXXXX constants rather than the MessagingOperationValues.XXXXX for bundle minification.
 */
declare const MessagingOperationValues: MessagingOperationValues;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_OK.
 */
declare const RPCGRPCSTATUSCODEVALUES_OK = 0;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_CANCELLED.
 */
declare const RPCGRPCSTATUSCODEVALUES_CANCELLED = 1;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNKNOWN.
 */
declare const RPCGRPCSTATUSCODEVALUES_UNKNOWN = 2;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_INVALID_ARGUMENT.
 */
declare const RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = 3;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_DEADLINE_EXCEEDED.
 */
declare const RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = 4;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_NOT_FOUND.
 */
declare const RPCGRPCSTATUSCODEVALUES_NOT_FOUND = 5;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_ALREADY_EXISTS.
 */
declare const RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = 6;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_PERMISSION_DENIED.
 */
declare const RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = 7;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_RESOURCE_EXHAUSTED.
 */
declare const RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = 8;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_FAILED_PRECONDITION.
 */
declare const RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = 9;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_ABORTED.
 */
declare const RPCGRPCSTATUSCODEVALUES_ABORTED = 10;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_OUT_OF_RANGE.
 */
declare const RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = 11;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNIMPLEMENTED.
 */
declare const RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = 12;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_INTERNAL.
 */
declare const RPCGRPCSTATUSCODEVALUES_INTERNAL = 13;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNAVAILABLE.
 */
declare const RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = 14;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_DATA_LOSS.
 */
declare const RPCGRPCSTATUSCODEVALUES_DATA_LOSS = 15;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNAUTHENTICATED.
 */
declare const RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = 16;
/**
 * Identifies the Values for RpcGrpcStatusCodeValues enum definition
 *
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 * @deprecated Use the RPCGRPCSTATUSCODEVALUES_XXXXX constants rather than the RpcGrpcStatusCodeValues.XXXXX for bundle minification.
 */
declare type RpcGrpcStatusCodeValues = {
	/** OK. */
	OK: 0;
	/** CANCELLED. */
	CANCELLED: 1;
	/** UNKNOWN. */
	UNKNOWN: 2;
	/** INVALID_ARGUMENT. */
	INVALID_ARGUMENT: 3;
	/** DEADLINE_EXCEEDED. */
	DEADLINE_EXCEEDED: 4;
	/** NOT_FOUND. */
	NOT_FOUND: 5;
	/** ALREADY_EXISTS. */
	ALREADY_EXISTS: 6;
	/** PERMISSION_DENIED. */
	PERMISSION_DENIED: 7;
	/** RESOURCE_EXHAUSTED. */
	RESOURCE_EXHAUSTED: 8;
	/** FAILED_PRECONDITION. */
	FAILED_PRECONDITION: 9;
	/** ABORTED. */
	ABORTED: 10;
	/** OUT_OF_RANGE. */
	OUT_OF_RANGE: 11;
	/** UNIMPLEMENTED. */
	UNIMPLEMENTED: 12;
	/** INTERNAL. */
	INTERNAL: 13;
	/** UNAVAILABLE. */
	UNAVAILABLE: 14;
	/** DATA_LOSS. */
	DATA_LOSS: 15;
	/** UNAUTHENTICATED. */
	UNAUTHENTICATED: 16;
};
/**
 * The constant map of values for RpcGrpcStatusCodeValues.
 * @deprecated Use the RPCGRPCSTATUSCODEVALUES_XXXXX constants rather than the RpcGrpcStatusCodeValues.XXXXX for bundle minification.
 */
declare const RpcGrpcStatusCodeValues: RpcGrpcStatusCodeValues;
/**
 * Whether this is a received or sent message.
 *
 * @deprecated Use MESSAGE_TYPE_VALUE_SENT.
 */
declare const MESSAGETYPEVALUES_SENT = "SENT";
/**
 * Whether this is a received or sent message.
 *
 * @deprecated Use MESSAGE_TYPE_VALUE_RECEIVED.
 */
declare const MESSAGETYPEVALUES_RECEIVED = "RECEIVED";
/**
 * Identifies the Values for MessageTypeValues enum definition
 *
 * Whether this is a received or sent message.
 * @deprecated Use the MESSAGETYPEVALUES_XXXXX constants rather than the MessageTypeValues.XXXXX for bundle minification.
 */
declare type MessageTypeValues = {
	/** sent. */
	SENT: 'SENT';
	/** received. */
	RECEIVED: 'RECEIVED';
};
/**
 * The constant map of values for MessageTypeValues.
 * @deprecated Use the MESSAGETYPEVALUES_XXXXX constants rather than the MessageTypeValues.XXXXX for bundle minification.
 */
declare const MessageTypeValues: MessageTypeValues;

/**
 * Name of the cloud provider.
 *
 * @deprecated use ATTR_CLOUD_PROVIDER
 */
declare const SEMRESATTRS_CLOUD_PROVIDER = "cloud.provider";
/**
 * The cloud account ID the resource is assigned to.
 *
 * @deprecated use ATTR_CLOUD_ACCOUNT_ID
 */
declare const SEMRESATTRS_CLOUD_ACCOUNT_ID = "cloud.account.id";
/**
 * The geographical region the resource is running. Refer to your provider&#39;s docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/geographies/), or [Google Cloud regions](https://cloud.google.com/about/locations).
 *
 * @deprecated use ATTR_CLOUD_REGION
 */
declare const SEMRESATTRS_CLOUD_REGION = "cloud.region";
/**
 * Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
 *
 * Note: Availability zones are called &#34;zones&#34; on Alibaba Cloud and Google Cloud.
 *
 * @deprecated use ATTR_CLOUD_AVAILABILITY_ZONE
 */
declare const SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated use ATTR_CLOUD_PLATFORM
 */
declare const SEMRESATTRS_CLOUD_PLATFORM = "cloud.platform";
/**
 * The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
 *
 * @deprecated use ATTR_AWS_ECS_CONTAINER_ARN
 */
declare const SEMRESATTRS_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
/**
 * The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
 *
 * @deprecated use ATTR_AWS_ECS_CLUSTER_ARN
 */
declare const SEMRESATTRS_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
/**
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 *
 * @deprecated use ATTR_AWS_ECS_LAUNCHTYPE
 */
declare const SEMRESATTRS_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
/**
 * The ARN of an [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html).
 *
 * @deprecated use ATTR_AWS_ECS_TASK_ARN
 */
declare const SEMRESATTRS_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
/**
 * The task definition family this task definition is a member of.
 *
 * @deprecated use ATTR_AWS_ECS_TASK_FAMILY
 */
declare const SEMRESATTRS_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
/**
 * The revision for this task definition.
 *
 * @deprecated use ATTR_AWS_ECS_TASK_REVISION
 */
declare const SEMRESATTRS_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
/**
 * The ARN of an EKS cluster.
 *
 * @deprecated use ATTR_AWS_EKS_CLUSTER_ARN
 */
declare const SEMRESATTRS_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
/**
 * The name(s) of the AWS log group(s) an application is writing to.
 *
 * Note: Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
 *
 * @deprecated use ATTR_AWS_LOG_GROUP_NAMES
 */
declare const SEMRESATTRS_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
/**
 * The Amazon Resource Name(s) (ARN) of the AWS log group(s).
 *
 * Note: See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
 *
 * @deprecated use ATTR_AWS_LOG_GROUP_ARNS
 */
declare const SEMRESATTRS_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
/**
 * The name(s) of the AWS log stream(s) an application is writing to.
 *
 * @deprecated use ATTR_AWS_LOG_STREAM_NAMES
 */
declare const SEMRESATTRS_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
/**
 * The ARN(s) of the AWS log stream(s).
 *
 * Note: See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
 *
 * @deprecated use ATTR_AWS_LOG_STREAM_ARNS
 */
declare const SEMRESATTRS_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
/**
 * Container name.
 *
 * @deprecated use ATTR_CONTAINER_NAME
 */
declare const SEMRESATTRS_CONTAINER_NAME = "container.name";
/**
 * Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/reference/run/#container-identification). The UUID might be abbreviated.
 *
 * @deprecated use ATTR_CONTAINER_ID
 */
declare const SEMRESATTRS_CONTAINER_ID = "container.id";
/**
 * The container runtime managing this container.
 *
 * @deprecated use ATTR_CONTAINER_RUNTIME
 */
declare const SEMRESATTRS_CONTAINER_RUNTIME = "container.runtime";
/**
 * Name of the image the container was built on.
 *
 * @deprecated use ATTR_CONTAINER_IMAGE_NAME
 */
declare const SEMRESATTRS_CONTAINER_IMAGE_NAME = "container.image.name";
/**
 * Container image tag.
 *
 * @deprecated use ATTR_CONTAINER_IMAGE_TAG
 */
declare const SEMRESATTRS_CONTAINER_IMAGE_TAG = "container.image.tag";
/**
 * Name of the [deployment environment](https://en.wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
 *
 * @deprecated use ATTR_DEPLOYMENT_ENVIRONMENT
 */
declare const SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
/**
 * A unique identifier representing the device.
 *
 * Note: The device identifier MUST only be defined using the values outlined below. This value is not an advertising identifier and MUST NOT be used as such. On iOS (Swift or Objective-C), this value MUST be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value MUST be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
 *
 * @deprecated use ATTR_DEVICE_ID
 */
declare const SEMRESATTRS_DEVICE_ID = "device.id";
/**
 * The model identifier for the device.
 *
 * Note: It&#39;s recommended this value represents a machine readable version of the model identifier rather than the market or consumer-friendly name of the device.
 *
 * @deprecated use ATTR_DEVICE_MODEL_IDENTIFIER
 */
declare const SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
/**
 * The marketing name for the device model.
 *
 * Note: It&#39;s recommended this value represents a human readable version of the device model rather than a machine readable alternative.
 *
 * @deprecated use ATTR_DEVICE_MODEL_NAME
 */
declare const SEMRESATTRS_DEVICE_MODEL_NAME = "device.model.name";
/**
 * The name of the single function that this runtime instance executes.
 *
 * Note: This is the name of the function as configured/deployed on the FaaS platform and is usually different from the name of the callback function (which may be stored in the [`code.namespace`/`code.function`](../../trace/semantic_conventions/span-general.md#source-code-attributes) span attributes).
 *
 * @deprecated use ATTR_FAAS_NAME
 */
declare const SEMRESATTRS_FAAS_NAME = "faas.name";
/**
* The unique ID of the single function that this runtime instance executes.
*
* Note: Depending on the cloud provider, use:

* **AWS Lambda:** The function [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html).
Take care not to use the &#34;invoked ARN&#34; directly but replace any
[alias suffix](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html) with the resolved function version, as the same runtime instance may be invokable with multiple
different aliases.
* **GCP:** The [URI of the resource](https://cloud.google.com/iam/docs/full-resource-names)
* **Azure:** The [Fully Qualified Resource ID](https://docs.microsoft.com/en-us/rest/api/resources/resources/get-by-id).

On some providers, it may not be possible to determine the full ID at startup,
which is why this field cannot be made required. For example, on AWS the account ID
part of the ARN is not available without calling another AWS API
which may be deemed too slow for a short-running lambda function.
As an alternative, consider setting `faas.id` as a span attribute instead.
*
* @deprecated use ATTR_FAAS_ID
*/
declare const SEMRESATTRS_FAAS_ID = "faas.id";
/**
* The immutable version of the function being executed.
*
* Note: Depending on the cloud provider and platform, use:

* **AWS Lambda:** The [function version](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
(an integer represented as a decimal string).
* **Google Cloud Run:** The [revision](https://cloud.google.com/run/docs/managing/revisions)
(i.e., the function name plus the revision suffix).
* **Google Cloud Functions:** The value of the
[`K_REVISION` environment variable](https://cloud.google.com/functions/docs/env-var#runtime_environment_variables_set_automatically).
* **Azure Functions:** Not applicable. Do not set this attribute.
*
* @deprecated use ATTR_FAAS_VERSION
*/
declare const SEMRESATTRS_FAAS_VERSION = "faas.version";
/**
 * The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
 *
 * Note: * **AWS Lambda:** Use the (full) log stream name.
 *
 * @deprecated use ATTR_FAAS_INSTANCE
 */
declare const SEMRESATTRS_FAAS_INSTANCE = "faas.instance";
/**
 * The amount of memory available to the serverless function in MiB.
 *
 * Note: It&#39;s recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information.
 *
 * @deprecated use ATTR_FAAS_MAX_MEMORY
 */
declare const SEMRESATTRS_FAAS_MAX_MEMORY = "faas.max_memory";
/**
 * Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider.
 *
 * @deprecated use ATTR_HOST_ID
 */
declare const SEMRESATTRS_HOST_ID = "host.id";
/**
 * Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
 *
 * @deprecated use ATTR_HOST_NAME
 */
declare const SEMRESATTRS_HOST_NAME = "host.name";
/**
 * Type of host. For Cloud, this must be the machine type.
 *
 * @deprecated use ATTR_HOST_TYPE
 */
declare const SEMRESATTRS_HOST_TYPE = "host.type";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated use ATTR_HOST_ARCH
 */
declare const SEMRESATTRS_HOST_ARCH = "host.arch";
/**
 * Name of the VM image or OS install the host was instantiated from.
 *
 * @deprecated use ATTR_HOST_IMAGE_NAME
 */
declare const SEMRESATTRS_HOST_IMAGE_NAME = "host.image.name";
/**
 * VM image ID. For Cloud, this value is from the provider.
 *
 * @deprecated use ATTR_HOST_IMAGE_ID
 */
declare const SEMRESATTRS_HOST_IMAGE_ID = "host.image.id";
/**
 * The version string of the VM image as defined in [Version Attributes](README.md#version-attributes).
 *
 * @deprecated use ATTR_HOST_IMAGE_VERSION
 */
declare const SEMRESATTRS_HOST_IMAGE_VERSION = "host.image.version";
/**
 * The name of the cluster.
 *
 * @deprecated use ATTR_K8S_CLUSTER_NAME
 */
declare const SEMRESATTRS_K8S_CLUSTER_NAME = "k8s.cluster.name";
/**
 * The name of the Node.
 *
 * @deprecated use ATTR_K8S_NODE_NAME
 */
declare const SEMRESATTRS_K8S_NODE_NAME = "k8s.node.name";
/**
 * The UID of the Node.
 *
 * @deprecated use ATTR_K8S_NODE_UID
 */
declare const SEMRESATTRS_K8S_NODE_UID = "k8s.node.uid";
/**
 * The name of the namespace that the pod is running in.
 *
 * @deprecated use ATTR_K8S_NAMESPACE_NAME
 */
declare const SEMRESATTRS_K8S_NAMESPACE_NAME = "k8s.namespace.name";
/**
 * The UID of the Pod.
 *
 * @deprecated use ATTR_K8S_POD_UID
 */
declare const SEMRESATTRS_K8S_POD_UID = "k8s.pod.uid";
/**
 * The name of the Pod.
 *
 * @deprecated use ATTR_K8S_POD_NAME
 */
declare const SEMRESATTRS_K8S_POD_NAME = "k8s.pod.name";
/**
 * The name of the Container in a Pod template.
 *
 * @deprecated use ATTR_K8S_CONTAINER_NAME
 */
declare const SEMRESATTRS_K8S_CONTAINER_NAME = "k8s.container.name";
/**
 * The UID of the ReplicaSet.
 *
 * @deprecated use ATTR_K8S_REPLICASET_UID
 */
declare const SEMRESATTRS_K8S_REPLICASET_UID = "k8s.replicaset.uid";
/**
 * The name of the ReplicaSet.
 *
 * @deprecated use ATTR_K8S_REPLICASET_NAME
 */
declare const SEMRESATTRS_K8S_REPLICASET_NAME = "k8s.replicaset.name";
/**
 * The UID of the Deployment.
 *
 * @deprecated use ATTR_K8S_DEPLOYMENT_UID
 */
declare const SEMRESATTRS_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
/**
 * The name of the Deployment.
 *
 * @deprecated use ATTR_K8S_DEPLOYMENT_NAME
 */
declare const SEMRESATTRS_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
/**
 * The UID of the StatefulSet.
 *
 * @deprecated use ATTR_K8S_STATEFULSET_UID
 */
declare const SEMRESATTRS_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
/**
 * The name of the StatefulSet.
 *
 * @deprecated use ATTR_K8S_STATEFULSET_NAME
 */
declare const SEMRESATTRS_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
/**
 * The UID of the DaemonSet.
 *
 * @deprecated use ATTR_K8S_DAEMONSET_UID
 */
declare const SEMRESATTRS_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
/**
 * The name of the DaemonSet.
 *
 * @deprecated use ATTR_K8S_DAEMONSET_NAME
 */
declare const SEMRESATTRS_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
/**
 * The UID of the Job.
 *
 * @deprecated use ATTR_K8S_JOB_UID
 */
declare const SEMRESATTRS_K8S_JOB_UID = "k8s.job.uid";
/**
 * The name of the Job.
 *
 * @deprecated use ATTR_K8S_JOB_NAME
 */
declare const SEMRESATTRS_K8S_JOB_NAME = "k8s.job.name";
/**
 * The UID of the CronJob.
 *
 * @deprecated use ATTR_K8S_CRONJOB_UID
 */
declare const SEMRESATTRS_K8S_CRONJOB_UID = "k8s.cronjob.uid";
/**
 * The name of the CronJob.
 *
 * @deprecated use ATTR_K8S_CRONJOB_NAME
 */
declare const SEMRESATTRS_K8S_CRONJOB_NAME = "k8s.cronjob.name";
/**
 * The operating system type.
 *
 * @deprecated use ATTR_OS_TYPE
 */
declare const SEMRESATTRS_OS_TYPE = "os.type";
/**
 * Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
 *
 * @deprecated use ATTR_OS_DESCRIPTION
 */
declare const SEMRESATTRS_OS_DESCRIPTION = "os.description";
/**
 * Human readable operating system name.
 *
 * @deprecated use ATTR_OS_NAME
 */
declare const SEMRESATTRS_OS_NAME = "os.name";
/**
 * The version string of the operating system as defined in [Version Attributes](../../resource/semantic_conventions/README.md#version-attributes).
 *
 * @deprecated use ATTR_OS_VERSION
 */
declare const SEMRESATTRS_OS_VERSION = "os.version";
/**
 * Process identifier (PID).
 *
 * @deprecated use ATTR_PROCESS_PID
 */
declare const SEMRESATTRS_PROCESS_PID = "process.pid";
/**
 * The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
 *
 * @deprecated use ATTR_PROCESS_EXECUTABLE_NAME
 */
declare const SEMRESATTRS_PROCESS_EXECUTABLE_NAME = "process.executable.name";
/**
 * The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
 *
 * @deprecated use ATTR_PROCESS_EXECUTABLE_PATH
 */
declare const SEMRESATTRS_PROCESS_EXECUTABLE_PATH = "process.executable.path";
/**
 * The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
 *
 * @deprecated use ATTR_PROCESS_COMMAND
 */
declare const SEMRESATTRS_PROCESS_COMMAND = "process.command";
/**
 * The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
 *
 * @deprecated use ATTR_PROCESS_COMMAND_LINE
 */
declare const SEMRESATTRS_PROCESS_COMMAND_LINE = "process.command_line";
/**
 * All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
 *
 * @deprecated use ATTR_PROCESS_COMMAND_ARGS
 */
declare const SEMRESATTRS_PROCESS_COMMAND_ARGS = "process.command_args";
/**
 * The username of the user that owns the process.
 *
 * @deprecated use ATTR_PROCESS_OWNER
 */
declare const SEMRESATTRS_PROCESS_OWNER = "process.owner";
/**
 * The name of the runtime of this process. For compiled native binaries, this SHOULD be the name of the compiler.
 *
 * @deprecated use ATTR_PROCESS_RUNTIME_NAME
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_NAME = "process.runtime.name";
/**
 * The version of the runtime of this process, as returned by the runtime without modification.
 *
 * @deprecated use ATTR_PROCESS_RUNTIME_VERSION
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_VERSION = "process.runtime.version";
/**
 * An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
 *
 * @deprecated use ATTR_PROCESS_RUNTIME_DESCRIPTION
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
/**
 * Logical name of the service.
 *
 * Note: MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs MUST fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md#process), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value MUST be set to `unknown_service`.
 *
 * @deprecated use ATTR_SERVICE_NAME
 */
declare const SEMRESATTRS_SERVICE_NAME = "service.name";
/**
 * A namespace for `service.name`.
 *
 * Note: A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
 *
 * @deprecated use ATTR_SERVICE_NAMESPACE
 */
declare const SEMRESATTRS_SERVICE_NAMESPACE = "service.namespace";
/**
 * The string ID of the service instance.
 *
 * Note: MUST be unique for each instance of the same `service.namespace,service.name` pair (in other words `service.namespace,service.name,service.instance.id` triplet MUST be globally unique). The ID helps to distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled service). It is preferable for the ID to be persistent and stay the same for the lifetime of the service instance, however it is acceptable that the ID is ephemeral and changes during important lifetime events for the service (e.g. service restarts). If the service has no inherent unique ID that can be used as the value of this attribute it is recommended to generate a random Version 1 or Version 4 RFC 4122 UUID (services aiming for reproducible UUIDs may also use Version 5, see RFC 4122 for more recommendations).
 *
 * @deprecated use ATTR_SERVICE_INSTANCE_ID
 */
declare const SEMRESATTRS_SERVICE_INSTANCE_ID = "service.instance.id";
/**
 * The version string of the service API or implementation.
 *
 * @deprecated use ATTR_SERVICE_VERSION
 */
declare const SEMRESATTRS_SERVICE_VERSION = "service.version";
/**
 * The name of the telemetry SDK as defined above.
 *
 * @deprecated use ATTR_TELEMETRY_SDK_NAME
 */
declare const SEMRESATTRS_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated use ATTR_TELEMETRY_SDK_LANGUAGE
 */
declare const SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
/**
 * The version string of the telemetry SDK.
 *
 * @deprecated use ATTR_TELEMETRY_SDK_VERSION
 */
declare const SEMRESATTRS_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
/**
 * The version string of the auto instrumentation agent, if used.
 *
 * @deprecated use ATTR_TELEMETRY_AUTO_VERSION
 */
declare const SEMRESATTRS_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
/**
 * The name of the web engine.
 *
 * @deprecated use ATTR_WEBENGINE_NAME
 */
declare const SEMRESATTRS_WEBENGINE_NAME = "webengine.name";
/**
 * The version of the web engine.
 *
 * @deprecated use ATTR_WEBENGINE_VERSION
 */
declare const SEMRESATTRS_WEBENGINE_VERSION = "webengine.version";
/**
 * Additional description of the web engine (e.g. detailed version and edition information).
 *
 * @deprecated use ATTR_WEBENGINE_DESCRIPTION
 */
declare const SEMRESATTRS_WEBENGINE_DESCRIPTION = "webengine.description";
/**
 * Definition of available values for SemanticResourceAttributes
 * This type is used for backward compatibility, you should use the individual exported
 * constants SemanticResourceAttributes_XXXXX rather than the exported constant map. As any single reference
 * to a constant map value will result in all strings being included into your bundle.
 * @deprecated Use the SEMRESATTRS_XXXXX constants rather than the SemanticResourceAttributes.XXXXX for bundle minification.
 */
declare type SemanticResourceAttributes = {
	/**
	* Name of the cloud provider.
	*/
	CLOUD_PROVIDER: 'cloud.provider';
	/**
	* The cloud account ID the resource is assigned to.
	*/
	CLOUD_ACCOUNT_ID: 'cloud.account.id';
	/**
	* The geographical region the resource is running. Refer to your provider&#39;s docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/geographies/), or [Google Cloud regions](https://cloud.google.com/about/locations).
	*/
	CLOUD_REGION: 'cloud.region';
	/**
	* Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
	*
	* Note: Availability zones are called &#34;zones&#34; on Alibaba Cloud and Google Cloud.
	*/
	CLOUD_AVAILABILITY_ZONE: 'cloud.availability_zone';
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*/
	CLOUD_PLATFORM: 'cloud.platform';
	/**
	* The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
	*/
	AWS_ECS_CONTAINER_ARN: 'aws.ecs.container.arn';
	/**
	* The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
	*/
	AWS_ECS_CLUSTER_ARN: 'aws.ecs.cluster.arn';
	/**
	* The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
	*/
	AWS_ECS_LAUNCHTYPE: 'aws.ecs.launchtype';
	/**
	* The ARN of an [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html).
	*/
	AWS_ECS_TASK_ARN: 'aws.ecs.task.arn';
	/**
	* The task definition family this task definition is a member of.
	*/
	AWS_ECS_TASK_FAMILY: 'aws.ecs.task.family';
	/**
	* The revision for this task definition.
	*/
	AWS_ECS_TASK_REVISION: 'aws.ecs.task.revision';
	/**
	* The ARN of an EKS cluster.
	*/
	AWS_EKS_CLUSTER_ARN: 'aws.eks.cluster.arn';
	/**
	* The name(s) of the AWS log group(s) an application is writing to.
	*
	* Note: Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
	*/
	AWS_LOG_GROUP_NAMES: 'aws.log.group.names';
	/**
	* The Amazon Resource Name(s) (ARN) of the AWS log group(s).
	*
	* Note: See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
	*/
	AWS_LOG_GROUP_ARNS: 'aws.log.group.arns';
	/**
	* The name(s) of the AWS log stream(s) an application is writing to.
	*/
	AWS_LOG_STREAM_NAMES: 'aws.log.stream.names';
	/**
	* The ARN(s) of the AWS log stream(s).
	*
	* Note: See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
	*/
	AWS_LOG_STREAM_ARNS: 'aws.log.stream.arns';
	/**
	* Container name.
	*/
	CONTAINER_NAME: 'container.name';
	/**
	* Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/reference/run/#container-identification). The UUID might be abbreviated.
	*/
	CONTAINER_ID: 'container.id';
	/**
	* The container runtime managing this container.
	*/
	CONTAINER_RUNTIME: 'container.runtime';
	/**
	* Name of the image the container was built on.
	*/
	CONTAINER_IMAGE_NAME: 'container.image.name';
	/**
	* Container image tag.
	*/
	CONTAINER_IMAGE_TAG: 'container.image.tag';
	/**
	* Name of the [deployment environment](https://en.wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
	*/
	DEPLOYMENT_ENVIRONMENT: 'deployment.environment';
	/**
	* A unique identifier representing the device.
	*
	* Note: The device identifier MUST only be defined using the values outlined below. This value is not an advertising identifier and MUST NOT be used as such. On iOS (Swift or Objective-C), this value MUST be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value MUST be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
	*/
	DEVICE_ID: 'device.id';
	/**
	* The model identifier for the device.
	*
	* Note: It&#39;s recommended this value represents a machine readable version of the model identifier rather than the market or consumer-friendly name of the device.
	*/
	DEVICE_MODEL_IDENTIFIER: 'device.model.identifier';
	/**
	* The marketing name for the device model.
	*
	* Note: It&#39;s recommended this value represents a human readable version of the device model rather than a machine readable alternative.
	*/
	DEVICE_MODEL_NAME: 'device.model.name';
	/**
	* The name of the single function that this runtime instance executes.
	*
	* Note: This is the name of the function as configured/deployed on the FaaS platform and is usually different from the name of the callback function (which may be stored in the [`code.namespace`/`code.function`](../../trace/semantic_conventions/span-general.md#source-code-attributes) span attributes).
	*/
	FAAS_NAME: 'faas.name';
	/**
	* The unique ID of the single function that this runtime instance executes.
	*
	* Note: Depending on the cloud provider, use:

* **AWS Lambda:** The function [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html).
Take care not to use the &#34;invoked ARN&#34; directly but replace any
[alias suffix](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html) with the resolved function version, as the same runtime instance may be invokable with multiple
different aliases.
* **GCP:** The [URI of the resource](https://cloud.google.com/iam/docs/full-resource-names)
* **Azure:** The [Fully Qualified Resource ID](https://docs.microsoft.com/en-us/rest/api/resources/resources/get-by-id).

On some providers, it may not be possible to determine the full ID at startup,
which is why this field cannot be made required. For example, on AWS the account ID
part of the ARN is not available without calling another AWS API
which may be deemed too slow for a short-running lambda function.
As an alternative, consider setting `faas.id` as a span attribute instead.
	*/
	FAAS_ID: 'faas.id';
	/**
	* The immutable version of the function being executed.
	*
	* Note: Depending on the cloud provider and platform, use:

* **AWS Lambda:** The [function version](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
	(an integer represented as a decimal string).
* **Google Cloud Run:** The [revision](https://cloud.google.com/run/docs/managing/revisions)
	(i.e., the function name plus the revision suffix).
* **Google Cloud Functions:** The value of the
	[`K_REVISION` environment variable](https://cloud.google.com/functions/docs/env-var#runtime_environment_variables_set_automatically).
* **Azure Functions:** Not applicable. Do not set this attribute.
	*/
	FAAS_VERSION: 'faas.version';
	/**
	* The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
	*
	* Note: * **AWS Lambda:** Use the (full) log stream name.
	*/
	FAAS_INSTANCE: 'faas.instance';
	/**
	* The amount of memory available to the serverless function in MiB.
	*
	* Note: It&#39;s recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information.
	*/
	FAAS_MAX_MEMORY: 'faas.max_memory';
	/**
	* Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider.
	*/
	HOST_ID: 'host.id';
	/**
	* Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
	*/
	HOST_NAME: 'host.name';
	/**
	* Type of host. For Cloud, this must be the machine type.
	*/
	HOST_TYPE: 'host.type';
	/**
	* The CPU architecture the host system is running on.
	*/
	HOST_ARCH: 'host.arch';
	/**
	* Name of the VM image or OS install the host was instantiated from.
	*/
	HOST_IMAGE_NAME: 'host.image.name';
	/**
	* VM image ID. For Cloud, this value is from the provider.
	*/
	HOST_IMAGE_ID: 'host.image.id';
	/**
	* The version string of the VM image as defined in [Version Attributes](README.md#version-attributes).
	*/
	HOST_IMAGE_VERSION: 'host.image.version';
	/**
	* The name of the cluster.
	*/
	K8S_CLUSTER_NAME: 'k8s.cluster.name';
	/**
	* The name of the Node.
	*/
	K8S_NODE_NAME: 'k8s.node.name';
	/**
	* The UID of the Node.
	*/
	K8S_NODE_UID: 'k8s.node.uid';
	/**
	* The name of the namespace that the pod is running in.
	*/
	K8S_NAMESPACE_NAME: 'k8s.namespace.name';
	/**
	* The UID of the Pod.
	*/
	K8S_POD_UID: 'k8s.pod.uid';
	/**
	* The name of the Pod.
	*/
	K8S_POD_NAME: 'k8s.pod.name';
	/**
	* The name of the Container in a Pod template.
	*/
	K8S_CONTAINER_NAME: 'k8s.container.name';
	/**
	* The UID of the ReplicaSet.
	*/
	K8S_REPLICASET_UID: 'k8s.replicaset.uid';
	/**
	* The name of the ReplicaSet.
	*/
	K8S_REPLICASET_NAME: 'k8s.replicaset.name';
	/**
	* The UID of the Deployment.
	*/
	K8S_DEPLOYMENT_UID: 'k8s.deployment.uid';
	/**
	* The name of the Deployment.
	*/
	K8S_DEPLOYMENT_NAME: 'k8s.deployment.name';
	/**
	* The UID of the StatefulSet.
	*/
	K8S_STATEFULSET_UID: 'k8s.statefulset.uid';
	/**
	* The name of the StatefulSet.
	*/
	K8S_STATEFULSET_NAME: 'k8s.statefulset.name';
	/**
	* The UID of the DaemonSet.
	*/
	K8S_DAEMONSET_UID: 'k8s.daemonset.uid';
	/**
	* The name of the DaemonSet.
	*/
	K8S_DAEMONSET_NAME: 'k8s.daemonset.name';
	/**
	* The UID of the Job.
	*/
	K8S_JOB_UID: 'k8s.job.uid';
	/**
	* The name of the Job.
	*/
	K8S_JOB_NAME: 'k8s.job.name';
	/**
	* The UID of the CronJob.
	*/
	K8S_CRONJOB_UID: 'k8s.cronjob.uid';
	/**
	* The name of the CronJob.
	*/
	K8S_CRONJOB_NAME: 'k8s.cronjob.name';
	/**
	* The operating system type.
	*/
	OS_TYPE: 'os.type';
	/**
	* Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
	*/
	OS_DESCRIPTION: 'os.description';
	/**
	* Human readable operating system name.
	*/
	OS_NAME: 'os.name';
	/**
	* The version string of the operating system as defined in [Version Attributes](../../resource/semantic_conventions/README.md#version-attributes).
	*/
	OS_VERSION: 'os.version';
	/**
	* Process identifier (PID).
	*/
	PROCESS_PID: 'process.pid';
	/**
	* The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
	*/
	PROCESS_EXECUTABLE_NAME: 'process.executable.name';
	/**
	* The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
	*/
	PROCESS_EXECUTABLE_PATH: 'process.executable.path';
	/**
	* The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
	*/
	PROCESS_COMMAND: 'process.command';
	/**
	* The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
	*/
	PROCESS_COMMAND_LINE: 'process.command_line';
	/**
	* All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
	*/
	PROCESS_COMMAND_ARGS: 'process.command_args';
	/**
	* The username of the user that owns the process.
	*/
	PROCESS_OWNER: 'process.owner';
	/**
	* The name of the runtime of this process. For compiled native binaries, this SHOULD be the name of the compiler.
	*/
	PROCESS_RUNTIME_NAME: 'process.runtime.name';
	/**
	* The version of the runtime of this process, as returned by the runtime without modification.
	*/
	PROCESS_RUNTIME_VERSION: 'process.runtime.version';
	/**
	* An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
	*/
	PROCESS_RUNTIME_DESCRIPTION: 'process.runtime.description';
	/**
	* Logical name of the service.
	*
	* Note: MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs MUST fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md#process), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value MUST be set to `unknown_service`.
	*/
	SERVICE_NAME: 'service.name';
	/**
	* A namespace for `service.name`.
	*
	* Note: A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
	*/
	SERVICE_NAMESPACE: 'service.namespace';
	/**
	* The string ID of the service instance.
	*
	* Note: MUST be unique for each instance of the same `service.namespace,service.name` pair (in other words `service.namespace,service.name,service.instance.id` triplet MUST be globally unique). The ID helps to distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled service). It is preferable for the ID to be persistent and stay the same for the lifetime of the service instance, however it is acceptable that the ID is ephemeral and changes during important lifetime events for the service (e.g. service restarts). If the service has no inherent unique ID that can be used as the value of this attribute it is recommended to generate a random Version 1 or Version 4 RFC 4122 UUID (services aiming for reproducible UUIDs may also use Version 5, see RFC 4122 for more recommendations).
	*/
	SERVICE_INSTANCE_ID: 'service.instance.id';
	/**
	* The version string of the service API or implementation.
	*/
	SERVICE_VERSION: 'service.version';
	/**
	* The name of the telemetry SDK as defined above.
	*/
	TELEMETRY_SDK_NAME: 'telemetry.sdk.name';
	/**
	* The language of the telemetry SDK.
	*/
	TELEMETRY_SDK_LANGUAGE: 'telemetry.sdk.language';
	/**
	* The version string of the telemetry SDK.
	*/
	TELEMETRY_SDK_VERSION: 'telemetry.sdk.version';
	/**
	* The version string of the auto instrumentation agent, if used.
	*/
	TELEMETRY_AUTO_VERSION: 'telemetry.auto.version';
	/**
	* The name of the web engine.
	*/
	WEBENGINE_NAME: 'webengine.name';
	/**
	* The version of the web engine.
	*/
	WEBENGINE_VERSION: 'webengine.version';
	/**
	* Additional description of the web engine (e.g. detailed version and edition information).
	*/
	WEBENGINE_DESCRIPTION: 'webengine.description';
};
/**
 * Create exported Value Map for SemanticResourceAttributes values
 * @deprecated Use the SEMRESATTRS_XXXXX constants rather than the SemanticResourceAttributes.XXXXX for bundle minification
 */
declare const SemanticResourceAttributes: SemanticResourceAttributes;
/**
 * Name of the cloud provider.
 *
 * @deprecated Use CLOUD_PROVIDER_VALUE_ALIBABA_CLOUD.
 */
declare const CLOUDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
/**
 * Name of the cloud provider.
 *
 * @deprecated Use CLOUD_PROVIDER_VALUE_AWS.
 */
declare const CLOUDPROVIDERVALUES_AWS = "aws";
/**
 * Name of the cloud provider.
 *
 * @deprecated Use CLOUD_PROVIDER_VALUE_AZURE.
 */
declare const CLOUDPROVIDERVALUES_AZURE = "azure";
/**
 * Name of the cloud provider.
 *
 * @deprecated Use CLOUD_PROVIDER_VALUE_GCP.
 */
declare const CLOUDPROVIDERVALUES_GCP = "gcp";
/**
 * Identifies the Values for CloudProviderValues enum definition
 *
 * Name of the cloud provider.
 * @deprecated Use the CLOUDPROVIDERVALUES_XXXXX constants rather than the CloudProviderValues.XXXXX for bundle minification.
 */
declare type CloudProviderValues = {
	/** Alibaba Cloud. */
	ALIBABA_CLOUD: 'alibaba_cloud';
	/** Amazon Web Services. */
	AWS: 'aws';
	/** Microsoft Azure. */
	AZURE: 'azure';
	/** Google Cloud Platform. */
	GCP: 'gcp';
};
/**
 * The constant map of values for CloudProviderValues.
 * @deprecated Use the CLOUDPROVIDERVALUES_XXXXX constants rather than the CloudProviderValues.XXXXX for bundle minification.
 */
declare const CloudProviderValues: CloudProviderValues;
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_ECS.
 */
declare const CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_FC.
 */
declare const CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_EC2.
 */
declare const CLOUDPLATFORMVALUES_AWS_EC2 = "aws_ec2";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_ECS.
 */
declare const CLOUDPLATFORMVALUES_AWS_ECS = "aws_ecs";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_EKS.
 */
declare const CLOUDPLATFORMVALUES_AWS_EKS = "aws_eks";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_LAMBDA.
 */
declare const CLOUDPLATFORMVALUES_AWS_LAMBDA = "aws_lambda";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_ELASTIC_BEANSTALK.
 */
declare const CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_VM.
 */
declare const CLOUDPLATFORMVALUES_AZURE_VM = "azure_vm";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_INSTANCES.
 */
declare const CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = "azure_container_instances";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_AKS.
 */
declare const CLOUDPLATFORMVALUES_AZURE_AKS = "azure_aks";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_FUNCTIONS.
 */
declare const CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = "azure_functions";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_APP_SERVICE.
 */
declare const CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = "azure_app_service";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_COMPUTE_ENGINE.
 */
declare const CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_CLOUD_RUN.
 */
declare const CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = "gcp_cloud_run";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_KUBERNETES_ENGINE.
 */
declare const CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_CLOUD_FUNCTIONS.
 */
declare const CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_APP_ENGINE.
 */
declare const CLOUDPLATFORMVALUES_GCP_APP_ENGINE = "gcp_app_engine";
/**
 * Identifies the Values for CloudPlatformValues enum definition
 *
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 * @deprecated Use the CLOUDPLATFORMVALUES_XXXXX constants rather than the CloudPlatformValues.XXXXX for bundle minification.
 */
declare type CloudPlatformValues = {
	/** Alibaba Cloud Elastic Compute Service. */
	ALIBABA_CLOUD_ECS: 'alibaba_cloud_ecs';
	/** Alibaba Cloud Function Compute. */
	ALIBABA_CLOUD_FC: 'alibaba_cloud_fc';
	/** AWS Elastic Compute Cloud. */
	AWS_EC2: 'aws_ec2';
	/** AWS Elastic Container Service. */
	AWS_ECS: 'aws_ecs';
	/** AWS Elastic Kubernetes Service. */
	AWS_EKS: 'aws_eks';
	/** AWS Lambda. */
	AWS_LAMBDA: 'aws_lambda';
	/** AWS Elastic Beanstalk. */
	AWS_ELASTIC_BEANSTALK: 'aws_elastic_beanstalk';
	/** Azure Virtual Machines. */
	AZURE_VM: 'azure_vm';
	/** Azure Container Instances. */
	AZURE_CONTAINER_INSTANCES: 'azure_container_instances';
	/** Azure Kubernetes Service. */
	AZURE_AKS: 'azure_aks';
	/** Azure Functions. */
	AZURE_FUNCTIONS: 'azure_functions';
	/** Azure App Service. */
	AZURE_APP_SERVICE: 'azure_app_service';
	/** Google Cloud Compute Engine (GCE). */
	GCP_COMPUTE_ENGINE: 'gcp_compute_engine';
	/** Google Cloud Run. */
	GCP_CLOUD_RUN: 'gcp_cloud_run';
	/** Google Cloud Kubernetes Engine (GKE). */
	GCP_KUBERNETES_ENGINE: 'gcp_kubernetes_engine';
	/** Google Cloud Functions (GCF). */
	GCP_CLOUD_FUNCTIONS: 'gcp_cloud_functions';
	/** Google Cloud App Engine (GAE). */
	GCP_APP_ENGINE: 'gcp_app_engine';
};
/**
 * The constant map of values for CloudPlatformValues.
 * @deprecated Use the CLOUDPLATFORMVALUES_XXXXX constants rather than the CloudPlatformValues.XXXXX for bundle minification.
 */
declare const CloudPlatformValues: CloudPlatformValues;
/**
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 *
 * @deprecated Use AWS_ECS_LAUNCHTYPE_VALUE_EC2.
 */
declare const AWSECSLAUNCHTYPEVALUES_EC2 = "ec2";
/**
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 *
 * @deprecated Use AWS_ECS_LAUNCHTYPE_VALUE_FARGATE.
 */
declare const AWSECSLAUNCHTYPEVALUES_FARGATE = "fargate";
/**
 * Identifies the Values for AwsEcsLaunchtypeValues enum definition
 *
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 * @deprecated Use the AWSECSLAUNCHTYPEVALUES_XXXXX constants rather than the AwsEcsLaunchtypeValues.XXXXX for bundle minification.
 */
declare type AwsEcsLaunchtypeValues = {
	/** ec2. */
	EC2: 'ec2';
	/** fargate. */
	FARGATE: 'fargate';
};
/**
 * The constant map of values for AwsEcsLaunchtypeValues.
 * @deprecated Use the AWSECSLAUNCHTYPEVALUES_XXXXX constants rather than the AwsEcsLaunchtypeValues.XXXXX for bundle minification.
 */
declare const AwsEcsLaunchtypeValues: AwsEcsLaunchtypeValues;
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_AMD64.
 */
declare const HOSTARCHVALUES_AMD64 = "amd64";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_ARM32.
 */
declare const HOSTARCHVALUES_ARM32 = "arm32";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_ARM64.
 */
declare const HOSTARCHVALUES_ARM64 = "arm64";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_IA64.
 */
declare const HOSTARCHVALUES_IA64 = "ia64";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_PPC32.
 */
declare const HOSTARCHVALUES_PPC32 = "ppc32";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_PPC64.
 */
declare const HOSTARCHVALUES_PPC64 = "ppc64";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_X86.
 */
declare const HOSTARCHVALUES_X86 = "x86";
/**
 * Identifies the Values for HostArchValues enum definition
 *
 * The CPU architecture the host system is running on.
 * @deprecated Use the HOSTARCHVALUES_XXXXX constants rather than the HostArchValues.XXXXX for bundle minification.
 */
declare type HostArchValues = {
	/** AMD64. */
	AMD64: 'amd64';
	/** ARM32. */
	ARM32: 'arm32';
	/** ARM64. */
	ARM64: 'arm64';
	/** Itanium. */
	IA64: 'ia64';
	/** 32-bit PowerPC. */
	PPC32: 'ppc32';
	/** 64-bit PowerPC. */
	PPC64: 'ppc64';
	/** 32-bit x86. */
	X86: 'x86';
};
/**
 * The constant map of values for HostArchValues.
 * @deprecated Use the HOSTARCHVALUES_XXXXX constants rather than the HostArchValues.XXXXX for bundle minification.
 */
declare const HostArchValues: HostArchValues;
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_WINDOWS.
 */
declare const OSTYPEVALUES_WINDOWS = "windows";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_LINUX.
 */
declare const OSTYPEVALUES_LINUX = "linux";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_DARWIN.
 */
declare const OSTYPEVALUES_DARWIN = "darwin";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_FREEBSD.
 */
declare const OSTYPEVALUES_FREEBSD = "freebsd";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_NETBSD.
 */
declare const OSTYPEVALUES_NETBSD = "netbsd";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_OPENBSD.
 */
declare const OSTYPEVALUES_OPENBSD = "openbsd";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_DRAGONFLYBSD.
 */
declare const OSTYPEVALUES_DRAGONFLYBSD = "dragonflybsd";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_HPUX.
 */
declare const OSTYPEVALUES_HPUX = "hpux";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_AIX.
 */
declare const OSTYPEVALUES_AIX = "aix";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_SOLARIS.
 */
declare const OSTYPEVALUES_SOLARIS = "solaris";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_Z_OS.
 */
declare const OSTYPEVALUES_Z_OS = "z_os";
/**
 * Identifies the Values for OsTypeValues enum definition
 *
 * The operating system type.
 * @deprecated Use the OSTYPEVALUES_XXXXX constants rather than the OsTypeValues.XXXXX for bundle minification.
 */
declare type OsTypeValues = {
	/** Microsoft Windows. */
	WINDOWS: 'windows';
	/** Linux. */
	LINUX: 'linux';
	/** Apple Darwin. */
	DARWIN: 'darwin';
	/** FreeBSD. */
	FREEBSD: 'freebsd';
	/** NetBSD. */
	NETBSD: 'netbsd';
	/** OpenBSD. */
	OPENBSD: 'openbsd';
	/** DragonFly BSD. */
	DRAGONFLYBSD: 'dragonflybsd';
	/** HP-UX (Hewlett Packard Unix). */
	HPUX: 'hpux';
	/** AIX (Advanced Interactive eXecutive). */
	AIX: 'aix';
	/** Oracle Solaris. */
	SOLARIS: 'solaris';
	/** IBM z/OS. */
	Z_OS: 'z_os';
};
/**
 * The constant map of values for OsTypeValues.
 * @deprecated Use the OSTYPEVALUES_XXXXX constants rather than the OsTypeValues.XXXXX for bundle minification.
 */
declare const OsTypeValues: OsTypeValues;
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_CPP.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_CPP = "cpp";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_DOTNET = "dotnet";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_ERLANG = "erlang";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_GO.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_GO = "go";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_JAVA.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_JAVA = "java";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_NODEJS = "nodejs";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_PHP.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_PHP = "php";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_PYTHON = "python";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_RUBY.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_RUBY = "ruby";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
/**
 * Identifies the Values for TelemetrySdkLanguageValues enum definition
 *
 * The language of the telemetry SDK.
 * @deprecated Use the TELEMETRYSDKLANGUAGEVALUES_XXXXX constants rather than the TelemetrySdkLanguageValues.XXXXX for bundle minification.
 */
declare type TelemetrySdkLanguageValues = {
	/** cpp. */
	CPP: 'cpp';
	/** dotnet. */
	DOTNET: 'dotnet';
	/** erlang. */
	ERLANG: 'erlang';
	/** go. */
	GO: 'go';
	/** java. */
	JAVA: 'java';
	/** nodejs. */
	NODEJS: 'nodejs';
	/** php. */
	PHP: 'php';
	/** python. */
	PYTHON: 'python';
	/** ruby. */
	RUBY: 'ruby';
	/** webjs. */
	WEBJS: 'webjs';
};
/**
 * The constant map of values for TelemetrySdkLanguageValues.
 * @deprecated Use the TELEMETRYSDKLANGUAGEVALUES_XXXXX constants rather than the TelemetrySdkLanguageValues.XXXXX for bundle minification.
 */
declare const TelemetrySdkLanguageValues: TelemetrySdkLanguageValues;

/**
 * Rate-limiting result, shows whether the lease was acquired or contains a rejection reason
 *
 * @example acquired
 *
 * @example request_canceled
 */
declare const ATTR_ASPNETCORE_RATE_LIMITING_RESULT: "aspnetcore.rate_limiting.result";
/**
* Enum value "acquired" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
*/
declare const ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED: "acquired";
/**
* Enum value "endpoint_limiter" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
*/
declare const ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER: "endpoint_limiter";
/**
* Enum value "global_limiter" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
*/
declare const ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER: "global_limiter";
/**
* Enum value "request_canceled" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
*/
declare const ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED: "request_canceled";
/**
 * The language of the telemetry SDK.
 */
declare const ATTR_TELEMETRY_SDK_LANGUAGE: "telemetry.sdk.language";
/**
* Enum value "cpp" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_CPP: "cpp";
/**
* Enum value "dotnet" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET: "dotnet";
/**
* Enum value "erlang" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG: "erlang";
/**
* Enum value "go" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_GO: "go";
/**
* Enum value "java" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_JAVA: "java";
/**
* Enum value "nodejs" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS: "nodejs";
/**
* Enum value "php" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_PHP: "php";
/**
* Enum value "python" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON: "python";
/**
* Enum value "ruby" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_RUBY: "ruby";
/**
* Enum value "rust" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_RUST: "rust";
/**
* Enum value "swift" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT: "swift";
/**
* Enum value "webjs" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
*/
declare const TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS: "webjs";
/**
 * The name of the telemetry SDK as defined above.
 *
 * @example opentelemetry
 *
 * @note The OpenTelemetry SDK **MUST** set the `telemetry.sdk.name` attribute to `opentelemetry`.
 * If another SDK, like a fork or a vendor-provided implementation, is used, this SDK **MUST** set the
 * `telemetry.sdk.name` attribute to the fully-qualified class or module name of this SDK's main entry point
 * or another suitable identifier depending on the language.
 * The identifier `opentelemetry` is reserved and **MUST** **NOT** be used in this case.
 * All custom identifiers **SHOULD** be stable across different versions of an implementation.
 */
declare const ATTR_TELEMETRY_SDK_NAME: "telemetry.sdk.name";
/**
 * The version string of the telemetry SDK.
 *
 * @example 1.2.3
 */
declare const ATTR_TELEMETRY_SDK_VERSION: "telemetry.sdk.version";
/**
 * Full type name of the [`IExceptionHandler`](https://learn.microsoft.com/dotnet/api/microsoft.aspnetcore.diagnostics.iexceptionhandler) implementation that handled the exception.
 *
 * @example Contoso.MyHandler
 */
declare const ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE: "aspnetcore.diagnostics.handler.type";
/**
 * ASP.NET Core exception middleware handling result
 *
 * @example handled
 *
 * @example unhandled
 */
declare const ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT: "aspnetcore.diagnostics.exception.result";
/**
* Enum value "aborted" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
*/
declare const ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED: "aborted";
/**
* Enum value "handled" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
*/
declare const ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED: "handled";
/**
* Enum value "skipped" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
*/
declare const ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED: "skipped";
/**
* Enum value "unhandled" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
*/
declare const ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED: "unhandled";
/**
 * Rate limiting policy name.
 *
 * @example fixed
 *
 * @example sliding
 *
 * @example token
 */
declare const ATTR_ASPNETCORE_RATE_LIMITING_POLICY: "aspnetcore.rate_limiting.policy";
/**
 * Flag indicating if request was handled by the application pipeline.
 *
 * @example true
 */
declare const ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED: "aspnetcore.request.is_unhandled";
/**
 * A value that indicates whether the matched route is a fallback route.
 *
 * @example true
 */
declare const ATTR_ASPNETCORE_ROUTING_IS_FALLBACK: "aspnetcore.routing.is_fallback";
/**
 * Match result - success or failure
 *
 * @example success
 *
 * @example failure
 */
declare const ATTR_ASPNETCORE_ROUTING_MATCH_STATUS: "aspnetcore.routing.match_status";
/**
* Enum value "failure" for attribute {@link ATTR_ASPNETCORE_ROUTING_MATCH_STATUS}.
*/
declare const ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE: "failure";
/**
* Enum value "success" for attribute {@link ATTR_ASPNETCORE_ROUTING_MATCH_STATUS}.
*/
declare const ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS: "success";
/**
 * Client address - domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name.
 *
 * @example client.example.com
 *
 * @example 10.1.2.80
 *
 * @example /tmp/my.sock
 *
 * @note When observed from the server side, and when communicating through an intermediary, `client.address` **SHOULD** represent the client address behind any intermediaries,  for example proxies, if it's available.
 */
declare const ATTR_CLIENT_ADDRESS: "client.address";
/**
 * Client port number.
 *
 * @example 65123
 *
 * @note When observed from the server side, and when communicating through an intermediary, `client.port` **SHOULD** represent the client port behind any intermediaries,  for example proxies, if it's available.
 */
declare const ATTR_CLIENT_PORT: "client.port";
/**
 * Describes a class of error the operation ended with.
 *
 * @example timeout
 *
 * @example java.net.UnknownHostException
 *
 * @example server_certificate_invalid
 *
 * @example 500
 *
 * @note The `error.type` **SHOULD** be predictable, and **SHOULD** have low cardinality.
 *
 * When `error.type` is set to a type (e.g., an exception type), its
 * canonical class name identifying the type within the artifact **SHOULD** be used.
 *
 * Instrumentations **SHOULD** document the list of errors they report.
 *
 * The cardinality of `error.type` within one instrumentation library **SHOULD** be low.
 * Telemetry consumers that aggregate data from multiple instrumentation libraries and applications
 * should be prepared for `error.type` to have high cardinality at query time when no
 * additional filters are applied.
 *
 * If the operation has completed successfully, instrumentations **SHOULD** **NOT** set `error.type`.
 *
 * If a specific domain defines its own set of error identifiers (such as HTTP or gRPC status codes),
 * it's RECOMMENDED to:
 *
 * * Use a domain-specific attribute
 * * Set `error.type` to capture all errors, regardless of whether they are defined within the domain-specific set or not.
 */
declare const ATTR_ERROR_TYPE: "error.type";
/**
* Enum value "_OTHER" for attribute {@link ATTR_ERROR_TYPE}.
*/
declare const ERROR_TYPE_VALUE_OTHER: "_OTHER";
/**
 * **SHOULD** be set to true if the exception event is recorded at a point where it is known that the exception is escaping the scope of the span.
 *
 * @note An exception is considered to have escaped (or left) the scope of a span,
 * if that span is ended while the exception is still logically "in flight".
 * This may be actually "in flight" in some languages (e.g. if the exception
 * is passed to a Context manager's `__exit__` method in Python) but will
 * usually be caught at the point of recording the exception in most languages.
 *
 * It is usually not possible to determine at the point where an exception is thrown
 * whether it will escape the scope of a span.
 * However, it is trivial to know that an exception
 * will escape, if one checks for an active exception just before ending the span,
 * as done in the [example for recording span exceptions](https://opentelemetry.io/docs/specs/semconv/exceptions/exceptions-spans/#recording-an-exception).
 *
 * It follows that an exception may still escape the scope of the span
 * even if the `exception.escaped` attribute was not set or set to false,
 * since the event might have been recorded at a time where it was not
 * clear whether the exception will escape.
 */
declare const ATTR_EXCEPTION_ESCAPED: "exception.escaped";
/**
 * The exception message.
 *
 * @example Division by zero
 *
 * @example Can't convert 'int' object to str implicitly
 */
declare const ATTR_EXCEPTION_MESSAGE: "exception.message";
/**
 * A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
 *
 * @example "Exception in thread \"main\" java.lang.RuntimeException: Test exception\\n at com.example.GenerateTrace.methodB(GenerateTrace.java:13)\\n at com.example.GenerateTrace.methodA(GenerateTrace.java:9)\\n at com.example.GenerateTrace.main(GenerateTrace.java:5)"
 */
declare const ATTR_EXCEPTION_STACKTRACE: "exception.stacktrace";
/**
 * The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
 *
 * @example java.net.ConnectException
 *
 * @example OSError
 */
declare const ATTR_EXCEPTION_TYPE: "exception.type";
/**
 * HTTP request headers, `<key>` being the normalized HTTP Header name (lowercase), the value being the header values.
 *
 * @example http.request.header.content-type=["application/json"]
 *
 * @example http.request.header.x-forwarded-for=["1.2.3.4", "1.2.3.5"]
 *
 * @note Instrumentations **SHOULD** require an explicit configuration of which headers are to be captured. Including all request headers can be a security risk - explicit configuration helps avoid leaking sensitive information.
 * The `User-Agent` header is already captured in the `user_agent.original` attribute. Users **MAY** explicitly configure instrumentations to capture them even though it is not recommended.
 * The attribute value **MUST** consist of either multiple header values as an array of strings or a single-item array containing a possibly comma-concatenated string, depending on the way the HTTP library provides access to headers.
 */
declare const ATTR_HTTP_REQUEST_HEADER: (key: string) => string;
/**
 * HTTP request method.
 *
 * @example GET
 *
 * @example POST
 *
 * @example HEAD
 *
 * @note HTTP request method value **SHOULD** be "known" to the instrumentation.
 * By default, this convention defines "known" methods as the ones listed in [RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-methods)
 * and the PATCH method defined in [RFC5789](https://www.rfc-editor.org/rfc/rfc5789.html).
 *
 * If the HTTP request method is not known to instrumentation, it **MUST** set the `http.request.method` attribute to `_OTHER`.
 *
 * If the HTTP instrumentation could end up converting valid HTTP request methods to `_OTHER`, then it **MUST** provide a way to override
 * the list of known HTTP methods. If this override is done via environment variable, then the environment variable **MUST** be named
 * OTEL_INSTRUMENTATION_HTTP_KNOWN_METHODS and support a comma-separated list of case-sensitive known HTTP methods
 * (this list **MUST** be a full override of the default known method, it is not a list of known methods in addition to the defaults).
 *
 * HTTP method names are case-sensitive and `http.request.method` attribute value **MUST** match a known HTTP method name exactly.
 * Instrumentations for specific web frameworks that consider HTTP methods to be case insensitive, **SHOULD** populate a canonical equivalent.
 * Tracing instrumentations that do so, **MUST** also set `http.request.method_original` to the original value.
 */
declare const ATTR_HTTP_REQUEST_METHOD: "http.request.method";
/**
* Enum value "_OTHER" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_OTHER: "_OTHER";
/**
* Enum value "CONNECT" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_CONNECT: "CONNECT";
/**
* Enum value "DELETE" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_DELETE: "DELETE";
/**
* Enum value "GET" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_GET: "GET";
/**
* Enum value "HEAD" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_HEAD: "HEAD";
/**
* Enum value "OPTIONS" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_OPTIONS: "OPTIONS";
/**
* Enum value "PATCH" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_PATCH: "PATCH";
/**
* Enum value "POST" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_POST: "POST";
/**
* Enum value "PUT" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_PUT: "PUT";
/**
* Enum value "TRACE" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
*/
declare const HTTP_REQUEST_METHOD_VALUE_TRACE: "TRACE";
/**
 * Original HTTP method sent by the client in the request line.
 *
 * @example GeT
 *
 * @example ACL
 *
 * @example foo
 */
declare const ATTR_HTTP_REQUEST_METHOD_ORIGINAL: "http.request.method_original";
/**
 * The ordinal number of request resending attempt (for any reason, including redirects).
 *
 * @example 3
 *
 * @note The resend count **SHOULD** be updated each time an HTTP request gets resent by the client, regardless of what was the cause of the resending (e.g. redirection, authorization failure, 503 Server Unavailable, network issues, or any other).
 */
declare const ATTR_HTTP_REQUEST_RESEND_COUNT: "http.request.resend_count";
/**
 * HTTP response headers, `<key>` being the normalized HTTP Header name (lowercase), the value being the header values.
 *
 * @example http.response.header.content-type=["application/json"]
 *
 * @example http.response.header.my-custom-header=["abc", "def"]
 *
 * @note Instrumentations **SHOULD** require an explicit configuration of which headers are to be captured. Including all response headers can be a security risk - explicit configuration helps avoid leaking sensitive information.
 * Users **MAY** explicitly configure instrumentations to capture them even though it is not recommended.
 * The attribute value **MUST** consist of either multiple header values as an array of strings or a single-item array containing a possibly comma-concatenated string, depending on the way the HTTP library provides access to headers.
 */
declare const ATTR_HTTP_RESPONSE_HEADER: (key: string) => string;
/**
 * [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
 *
 * @example 200
 */
declare const ATTR_HTTP_RESPONSE_STATUS_CODE: "http.response.status_code";
/**
 * The matched route, that is, the path template in the format used by the respective server framework.
 *
 * @example /users/:userID?
 *
 * @example {controller}/{action}/{id?}
 *
 * @note MUST **NOT** be populated when this is not supported by the HTTP server framework as the route attribute should have low-cardinality and the URI path can **NOT** substitute it.
 * SHOULD include the [application root](/docs/http/http-spans.md#http-server-definitions) if there is one.
 */
declare const ATTR_HTTP_ROUTE: "http.route";
/**
 * Name of the garbage collector action.
 *
 * @example end of minor GC
 *
 * @example end of major GC
 *
 * @note Garbage collector action is generally obtained via [GarbageCollectionNotificationInfo#getGcAction()](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.management/com/sun/management/GarbageCollectionNotificationInfo.html#getGcAction()).
 */
declare const ATTR_JVM_GC_ACTION: "jvm.gc.action";
/**
 * Name of the garbage collector.
 *
 * @example G1 Young Generation
 *
 * @example G1 Old Generation
 *
 * @note Garbage collector name is generally obtained via [GarbageCollectionNotificationInfo#getGcName()](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.management/com/sun/management/GarbageCollectionNotificationInfo.html#getGcName()).
 */
declare const ATTR_JVM_GC_NAME: "jvm.gc.name";
/**
 * Name of the memory pool.
 *
 * @example G1 Old Gen
 *
 * @example G1 Eden space
 *
 * @example G1 Survivor Space
 *
 * @note Pool names are generally obtained via [MemoryPoolMXBean#getName()](https://docs.oracle.com/en/java/javase/11/docs/api/java.management/java/lang/management/MemoryPoolMXBean.html#getName()).
 */
declare const ATTR_JVM_MEMORY_POOL_NAME: "jvm.memory.pool.name";
/**
 * The type of memory.
 *
 * @example heap
 *
 * @example non_heap
 */
declare const ATTR_JVM_MEMORY_TYPE: "jvm.memory.type";
/**
* Enum value "heap" for attribute {@link ATTR_JVM_MEMORY_TYPE}.
*/
declare const JVM_MEMORY_TYPE_VALUE_HEAP: "heap";
/**
* Enum value "non_heap" for attribute {@link ATTR_JVM_MEMORY_TYPE}.
*/
declare const JVM_MEMORY_TYPE_VALUE_NON_HEAP: "non_heap";
/**
 * Whether the thread is daemon or not.
 */
declare const ATTR_JVM_THREAD_DAEMON: "jvm.thread.daemon";
/**
 * State of the thread.
 *
 * @example runnable
 *
 * @example blocked
 */
declare const ATTR_JVM_THREAD_STATE: "jvm.thread.state";
/**
* Enum value "blocked" for attribute {@link ATTR_JVM_THREAD_STATE}.
*/
declare const JVM_THREAD_STATE_VALUE_BLOCKED: "blocked";
/**
* Enum value "new" for attribute {@link ATTR_JVM_THREAD_STATE}.
*/
declare const JVM_THREAD_STATE_VALUE_NEW: "new";
/**
* Enum value "runnable" for attribute {@link ATTR_JVM_THREAD_STATE}.
*/
declare const JVM_THREAD_STATE_VALUE_RUNNABLE: "runnable";
/**
* Enum value "terminated" for attribute {@link ATTR_JVM_THREAD_STATE}.
*/
declare const JVM_THREAD_STATE_VALUE_TERMINATED: "terminated";
/**
* Enum value "timed_waiting" for attribute {@link ATTR_JVM_THREAD_STATE}.
*/
declare const JVM_THREAD_STATE_VALUE_TIMED_WAITING: "timed_waiting";
/**
* Enum value "waiting" for attribute {@link ATTR_JVM_THREAD_STATE}.
*/
declare const JVM_THREAD_STATE_VALUE_WAITING: "waiting";
/**
 * Local address of the network connection - IP address or Unix domain socket name.
 *
 * @example 10.1.2.80
 *
 * @example /tmp/my.sock
 */
declare const ATTR_NETWORK_LOCAL_ADDRESS: "network.local.address";
/**
 * Local port number of the network connection.
 *
 * @example 65123
 */
declare const ATTR_NETWORK_LOCAL_PORT: "network.local.port";
/**
 * Peer address of the network connection - IP address or Unix domain socket name.
 *
 * @example 10.1.2.80
 *
 * @example /tmp/my.sock
 */
declare const ATTR_NETWORK_PEER_ADDRESS: "network.peer.address";
/**
 * Peer port number of the network connection.
 *
 * @example 65123
 */
declare const ATTR_NETWORK_PEER_PORT: "network.peer.port";
/**
 * [OSI application layer](https://osi-model.com/application-layer/) or non-OSI equivalent.
 *
 * @example amqp
 *
 * @example http
 *
 * @example mqtt
 *
 * @note The value **SHOULD** be normalized to lowercase.
 */
declare const ATTR_NETWORK_PROTOCOL_NAME: "network.protocol.name";
/**
 * The actual version of the protocol used for network communication.
 *
 * @example 1.1
 *
 * @example 2
 *
 * @note If protocol version is subject to negotiation (for example using [ALPN](https://www.rfc-editor.org/rfc/rfc7301.html)), this attribute **SHOULD** be set to the negotiated version. If the actual protocol version is not known, this attribute **SHOULD** **NOT** be set.
 */
declare const ATTR_NETWORK_PROTOCOL_VERSION: "network.protocol.version";
/**
 * [OSI transport layer](https://osi-model.com/transport-layer/) or [inter-process communication method](https://wikipedia.org/wiki/Inter-process_communication).
 *
 * @example tcp
 *
 * @example udp
 *
 * @note The value **SHOULD** be normalized to lowercase.
 *
 * Consider always setting the transport when setting a port number, since
 * a port number is ambiguous without knowing the transport. For example
 * different processes could be listening on TCP port 12345 and UDP port 12345.
 */
declare const ATTR_NETWORK_TRANSPORT: "network.transport";
/**
* Enum value "pipe" for attribute {@link ATTR_NETWORK_TRANSPORT}.
*/
declare const NETWORK_TRANSPORT_VALUE_PIPE: "pipe";
/**
* Enum value "quic" for attribute {@link ATTR_NETWORK_TRANSPORT}.
*/
declare const NETWORK_TRANSPORT_VALUE_QUIC: "quic";
/**
* Enum value "tcp" for attribute {@link ATTR_NETWORK_TRANSPORT}.
*/
declare const NETWORK_TRANSPORT_VALUE_TCP: "tcp";
/**
* Enum value "udp" for attribute {@link ATTR_NETWORK_TRANSPORT}.
*/
declare const NETWORK_TRANSPORT_VALUE_UDP: "udp";
/**
* Enum value "unix" for attribute {@link ATTR_NETWORK_TRANSPORT}.
*/
declare const NETWORK_TRANSPORT_VALUE_UNIX: "unix";
/**
 * [OSI network layer](https://osi-model.com/network-layer/) or non-OSI equivalent.
 *
 * @example ipv4
 *
 * @example ipv6
 *
 * @note The value **SHOULD** be normalized to lowercase.
 */
declare const ATTR_NETWORK_TYPE: "network.type";
/**
* Enum value "ipv4" for attribute {@link ATTR_NETWORK_TYPE}.
*/
declare const NETWORK_TYPE_VALUE_IPV4: "ipv4";
/**
* Enum value "ipv6" for attribute {@link ATTR_NETWORK_TYPE}.
*/
declare const NETWORK_TYPE_VALUE_IPV6: "ipv6";
/**
 * The name of the instrumentation scope - (`InstrumentationScope.Name` in OTLP).
 *
 * @example io.opentelemetry.contrib.mongodb
 */
declare const ATTR_OTEL_SCOPE_NAME: "otel.scope.name";
/**
 * The version of the instrumentation scope - (`InstrumentationScope.Version` in OTLP).
 *
 * @example 1.0.0
 */
declare const ATTR_OTEL_SCOPE_VERSION: "otel.scope.version";
/**
 * Name of the code, either "OK" or "ERROR". **MUST** **NOT** be set if the status code is UNSET.
 */
declare const ATTR_OTEL_STATUS_CODE: "otel.status_code";
/**
* Enum value "ERROR" for attribute {@link ATTR_OTEL_STATUS_CODE}.
*/
declare const OTEL_STATUS_CODE_VALUE_ERROR: "ERROR";
/**
* Enum value "OK" for attribute {@link ATTR_OTEL_STATUS_CODE}.
*/
declare const OTEL_STATUS_CODE_VALUE_OK: "OK";
/**
 * Description of the Status if it has a value, otherwise not set.
 *
 * @example resource not found
 */
declare const ATTR_OTEL_STATUS_DESCRIPTION: "otel.status_description";
/**
 * Server domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name.
 *
 * @example example.com
 *
 * @example 10.1.2.80
 *
 * @example /tmp/my.sock
 *
 * @note When observed from the client side, and when communicating through an intermediary, `server.address` **SHOULD** represent the server address behind any intermediaries, for example proxies, if it's available.
 */
declare const ATTR_SERVER_ADDRESS: "server.address";
/**
 * Server port number.
 *
 * @example 80
 *
 * @example 8080
 *
 * @example 443
 *
 * @note When observed from the client side, and when communicating through an intermediary, `server.port` **SHOULD** represent the server port behind any intermediaries, for example proxies, if it's available.
 */
declare const ATTR_SERVER_PORT: "server.port";
/**
 * Logical name of the service.
 *
 * @example shoppingcart
 *
 * @note MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs **MUST** fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value **MUST** be set to `unknown_service`.
 */
declare const ATTR_SERVICE_NAME: "service.name";
/**
 * The version string of the service API or implementation. The format is not defined by these conventions.
 *
 * @example 2.0.0
 *
 * @example a01dbef8a
 */
declare const ATTR_SERVICE_VERSION: "service.version";
/**
 * SignalR HTTP connection closure status.
 *
 * @example app_shutdown
 *
 * @example timeout
 */
declare const ATTR_SIGNALR_CONNECTION_STATUS: "signalr.connection.status";
/**
* Enum value "app_shutdown" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
*/
declare const SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN: "app_shutdown";
/**
* Enum value "normal_closure" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
*/
declare const SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE: "normal_closure";
/**
* Enum value "timeout" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
*/
declare const SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT: "timeout";
/**
 * [SignalR transport type](https://github.com/dotnet/aspnetcore/blob/main/src/SignalR/docs/specs/TransportProtocols.md)
 *
 * @example web_sockets
 *
 * @example long_polling
 */
declare const ATTR_SIGNALR_TRANSPORT: "signalr.transport";
/**
* Enum value "long_polling" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
*/
declare const SIGNALR_TRANSPORT_VALUE_LONG_POLLING: "long_polling";
/**
* Enum value "server_sent_events" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
*/
declare const SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS: "server_sent_events";
/**
* Enum value "web_sockets" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
*/
declare const SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS: "web_sockets";
/**
 * The [URI fragment](https://www.rfc-editor.org/rfc/rfc3986#section-3.5) component
 *
 * @example SemConv
 */
declare const ATTR_URL_FRAGMENT: "url.fragment";
/**
 * Absolute URL describing a network resource according to [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)
 *
 * @example https://www.foo.bar/search?q=OpenTelemetry#SemConv
 *
 * @example //localhost
 *
 * @note For network calls, URL usually has `scheme://host[:port][path][?query][#fragment]` format, where the fragment is not transmitted over HTTP, but if it is known, it **SHOULD** be included nevertheless.
 * `url.full` **MUST** **NOT** contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case username and password **SHOULD** be redacted and attribute's value **SHOULD** be `https://REDACTED:REDACTED@www.example.com/`.
 * `url.full` **SHOULD** capture the absolute URL when it is available (or can be reconstructed). Sensitive content provided in `url.full` **SHOULD** be scrubbed when instrumentations can identify it.
 */
declare const ATTR_URL_FULL: "url.full";
/**
 * The [URI path](https://www.rfc-editor.org/rfc/rfc3986#section-3.3) component
 *
 * @example /search
 *
 * @note Sensitive content provided in `url.path` **SHOULD** be scrubbed when instrumentations can identify it.
 */
declare const ATTR_URL_PATH: "url.path";
/**
 * The [URI query](https://www.rfc-editor.org/rfc/rfc3986#section-3.4) component
 *
 * @example q=OpenTelemetry
 *
 * @note Sensitive content provided in `url.query` **SHOULD** be scrubbed when instrumentations can identify it.
 */
declare const ATTR_URL_QUERY: "url.query";
/**
 * The [URI scheme](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) component identifying the used protocol.
 *
 * @example https
 *
 * @example ftp
 *
 * @example telnet
 */
declare const ATTR_URL_SCHEME: "url.scheme";
/**
 * Value of the [HTTP User-Agent](https://www.rfc-editor.org/rfc/rfc9110.html#field.user-agent) header sent by the client.
 *
 * @example CERN-LineMode/2.15 libwww/2.17b3
 *
 * @example Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1
 *
 * @example YourApp/1.0.0 grpc-java-okhttp/1.27.2
 */
declare const ATTR_USER_AGENT_ORIGINAL: "user_agent.original";

/**
 * Number of exceptions caught by exception handling middleware.
 *
 * @note Meter name: `Microsoft.AspNetCore.Diagnostics`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS: "aspnetcore.diagnostics.exceptions";
/**
 * Number of requests that are currently active on the server that hold a rate limiting lease.
 *
 * @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES: "aspnetcore.rate_limiting.active_request_leases";
/**
 * Number of requests that are currently queued, waiting to acquire a rate limiting lease.
 *
 * @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS: "aspnetcore.rate_limiting.queued_requests";
/**
 * The time the request spent in a queue waiting to acquire a rate limiting lease.
 *
 * @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE: "aspnetcore.rate_limiting.request.time_in_queue";
/**
 * The duration of rate limiting lease held by requests on the server.
 *
 * @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION: "aspnetcore.rate_limiting.request_lease.duration";
/**
 * Number of requests that tried to acquire a rate limiting lease.
 *
 * @note Requests could be:
 *
 * * Rejected by global or endpoint rate limiting policies
 * * Canceled while waiting for the lease.
 *
 * Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS: "aspnetcore.rate_limiting.requests";
/**
 * Number of requests that were attempted to be matched to an endpoint.
 *
 * @note Meter name: `Microsoft.AspNetCore.Routing`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS: "aspnetcore.routing.match_attempts";
/**
 * Duration of HTTP client requests.
 */
declare const METRIC_HTTP_CLIENT_REQUEST_DURATION: "http.client.request.duration";
/**
 * Duration of HTTP server requests.
 */
declare const METRIC_HTTP_SERVER_REQUEST_DURATION: "http.server.request.duration";
/**
 * Number of classes currently loaded.
 */
declare const METRIC_JVM_CLASS_COUNT: "jvm.class.count";
/**
 * Number of classes loaded since JVM start.
 */
declare const METRIC_JVM_CLASS_LOADED: "jvm.class.loaded";
/**
 * Number of classes unloaded since JVM start.
 */
declare const METRIC_JVM_CLASS_UNLOADED: "jvm.class.unloaded";
/**
 * Number of processors available to the Java virtual machine.
 */
declare const METRIC_JVM_CPU_COUNT: "jvm.cpu.count";
/**
 * Recent CPU utilization for the process as reported by the JVM.
 *
 * @note The value range is [0.0,1.0]. This utilization is not defined as being for the specific interval since last measurement (unlike `system.cpu.utilization`). [Reference](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.management/com/sun/management/OperatingSystemMXBean.html#getProcessCpuLoad()).
 */
declare const METRIC_JVM_CPU_RECENT_UTILIZATION: "jvm.cpu.recent_utilization";
/**
 * CPU time used by the process as reported by the JVM.
 */
declare const METRIC_JVM_CPU_TIME: "jvm.cpu.time";
/**
 * Duration of JVM garbage collection actions.
 */
declare const METRIC_JVM_GC_DURATION: "jvm.gc.duration";
/**
 * Measure of memory committed.
 */
declare const METRIC_JVM_MEMORY_COMMITTED: "jvm.memory.committed";
/**
 * Measure of max obtainable memory.
 */
declare const METRIC_JVM_MEMORY_LIMIT: "jvm.memory.limit";
/**
 * Measure of memory used.
 */
declare const METRIC_JVM_MEMORY_USED: "jvm.memory.used";
/**
 * Measure of memory used, as measured after the most recent garbage collection event on this pool.
 */
declare const METRIC_JVM_MEMORY_USED_AFTER_LAST_GC: "jvm.memory.used_after_last_gc";
/**
 * Number of executing platform threads.
 */
declare const METRIC_JVM_THREAD_COUNT: "jvm.thread.count";
/**
 * Number of connections that are currently active on the server.
 *
 * @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_KESTREL_ACTIVE_CONNECTIONS: "kestrel.active_connections";
/**
 * Number of TLS handshakes that are currently in progress on the server.
 *
 * @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES: "kestrel.active_tls_handshakes";
/**
 * The duration of connections on the server.
 *
 * @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_KESTREL_CONNECTION_DURATION: "kestrel.connection.duration";
/**
 * Number of connections that are currently queued and are waiting to start.
 *
 * @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_KESTREL_QUEUED_CONNECTIONS: "kestrel.queued_connections";
/**
 * Number of HTTP requests on multiplexed connections (HTTP/2 and HTTP/3) that are currently queued and are waiting to start.
 *
 * @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_KESTREL_QUEUED_REQUESTS: "kestrel.queued_requests";
/**
 * Number of connections rejected by the server.
 *
 * @note Connections are rejected when the currently active count exceeds the value configured with `MaxConcurrentConnections`.
 * Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_KESTREL_REJECTED_CONNECTIONS: "kestrel.rejected_connections";
/**
 * The duration of TLS handshakes on the server.
 *
 * @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_KESTREL_TLS_HANDSHAKE_DURATION: "kestrel.tls_handshake.duration";
/**
 * Number of connections that are currently upgraded (WebSockets). .
 *
 * @note The counter only tracks HTTP/1.1 connections.
 *
 * Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_KESTREL_UPGRADED_CONNECTIONS: "kestrel.upgraded_connections";
/**
 * Number of connections that are currently active on the server.
 *
 * @note Meter name: `Microsoft.AspNetCore.Http.Connections`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS: "signalr.server.active_connections";
/**
 * The duration of connections on the server.
 *
 * @note Meter name: `Microsoft.AspNetCore.Http.Connections`; Added in: ASP.NET Core 8.0
 */
declare const METRIC_SIGNALR_SERVER_CONNECTION_DURATION: "signalr.server.connection.duration";

export { ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED, ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE, ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS, ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT, ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE, ATTR_ASPNETCORE_RATE_LIMITING_POLICY, ATTR_ASPNETCORE_RATE_LIMITING_RESULT, ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED, ATTR_ASPNETCORE_ROUTING_IS_FALLBACK, ATTR_ASPNETCORE_ROUTING_MATCH_STATUS, ATTR_CLIENT_ADDRESS, ATTR_CLIENT_PORT, ATTR_ERROR_TYPE, ATTR_EXCEPTION_ESCAPED, ATTR_EXCEPTION_MESSAGE, ATTR_EXCEPTION_STACKTRACE, ATTR_EXCEPTION_TYPE, ATTR_HTTP_REQUEST_HEADER, ATTR_HTTP_REQUEST_METHOD, ATTR_HTTP_REQUEST_METHOD_ORIGINAL, ATTR_HTTP_REQUEST_RESEND_COUNT, ATTR_HTTP_RESPONSE_HEADER, ATTR_HTTP_RESPONSE_STATUS_CODE, ATTR_HTTP_ROUTE, ATTR_JVM_GC_ACTION, ATTR_JVM_GC_NAME, ATTR_JVM_MEMORY_POOL_NAME, ATTR_JVM_MEMORY_TYPE, ATTR_JVM_THREAD_DAEMON, ATTR_JVM_THREAD_STATE, ATTR_NETWORK_LOCAL_ADDRESS, ATTR_NETWORK_LOCAL_PORT, ATTR_NETWORK_PEER_ADDRESS, ATTR_NETWORK_PEER_PORT, ATTR_NETWORK_PROTOCOL_NAME, ATTR_NETWORK_PROTOCOL_VERSION, ATTR_NETWORK_TRANSPORT, ATTR_NETWORK_TYPE, ATTR_OTEL_SCOPE_NAME, ATTR_OTEL_SCOPE_VERSION, ATTR_OTEL_STATUS_CODE, ATTR_OTEL_STATUS_DESCRIPTION, ATTR_SERVER_ADDRESS, ATTR_SERVER_PORT, ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION, ATTR_SIGNALR_CONNECTION_STATUS, ATTR_SIGNALR_TRANSPORT, ATTR_TELEMETRY_SDK_LANGUAGE, ATTR_TELEMETRY_SDK_NAME, ATTR_TELEMETRY_SDK_VERSION, ATTR_URL_FRAGMENT, ATTR_URL_FULL, ATTR_URL_PATH, ATTR_URL_QUERY, ATTR_URL_SCHEME, ATTR_USER_AGENT_ORIGINAL, AWSECSLAUNCHTYPEVALUES_EC2, AWSECSLAUNCHTYPEVALUES_FARGATE, AwsEcsLaunchtypeValues, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC, CLOUDPLATFORMVALUES_AWS_EC2, CLOUDPLATFORMVALUES_AWS_ECS, CLOUDPLATFORMVALUES_AWS_EKS, CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK, CLOUDPLATFORMVALUES_AWS_LAMBDA, CLOUDPLATFORMVALUES_AZURE_AKS, CLOUDPLATFORMVALUES_AZURE_APP_SERVICE, CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES, CLOUDPLATFORMVALUES_AZURE_FUNCTIONS, CLOUDPLATFORMVALUES_AZURE_VM, CLOUDPLATFORMVALUES_GCP_APP_ENGINE, CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS, CLOUDPLATFORMVALUES_GCP_CLOUD_RUN, CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE, CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE, CLOUDPROVIDERVALUES_ALIBABA_CLOUD, CLOUDPROVIDERVALUES_AWS, CLOUDPROVIDERVALUES_AZURE, CLOUDPROVIDERVALUES_GCP, CloudPlatformValues, CloudProviderValues, DBCASSANDRACONSISTENCYLEVELVALUES_ALL, DBCASSANDRACONSISTENCYLEVELVALUES_ANY, DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_THREE, DBCASSANDRACONSISTENCYLEVELVALUES_TWO, DBSYSTEMVALUES_ADABAS, DBSYSTEMVALUES_CACHE, DBSYSTEMVALUES_CASSANDRA, DBSYSTEMVALUES_CLOUDSCAPE, DBSYSTEMVALUES_COCKROACHDB, DBSYSTEMVALUES_COLDFUSION, DBSYSTEMVALUES_COSMOSDB, DBSYSTEMVALUES_COUCHBASE, DBSYSTEMVALUES_COUCHDB, DBSYSTEMVALUES_DB2, DBSYSTEMVALUES_DERBY, DBSYSTEMVALUES_DYNAMODB, DBSYSTEMVALUES_EDB, DBSYSTEMVALUES_ELASTICSEARCH, DBSYSTEMVALUES_FILEMAKER, DBSYSTEMVALUES_FIREBIRD, DBSYSTEMVALUES_FIRSTSQL, DBSYSTEMVALUES_GEODE, DBSYSTEMVALUES_H2, DBSYSTEMVALUES_HANADB, DBSYSTEMVALUES_HBASE, DBSYSTEMVALUES_HIVE, DBSYSTEMVALUES_HSQLDB, DBSYSTEMVALUES_INFORMIX, DBSYSTEMVALUES_INGRES, DBSYSTEMVALUES_INSTANTDB, DBSYSTEMVALUES_INTERBASE, DBSYSTEMVALUES_MARIADB, DBSYSTEMVALUES_MAXDB, DBSYSTEMVALUES_MEMCACHED, DBSYSTEMVALUES_MONGODB, DBSYSTEMVALUES_MSSQL, DBSYSTEMVALUES_MYSQL, DBSYSTEMVALUES_NEO4J, DBSYSTEMVALUES_NETEZZA, DBSYSTEMVALUES_ORACLE, DBSYSTEMVALUES_OTHER_SQL, DBSYSTEMVALUES_PERVASIVE, DBSYSTEMVALUES_POINTBASE, DBSYSTEMVALUES_POSTGRESQL, DBSYSTEMVALUES_PROGRESS, DBSYSTEMVALUES_REDIS, DBSYSTEMVALUES_REDSHIFT, DBSYSTEMVALUES_SQLITE, DBSYSTEMVALUES_SYBASE, DBSYSTEMVALUES_TERADATA, DBSYSTEMVALUES_VERTICA, DbCassandraConsistencyLevelValues, DbSystemValues, ERROR_TYPE_VALUE_OTHER, FAASDOCUMENTOPERATIONVALUES_DELETE, FAASDOCUMENTOPERATIONVALUES_EDIT, FAASDOCUMENTOPERATIONVALUES_INSERT, FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD, FAASINVOKEDPROVIDERVALUES_AWS, FAASINVOKEDPROVIDERVALUES_AZURE, FAASINVOKEDPROVIDERVALUES_GCP, FAASTRIGGERVALUES_DATASOURCE, FAASTRIGGERVALUES_HTTP, FAASTRIGGERVALUES_OTHER, FAASTRIGGERVALUES_PUBSUB, FAASTRIGGERVALUES_TIMER, FaasDocumentOperationValues, FaasInvokedProviderValues, FaasTriggerValues, HOSTARCHVALUES_AMD64, HOSTARCHVALUES_ARM32, HOSTARCHVALUES_ARM64, HOSTARCHVALUES_IA64, HOSTARCHVALUES_PPC32, HOSTARCHVALUES_PPC64, HOSTARCHVALUES_X86, HTTPFLAVORVALUES_HTTP_1_0, HTTPFLAVORVALUES_HTTP_1_1, HTTPFLAVORVALUES_HTTP_2_0, HTTPFLAVORVALUES_QUIC, HTTPFLAVORVALUES_SPDY, HTTP_REQUEST_METHOD_VALUE_CONNECT, HTTP_REQUEST_METHOD_VALUE_DELETE, HTTP_REQUEST_METHOD_VALUE_GET, HTTP_REQUEST_METHOD_VALUE_HEAD, HTTP_REQUEST_METHOD_VALUE_OPTIONS, HTTP_REQUEST_METHOD_VALUE_OTHER, HTTP_REQUEST_METHOD_VALUE_PATCH, HTTP_REQUEST_METHOD_VALUE_POST, HTTP_REQUEST_METHOD_VALUE_PUT, HTTP_REQUEST_METHOD_VALUE_TRACE, HostArchValues, HttpFlavorValues, JVM_MEMORY_TYPE_VALUE_HEAP, JVM_MEMORY_TYPE_VALUE_NON_HEAP, JVM_THREAD_STATE_VALUE_BLOCKED, JVM_THREAD_STATE_VALUE_NEW, JVM_THREAD_STATE_VALUE_RUNNABLE, JVM_THREAD_STATE_VALUE_TERMINATED, JVM_THREAD_STATE_VALUE_TIMED_WAITING, JVM_THREAD_STATE_VALUE_WAITING, MESSAGETYPEVALUES_RECEIVED, MESSAGETYPEVALUES_SENT, MESSAGINGDESTINATIONKINDVALUES_QUEUE, MESSAGINGDESTINATIONKINDVALUES_TOPIC, MESSAGINGOPERATIONVALUES_PROCESS, MESSAGINGOPERATIONVALUES_RECEIVE, METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS, METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES, METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS, METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS, METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION, METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE, METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS, METRIC_HTTP_CLIENT_REQUEST_DURATION, METRIC_HTTP_SERVER_REQUEST_DURATION, METRIC_JVM_CLASS_COUNT, METRIC_JVM_CLASS_LOADED, METRIC_JVM_CLASS_UNLOADED, METRIC_JVM_CPU_COUNT, METRIC_JVM_CPU_RECENT_UTILIZATION, METRIC_JVM_CPU_TIME, METRIC_JVM_GC_DURATION, METRIC_JVM_MEMORY_COMMITTED, METRIC_JVM_MEMORY_LIMIT, METRIC_JVM_MEMORY_USED, METRIC_JVM_MEMORY_USED_AFTER_LAST_GC, METRIC_JVM_THREAD_COUNT, METRIC_KESTREL_ACTIVE_CONNECTIONS, METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES, METRIC_KESTREL_CONNECTION_DURATION, METRIC_KESTREL_QUEUED_CONNECTIONS, METRIC_KESTREL_QUEUED_REQUESTS, METRIC_KESTREL_REJECTED_CONNECTIONS, METRIC_KESTREL_TLS_HANDSHAKE_DURATION, METRIC_KESTREL_UPGRADED_CONNECTIONS, METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS, METRIC_SIGNALR_SERVER_CONNECTION_DURATION, MessageTypeValues, MessagingDestinationKindValues, MessagingOperationValues, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT, NETHOSTCONNECTIONSUBTYPEVALUES_EDGE, NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B, NETHOSTCONNECTIONSUBTYPEVALUES_GPRS, NETHOSTCONNECTIONSUBTYPEVALUES_GSM, NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP, NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA, NETHOSTCONNECTIONSUBTYPEVALUES_IDEN, NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN, NETHOSTCONNECTIONSUBTYPEVALUES_LTE, NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA, NETHOSTCONNECTIONSUBTYPEVALUES_NR, NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA, NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA, NETHOSTCONNECTIONSUBTYPEVALUES_UMTS, NETHOSTCONNECTIONTYPEVALUES_CELL, NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE, NETHOSTCONNECTIONTYPEVALUES_UNKNOWN, NETHOSTCONNECTIONTYPEVALUES_WIFI, NETHOSTCONNECTIONTYPEVALUES_WIRED, NETTRANSPORTVALUES_INPROC, NETTRANSPORTVALUES_IP, NETTRANSPORTVALUES_IP_TCP, NETTRANSPORTVALUES_IP_UDP, NETTRANSPORTVALUES_OTHER, NETTRANSPORTVALUES_PIPE, NETTRANSPORTVALUES_UNIX, NETWORK_TRANSPORT_VALUE_PIPE, NETWORK_TRANSPORT_VALUE_QUIC, NETWORK_TRANSPORT_VALUE_TCP, NETWORK_TRANSPORT_VALUE_UDP, NETWORK_TRANSPORT_VALUE_UNIX, NETWORK_TYPE_VALUE_IPV4, NETWORK_TYPE_VALUE_IPV6, NetHostConnectionSubtypeValues, NetHostConnectionTypeValues, NetTransportValues, OSTYPEVALUES_AIX, OSTYPEVALUES_DARWIN, OSTYPEVALUES_DRAGONFLYBSD, OSTYPEVALUES_FREEBSD, OSTYPEVALUES_HPUX, OSTYPEVALUES_LINUX, OSTYPEVALUES_NETBSD, OSTYPEVALUES_OPENBSD, OSTYPEVALUES_SOLARIS, OSTYPEVALUES_WINDOWS, OSTYPEVALUES_Z_OS, OTEL_STATUS_CODE_VALUE_ERROR, OTEL_STATUS_CODE_VALUE_OK, OsTypeValues, RPCGRPCSTATUSCODEVALUES_ABORTED, RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS, RPCGRPCSTATUSCODEVALUES_CANCELLED, RPCGRPCSTATUSCODEVALUES_DATA_LOSS, RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED, RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION, RPCGRPCSTATUSCODEVALUES_INTERNAL, RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT, RPCGRPCSTATUSCODEVALUES_NOT_FOUND, RPCGRPCSTATUSCODEVALUES_OK, RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE, RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED, RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED, RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED, RPCGRPCSTATUSCODEVALUES_UNAVAILABLE, RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED, RPCGRPCSTATUSCODEVALUES_UNKNOWN, RpcGrpcStatusCodeValues, SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET, SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ, SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY, SEMATTRS_AWS_DYNAMODB_COUNT, SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, SEMATTRS_AWS_DYNAMODB_INDEX_NAME, SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS, SEMATTRS_AWS_DYNAMODB_LIMIT, SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_PROJECTION, SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT, SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD, SEMATTRS_AWS_DYNAMODB_SEGMENT, SEMATTRS_AWS_DYNAMODB_SELECT, SEMATTRS_AWS_DYNAMODB_TABLE_COUNT, SEMATTRS_AWS_DYNAMODB_TABLE_NAMES, SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS, SEMATTRS_AWS_LAMBDA_INVOKED_ARN, SEMATTRS_CODE_FILEPATH, SEMATTRS_CODE_FUNCTION, SEMATTRS_CODE_LINENO, SEMATTRS_CODE_NAMESPACE, SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL, SEMATTRS_DB_CASSANDRA_COORDINATOR_DC, SEMATTRS_DB_CASSANDRA_COORDINATOR_ID, SEMATTRS_DB_CASSANDRA_IDEMPOTENCE, SEMATTRS_DB_CASSANDRA_KEYSPACE, SEMATTRS_DB_CASSANDRA_PAGE_SIZE, SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, SEMATTRS_DB_CASSANDRA_TABLE, SEMATTRS_DB_CONNECTION_STRING, SEMATTRS_DB_HBASE_NAMESPACE, SEMATTRS_DB_JDBC_DRIVER_CLASSNAME, SEMATTRS_DB_MONGODB_COLLECTION, SEMATTRS_DB_MSSQL_INSTANCE_NAME, SEMATTRS_DB_NAME, SEMATTRS_DB_OPERATION, SEMATTRS_DB_REDIS_DATABASE_INDEX, SEMATTRS_DB_SQL_TABLE, SEMATTRS_DB_STATEMENT, SEMATTRS_DB_SYSTEM, SEMATTRS_DB_USER, SEMATTRS_ENDUSER_ID, SEMATTRS_ENDUSER_ROLE, SEMATTRS_ENDUSER_SCOPE, SEMATTRS_EXCEPTION_ESCAPED, SEMATTRS_EXCEPTION_MESSAGE, SEMATTRS_EXCEPTION_STACKTRACE, SEMATTRS_EXCEPTION_TYPE, SEMATTRS_FAAS_COLDSTART, SEMATTRS_FAAS_CRON, SEMATTRS_FAAS_DOCUMENT_COLLECTION, SEMATTRS_FAAS_DOCUMENT_NAME, SEMATTRS_FAAS_DOCUMENT_OPERATION, SEMATTRS_FAAS_DOCUMENT_TIME, SEMATTRS_FAAS_EXECUTION, SEMATTRS_FAAS_INVOKED_NAME, SEMATTRS_FAAS_INVOKED_PROVIDER, SEMATTRS_FAAS_INVOKED_REGION, SEMATTRS_FAAS_TIME, SEMATTRS_FAAS_TRIGGER, SEMATTRS_HTTP_CLIENT_IP, SEMATTRS_HTTP_FLAVOR, SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_ROUTE, SEMATTRS_HTTP_SCHEME, SEMATTRS_HTTP_SERVER_NAME, SEMATTRS_HTTP_STATUS_CODE, SEMATTRS_HTTP_TARGET, SEMATTRS_HTTP_URL, SEMATTRS_HTTP_USER_AGENT, SEMATTRS_MESSAGE_COMPRESSED_SIZE, SEMATTRS_MESSAGE_ID, SEMATTRS_MESSAGE_TYPE, SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE, SEMATTRS_MESSAGING_CONSUMER_ID, SEMATTRS_MESSAGING_CONVERSATION_ID, SEMATTRS_MESSAGING_DESTINATION, SEMATTRS_MESSAGING_DESTINATION_KIND, SEMATTRS_MESSAGING_KAFKA_CLIENT_ID, SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP, SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY, SEMATTRS_MESSAGING_KAFKA_PARTITION, SEMATTRS_MESSAGING_KAFKA_TOMBSTONE, SEMATTRS_MESSAGING_MESSAGE_ID, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES, SEMATTRS_MESSAGING_OPERATION, SEMATTRS_MESSAGING_PROTOCOL, SEMATTRS_MESSAGING_PROTOCOL_VERSION, SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY, SEMATTRS_MESSAGING_SYSTEM, SEMATTRS_MESSAGING_TEMP_DESTINATION, SEMATTRS_MESSAGING_URL, SEMATTRS_NET_HOST_CARRIER_ICC, SEMATTRS_NET_HOST_CARRIER_MCC, SEMATTRS_NET_HOST_CARRIER_MNC, SEMATTRS_NET_HOST_CARRIER_NAME, SEMATTRS_NET_HOST_CONNECTION_SUBTYPE, SEMATTRS_NET_HOST_CONNECTION_TYPE, SEMATTRS_NET_HOST_IP, SEMATTRS_NET_HOST_NAME, SEMATTRS_NET_HOST_PORT, SEMATTRS_NET_PEER_IP, SEMATTRS_NET_PEER_NAME, SEMATTRS_NET_PEER_PORT, SEMATTRS_NET_TRANSPORT, SEMATTRS_PEER_SERVICE, SEMATTRS_RPC_GRPC_STATUS_CODE, SEMATTRS_RPC_JSONRPC_ERROR_CODE, SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE, SEMATTRS_RPC_JSONRPC_REQUEST_ID, SEMATTRS_RPC_JSONRPC_VERSION, SEMATTRS_RPC_METHOD, SEMATTRS_RPC_SERVICE, SEMATTRS_RPC_SYSTEM, SEMATTRS_THREAD_ID, SEMATTRS_THREAD_NAME, SEMRESATTRS_AWS_ECS_CLUSTER_ARN, SEMRESATTRS_AWS_ECS_CONTAINER_ARN, SEMRESATTRS_AWS_ECS_LAUNCHTYPE, SEMRESATTRS_AWS_ECS_TASK_ARN, SEMRESATTRS_AWS_ECS_TASK_FAMILY, SEMRESATTRS_AWS_ECS_TASK_REVISION, SEMRESATTRS_AWS_EKS_CLUSTER_ARN, SEMRESATTRS_AWS_LOG_GROUP_ARNS, SEMRESATTRS_AWS_LOG_GROUP_NAMES, SEMRESATTRS_AWS_LOG_STREAM_ARNS, SEMRESATTRS_AWS_LOG_STREAM_NAMES, SEMRESATTRS_CLOUD_ACCOUNT_ID, SEMRESATTRS_CLOUD_AVAILABILITY_ZONE, SEMRESATTRS_CLOUD_PLATFORM, SEMRESATTRS_CLOUD_PROVIDER, SEMRESATTRS_CLOUD_REGION, SEMRESATTRS_CONTAINER_ID, SEMRESATTRS_CONTAINER_IMAGE_NAME, SEMRESATTRS_CONTAINER_IMAGE_TAG, SEMRESATTRS_CONTAINER_NAME, SEMRESATTRS_CONTAINER_RUNTIME, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT, SEMRESATTRS_DEVICE_ID, SEMRESATTRS_DEVICE_MODEL_IDENTIFIER, SEMRESATTRS_DEVICE_MODEL_NAME, SEMRESATTRS_FAAS_ID, SEMRESATTRS_FAAS_INSTANCE, SEMRESATTRS_FAAS_MAX_MEMORY, SEMRESATTRS_FAAS_NAME, SEMRESATTRS_FAAS_VERSION, SEMRESATTRS_HOST_ARCH, SEMRESATTRS_HOST_ID, SEMRESATTRS_HOST_IMAGE_ID, SEMRESATTRS_HOST_IMAGE_NAME, SEMRESATTRS_HOST_IMAGE_VERSION, SEMRESATTRS_HOST_NAME, SEMRESATTRS_HOST_TYPE, SEMRESATTRS_K8S_CLUSTER_NAME, SEMRESATTRS_K8S_CONTAINER_NAME, SEMRESATTRS_K8S_CRONJOB_NAME, SEMRESATTRS_K8S_CRONJOB_UID, SEMRESATTRS_K8S_DAEMONSET_NAME, SEMRESATTRS_K8S_DAEMONSET_UID, SEMRESATTRS_K8S_DEPLOYMENT_NAME, SEMRESATTRS_K8S_DEPLOYMENT_UID, SEMRESATTRS_K8S_JOB_NAME, SEMRESATTRS_K8S_JOB_UID, SEMRESATTRS_K8S_NAMESPACE_NAME, SEMRESATTRS_K8S_NODE_NAME, SEMRESATTRS_K8S_NODE_UID, SEMRESATTRS_K8S_POD_NAME, SEMRESATTRS_K8S_POD_UID, SEMRESATTRS_K8S_REPLICASET_NAME, SEMRESATTRS_K8S_REPLICASET_UID, SEMRESATTRS_K8S_STATEFULSET_NAME, SEMRESATTRS_K8S_STATEFULSET_UID, SEMRESATTRS_OS_DESCRIPTION, SEMRESATTRS_OS_NAME, SEMRESATTRS_OS_TYPE, SEMRESATTRS_OS_VERSION, SEMRESATTRS_PROCESS_COMMAND, SEMRESATTRS_PROCESS_COMMAND_ARGS, SEMRESATTRS_PROCESS_COMMAND_LINE, SEMRESATTRS_PROCESS_EXECUTABLE_NAME, SEMRESATTRS_PROCESS_EXECUTABLE_PATH, SEMRESATTRS_PROCESS_OWNER, SEMRESATTRS_PROCESS_PID, SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION, SEMRESATTRS_PROCESS_RUNTIME_NAME, SEMRESATTRS_PROCESS_RUNTIME_VERSION, SEMRESATTRS_SERVICE_INSTANCE_ID, SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_NAMESPACE, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_TELEMETRY_AUTO_VERSION, SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, SEMRESATTRS_TELEMETRY_SDK_NAME, SEMRESATTRS_TELEMETRY_SDK_VERSION, SEMRESATTRS_WEBENGINE_DESCRIPTION, SEMRESATTRS_WEBENGINE_NAME, SEMRESATTRS_WEBENGINE_VERSION, SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN, SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE, SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT, SIGNALR_TRANSPORT_VALUE_LONG_POLLING, SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS, SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS, SemanticAttributes, SemanticResourceAttributes, TELEMETRYSDKLANGUAGEVALUES_CPP, TELEMETRYSDKLANGUAGEVALUES_DOTNET, TELEMETRYSDKLANGUAGEVALUES_ERLANG, TELEMETRYSDKLANGUAGEVALUES_GO, TELEMETRYSDKLANGUAGEVALUES_JAVA, TELEMETRYSDKLANGUAGEVALUES_NODEJS, TELEMETRYSDKLANGUAGEVALUES_PHP, TELEMETRYSDKLANGUAGEVALUES_PYTHON, TELEMETRYSDKLANGUAGEVALUES_RUBY, TELEMETRYSDKLANGUAGEVALUES_WEBJS, TELEMETRY_SDK_LANGUAGE_VALUE_CPP, TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET, TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG, TELEMETRY_SDK_LANGUAGE_VALUE_GO, TELEMETRY_SDK_LANGUAGE_VALUE_JAVA, TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS, TELEMETRY_SDK_LANGUAGE_VALUE_PHP, TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON, TELEMETRY_SDK_LANGUAGE_VALUE_RUBY, TELEMETRY_SDK_LANGUAGE_VALUE_RUST, TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT, TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS, TelemetrySdkLanguageValues };
