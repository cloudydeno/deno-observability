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
 */
declare const SEMATTRS_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const SEMATTRS_DB_SYSTEM = "db.system";
/**
 * The connection string used to connect to the database. It is recommended to remove embedded credentials.
 */
declare const SEMATTRS_DB_CONNECTION_STRING = "db.connection_string";
/**
 * Username for accessing the database.
 */
declare const SEMATTRS_DB_USER = "db.user";
/**
 * The fully-qualified class name of the [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) driver used to connect.
 */
declare const SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
/**
 * If no [tech-specific attribute](#call-level-attributes-for-specific-technologies) is defined, this attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).
 *
 * Note: In some SQL databases, the database name to be used is called &#34;schema name&#34;.
 */
declare const SEMATTRS_DB_NAME = "db.name";
/**
 * The database statement being executed.
 *
 * Note: The value may be sanitized to exclude sensitive information.
 */
declare const SEMATTRS_DB_STATEMENT = "db.statement";
/**
 * The name of the operation being executed, e.g. the [MongoDB command name](https://docs.mongodb.com/manual/reference/command/#database-operations) such as `findAndModify`, or the SQL keyword.
 *
 * Note: When setting this to an SQL keyword, it is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if the operation name is provided by the library being instrumented. If the SQL statement has an ambiguous operation, or performs more than one operation, this value may be omitted.
 */
declare const SEMATTRS_DB_OPERATION = "db.operation";
/**
 * The Microsoft SQL Server [instance name](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) connecting to. This name is used to determine the port of a named instance.
 *
 * Note: If setting a `db.mssql.instance_name`, `net.peer.port` is no longer required (but still recommended if non-standard).
 */
declare const SEMATTRS_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
/**
 * The name of the keyspace being accessed. To be used instead of the generic `db.name` attribute.
 */
declare const SEMATTRS_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
/**
 * The fetch size used for paging, i.e. how many rows will be returned at once.
 */
declare const SEMATTRS_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
/**
 * The name of the primary table that the operation is acting upon, including the schema name (if applicable).
 *
 * Note: This mirrors the db.sql.table attribute but references cassandra rather than sql. It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
 */
declare const SEMATTRS_DB_CASSANDRA_TABLE = "db.cassandra.table";
/**
 * Whether or not the query is idempotent.
 */
declare const SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
/**
 * The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
 */
declare const SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
/**
 * The ID of the coordinating node for a query.
 */
declare const SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
/**
 * The data center of the coordinating node for a query.
 */
declare const SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
/**
 * The [HBase namespace](https://hbase.apache.org/book.html#_namespace) being accessed. To be used instead of the generic `db.name` attribute.
 */
declare const SEMATTRS_DB_HBASE_NAMESPACE = "db.hbase.namespace";
/**
 * The index of the database being accessed as used in the [`SELECT` command](https://redis.io/commands/select), provided as an integer. To be used instead of the generic `db.name` attribute.
 */
declare const SEMATTRS_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
/**
 * The collection being accessed within the database stated in `db.name`.
 */
declare const SEMATTRS_DB_MONGODB_COLLECTION = "db.mongodb.collection";
/**
 * The name of the primary table that the operation is acting upon, including the schema name (if applicable).
 *
 * Note: It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
 */
declare const SEMATTRS_DB_SQL_TABLE = "db.sql.table";
/**
 * The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
 */
declare const SEMATTRS_EXCEPTION_TYPE = "exception.type";
/**
 * The exception message.
 */
declare const SEMATTRS_EXCEPTION_MESSAGE = "exception.message";
/**
 * A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
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
*/
declare const SEMATTRS_EXCEPTION_ESCAPED = "exception.escaped";
/**
 * Type of the trigger on which the function is executed.
 */
declare const SEMATTRS_FAAS_TRIGGER = "faas.trigger";
/**
 * The execution ID of the current function execution.
 */
declare const SEMATTRS_FAAS_EXECUTION = "faas.execution";
/**
 * The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
 */
declare const SEMATTRS_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
/**
 * Describes the type of the operation that was performed on the data.
 */
declare const SEMATTRS_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
/**
 * A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
 */
declare const SEMATTRS_FAAS_DOCUMENT_TIME = "faas.document.time";
/**
 * The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
 */
declare const SEMATTRS_FAAS_DOCUMENT_NAME = "faas.document.name";
/**
 * A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
 */
declare const SEMATTRS_FAAS_TIME = "faas.time";
/**
 * A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
 */
declare const SEMATTRS_FAAS_CRON = "faas.cron";
/**
 * A boolean that is true if the serverless function is executed for the first time (aka cold-start).
 */
declare const SEMATTRS_FAAS_COLDSTART = "faas.coldstart";
/**
 * The name of the invoked function.
 *
 * Note: SHOULD be equal to the `faas.name` resource attribute of the invoked function.
 */
declare const SEMATTRS_FAAS_INVOKED_NAME = "faas.invoked_name";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 */
declare const SEMATTRS_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
/**
 * The cloud region of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.region` resource attribute of the invoked function.
 */
declare const SEMATTRS_FAAS_INVOKED_REGION = "faas.invoked_region";
/**
 * Transport protocol used. See note below.
 */
declare const SEMATTRS_NET_TRANSPORT = "net.transport";
/**
 * Remote address of the peer (dotted decimal for IPv4 or [RFC5952](https://tools.ietf.org/html/rfc5952) for IPv6).
 */
declare const SEMATTRS_NET_PEER_IP = "net.peer.ip";
/**
 * Remote port number.
 */
declare const SEMATTRS_NET_PEER_PORT = "net.peer.port";
/**
 * Remote hostname or similar, see note below.
 */
declare const SEMATTRS_NET_PEER_NAME = "net.peer.name";
/**
 * Like `net.peer.ip` but for the host IP. Useful in case of a multi-IP host.
 */
declare const SEMATTRS_NET_HOST_IP = "net.host.ip";
/**
 * Like `net.peer.port` but for the host port.
 */
declare const SEMATTRS_NET_HOST_PORT = "net.host.port";
/**
 * Local hostname or similar, see note below.
 */
declare const SEMATTRS_NET_HOST_NAME = "net.host.name";
/**
 * The internet connection type currently being used by the host.
 */
declare const SEMATTRS_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
/**
 * The name of the mobile carrier.
 */
declare const SEMATTRS_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
/**
 * The mobile carrier country code.
 */
declare const SEMATTRS_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
/**
 * The mobile carrier network code.
 */
declare const SEMATTRS_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
/**
 * The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
 */
declare const SEMATTRS_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
/**
 * The [`service.name`](../../resource/semantic_conventions/README.md#service) of the remote service. SHOULD be equal to the actual `service.name` resource attribute of the remote service if any.
 */
declare const SEMATTRS_PEER_SERVICE = "peer.service";
/**
 * Username or client_id extracted from the access token or [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) header in the inbound request from outside the system.
 */
