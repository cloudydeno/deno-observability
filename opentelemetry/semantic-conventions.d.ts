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

declare const SemanticAttributes: {
	/**
	* The full invoked ARN as provided on the `Context` passed to the function (`Lambda-Runtime-Invoked-Function-Arn` header on the `/runtime/invocation/next` applicable).
	*
	* Note: This may be different from `faas.id` if an alias is involved.
	*/
	AWS_LAMBDA_INVOKED_ARN: string;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*/
	DB_SYSTEM: string;
	/**
	* The connection string used to connect to the database. It is recommended to remove embedded credentials.
	*/
	DB_CONNECTION_STRING: string;
	/**
	* Username for accessing the database.
	*/
	DB_USER: string;
	/**
	* The fully-qualified class name of the [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) driver used to connect.
	*/
	DB_JDBC_DRIVER_CLASSNAME: string;
	/**
	* If no [tech-specific attribute](#call-level-attributes-for-specific-technologies) is defined, this attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).
	*
	* Note: In some SQL databases, the database name to be used is called &#34;schema name&#34;.
	*/
	DB_NAME: string;
	/**
	* The database statement being executed.
	*
	* Note: The value may be sanitized to exclude sensitive information.
	*/
	DB_STATEMENT: string;
	/**
	* The name of the operation being executed, e.g. the [MongoDB command name](https://docs.mongodb.com/manual/reference/command/#database-operations) such as `findAndModify`, or the SQL keyword.
	*
	* Note: When setting this to an SQL keyword, it is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if the operation name is provided by the library being instrumented. If the SQL statement has an ambiguous operation, or performs more than one operation, this value may be omitted.
	*/
	DB_OPERATION: string;
	/**
	* The Microsoft SQL Server [instance name](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) connecting to. This name is used to determine the port of a named instance.
	*
	* Note: If setting a `db.mssql.instance_name`, `net.peer.port` is no longer required (but still recommended if non-standard).
	*/
	DB_MSSQL_INSTANCE_NAME: string;
	/**
	* The name of the keyspace being accessed. To be used instead of the generic `db.name` attribute.
	*/
	DB_CASSANDRA_KEYSPACE: string;
	/**
	* The fetch size used for paging, i.e. how many rows will be returned at once.
	*/
	DB_CASSANDRA_PAGE_SIZE: string;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*/
	DB_CASSANDRA_CONSISTENCY_LEVEL: string;
	/**
	* The name of the primary table that the operation is acting upon, including the schema name (if applicable).
	*
	* Note: This mirrors the db.sql.table attribute but references cassandra rather than sql. It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
	*/
	DB_CASSANDRA_TABLE: string;
	/**
	* Whether or not the query is idempotent.
	*/
	DB_CASSANDRA_IDEMPOTENCE: string;
	/**
	* The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
	*/
	DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT: string;
	/**
	* The ID of the coordinating node for a query.
	*/
	DB_CASSANDRA_COORDINATOR_ID: string;
	/**
	* The data center of the coordinating node for a query.
	*/
	DB_CASSANDRA_COORDINATOR_DC: string;
	/**
	* The [HBase namespace](https://hbase.apache.org/book.html#_namespace) being accessed. To be used instead of the generic `db.name` attribute.
	*/
	DB_HBASE_NAMESPACE: string;
	/**
	* The index of the database being accessed as used in the [`SELECT` command](https://redis.io/commands/select), provided as an integer. To be used instead of the generic `db.name` attribute.
	*/
	DB_REDIS_DATABASE_INDEX: string;
	/**
	* The collection being accessed within the database stated in `db.name`.
	*/
	DB_MONGODB_COLLECTION: string;
	/**
	* The name of the primary table that the operation is acting upon, including the schema name (if applicable).
	*
	* Note: It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
	*/
	DB_SQL_TABLE: string;
	/**
	* The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
	*/
	EXCEPTION_TYPE: string;
	/**
	* The exception message.
	*/
	EXCEPTION_MESSAGE: string;
	/**
	* A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
	*/
	EXCEPTION_STACKTRACE: string;
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
	EXCEPTION_ESCAPED: string;
	/**
	* Type of the trigger on which the function is executed.
	*/
	FAAS_TRIGGER: string;
	/**
	* The execution ID of the current function execution.
	*/
	FAAS_EXECUTION: string;
	/**
	* The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
	*/
	FAAS_DOCUMENT_COLLECTION: string;
	/**
	* Describes the type of the operation that was performed on the data.
	*/
	FAAS_DOCUMENT_OPERATION: string;
	/**
	* A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
	*/
	FAAS_DOCUMENT_TIME: string;
	/**
	* The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
	*/
	FAAS_DOCUMENT_NAME: string;
	/**
	* A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
	*/
	FAAS_TIME: string;
	/**
	* A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
	*/
	FAAS_CRON: string;
	/**
	* A boolean that is true if the serverless function is executed for the first time (aka cold-start).
	*/
	FAAS_COLDSTART: string;
	/**
	* The name of the invoked function.
	*
	* Note: SHOULD be equal to the `faas.name` resource attribute of the invoked function.
	*/
	FAAS_INVOKED_NAME: string;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*/
	FAAS_INVOKED_PROVIDER: string;
	/**
	* The cloud region of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.region` resource attribute of the invoked function.
	*/
	FAAS_INVOKED_REGION: string;
	/**
	* Transport protocol used. See note below.
	*/
	NET_TRANSPORT: string;
	/**
	* Remote address of the peer (dotted decimal for IPv4 or [RFC5952](https://tools.ietf.org/html/rfc5952) for IPv6).
	*/
	NET_PEER_IP: string;
	/**
	* Remote port number.
	*/
	NET_PEER_PORT: string;
	/**
	* Remote hostname or similar, see note below.
	*/
	NET_PEER_NAME: string;
	/**
	* Like `net.peer.ip` but for the host IP. Useful in case of a multi-IP host.
	*/
	NET_HOST_IP: string;
	/**
	* Like `net.peer.port` but for the host port.
	*/
	NET_HOST_PORT: string;
	/**
	* Local hostname or similar, see note below.
	*/
	NET_HOST_NAME: string;
	/**
	* The internet connection type currently being used by the host.
	*/
	NET_HOST_CONNECTION_TYPE: string;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*/
	NET_HOST_CONNECTION_SUBTYPE: string;
	/**
	* The name of the mobile carrier.
	*/
	NET_HOST_CARRIER_NAME: string;
	/**
	* The mobile carrier country code.
	*/
	NET_HOST_CARRIER_MCC: string;
	/**
	* The mobile carrier network code.
	*/
	NET_HOST_CARRIER_MNC: string;
	/**
	* The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
	*/
	NET_HOST_CARRIER_ICC: string;
	/**
	* The [`service.name`](../../resource/semantic_conventions/README.md#service) of the remote service. SHOULD be equal to the actual `service.name` resource attribute of the remote service if any.
	*/
	PEER_SERVICE: string;
	/**
	* Username or client_id extracted from the access token or [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) header in the inbound request from outside the system.
	*/
	ENDUSER_ID: string;
	/**
	* Actual/assumed role the client is making the request under extracted from token or application security context.
	*/
	ENDUSER_ROLE: string;
	/**
	* Scopes or granted authorities the client currently possesses extracted from token or application security context. The value would come from the scope associated with an [OAuth 2.0 Access Token](https://tools.ietf.org/html/rfc6749#section-3.3) or an attribute value in a [SAML 2.0 Assertion](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).
	*/
	ENDUSER_SCOPE: string;
	/**
	* Current &#34;managed&#34; thread ID (as opposed to OS thread ID).
	*/
	THREAD_ID: string;
	/**
	* Current thread name.
	*/
	THREAD_NAME: string;
	/**
	* The method or function name, or equivalent (usually rightmost part of the code unit&#39;s name).
	*/
	CODE_FUNCTION: string;
	/**
	* The &#34;namespace&#34; within which `code.function` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function` form a unique identifier for the code unit.
	*/
	CODE_NAMESPACE: string;
	/**
	* The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
	*/
	CODE_FILEPATH: string;
	/**
	* The line number in `code.filepath` best representing the operation. It SHOULD point within the code unit named in `code.function`.
	*/
	CODE_LINENO: string;
	/**
	* HTTP request method.
	*/
	HTTP_METHOD: string;
	/**
	* Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.
	*
	* Note: `http.url` MUST NOT contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case the attribute&#39;s value should be `https://www.example.com/`.
	*/
	HTTP_URL: string;
	/**
	* The full request target as passed in a HTTP request line or equivalent.
	*/
	HTTP_TARGET: string;
	/**
	* The value of the [HTTP host header](https://tools.ietf.org/html/rfc7230#section-5.4). An empty Host header should also be reported, see note.
	*
	* Note: When the header is present but empty the attribute SHOULD be set to the empty string. Note that this is a valid situation that is expected in certain cases, according the aforementioned [section of RFC 7230](https://tools.ietf.org/html/rfc7230#section-5.4). When the header is not set the attribute MUST NOT be set.
	*/
	HTTP_HOST: string;
	/**
	* The URI scheme identifying the used protocol.
	*/
	HTTP_SCHEME: string;
	/**
	* [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
	*/
	HTTP_STATUS_CODE: string;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*/
	HTTP_FLAVOR: string;
	/**
	* Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client.
	*/
	HTTP_USER_AGENT: string;
	/**
	* The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
	*/
	HTTP_REQUEST_CONTENT_LENGTH: string;
	/**
	* The size of the uncompressed request payload body after transport decoding. Not set if transport encoding not used.
	*/
	HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED: string;
	/**
	* The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
	*/
	HTTP_RESPONSE_CONTENT_LENGTH: string;
	/**
	* The size of the uncompressed response payload body after transport decoding. Not set if transport encoding not used.
	*/
	HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED: string;
	/**
	* The primary server name of the matched virtual host. This should be obtained via configuration. If no such configuration can be obtained, this attribute MUST NOT be set ( `net.host.name` should be used instead).
	*
	* Note: `http.url` is usually not readily available on the server side but would have to be assembled in a cumbersome and sometimes lossy process from other information (see e.g. open-telemetry/opentelemetry-python/pull/148). It is thus preferred to supply the raw data that is available.
	*/
	HTTP_SERVER_NAME: string;
	/**
	* The matched route (path template).
	*/
	HTTP_ROUTE: string;
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
	HTTP_CLIENT_IP: string;
	/**
	* The keys in the `RequestItems` object field.
	*/
	AWS_DYNAMODB_TABLE_NAMES: string;
	/**
	* The JSON-serialized value of each item in the `ConsumedCapacity` response field.
	*/
	AWS_DYNAMODB_CONSUMED_CAPACITY: string;
	/**
	* The JSON-serialized value of the `ItemCollectionMetrics` response field.
	*/
	AWS_DYNAMODB_ITEM_COLLECTION_METRICS: string;
	/**
	* The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
	*/
	AWS_DYNAMODB_PROVISIONED_READ_CAPACITY: string;
	/**
	* The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
	*/
	AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY: string;
	/**
	* The value of the `ConsistentRead` request parameter.
	*/
	AWS_DYNAMODB_CONSISTENT_READ: string;
	/**
	* The value of the `ProjectionExpression` request parameter.
	*/
	AWS_DYNAMODB_PROJECTION: string;
	/**
	* The value of the `Limit` request parameter.
	*/
	AWS_DYNAMODB_LIMIT: string;
	/**
	* The value of the `AttributesToGet` request parameter.
	*/
	AWS_DYNAMODB_ATTRIBUTES_TO_GET: string;
	/**
	* The value of the `IndexName` request parameter.
	*/
	AWS_DYNAMODB_INDEX_NAME: string;
	/**
	* The value of the `Select` request parameter.
	*/
	AWS_DYNAMODB_SELECT: string;
	/**
	* The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field.
	*/
	AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES: string;
	/**
	* The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
	*/
	AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES: string;
	/**
	* The value of the `ExclusiveStartTableName` request parameter.
	*/
	AWS_DYNAMODB_EXCLUSIVE_START_TABLE: string;
	/**
	* The the number of items in the `TableNames` response parameter.
	*/
	AWS_DYNAMODB_TABLE_COUNT: string;
	/**
	* The value of the `ScanIndexForward` request parameter.
	*/
	AWS_DYNAMODB_SCAN_FORWARD: string;
	/**
	* The value of the `Segment` request parameter.
	*/
	AWS_DYNAMODB_SEGMENT: string;
	/**
	* The value of the `TotalSegments` request parameter.
	*/
	AWS_DYNAMODB_TOTAL_SEGMENTS: string;
	/**
	* The value of the `Count` response parameter.
	*/
	AWS_DYNAMODB_COUNT: string;
	/**
	* The value of the `ScannedCount` response parameter.
	*/
	AWS_DYNAMODB_SCANNED_COUNT: string;
	/**
	* The JSON-serialized value of each item in the `AttributeDefinitions` request field.
	*/
	AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS: string;
	/**
	* The JSON-serialized value of each item in the the `GlobalSecondaryIndexUpdates` request field.
	*/
	AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES: string;
	/**
	* A string identifying the messaging system.
	*/
	MESSAGING_SYSTEM: string;
	/**
	* The message destination name. This might be equal to the span name but is required nevertheless.
	*/
	MESSAGING_DESTINATION: string;
	/**
	* The kind of message destination.
	*/
	MESSAGING_DESTINATION_KIND: string;
	/**
	* A boolean that is true if the message destination is temporary.
	*/
	MESSAGING_TEMP_DESTINATION: string;
	/**
	* The name of the transport protocol.
	*/
	MESSAGING_PROTOCOL: string;
	/**
	* The version of the transport protocol.
	*/
	MESSAGING_PROTOCOL_VERSION: string;
	/**
	* Connection string.
	*/
	MESSAGING_URL: string;
	/**
	* A value used by the messaging system as an identifier for the message, represented as a string.
	*/
	MESSAGING_MESSAGE_ID: string;
	/**
	* The [conversation ID](#conversations) identifying the conversation to which the message belongs, represented as a string. Sometimes called &#34;Correlation ID&#34;.
	*/
	MESSAGING_CONVERSATION_ID: string;
	/**
	* The (uncompressed) size of the message payload in bytes. Also use this attribute if it is unknown whether the compressed or uncompressed payload size is reported.
	*/
	MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES: string;
	/**
	* The compressed size of the message payload in bytes.
	*/
	MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES: string;
	/**
	* A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
	*/
	MESSAGING_OPERATION: string;
	/**
	* The identifier for the consumer receiving a message. For Kafka, set it to `{messaging.kafka.consumer_group} - {messaging.kafka.client_id}`, if both are present, or only `messaging.kafka.consumer_group`. For brokers, such as RabbitMQ and Artemis, set it to the `client_id` of the client consuming the message.
	*/
	MESSAGING_CONSUMER_ID: string;
	/**
	* RabbitMQ message routing key.
	*/
	MESSAGING_RABBITMQ_ROUTING_KEY: string;
	/**
	* Message keys in Kafka are used for grouping alike messages to ensure they&#39;re processed on the same partition. They differ from `messaging.message_id` in that they&#39;re not unique. If the key is `null`, the attribute MUST NOT be set.
	*
	* Note: If the key type is not string, it&#39;s string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don&#39;t include its value.
	*/
	MESSAGING_KAFKA_MESSAGE_KEY: string;
	/**
	* Name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.
	*/
	MESSAGING_KAFKA_CONSUMER_GROUP: string;
	/**
	* Client Id for the Consumer or Producer that is handling the message.
	*/
	MESSAGING_KAFKA_CLIENT_ID: string;
	/**
	* Partition the message is sent to.
	*/
	MESSAGING_KAFKA_PARTITION: string;
	/**
	* A boolean that is true if the message is a tombstone.
	*/
	MESSAGING_KAFKA_TOMBSTONE: string;
	/**
	* A string identifying the remoting system.
	*/
	RPC_SYSTEM: string;
	/**
	* The full (logical) name of the service being called, including its package name, if applicable.
	*
	* Note: This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
	*/
	RPC_SERVICE: string;
	/**
	* The name of the (logical) method being called, must be equal to the $method part in the span name.
	*
	* Note: This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
	*/
	RPC_METHOD: string;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*/
	RPC_GRPC_STATUS_CODE: string;
	/**
	* Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 does not specify this, the value can be omitted.
	*/
	RPC_JSONRPC_VERSION: string;
	/**
	* `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
	*/
	RPC_JSONRPC_REQUEST_ID: string;
	/**
	* `error.code` property of response if it is an error response.
	*/
	RPC_JSONRPC_ERROR_CODE: string;
	/**
	* `error.message` property of response if it is an error response.
	*/
	RPC_JSONRPC_ERROR_MESSAGE: string;
	/**
	* Whether this is a received or sent message.
	*/
	MESSAGE_TYPE: string;
	/**
	* MUST be calculated as two different counters starting from `1` one for sent messages and one for received message.
	*
	* Note: This way we guarantee that the values will be consistent between different implementations.
	*/
	MESSAGE_ID: string;
	/**
	* Compressed size of the message in bytes.
	*/
	MESSAGE_COMPRESSED_SIZE: string;
	/**
	* Uncompressed size of the message in bytes.
	*/
	MESSAGE_UNCOMPRESSED_SIZE: string;
};
declare const DbSystemValues: {
	/** Some other SQL database. Fallback only. See notes. */
	readonly OTHER_SQL: "other_sql";
	/** Microsoft SQL Server. */
	readonly MSSQL: "mssql";
	/** MySQL. */
	readonly MYSQL: "mysql";
	/** Oracle Database. */
	readonly ORACLE: "oracle";
	/** IBM Db2. */
	readonly DB2: "db2";
	/** PostgreSQL. */
	readonly POSTGRESQL: "postgresql";
	/** Amazon Redshift. */
	readonly REDSHIFT: "redshift";
	/** Apache Hive. */
	readonly HIVE: "hive";
	/** Cloudscape. */
	readonly CLOUDSCAPE: "cloudscape";
	/** HyperSQL DataBase. */
	readonly HSQLDB: "hsqldb";
	/** Progress Database. */
	readonly PROGRESS: "progress";
	/** SAP MaxDB. */
	readonly MAXDB: "maxdb";
	/** SAP HANA. */
	readonly HANADB: "hanadb";
	/** Ingres. */
	readonly INGRES: "ingres";
	/** FirstSQL. */
	readonly FIRSTSQL: "firstsql";
	/** EnterpriseDB. */
	readonly EDB: "edb";
	/** InterSystems Caché. */
	readonly CACHE: "cache";
	/** Adabas (Adaptable Database System). */
	readonly ADABAS: "adabas";
	/** Firebird. */
	readonly FIREBIRD: "firebird";
	/** Apache Derby. */
	readonly DERBY: "derby";
	/** FileMaker. */
	readonly FILEMAKER: "filemaker";
	/** Informix. */
	readonly INFORMIX: "informix";
	/** InstantDB. */
	readonly INSTANTDB: "instantdb";
	/** InterBase. */
	readonly INTERBASE: "interbase";
	/** MariaDB. */
	readonly MARIADB: "mariadb";
	/** Netezza. */
	readonly NETEZZA: "netezza";
	/** Pervasive PSQL. */
	readonly PERVASIVE: "pervasive";
	/** PointBase. */
	readonly POINTBASE: "pointbase";
	/** SQLite. */
	readonly SQLITE: "sqlite";
	/** Sybase. */
	readonly SYBASE: "sybase";
	/** Teradata. */
	readonly TERADATA: "teradata";
	/** Vertica. */
	readonly VERTICA: "vertica";
	/** H2. */
	readonly H2: "h2";
	/** ColdFusion IMQ. */
	readonly COLDFUSION: "coldfusion";
	/** Apache Cassandra. */
	readonly CASSANDRA: "cassandra";
	/** Apache HBase. */
	readonly HBASE: "hbase";
	/** MongoDB. */
	readonly MONGODB: "mongodb";
	/** Redis. */
	readonly REDIS: "redis";
	/** Couchbase. */
	readonly COUCHBASE: "couchbase";
	/** CouchDB. */
	readonly COUCHDB: "couchdb";
	/** Microsoft Azure Cosmos DB. */
	readonly COSMOSDB: "cosmosdb";
	/** Amazon DynamoDB. */
	readonly DYNAMODB: "dynamodb";
	/** Neo4j. */
	readonly NEO4J: "neo4j";
	/** Apache Geode. */
	readonly GEODE: "geode";
	/** Elasticsearch. */
	readonly ELASTICSEARCH: "elasticsearch";
	/** Memcached. */
	readonly MEMCACHED: "memcached";
	/** CockroachDB. */
	readonly COCKROACHDB: "cockroachdb";
};
declare type DbSystemValues = typeof DbSystemValues[keyof typeof DbSystemValues];
declare const DbCassandraConsistencyLevelValues: {
	/** all. */
	readonly ALL: "all";
	/** each_quorum. */
	readonly EACH_QUORUM: "each_quorum";
	/** quorum. */
	readonly QUORUM: "quorum";
	/** local_quorum. */
	readonly LOCAL_QUORUM: "local_quorum";
	/** one. */
	readonly ONE: "one";
	/** two. */
	readonly TWO: "two";
	/** three. */
	readonly THREE: "three";
	/** local_one. */
	readonly LOCAL_ONE: "local_one";
	/** any. */
	readonly ANY: "any";
	/** serial. */
	readonly SERIAL: "serial";
	/** local_serial. */
	readonly LOCAL_SERIAL: "local_serial";
};
declare type DbCassandraConsistencyLevelValues = typeof DbCassandraConsistencyLevelValues[keyof typeof DbCassandraConsistencyLevelValues];
declare const FaasTriggerValues: {
	/** A response to some data source operation such as a database or filesystem read/write. */
	readonly DATASOURCE: "datasource";
	/** To provide an answer to an inbound HTTP request. */
	readonly HTTP: "http";
	/** A function is set to be executed when messages are sent to a messaging system. */
	readonly PUBSUB: "pubsub";
	/** A function is scheduled to be executed regularly. */
	readonly TIMER: "timer";
	/** If none of the others apply. */
	readonly OTHER: "other";
};
declare type FaasTriggerValues = typeof FaasTriggerValues[keyof typeof FaasTriggerValues];
declare const FaasDocumentOperationValues: {
	/** When a new object is created. */
	readonly INSERT: "insert";
	/** When an object is modified. */
	readonly EDIT: "edit";
	/** When an object is deleted. */
	readonly DELETE: "delete";
};
declare type FaasDocumentOperationValues = typeof FaasDocumentOperationValues[keyof typeof FaasDocumentOperationValues];
declare const FaasInvokedProviderValues: {
	/** Alibaba Cloud. */
	readonly ALIBABA_CLOUD: "alibaba_cloud";
	/** Amazon Web Services. */
	readonly AWS: "aws";
	/** Microsoft Azure. */
	readonly AZURE: "azure";
	/** Google Cloud Platform. */
	readonly GCP: "gcp";
};
declare type FaasInvokedProviderValues = typeof FaasInvokedProviderValues[keyof typeof FaasInvokedProviderValues];
declare const NetTransportValues: {
	/** ip_tcp. */
	readonly IP_TCP: "ip_tcp";
	/** ip_udp. */
	readonly IP_UDP: "ip_udp";
	/** Another IP-based protocol. */
	readonly IP: "ip";
	/** Unix Domain socket. See below. */
	readonly UNIX: "unix";
	/** Named or anonymous pipe. See note below. */
	readonly PIPE: "pipe";
	/** In-process communication. */
	readonly INPROC: "inproc";
	/** Something else (non IP-based). */
	readonly OTHER: "other";
};
declare type NetTransportValues = typeof NetTransportValues[keyof typeof NetTransportValues];
declare const NetHostConnectionTypeValues: {
	/** wifi. */
	readonly WIFI: "wifi";
	/** wired. */
	readonly WIRED: "wired";
	/** cell. */
	readonly CELL: "cell";
	/** unavailable. */
	readonly UNAVAILABLE: "unavailable";
	/** unknown. */
	readonly UNKNOWN: "unknown";
};
declare type NetHostConnectionTypeValues = typeof NetHostConnectionTypeValues[keyof typeof NetHostConnectionTypeValues];
declare const NetHostConnectionSubtypeValues: {
	/** GPRS. */
	readonly GPRS: "gprs";
	/** EDGE. */
	readonly EDGE: "edge";
	/** UMTS. */
	readonly UMTS: "umts";
	/** CDMA. */
	readonly CDMA: "cdma";
	/** EVDO Rel. 0. */
	readonly EVDO_0: "evdo_0";
	/** EVDO Rev. A. */
	readonly EVDO_A: "evdo_a";
	/** CDMA2000 1XRTT. */
	readonly CDMA2000_1XRTT: "cdma2000_1xrtt";
	/** HSDPA. */
	readonly HSDPA: "hsdpa";
	/** HSUPA. */
	readonly HSUPA: "hsupa";
	/** HSPA. */
	readonly HSPA: "hspa";
	/** IDEN. */
	readonly IDEN: "iden";
	/** EVDO Rev. B. */
	readonly EVDO_B: "evdo_b";
	/** LTE. */
	readonly LTE: "lte";
	/** EHRPD. */
	readonly EHRPD: "ehrpd";
	/** HSPAP. */
	readonly HSPAP: "hspap";
	/** GSM. */
	readonly GSM: "gsm";
	/** TD-SCDMA. */
	readonly TD_SCDMA: "td_scdma";
	/** IWLAN. */
	readonly IWLAN: "iwlan";
	/** 5G NR (New Radio). */
	readonly NR: "nr";
	/** 5G NRNSA (New Radio Non-Standalone). */
	readonly NRNSA: "nrnsa";
	/** LTE CA. */
	readonly LTE_CA: "lte_ca";
};
declare type NetHostConnectionSubtypeValues = typeof NetHostConnectionSubtypeValues[keyof typeof NetHostConnectionSubtypeValues];
declare const HttpFlavorValues: {
	/** HTTP 1.0. */
	readonly HTTP_1_0: "1.0";
	/** HTTP 1.1. */
	readonly HTTP_1_1: "1.1";
	/** HTTP 2. */
	readonly HTTP_2_0: "2.0";
	/** SPDY protocol. */
	readonly SPDY: "SPDY";
	/** QUIC protocol. */
	readonly QUIC: "QUIC";
};
declare type HttpFlavorValues = typeof HttpFlavorValues[keyof typeof HttpFlavorValues];
declare const MessagingDestinationKindValues: {
	/** A message sent to a queue. */
	readonly QUEUE: "queue";
	/** A message sent to a topic. */
	readonly TOPIC: "topic";
};
declare type MessagingDestinationKindValues = typeof MessagingDestinationKindValues[keyof typeof MessagingDestinationKindValues];
declare const MessagingOperationValues: {
	/** receive. */
	readonly RECEIVE: "receive";
	/** process. */
	readonly PROCESS: "process";
};
declare type MessagingOperationValues = typeof MessagingOperationValues[keyof typeof MessagingOperationValues];
declare const RpcGrpcStatusCodeValues: {
	/** OK. */
	readonly OK: 0;
	/** CANCELLED. */
	readonly CANCELLED: 1;
	/** UNKNOWN. */
	readonly UNKNOWN: 2;
	/** INVALID_ARGUMENT. */
	readonly INVALID_ARGUMENT: 3;
	/** DEADLINE_EXCEEDED. */
	readonly DEADLINE_EXCEEDED: 4;
	/** NOT_FOUND. */
	readonly NOT_FOUND: 5;
	/** ALREADY_EXISTS. */
	readonly ALREADY_EXISTS: 6;
	/** PERMISSION_DENIED. */
	readonly PERMISSION_DENIED: 7;
	/** RESOURCE_EXHAUSTED. */
	readonly RESOURCE_EXHAUSTED: 8;
	/** FAILED_PRECONDITION. */
	readonly FAILED_PRECONDITION: 9;
	/** ABORTED. */
	readonly ABORTED: 10;
	/** OUT_OF_RANGE. */
	readonly OUT_OF_RANGE: 11;
	/** UNIMPLEMENTED. */
	readonly UNIMPLEMENTED: 12;
	/** INTERNAL. */
	readonly INTERNAL: 13;
	/** UNAVAILABLE. */
	readonly UNAVAILABLE: 14;
	/** DATA_LOSS. */
	readonly DATA_LOSS: 15;
	/** UNAUTHENTICATED. */
	readonly UNAUTHENTICATED: 16;
};
declare type RpcGrpcStatusCodeValues = typeof RpcGrpcStatusCodeValues[keyof typeof RpcGrpcStatusCodeValues];
declare const MessageTypeValues: {
	/** sent. */
	readonly SENT: "SENT";
	/** received. */
	readonly RECEIVED: "RECEIVED";
};
declare type MessageTypeValues = typeof MessageTypeValues[keyof typeof MessageTypeValues];