declare const SEMATTRS_ENDUSER_ID = "enduser.id";
/**
 * Actual/assumed role the client is making the request under extracted from token or application security context.
 */
declare const SEMATTRS_ENDUSER_ROLE = "enduser.role";
/**
 * Scopes or granted authorities the client currently possesses extracted from token or application security context. The value would come from the scope associated with an [OAuth 2.0 Access Token](https://tools.ietf.org/html/rfc6749#section-3.3) or an attribute value in a [SAML 2.0 Assertion](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).
 */
declare const SEMATTRS_ENDUSER_SCOPE = "enduser.scope";
/**
 * Current &#34;managed&#34; thread ID (as opposed to OS thread ID).
 */
declare const SEMATTRS_THREAD_ID = "thread.id";
/**
 * Current thread name.
 */
declare const SEMATTRS_THREAD_NAME = "thread.name";
/**
 * The method or function name, or equivalent (usually rightmost part of the code unit&#39;s name).
 */
declare const SEMATTRS_CODE_FUNCTION = "code.function";
/**
 * The &#34;namespace&#34; within which `code.function` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function` form a unique identifier for the code unit.
 */
declare const SEMATTRS_CODE_NAMESPACE = "code.namespace";
/**
 * The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
 */
declare const SEMATTRS_CODE_FILEPATH = "code.filepath";
/**
 * The line number in `code.filepath` best representing the operation. It SHOULD point within the code unit named in `code.function`.
 */
declare const SEMATTRS_CODE_LINENO = "code.lineno";
/**
 * HTTP request method.
 */
declare const SEMATTRS_HTTP_METHOD = "http.method";
/**
 * Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.
 *
 * Note: `http.url` MUST NOT contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case the attribute&#39;s value should be `https://www.example.com/`.
 */
declare const SEMATTRS_HTTP_URL = "http.url";
/**
 * The full request target as passed in a HTTP request line or equivalent.
 */
declare const SEMATTRS_HTTP_TARGET = "http.target";
/**
 * The value of the [HTTP host header](https://tools.ietf.org/html/rfc7230#section-5.4). An empty Host header should also be reported, see note.
 *
 * Note: When the header is present but empty the attribute SHOULD be set to the empty string. Note that this is a valid situation that is expected in certain cases, according the aforementioned [section of RFC 7230](https://tools.ietf.org/html/rfc7230#section-5.4). When the header is not set the attribute MUST NOT be set.
 */
declare const SEMATTRS_HTTP_HOST = "http.host";
/**
 * The URI scheme identifying the used protocol.
 */
declare const SEMATTRS_HTTP_SCHEME = "http.scheme";
/**
 * [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
 */
declare const SEMATTRS_HTTP_STATUS_CODE = "http.status_code";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 */
declare const SEMATTRS_HTTP_FLAVOR = "http.flavor";
/**
 * Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client.
 */
declare const SEMATTRS_HTTP_USER_AGENT = "http.user_agent";
/**
 * The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
 */
declare const SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
/**
 * The size of the uncompressed request payload body after transport decoding. Not set if transport encoding not used.
 */
declare const SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
/**
 * The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
 */
declare const SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
/**
 * The size of the uncompressed response payload body after transport decoding. Not set if transport encoding not used.
 */
declare const SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
/**
 * The primary server name of the matched virtual host. This should be obtained via configuration. If no such configuration can be obtained, this attribute MUST NOT be set ( `net.host.name` should be used instead).
 *
 * Note: `http.url` is usually not readily available on the server side but would have to be assembled in a cumbersome and sometimes lossy process from other information (see e.g. open-telemetry/opentelemetry-python/pull/148). It is thus preferred to supply the raw data that is available.
 */
declare const SEMATTRS_HTTP_SERVER_NAME = "http.server_name";
/**
 * The matched route (path template).
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
*/
declare const SEMATTRS_HTTP_CLIENT_IP = "http.client_ip";
/**
 * The keys in the `RequestItems` object field.
 */
declare const SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
/**
 * The JSON-serialized value of each item in the `ConsumedCapacity` response field.
 */
declare const SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
/**
 * The JSON-serialized value of the `ItemCollectionMetrics` response field.
 */
declare const SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
/**
 * The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
/**
 * The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
/**
 * The value of the `ConsistentRead` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
/**
 * The value of the `ProjectionExpression` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
/**
 * The value of the `Limit` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
/**
 * The value of the `AttributesToGet` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
/**
 * The value of the `IndexName` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
/**
 * The value of the `Select` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
/**
 * The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field.
 */
declare const SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
/**
 * The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
 */
declare const SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
/**
 * The value of the `ExclusiveStartTableName` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
/**
 * The the number of items in the `TableNames` response parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
/**
 * The value of the `ScanIndexForward` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
/**
 * The value of the `Segment` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
/**
 * The value of the `TotalSegments` request parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
/**
 * The value of the `Count` response parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
/**
 * The value of the `ScannedCount` response parameter.
 */
declare const SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
/**
 * The JSON-serialized value of each item in the `AttributeDefinitions` request field.
 */
declare const SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
/**
 * The JSON-serialized value of each item in the the `GlobalSecondaryIndexUpdates` request field.
 */
declare const SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
/**
 * A string identifying the messaging system.
 */
declare const SEMATTRS_MESSAGING_SYSTEM = "messaging.system";
/**
 * The message destination name. This might be equal to the span name but is required nevertheless.
 */
declare const SEMATTRS_MESSAGING_DESTINATION = "messaging.destination";
/**
 * The kind of message destination.
 */
declare const SEMATTRS_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
/**
 * A boolean that is true if the message destination is temporary.
 */
declare const SEMATTRS_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
/**
 * The name of the transport protocol.
 */
declare const SEMATTRS_MESSAGING_PROTOCOL = "messaging.protocol";
/**
 * The version of the transport protocol.
 */
declare const SEMATTRS_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
/**
 * Connection string.
 */
declare const SEMATTRS_MESSAGING_URL = "messaging.url";
/**
 * A value used by the messaging system as an identifier for the message, represented as a string.
 */
declare const SEMATTRS_MESSAGING_MESSAGE_ID = "messaging.message_id";
/**
 * The [conversation ID](#conversations) identifying the conversation to which the message belongs, represented as a string. Sometimes called &#34;Correlation ID&#34;.
 */
declare const SEMATTRS_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
/**
 * The (uncompressed) size of the message payload in bytes. Also use this attribute if it is unknown whether the compressed or uncompressed payload size is reported.
 */
declare const SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
/**
 * The compressed size of the message payload in bytes.
 */
declare const SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
/**
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
 */
declare const SEMATTRS_MESSAGING_OPERATION = "messaging.operation";
/**
 * The identifier for the consumer receiving a message. For Kafka, set it to `{messaging.kafka.consumer_group} - {messaging.kafka.client_id}`, if both are present, or only `messaging.kafka.consumer_group`. For brokers, such as RabbitMQ and Artemis, set it to the `client_id` of the client consuming the message.
 */
declare const SEMATTRS_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
/**
 * RabbitMQ message routing key.
 */
declare const SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
/**
 * Message keys in Kafka are used for grouping alike messages to ensure they&#39;re processed on the same partition. They differ from `messaging.message_id` in that they&#39;re not unique. If the key is `null`, the attribute MUST NOT be set.
 *
 * Note: If the key type is not string, it&#39;s string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don&#39;t include its value.
 */
declare const SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
/**
 * Name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.
 */
declare const SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
/**
 * Client Id for the Consumer or Producer that is handling the message.
 */
declare const SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
/**
 * Partition the message is sent to.
 */
declare const SEMATTRS_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
/**
 * A boolean that is true if the message is a tombstone.
 */
declare const SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
/**
 * A string identifying the remoting system.
 */
declare const SEMATTRS_RPC_SYSTEM = "rpc.system";
/**
 * The full (logical) name of the service being called, including its package name, if applicable.
 *
 * Note: This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
 */
declare const SEMATTRS_RPC_SERVICE = "rpc.service";
/**
 * The name of the (logical) method being called, must be equal to the $method part in the span name.
 *
 * Note: This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
 */
declare const SEMATTRS_RPC_METHOD = "rpc.method";
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const SEMATTRS_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
/**
 * Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 does not specify this, the value can be omitted.
 */
declare const SEMATTRS_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
/**
 * `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
 */
declare const SEMATTRS_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
/**
 * `error.code` property of response if it is an error response.
 */
declare const SEMATTRS_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
/**
 * `error.message` property of response if it is an error response.
 */
declare const SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
/**
 * Whether this is a received or sent message.
 */
declare const SEMATTRS_MESSAGE_TYPE = "message.type";
/**
 * MUST be calculated as two different counters starting from `1` one for sent messages and one for received message.
 *
 * Note: This way we guarantee that the values will be consistent between different implementations.
 */
declare const SEMATTRS_MESSAGE_ID = "message.id";
/**
 * Compressed size of the message in bytes.
 */
declare const SEMATTRS_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
/**
 * Uncompressed size of the message in bytes.
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
 */
declare const DBSYSTEMVALUES_OTHER_SQL = "other_sql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_MSSQL = "mssql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_MYSQL = "mysql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_ORACLE = "oracle";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_DB2 = "db2";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_POSTGRESQL = "postgresql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_REDSHIFT = "redshift";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_HIVE = "hive";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_CLOUDSCAPE = "cloudscape";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_HSQLDB = "hsqldb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_PROGRESS = "progress";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_MAXDB = "maxdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_HANADB = "hanadb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_INGRES = "ingres";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_FIRSTSQL = "firstsql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_EDB = "edb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_CACHE = "cache";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_ADABAS = "adabas";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_FIREBIRD = "firebird";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_DERBY = "derby";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_FILEMAKER = "filemaker";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_INFORMIX = "informix";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_INSTANTDB = "instantdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_INTERBASE = "interbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_MARIADB = "mariadb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_NETEZZA = "netezza";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_PERVASIVE = "pervasive";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_POINTBASE = "pointbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_SQLITE = "sqlite";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_SYBASE = "sybase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_TERADATA = "teradata";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_VERTICA = "vertica";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_H2 = "h2";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_COLDFUSION = "coldfusion";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_CASSANDRA = "cassandra";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_HBASE = "hbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_MONGODB = "mongodb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_REDIS = "redis";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_COUCHBASE = "couchbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_COUCHDB = "couchdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_COSMOSDB = "cosmosdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_DYNAMODB = "dynamodb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_NEO4J = "neo4j";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_GEODE = "geode";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_ELASTICSEARCH = "elasticsearch";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 */
declare const DBSYSTEMVALUES_MEMCACHED = "memcached";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
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
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ALL = "all";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = "each_quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = "quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = "local_quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ONE = "one";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_TWO = "two";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_THREE = "three";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = "local_one";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ANY = "any";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = "serial";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
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
 */
declare const FAASTRIGGERVALUES_DATASOURCE = "datasource";
/**
 * Type of the trigger on which the function is executed.
 */
declare const FAASTRIGGERVALUES_HTTP = "http";
/**
 * Type of the trigger on which the function is executed.
 */
declare const FAASTRIGGERVALUES_PUBSUB = "pubsub";
/**
 * Type of the trigger on which the function is executed.
 */
declare const FAASTRIGGERVALUES_TIMER = "timer";
/**
 * Type of the trigger on which the function is executed.
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
 */
declare const FAASDOCUMENTOPERATIONVALUES_INSERT = "insert";
/**
 * Describes the type of the operation that was performed on the data.
 */
declare const FAASDOCUMENTOPERATIONVALUES_EDIT = "edit";
/**
 * Describes the type of the operation that was performed on the data.
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
 */
declare const FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 */
declare const FAASINVOKEDPROVIDERVALUES_AWS = "aws";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 */
declare const FAASINVOKEDPROVIDERVALUES_AZURE = "azure";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
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
 */
declare const NETTRANSPORTVALUES_IP_TCP = "ip_tcp";
/**
 * Transport protocol used. See note below.
 */
declare const NETTRANSPORTVALUES_IP_UDP = "ip_udp";
/**
 * Transport protocol used. See note below.
 */
declare const NETTRANSPORTVALUES_IP = "ip";
/**
 * Transport protocol used. See note below.
 */
declare const NETTRANSPORTVALUES_UNIX = "unix";
/**
 * Transport protocol used. See note below.
 */
declare const NETTRANSPORTVALUES_PIPE = "pipe";
/**
 * Transport protocol used. See note below.
 */
declare const NETTRANSPORTVALUES_INPROC = "inproc";
/**
 * Transport protocol used. See note below.
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
 */
declare const NETHOSTCONNECTIONTYPEVALUES_WIFI = "wifi";
/**
 * The internet connection type currently being used by the host.
 */
declare const NETHOSTCONNECTIONTYPEVALUES_WIRED = "wired";
/**
 * The internet connection type currently being used by the host.
 */
declare const NETHOSTCONNECTIONTYPEVALUES_CELL = "cell";
/**
 * The internet connection type currently being used by the host.
 */
declare const NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = "unavailable";
/**
 * The internet connection type currently being used by the host.
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
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = "gprs";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = "edge";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = "umts";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = "cdma";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = "evdo_0";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = "evdo_a";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = "cdma2000_1xrtt";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = "hsdpa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = "hsupa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = "hspa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = "iden";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = "evdo_b";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_LTE = "lte";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = "ehrpd";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = "hspap";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_GSM = "gsm";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = "td_scdma";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = "iwlan";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_NR = "nr";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = "nrnsa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
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
 */