declare const SemanticResourceAttributes: {
	/**
	* Name of the cloud provider.
	*/
	CLOUD_PROVIDER: string;
	/**
	* The cloud account ID the resource is assigned to.
	*/
	CLOUD_ACCOUNT_ID: string;
	/**
	* The geographical region the resource is running. Refer to your provider&#39;s docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/geographies/), or [Google Cloud regions](https://cloud.google.com/about/locations).
	*/
	CLOUD_REGION: string;
	/**
	* Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
	*
	* Note: Availability zones are called &#34;zones&#34; on Alibaba Cloud and Google Cloud.
	*/
	CLOUD_AVAILABILITY_ZONE: string;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*/
	CLOUD_PLATFORM: string;
	/**
	* The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
	*/
	AWS_ECS_CONTAINER_ARN: string;
	/**
	* The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
	*/
	AWS_ECS_CLUSTER_ARN: string;
	/**
	* The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
	*/
	AWS_ECS_LAUNCHTYPE: string;
	/**
	* The ARN of an [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html).
	*/
	AWS_ECS_TASK_ARN: string;
	/**
	* The task definition family this task definition is a member of.
	*/
	AWS_ECS_TASK_FAMILY: string;
	/**
	* The revision for this task definition.
	*/
	AWS_ECS_TASK_REVISION: string;
	/**
	* The ARN of an EKS cluster.
	*/
	AWS_EKS_CLUSTER_ARN: string;
	/**
	* The name(s) of the AWS log group(s) an application is writing to.
	*
	* Note: Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
	*/
	AWS_LOG_GROUP_NAMES: string;
	/**
	* The Amazon Resource Name(s) (ARN) of the AWS log group(s).
	*
	* Note: See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
	*/
	AWS_LOG_GROUP_ARNS: string;
	/**
	* The name(s) of the AWS log stream(s) an application is writing to.
	*/
	AWS_LOG_STREAM_NAMES: string;
	/**
	* The ARN(s) of the AWS log stream(s).
	*
	* Note: See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
	*/
	AWS_LOG_STREAM_ARNS: string;
	/**
	* Container name.
	*/
	CONTAINER_NAME: string;
	/**
	* Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/reference/run/#container-identification). The UUID might be abbreviated.
	*/
	CONTAINER_ID: string;
	/**
	* The container runtime managing this container.
	*/
	CONTAINER_RUNTIME: string;
	/**
	* Name of the image the container was built on.
	*/
	CONTAINER_IMAGE_NAME: string;
	/**
	* Container image tag.
	*/
	CONTAINER_IMAGE_TAG: string;
	/**
	* Name of the [deployment environment](https://en.wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
	*/
	DEPLOYMENT_ENVIRONMENT: string;
	/**
	* A unique identifier representing the device.
	*
	* Note: The device identifier MUST only be defined using the values outlined below. This value is not an advertising identifier and MUST NOT be used as such. On iOS (Swift or Objective-C), this value MUST be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value MUST be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
	*/
	DEVICE_ID: string;
	/**
	* The model identifier for the device.
	*
	* Note: It&#39;s recommended this value represents a machine readable version of the model identifier rather than the market or consumer-friendly name of the device.
	*/
	DEVICE_MODEL_IDENTIFIER: string;
	/**
	* The marketing name for the device model.
	*
	* Note: It&#39;s recommended this value represents a human readable version of the device model rather than a machine readable alternative.
	*/
	DEVICE_MODEL_NAME: string;
	/**
	* The name of the single function that this runtime instance executes.
	*
	* Note: This is the name of the function as configured/deployed on the FaaS platform and is usually different from the name of the callback function (which may be stored in the [`code.namespace`/`code.function`](../../trace/semantic_conventions/span-general.md#source-code-attributes) span attributes).
	*/
	FAAS_NAME: string;
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
	FAAS_ID: string;
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
	FAAS_VERSION: string;
	/**
	* The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
	*
	* Note: * **AWS Lambda:** Use the (full) log stream name.
	*/
	FAAS_INSTANCE: string;
	/**
	* The amount of memory available to the serverless function in MiB.
	*
	* Note: It&#39;s recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information.
	*/
	FAAS_MAX_MEMORY: string;
	/**
	* Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider.
	*/
	HOST_ID: string;
	/**
	* Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
	*/
	HOST_NAME: string;
	/**
	* Type of host. For Cloud, this must be the machine type.
	*/
	HOST_TYPE: string;
	/**
	* The CPU architecture the host system is running on.
	*/
	HOST_ARCH: string;
	/**
	* Name of the VM image or OS install the host was instantiated from.
	*/
	HOST_IMAGE_NAME: string;
	/**
	* VM image ID. For Cloud, this value is from the provider.
	*/
	HOST_IMAGE_ID: string;
	/**
	* The version string of the VM image as defined in [Version SpanAttributes](README.md#version-attributes).
	*/
	HOST_IMAGE_VERSION: string;
	/**
	* The name of the cluster.
	*/
	K8S_CLUSTER_NAME: string;
	/**
	* The name of the Node.
	*/
	K8S_NODE_NAME: string;
	/**
	* The UID of the Node.
	*/
	K8S_NODE_UID: string;
	/**
	* The name of the namespace that the pod is running in.
	*/
	K8S_NAMESPACE_NAME: string;
	/**
	* The UID of the Pod.
	*/
	K8S_POD_UID: string;
	/**
	* The name of the Pod.
	*/
	K8S_POD_NAME: string;
	/**
	* The name of the Container in a Pod template.
	*/
	K8S_CONTAINER_NAME: string;
	/**
	* The UID of the ReplicaSet.
	*/
	K8S_REPLICASET_UID: string;
	/**
	* The name of the ReplicaSet.
	*/
	K8S_REPLICASET_NAME: string;
	/**
	* The UID of the Deployment.
	*/
	K8S_DEPLOYMENT_UID: string;
	/**
	* The name of the Deployment.
	*/
	K8S_DEPLOYMENT_NAME: string;
	/**
	* The UID of the StatefulSet.
	*/
	K8S_STATEFULSET_UID: string;
	/**
	* The name of the StatefulSet.
	*/
	K8S_STATEFULSET_NAME: string;
	/**
	* The UID of the DaemonSet.
	*/
	K8S_DAEMONSET_UID: string;
	/**
	* The name of the DaemonSet.
	*/
	K8S_DAEMONSET_NAME: string;
	/**
	* The UID of the Job.
	*/
	K8S_JOB_UID: string;
	/**
	* The name of the Job.
	*/
	K8S_JOB_NAME: string;
	/**
	* The UID of the CronJob.
	*/
	K8S_CRONJOB_UID: string;
	/**
	* The name of the CronJob.
	*/
	K8S_CRONJOB_NAME: string;
	/**
	* The operating system type.
	*/
	OS_TYPE: string;
	/**
	* Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
	*/
	OS_DESCRIPTION: string;
	/**
	* Human readable operating system name.
	*/
	OS_NAME: string;
	/**
	* The version string of the operating system as defined in [Version SpanAttributes](../../resource/semantic_conventions/README.md#version-attributes).
	*/
	OS_VERSION: string;
	/**
	* Process identifier (PID).
	*/
	PROCESS_PID: string;
	/**
	* The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
	*/
	PROCESS_EXECUTABLE_NAME: string;
	/**
	* The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
	*/
	PROCESS_EXECUTABLE_PATH: string;
	/**
	* The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
	*/
	PROCESS_COMMAND: string;
	/**
	* The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
	*/
	PROCESS_COMMAND_LINE: string;
	/**
	* All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
	*/
	PROCESS_COMMAND_ARGS: string;
	/**
	* The username of the user that owns the process.
	*/
	PROCESS_OWNER: string;
	/**
	* The name of the runtime of this process. For compiled native binaries, this SHOULD be the name of the compiler.
	*/
	PROCESS_RUNTIME_NAME: string;
	/**
	* The version of the runtime of this process, as returned by the runtime without modification.
	*/
	PROCESS_RUNTIME_VERSION: string;
	/**
	* An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
	*/
	PROCESS_RUNTIME_DESCRIPTION: string;
	/**
	* Logical name of the service.
	*
	* Note: MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs MUST fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md#process), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value MUST be set to `unknown_service`.
	*/
	SERVICE_NAME: string;
	/**
	* A namespace for `service.name`.
	*
	* Note: A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
	*/
	SERVICE_NAMESPACE: string;
	/**
	* The string ID of the service instance.
	*
	* Note: MUST be unique for each instance of the same `service.namespace,service.name` pair (in other words `service.namespace,service.name,service.instance.id` triplet MUST be globally unique). The ID helps to distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled service). It is preferable for the ID to be persistent and stay the same for the lifetime of the service instance, however it is acceptable that the ID is ephemeral and changes during important lifetime events for the service (e.g. service restarts). If the service has no inherent unique ID that can be used as the value of this attribute it is recommended to generate a random Version 1 or Version 4 RFC 4122 UUID (services aiming for reproducible UUIDs may also use Version 5, see RFC 4122 for more recommendations).
	*/
	SERVICE_INSTANCE_ID: string;
	/**
	* The version string of the service API or implementation.
	*/
	SERVICE_VERSION: string;
	/**
	* The name of the telemetry SDK as defined above.
	*/
	TELEMETRY_SDK_NAME: string;
	/**
	* The language of the telemetry SDK.
	*/
	TELEMETRY_SDK_LANGUAGE: string;
	/**
	* The version string of the telemetry SDK.
	*/
	TELEMETRY_SDK_VERSION: string;
	/**
	* The version string of the auto instrumentation agent, if used.
	*/
	TELEMETRY_AUTO_VERSION: string;
	/**
	* The name of the web engine.
	*/
	WEBENGINE_NAME: string;
	/**
	* The version of the web engine.
	*/
	WEBENGINE_VERSION: string;
	/**
	* Additional description of the web engine (e.g. detailed version and edition information).
	*/
	WEBENGINE_DESCRIPTION: string;
};
declare const CloudProviderValues: {
	/** Alibaba Cloud. */
	readonly ALIBABA_CLOUD: "alibaba_cloud";
	/** Amazon Web Services. */
	readonly AWS: "aws";
	/** Microsoft Azure. */
	readonly AZURE: "azure";
	/** Google Cloud Platform. */
	readonly GCP: "gcp";
};
declare type CloudProviderValues = typeof CloudProviderValues[keyof typeof CloudProviderValues];
declare const CloudPlatformValues: {
	/** Alibaba Cloud Elastic Compute Service. */
	readonly ALIBABA_CLOUD_ECS: "alibaba_cloud_ecs";
	/** Alibaba Cloud Function Compute. */
	readonly ALIBABA_CLOUD_FC: "alibaba_cloud_fc";
	/** AWS Elastic Compute Cloud. */
	readonly AWS_EC2: "aws_ec2";
	/** AWS Elastic Container Service. */
	readonly AWS_ECS: "aws_ecs";
	/** AWS Elastic Kubernetes Service. */
	readonly AWS_EKS: "aws_eks";
	/** AWS Lambda. */
	readonly AWS_LAMBDA: "aws_lambda";
	/** AWS Elastic Beanstalk. */
	readonly AWS_ELASTIC_BEANSTALK: "aws_elastic_beanstalk";
	/** Azure Virtual Machines. */
	readonly AZURE_VM: "azure_vm";
	/** Azure Container Instances. */
	readonly AZURE_CONTAINER_INSTANCES: "azure_container_instances";
	/** Azure Kubernetes Service. */
	readonly AZURE_AKS: "azure_aks";
	/** Azure Functions. */
	readonly AZURE_FUNCTIONS: "azure_functions";
	/** Azure App Service. */
	readonly AZURE_APP_SERVICE: "azure_app_service";
	/** Google Cloud Compute Engine (GCE). */
	readonly GCP_COMPUTE_ENGINE: "gcp_compute_engine";
	/** Google Cloud Run. */
	readonly GCP_CLOUD_RUN: "gcp_cloud_run";
	/** Google Cloud Kubernetes Engine (GKE). */
	readonly GCP_KUBERNETES_ENGINE: "gcp_kubernetes_engine";
	/** Google Cloud Functions (GCF). */
	readonly GCP_CLOUD_FUNCTIONS: "gcp_cloud_functions";
	/** Google Cloud App Engine (GAE). */
	readonly GCP_APP_ENGINE: "gcp_app_engine";
};
declare type CloudPlatformValues = typeof CloudPlatformValues[keyof typeof CloudPlatformValues];
declare const AwsEcsLaunchtypeValues: {
	/** ec2. */
	readonly EC2: "ec2";
	/** fargate. */
	readonly FARGATE: "fargate";
};
declare type AwsEcsLaunchtypeValues = typeof AwsEcsLaunchtypeValues[keyof typeof AwsEcsLaunchtypeValues];
declare const HostArchValues: {
	/** AMD64. */
	readonly AMD64: "amd64";
	/** ARM32. */
	readonly ARM32: "arm32";
	/** ARM64. */
	readonly ARM64: "arm64";
	/** Itanium. */
	readonly IA64: "ia64";
	/** 32-bit PowerPC. */
	readonly PPC32: "ppc32";
	/** 64-bit PowerPC. */
	readonly PPC64: "ppc64";
	/** 32-bit x86. */
	readonly X86: "x86";
};
declare type HostArchValues = typeof HostArchValues[keyof typeof HostArchValues];
declare const OsTypeValues: {
	/** Microsoft Windows. */
	readonly WINDOWS: "windows";
	/** Linux. */
	readonly LINUX: "linux";
	/** Apple Darwin. */
	readonly DARWIN: "darwin";
	/** FreeBSD. */
	readonly FREEBSD: "freebsd";
	/** NetBSD. */
	readonly NETBSD: "netbsd";
	/** OpenBSD. */
	readonly OPENBSD: "openbsd";
	/** DragonFly BSD. */
	readonly DRAGONFLYBSD: "dragonflybsd";
	/** HP-UX (Hewlett Packard Unix). */
	readonly HPUX: "hpux";
	/** AIX (Advanced Interactive eXecutive). */
	readonly AIX: "aix";
	/** Oracle Solaris. */
	readonly SOLARIS: "solaris";
	/** IBM z/OS. */
	readonly Z_OS: "z_os";
};
declare type OsTypeValues = typeof OsTypeValues[keyof typeof OsTypeValues];
declare const TelemetrySdkLanguageValues: {
	/** cpp. */
	readonly CPP: "cpp";
	/** dotnet. */
	readonly DOTNET: "dotnet";
	/** erlang. */
	readonly ERLANG: "erlang";
	/** go. */
	readonly GO: "go";
	/** java. */
	readonly JAVA: "java";
	/** nodejs. */
	readonly NODEJS: "nodejs";
	/** php. */
	readonly PHP: "php";
	/** python. */
	readonly PYTHON: "python";
	/** ruby. */
	readonly RUBY: "ruby";
	/** webjs. */
	readonly WEBJS: "webjs";
};
declare type TelemetrySdkLanguageValues = typeof TelemetrySdkLanguageValues[keyof typeof TelemetrySdkLanguageValues];

export { AwsEcsLaunchtypeValues, CloudPlatformValues, CloudProviderValues, DbCassandraConsistencyLevelValues, DbSystemValues, FaasDocumentOperationValues, FaasInvokedProviderValues, FaasTriggerValues, HostArchValues, HttpFlavorValues, MessageTypeValues, MessagingDestinationKindValues, MessagingOperationValues, NetHostConnectionSubtypeValues, NetHostConnectionTypeValues, NetTransportValues, OsTypeValues, RpcGrpcStatusCodeValues, SemanticAttributes, SemanticResourceAttributes, TelemetrySdkLanguageValues };