declare const HTTPFLAVORVALUES_HTTP_1_0 = "1.0";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 */
declare const HTTPFLAVORVALUES_HTTP_1_1 = "1.1";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 */
declare const HTTPFLAVORVALUES_HTTP_2_0 = "2.0";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 */
declare const HTTPFLAVORVALUES_SPDY = "SPDY";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
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
 */
declare const MESSAGINGDESTINATIONKINDVALUES_QUEUE = "queue";
/**
 * The kind of message destination.
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
 */
declare const MESSAGINGOPERATIONVALUES_RECEIVE = "receive";
/**
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
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
 */
declare const RPCGRPCSTATUSCODEVALUES_OK = 0;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_CANCELLED = 1;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_UNKNOWN = 2;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = 3;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = 4;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_NOT_FOUND = 5;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = 6;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = 7;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = 8;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = 9;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_ABORTED = 10;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = 11;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = 12;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_INTERNAL = 13;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = 14;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 */
declare const RPCGRPCSTATUSCODEVALUES_DATA_LOSS = 15;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
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
 */
declare const MESSAGETYPEVALUES_SENT = "SENT";
/**
 * Whether this is a received or sent message.
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
 */
declare const SEMRESATTRS_CLOUD_PROVIDER = "cloud.provider";
/**
 * The cloud account ID the resource is assigned to.
 */
declare const SEMRESATTRS_CLOUD_ACCOUNT_ID = "cloud.account.id";
/**
 * The geographical region the resource is running. Refer to your provider&#39;s docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/geographies/), or [Google Cloud regions](https://cloud.google.com/about/locations).
 */
declare const SEMRESATTRS_CLOUD_REGION = "cloud.region";
/**
 * Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
 *
 * Note: Availability zones are called &#34;zones&#34; on Alibaba Cloud and Google Cloud.
 */
declare const SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const SEMRESATTRS_CLOUD_PLATFORM = "cloud.platform";
/**
 * The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
 */
declare const SEMRESATTRS_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
/**
 * The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
 */
declare const SEMRESATTRS_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
/**
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 */
declare const SEMRESATTRS_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
/**
 * The ARN of an [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html).
 */
declare const SEMRESATTRS_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
/**
 * The task definition family this task definition is a member of.
 */
declare const SEMRESATTRS_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
/**
 * The revision for this task definition.
 */
declare const SEMRESATTRS_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
/**
 * The ARN of an EKS cluster.
 */
declare const SEMRESATTRS_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
/**
 * The name(s) of the AWS log group(s) an application is writing to.
 *
 * Note: Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
 */
declare const SEMRESATTRS_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
/**
 * The Amazon Resource Name(s) (ARN) of the AWS log group(s).
 *
 * Note: See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
 */
declare const SEMRESATTRS_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
/**
 * The name(s) of the AWS log stream(s) an application is writing to.
 */
declare const SEMRESATTRS_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
/**
 * The ARN(s) of the AWS log stream(s).
 *
 * Note: See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
 */
declare const SEMRESATTRS_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
/**
 * Container name.
 */
declare const SEMRESATTRS_CONTAINER_NAME = "container.name";
/**
 * Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/reference/run/#container-identification). The UUID might be abbreviated.
 */
declare const SEMRESATTRS_CONTAINER_ID = "container.id";
/**
 * The container runtime managing this container.
 */
declare const SEMRESATTRS_CONTAINER_RUNTIME = "container.runtime";
/**
 * Name of the image the container was built on.
 */
declare const SEMRESATTRS_CONTAINER_IMAGE_NAME = "container.image.name";
/**
 * Container image tag.
 */
declare const SEMRESATTRS_CONTAINER_IMAGE_TAG = "container.image.tag";
/**
 * Name of the [deployment environment](https://en.wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
 */
declare const SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
/**
 * A unique identifier representing the device.
 *
 * Note: The device identifier MUST only be defined using the values outlined below. This value is not an advertising identifier and MUST NOT be used as such. On iOS (Swift or Objective-C), this value MUST be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value MUST be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
 */
declare const SEMRESATTRS_DEVICE_ID = "device.id";
/**
 * The model identifier for the device.
 *
 * Note: It&#39;s recommended this value represents a machine readable version of the model identifier rather than the market or consumer-friendly name of the device.
 */
declare const SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
/**
 * The marketing name for the device model.
 *
 * Note: It&#39;s recommended this value represents a human readable version of the device model rather than a machine readable alternative.
 */
declare const SEMRESATTRS_DEVICE_MODEL_NAME = "device.model.name";
/**
 * The name of the single function that this runtime instance executes.
 *
 * Note: This is the name of the function as configured/deployed on the FaaS platform and is usually different from the name of the callback function (which may be stored in the [`code.namespace`/`code.function`](../../trace/semantic_conventions/span-general.md#source-code-attributes) span attributes).
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
*/
declare const SEMRESATTRS_FAAS_VERSION = "faas.version";
/**
 * The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
 *
 * Note: * **AWS Lambda:** Use the (full) log stream name.
 */
declare const SEMRESATTRS_FAAS_INSTANCE = "faas.instance";
/**
 * The amount of memory available to the serverless function in MiB.
 *
 * Note: It&#39;s recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information.
 */
declare const SEMRESATTRS_FAAS_MAX_MEMORY = "faas.max_memory";
/**
 * Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider.
 */
declare const SEMRESATTRS_HOST_ID = "host.id";
/**
 * Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
 */
declare const SEMRESATTRS_HOST_NAME = "host.name";
/**
 * Type of host. For Cloud, this must be the machine type.
 */
declare const SEMRESATTRS_HOST_TYPE = "host.type";
/**
 * The CPU architecture the host system is running on.
 */
declare const SEMRESATTRS_HOST_ARCH = "host.arch";
/**
 * Name of the VM image or OS install the host was instantiated from.
 */
declare const SEMRESATTRS_HOST_IMAGE_NAME = "host.image.name";
/**
 * VM image ID. For Cloud, this value is from the provider.
 */
declare const SEMRESATTRS_HOST_IMAGE_ID = "host.image.id";
/**
 * The version string of the VM image as defined in [Version Attributes](README.md#version-attributes).
 */
declare const SEMRESATTRS_HOST_IMAGE_VERSION = "host.image.version";
/**
 * The name of the cluster.
 */
declare const SEMRESATTRS_K8S_CLUSTER_NAME = "k8s.cluster.name";
/**
 * The name of the Node.
 */
declare const SEMRESATTRS_K8S_NODE_NAME = "k8s.node.name";
/**
 * The UID of the Node.
 */
declare const SEMRESATTRS_K8S_NODE_UID = "k8s.node.uid";
/**
 * The name of the namespace that the pod is running in.
 */
declare const SEMRESATTRS_K8S_NAMESPACE_NAME = "k8s.namespace.name";
/**
 * The UID of the Pod.
 */
declare const SEMRESATTRS_K8S_POD_UID = "k8s.pod.uid";
/**
 * The name of the Pod.
 */
declare const SEMRESATTRS_K8S_POD_NAME = "k8s.pod.name";
/**
 * The name of the Container in a Pod template.
 */
declare const SEMRESATTRS_K8S_CONTAINER_NAME = "k8s.container.name";
/**
 * The UID of the ReplicaSet.
 */
declare const SEMRESATTRS_K8S_REPLICASET_UID = "k8s.replicaset.uid";
/**
 * The name of the ReplicaSet.
 */
declare const SEMRESATTRS_K8S_REPLICASET_NAME = "k8s.replicaset.name";
/**
 * The UID of the Deployment.
 */
declare const SEMRESATTRS_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
/**
 * The name of the Deployment.
 */
declare const SEMRESATTRS_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
/**
 * The UID of the StatefulSet.
 */
declare const SEMRESATTRS_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
/**
 * The name of the StatefulSet.
 */
declare const SEMRESATTRS_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
/**
 * The UID of the DaemonSet.
 */
declare const SEMRESATTRS_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
/**
 * The name of the DaemonSet.
 */
declare const SEMRESATTRS_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
/**
 * The UID of the Job.
 */
declare const SEMRESATTRS_K8S_JOB_UID = "k8s.job.uid";
/**
 * The name of the Job.
 */
declare const SEMRESATTRS_K8S_JOB_NAME = "k8s.job.name";
/**
 * The UID of the CronJob.
 */
declare const SEMRESATTRS_K8S_CRONJOB_UID = "k8s.cronjob.uid";
/**
 * The name of the CronJob.
 */
declare const SEMRESATTRS_K8S_CRONJOB_NAME = "k8s.cronjob.name";
/**
 * The operating system type.
 */
declare const SEMRESATTRS_OS_TYPE = "os.type";
/**
 * Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
 */
declare const SEMRESATTRS_OS_DESCRIPTION = "os.description";
/**
 * Human readable operating system name.
 */
declare const SEMRESATTRS_OS_NAME = "os.name";
/**
 * The version string of the operating system as defined in [Version Attributes](../../resource/semantic_conventions/README.md#version-attributes).
 */
declare const SEMRESATTRS_OS_VERSION = "os.version";
/**
 * Process identifier (PID).
 */
declare const SEMRESATTRS_PROCESS_PID = "process.pid";
/**
 * The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
 */
declare const SEMRESATTRS_PROCESS_EXECUTABLE_NAME = "process.executable.name";
/**
 * The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
 */
declare const SEMRESATTRS_PROCESS_EXECUTABLE_PATH = "process.executable.path";
/**
 * The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
 */
declare const SEMRESATTRS_PROCESS_COMMAND = "process.command";
/**
 * The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
 */
declare const SEMRESATTRS_PROCESS_COMMAND_LINE = "process.command_line";
/**
 * All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
 */
declare const SEMRESATTRS_PROCESS_COMMAND_ARGS = "process.command_args";
/**
 * The username of the user that owns the process.
 */
declare const SEMRESATTRS_PROCESS_OWNER = "process.owner";
/**
 * The name of the runtime of this process. For compiled native binaries, this SHOULD be the name of the compiler.
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_NAME = "process.runtime.name";
/**
 * The version of the runtime of this process, as returned by the runtime without modification.
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_VERSION = "process.runtime.version";
/**
 * An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
/**
 * Logical name of the service.
 *
 * Note: MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs MUST fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md#process), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value MUST be set to `unknown_service`.
 */
declare const SEMRESATTRS_SERVICE_NAME = "service.name";
/**
 * A namespace for `service.name`.
 *
 * Note: A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
 */
declare const SEMRESATTRS_SERVICE_NAMESPACE = "service.namespace";
/**
 * The string ID of the service instance.
 *
 * Note: MUST be unique for each instance of the same `service.namespace,service.name` pair (in other words `service.namespace,service.name,service.instance.id` triplet MUST be globally unique). The ID helps to distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled service). It is preferable for the ID to be persistent and stay the same for the lifetime of the service instance, however it is acceptable that the ID is ephemeral and changes during important lifetime events for the service (e.g. service restarts). If the service has no inherent unique ID that can be used as the value of this attribute it is recommended to generate a random Version 1 or Version 4 RFC 4122 UUID (services aiming for reproducible UUIDs may also use Version 5, see RFC 4122 for more recommendations).
 */
declare const SEMRESATTRS_SERVICE_INSTANCE_ID = "service.instance.id";
/**
 * The version string of the service API or implementation.
 */
declare const SEMRESATTRS_SERVICE_VERSION = "service.version";
/**
 * The name of the telemetry SDK as defined above.
 */
declare const SEMRESATTRS_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
/**
 * The language of the telemetry SDK.
 */
declare const SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
/**
 * The version string of the telemetry SDK.
 */
declare const SEMRESATTRS_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
/**
 * The version string of the auto instrumentation agent, if used.
 */
declare const SEMRESATTRS_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
/**
 * The name of the web engine.
 */
declare const SEMRESATTRS_WEBENGINE_NAME = "webengine.name";
/**
 * The version of the web engine.
 */
declare const SEMRESATTRS_WEBENGINE_VERSION = "webengine.version";
/**
 * Additional description of the web engine (e.g. detailed version and edition information).
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
 */
declare const CLOUDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
/**
 * Name of the cloud provider.
 */
declare const CLOUDPROVIDERVALUES_AWS = "aws";
/**
 * Name of the cloud provider.
 */
declare const CLOUDPROVIDERVALUES_AZURE = "azure";
/**
 * Name of the cloud provider.
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
 */
declare const CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AWS_EC2 = "aws_ec2";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AWS_ECS = "aws_ecs";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AWS_EKS = "aws_eks";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AWS_LAMBDA = "aws_lambda";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AZURE_VM = "azure_vm";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = "azure_container_instances";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AZURE_AKS = "azure_aks";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = "azure_functions";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = "azure_app_service";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = "gcp_cloud_run";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 */
declare const CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
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
 */
declare const AWSECSLAUNCHTYPEVALUES_EC2 = "ec2";
/**
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
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
 */
declare const HOSTARCHVALUES_AMD64 = "amd64";
/**
 * The CPU architecture the host system is running on.
 */
declare const HOSTARCHVALUES_ARM32 = "arm32";
/**
 * The CPU architecture the host system is running on.
 */
declare const HOSTARCHVALUES_ARM64 = "arm64";
/**
 * The CPU architecture the host system is running on.
 */
declare const HOSTARCHVALUES_IA64 = "ia64";
/**
 * The CPU architecture the host system is running on.
 */
declare const HOSTARCHVALUES_PPC32 = "ppc32";
/**
 * The CPU architecture the host system is running on.
 */
declare const HOSTARCHVALUES_PPC64 = "ppc64";
/**
 * The CPU architecture the host system is running on.
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
 */
declare const OSTYPEVALUES_WINDOWS = "windows";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_LINUX = "linux";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_DARWIN = "darwin";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_FREEBSD = "freebsd";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_NETBSD = "netbsd";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_OPENBSD = "openbsd";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_DRAGONFLYBSD = "dragonflybsd";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_HPUX = "hpux";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_AIX = "aix";
/**
 * The operating system type.
 */
declare const OSTYPEVALUES_SOLARIS = "solaris";
/**
 * The operating system type.
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
 */
declare const TELEMETRYSDKLANGUAGEVALUES_CPP = "cpp";
/**
 * The language of the telemetry SDK.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_DOTNET = "dotnet";
/**
 * The language of the telemetry SDK.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_ERLANG = "erlang";
/**
 * The language of the telemetry SDK.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_GO = "go";
/**
 * The language of the telemetry SDK.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_JAVA = "java";
/**
 * The language of the telemetry SDK.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_NODEJS = "nodejs";
/**
 * The language of the telemetry SDK.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_PHP = "php";
/**
 * The language of the telemetry SDK.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_PYTHON = "python";
/**
 * The language of the telemetry SDK.
 */
declare const TELEMETRYSDKLANGUAGEVALUES_RUBY = "ruby";
/**
 * The language of the telemetry SDK.
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

export { AWSECSLAUNCHTYPEVALUES_EC2, AWSECSLAUNCHTYPEVALUES_FARGATE, AwsEcsLaunchtypeValues, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC, CLOUDPLATFORMVALUES_AWS_EC2, CLOUDPLATFORMVALUES_AWS_ECS, CLOUDPLATFORMVALUES_AWS_EKS, CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK, CLOUDPLATFORMVALUES_AWS_LAMBDA, CLOUDPLATFORMVALUES_AZURE_AKS, CLOUDPLATFORMVALUES_AZURE_APP_SERVICE, CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES, CLOUDPLATFORMVALUES_AZURE_FUNCTIONS, CLOUDPLATFORMVALUES_AZURE_VM, CLOUDPLATFORMVALUES_GCP_APP_ENGINE, CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS, CLOUDPLATFORMVALUES_GCP_CLOUD_RUN, CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE, CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE, CLOUDPROVIDERVALUES_ALIBABA_CLOUD, CLOUDPROVIDERVALUES_AWS, CLOUDPROVIDERVALUES_AZURE, CLOUDPROVIDERVALUES_GCP, CloudPlatformValues, CloudProviderValues, DBCASSANDRACONSISTENCYLEVELVALUES_ALL, DBCASSANDRACONSISTENCYLEVELVALUES_ANY, DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_THREE, DBCASSANDRACONSISTENCYLEVELVALUES_TWO, DBSYSTEMVALUES_ADABAS, DBSYSTEMVALUES_CACHE, DBSYSTEMVALUES_CASSANDRA, DBSYSTEMVALUES_CLOUDSCAPE, DBSYSTEMVALUES_COCKROACHDB, DBSYSTEMVALUES_COLDFUSION, DBSYSTEMVALUES_COSMOSDB, DBSYSTEMVALUES_COUCHBASE, DBSYSTEMVALUES_COUCHDB, DBSYSTEMVALUES_DB2, DBSYSTEMVALUES_DERBY, DBSYSTEMVALUES_DYNAMODB, DBSYSTEMVALUES_EDB, DBSYSTEMVALUES_ELASTICSEARCH, DBSYSTEMVALUES_FILEMAKER, DBSYSTEMVALUES_FIREBIRD, DBSYSTEMVALUES_FIRSTSQL, DBSYSTEMVALUES_GEODE, DBSYSTEMVALUES_H2, DBSYSTEMVALUES_HANADB, DBSYSTEMVALUES_HBASE, DBSYSTEMVALUES_HIVE, DBSYSTEMVALUES_HSQLDB, DBSYSTEMVALUES_INFORMIX, DBSYSTEMVALUES_INGRES, DBSYSTEMVALUES_INSTANTDB, DBSYSTEMVALUES_INTERBASE, DBSYSTEMVALUES_MARIADB, DBSYSTEMVALUES_MAXDB, DBSYSTEMVALUES_MEMCACHED, DBSYSTEMVALUES_MONGODB, DBSYSTEMVALUES_MSSQL, DBSYSTEMVALUES_MYSQL, DBSYSTEMVALUES_NEO4J, DBSYSTEMVALUES_NETEZZA, DBSYSTEMVALUES_ORACLE, DBSYSTEMVALUES_OTHER_SQL, DBSYSTEMVALUES_PERVASIVE, DBSYSTEMVALUES_POINTBASE, DBSYSTEMVALUES_POSTGRESQL, DBSYSTEMVALUES_PROGRESS, DBSYSTEMVALUES_REDIS, DBSYSTEMVALUES_REDSHIFT, DBSYSTEMVALUES_SQLITE, DBSYSTEMVALUES_SYBASE, DBSYSTEMVALUES_TERADATA, DBSYSTEMVALUES_VERTICA, DbCassandraConsistencyLevelValues, DbSystemValues, FAASDOCUMENTOPERATIONVALUES_DELETE, FAASDOCUMENTOPERATIONVALUES_EDIT, FAASDOCUMENTOPERATIONVALUES_INSERT, FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD, FAASINVOKEDPROVIDERVALUES_AWS, FAASINVOKEDPROVIDERVALUES_AZURE, FAASINVOKEDPROVIDERVALUES_GCP, FAASTRIGGERVALUES_DATASOURCE, FAASTRIGGERVALUES_HTTP, FAASTRIGGERVALUES_OTHER, FAASTRIGGERVALUES_PUBSUB, FAASTRIGGERVALUES_TIMER, FaasDocumentOperationValues, FaasInvokedProviderValues, FaasTriggerValues, HOSTARCHVALUES_AMD64, HOSTARCHVALUES_ARM32, HOSTARCHVALUES_ARM64, HOSTARCHVALUES_IA64, HOSTARCHVALUES_PPC32, HOSTARCHVALUES_PPC64, HOSTARCHVALUES_X86, HTTPFLAVORVALUES_HTTP_1_0, HTTPFLAVORVALUES_HTTP_1_1, HTTPFLAVORVALUES_HTTP_2_0, HTTPFLAVORVALUES_QUIC, HTTPFLAVORVALUES_SPDY, HostArchValues, HttpFlavorValues, MESSAGETYPEVALUES_RECEIVED, MESSAGETYPEVALUES_SENT, MESSAGINGDESTINATIONKINDVALUES_QUEUE, MESSAGINGDESTINATIONKINDVALUES_TOPIC, MESSAGINGOPERATIONVALUES_PROCESS, MESSAGINGOPERATIONVALUES_RECEIVE, MessageTypeValues, MessagingDestinationKindValues, MessagingOperationValues, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT, NETHOSTCONNECTIONSUBTYPEVALUES_EDGE, NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B, NETHOSTCONNECTIONSUBTYPEVALUES_GPRS, NETHOSTCONNECTIONSUBTYPEVALUES_GSM, NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP, NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA, NETHOSTCONNECTIONSUBTYPEVALUES_IDEN, NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN, NETHOSTCONNECTIONSUBTYPEVALUES_LTE, NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA, NETHOSTCONNECTIONSUBTYPEVALUES_NR, NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA, NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA, NETHOSTCONNECTIONSUBTYPEVALUES_UMTS, NETHOSTCONNECTIONTYPEVALUES_CELL, NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE, NETHOSTCONNECTIONTYPEVALUES_UNKNOWN, NETHOSTCONNECTIONTYPEVALUES_WIFI, NETHOSTCONNECTIONTYPEVALUES_WIRED, NETTRANSPORTVALUES_INPROC, NETTRANSPORTVALUES_IP, NETTRANSPORTVALUES_IP_TCP, NETTRANSPORTVALUES_IP_UDP, NETTRANSPORTVALUES_OTHER, NETTRANSPORTVALUES_PIPE, NETTRANSPORTVALUES_UNIX, NetHostConnectionSubtypeValues, NetHostConnectionTypeValues, NetTransportValues, OSTYPEVALUES_AIX, OSTYPEVALUES_DARWIN, OSTYPEVALUES_DRAGONFLYBSD, OSTYPEVALUES_FREEBSD, OSTYPEVALUES_HPUX, OSTYPEVALUES_LINUX, OSTYPEVALUES_NETBSD, OSTYPEVALUES_OPENBSD, OSTYPEVALUES_SOLARIS, OSTYPEVALUES_WINDOWS, OSTYPEVALUES_Z_OS, OsTypeValues, RPCGRPCSTATUSCODEVALUES_ABORTED, RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS, RPCGRPCSTATUSCODEVALUES_CANCELLED, RPCGRPCSTATUSCODEVALUES_DATA_LOSS, RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED, RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION, RPCGRPCSTATUSCODEVALUES_INTERNAL, RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT, RPCGRPCSTATUSCODEVALUES_NOT_FOUND, RPCGRPCSTATUSCODEVALUES_OK, RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE, RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED, RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED, RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED, RPCGRPCSTATUSCODEVALUES_UNAVAILABLE, RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED, RPCGRPCSTATUSCODEVALUES_UNKNOWN, RpcGrpcStatusCodeValues, SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET, SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ, SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY, SEMATTRS_AWS_DYNAMODB_COUNT, SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, SEMATTRS_AWS_DYNAMODB_INDEX_NAME, SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS, SEMATTRS_AWS_DYNAMODB_LIMIT, SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_PROJECTION, SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT, SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD, SEMATTRS_AWS_DYNAMODB_SEGMENT, SEMATTRS_AWS_DYNAMODB_SELECT, SEMATTRS_AWS_DYNAMODB_TABLE_COUNT, SEMATTRS_AWS_DYNAMODB_TABLE_NAMES, SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS, SEMATTRS_AWS_LAMBDA_INVOKED_ARN, SEMATTRS_CODE_FILEPATH, SEMATTRS_CODE_FUNCTION, SEMATTRS_CODE_LINENO, SEMATTRS_CODE_NAMESPACE, SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL, SEMATTRS_DB_CASSANDRA_COORDINATOR_DC, SEMATTRS_DB_CASSANDRA_COORDINATOR_ID, SEMATTRS_DB_CASSANDRA_IDEMPOTENCE, SEMATTRS_DB_CASSANDRA_KEYSPACE, SEMATTRS_DB_CASSANDRA_PAGE_SIZE, SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, SEMATTRS_DB_CASSANDRA_TABLE, SEMATTRS_DB_CONNECTION_STRING, SEMATTRS_DB_HBASE_NAMESPACE, SEMATTRS_DB_JDBC_DRIVER_CLASSNAME, SEMATTRS_DB_MONGODB_COLLECTION, SEMATTRS_DB_MSSQL_INSTANCE_NAME, SEMATTRS_DB_NAME, SEMATTRS_DB_OPERATION, SEMATTRS_DB_REDIS_DATABASE_INDEX, SEMATTRS_DB_SQL_TABLE, SEMATTRS_DB_STATEMENT, SEMATTRS_DB_SYSTEM, SEMATTRS_DB_USER, SEMATTRS_ENDUSER_ID, SEMATTRS_ENDUSER_ROLE, SEMATTRS_ENDUSER_SCOPE, SEMATTRS_EXCEPTION_ESCAPED, SEMATTRS_EXCEPTION_MESSAGE, SEMATTRS_EXCEPTION_STACKTRACE, SEMATTRS_EXCEPTION_TYPE, SEMATTRS_FAAS_COLDSTART, SEMATTRS_FAAS_CRON, SEMATTRS_FAAS_DOCUMENT_COLLECTION, SEMATTRS_FAAS_DOCUMENT_NAME, SEMATTRS_FAAS_DOCUMENT_OPERATION, SEMATTRS_FAAS_DOCUMENT_TIME, SEMATTRS_FAAS_EXECUTION, SEMATTRS_FAAS_INVOKED_NAME, SEMATTRS_FAAS_INVOKED_PROVIDER, SEMATTRS_FAAS_INVOKED_REGION, SEMATTRS_FAAS_TIME, SEMATTRS_FAAS_TRIGGER, SEMATTRS_HTTP_CLIENT_IP, SEMATTRS_HTTP_FLAVOR, SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_ROUTE, SEMATTRS_HTTP_SCHEME, SEMATTRS_HTTP_SERVER_NAME, SEMATTRS_HTTP_STATUS_CODE, SEMATTRS_HTTP_TARGET, SEMATTRS_HTTP_URL, SEMATTRS_HTTP_USER_AGENT, SEMATTRS_MESSAGE_COMPRESSED_SIZE, SEMATTRS_MESSAGE_ID, SEMATTRS_MESSAGE_TYPE, SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE, SEMATTRS_MESSAGING_CONSUMER_ID, SEMATTRS_MESSAGING_CONVERSATION_ID, SEMATTRS_MESSAGING_DESTINATION, SEMATTRS_MESSAGING_DESTINATION_KIND, SEMATTRS_MESSAGING_KAFKA_CLIENT_ID, SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP, SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY, SEMATTRS_MESSAGING_KAFKA_PARTITION, SEMATTRS_MESSAGING_KAFKA_TOMBSTONE, SEMATTRS_MESSAGING_MESSAGE_ID, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES, SEMATTRS_MESSAGING_OPERATION, SEMATTRS_MESSAGING_PROTOCOL, SEMATTRS_MESSAGING_PROTOCOL_VERSION, SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY, SEMATTRS_MESSAGING_SYSTEM, SEMATTRS_MESSAGING_TEMP_DESTINATION, SEMATTRS_MESSAGING_URL, SEMATTRS_NET_HOST_CARRIER_ICC, SEMATTRS_NET_HOST_CARRIER_MCC, SEMATTRS_NET_HOST_CARRIER_MNC, SEMATTRS_NET_HOST_CARRIER_NAME, SEMATTRS_NET_HOST_CONNECTION_SUBTYPE, SEMATTRS_NET_HOST_CONNECTION_TYPE, SEMATTRS_NET_HOST_IP, SEMATTRS_NET_HOST_NAME, SEMATTRS_NET_HOST_PORT, SEMATTRS_NET_PEER_IP, SEMATTRS_NET_PEER_NAME, SEMATTRS_NET_PEER_PORT, SEMATTRS_NET_TRANSPORT, SEMATTRS_PEER_SERVICE, SEMATTRS_RPC_GRPC_STATUS_CODE, SEMATTRS_RPC_JSONRPC_ERROR_CODE, SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE, SEMATTRS_RPC_JSONRPC_REQUEST_ID, SEMATTRS_RPC_JSONRPC_VERSION, SEMATTRS_RPC_METHOD, SEMATTRS_RPC_SERVICE, SEMATTRS_RPC_SYSTEM, SEMATTRS_THREAD_ID, SEMATTRS_THREAD_NAME, SEMRESATTRS_AWS_ECS_CLUSTER_ARN, SEMRESATTRS_AWS_ECS_CONTAINER_ARN, SEMRESATTRS_AWS_ECS_LAUNCHTYPE, SEMRESATTRS_AWS_ECS_TASK_ARN, SEMRESATTRS_AWS_ECS_TASK_FAMILY, SEMRESATTRS_AWS_ECS_TASK_REVISION, SEMRESATTRS_AWS_EKS_CLUSTER_ARN, SEMRESATTRS_AWS_LOG_GROUP_ARNS, SEMRESATTRS_AWS_LOG_GROUP_NAMES, SEMRESATTRS_AWS_LOG_STREAM_ARNS, SEMRESATTRS_AWS_LOG_STREAM_NAMES, SEMRESATTRS_CLOUD_ACCOUNT_ID, SEMRESATTRS_CLOUD_AVAILABILITY_ZONE, SEMRESATTRS_CLOUD_PLATFORM, SEMRESATTRS_CLOUD_PROVIDER, SEMRESATTRS_CLOUD_REGION, SEMRESATTRS_CONTAINER_ID, SEMRESATTRS_CONTAINER_IMAGE_NAME, SEMRESATTRS_CONTAINER_IMAGE_TAG, SEMRESATTRS_CONTAINER_NAME, SEMRESATTRS_CONTAINER_RUNTIME, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT, SEMRESATTRS_DEVICE_ID, SEMRESATTRS_DEVICE_MODEL_IDENTIFIER, SEMRESATTRS_DEVICE_MODEL_NAME, SEMRESATTRS_FAAS_ID, SEMRESATTRS_FAAS_INSTANCE, SEMRESATTRS_FAAS_MAX_MEMORY, SEMRESATTRS_FAAS_NAME, SEMRESATTRS_FAAS_VERSION, SEMRESATTRS_HOST_ARCH, SEMRESATTRS_HOST_ID, SEMRESATTRS_HOST_IMAGE_ID, SEMRESATTRS_HOST_IMAGE_NAME, SEMRESATTRS_HOST_IMAGE_VERSION, SEMRESATTRS_HOST_NAME, SEMRESATTRS_HOST_TYPE, SEMRESATTRS_K8S_CLUSTER_NAME, SEMRESATTRS_K8S_CONTAINER_NAME, SEMRESATTRS_K8S_CRONJOB_NAME, SEMRESATTRS_K8S_CRONJOB_UID, SEMRESATTRS_K8S_DAEMONSET_NAME, SEMRESATTRS_K8S_DAEMONSET_UID, SEMRESATTRS_K8S_DEPLOYMENT_NAME, SEMRESATTRS_K8S_DEPLOYMENT_UID, SEMRESATTRS_K8S_JOB_NAME, SEMRESATTRS_K8S_JOB_UID, SEMRESATTRS_K8S_NAMESPACE_NAME, SEMRESATTRS_K8S_NODE_NAME, SEMRESATTRS_K8S_NODE_UID, SEMRESATTRS_K8S_POD_NAME, SEMRESATTRS_K8S_POD_UID, SEMRESATTRS_K8S_REPLICASET_NAME, SEMRESATTRS_K8S_REPLICASET_UID, SEMRESATTRS_K8S_STATEFULSET_NAME, SEMRESATTRS_K8S_STATEFULSET_UID, SEMRESATTRS_OS_DESCRIPTION, SEMRESATTRS_OS_NAME, SEMRESATTRS_OS_TYPE, SEMRESATTRS_OS_VERSION, SEMRESATTRS_PROCESS_COMMAND, SEMRESATTRS_PROCESS_COMMAND_ARGS, SEMRESATTRS_PROCESS_COMMAND_LINE, SEMRESATTRS_PROCESS_EXECUTABLE_NAME, SEMRESATTRS_PROCESS_EXECUTABLE_PATH, SEMRESATTRS_PROCESS_OWNER, SEMRESATTRS_PROCESS_PID, SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION, SEMRESATTRS_PROCESS_RUNTIME_NAME, SEMRESATTRS_PROCESS_RUNTIME_VERSION, SEMRESATTRS_SERVICE_INSTANCE_ID, SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_NAMESPACE, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_TELEMETRY_AUTO_VERSION, SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, SEMRESATTRS_TELEMETRY_SDK_NAME, SEMRESATTRS_TELEMETRY_SDK_VERSION, SEMRESATTRS_WEBENGINE_DESCRIPTION, SEMRESATTRS_WEBENGINE_NAME, SEMRESATTRS_WEBENGINE_VERSION, SemanticAttributes, SemanticResourceAttributes, TELEMETRYSDKLANGUAGEVALUES_CPP, TELEMETRYSDKLANGUAGEVALUES_DOTNET, TELEMETRYSDKLANGUAGEVALUES_ERLANG, TELEMETRYSDKLANGUAGEVALUES_GO, TELEMETRYSDKLANGUAGEVALUES_JAVA, TELEMETRYSDKLANGUAGEVALUES_NODEJS, TELEMETRYSDKLANGUAGEVALUES_PHP, TELEMETRYSDKLANGUAGEVALUES_PYTHON, TELEMETRYSDKLANGUAGEVALUES_RUBY, TELEMETRYSDKLANGUAGEVALUES_WEBJS, TelemetrySdkLanguageValues };
