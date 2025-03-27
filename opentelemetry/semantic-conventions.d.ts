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
 * @deprecated Use ATTR_AWS_LAMBDA_INVOKED_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use ATTR_DB_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_SYSTEM = "db.system";
/**
 * The connection string used to connect to the database. It is recommended to remove embedded credentials.
 *
 * @deprecated Use ATTR_DB_CONNECTION_STRING in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CONNECTION_STRING = "db.connection_string";
/**
 * Username for accessing the database.
 *
 * @deprecated Use ATTR_DB_USER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_USER = "db.user";
/**
 * The fully-qualified class name of the [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) driver used to connect.
 *
 * @deprecated Use ATTR_DB_JDBC_DRIVER_CLASSNAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
/**
 * If no [tech-specific attribute](#call-level-attributes-for-specific-technologies) is defined, this attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).
 *
 * Note: In some SQL databases, the database name to be used is called &#34;schema name&#34;.
 *
 * @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_NAME = "db.name";
/**
 * The database statement being executed.
 *
 * Note: The value may be sanitized to exclude sensitive information.
 *
 * @deprecated Use ATTR_DB_STATEMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_STATEMENT = "db.statement";
/**
 * The name of the operation being executed, e.g. the [MongoDB command name](https://docs.mongodb.com/manual/reference/command/#database-operations) such as `findAndModify`, or the SQL keyword.
 *
 * Note: When setting this to an SQL keyword, it is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if the operation name is provided by the library being instrumented. If the SQL statement has an ambiguous operation, or performs more than one operation, this value may be omitted.
 *
 * @deprecated Use ATTR_DB_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_OPERATION = "db.operation";
/**
 * The Microsoft SQL Server [instance name](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) connecting to. This name is used to determine the port of a named instance.
 *
 * Note: If setting a `db.mssql.instance_name`, `net.peer.port` is no longer required (but still recommended if non-standard).
 *
 * @deprecated Use ATTR_DB_MSSQL_INSTANCE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
/**
 * The name of the keyspace being accessed. To be used instead of the generic `db.name` attribute.
 *
 * @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
/**
 * The fetch size used for paging, i.e. how many rows will be returned at once.
 *
 * @deprecated Use ATTR_DB_CASSANDRA_PAGE_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
/**
 * The name of the primary table that the operation is acting upon, including the schema name (if applicable).
 *
 * Note: This mirrors the db.sql.table attribute but references cassandra rather than sql. It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
 *
 * @deprecated Use ATTR_DB_CASSANDRA_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CASSANDRA_TABLE = "db.cassandra.table";
/**
 * Whether or not the query is idempotent.
 *
 * @deprecated Use ATTR_DB_CASSANDRA_IDEMPOTENCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
/**
 * The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
 *
 * @deprecated Use ATTR_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
/**
 * The ID of the coordinating node for a query.
 *
 * @deprecated Use ATTR_DB_CASSANDRA_COORDINATOR_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
/**
 * The data center of the coordinating node for a query.
 *
 * @deprecated Use ATTR_DB_CASSANDRA_COORDINATOR_DC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
/**
 * The [HBase namespace](https://hbase.apache.org/book.html#_namespace) being accessed. To be used instead of the generic `db.name` attribute.
 *
 * @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_HBASE_NAMESPACE = "db.hbase.namespace";
/**
 * The index of the database being accessed as used in the [`SELECT` command](https://redis.io/commands/select), provided as an integer. To be used instead of the generic `db.name` attribute.
 *
 * @deprecated Use ATTR_DB_REDIS_DATABASE_INDEX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
/**
 * The collection being accessed within the database stated in `db.name`.
 *
 * @deprecated Use ATTR_DB_MONGODB_COLLECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_MONGODB_COLLECTION = "db.mongodb.collection";
/**
 * The name of the primary table that the operation is acting upon, including the schema name (if applicable).
 *
 * Note: It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
 *
 * @deprecated Use ATTR_DB_SQL_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_DB_SQL_TABLE = "db.sql.table";
/**
 * The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
 *
 * @deprecated Use ATTR_EXCEPTION_TYPE.
 */
declare const SEMATTRS_EXCEPTION_TYPE = "exception.type";
/**
 * The exception message.
 *
 * @deprecated Use ATTR_EXCEPTION_MESSAGE.
 */
declare const SEMATTRS_EXCEPTION_MESSAGE = "exception.message";
/**
 * A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
 *
 * @deprecated Use ATTR_EXCEPTION_STACKTRACE.
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
* @deprecated Use ATTR_EXCEPTION_ESCAPED.
*/
declare const SEMATTRS_EXCEPTION_ESCAPED = "exception.escaped";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use ATTR_FAAS_TRIGGER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_TRIGGER = "faas.trigger";
/**
 * The execution ID of the current function execution.
 *
 * @deprecated Use ATTR_FAAS_INVOCATION_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_EXECUTION = "faas.execution";
/**
 * The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
 *
 * @deprecated Use ATTR_FAAS_DOCUMENT_COLLECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
/**
 * Describes the type of the operation that was performed on the data.
 *
 * @deprecated Use ATTR_FAAS_DOCUMENT_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
/**
 * A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
 *
 * @deprecated Use ATTR_FAAS_DOCUMENT_TIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_DOCUMENT_TIME = "faas.document.time";
/**
 * The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
 *
 * @deprecated Use ATTR_FAAS_DOCUMENT_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_DOCUMENT_NAME = "faas.document.name";
/**
 * A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
 *
 * @deprecated Use ATTR_FAAS_TIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_TIME = "faas.time";
/**
 * A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
 *
 * @deprecated Use ATTR_FAAS_CRON in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_CRON = "faas.cron";
/**
 * A boolean that is true if the serverless function is executed for the first time (aka cold-start).
 *
 * @deprecated Use ATTR_FAAS_COLDSTART in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_COLDSTART = "faas.coldstart";
/**
 * The name of the invoked function.
 *
 * Note: SHOULD be equal to the `faas.name` resource attribute of the invoked function.
 *
 * @deprecated Use ATTR_FAAS_INVOKED_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_INVOKED_NAME = "faas.invoked_name";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated Use ATTR_FAAS_INVOKED_PROVIDER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
/**
 * The cloud region of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.region` resource attribute of the invoked function.
 *
 * @deprecated Use ATTR_FAAS_INVOKED_REGION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_FAAS_INVOKED_REGION = "faas.invoked_region";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use ATTR_NET_TRANSPORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_TRANSPORT = "net.transport";
/**
 * Remote address of the peer (dotted decimal for IPv4 or [RFC5952](https://tools.ietf.org/html/rfc5952) for IPv6).
 *
 * @deprecated Use ATTR_NET_PEER_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_PEER_IP = "net.peer.ip";
/**
 * Remote port number.
 *
 * @deprecated Use ATTR_NET_PEER_PORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_PEER_PORT = "net.peer.port";
/**
 * Remote hostname or similar, see note below.
 *
 * @deprecated Use ATTR_NET_PEER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_PEER_NAME = "net.peer.name";
/**
 * Like `net.peer.ip` but for the host IP. Useful in case of a multi-IP host.
 *
 * @deprecated Use ATTR_NET_HOST_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_IP = "net.host.ip";
/**
 * Like `net.peer.port` but for the host port.
 *
 * @deprecated Use ATTR_NET_HOST_PORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_PORT = "net.host.port";
/**
 * Local hostname or similar, see note below.
 *
 * @deprecated Use ATTR_NET_HOST_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_NAME = "net.host.name";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use ATTR_NETWORK_CONNECTION_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use ATTR_NETWORK_CONNECTION_SUBTYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
/**
 * The name of the mobile carrier.
 *
 * @deprecated Use ATTR_NETWORK_CARRIER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
/**
 * The mobile carrier country code.
 *
 * @deprecated Use ATTR_NETWORK_CARRIER_MCC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
/**
 * The mobile carrier network code.
 *
 * @deprecated Use ATTR_NETWORK_CARRIER_MNC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
/**
 * The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
 *
 * @deprecated Use ATTR_NETWORK_CARRIER_ICC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
/**
 * The [`service.name`](../../resource/semantic_conventions/README.md#service) of the remote service. SHOULD be equal to the actual `service.name` resource attribute of the remote service if any.
 *
 * @deprecated Use ATTR_PEER_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_PEER_SERVICE = "peer.service";
/**
 * Username or client_id extracted from the access token or [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) header in the inbound request from outside the system.
 *
 * @deprecated Use ATTR_ENDUSER_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_ENDUSER_ID = "enduser.id";
/**
 * Actual/assumed role the client is making the request under extracted from token or application security context.
 *
 * @deprecated Use ATTR_ENDUSER_ROLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_ENDUSER_ROLE = "enduser.role";
/**
 * Scopes or granted authorities the client currently possesses extracted from token or application security context. The value would come from the scope associated with an [OAuth 2.0 Access Token](https://tools.ietf.org/html/rfc6749#section-3.3) or an attribute value in a [SAML 2.0 Assertion](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).
 *
 * @deprecated Use ATTR_ENDUSER_SCOPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_ENDUSER_SCOPE = "enduser.scope";
/**
 * Current &#34;managed&#34; thread ID (as opposed to OS thread ID).
 *
 * @deprecated Use ATTR_THREAD_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_THREAD_ID = "thread.id";
/**
 * Current thread name.
 *
 * @deprecated Use ATTR_THREAD_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_THREAD_NAME = "thread.name";
/**
 * The method or function name, or equivalent (usually rightmost part of the code unit&#39;s name).
 *
 * @deprecated Use ATTR_CODE_FUNCTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_CODE_FUNCTION = "code.function";
/**
 * The &#34;namespace&#34; within which `code.function` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function` form a unique identifier for the code unit.
 *
 * @deprecated Use ATTR_CODE_NAMESPACE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_CODE_NAMESPACE = "code.namespace";
/**
 * The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
 *
 * @deprecated Use ATTR_CODE_FILEPATH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_CODE_FILEPATH = "code.filepath";
/**
 * The line number in `code.filepath` best representing the operation. It SHOULD point within the code unit named in `code.function`.
 *
 * @deprecated Use ATTR_CODE_LINENO in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_CODE_LINENO = "code.lineno";
/**
 * HTTP request method.
 *
 * @deprecated Use ATTR_HTTP_METHOD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_METHOD = "http.method";
/**
 * Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.
 *
 * Note: `http.url` MUST NOT contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case the attribute&#39;s value should be `https://www.example.com/`.
 *
 * @deprecated Use ATTR_HTTP_URL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_URL = "http.url";
/**
 * The full request target as passed in a HTTP request line or equivalent.
 *
 * @deprecated Use ATTR_HTTP_TARGET in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_TARGET = "http.target";
/**
 * The value of the [HTTP host header](https://tools.ietf.org/html/rfc7230#section-5.4). An empty Host header should also be reported, see note.
 *
 * Note: When the header is present but empty the attribute SHOULD be set to the empty string. Note that this is a valid situation that is expected in certain cases, according the aforementioned [section of RFC 7230](https://tools.ietf.org/html/rfc7230#section-5.4). When the header is not set the attribute MUST NOT be set.
 *
 * @deprecated Use ATTR_HTTP_HOST in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_HOST = "http.host";
/**
 * The URI scheme identifying the used protocol.
 *
 * @deprecated Use ATTR_HTTP_SCHEME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_SCHEME = "http.scheme";
/**
 * [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
 *
 * @deprecated Use ATTR_HTTP_STATUS_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_STATUS_CODE = "http.status_code";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use ATTR_HTTP_FLAVOR in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_FLAVOR = "http.flavor";
/**
 * Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client.
 *
 * @deprecated Use ATTR_HTTP_USER_AGENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_USER_AGENT = "http.user_agent";
/**
 * The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
 *
 * @deprecated Use ATTR_HTTP_REQUEST_CONTENT_LENGTH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
/**
 * The size of the uncompressed request payload body after transport decoding. Not set if transport encoding not used.
 *
 * @deprecated Use ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
/**
 * The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
 *
 * @deprecated Use ATTR_HTTP_RESPONSE_CONTENT_LENGTH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
/**
 * The size of the uncompressed response payload body after transport decoding. Not set if transport encoding not used.
 *
 * @deprecated Use ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
/**
 * The primary server name of the matched virtual host. This should be obtained via configuration. If no such configuration can be obtained, this attribute MUST NOT be set ( `net.host.name` should be used instead).
 *
 * Note: `http.url` is usually not readily available on the server side but would have to be assembled in a cumbersome and sometimes lossy process from other information (see e.g. open-telemetry/opentelemetry-python/pull/148). It is thus preferred to supply the raw data that is available.
 *
 * @deprecated Use ATTR_HTTP_SERVER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_HTTP_SERVER_NAME = "http.server_name";
/**
 * The matched route (path template).
 *
 * @deprecated Use ATTR_HTTP_ROUTE.
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
* @deprecated Use ATTR_HTTP_CLIENT_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
*/
declare const SEMATTRS_HTTP_CLIENT_IP = "http.client_ip";
/**
 * The keys in the `RequestItems` object field.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_TABLE_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
/**
 * The JSON-serialized value of each item in the `ConsumedCapacity` response field.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_CONSUMED_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
/**
 * The JSON-serialized value of the `ItemCollectionMetrics` response field.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_ITEM_COLLECTION_METRICS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
/**
 * The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
/**
 * The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
/**
 * The value of the `ConsistentRead` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_CONSISTENT_READ in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
/**
 * The value of the `ProjectionExpression` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_PROJECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
/**
 * The value of the `Limit` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_LIMIT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
/**
 * The value of the `AttributesToGet` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_ATTRIBUTES_TO_GET in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
/**
 * The value of the `IndexName` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_INDEX_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
/**
 * The value of the `Select` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_SELECT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
/**
 * The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
/**
 * The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
/**
 * The value of the `ExclusiveStartTableName` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_EXCLUSIVE_START_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
/**
 * The the number of items in the `TableNames` response parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_TABLE_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
/**
 * The value of the `ScanIndexForward` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_SCAN_FORWARD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
/**
 * The value of the `Segment` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_SEGMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
/**
 * The value of the `TotalSegments` request parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_TOTAL_SEGMENTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
/**
 * The value of the `Count` response parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
/**
 * The value of the `ScannedCount` response parameter.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_SCANNED_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
/**
 * The JSON-serialized value of each item in the `AttributeDefinitions` request field.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
/**
 * The JSON-serialized value of each item in the the `GlobalSecondaryIndexUpdates` request field.
 *
 * @deprecated Use ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
/**
 * A string identifying the messaging system.
 *
 * @deprecated Use ATTR_MESSAGING_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_SYSTEM = "messaging.system";
/**
 * The message destination name. This might be equal to the span name but is required nevertheless.
 *
 * @deprecated Use ATTR_MESSAGING_DESTINATION_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_DESTINATION = "messaging.destination";
/**
 * The kind of message destination.
 *
 * @deprecated Removed in semconv v1.20.0.
 */
declare const SEMATTRS_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
/**
 * A boolean that is true if the message destination is temporary.
 *
 * @deprecated Use ATTR_MESSAGING_DESTINATION_TEMPORARY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
/**
 * The name of the transport protocol.
 *
 * @deprecated Use ATTR_NETWORK_PROTOCOL_NAME.
 */
declare const SEMATTRS_MESSAGING_PROTOCOL = "messaging.protocol";
/**
 * The version of the transport protocol.
 *
 * @deprecated Use ATTR_NETWORK_PROTOCOL_VERSION.
 */
declare const SEMATTRS_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
/**
 * Connection string.
 *
 * @deprecated Removed in semconv v1.17.0.
 */
declare const SEMATTRS_MESSAGING_URL = "messaging.url";
/**
 * A value used by the messaging system as an identifier for the message, represented as a string.
 *
 * @deprecated Use ATTR_MESSAGING_MESSAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_MESSAGE_ID = "messaging.message_id";
/**
 * The [conversation ID](#conversations) identifying the conversation to which the message belongs, represented as a string. Sometimes called &#34;Correlation ID&#34;.
 *
 * @deprecated Use ATTR_MESSAGING_MESSAGE_CONVERSATION_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
/**
 * The (uncompressed) size of the message payload in bytes. Also use this attribute if it is unknown whether the compressed or uncompressed payload size is reported.
 *
 * @deprecated Use ATTR_MESSAGING_MESSAGE_BODY_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
/**
 * The compressed size of the message payload in bytes.
 *
 * @deprecated Removed in semconv v1.22.0.
 */
declare const SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
/**
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
 *
 * @deprecated Use ATTR_MESSAGING_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_OPERATION = "messaging.operation";
/**
 * The identifier for the consumer receiving a message. For Kafka, set it to `{messaging.kafka.consumer_group} - {messaging.kafka.client_id}`, if both are present, or only `messaging.kafka.consumer_group`. For brokers, such as RabbitMQ and Artemis, set it to the `client_id` of the client consuming the message.
 *
 * @deprecated Removed in semconv v1.21.0.
 */
declare const SEMATTRS_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
/**
 * RabbitMQ message routing key.
 *
 * @deprecated Use ATTR_MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
/**
 * Message keys in Kafka are used for grouping alike messages to ensure they&#39;re processed on the same partition. They differ from `messaging.message_id` in that they&#39;re not unique. If the key is `null`, the attribute MUST NOT be set.
 *
 * Note: If the key type is not string, it&#39;s string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don&#39;t include its value.
 *
 * @deprecated Use ATTR_MESSAGING_KAFKA_MESSAGE_KEY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
/**
 * Name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.
 *
 * @deprecated Use ATTR_MESSAGING_KAFKA_CONSUMER_GROUP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
/**
 * Client Id for the Consumer or Producer that is handling the message.
 *
 * @deprecated Use ATTR_MESSAGING_CLIENT_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
/**
 * Partition the message is sent to.
 *
 * @deprecated Use ATTR_MESSAGING_KAFKA_DESTINATION_PARTITION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
/**
 * A boolean that is true if the message is a tombstone.
 *
 * @deprecated Use ATTR_MESSAGING_KAFKA_MESSAGE_TOMBSTONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
/**
 * A string identifying the remoting system.
 *
 * @deprecated Use ATTR_RPC_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_RPC_SYSTEM = "rpc.system";
/**
 * The full (logical) name of the service being called, including its package name, if applicable.
 *
 * Note: This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
 *
 * @deprecated Use ATTR_RPC_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_RPC_SERVICE = "rpc.service";
/**
 * The name of the (logical) method being called, must be equal to the $method part in the span name.
 *
 * Note: This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
 *
 * @deprecated Use ATTR_RPC_METHOD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_RPC_METHOD = "rpc.method";
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use ATTR_RPC_GRPC_STATUS_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
/**
 * Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 does not specify this, the value can be omitted.
 *
 * @deprecated Use ATTR_RPC_JSONRPC_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
/**
 * `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
 *
 * @deprecated Use ATTR_RPC_JSONRPC_REQUEST_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
/**
 * `error.code` property of response if it is an error response.
 *
 * @deprecated Use ATTR_RPC_JSONRPC_ERROR_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
/**
 * `error.message` property of response if it is an error response.
 *
 * @deprecated Use ATTR_RPC_JSONRPC_ERROR_MESSAGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
/**
 * Whether this is a received or sent message.
 *
 * @deprecated Use ATTR_MESSAGE_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGE_TYPE = "message.type";
/**
 * MUST be calculated as two different counters starting from `1` one for sent messages and one for received message.
 *
 * Note: This way we guarantee that the values will be consistent between different implementations.
 *
 * @deprecated Use ATTR_MESSAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGE_ID = "message.id";
/**
 * Compressed size of the message in bytes.
 *
 * @deprecated Use ATTR_MESSAGE_COMPRESSED_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
/**
 * Uncompressed size of the message in bytes.
 *
 * @deprecated Use ATTR_MESSAGE_UNCOMPRESSED_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
/**
 * Definition of available values for SemanticAttributes
 * This type is used for backward compatibility, you should use the individual exported
 * constants SemanticAttributes_XXXXX rather than the exported constant map. As any single reference
 * to a constant map value will result in all strings being included into your bundle.
 * @deprecated Use the SEMATTRS_XXXXX constants rather than the SemanticAttributes.XXXXX for bundle minification.
 */
type SemanticAttributes = {
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
 * @deprecated Use DB_SYSTEM_VALUE_OTHER_SQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_OTHER_SQL = "other_sql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MSSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_MSSQL = "mssql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MYSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_MYSQL = "mysql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_ORACLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_ORACLE = "oracle";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_DB2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_DB2 = "db2";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_POSTGRESQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_POSTGRESQL = "postgresql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_REDSHIFT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_REDSHIFT = "redshift";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_HIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_HIVE = "hive";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_CLOUDSCAPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_CLOUDSCAPE = "cloudscape";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_HSQLDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_HSQLDB = "hsqldb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_PROGRESS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_PROGRESS = "progress";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MAXDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_MAXDB = "maxdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_HANADB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_HANADB = "hanadb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_INGRES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_INGRES = "ingres";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_FIRSTSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_FIRSTSQL = "firstsql";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_EDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_EDB = "edb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_CACHE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_CACHE = "cache";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_ADABAS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_ADABAS = "adabas";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_FIREBIRD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_FIREBIRD = "firebird";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_DERBY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_DERBY = "derby";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_FILEMAKER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_FILEMAKER = "filemaker";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_INFORMIX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_INFORMIX = "informix";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_INSTANTDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_INSTANTDB = "instantdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_INTERBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_INTERBASE = "interbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MARIADB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_MARIADB = "mariadb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_NETEZZA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_NETEZZA = "netezza";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_PERVASIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_PERVASIVE = "pervasive";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_POINTBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_POINTBASE = "pointbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_SQLITE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_SQLITE = "sqlite";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_SYBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_SYBASE = "sybase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_TERADATA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_TERADATA = "teradata";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_VERTICA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_VERTICA = "vertica";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_H2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_H2 = "h2";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COLDFUSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_COLDFUSION = "coldfusion";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_CASSANDRA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_CASSANDRA = "cassandra";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_HBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_HBASE = "hbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MONGODB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_MONGODB = "mongodb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_REDIS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_REDIS = "redis";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COUCHBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_COUCHBASE = "couchbase";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COUCHDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_COUCHDB = "couchdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COSMOSDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_COSMOSDB = "cosmosdb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_DYNAMODB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_DYNAMODB = "dynamodb";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_NEO4J in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_NEO4J = "neo4j";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_GEODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_GEODE = "geode";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_ELASTICSEARCH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_ELASTICSEARCH = "elasticsearch";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_MEMCACHED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_MEMCACHED = "memcached";
/**
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 *
 * @deprecated Use DB_SYSTEM_VALUE_COCKROACHDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBSYSTEMVALUES_COCKROACHDB = "cockroachdb";
/**
 * Identifies the Values for DbSystemValues enum definition
 *
 * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
 * @deprecated Use the DBSYSTEMVALUES_XXXXX constants rather than the DbSystemValues.XXXXX for bundle minification.
 */
type DbSystemValues = {
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
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ALL = "all";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = "each_quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = "quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = "local_quorum";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ONE = "one";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_TWO = "two";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_THREE = "three";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = "local_one";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_ANY = "any";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = "serial";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = "local_serial";
/**
 * Identifies the Values for DbCassandraConsistencyLevelValues enum definition
 *
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 * @deprecated Use the DBCASSANDRACONSISTENCYLEVELVALUES_XXXXX constants rather than the DbCassandraConsistencyLevelValues.XXXXX for bundle minification.
 */
type DbCassandraConsistencyLevelValues = {
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
 * @deprecated Use FAAS_TRIGGER_VALUE_DATASOURCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASTRIGGERVALUES_DATASOURCE = "datasource";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_HTTP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASTRIGGERVALUES_HTTP = "http";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_PUBSUB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASTRIGGERVALUES_PUBSUB = "pubsub";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_TIMER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASTRIGGERVALUES_TIMER = "timer";
/**
 * Type of the trigger on which the function is executed.
 *
 * @deprecated Use FAAS_TRIGGER_VALUE_OTHER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASTRIGGERVALUES_OTHER = "other";
/**
 * Identifies the Values for FaasTriggerValues enum definition
 *
 * Type of the trigger on which the function is executed.
 * @deprecated Use the FAASTRIGGERVALUES_XXXXX constants rather than the FaasTriggerValues.XXXXX for bundle minification.
 */
type FaasTriggerValues = {
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
 * @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_INSERT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASDOCUMENTOPERATIONVALUES_INSERT = "insert";
/**
 * Describes the type of the operation that was performed on the data.
 *
 * @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_EDIT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASDOCUMENTOPERATIONVALUES_EDIT = "edit";
/**
 * Describes the type of the operation that was performed on the data.
 *
 * @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_DELETE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASDOCUMENTOPERATIONVALUES_DELETE = "delete";
/**
 * Identifies the Values for FaasDocumentOperationValues enum definition
 *
 * Describes the type of the operation that was performed on the data.
 * @deprecated Use the FAASDOCUMENTOPERATIONVALUES_XXXXX constants rather than the FaasDocumentOperationValues.XXXXX for bundle minification.
 */
type FaasDocumentOperationValues = {
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
 * @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_ALIBABA_CLOUD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_AWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASINVOKEDPROVIDERVALUES_AWS = "aws";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_AZURE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const FAASINVOKEDPROVIDERVALUES_AZURE = "azure";
/**
 * The cloud provider of the invoked function.
 *
 * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_GCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
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
type FaasInvokedProviderValues = {
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
 * @deprecated Use NET_TRANSPORT_VALUE_IP_TCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETTRANSPORTVALUES_IP_TCP = "ip_tcp";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_IP_UDP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETTRANSPORTVALUES_IP_UDP = "ip_udp";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Removed in v1.21.0.
 */
declare const NETTRANSPORTVALUES_IP = "ip";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Removed in v1.21.0.
 */
declare const NETTRANSPORTVALUES_UNIX = "unix";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_PIPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETTRANSPORTVALUES_PIPE = "pipe";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_INPROC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETTRANSPORTVALUES_INPROC = "inproc";
/**
 * Transport protocol used. See note below.
 *
 * @deprecated Use NET_TRANSPORT_VALUE_OTHER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETTRANSPORTVALUES_OTHER = "other";
/**
 * Identifies the Values for NetTransportValues enum definition
 *
 * Transport protocol used. See note below.
 * @deprecated Use the NETTRANSPORTVALUES_XXXXX constants rather than the NetTransportValues.XXXXX for bundle minification.
 */
type NetTransportValues = {
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
 * @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_WIFI in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONTYPEVALUES_WIFI = "wifi";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_WIRED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONTYPEVALUES_WIRED = "wired";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_CELL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONTYPEVALUES_CELL = "cell";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_UNAVAILABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = "unavailable";
/**
 * The internet connection type currently being used by the host.
 *
 * @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_UNKNOWN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = "unknown";
/**
 * Identifies the Values for NetHostConnectionTypeValues enum definition
 *
 * The internet connection type currently being used by the host.
 * @deprecated Use the NETHOSTCONNECTIONTYPEVALUES_XXXXX constants rather than the NetHostConnectionTypeValues.XXXXX for bundle minification.
 */
type NetHostConnectionTypeValues = {
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
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_GPRS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = "gprs";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EDGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = "edge";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_UMTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = "umts";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = "cdma";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = "evdo_0";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_A in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = "evdo_a";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA2000_1XRTT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = "cdma2000_1xrtt";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSDPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = "hsdpa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSUPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = "hsupa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = "hspa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_IDEN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = "iden";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_B in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = "evdo_b";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_LTE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_LTE = "lte";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EHRPD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = "ehrpd";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSPAP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = "hspap";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_GSM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_GSM = "gsm";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_TD_SCDMA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = "td_scdma";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_IWLAN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = "iwlan";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_NR in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_NR = "nr";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_NRNSA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = "nrnsa";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_LTE_CA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = "lte_ca";
/**
 * Identifies the Values for NetHostConnectionSubtypeValues enum definition
 *
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 * @deprecated Use the NETHOSTCONNECTIONSUBTYPEVALUES_XXXXX constants rather than the NetHostConnectionSubtypeValues.XXXXX for bundle minification.
 */
type NetHostConnectionSubtypeValues = {
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
 * @deprecated Use HTTP_FLAVOR_VALUE_HTTP_1_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HTTPFLAVORVALUES_HTTP_1_0 = "1.0";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_HTTP_1_1 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HTTPFLAVORVALUES_HTTP_1_1 = "1.1";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_HTTP_2_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HTTPFLAVORVALUES_HTTP_2_0 = "2.0";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_SPDY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HTTPFLAVORVALUES_SPDY = "SPDY";
/**
 * Kind of HTTP protocol used.
 *
 * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
 *
 * @deprecated Use HTTP_FLAVOR_VALUE_QUIC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
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
type HttpFlavorValues = {
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
 * @deprecated Removed in semconv v1.20.0.
 */
declare const MESSAGINGDESTINATIONKINDVALUES_QUEUE = "queue";
/**
 * The kind of message destination.
 *
 * @deprecated Removed in semconv v1.20.0.
 */
declare const MESSAGINGDESTINATIONKINDVALUES_TOPIC = "topic";
/**
 * Identifies the Values for MessagingDestinationKindValues enum definition
 *
 * The kind of message destination.
 * @deprecated Use the MESSAGINGDESTINATIONKINDVALUES_XXXXX constants rather than the MessagingDestinationKindValues.XXXXX for bundle minification.
 */
type MessagingDestinationKindValues = {
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
 * @deprecated Use MESSAGING_OPERATION_TYPE_VALUE_RECEIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const MESSAGINGOPERATIONVALUES_RECEIVE = "receive";
/**
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
 *
 * @deprecated Use MESSAGING_OPERATION_TYPE_VALUE_PROCESS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const MESSAGINGOPERATIONVALUES_PROCESS = "process";
/**
 * Identifies the Values for MessagingOperationValues enum definition
 *
 * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
 * @deprecated Use the MESSAGINGOPERATIONVALUES_XXXXX constants rather than the MessagingOperationValues.XXXXX for bundle minification.
 */
type MessagingOperationValues = {
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
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_OK in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_OK = 0;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_CANCELLED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_CANCELLED = 1;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNKNOWN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_UNKNOWN = 2;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_INVALID_ARGUMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = 3;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_DEADLINE_EXCEEDED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = 4;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_NOT_FOUND in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_NOT_FOUND = 5;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_ALREADY_EXISTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = 6;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_PERMISSION_DENIED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = 7;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_RESOURCE_EXHAUSTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = 8;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_FAILED_PRECONDITION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = 9;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_ABORTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_ABORTED = 10;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_OUT_OF_RANGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = 11;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNIMPLEMENTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = 12;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_INTERNAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_INTERNAL = 13;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNAVAILABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = 14;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_DATA_LOSS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_DATA_LOSS = 15;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNAUTHENTICATED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = 16;
/**
 * Identifies the Values for RpcGrpcStatusCodeValues enum definition
 *
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 * @deprecated Use the RPCGRPCSTATUSCODEVALUES_XXXXX constants rather than the RpcGrpcStatusCodeValues.XXXXX for bundle minification.
 */
type RpcGrpcStatusCodeValues = {
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
 * @deprecated Use MESSAGE_TYPE_VALUE_SENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const MESSAGETYPEVALUES_SENT = "SENT";
/**
 * Whether this is a received or sent message.
 *
 * @deprecated Use MESSAGE_TYPE_VALUE_RECEIVED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const MESSAGETYPEVALUES_RECEIVED = "RECEIVED";
/**
 * Identifies the Values for MessageTypeValues enum definition
 *
 * Whether this is a received or sent message.
 * @deprecated Use the MESSAGETYPEVALUES_XXXXX constants rather than the MessageTypeValues.XXXXX for bundle minification.
 */
type MessageTypeValues = {
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
 * @deprecated Use ATTR_CLOUD_PROVIDER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CLOUD_PROVIDER = "cloud.provider";
/**
 * The cloud account ID the resource is assigned to.
 *
 * @deprecated Use ATTR_CLOUD_ACCOUNT_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CLOUD_ACCOUNT_ID = "cloud.account.id";
/**
 * The geographical region the resource is running. Refer to your provider&#39;s docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/geographies/), or [Google Cloud regions](https://cloud.google.com/about/locations).
 *
 * @deprecated Use ATTR_CLOUD_REGION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CLOUD_REGION = "cloud.region";
/**
 * Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
 *
 * Note: Availability zones are called &#34;zones&#34; on Alibaba Cloud and Google Cloud.
 *
 * @deprecated Use ATTR_CLOUD_AVAILABILITY_ZONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use ATTR_CLOUD_PLATFORM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CLOUD_PLATFORM = "cloud.platform";
/**
 * The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
 *
 * @deprecated Use ATTR_AWS_ECS_CONTAINER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
/**
 * The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
 *
 * @deprecated Use ATTR_AWS_ECS_CLUSTER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
/**
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 *
 * @deprecated Use ATTR_AWS_ECS_LAUNCHTYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
/**
 * The ARN of an [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html).
 *
 * @deprecated Use ATTR_AWS_ECS_TASK_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
/**
 * The task definition family this task definition is a member of.
 *
 * @deprecated Use ATTR_AWS_ECS_TASK_FAMILY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
/**
 * The revision for this task definition.
 *
 * @deprecated Use ATTR_AWS_ECS_TASK_REVISION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
/**
 * The ARN of an EKS cluster.
 *
 * @deprecated Use ATTR_AWS_EKS_CLUSTER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
/**
 * The name(s) of the AWS log group(s) an application is writing to.
 *
 * Note: Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
 *
 * @deprecated Use ATTR_AWS_LOG_GROUP_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
/**
 * The Amazon Resource Name(s) (ARN) of the AWS log group(s).
 *
 * Note: See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
 *
 * @deprecated Use ATTR_AWS_LOG_GROUP_ARNS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
/**
 * The name(s) of the AWS log stream(s) an application is writing to.
 *
 * @deprecated Use ATTR_AWS_LOG_STREAM_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
/**
 * The ARN(s) of the AWS log stream(s).
 *
 * Note: See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
 *
 * @deprecated Use ATTR_AWS_LOG_STREAM_ARNS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
/**
 * Container name.
 *
 * @deprecated Use ATTR_CONTAINER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CONTAINER_NAME = "container.name";
/**
 * Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/reference/run/#container-identification). The UUID might be abbreviated.
 *
 * @deprecated Use ATTR_CONTAINER_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CONTAINER_ID = "container.id";
/**
 * The container runtime managing this container.
 *
 * @deprecated Use ATTR_CONTAINER_RUNTIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CONTAINER_RUNTIME = "container.runtime";
/**
 * Name of the image the container was built on.
 *
 * @deprecated Use ATTR_CONTAINER_IMAGE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CONTAINER_IMAGE_NAME = "container.image.name";
/**
 * Container image tag.
 *
 * @deprecated Use ATTR_CONTAINER_IMAGE_TAGS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_CONTAINER_IMAGE_TAG = "container.image.tag";
/**
 * Name of the [deployment environment](https://en.wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
 *
 * @deprecated Use ATTR_DEPLOYMENT_ENVIRONMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
/**
 * A unique identifier representing the device.
 *
 * Note: The device identifier MUST only be defined using the values outlined below. This value is not an advertising identifier and MUST NOT be used as such. On iOS (Swift or Objective-C), this value MUST be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value MUST be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
 *
 * @deprecated Use ATTR_DEVICE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_DEVICE_ID = "device.id";
/**
 * The model identifier for the device.
 *
 * Note: It&#39;s recommended this value represents a machine readable version of the model identifier rather than the market or consumer-friendly name of the device.
 *
 * @deprecated Use ATTR_DEVICE_MODEL_IDENTIFIER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
/**
 * The marketing name for the device model.
 *
 * Note: It&#39;s recommended this value represents a human readable version of the device model rather than a machine readable alternative.
 *
 * @deprecated Use ATTR_DEVICE_MODEL_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_DEVICE_MODEL_NAME = "device.model.name";
/**
 * The name of the single function that this runtime instance executes.
 *
 * Note: This is the name of the function as configured/deployed on the FaaS platform and is usually different from the name of the callback function (which may be stored in the [`code.namespace`/`code.function`](../../trace/semantic_conventions/span-general.md#source-code-attributes) span attributes).
 *
 * @deprecated Use ATTR_FAAS_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
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
* @deprecated Use ATTR_CLOUD_RESOURCE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
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
* @deprecated Use ATTR_FAAS_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
*/
declare const SEMRESATTRS_FAAS_VERSION = "faas.version";
/**
 * The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
 *
 * Note: * **AWS Lambda:** Use the (full) log stream name.
 *
 * @deprecated Use ATTR_FAAS_INSTANCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_FAAS_INSTANCE = "faas.instance";
/**
 * The amount of memory available to the serverless function in MiB.
 *
 * Note: It&#39;s recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information.
 *
 * @deprecated Use ATTR_FAAS_MAX_MEMORY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_FAAS_MAX_MEMORY = "faas.max_memory";
/**
 * Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider.
 *
 * @deprecated Use ATTR_HOST_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_HOST_ID = "host.id";
/**
 * Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
 *
 * @deprecated Use ATTR_HOST_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_HOST_NAME = "host.name";
/**
 * Type of host. For Cloud, this must be the machine type.
 *
 * @deprecated Use ATTR_HOST_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_HOST_TYPE = "host.type";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use ATTR_HOST_ARCH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_HOST_ARCH = "host.arch";
/**
 * Name of the VM image or OS install the host was instantiated from.
 *
 * @deprecated Use ATTR_HOST_IMAGE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_HOST_IMAGE_NAME = "host.image.name";
/**
 * VM image ID. For Cloud, this value is from the provider.
 *
 * @deprecated Use ATTR_HOST_IMAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_HOST_IMAGE_ID = "host.image.id";
/**
 * The version string of the VM image as defined in [Version Attributes](README.md#version-attributes).
 *
 * @deprecated Use ATTR_HOST_IMAGE_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_HOST_IMAGE_VERSION = "host.image.version";
/**
 * The name of the cluster.
 *
 * @deprecated Use ATTR_K8S_CLUSTER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_CLUSTER_NAME = "k8s.cluster.name";
/**
 * The name of the Node.
 *
 * @deprecated Use ATTR_K8S_NODE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_NODE_NAME = "k8s.node.name";
/**
 * The UID of the Node.
 *
 * @deprecated Use ATTR_K8S_NODE_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_NODE_UID = "k8s.node.uid";
/**
 * The name of the namespace that the pod is running in.
 *
 * @deprecated Use ATTR_K8S_NAMESPACE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_NAMESPACE_NAME = "k8s.namespace.name";
/**
 * The UID of the Pod.
 *
 * @deprecated Use ATTR_K8S_POD_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_POD_UID = "k8s.pod.uid";
/**
 * The name of the Pod.
 *
 * @deprecated Use ATTR_K8S_POD_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_POD_NAME = "k8s.pod.name";
/**
 * The name of the Container in a Pod template.
 *
 * @deprecated Use ATTR_K8S_CONTAINER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_CONTAINER_NAME = "k8s.container.name";
/**
 * The UID of the ReplicaSet.
 *
 * @deprecated Use ATTR_K8S_REPLICASET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_REPLICASET_UID = "k8s.replicaset.uid";
/**
 * The name of the ReplicaSet.
 *
 * @deprecated Use ATTR_K8S_REPLICASET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_REPLICASET_NAME = "k8s.replicaset.name";
/**
 * The UID of the Deployment.
 *
 * @deprecated Use ATTR_K8S_DEPLOYMENT_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
/**
 * The name of the Deployment.
 *
 * @deprecated Use ATTR_K8S_DEPLOYMENT_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
/**
 * The UID of the StatefulSet.
 *
 * @deprecated Use ATTR_K8S_STATEFULSET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
/**
 * The name of the StatefulSet.
 *
 * @deprecated Use ATTR_K8S_STATEFULSET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
/**
 * The UID of the DaemonSet.
 *
 * @deprecated Use ATTR_K8S_DAEMONSET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
/**
 * The name of the DaemonSet.
 *
 * @deprecated Use ATTR_K8S_DAEMONSET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
/**
 * The UID of the Job.
 *
 * @deprecated Use ATTR_K8S_JOB_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_JOB_UID = "k8s.job.uid";
/**
 * The name of the Job.
 *
 * @deprecated Use ATTR_K8S_JOB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_JOB_NAME = "k8s.job.name";
/**
 * The UID of the CronJob.
 *
 * @deprecated Use ATTR_K8S_CRONJOB_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_CRONJOB_UID = "k8s.cronjob.uid";
/**
 * The name of the CronJob.
 *
 * @deprecated Use ATTR_K8S_CRONJOB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_K8S_CRONJOB_NAME = "k8s.cronjob.name";
/**
 * The operating system type.
 *
 * @deprecated Use ATTR_OS_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_OS_TYPE = "os.type";
/**
 * Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
 *
 * @deprecated Use ATTR_OS_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_OS_DESCRIPTION = "os.description";
/**
 * Human readable operating system name.
 *
 * @deprecated Use ATTR_OS_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_OS_NAME = "os.name";
/**
 * The version string of the operating system as defined in [Version Attributes](../../resource/semantic_conventions/README.md#version-attributes).
 *
 * @deprecated Use ATTR_OS_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_OS_VERSION = "os.version";
/**
 * Process identifier (PID).
 *
 * @deprecated Use ATTR_PROCESS_PID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_PID = "process.pid";
/**
 * The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
 *
 * @deprecated Use ATTR_PROCESS_EXECUTABLE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_EXECUTABLE_NAME = "process.executable.name";
/**
 * The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
 *
 * @deprecated Use ATTR_PROCESS_EXECUTABLE_PATH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_EXECUTABLE_PATH = "process.executable.path";
/**
 * The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
 *
 * @deprecated Use ATTR_PROCESS_COMMAND in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_COMMAND = "process.command";
/**
 * The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
 *
 * @deprecated Use ATTR_PROCESS_COMMAND_LINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_COMMAND_LINE = "process.command_line";
/**
 * All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
 *
 * @deprecated Use ATTR_PROCESS_COMMAND_ARGS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_COMMAND_ARGS = "process.command_args";
/**
 * The username of the user that owns the process.
 *
 * @deprecated Use ATTR_PROCESS_OWNER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_OWNER = "process.owner";
/**
 * The name of the runtime of this process. For compiled native binaries, this SHOULD be the name of the compiler.
 *
 * @deprecated Use ATTR_PROCESS_RUNTIME_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_NAME = "process.runtime.name";
/**
 * The version of the runtime of this process, as returned by the runtime without modification.
 *
 * @deprecated Use ATTR_PROCESS_RUNTIME_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_VERSION = "process.runtime.version";
/**
 * An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
 *
 * @deprecated Use ATTR_PROCESS_RUNTIME_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
/**
 * Logical name of the service.
 *
 * Note: MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs MUST fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md#process), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value MUST be set to `unknown_service`.
 *
 * @deprecated Use ATTR_SERVICE_NAME.
 */
declare const SEMRESATTRS_SERVICE_NAME = "service.name";
/**
 * A namespace for `service.name`.
 *
 * Note: A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
 *
 * @deprecated Use ATTR_SERVICE_NAMESPACE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_SERVICE_NAMESPACE = "service.namespace";
/**
 * The string ID of the service instance.
 *
 * Note: MUST be unique for each instance of the same `service.namespace,service.name` pair (in other words `service.namespace,service.name,service.instance.id` triplet MUST be globally unique). The ID helps to distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled service). It is preferable for the ID to be persistent and stay the same for the lifetime of the service instance, however it is acceptable that the ID is ephemeral and changes during important lifetime events for the service (e.g. service restarts). If the service has no inherent unique ID that can be used as the value of this attribute it is recommended to generate a random Version 1 or Version 4 RFC 4122 UUID (services aiming for reproducible UUIDs may also use Version 5, see RFC 4122 for more recommendations).
 *
 * @deprecated Use ATTR_SERVICE_INSTANCE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_SERVICE_INSTANCE_ID = "service.instance.id";
/**
 * The version string of the service API or implementation.
 *
 * @deprecated Use ATTR_SERVICE_VERSION.
 */
declare const SEMRESATTRS_SERVICE_VERSION = "service.version";
/**
 * The name of the telemetry SDK as defined above.
 *
 * @deprecated Use ATTR_TELEMETRY_SDK_NAME.
 */
declare const SEMRESATTRS_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
/**
 * The language of the telemetry SDK.
 *
 * @deprecated Use ATTR_TELEMETRY_SDK_LANGUAGE.
 */
declare const SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
/**
 * The version string of the telemetry SDK.
 *
 * @deprecated Use ATTR_TELEMETRY_SDK_VERSION.
 */
declare const SEMRESATTRS_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
/**
 * The version string of the auto instrumentation agent, if used.
 *
 * @deprecated Use ATTR_TELEMETRY_DISTRO_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
/**
 * The name of the web engine.
 *
 * @deprecated Use ATTR_WEBENGINE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_WEBENGINE_NAME = "webengine.name";
/**
 * The version of the web engine.
 *
 * @deprecated Use ATTR_WEBENGINE_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_WEBENGINE_VERSION = "webengine.version";
/**
 * Additional description of the web engine (e.g. detailed version and edition information).
 *
 * @deprecated Use ATTR_WEBENGINE_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const SEMRESATTRS_WEBENGINE_DESCRIPTION = "webengine.description";
/**
 * Definition of available values for SemanticResourceAttributes
 * This type is used for backward compatibility, you should use the individual exported
 * constants SemanticResourceAttributes_XXXXX rather than the exported constant map. As any single reference
 * to a constant map value will result in all strings being included into your bundle.
 * @deprecated Use the SEMRESATTRS_XXXXX constants rather than the SemanticResourceAttributes.XXXXX for bundle minification.
 */
type SemanticResourceAttributes = {
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
 * @deprecated Use CLOUD_PROVIDER_VALUE_ALIBABA_CLOUD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
/**
 * Name of the cloud provider.
 *
 * @deprecated Use CLOUD_PROVIDER_VALUE_AWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPROVIDERVALUES_AWS = "aws";
/**
 * Name of the cloud provider.
 *
 * @deprecated Use CLOUD_PROVIDER_VALUE_AZURE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPROVIDERVALUES_AZURE = "azure";
/**
 * Name of the cloud provider.
 *
 * @deprecated Use CLOUD_PROVIDER_VALUE_GCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPROVIDERVALUES_GCP = "gcp";
/**
 * Identifies the Values for CloudProviderValues enum definition
 *
 * Name of the cloud provider.
 * @deprecated Use the CLOUDPROVIDERVALUES_XXXXX constants rather than the CloudProviderValues.XXXXX for bundle minification.
 */
type CloudProviderValues = {
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
 * @deprecated Use CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_ECS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_FC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_EC2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AWS_EC2 = "aws_ec2";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_ECS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AWS_ECS = "aws_ecs";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_EKS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AWS_EKS = "aws_eks";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_LAMBDA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AWS_LAMBDA = "aws_lambda";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AWS_ELASTIC_BEANSTALK in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_VM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AZURE_VM = "azure_vm";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_INSTANCES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = "azure_container_instances";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_AKS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AZURE_AKS = "azure_aks";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_FUNCTIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = "azure_functions";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_APP_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = "azure_app_service";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_COMPUTE_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_CLOUD_RUN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = "gcp_cloud_run";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_KUBERNETES_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_CLOUD_FUNCTIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
/**
 * The cloud platform in use.
 *
 * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
 *
 * @deprecated Use CLOUD_PLATFORM_VALUE_GCP_APP_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
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
type CloudPlatformValues = {
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
 * @deprecated Use AWS_ECS_LAUNCHTYPE_VALUE_EC2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const AWSECSLAUNCHTYPEVALUES_EC2 = "ec2";
/**
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 *
 * @deprecated Use AWS_ECS_LAUNCHTYPE_VALUE_FARGATE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const AWSECSLAUNCHTYPEVALUES_FARGATE = "fargate";
/**
 * Identifies the Values for AwsEcsLaunchtypeValues enum definition
 *
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 * @deprecated Use the AWSECSLAUNCHTYPEVALUES_XXXXX constants rather than the AwsEcsLaunchtypeValues.XXXXX for bundle minification.
 */
type AwsEcsLaunchtypeValues = {
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
 * @deprecated Use HOST_ARCH_VALUE_AMD64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HOSTARCHVALUES_AMD64 = "amd64";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_ARM32 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HOSTARCHVALUES_ARM32 = "arm32";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_ARM64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HOSTARCHVALUES_ARM64 = "arm64";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_IA64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HOSTARCHVALUES_IA64 = "ia64";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_PPC32 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HOSTARCHVALUES_PPC32 = "ppc32";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_PPC64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HOSTARCHVALUES_PPC64 = "ppc64";
/**
 * The CPU architecture the host system is running on.
 *
 * @deprecated Use HOST_ARCH_VALUE_X86 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const HOSTARCHVALUES_X86 = "x86";
/**
 * Identifies the Values for HostArchValues enum definition
 *
 * The CPU architecture the host system is running on.
 * @deprecated Use the HOSTARCHVALUES_XXXXX constants rather than the HostArchValues.XXXXX for bundle minification.
 */
type HostArchValues = {
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
 * @deprecated Use OS_TYPE_VALUE_WINDOWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_WINDOWS = "windows";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_LINUX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_LINUX = "linux";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_DARWIN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_DARWIN = "darwin";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_FREEBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_FREEBSD = "freebsd";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_NETBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_NETBSD = "netbsd";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_OPENBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_OPENBSD = "openbsd";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_DRAGONFLYBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_DRAGONFLYBSD = "dragonflybsd";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_HPUX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_HPUX = "hpux";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_AIX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_AIX = "aix";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_SOLARIS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_SOLARIS = "solaris";
/**
 * The operating system type.
 *
 * @deprecated Use OS_TYPE_VALUE_Z_OS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
 */
declare const OSTYPEVALUES_Z_OS = "z_os";
/**
 * Identifies the Values for OsTypeValues enum definition
 *
 * The operating system type.
 * @deprecated Use the OSTYPEVALUES_XXXXX constants rather than the OsTypeValues.XXXXX for bundle minification.
 */
type OsTypeValues = {
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
type TelemetrySdkLanguageValues = {
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
 * ASP.NET Core exception middleware handling result
 *
 * @example handled
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
 * Full type name of the [`IExceptionHandler`](https://learn.microsoft.com/dotnet/api/microsoft.aspnetcore.diagnostics.iexceptionhandler) implementation that handled the exception.
 *
 * @example Contoso.MyHandler
 */
declare const ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE: "aspnetcore.diagnostics.handler.type";
/**
 * Rate limiting policy name.
 *
 * @example fixed
 * @example sliding
 * @example token
 */
declare const ATTR_ASPNETCORE_RATE_LIMITING_POLICY: "aspnetcore.rate_limiting.policy";
/**
 * Rate-limiting result, shows whether the lease was acquired or contains a rejection reason
 *
 * @example acquired
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
 * @example 10.1.2.80
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
 * Name of the garbage collector managed heap generation.
 *
 * @example gen0
 * @example gen1
 * @example gen2
 */
declare const ATTR_DOTNET_GC_HEAP_GENERATION: "dotnet.gc.heap.generation";
/**
* Enum value "gen0" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
*/
declare const DOTNET_GC_HEAP_GENERATION_VALUE_GEN0: "gen0";
/**
* Enum value "gen1" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
*/
declare const DOTNET_GC_HEAP_GENERATION_VALUE_GEN1: "gen1";
/**
* Enum value "gen2" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
*/
declare const DOTNET_GC_HEAP_GENERATION_VALUE_GEN2: "gen2";
/**
* Enum value "loh" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
*/
declare const DOTNET_GC_HEAP_GENERATION_VALUE_LOH: "loh";
/**
* Enum value "poh" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
*/
declare const DOTNET_GC_HEAP_GENERATION_VALUE_POH: "poh";
/**
 * Describes a class of error the operation ended with.
 *
 * @example timeout
 * @example java.net.UnknownHostException
 * @example server_certificate_invalid
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
 * If the operation has completed successfully, instrumentations **SHOULD NOT** set `error.type`.
 *
 * If a specific domain defines its own set of error identifiers (such as HTTP or gRPC status codes),
 * it's **RECOMMENDED** to:
 *
 *   - Use a domain-specific attribute
 *   - Set `error.type` to capture all errors, regardless of whether they are defined within the domain-specific set or not.
 */
declare const ATTR_ERROR_TYPE: "error.type";
/**
* Enum value "_OTHER" for attribute {@link ATTR_ERROR_TYPE}.
*/
declare const ERROR_TYPE_VALUE_OTHER: "_OTHER";
/**
 * Indicates that the exception is escaping the scope of the span.
 *
 * @deprecated It's no longer recommended to record exceptions that are handled and do not escape the scope of a span.
 */
declare const ATTR_EXCEPTION_ESCAPED: "exception.escaped";
/**
 * The exception message.
 *
 * @example Division by zero
 * @example Can't convert 'int' object to str implicitly
 */
declare const ATTR_EXCEPTION_MESSAGE: "exception.message";
/**
 * A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
 *
 * @example "Exception in thread "main" java.lang.RuntimeException: Test exception\\n at com.example.GenerateTrace.methodB(GenerateTrace.java:13)\\n at com.example.GenerateTrace.methodA(GenerateTrace.java:9)\\n at com.example.GenerateTrace.main(GenerateTrace.java:5)\\n"
 */
declare const ATTR_EXCEPTION_STACKTRACE: "exception.stacktrace";
/**
 * The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
 *
 * @example java.net.ConnectException
 * @example OSError
 */
declare const ATTR_EXCEPTION_TYPE: "exception.type";
/**
 * HTTP request headers, `<key>` being the normalized HTTP Header name (lowercase), the value being the header values.
 *
 * @example http.request.header.content-type=["application/json"]
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
 * @example POST
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
 * @example ACL
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
 * @example {controller}/{action}/{id?}
 *
 * @note **MUST NOT** be populated when this is not supported by the HTTP server framework as the route attribute should have low-cardinality and the URI path can NOT substitute it.
 * **SHOULD** include the [application root](/docs/http/http-spans.md#http-server-definitions) if there is one.
 */
declare const ATTR_HTTP_ROUTE: "http.route";
/**
 * Name of the garbage collector action.
 *
 * @example end of minor GC
 * @example end of major GC
 *
 * @note Garbage collector action is generally obtained via [GarbageCollectionNotificationInfo#getGcAction()](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.management/com/sun/management/GarbageCollectionNotificationInfo.html#getGcAction()).
 */
declare const ATTR_JVM_GC_ACTION: "jvm.gc.action";
/**
 * Name of the garbage collector.
 *
 * @example G1 Young Generation
 * @example G1 Old Generation
 *
 * @note Garbage collector name is generally obtained via [GarbageCollectionNotificationInfo#getGcName()](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.management/com/sun/management/GarbageCollectionNotificationInfo.html#getGcName()).
 */
declare const ATTR_JVM_GC_NAME: "jvm.gc.name";
/**
 * Name of the memory pool.
 *
 * @example G1 Old Gen
 * @example G1 Eden space
 * @example G1 Survivor Space
 *
 * @note Pool names are generally obtained via [MemoryPoolMXBean#getName()](https://docs.oracle.com/en/java/javase/11/docs/api/java.management/java/lang/management/MemoryPoolMXBean.html#getName()).
 */
declare const ATTR_JVM_MEMORY_POOL_NAME: "jvm.memory.pool.name";
/**
 * The type of memory.
 *
 * @example heap
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
 * [OSI application layer](https://wikipedia.org/wiki/Application_layer) or non-OSI equivalent.
 *
 * @example amqp
 * @example http
 * @example mqtt
 *
 * @note The value **SHOULD** be normalized to lowercase.
 */
declare const ATTR_NETWORK_PROTOCOL_NAME: "network.protocol.name";
/**
 * The actual version of the protocol used for network communication.
 *
 * @example 1.1
 * @example 2
 *
 * @note If protocol version is subject to negotiation (for example using [ALPN](https://www.rfc-editor.org/rfc/rfc7301.html)), this attribute **SHOULD** be set to the negotiated version. If the actual protocol version is not known, this attribute **SHOULD NOT** be set.
 */
declare const ATTR_NETWORK_PROTOCOL_VERSION: "network.protocol.version";
/**
 * [OSI transport layer](https://wikipedia.org/wiki/Transport_layer) or [inter-process communication method](https://wikipedia.org/wiki/Inter-process_communication).
 *
 * @example tcp
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
 * [OSI network layer](https://wikipedia.org/wiki/Network_layer) or non-OSI equivalent.
 *
 * @example ipv4
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
 * Name of the code, either "OK" or "ERROR". **MUST NOT** be set if the status code is UNSET.
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
 * @example 10.1.2.80
 * @example /tmp/my.sock
 *
 * @note When observed from the client side, and when communicating through an intermediary, `server.address` **SHOULD** represent the server address behind any intermediaries, for example proxies, if it's available.
 */
declare const ATTR_SERVER_ADDRESS: "server.address";
/**
 * Server port number.
 *
 * @example 80
 * @example 8080
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
 * @note **MUST** be the same for all instances of horizontally scaled services. If the value was not specified, SDKs **MUST** fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value **MUST** be set to `unknown_service`.
 */
declare const ATTR_SERVICE_NAME: "service.name";
/**
 * The version string of the service API or implementation. The format is not defined by these conventions.
 *
 * @example 2.0.0
 * @example a01dbef8a
 */
declare const ATTR_SERVICE_VERSION: "service.version";
/**
 * SignalR HTTP connection closure status.
 *
 * @example app_shutdown
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
 * The identifier `opentelemetry` is reserved and **MUST NOT** be used in this case.
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
 * The [URI fragment](https://www.rfc-editor.org/rfc/rfc3986#section-3.5) component
 *
 * @example SemConv
 */
declare const ATTR_URL_FRAGMENT: "url.fragment";
/**
 * Absolute URL describing a network resource according to [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)
 *
 * @example https://www.foo.bar/search?q=OpenTelemetry#SemConv
 * @example //localhost
 *
 * @note For network calls, URL usually has `scheme://host[:port][path][?query][#fragment]` format, where the fragment
 * is not transmitted over HTTP, but if it is known, it **SHOULD** be included nevertheless.
 *
 * `url.full` **MUST NOT** contain credentials passed via URL in form of `https://username:password@www.example.com/`.
 * In such case username and password **SHOULD** be redacted and attribute's value **SHOULD** be `https://REDACTED:REDACTED@www.example.com/`.
 *
 * `url.full` **SHOULD** capture the absolute URL when it is available (or can be reconstructed).
 *
 * Sensitive content provided in `url.full` **SHOULD** be scrubbed when instrumentations can identify it.
 *
 *
 * Query string values for the following keys **SHOULD** be redacted by default and replaced by the
 * value `REDACTED`:
 *
 *   - [`AWSAccessKeyId`](https://docs.aws.amazon.com/AmazonS3/latest/userguide/RESTAuthentication.html#RESTAuthenticationQueryStringAuth)
 *   - [`Signature`](https://docs.aws.amazon.com/AmazonS3/latest/userguide/RESTAuthentication.html#RESTAuthenticationQueryStringAuth)
 *   - [`sig`](https://learn.microsoft.com/azure/storage/common/storage-sas-overview#sas-token)
 *   - [`X-Goog-Signature`](https://cloud.google.com/storage/docs/access-control/signed-urls)
 *
 * This list is subject to change over time.
 *
 * When a query string value is redacted, the query string key **SHOULD** still be preserved, e.g.
 * `https://www.example.com/path?color=blue&sig=REDACTED`.
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
 *
 *
 * Query string values for the following keys **SHOULD** be redacted by default and replaced by the value `REDACTED`:
 *
 *   - [`AWSAccessKeyId`](https://docs.aws.amazon.com/AmazonS3/latest/userguide/RESTAuthentication.html#RESTAuthenticationQueryStringAuth)
 *   - [`Signature`](https://docs.aws.amazon.com/AmazonS3/latest/userguide/RESTAuthentication.html#RESTAuthenticationQueryStringAuth)
 *   - [`sig`](https://learn.microsoft.com/azure/storage/common/storage-sas-overview#sas-token)
 *   - [`X-Goog-Signature`](https://cloud.google.com/storage/docs/access-control/signed-urls)
 *
 * This list is subject to change over time.
 *
 * When a query string value is redacted, the query string key **SHOULD** still be preserved, e.g.
 * `q=OpenTelemetry&sig=REDACTED`.
 */
declare const ATTR_URL_QUERY: "url.query";
/**
 * The [URI scheme](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) component identifying the used protocol.
 *
 * @example https
 * @example ftp
 * @example telnet
 */
declare const ATTR_URL_SCHEME: "url.scheme";
/**
 * Value of the [HTTP User-Agent](https://www.rfc-editor.org/rfc/rfc9110.html#field.user-agent) header sent by the client.
 *
 * @example CERN-LineMode/2.15 libwww/2.17b3
 * @example Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1
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
 *   - Rejected by global or endpoint rate limiting policies
 *   - Canceled while waiting for the lease.
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
 * The number of .NET assemblies that are currently loaded.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`AppDomain.CurrentDomain.GetAssemblies().Length`](https://learn.microsoft.com/dotnet/api/system.appdomain.getassemblies).
 */
declare const METRIC_DOTNET_ASSEMBLY_COUNT: "dotnet.assembly.count";
/**
 * The number of exceptions that have been thrown in managed code.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as counting calls to [`AppDomain.CurrentDomain.FirstChanceException`](https://learn.microsoft.com/dotnet/api/system.appdomain.firstchanceexception).
 */
declare const METRIC_DOTNET_EXCEPTIONS: "dotnet.exceptions";
/**
 * The number of garbage collections that have occurred since the process has started.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric uses the [`GC.CollectionCount(int generation)`](https://learn.microsoft.com/dotnet/api/system.gc.collectioncount) API to calculate exclusive collections per generation.
 */
declare const METRIC_DOTNET_GC_COLLECTIONS: "dotnet.gc.collections";
/**
 * The *approximate* number of bytes allocated on the managed GC heap since the process has started. The returned value does not include any native allocations.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`GC.GetTotalAllocatedBytes()`](https://learn.microsoft.com/dotnet/api/system.gc.gettotalallocatedbytes).
 */
declare const METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED: "dotnet.gc.heap.total_allocated";
/**
 * The heap fragmentation, as observed during the latest garbage collection.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`GC.GetGCMemoryInfo().GenerationInfo.FragmentationAfterBytes`](https://learn.microsoft.com/dotnet/api/system.gcgenerationinfo.fragmentationafterbytes).
 */
declare const METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE: "dotnet.gc.last_collection.heap.fragmentation.size";
/**
 * The managed GC heap size (including fragmentation), as observed during the latest garbage collection.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`GC.GetGCMemoryInfo().GenerationInfo.SizeAfterBytes`](https://learn.microsoft.com/dotnet/api/system.gcgenerationinfo.sizeafterbytes).
 */
declare const METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE: "dotnet.gc.last_collection.heap.size";
/**
 * The amount of committed virtual memory in use by the .NET GC, as observed during the latest garbage collection.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`GC.GetGCMemoryInfo().TotalCommittedBytes`](https://learn.microsoft.com/dotnet/api/system.gcmemoryinfo.totalcommittedbytes). Committed virtual memory may be larger than the heap size because it includes both memory for storing existing objects (the heap size) and some extra memory that is ready to handle newly allocated objects in the future.
 */
declare const METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE: "dotnet.gc.last_collection.memory.committed_size";
/**
 * The total amount of time paused in GC since the process has started.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`GC.GetTotalPauseDuration()`](https://learn.microsoft.com/dotnet/api/system.gc.gettotalpauseduration).
 */
declare const METRIC_DOTNET_GC_PAUSE_TIME: "dotnet.gc.pause.time";
/**
 * The amount of time the JIT compiler has spent compiling methods since the process has started.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`JitInfo.GetCompilationTime()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompilationtime).
 */
declare const METRIC_DOTNET_JIT_COMPILATION_TIME: "dotnet.jit.compilation.time";
/**
 * Count of bytes of intermediate language that have been compiled since the process has started.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`JitInfo.GetCompiledILBytes()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompiledilbytes).
 */
declare const METRIC_DOTNET_JIT_COMPILED_IL_SIZE: "dotnet.jit.compiled_il.size";
/**
 * The number of times the JIT compiler (re)compiled methods since the process has started.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`JitInfo.GetCompiledMethodCount()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompiledmethodcount).
 */
declare const METRIC_DOTNET_JIT_COMPILED_METHODS: "dotnet.jit.compiled_methods";
/**
 * The number of times there was contention when trying to acquire a monitor lock since the process has started.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`Monitor.LockContentionCount`](https://learn.microsoft.com/dotnet/api/system.threading.monitor.lockcontentioncount).
 */
declare const METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS: "dotnet.monitor.lock_contentions";
/**
 * The number of processors available to the process.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as accessing [`Environment.ProcessorCount`](https://learn.microsoft.com/dotnet/api/system.environment.processorcount).
 */
declare const METRIC_DOTNET_PROCESS_CPU_COUNT: "dotnet.process.cpu.count";
/**
 * CPU time used by the process.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as accessing the corresponding processor time properties on [`System.Diagnostics.Process`](https://learn.microsoft.com/dotnet/api/system.diagnostics.process).
 */
declare const METRIC_DOTNET_PROCESS_CPU_TIME: "dotnet.process.cpu.time";
/**
 * The number of bytes of physical memory mapped to the process context.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`Environment.WorkingSet`](https://learn.microsoft.com/dotnet/api/system.environment.workingset).
 */
declare const METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET: "dotnet.process.memory.working_set";
/**
 * The number of work items that are currently queued to be processed by the thread pool.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`ThreadPool.PendingWorkItemCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.pendingworkitemcount).
 */
declare const METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH: "dotnet.thread_pool.queue.length";
/**
 * The number of thread pool threads that currently exist.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`ThreadPool.ThreadCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.threadcount).
 */
declare const METRIC_DOTNET_THREAD_POOL_THREAD_COUNT: "dotnet.thread_pool.thread.count";
/**
 * The number of work items that the thread pool has completed since the process has started.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`ThreadPool.CompletedWorkItemCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.completedworkitemcount).
 */
declare const METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT: "dotnet.thread_pool.work_item.count";
/**
 * The number of timer instances that are currently active.
 *
 * @note Meter name: `System.Runtime`; Added in: .NET 9.0.
 * This metric reports the same values as calling [`Timer.ActiveCount`](https://learn.microsoft.com/dotnet/api/system.threading.timer.activecount).
 */
declare const METRIC_DOTNET_TIMER_COUNT: "dotnet.timer.count";
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

/**
 * Uniquely identifies the framework API revision offered by a version (`os.version`) of the android operating system. More information can be found [here](https://developer.android.com/guide/topics/manifest/uses-sdk-element#ApiLevels).
 *
 * @example 33
 * @example 32
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ANDROID_OS_API_LEVEL: "android.os.api_level";
/**
 * Deprecated use the `device.app.lifecycle` event definition including `android.state` as a payload field instead.
 *
 * @note The Android lifecycle states are defined in [Activity lifecycle callbacks](https://developer.android.com/guide/components/activities/activity-lifecycle#lc), and from which the `OS identifiers` are derived.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `device.app.lifecycle`.
 */
declare const ATTR_ANDROID_STATE: "android.state";
/**
* Enum value "background" for attribute {@link ATTR_ANDROID_STATE}.
*/
declare const ANDROID_STATE_VALUE_BACKGROUND: "background";
/**
* Enum value "created" for attribute {@link ATTR_ANDROID_STATE}.
*/
declare const ANDROID_STATE_VALUE_CREATED: "created";
/**
* Enum value "foreground" for attribute {@link ATTR_ANDROID_STATE}.
*/
declare const ANDROID_STATE_VALUE_FOREGROUND: "foreground";
/**
 * The provenance filename of the built attestation which directly relates to the build artifact filename. This filename **SHOULD** accompany the artifact at publish time. See the [SLSA Relationship](https://slsa.dev/spec/v1.0/distributing-provenance#relationship-between-artifacts-and-attestations) specification for more information.
 *
 * @example golang-binary-amd64-v0.1.0.attestation
 * @example docker-image-amd64-v0.1.0.intoto.json1
 * @example release-1.tar.gz.attestation
 * @example file-name-package.tar.gz.intoto.json1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ARTIFACT_ATTESTATION_FILENAME: "artifact.attestation.filename";
/**
 * The full [hash value (see glossary)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf), of the built attestation. Some envelopes in the [software attestation space](https://github.com/in-toto/attestation/tree/main/spec) also refer to this as the **digest**.
 *
 * @example 1b31dfcd5b7f9267bf2ff47651df1cfb9147b9e4df1f335accf65b4cda498408
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ARTIFACT_ATTESTATION_HASH: "artifact.attestation.hash";
/**
 * The id of the build [software attestation](https://slsa.dev/attestation-model).
 *
 * @example 123
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ARTIFACT_ATTESTATION_ID: "artifact.attestation.id";
/**
 * The human readable file name of the artifact, typically generated during build and release processes. Often includes the package name and version in the file name.
 *
 * @example golang-binary-amd64-v0.1.0
 * @example docker-image-amd64-v0.1.0
 * @example release-1.tar.gz
 * @example file-name-package.tar.gz
 *
 * @note This file name can also act as the [Package Name](https://slsa.dev/spec/v1.0/terminology#package-model)
 * in cases where the package ecosystem maps accordingly.
 * Additionally, the artifact [can be published](https://slsa.dev/spec/v1.0/terminology#software-supply-chain)
 * for others, but that is not a guarantee.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ARTIFACT_FILENAME: "artifact.filename";
/**
 * The full [hash value (see glossary)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf), often found in checksum.txt on a release of the artifact and used to verify package integrity.
 *
 * @example 9ff4c52759e2c4ac70b7d517bc7fcdc1cda631ca0045271ddd1b192544f8a3e9
 *
 * @note The specific algorithm used to create the cryptographic hash value is
 * not defined. In situations where an artifact has multiple
 * cryptographic hashes, it is up to the implementer to choose which
 * hash value to set here; this should be the most secure hash algorithm
 * that is suitable for the situation and consistent with the
 * corresponding attestation. The implementer can then provide the other
 * hash values through an additional set of attribute extensions as they
 * deem necessary.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ARTIFACT_HASH: "artifact.hash";
/**
 * The [Package URL](https://github.com/package-url/purl-spec) of the [package artifact](https://slsa.dev/spec/v1.0/terminology#package-model) provides a standard way to identify and locate the packaged artifact.
 *
 * @example pkg:github/package-url/purl-spec@1209109710924
 * @example pkg:npm/foo@12.12.3
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ARTIFACT_PURL: "artifact.purl";
/**
 * The version of the artifact.
 *
 * @example v0.1.0
 * @example 1.2.1
 * @example 122691-build
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ARTIFACT_VERSION: "artifact.version";
/**
 * The JSON-serialized value of each item in the `AttributeDefinitions` request field.
 *
 * @example ["{ "AttributeName": "string", "AttributeType": "string" }"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS: "aws.dynamodb.attribute_definitions";
/**
 * The value of the `AttributesToGet` request parameter.
 *
 * @example ["lives", "id"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_ATTRIBUTES_TO_GET: "aws.dynamodb.attributes_to_get";
/**
 * The value of the `ConsistentRead` request parameter.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_CONSISTENT_READ: "aws.dynamodb.consistent_read";
/**
 * The JSON-serialized value of each item in the `ConsumedCapacity` response field.
 *
 * @example ["{ "CapacityUnits": number, "GlobalSecondaryIndexes": { "string" : { "CapacityUnits": number, "ReadCapacityUnits": number, "WriteCapacityUnits": number } }, "LocalSecondaryIndexes": { "string" : { "CapacityUnits": number, "ReadCapacityUnits": number, "WriteCapacityUnits": number } }, "ReadCapacityUnits": number, "Table": { "CapacityUnits": number, "ReadCapacityUnits": number, "WriteCapacityUnits": number }, "TableName": "string", "WriteCapacityUnits": number }"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_CONSUMED_CAPACITY: "aws.dynamodb.consumed_capacity";
/**
 * The value of the `Count` response parameter.
 *
 * @example 10
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_COUNT: "aws.dynamodb.count";
/**
 * The value of the `ExclusiveStartTableName` request parameter.
 *
 * @example Users
 * @example CatsTable
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_EXCLUSIVE_START_TABLE: "aws.dynamodb.exclusive_start_table";
/**
 * The JSON-serialized value of each item in the `GlobalSecondaryIndexUpdates` request field.
 *
 * @example ["{ "Create": { "IndexName": "string", "KeySchema": [ { "AttributeName": "string", "KeyType": "string" } ], "Projection": { "NonKeyAttributes": [ "string" ], "ProjectionType": "string" }, "ProvisionedThroughput": { "ReadCapacityUnits": number, "WriteCapacityUnits": number } }"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES: "aws.dynamodb.global_secondary_index_updates";
/**
 * The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field
 *
 * @example ["{ "IndexName": "string", "KeySchema": [ { "AttributeName": "string", "KeyType": "string" } ], "Projection": { "NonKeyAttributes": [ "string" ], "ProjectionType": "string" }, "ProvisionedThroughput": { "ReadCapacityUnits": number, "WriteCapacityUnits": number } }"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES: "aws.dynamodb.global_secondary_indexes";
/**
 * The value of the `IndexName` request parameter.
 *
 * @example name_to_group
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_INDEX_NAME: "aws.dynamodb.index_name";
/**
 * The JSON-serialized value of the `ItemCollectionMetrics` response field.
 *
 * @example { "string" : [ { "ItemCollectionKey": { "string" : { "B": blob, "BOOL": boolean, "BS": [ blob ], "L": [ "AttributeValue" ], "M": { "string" : "AttributeValue" }, "N": "string", "NS": [ "string" ], "NULL": boolean, "S": "string", "SS": [ "string" ] } }, "SizeEstimateRangeGB": [ number ] } ] }
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_ITEM_COLLECTION_METRICS: "aws.dynamodb.item_collection_metrics";
/**
 * The value of the `Limit` request parameter.
 *
 * @example 10
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_LIMIT: "aws.dynamodb.limit";
/**
 * The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
 *
 * @example ["{ "IndexArn": "string", "IndexName": "string", "IndexSizeBytes": number, "ItemCount": number, "KeySchema": [ { "AttributeName": "string", "KeyType": "string" } ], "Projection": { "NonKeyAttributes": [ "string" ], "ProjectionType": "string" } }"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES: "aws.dynamodb.local_secondary_indexes";
/**
 * The value of the `ProjectionExpression` request parameter.
 *
 * @example Title
 * @example Title, Price, Color
 * @example Title, Description, RelatedItems, ProductReviews
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_PROJECTION: "aws.dynamodb.projection";
/**
 * The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
 *
 * @example 1.0
 * @example 2.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY: "aws.dynamodb.provisioned_read_capacity";
/**
 * The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
 *
 * @example 1.0
 * @example 2.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY: "aws.dynamodb.provisioned_write_capacity";
/**
 * The value of the `ScanIndexForward` request parameter.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_SCAN_FORWARD: "aws.dynamodb.scan_forward";
/**
 * The value of the `ScannedCount` response parameter.
 *
 * @example 50
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_SCANNED_COUNT: "aws.dynamodb.scanned_count";
/**
 * The value of the `Segment` request parameter.
 *
 * @example 10
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_SEGMENT: "aws.dynamodb.segment";
/**
 * The value of the `Select` request parameter.
 *
 * @example ALL_ATTRIBUTES
 * @example COUNT
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_SELECT: "aws.dynamodb.select";
/**
 * The number of items in the `TableNames` response parameter.
 *
 * @example 20
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_TABLE_COUNT: "aws.dynamodb.table_count";
/**
 * The keys in the `RequestItems` object field.
 *
 * @example ["Users", "Cats"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_TABLE_NAMES: "aws.dynamodb.table_names";
/**
 * The value of the `TotalSegments` request parameter.
 *
 * @example 100
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_DYNAMODB_TOTAL_SEGMENTS: "aws.dynamodb.total_segments";
/**
 * The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
 *
 * @example arn:aws:ecs:us-west-2:123456789123:cluster/my-cluster
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_ECS_CLUSTER_ARN: "aws.ecs.cluster.arn";
/**
 * The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
 *
 * @example arn:aws:ecs:us-west-1:123456789123:container/32624152-9086-4f0e-acae-1a75b14fe4d9
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_ECS_CONTAINER_ARN: "aws.ecs.container.arn";
/**
 * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_ECS_LAUNCHTYPE: "aws.ecs.launchtype";
/**
* Enum value "ec2" for attribute {@link ATTR_AWS_ECS_LAUNCHTYPE}.
*/
declare const AWS_ECS_LAUNCHTYPE_VALUE_EC2: "ec2";
/**
* Enum value "fargate" for attribute {@link ATTR_AWS_ECS_LAUNCHTYPE}.
*/
declare const AWS_ECS_LAUNCHTYPE_VALUE_FARGATE: "fargate";
/**
 * The ARN of a running [ECS task](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-ids).
 *
 * @example arn:aws:ecs:us-west-1:123456789123:task/10838bed-421f-43ef-870a-f43feacbbb5b
 * @example arn:aws:ecs:us-west-1:123456789123:task/my-cluster/task-id/23ebb8ac-c18f-46c6-8bbe-d55d0e37cfbd
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_ECS_TASK_ARN: "aws.ecs.task.arn";
/**
 * The family name of the [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) used to create the ECS task.
 *
 * @example opentelemetry-family
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_ECS_TASK_FAMILY: "aws.ecs.task.family";
/**
 * The ID of a running ECS task. The ID **MUST** be extracted from `task.arn`.
 *
 * @example 10838bed-421f-43ef-870a-f43feacbbb5b
 * @example 23ebb8ac-c18f-46c6-8bbe-d55d0e37cfbd
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_ECS_TASK_ID: "aws.ecs.task.id";
/**
 * The revision for the task definition used to create the ECS task.
 *
 * @example 8
 * @example 26
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_ECS_TASK_REVISION: "aws.ecs.task.revision";
/**
 * The ARN of an EKS cluster.
 *
 * @example arn:aws:ecs:us-west-2:123456789123:cluster/my-cluster
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_EKS_CLUSTER_ARN: "aws.eks.cluster.arn";
/**
 * The AWS extended request ID as returned in the response header `x-amz-id-2`.
 *
 * @example wzHcyEWfmOGDIE5QOhTAqFDoDWP3y8IUvpNINCwL9N4TEHbUw0/gZJ+VZTmCNCWR7fezEN3eCiQ=
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_EXTENDED_REQUEST_ID: "aws.extended_request_id";
/**
 * The full invoked ARN as provided on the `Context` passed to the function (`Lambda-Runtime-Invoked-Function-Arn` header on the `/runtime/invocation/next` applicable).
 *
 * @example arn:aws:lambda:us-east-1:123456:function:myfunction:myalias
 *
 * @note This may be different from `cloud.resource_id` if an alias is involved.
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_LAMBDA_INVOKED_ARN: "aws.lambda.invoked_arn";
/**
 * The Amazon Resource Name(s) (ARN) of the AWS log group(s).
 *
 * @example ["arn:aws:logs:us-west-1:123456789012:log-group:/aws/my/group:*"]
 *
 * @note See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_LOG_GROUP_ARNS: "aws.log.group.arns";
/**
 * The name(s) of the AWS log group(s) an application is writing to.
 *
 * @example ["/aws/lambda/my-function", "opentelemetry-service"]
 *
 * @note Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_LOG_GROUP_NAMES: "aws.log.group.names";
/**
 * The ARN(s) of the AWS log stream(s).
 *
 * @example ["arn:aws:logs:us-west-1:123456789012:log-group:/aws/my/group:log-stream:logs/main/10838bed-421f-43ef-870a-f43feacbbb5b"]
 *
 * @note See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_LOG_STREAM_ARNS: "aws.log.stream.arns";
/**
 * The name(s) of the AWS log stream(s) an application is writing to.
 *
 * @example ["logs/main/10838bed-421f-43ef-870a-f43feacbbb5b"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_LOG_STREAM_NAMES: "aws.log.stream.names";
/**
 * The AWS request ID as returned in the response headers `x-amzn-requestid`, `x-amzn-request-id` or `x-amz-request-id`.
 *
 * @example 79b9da39-b7ae-508a-a6bc-864b2829c622
 * @example C9ER4AJX75574TDJ
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_REQUEST_ID: "aws.request_id";
/**
 * The S3 bucket name the request refers to. Corresponds to the `--bucket` parameter of the [S3 API](https://docs.aws.amazon.com/cli/latest/reference/s3api/index.html) operations.
 *
 * @example some-bucket-name
 *
 * @note The `bucket` attribute is applicable to all S3 operations that reference a bucket, i.e. that require the bucket name as a mandatory parameter.
 * This applies to almost all S3 operations except `list-buckets`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_S3_BUCKET: "aws.s3.bucket";
/**
 * The source object (in the form `bucket`/`key`) for the copy operation.
 *
 * @example someFile.yml
 *
 * @note The `copy_source` attribute applies to S3 copy operations and corresponds to the `--copy-source` parameter
 * of the [copy-object operation within the S3 API](https://docs.aws.amazon.com/cli/latest/reference/s3api/copy-object.html).
 * This applies in particular to the following operations:
 *
 *   - [copy-object](https://docs.aws.amazon.com/cli/latest/reference/s3api/copy-object.html)
 *   - [upload-part-copy](https://docs.aws.amazon.com/cli/latest/reference/s3api/upload-part-copy.html)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_S3_COPY_SOURCE: "aws.s3.copy_source";
/**
 * The delete request container that specifies the objects to be deleted.
 *
 * @example Objects=[{Key=string,VersionId=string},{Key=string,VersionId=string}],Quiet=boolean
 *
 * @note The `delete` attribute is only applicable to the [delete-object](https://docs.aws.amazon.com/cli/latest/reference/s3api/delete-object.html) operation.
 * The `delete` attribute corresponds to the `--delete` parameter of the
 * [delete-objects operation within the S3 API](https://docs.aws.amazon.com/cli/latest/reference/s3api/delete-objects.html).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_S3_DELETE: "aws.s3.delete";
/**
 * The S3 object key the request refers to. Corresponds to the `--key` parameter of the [S3 API](https://docs.aws.amazon.com/cli/latest/reference/s3api/index.html) operations.
 *
 * @example someFile.yml
 *
 * @note The `key` attribute is applicable to all object-related S3 operations, i.e. that require the object key as a mandatory parameter.
 * This applies in particular to the following operations:
 *
 *   - [copy-object](https://docs.aws.amazon.com/cli/latest/reference/s3api/copy-object.html)
 *   - [delete-object](https://docs.aws.amazon.com/cli/latest/reference/s3api/delete-object.html)
 *   - [get-object](https://docs.aws.amazon.com/cli/latest/reference/s3api/get-object.html)
 *   - [head-object](https://docs.aws.amazon.com/cli/latest/reference/s3api/head-object.html)
 *   - [put-object](https://docs.aws.amazon.com/cli/latest/reference/s3api/put-object.html)
 *   - [restore-object](https://docs.aws.amazon.com/cli/latest/reference/s3api/restore-object.html)
 *   - [select-object-content](https://docs.aws.amazon.com/cli/latest/reference/s3api/select-object-content.html)
 *   - [abort-multipart-upload](https://docs.aws.amazon.com/cli/latest/reference/s3api/abort-multipart-upload.html)
 *   - [complete-multipart-upload](https://docs.aws.amazon.com/cli/latest/reference/s3api/complete-multipart-upload.html)
 *   - [create-multipart-upload](https://docs.aws.amazon.com/cli/latest/reference/s3api/create-multipart-upload.html)
 *   - [list-parts](https://docs.aws.amazon.com/cli/latest/reference/s3api/list-parts.html)
 *   - [upload-part](https://docs.aws.amazon.com/cli/latest/reference/s3api/upload-part.html)
 *   - [upload-part-copy](https://docs.aws.amazon.com/cli/latest/reference/s3api/upload-part-copy.html)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_S3_KEY: "aws.s3.key";
/**
 * The part number of the part being uploaded in a multipart-upload operation. This is a positive integer between 1 and 10,000.
 *
 * @example 3456
 *
 * @note The `part_number` attribute is only applicable to the [upload-part](https://docs.aws.amazon.com/cli/latest/reference/s3api/upload-part.html)
 * and [upload-part-copy](https://docs.aws.amazon.com/cli/latest/reference/s3api/upload-part-copy.html) operations.
 * The `part_number` attribute corresponds to the `--part-number` parameter of the
 * [upload-part operation within the S3 API](https://docs.aws.amazon.com/cli/latest/reference/s3api/upload-part.html).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_S3_PART_NUMBER: "aws.s3.part_number";
/**
 * Upload ID that identifies the multipart upload.
 *
 * @example dfRtDYWFbkRONycy.Yxwh66Yjlx.cph0gtNBtJ
 *
 * @note The `upload_id` attribute applies to S3 multipart-upload operations and corresponds to the `--upload-id` parameter
 * of the [S3 API](https://docs.aws.amazon.com/cli/latest/reference/s3api/index.html) multipart operations.
 * This applies in particular to the following operations:
 *
 *   - [abort-multipart-upload](https://docs.aws.amazon.com/cli/latest/reference/s3api/abort-multipart-upload.html)
 *   - [complete-multipart-upload](https://docs.aws.amazon.com/cli/latest/reference/s3api/complete-multipart-upload.html)
 *   - [list-parts](https://docs.aws.amazon.com/cli/latest/reference/s3api/list-parts.html)
 *   - [upload-part](https://docs.aws.amazon.com/cli/latest/reference/s3api/upload-part.html)
 *   - [upload-part-copy](https://docs.aws.amazon.com/cli/latest/reference/s3api/upload-part-copy.html)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AWS_S3_UPLOAD_ID: "aws.s3.upload_id";
/**
 * [Azure Resource Provider Namespace](https://learn.microsoft.com/azure/azure-resource-manager/management/azure-services-resource-providers) as recognized by the client.
 *
 * @example Microsoft.Storage
 * @example Microsoft.KeyVault
 * @example Microsoft.ServiceBus
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZ_NAMESPACE: "az.namespace";
/**
 * The unique identifier of the service request. It's generated by the Azure service and returned with the response.
 *
 * @example 00000000-0000-0000-0000-000000000000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZ_SERVICE_REQUEST_ID: "az.service_request_id";
/**
 * The unique identifier of the client instance.
 *
 * @example 3ba4827d-4422-483f-b59f-85b74211c11d
 * @example storage-client-1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZURE_CLIENT_ID: "azure.client.id";
/**
 * Cosmos client connection mode.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZURE_COSMOSDB_CONNECTION_MODE: "azure.cosmosdb.connection.mode";
/**
* Enum value "direct" for attribute {@link ATTR_AZURE_COSMOSDB_CONNECTION_MODE}.
*/
declare const AZURE_COSMOSDB_CONNECTION_MODE_VALUE_DIRECT: "direct";
/**
* Enum value "gateway" for attribute {@link ATTR_AZURE_COSMOSDB_CONNECTION_MODE}.
*/
declare const AZURE_COSMOSDB_CONNECTION_MODE_VALUE_GATEWAY: "gateway";
/**
 * Account or request [consistency level](https://learn.microsoft.com/azure/cosmos-db/consistency-levels).
 *
 * @example Eventual
 * @example ConsistentPrefix
 * @example BoundedStaleness
 * @example Strong
 * @example Session
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL: "azure.cosmosdb.consistency.level";
/**
* Enum value "BoundedStaleness" for attribute {@link ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_BOUNDED_STALENESS: "BoundedStaleness";
/**
* Enum value "ConsistentPrefix" for attribute {@link ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_CONSISTENT_PREFIX: "ConsistentPrefix";
/**
* Enum value "Eventual" for attribute {@link ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_EVENTUAL: "Eventual";
/**
* Enum value "Session" for attribute {@link ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_SESSION: "Session";
/**
* Enum value "Strong" for attribute {@link ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_STRONG: "Strong";
/**
 * List of regions contacted during operation in the order that they were contacted. If there is more than one region listed, it indicates that the operation was performed on multiple regions i.e. cross-regional call.
 *
 * @example ["North Central US", "Australia East", "Australia Southeast"]
 *
 * @note Region name matches the format of `displayName` in [Azure Location API](https://learn.microsoft.com/rest/api/subscription/subscriptions/list-locations?view=rest-subscription-2021-10-01&tabs=HTTP#location)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZURE_COSMOSDB_OPERATION_CONTACTED_REGIONS: "azure.cosmosdb.operation.contacted_regions";
/**
 * The number of request units consumed by the operation.
 *
 * @example 46.18
 * @example 1.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZURE_COSMOSDB_OPERATION_REQUEST_CHARGE: "azure.cosmosdb.operation.request_charge";
/**
 * Request payload size in bytes.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZURE_COSMOSDB_REQUEST_BODY_SIZE: "azure.cosmosdb.request.body.size";
/**
 * Cosmos DB sub status code.
 *
 * @example 1000
 * @example 1002
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_AZURE_COSMOSDB_RESPONSE_SUB_STATUS_CODE: "azure.cosmosdb.response.sub_status_code";
/**
 * Array of brand name and version separated by a space
 *
 * @example [" Not A;Brand 99", "Chromium 99", "Chrome 99"]
 *
 * @note This value is intended to be taken from the [UA client hints API](https://wicg.github.io/ua-client-hints/#interface) (`navigator.userAgentData.brands`).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_BROWSER_BRANDS: "browser.brands";
/**
 * Preferred language of the user using the browser
 *
 * @example en
 * @example en-US
 * @example fr
 * @example fr-FR
 *
 * @note This value is intended to be taken from the Navigator API `navigator.language`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_BROWSER_LANGUAGE: "browser.language";
/**
 * A boolean that is true if the browser is running on a mobile device
 *
 * @note This value is intended to be taken from the [UA client hints API](https://wicg.github.io/ua-client-hints/#interface) (`navigator.userAgentData.mobile`). If unavailable, this attribute **SHOULD** be left unset.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_BROWSER_MOBILE: "browser.mobile";
/**
 * The platform on which the browser is running
 *
 * @example Windows
 * @example macOS
 * @example Android
 *
 * @note This value is intended to be taken from the [UA client hints API](https://wicg.github.io/ua-client-hints/#interface) (`navigator.userAgentData.platform`). If unavailable, the legacy `navigator.platform` API **SHOULD NOT** be used instead and this attribute **SHOULD** be left unset in order for the values to be consistent.
 * The list of possible values is defined in the [W3C User-Agent Client Hints specification](https://wicg.github.io/ua-client-hints/#sec-ch-ua-platform). Note that some (but not all) of these values can overlap with values in the [`os.type` and `os.name` attributes](./os.md). However, for consistency, the values in the `browser.platform` attribute should capture the exact value that the user agent provides.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_BROWSER_PLATFORM: "browser.platform";
/**
 * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CASSANDRA_CONSISTENCY_LEVEL: "cassandra.consistency.level";
/**
* Enum value "all" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL: "all";
/**
* Enum value "any" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY: "any";
/**
* Enum value "each_quorum" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM: "each_quorum";
/**
* Enum value "local_one" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE: "local_one";
/**
* Enum value "local_quorum" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM: "local_quorum";
/**
* Enum value "local_serial" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL: "local_serial";
/**
* Enum value "one" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE: "one";
/**
* Enum value "quorum" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM: "quorum";
/**
* Enum value "serial" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL: "serial";
/**
* Enum value "three" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE: "three";
/**
* Enum value "two" for attribute {@link ATTR_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO: "two";
/**
 * The data center of the coordinating node for a query.
 *
 * @example "us-west-2"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CASSANDRA_COORDINATOR_DC: "cassandra.coordinator.dc";
/**
 * The ID of the coordinating node for a query.
 *
 * @example "be13faa2-8574-4d71-926d-27f16cf8a7af"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CASSANDRA_COORDINATOR_ID: "cassandra.coordinator.id";
/**
 * The fetch size used for paging, i.e. how many rows will be returned at once.
 *
 * @example 5000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CASSANDRA_PAGE_SIZE: "cassandra.page.size";
/**
 * Whether or not the query is idempotent.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CASSANDRA_QUERY_IDEMPOTENT: "cassandra.query.idempotent";
/**
 * The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
 *
 * @example 0
 * @example 2
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CASSANDRA_SPECULATIVE_EXECUTION_COUNT: "cassandra.speculative_execution.count";
/**
 * The human readable name of the pipeline within a CI/CD system.
 *
 * @example Build and Test
 * @example Lint
 * @example Deploy Go Project
 * @example deploy_to_environment
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_PIPELINE_NAME: "cicd.pipeline.name";
/**
 * The result of a pipeline run.
 *
 * @example success
 * @example failure
 * @example timeout
 * @example skipped
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_PIPELINE_RESULT: "cicd.pipeline.result";
/**
* Enum value "cancellation" for attribute {@link ATTR_CICD_PIPELINE_RESULT}.
*/
declare const CICD_PIPELINE_RESULT_VALUE_CANCELLATION: "cancellation";
/**
* Enum value "error" for attribute {@link ATTR_CICD_PIPELINE_RESULT}.
*/
declare const CICD_PIPELINE_RESULT_VALUE_ERROR: "error";
/**
* Enum value "failure" for attribute {@link ATTR_CICD_PIPELINE_RESULT}.
*/
declare const CICD_PIPELINE_RESULT_VALUE_FAILURE: "failure";
/**
* Enum value "skip" for attribute {@link ATTR_CICD_PIPELINE_RESULT}.
*/
declare const CICD_PIPELINE_RESULT_VALUE_SKIP: "skip";
/**
* Enum value "success" for attribute {@link ATTR_CICD_PIPELINE_RESULT}.
*/
declare const CICD_PIPELINE_RESULT_VALUE_SUCCESS: "success";
/**
* Enum value "timeout" for attribute {@link ATTR_CICD_PIPELINE_RESULT}.
*/
declare const CICD_PIPELINE_RESULT_VALUE_TIMEOUT: "timeout";
/**
 * The unique identifier of a pipeline run within a CI/CD system.
 *
 * @example 120912
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_PIPELINE_RUN_ID: "cicd.pipeline.run.id";
/**
 * The pipeline run goes through these states during its lifecycle.
 *
 * @example pending
 * @example executing
 * @example finalizing
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_PIPELINE_RUN_STATE: "cicd.pipeline.run.state";
/**
* Enum value "executing" for attribute {@link ATTR_CICD_PIPELINE_RUN_STATE}.
*/
declare const CICD_PIPELINE_RUN_STATE_VALUE_EXECUTING: "executing";
/**
* Enum value "finalizing" for attribute {@link ATTR_CICD_PIPELINE_RUN_STATE}.
*/
declare const CICD_PIPELINE_RUN_STATE_VALUE_FINALIZING: "finalizing";
/**
* Enum value "pending" for attribute {@link ATTR_CICD_PIPELINE_RUN_STATE}.
*/
declare const CICD_PIPELINE_RUN_STATE_VALUE_PENDING: "pending";
/**
 * The human readable name of a task within a pipeline. Task here most closely aligns with a [computing process](https://wikipedia.org/wiki/Pipeline_(computing)) in a pipeline. Other terms for tasks include commands, steps, and procedures.
 *
 * @example Run GoLang Linter
 * @example Go Build
 * @example go-test
 * @example deploy_binary
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_PIPELINE_TASK_NAME: "cicd.pipeline.task.name";
/**
 * The unique identifier of a task run within a pipeline.
 *
 * @example 12097
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_PIPELINE_TASK_RUN_ID: "cicd.pipeline.task.run.id";
/**
 * The [URL](https://wikipedia.org/wiki/URL) of the pipeline run providing the complete address in order to locate and identify the pipeline run.
 *
 * @example https://github.com/open-telemetry/semantic-conventions/actions/runs/9753949763/job/26920038674?pr=1075
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_PIPELINE_TASK_RUN_URL_FULL: "cicd.pipeline.task.run.url.full";
/**
 * The type of the task within a pipeline.
 *
 * @example build
 * @example test
 * @example deploy
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_PIPELINE_TASK_TYPE: "cicd.pipeline.task.type";
/**
* Enum value "build" for attribute {@link ATTR_CICD_PIPELINE_TASK_TYPE}.
*/
declare const CICD_PIPELINE_TASK_TYPE_VALUE_BUILD: "build";
/**
* Enum value "deploy" for attribute {@link ATTR_CICD_PIPELINE_TASK_TYPE}.
*/
declare const CICD_PIPELINE_TASK_TYPE_VALUE_DEPLOY: "deploy";
/**
* Enum value "test" for attribute {@link ATTR_CICD_PIPELINE_TASK_TYPE}.
*/
declare const CICD_PIPELINE_TASK_TYPE_VALUE_TEST: "test";
/**
 * The name of a component of the CICD system.
 *
 * @example controller
 * @example scheduler
 * @example agent
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_SYSTEM_COMPONENT: "cicd.system.component";
/**
 * The state of a CICD worker / agent.
 *
 * @example idle
 * @example busy
 * @example down
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CICD_WORKER_STATE: "cicd.worker.state";
/**
* Enum value "available" for attribute {@link ATTR_CICD_WORKER_STATE}.
*/
declare const CICD_WORKER_STATE_VALUE_AVAILABLE: "available";
/**
* Enum value "busy" for attribute {@link ATTR_CICD_WORKER_STATE}.
*/
declare const CICD_WORKER_STATE_VALUE_BUSY: "busy";
/**
* Enum value "offline" for attribute {@link ATTR_CICD_WORKER_STATE}.
*/
declare const CICD_WORKER_STATE_VALUE_OFFLINE: "offline";
/**
 * The cloud account ID the resource is assigned to.
 *
 * @example 111111111111
 * @example opentelemetry
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUD_ACCOUNT_ID: "cloud.account.id";
/**
 * Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
 *
 * @example us-east-1c
 *
 * @note Availability zones are called "zones" on Alibaba Cloud and Google Cloud.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUD_AVAILABILITY_ZONE: "cloud.availability_zone";
/**
 * The cloud platform in use.
 *
 * @note The prefix of the service **SHOULD** match the one specified in `cloud.provider`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUD_PLATFORM: "cloud.platform";
/**
* Enum value "alibaba_cloud_ecs" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_ECS: "alibaba_cloud_ecs";
/**
* Enum value "alibaba_cloud_fc" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_FC: "alibaba_cloud_fc";
/**
* Enum value "alibaba_cloud_openshift" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_OPENSHIFT: "alibaba_cloud_openshift";
/**
* Enum value "aws_app_runner" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AWS_APP_RUNNER: "aws_app_runner";
/**
* Enum value "aws_ec2" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AWS_EC2: "aws_ec2";
/**
* Enum value "aws_ecs" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AWS_ECS: "aws_ecs";
/**
* Enum value "aws_eks" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AWS_EKS: "aws_eks";
/**
* Enum value "aws_elastic_beanstalk" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AWS_ELASTIC_BEANSTALK: "aws_elastic_beanstalk";
/**
* Enum value "aws_lambda" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AWS_LAMBDA: "aws_lambda";
/**
* Enum value "aws_openshift" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AWS_OPENSHIFT: "aws_openshift";
/**
* Enum value "azure_aks" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AZURE_AKS: "azure_aks";
/**
* Enum value "azure_app_service" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AZURE_APP_SERVICE: "azure_app_service";
/**
* Enum value "azure_container_apps" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_APPS: "azure_container_apps";
/**
* Enum value "azure_container_instances" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_INSTANCES: "azure_container_instances";
/**
* Enum value "azure_functions" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AZURE_FUNCTIONS: "azure_functions";
/**
* Enum value "azure_openshift" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AZURE_OPENSHIFT: "azure_openshift";
/**
* Enum value "azure_vm" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_AZURE_VM: "azure_vm";
/**
* Enum value "gcp_app_engine" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_GCP_APP_ENGINE: "gcp_app_engine";
/**
* Enum value "gcp_bare_metal_solution" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_GCP_BARE_METAL_SOLUTION: "gcp_bare_metal_solution";
/**
* Enum value "gcp_cloud_functions" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_GCP_CLOUD_FUNCTIONS: "gcp_cloud_functions";
/**
* Enum value "gcp_cloud_run" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_GCP_CLOUD_RUN: "gcp_cloud_run";
/**
* Enum value "gcp_compute_engine" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_GCP_COMPUTE_ENGINE: "gcp_compute_engine";
/**
* Enum value "gcp_kubernetes_engine" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_GCP_KUBERNETES_ENGINE: "gcp_kubernetes_engine";
/**
* Enum value "gcp_openshift" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_GCP_OPENSHIFT: "gcp_openshift";
/**
* Enum value "ibm_cloud_openshift" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_IBM_CLOUD_OPENSHIFT: "ibm_cloud_openshift";
/**
* Enum value "oracle_cloud_compute" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_ORACLE_CLOUD_COMPUTE: "oracle_cloud_compute";
/**
* Enum value "oracle_cloud_oke" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_ORACLE_CLOUD_OKE: "oracle_cloud_oke";
/**
* Enum value "tencent_cloud_cvm" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_CVM: "tencent_cloud_cvm";
/**
* Enum value "tencent_cloud_eks" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_EKS: "tencent_cloud_eks";
/**
* Enum value "tencent_cloud_scf" for attribute {@link ATTR_CLOUD_PLATFORM}.
*/
declare const CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_SCF: "tencent_cloud_scf";
/**
 * Name of the cloud provider.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUD_PROVIDER: "cloud.provider";
/**
* Enum value "alibaba_cloud" for attribute {@link ATTR_CLOUD_PROVIDER}.
*/
declare const CLOUD_PROVIDER_VALUE_ALIBABA_CLOUD: "alibaba_cloud";
/**
* Enum value "aws" for attribute {@link ATTR_CLOUD_PROVIDER}.
*/
declare const CLOUD_PROVIDER_VALUE_AWS: "aws";
/**
* Enum value "azure" for attribute {@link ATTR_CLOUD_PROVIDER}.
*/
declare const CLOUD_PROVIDER_VALUE_AZURE: "azure";
/**
* Enum value "gcp" for attribute {@link ATTR_CLOUD_PROVIDER}.
*/
declare const CLOUD_PROVIDER_VALUE_GCP: "gcp";
/**
* Enum value "heroku" for attribute {@link ATTR_CLOUD_PROVIDER}.
*/
declare const CLOUD_PROVIDER_VALUE_HEROKU: "heroku";
/**
* Enum value "ibm_cloud" for attribute {@link ATTR_CLOUD_PROVIDER}.
*/
declare const CLOUD_PROVIDER_VALUE_IBM_CLOUD: "ibm_cloud";
/**
* Enum value "oracle_cloud" for attribute {@link ATTR_CLOUD_PROVIDER}.
*/
declare const CLOUD_PROVIDER_VALUE_ORACLE_CLOUD: "oracle_cloud";
/**
* Enum value "tencent_cloud" for attribute {@link ATTR_CLOUD_PROVIDER}.
*/
declare const CLOUD_PROVIDER_VALUE_TENCENT_CLOUD: "tencent_cloud";
/**
 * The geographical region the resource is running.
 *
 * @example us-central1
 * @example us-east-1
 *
 * @note Refer to your provider's docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/global-infrastructure/geographies/), [Google Cloud regions](https://cloud.google.com/about/locations), or [Tencent Cloud regions](https://www.tencentcloud.com/document/product/213/6091).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUD_REGION: "cloud.region";
/**
 * Cloud provider-specific native identifier of the monitored cloud resource (e.g. an [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) on AWS, a [fully qualified resource ID](https://learn.microsoft.com/rest/api/resources/resources/get-by-id) on Azure, a [full resource name](https://cloud.google.com/apis/design/resource_names#full_resource_name) on GCP)
 *
 * @example arn:aws:lambda:REGION:ACCOUNT_ID:function:my-function
 * @example //run.googleapis.com/projects/PROJECT_ID/locations/LOCATION_ID/services/SERVICE_ID
 * @example /subscriptions/<SUBSCRIPTION_GUID>/resourceGroups/<RG>/providers/Microsoft.Web/sites/<FUNCAPP>/functions/<FUNC>
 *
 * @note On some cloud providers, it may not be possible to determine the full ID at startup,
 * so it may be necessary to set `cloud.resource_id` as a span attribute instead.
 *
 * The exact value to use for `cloud.resource_id` depends on the cloud provider.
 * The following well-known definitions **MUST** be used if you set this attribute and they apply:
 *
 *   - **AWS Lambda:** The function [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html).
 *     Take care not to use the "invoked ARN" directly but replace any
 *     [alias suffix](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html)
 *     with the resolved function version, as the same runtime instance may be invocable with
 *     multiple different aliases.
 *   - **GCP:** The [URI of the resource](https://cloud.google.com/iam/docs/full-resource-names)
 *   - **Azure:** The [Fully Qualified Resource ID](https://docs.microsoft.com/rest/api/resources/resources/get-by-id) of the invoked function,
 *     *not* the function app, having the form
 *     `/subscriptions/<SUBSCRIPTION_GUID>/resourceGroups/<RG>/providers/Microsoft.Web/sites/<FUNCAPP>/functions/<FUNC>`.
 *     This means that a span attribute **MUST** be used, as an Azure function app can host multiple functions that would usually share
 *     a TracerProvider.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUD_RESOURCE_ID: "cloud.resource_id";
/**
 * The [event_id](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#id) uniquely identifies the event.
 *
 * @example 123e4567-e89b-12d3-a456-426614174000
 * @example 0001
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDEVENTS_EVENT_ID: "cloudevents.event_id";
/**
 * The [source](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#source-1) identifies the context in which an event happened.
 *
 * @example https://github.com/cloudevents
 * @example /cloudevents/spec/pull/123
 * @example my-service
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDEVENTS_EVENT_SOURCE: "cloudevents.event_source";
/**
 * The [version of the CloudEvents specification](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#specversion) which the event uses.
 *
 * @example "1.0"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDEVENTS_EVENT_SPEC_VERSION: "cloudevents.event_spec_version";
/**
 * The [subject](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#subject) of the event in the context of the event producer (identified by source).
 *
 * @example "mynewfile.jpg"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDEVENTS_EVENT_SUBJECT: "cloudevents.event_subject";
/**
 * The [event_type](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#type) contains a value describing the type of event related to the originating occurrence.
 *
 * @example com.github.pull_request.opened
 * @example com.example.object.deleted.v2
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDEVENTS_EVENT_TYPE: "cloudevents.event_type";
/**
 * The guid of the application.
 *
 * @example 218fc5a9-a5f1-4b54-aa05-46717d0ab26d
 *
 * @note Application instrumentation should use the value from environment
 * variable `VCAP_APPLICATION.application_id`. This is the same value as
 * reported by `cf app <app-name> --guid`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_APP_ID: "cloudfoundry.app.id";
/**
 * The index of the application instance. 0 when just one instance is active.
 *
 * @example 0
 * @example 1
 *
 * @note CloudFoundry defines the `instance_id` in the [Loggregator v2 envelope](https://github.com/cloudfoundry/loggregator-api#v2-envelope).
 * It is used for logs and metrics emitted by CloudFoundry. It is
 * supposed to contain the application instance index for applications
 * deployed on the runtime.
 *
 * Application instrumentation should use the value from environment
 * variable `CF_INSTANCE_INDEX`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_APP_INSTANCE_ID: "cloudfoundry.app.instance.id";
/**
 * The name of the application.
 *
 * @example my-app-name
 *
 * @note Application instrumentation should use the value from environment
 * variable `VCAP_APPLICATION.application_name`. This is the same value
 * as reported by `cf apps`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_APP_NAME: "cloudfoundry.app.name";
/**
 * The guid of the CloudFoundry org the application is running in.
 *
 * @example 218fc5a9-a5f1-4b54-aa05-46717d0ab26d
 *
 * @note Application instrumentation should use the value from environment
 * variable `VCAP_APPLICATION.org_id`. This is the same value as
 * reported by `cf org <org-name> --guid`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_ORG_ID: "cloudfoundry.org.id";
/**
 * The name of the CloudFoundry organization the app is running in.
 *
 * @example my-org-name
 *
 * @note Application instrumentation should use the value from environment
 * variable `VCAP_APPLICATION.org_name`. This is the same value as
 * reported by `cf orgs`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_ORG_NAME: "cloudfoundry.org.name";
/**
 * The UID identifying the process.
 *
 * @example 218fc5a9-a5f1-4b54-aa05-46717d0ab26d
 *
 * @note Application instrumentation should use the value from environment
 * variable `VCAP_APPLICATION.process_id`. It is supposed to be equal to
 * `VCAP_APPLICATION.app_id` for applications deployed to the runtime.
 * For system components, this could be the actual PID.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_PROCESS_ID: "cloudfoundry.process.id";
/**
 * The type of process.
 *
 * @example web
 *
 * @note CloudFoundry applications can consist of multiple jobs. Usually the
 * main process will be of type `web`. There can be additional background
 * tasks or side-cars with different process types.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_PROCESS_TYPE: "cloudfoundry.process.type";
/**
 * The guid of the CloudFoundry space the application is running in.
 *
 * @example 218fc5a9-a5f1-4b54-aa05-46717d0ab26d
 *
 * @note Application instrumentation should use the value from environment
 * variable `VCAP_APPLICATION.space_id`. This is the same value as
 * reported by `cf space <space-name> --guid`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_SPACE_ID: "cloudfoundry.space.id";
/**
 * The name of the CloudFoundry space the application is running in.
 *
 * @example my-space-name
 *
 * @note Application instrumentation should use the value from environment
 * variable `VCAP_APPLICATION.space_name`. This is the same value as
 * reported by `cf spaces`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_SPACE_NAME: "cloudfoundry.space.name";
/**
 * A guid or another name describing the event source.
 *
 * @example cf/gorouter
 *
 * @note CloudFoundry defines the `source_id` in the [Loggregator v2 envelope](https://github.com/cloudfoundry/loggregator-api#v2-envelope).
 * It is used for logs and metrics emitted by CloudFoundry. It is
 * supposed to contain the component name, e.g. "gorouter", for
 * CloudFoundry components.
 *
 * When system components are instrumented, values from the
 * [Bosh spec](https://bosh.io/docs/jobs/#properties-spec)
 * should be used. The `system.id` should be set to
 * `spec.deployment/spec.name`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_SYSTEM_ID: "cloudfoundry.system.id";
/**
 * A guid describing the concrete instance of the event source.
 *
 * @example 218fc5a9-a5f1-4b54-aa05-46717d0ab26d
 *
 * @note CloudFoundry defines the `instance_id` in the [Loggregator v2 envelope](https://github.com/cloudfoundry/loggregator-api#v2-envelope).
 * It is used for logs and metrics emitted by CloudFoundry. It is
 * supposed to contain the vm id for CloudFoundry components.
 *
 * When system components are instrumented, values from the
 * [Bosh spec](https://bosh.io/docs/jobs/#properties-spec)
 * should be used. The `system.instance.id` should be set to `spec.id`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CLOUDFOUNDRY_SYSTEM_INSTANCE_ID: "cloudfoundry.system.instance.id";
/**
 * Deprecated, use `code.column.number`
 *
 * @example 16
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `code.column.number`
 */
declare const ATTR_CODE_COLUMN: "code.column";
/**
 * The column number in `code.file.path` best representing the operation. It **SHOULD** point within the code unit named in `code.function.name`.
 *
 * @example 16
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CODE_COLUMN_NUMBER: "code.column.number";
/**
 * The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
 *
 * @example "/usr/local/MyApplication/content_root/app/index.php"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CODE_FILE_PATH: "code.file.path";
/**
 * Deprecated, use `code.file.path` instead
 *
 * @example "/usr/local/MyApplication/content_root/app/index.php"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CODE_FILEPATH: "code.filepath";
/**
 * Deprecated, use `code.function.name` instead
 *
 * @example "serveRequest"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `code.function.name`
 */
declare const ATTR_CODE_FUNCTION: "code.function";
/**
 * The method or function name, or equivalent (usually rightmost part of the code unit's name).
 *
 * @example "serveRequest"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CODE_FUNCTION_NAME: "code.function.name";
/**
 * The line number in `code.file.path` best representing the operation. It **SHOULD** point within the code unit named in `code.function.name`.
 *
 * @example 42
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CODE_LINE_NUMBER: "code.line.number";
/**
 * Deprecated, use `code.line.number` instead
 *
 * @example 42
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `code.line.number`
 */
declare const ATTR_CODE_LINENO: "code.lineno";
/**
 * The "namespace" within which `code.function.name` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function.name` form a unique identifier for the code unit.
 *
 * @example "com.example.MyHttpService"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CODE_NAMESPACE: "code.namespace";
/**
 * A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
 *
 * @example "at com.example.GenerateTrace.methodB(GenerateTrace.java:13)\\n at com.example.GenerateTrace.methodA(GenerateTrace.java:9)\\n at com.example.GenerateTrace.main(GenerateTrace.java:5)\\n"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CODE_STACKTRACE: "code.stacktrace";
/**
 * The command used to run the container (i.e. the command name).
 *
 * @example otelcontribcol
 *
 * @note If using embedded credentials or sensitive data, it is recommended to remove them to prevent potential leakage.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_COMMAND: "container.command";
/**
 * All the command arguments (including the command/executable itself) run by the container.
 *
 * @example ["otelcontribcol", "--config", "config.yaml"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_COMMAND_ARGS: "container.command_args";
/**
 * The full command run by the container as a single string representing the full command.
 *
 * @example otelcontribcol --config config.yaml
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_COMMAND_LINE: "container.command_line";
/**
 * Deprecated, use `cpu.mode` instead.
 *
 * @example user
 * @example kernel
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cpu.mode`
 */
declare const ATTR_CONTAINER_CPU_STATE: "container.cpu.state";
/**
* Enum value "kernel" for attribute {@link ATTR_CONTAINER_CPU_STATE}.
*/
declare const CONTAINER_CPU_STATE_VALUE_KERNEL: "kernel";
/**
* Enum value "system" for attribute {@link ATTR_CONTAINER_CPU_STATE}.
*/
declare const CONTAINER_CPU_STATE_VALUE_SYSTEM: "system";
/**
* Enum value "user" for attribute {@link ATTR_CONTAINER_CPU_STATE}.
*/
declare const CONTAINER_CPU_STATE_VALUE_USER: "user";
/**
 * The name of the CSI ([Container Storage Interface](https://github.com/container-storage-interface/spec)) plugin used by the volume.
 *
 * @example pd.csi.storage.gke.io
 *
 * @note This can sometimes be referred to as a "driver" in CSI implementations. This should represent the `name` field of the GetPluginInfo RPC.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_CSI_PLUGIN_NAME: "container.csi.plugin.name";
/**
 * The unique volume ID returned by the CSI ([Container Storage Interface](https://github.com/container-storage-interface/spec)) plugin.
 *
 * @example projects/my-gcp-project/zones/my-gcp-zone/disks/my-gcp-disk
 *
 * @note This can sometimes be referred to as a "volume handle" in CSI implementations. This should represent the `Volume.volume_id` field in CSI spec.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_CSI_VOLUME_ID: "container.csi.volume.id";
/**
 * Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/containers/run/#container-identification). The UUID might be abbreviated.
 *
 * @example a3bf90e006b2
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_ID: "container.id";
/**
 * Runtime specific image identifier. Usually a hash algorithm followed by a UUID.
 *
 * @example sha256:19c92d0a00d1b66d897bceaa7319bee0dd38a10a851c60bcec9474aa3f01e50f
 *
 * @note Docker defines a sha256 of the image id; `container.image.id` corresponds to the `Image` field from the Docker container inspect [API](https://docs.docker.com/engine/api/v1.43/#tag/Container/operation/ContainerInspect) endpoint.
 * K8s defines a link to the container registry repository with digest `"imageID": "registry.azurecr.io /namespace/service/dockerfile@sha256:bdeabd40c3a8a492eaf9e8e44d0ebbb84bac7ee25ac0cf8a7159d25f62555625"`.
 * The ID is assigned by the container runtime and can vary in different environments. Consider using `oci.manifest.digest` if it is important to identify the same image in different environments/runtimes.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_IMAGE_ID: "container.image.id";
/**
 * Name of the image the container was built on.
 *
 * @example gcr.io/opentelemetry/operator
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_IMAGE_NAME: "container.image.name";
/**
 * Repo digests of the container image as provided by the container runtime.
 *
 * @example ["example@sha256:afcc7f1ac1b49db317a7196c902e61c6c3c4607d63599ee1a82d702d249a0ccb", "internal.registry.example.com:5000/example@sha256:b69959407d21e8a062e0416bf13405bb2b71ed7a84dde4158ebafacfa06f5578"]
 *
 * @note [Docker](https://docs.docker.com/engine/api/v1.43/#tag/Image/operation/ImageInspect) and [CRI](https://github.com/kubernetes/cri-api/blob/c75ef5b473bbe2d0a4fc92f82235efd665ea8e9f/pkg/apis/runtime/v1/api.proto#L1237-L1238) report those under the `RepoDigests` field.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_IMAGE_REPO_DIGESTS: "container.image.repo_digests";
/**
 * Container image tags. An example can be found in [Docker Image Inspect](https://docs.docker.com/engine/api/v1.43/#tag/Image/operation/ImageInspect). Should be only the `<tag>` section of the full name for example from `registry.example.com/my-org/my-image:<tag>`.
 *
 * @example ["v1.27.1", "3.5.7-0"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_IMAGE_TAGS: "container.image.tags";
/**
 * Container labels, `<key>` being the label name, the value being the label value.
 *
 * @example container.label.app=nginx
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_LABEL: (key: string) => string;
/**
 * Deprecated, use `container.label` instead.
 *
 * @example container.label.app=nginx
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `container.label`.
 */
declare const ATTR_CONTAINER_LABELS: (key: string) => string;
/**
 * Container name used by container runtime.
 *
 * @example opentelemetry-autoconf
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_NAME: "container.name";
/**
 * The container runtime managing this container.
 *
 * @example docker
 * @example containerd
 * @example rkt
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CONTAINER_RUNTIME: "container.runtime";
/**
 * The mode of the CPU
 *
 * @example user
 * @example system
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_CPU_MODE: "cpu.mode";
/**
* Enum value "idle" for attribute {@link ATTR_CPU_MODE}.
*/
declare const CPU_MODE_VALUE_IDLE: "idle";
/**
* Enum value "interrupt" for attribute {@link ATTR_CPU_MODE}.
*/
declare const CPU_MODE_VALUE_INTERRUPT: "interrupt";
/**
* Enum value "iowait" for attribute {@link ATTR_CPU_MODE}.
*/
declare const CPU_MODE_VALUE_IOWAIT: "iowait";
/**
* Enum value "kernel" for attribute {@link ATTR_CPU_MODE}.
*/
declare const CPU_MODE_VALUE_KERNEL: "kernel";
/**
* Enum value "nice" for attribute {@link ATTR_CPU_MODE}.
*/
declare const CPU_MODE_VALUE_NICE: "nice";
/**
* Enum value "steal" for attribute {@link ATTR_CPU_MODE}.
*/
declare const CPU_MODE_VALUE_STEAL: "steal";
/**
* Enum value "system" for attribute {@link ATTR_CPU_MODE}.
*/
declare const CPU_MODE_VALUE_SYSTEM: "system";
/**
* Enum value "user" for attribute {@link ATTR_CPU_MODE}.
*/
declare const CPU_MODE_VALUE_USER: "user";
/**
 * Deprecated, use `cassandra.consistency.level` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cassandra.consistency.level`.
 */
declare const ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL: "db.cassandra.consistency_level";
/**
* Enum value "all" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL: "all";
/**
* Enum value "any" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY: "any";
/**
* Enum value "each_quorum" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM: "each_quorum";
/**
* Enum value "local_one" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE: "local_one";
/**
* Enum value "local_quorum" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM: "local_quorum";
/**
* Enum value "local_serial" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL: "local_serial";
/**
* Enum value "one" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE: "one";
/**
* Enum value "quorum" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM: "quorum";
/**
* Enum value "serial" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL: "serial";
/**
* Enum value "three" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE: "three";
/**
* Enum value "two" for attribute {@link ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL}.
*/
declare const DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO: "two";
/**
 * Deprecated, use `cassandra.coordinator.dc` instead.
 *
 * @example "us-west-2"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cassandra.coordinator.dc`.
 */
declare const ATTR_DB_CASSANDRA_COORDINATOR_DC: "db.cassandra.coordinator.dc";
/**
 * Deprecated, use `cassandra.coordinator.id` instead.
 *
 * @example "be13faa2-8574-4d71-926d-27f16cf8a7af"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cassandra.coordinator.id`.
 */
declare const ATTR_DB_CASSANDRA_COORDINATOR_ID: "db.cassandra.coordinator.id";
/**
 * Deprecated, use `cassandra.query.idempotent` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cassandra.query.idempotent`.
 */
declare const ATTR_DB_CASSANDRA_IDEMPOTENCE: "db.cassandra.idempotence";
/**
 * Deprecated, use `cassandra.page.size` instead.
 *
 * @example 5000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cassandra.page.size`.
 */
declare const ATTR_DB_CASSANDRA_PAGE_SIZE: "db.cassandra.page_size";
/**
 * Deprecated, use `cassandra.speculative_execution.count` instead.
 *
 * @example 0
 * @example 2
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cassandra.speculative_execution.count`.
 */
declare const ATTR_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT: "db.cassandra.speculative_execution_count";
/**
 * Deprecated, use `db.collection.name` instead.
 *
 * @example "mytable"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.collection.name`.
 */
declare const ATTR_DB_CASSANDRA_TABLE: "db.cassandra.table";
/**
 * The name of the connection pool; unique within the instrumented application. In case the connection pool implementation doesn't provide a name, instrumentation **SHOULD** use a combination of parameters that would make the name unique, for example, combining attributes `server.address`, `server.port`, and `db.namespace`, formatted as `server.address:server.port/db.namespace`. Instrumentations that generate connection pool name following different patterns **SHOULD** document it.
 *
 * @example myDataSource
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_CLIENT_CONNECTION_POOL_NAME: "db.client.connection.pool.name";
/**
 * The state of a connection in the pool
 *
 * @example idle
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_CLIENT_CONNECTION_STATE: "db.client.connection.state";
/**
* Enum value "idle" for attribute {@link ATTR_DB_CLIENT_CONNECTION_STATE}.
*/
declare const DB_CLIENT_CONNECTION_STATE_VALUE_IDLE: "idle";
/**
* Enum value "used" for attribute {@link ATTR_DB_CLIENT_CONNECTION_STATE}.
*/
declare const DB_CLIENT_CONNECTION_STATE_VALUE_USED: "used";
/**
 * Deprecated, use `db.client.connection.pool.name` instead.
 *
 * @example myDataSource
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.pool.name`.
 */
declare const ATTR_DB_CLIENT_CONNECTIONS_POOL_NAME: "db.client.connections.pool.name";
/**
 * Deprecated, use `db.client.connection.state` instead.
 *
 * @example idle
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.state`.
 */
declare const ATTR_DB_CLIENT_CONNECTIONS_STATE: "db.client.connections.state";
/**
* Enum value "idle" for attribute {@link ATTR_DB_CLIENT_CONNECTIONS_STATE}.
*/
declare const DB_CLIENT_CONNECTIONS_STATE_VALUE_IDLE: "idle";
/**
* Enum value "used" for attribute {@link ATTR_DB_CLIENT_CONNECTIONS_STATE}.
*/
declare const DB_CLIENT_CONNECTIONS_STATE_VALUE_USED: "used";
/**
 * The name of a collection (table, container) within the database.
 *
 * @example public.users
 * @example customers
 *
 * @note It is **RECOMMENDED** to capture the value as provided by the application without attempting to do any case normalization.
 *
 * The collection name **SHOULD NOT** be extracted from `db.query.text`,
 * unless the query format is known to only ever have a single collection name present.
 *
 * For batch operations, if the individual operations are known to have the same collection name
 * then that collection name **SHOULD** be used.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_COLLECTION_NAME: "db.collection.name";
/**
 * Deprecated, use `server.address`, `server.port` attributes instead.
 *
 * @example "Server=(localdb)\\v11.0;Integrated Security=true;"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `server.address` and `server.port`.
 */
declare const ATTR_DB_CONNECTION_STRING: "db.connection_string";
/**
 * Deprecated, use `azure.client.id` instead.
 *
 * @example "3ba4827d-4422-483f-b59f-85b74211c11d"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.client.id`.
 */
declare const ATTR_DB_COSMOSDB_CLIENT_ID: "db.cosmosdb.client_id";
/**
 * Deprecated, use `azure.cosmosdb.connection.mode` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.cosmosdb.connection.mode`.
 */
declare const ATTR_DB_COSMOSDB_CONNECTION_MODE: "db.cosmosdb.connection_mode";
/**
* Enum value "direct" for attribute {@link ATTR_DB_COSMOSDB_CONNECTION_MODE}.
*/
declare const DB_COSMOSDB_CONNECTION_MODE_VALUE_DIRECT: "direct";
/**
* Enum value "gateway" for attribute {@link ATTR_DB_COSMOSDB_CONNECTION_MODE}.
*/
declare const DB_COSMOSDB_CONNECTION_MODE_VALUE_GATEWAY: "gateway";
/**
 * Deprecated, use `cosmosdb.consistency.level` instead.
 *
 * @example Eventual
 * @example ConsistentPrefix
 * @example BoundedStaleness
 * @example Strong
 * @example Session
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.cosmosdb.consistency.level`.
 */
declare const ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL: "db.cosmosdb.consistency_level";
/**
* Enum value "BoundedStaleness" for attribute {@link ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_BOUNDED_STALENESS: "BoundedStaleness";
/**
* Enum value "ConsistentPrefix" for attribute {@link ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_CONSISTENT_PREFIX: "ConsistentPrefix";
/**
* Enum value "Eventual" for attribute {@link ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_EVENTUAL: "Eventual";
/**
* Enum value "Session" for attribute {@link ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_SESSION: "Session";
/**
* Enum value "Strong" for attribute {@link ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL}.
*/
declare const DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_STRONG: "Strong";
/**
 * Deprecated, use `db.collection.name` instead.
 *
 * @example "mytable"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.collection.name`.
 */
declare const ATTR_DB_COSMOSDB_CONTAINER: "db.cosmosdb.container";
/**
 * Deprecated, no replacement at this time.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated No replacement at this time.
 */
declare const ATTR_DB_COSMOSDB_OPERATION_TYPE: "db.cosmosdb.operation_type";
/**
* Enum value "batch" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_BATCH: "batch";
/**
* Enum value "create" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_CREATE: "create";
/**
* Enum value "delete" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_DELETE: "delete";
/**
* Enum value "execute" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_EXECUTE: "execute";
/**
* Enum value "execute_javascript" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_EXECUTE_JAVASCRIPT: "execute_javascript";
/**
* Enum value "head" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_HEAD: "head";
/**
* Enum value "head_feed" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_HEAD_FEED: "head_feed";
/**
* Enum value "invalid" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_INVALID: "invalid";
/**
* Enum value "patch" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_PATCH: "patch";
/**
* Enum value "query" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_QUERY: "query";
/**
* Enum value "query_plan" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_QUERY_PLAN: "query_plan";
/**
* Enum value "read" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_READ: "read";
/**
* Enum value "read_feed" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_READ_FEED: "read_feed";
/**
* Enum value "replace" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_REPLACE: "replace";
/**
* Enum value "upsert" for attribute {@link ATTR_DB_COSMOSDB_OPERATION_TYPE}.
*/
declare const DB_COSMOSDB_OPERATION_TYPE_VALUE_UPSERT: "upsert";
/**
 * Deprecated, use `azure.cosmosdb.operation.contacted_regions` instead.
 *
 * @example ["North Central US", "Australia East", "Australia Southeast"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.cosmosdb.operation.contacted_regions`.
 */
declare const ATTR_DB_COSMOSDB_REGIONS_CONTACTED: "db.cosmosdb.regions_contacted";
/**
 * Deprecated, use `azure.cosmosdb.operation.request_charge` instead.
 *
 * @example 46.18
 * @example 1.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.cosmosdb.operation.request_charge`.
 */
declare const ATTR_DB_COSMOSDB_REQUEST_CHARGE: "db.cosmosdb.request_charge";
/**
 * Deprecated, use `azure.cosmosdb.request.body.size` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.cosmosdb.request.body.size`.
 */
declare const ATTR_DB_COSMOSDB_REQUEST_CONTENT_LENGTH: "db.cosmosdb.request_content_length";
/**
 * Deprecated, use `db.response.status_code` instead.
 *
 * @example 200
 * @example 201
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.response.status_code`.
 */
declare const ATTR_DB_COSMOSDB_STATUS_CODE: "db.cosmosdb.status_code";
/**
 * Deprecated, use `azure.cosmosdb.response.sub_status_code` instead.
 *
 * @example 1000
 * @example 1002
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.cosmosdb.response.sub_status_code`.
 */
declare const ATTR_DB_COSMOSDB_SUB_STATUS_CODE: "db.cosmosdb.sub_status_code";
/**
 * Deprecated, use `db.namespace` instead.
 *
 * @example e9106fc68e3044f0b1475b04bf4ffd5f
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.namespace`.
 */
declare const ATTR_DB_ELASTICSEARCH_CLUSTER_NAME: "db.elasticsearch.cluster.name";
/**
 * Deprecated, use `elasticsearch.node.name` instead.
 *
 * @example instance-0000000001
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `elasticsearch.node.name`.
 */
declare const ATTR_DB_ELASTICSEARCH_NODE_NAME: "db.elasticsearch.node.name";
/**
 * Deprecated, use `db.operation.parameter` instead.
 *
 * @example db.elasticsearch.path_parts.index=test-index
 * @example db.elasticsearch.path_parts.doc_id=123
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.operation.parameter`.
 */
declare const ATTR_DB_ELASTICSEARCH_PATH_PARTS: (key: string) => string;
/**
 * Deprecated, no general replacement at this time. For Elasticsearch, use `db.elasticsearch.node.name` instead.
 *
 * @example "mysql-e26b99z.example.com"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Deprecated, no general replacement at this time. For Elasticsearch, use `db.elasticsearch.node.name` instead.
 */
declare const ATTR_DB_INSTANCE_ID: "db.instance.id";
/**
 * Removed, no replacement at this time.
 *
 * @example org.postgresql.Driver
 * @example com.microsoft.sqlserver.jdbc.SQLServerDriver
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Removed as not used.
 */
declare const ATTR_DB_JDBC_DRIVER_CLASSNAME: "db.jdbc.driver_classname";
/**
 * Deprecated, use `db.collection.name` instead.
 *
 * @example "mytable"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.collection.name`.
 */
declare const ATTR_DB_MONGODB_COLLECTION: "db.mongodb.collection";
/**
 * Deprecated, SQL Server instance is now populated as a part of `db.namespace` attribute.
 *
 * @example "MSSQLSERVER"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Deprecated, no replacement at this time.
 */
declare const ATTR_DB_MSSQL_INSTANCE_NAME: "db.mssql.instance_name";
/**
 * Deprecated, use `db.namespace` instead.
 *
 * @example customers
 * @example main
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.namespace`.
 */
declare const ATTR_DB_NAME: "db.name";
/**
 * The name of the database, fully qualified within the server address and port.
 *
 * @example customers
 * @example test.users
 *
 * @note If a database system has multiple namespace components, they **SHOULD** be concatenated (potentially using database system specific conventions) from most general to most specific namespace component, and more specific namespaces **SHOULD NOT** be captured without the more general namespaces, to ensure that "startswith" queries for the more general namespaces will be valid.
 * Semantic conventions for individual database systems **SHOULD** document what `db.namespace` means in the context of that system.
 * It is **RECOMMENDED** to capture the value as provided by the application without attempting to do any case normalization.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_NAMESPACE: "db.namespace";
/**
 * Deprecated, use `db.operation.name` instead.
 *
 * @example findAndModify
 * @example HMSET
 * @example SELECT
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.operation.name`.
 */
declare const ATTR_DB_OPERATION: "db.operation";
/**
 * The number of queries included in a batch operation.
 *
 * @example 2
 * @example 3
 * @example 4
 *
 * @note Operations are only considered batches when they contain two or more operations, and so `db.operation.batch.size` **SHOULD** never be `1`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_OPERATION_BATCH_SIZE: "db.operation.batch.size";
/**
 * The name of the operation or command being executed.
 *
 * @example findAndModify
 * @example HMSET
 * @example SELECT
 *
 * @note It is **RECOMMENDED** to capture the value as provided by the application
 * without attempting to do any case normalization.
 *
 * The operation name **SHOULD NOT** be extracted from `db.query.text`,
 * unless the query format is known to only ever have a single operation name present.
 *
 * For batch operations, if the individual operations are known to have the same operation name
 * then that operation name **SHOULD** be used prepended by `BATCH `,
 * otherwise `db.operation.name` **SHOULD** be `BATCH` or some other database
 * system specific term if more applicable.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_OPERATION_NAME: "db.operation.name";
/**
 * A database operation parameter, with `<key>` being the parameter name, and the attribute value being a string representation of the parameter value.
 *
 * @example someval
 * @example 55
 *
 * @note If a parameter has no name and instead is referenced only by index, then `<key>` **SHOULD** be the 0-based index.
 * If `db.query.text` is also captured, then `db.operation.parameter.<key>` **SHOULD** match up with the parameterized placeholders present in `db.query.text`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_OPERATION_PARAMETER: (key: string) => string;
/**
 * A query parameter used in `db.query.text`, with `<key>` being the parameter name, and the attribute value being a string representation of the parameter value.
 *
 * @example someval
 * @example 55
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.operation.parameter`.
 */
declare const ATTR_DB_QUERY_PARAMETER: (key: string) => string;
/**
 * Low cardinality representation of a database query text.
 *
 * @example SELECT wuser_table
 * @example INSERT shipping_details SELECT orders
 * @example get user by id
 *
 * @note `db.query.summary` provides static summary of the query text. It describes a class of database queries and is useful as a grouping key, especially when analyzing telemetry for database calls involving complex queries.
 * Summary may be available to the instrumentation through instrumentation hooks or other means. If it is not available, instrumentations that support query parsing **SHOULD** generate a summary following [Generating query summary](../../docs/database/database-spans.md#generating-a-summary-of-the-query-text) section.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_QUERY_SUMMARY: "db.query.summary";
/**
 * The database query being executed.
 *
 * @example SELECT * FROM wuser_table where username = ?
 * @example SET mykey ?
 *
 * @note For sanitization see [Sanitization of `db.query.text`](../../docs/database/database-spans.md#sanitization-of-dbquerytext).
 * For batch operations, if the individual operations are known to have the same query text then that query text **SHOULD** be used, otherwise all of the individual query texts **SHOULD** be concatenated with separator `; ` or some other database system specific separator if more applicable.
 * Even though parameterized query text can potentially have sensitive data, by using a parameterized query the user is giving a strong signal that any sensitive data will be passed as parameter values, and the benefit to observability of capturing the static part of the query text by default outweighs the risk.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_QUERY_TEXT: "db.query.text";
/**
 * Deprecated, use `db.namespace` instead.
 *
 * @example 0
 * @example 1
 * @example 15
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.namespace`.
 */
declare const ATTR_DB_REDIS_DATABASE_INDEX: "db.redis.database_index";
/**
 * Number of rows returned by the operation.
 *
 * @example 10
 * @example 30
 * @example 1000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_RESPONSE_RETURNED_ROWS: "db.response.returned_rows";
/**
 * Database response status code.
 *
 * @example 102
 * @example ORA-17002
 * @example 08P01
 * @example 404
 *
 * @note The status code returned by the database. Usually it represents an error code, but may also represent partial success, warning, or differentiate between various types of successful outcomes.
 * Semantic conventions for individual database systems **SHOULD** document what `db.response.status_code` means in the context of that system.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_RESPONSE_STATUS_CODE: "db.response.status_code";
/**
 * Deprecated, use `db.collection.name` instead.
 *
 * @example "mytable"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.collection.name`.
 */
declare const ATTR_DB_SQL_TABLE: "db.sql.table";
/**
 * The database statement being executed.
 *
 * @example SELECT * FROM wuser_table
 * @example SET mykey "WuValue"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.query.text`.
 */
declare const ATTR_DB_STATEMENT: "db.statement";
/**
 * Deprecated, use `db.system.name` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.system.name`.
 */
declare const ATTR_DB_SYSTEM: "db.system";
/**
* Enum value "adabas" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_ADABAS: "adabas";
/**
* Enum value "cache" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_CACHE: "cache";
/**
* Enum value "cassandra" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_CASSANDRA: "cassandra";
/**
* Enum value "clickhouse" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_CLICKHOUSE: "clickhouse";
/**
* Enum value "cloudscape" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_CLOUDSCAPE: "cloudscape";
/**
* Enum value "cockroachdb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_COCKROACHDB: "cockroachdb";
/**
* Enum value "coldfusion" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_COLDFUSION: "coldfusion";
/**
* Enum value "cosmosdb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_COSMOSDB: "cosmosdb";
/**
* Enum value "couchbase" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_COUCHBASE: "couchbase";
/**
* Enum value "couchdb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_COUCHDB: "couchdb";
/**
* Enum value "db2" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_DB2: "db2";
/**
* Enum value "derby" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_DERBY: "derby";
/**
* Enum value "dynamodb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_DYNAMODB: "dynamodb";
/**
* Enum value "edb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_EDB: "edb";
/**
* Enum value "elasticsearch" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_ELASTICSEARCH: "elasticsearch";
/**
* Enum value "filemaker" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_FILEMAKER: "filemaker";
/**
* Enum value "firebird" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_FIREBIRD: "firebird";
/**
* Enum value "firstsql" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_FIRSTSQL: "firstsql";
/**
* Enum value "geode" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_GEODE: "geode";
/**
* Enum value "h2" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_H2: "h2";
/**
* Enum value "hanadb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_HANADB: "hanadb";
/**
* Enum value "hbase" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_HBASE: "hbase";
/**
* Enum value "hive" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_HIVE: "hive";
/**
* Enum value "hsqldb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_HSQLDB: "hsqldb";
/**
* Enum value "influxdb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_INFLUXDB: "influxdb";
/**
* Enum value "informix" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_INFORMIX: "informix";
/**
* Enum value "ingres" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_INGRES: "ingres";
/**
* Enum value "instantdb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_INSTANTDB: "instantdb";
/**
* Enum value "interbase" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_INTERBASE: "interbase";
/**
* Enum value "intersystems_cache" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_INTERSYSTEMS_CACHE: "intersystems_cache";
/**
* Enum value "mariadb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_MARIADB: "mariadb";
/**
* Enum value "maxdb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_MAXDB: "maxdb";
/**
* Enum value "memcached" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_MEMCACHED: "memcached";
/**
* Enum value "mongodb" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_MONGODB: "mongodb";
/**
* Enum value "mssql" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_MSSQL: "mssql";
/**
* Enum value "mssqlcompact" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_MSSQLCOMPACT: "mssqlcompact";
/**
* Enum value "mysql" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_MYSQL: "mysql";
/**
* Enum value "neo4j" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_NEO4J: "neo4j";
/**
* Enum value "netezza" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_NETEZZA: "netezza";
/**
* Enum value "opensearch" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_OPENSEARCH: "opensearch";
/**
* Enum value "oracle" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_ORACLE: "oracle";
/**
* Enum value "other_sql" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_OTHER_SQL: "other_sql";
/**
* Enum value "pervasive" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_PERVASIVE: "pervasive";
/**
* Enum value "pointbase" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_POINTBASE: "pointbase";
/**
* Enum value "postgresql" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_POSTGRESQL: "postgresql";
/**
* Enum value "progress" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_PROGRESS: "progress";
/**
* Enum value "redis" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_REDIS: "redis";
/**
* Enum value "redshift" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_REDSHIFT: "redshift";
/**
* Enum value "spanner" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_SPANNER: "spanner";
/**
* Enum value "sqlite" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_SQLITE: "sqlite";
/**
* Enum value "sybase" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_SYBASE: "sybase";
/**
* Enum value "teradata" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_TERADATA: "teradata";
/**
* Enum value "trino" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_TRINO: "trino";
/**
* Enum value "vertica" for attribute {@link ATTR_DB_SYSTEM}.
*/
declare const DB_SYSTEM_VALUE_VERTICA: "vertica";
/**
 * The database management system (DBMS) product as identified by the client instrumentation.
 *
 * @note The actual DBMS may differ from the one identified by the client. For example, when using PostgreSQL client libraries to connect to a CockroachDB, the `db.system.name` is set to `postgresql` based on the instrumentation's best knowledge.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DB_SYSTEM_NAME: "db.system.name";
/**
* Enum value "actian.ingres" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_ACTIAN_INGRES: "actian.ingres";
/**
* Enum value "aws.dynamodb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_AWS_DYNAMODB: "aws.dynamodb";
/**
* Enum value "aws.redshift" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_AWS_REDSHIFT: "aws.redshift";
/**
* Enum value "azure.cosmosdb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_AZURE_COSMOSDB: "azure.cosmosdb";
/**
* Enum value "cassandra" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_CASSANDRA: "cassandra";
/**
* Enum value "clickhouse" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_CLICKHOUSE: "clickhouse";
/**
* Enum value "cockroachdb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_COCKROACHDB: "cockroachdb";
/**
* Enum value "couchbase" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_COUCHBASE: "couchbase";
/**
* Enum value "couchdb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_COUCHDB: "couchdb";
/**
* Enum value "derby" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_DERBY: "derby";
/**
* Enum value "elasticsearch" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_ELASTICSEARCH: "elasticsearch";
/**
* Enum value "firebirdsql" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_FIREBIRDSQL: "firebirdsql";
/**
* Enum value "gcp.spanner" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_GCP_SPANNER: "gcp.spanner";
/**
* Enum value "geode" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_GEODE: "geode";
/**
* Enum value "h2database" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_H2DATABASE: "h2database";
/**
* Enum value "hbase" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_HBASE: "hbase";
/**
* Enum value "hive" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_HIVE: "hive";
/**
* Enum value "hsqldb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_HSQLDB: "hsqldb";
/**
* Enum value "ibm.db2" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_IBM_DB2: "ibm.db2";
/**
* Enum value "ibm.informix" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_IBM_INFORMIX: "ibm.informix";
/**
* Enum value "ibm.netezza" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_IBM_NETEZZA: "ibm.netezza";
/**
* Enum value "influxdb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_INFLUXDB: "influxdb";
/**
* Enum value "instantdb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_INSTANTDB: "instantdb";
/**
* Enum value "intersystems.cache" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_INTERSYSTEMS_CACHE: "intersystems.cache";
/**
* Enum value "mariadb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_MARIADB: "mariadb";
/**
* Enum value "memcached" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_MEMCACHED: "memcached";
/**
* Enum value "microsoft.sql_server" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER: "microsoft.sql_server";
/**
* Enum value "mongodb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_MONGODB: "mongodb";
/**
* Enum value "mysql" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_MYSQL: "mysql";
/**
* Enum value "neo4j" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_NEO4J: "neo4j";
/**
* Enum value "opensearch" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_OPENSEARCH: "opensearch";
/**
* Enum value "oracle.db" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_ORACLE_DB: "oracle.db";
/**
* Enum value "other_sql" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_OTHER_SQL: "other_sql";
/**
* Enum value "postgresql" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_POSTGRESQL: "postgresql";
/**
* Enum value "redis" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_REDIS: "redis";
/**
* Enum value "sap.hana" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_SAP_HANA: "sap.hana";
/**
* Enum value "sap.maxdb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_SAP_MAXDB: "sap.maxdb";
/**
* Enum value "softwareag.adabas" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_SOFTWAREAG_ADABAS: "softwareag.adabas";
/**
* Enum value "sqlite" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_SQLITE: "sqlite";
/**
* Enum value "teradata" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_TERADATA: "teradata";
/**
* Enum value "trino" for attribute {@link ATTR_DB_SYSTEM_NAME}.
*/
declare const DB_SYSTEM_NAME_VALUE_TRINO: "trino";
/**
 * Deprecated, no replacement at this time.
 *
 * @example readonly_user
 * @example reporting_user
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated No replacement at this time.
 */
declare const ATTR_DB_USER: "db.user";
/**
 * 'Deprecated, use `deployment.environment.name` instead.'
 *
 * @example staging
 * @example production
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Deprecated, use `deployment.environment.name` instead.
 */
declare const ATTR_DEPLOYMENT_ENVIRONMENT: "deployment.environment";
/**
 * Name of the [deployment environment](https://wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
 *
 * @example staging
 * @example production
 *
 * @note `deployment.environment.name` does not affect the uniqueness constraints defined through
 * the `service.namespace`, `service.name` and `service.instance.id` resource attributes.
 * This implies that resources carrying the following attribute combinations **MUST** be
 * considered to be identifying the same service:
 *
 *   - `service.name=frontend`, `deployment.environment.name=production`
 *   - `service.name=frontend`, `deployment.environment.name=staging`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DEPLOYMENT_ENVIRONMENT_NAME: "deployment.environment.name";
/**
 * The id of the deployment.
 *
 * @example 1208
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DEPLOYMENT_ID: "deployment.id";
/**
 * The name of the deployment.
 *
 * @example deploy my app
 * @example deploy-frontend
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DEPLOYMENT_NAME: "deployment.name";
/**
 * The status of the deployment.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DEPLOYMENT_STATUS: "deployment.status";
/**
* Enum value "failed" for attribute {@link ATTR_DEPLOYMENT_STATUS}.
*/
declare const DEPLOYMENT_STATUS_VALUE_FAILED: "failed";
/**
* Enum value "succeeded" for attribute {@link ATTR_DEPLOYMENT_STATUS}.
*/
declare const DEPLOYMENT_STATUS_VALUE_SUCCEEDED: "succeeded";
/**
 * Destination address - domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name.
 *
 * @example destination.example.com
 * @example 10.1.2.80
 * @example /tmp/my.sock
 *
 * @note When observed from the source side, and when communicating through an intermediary, `destination.address` **SHOULD** represent the destination address behind any intermediaries, for example proxies, if it's available.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DESTINATION_ADDRESS: "destination.address";
/**
 * Destination port number
 *
 * @example 3389
 * @example 2888
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DESTINATION_PORT: "destination.port";
/**
 * A unique identifier representing the device
 *
 * @example 2ab2916d-a51f-4ac8-80ee-45ac31a28092
 *
 * @note The device identifier **MUST** only be defined using the values outlined below. This value is not an advertising identifier and **MUST NOT** be used as such. On iOS (Swift or Objective-C), this value **MUST** be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value **MUST** be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DEVICE_ID: "device.id";
/**
 * The name of the device manufacturer
 *
 * @example Apple
 * @example Samsung
 *
 * @note The Android OS provides this field via [Build](https://developer.android.com/reference/android/os/Build#MANUFACTURER). iOS apps **SHOULD** hardcode the value `Apple`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DEVICE_MANUFACTURER: "device.manufacturer";
/**
 * The model identifier for the device
 *
 * @example iPhone3,4
 * @example SM-G920F
 *
 * @note It's recommended this value represents a machine-readable version of the model identifier rather than the market or consumer-friendly name of the device.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DEVICE_MODEL_IDENTIFIER: "device.model.identifier";
/**
 * The marketing name for the device model
 *
 * @example iPhone 6s Plus
 * @example Samsung Galaxy S6
 *
 * @note It's recommended this value represents a human-readable version of the device model rather than a machine-readable alternative.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DEVICE_MODEL_NAME: "device.model.name";
/**
 * The disk IO operation direction.
 *
 * @example read
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DISK_IO_DIRECTION: "disk.io.direction";
/**
* Enum value "read" for attribute {@link ATTR_DISK_IO_DIRECTION}.
*/
declare const DISK_IO_DIRECTION_VALUE_READ: "read";
/**
* Enum value "write" for attribute {@link ATTR_DISK_IO_DIRECTION}.
*/
declare const DISK_IO_DIRECTION_VALUE_WRITE: "write";
/**
 * The name being queried.
 *
 * @example www.example.com
 * @example opentelemetry.io
 *
 * @note If the name field contains non-printable characters (below 32 or above 126), those characters should be represented as escaped base 10 integers (\\DDD). Back slashes and quotes should be escaped. Tabs, carriage returns, and line feeds should be converted to \\t, \\r, and \\n respectively.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_DNS_QUESTION_NAME: "dns.question.name";
/**
 * Represents the human-readable identifier of the node/instance to which a request was routed.
 *
 * @example instance-0000000001
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_ELASTICSEARCH_NODE_NAME: "elasticsearch.node.name";
/**
 * Deprecated, use `user.id` instead.
 *
 * @example "username"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `user.id` attribute.
 */
declare const ATTR_ENDUSER_ID: "enduser.id";
/**
 * Deprecated, use `user.roles` instead.
 *
 * @example "admin"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `user.roles` attribute.
 */
declare const ATTR_ENDUSER_ROLE: "enduser.role";
/**
 * Deprecated, no replacement at this time.
 *
 * @example "read:message, write:files"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Removed.
 */
declare const ATTR_ENDUSER_SCOPE: "enduser.scope";
/**
 * Identifies the class / type of event.
 *
 * @example browser.mouse.click
 * @example device.app.lifecycle
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by EventName top-level field on the LogRecord
 */
declare const ATTR_EVENT_NAME: "event.name";
/**
 * A boolean that is true if the serverless function is executed for the first time (aka cold-start).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_COLDSTART: "faas.coldstart";
/**
 * A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
 *
 * @example "0/5 * * * ? *"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_CRON: "faas.cron";
/**
 * The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
 *
 * @example myBucketName
 * @example myDbName
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_DOCUMENT_COLLECTION: "faas.document.collection";
/**
 * The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
 *
 * @example myFile.txt
 * @example myTableName
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_DOCUMENT_NAME: "faas.document.name";
/**
 * Describes the type of the operation that was performed on the data.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_DOCUMENT_OPERATION: "faas.document.operation";
/**
* Enum value "delete" for attribute {@link ATTR_FAAS_DOCUMENT_OPERATION}.
*/
declare const FAAS_DOCUMENT_OPERATION_VALUE_DELETE: "delete";
/**
* Enum value "edit" for attribute {@link ATTR_FAAS_DOCUMENT_OPERATION}.
*/
declare const FAAS_DOCUMENT_OPERATION_VALUE_EDIT: "edit";
/**
* Enum value "insert" for attribute {@link ATTR_FAAS_DOCUMENT_OPERATION}.
*/
declare const FAAS_DOCUMENT_OPERATION_VALUE_INSERT: "insert";
/**
 * A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
 *
 * @example "2020-01-23T13:47:06Z"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_DOCUMENT_TIME: "faas.document.time";
/**
 * The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
 *
 * @example 2021/06/28/[$LATEST]2f399eb14537447da05ab2a2e39309de
 *
 * @note - **AWS Lambda:** Use the (full) log stream name.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_INSTANCE: "faas.instance";
/**
 * The invocation ID of the current function invocation.
 *
 * @example "af9d5aa4-a685-4c5f-a22b-444f80b3cc28"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_INVOCATION_ID: "faas.invocation_id";
/**
 * The name of the invoked function.
 *
 * @example "my-function"
 *
 * @note **SHOULD** be equal to the `faas.name` resource attribute of the invoked function.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_INVOKED_NAME: "faas.invoked_name";
/**
 * The cloud provider of the invoked function.
 *
 * @note **SHOULD** be equal to the `cloud.provider` resource attribute of the invoked function.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_INVOKED_PROVIDER: "faas.invoked_provider";
/**
* Enum value "alibaba_cloud" for attribute {@link ATTR_FAAS_INVOKED_PROVIDER}.
*/
declare const FAAS_INVOKED_PROVIDER_VALUE_ALIBABA_CLOUD: "alibaba_cloud";
/**
* Enum value "aws" for attribute {@link ATTR_FAAS_INVOKED_PROVIDER}.
*/
declare const FAAS_INVOKED_PROVIDER_VALUE_AWS: "aws";
/**
* Enum value "azure" for attribute {@link ATTR_FAAS_INVOKED_PROVIDER}.
*/
declare const FAAS_INVOKED_PROVIDER_VALUE_AZURE: "azure";
/**
* Enum value "gcp" for attribute {@link ATTR_FAAS_INVOKED_PROVIDER}.
*/
declare const FAAS_INVOKED_PROVIDER_VALUE_GCP: "gcp";
/**
* Enum value "tencent_cloud" for attribute {@link ATTR_FAAS_INVOKED_PROVIDER}.
*/
declare const FAAS_INVOKED_PROVIDER_VALUE_TENCENT_CLOUD: "tencent_cloud";
/**
 * The cloud region of the invoked function.
 *
 * @example "eu-central-1"
 *
 * @note **SHOULD** be equal to the `cloud.region` resource attribute of the invoked function.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_INVOKED_REGION: "faas.invoked_region";
/**
 * The amount of memory available to the serverless function converted to Bytes.
 *
 * @example 134217728
 *
 * @note It's recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information (which must be multiplied by 1,048,576).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_MAX_MEMORY: "faas.max_memory";
/**
 * The name of the single function that this runtime instance executes.
 *
 * @example my-function
 * @example myazurefunctionapp/some-function-name
 *
 * @note This is the name of the function as configured/deployed on the FaaS
 * platform and is usually different from the name of the callback
 * function (which may be stored in the
 * [`code.namespace`/`code.function.name`](/docs/general/attributes.md#source-code-attributes)
 * span attributes).
 *
 * For some cloud providers, the above definition is ambiguous. The following
 * definition of function name **MUST** be used for this attribute
 * (and consequently the span name) for the listed cloud providers/products:
 *
 *   - **Azure:**  The full name `<FUNCAPP>/<FUNC>`, i.e., function app name
 *     followed by a forward slash followed by the function name (this form
 *     can also be seen in the resource JSON for the function).
 *     This means that a span attribute **MUST** be used, as an Azure function
 *     app can host multiple functions that would usually share
 *     a TracerProvider (see also the `cloud.resource_id` attribute).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_NAME: "faas.name";
/**
 * A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
 *
 * @example "2020-01-23T13:47:06Z"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_TIME: "faas.time";
/**
 * Type of the trigger which caused this function invocation.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_TRIGGER: "faas.trigger";
/**
* Enum value "datasource" for attribute {@link ATTR_FAAS_TRIGGER}.
*/
declare const FAAS_TRIGGER_VALUE_DATASOURCE: "datasource";
/**
* Enum value "http" for attribute {@link ATTR_FAAS_TRIGGER}.
*/
declare const FAAS_TRIGGER_VALUE_HTTP: "http";
/**
* Enum value "other" for attribute {@link ATTR_FAAS_TRIGGER}.
*/
declare const FAAS_TRIGGER_VALUE_OTHER: "other";
/**
* Enum value "pubsub" for attribute {@link ATTR_FAAS_TRIGGER}.
*/
declare const FAAS_TRIGGER_VALUE_PUBSUB: "pubsub";
/**
* Enum value "timer" for attribute {@link ATTR_FAAS_TRIGGER}.
*/
declare const FAAS_TRIGGER_VALUE_TIMER: "timer";
/**
 * The immutable version of the function being executed.
 *
 * @example 26
 * @example pinkfroid-00002
 *
 * @note Depending on the cloud provider and platform, use:
 *
 *   - **AWS Lambda:** The [function version](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
 *     (an integer represented as a decimal string).
 *   - **Google Cloud Run (Services):** The [revision](https://cloud.google.com/run/docs/managing/revisions)
 *     (i.e., the function name plus the revision suffix).
 *   - **Google Cloud Functions:** The value of the
 *     [`K_REVISION` environment variable](https://cloud.google.com/functions/docs/env-var#runtime_environment_variables_set_automatically).
 *   - **Azure Functions:** Not applicable. Do not set this attribute.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FAAS_VERSION: "faas.version";
/**
 * The unique identifier for the flag evaluation context. For example, the targeting key.
 *
 * @example 5157782b-2203-4c80-a857-dbbd5e7761db
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FEATURE_FLAG_CONTEXT_ID: "feature_flag.context.id";
/**
 * A message explaining the nature of an error occurring during flag evaluation.
 *
 * @example Flag `header-color` expected type `string` but found type `number`
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FEATURE_FLAG_EVALUATION_ERROR_MESSAGE: "feature_flag.evaluation.error.message";
/**
 * The reason code which shows how a feature flag value was determined.
 *
 * @example static
 * @example targeting_match
 * @example error
 * @example default
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FEATURE_FLAG_EVALUATION_REASON: "feature_flag.evaluation.reason";
/**
* Enum value "cached" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_CACHED: "cached";
/**
* Enum value "default" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_DEFAULT: "default";
/**
* Enum value "disabled" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_DISABLED: "disabled";
/**
* Enum value "error" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_ERROR: "error";
/**
* Enum value "split" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_SPLIT: "split";
/**
* Enum value "stale" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_STALE: "stale";
/**
* Enum value "static" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_STATIC: "static";
/**
* Enum value "targeting_match" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_TARGETING_MATCH: "targeting_match";
/**
* Enum value "unknown" for attribute {@link ATTR_FEATURE_FLAG_EVALUATION_REASON}.
*/
declare const FEATURE_FLAG_EVALUATION_REASON_VALUE_UNKNOWN: "unknown";
/**
 * The lookup key of the feature flag.
 *
 * @example logo-color
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FEATURE_FLAG_KEY: "feature_flag.key";
/**
 * Identifies the feature flag provider.
 *
 * @example Flag Manager
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FEATURE_FLAG_PROVIDER_NAME: "feature_flag.provider_name";
/**
 * The identifier of the [flag set](https://openfeature.dev/specification/glossary/#flag-set) to which the feature flag belongs.
 *
 * @example proj-1
 * @example ab98sgs
 * @example service1/dev
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FEATURE_FLAG_SET_ID: "feature_flag.set.id";
/**
 * A semantic identifier for an evaluated flag value.
 *
 * @example red
 * @example true
 * @example on
 *
 * @note A semantic identifier, commonly referred to as a variant, provides a means
 * for referring to a value without including the value itself. This can
 * provide additional context for understanding the meaning behind a value.
 * For example, the variant `red` maybe be used for the value `#c05543`.
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FEATURE_FLAG_VARIANT: "feature_flag.variant";
/**
 * The version of the ruleset used during the evaluation. This may be any stable value which uniquely identifies the ruleset.
 *
 * @example 1
 * @example 01ABCDEF
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FEATURE_FLAG_VERSION: "feature_flag.version";
/**
 * Time when the file was last accessed, in ISO 8601 format.
 *
 * @example 2021-01-01T12:00:00Z
 *
 * @note This attribute might not be supported by some file systems — NFS, FAT32, in embedded OS, etc.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_ACCESSED: "file.accessed";
/**
 * Array of file attributes.
 *
 * @example ["readonly", "hidden"]
 *
 * @note Attributes names depend on the OS or file system. Here’s a non-exhaustive list of values expected for this attribute: `archive`, `compressed`, `directory`, `encrypted`, `execute`, `hidden`, `immutable`, `journaled`, `read`, `readonly`, `symbolic link`, `system`, `temporary`, `write`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_ATTRIBUTES: "file.attributes";
/**
 * Time when the file attributes or metadata was last changed, in ISO 8601 format.
 *
 * @example 2021-01-01T12:00:00Z
 *
 * @note `file.changed` captures the time when any of the file's properties or attributes (including the content) are changed, while `file.modified` captures the timestamp when the file content is modified.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_CHANGED: "file.changed";
/**
 * Time when the file was created, in ISO 8601 format.
 *
 * @example 2021-01-01T12:00:00Z
 *
 * @note This attribute might not be supported by some file systems — NFS, FAT32, in embedded OS, etc.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_CREATED: "file.created";
/**
 * Directory where the file is located. It should include the drive letter, when appropriate.
 *
 * @example /home/user
 * @example C:\\Program Files\\MyApp
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_DIRECTORY: "file.directory";
/**
 * File extension, excluding the leading dot.
 *
 * @example png
 * @example gz
 *
 * @note When the file name has multiple extensions (example.tar.gz), only the last one should be captured ("gz", not "tar.gz").
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_EXTENSION: "file.extension";
/**
 * Name of the fork. A fork is additional data associated with a filesystem object.
 *
 * @example Zone.Identifer
 *
 * @note On Linux, a resource fork is used to store additional data with a filesystem object. A file always has at least one fork for the data portion, and additional forks may exist.
 * On NTFS, this is analogous to an Alternate Data Stream (ADS), and the default data stream for a file is just called $DATA. Zone.Identifier is commonly used by Windows to track contents downloaded from the Internet. An ADS is typically of the form: C:\\path\\to\\filename.extension:some_fork_name, and some_fork_name is the value that should populate `fork_name`. `filename.extension` should populate `file.name`, and `extension` should populate `file.extension`. The full path, `file.path`, will include the fork name.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_FORK_NAME: "file.fork_name";
/**
 * Primary Group ID (GID) of the file.
 *
 * @example 1000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_GROUP_ID: "file.group.id";
/**
 * Primary group name of the file.
 *
 * @example users
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_GROUP_NAME: "file.group.name";
/**
 * Inode representing the file in the filesystem.
 *
 * @example 256383
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_INODE: "file.inode";
/**
 * Mode of the file in octal representation.
 *
 * @example 0640
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_MODE: "file.mode";
/**
 * Time when the file content was last modified, in ISO 8601 format.
 *
 * @example 2021-01-01T12:00:00Z
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_MODIFIED: "file.modified";
/**
 * Name of the file including the extension, without the directory.
 *
 * @example example.png
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_NAME: "file.name";
/**
 * The user ID (UID) or security identifier (SID) of the file owner.
 *
 * @example 1000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_OWNER_ID: "file.owner.id";
/**
 * Username of the file owner.
 *
 * @example root
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_OWNER_NAME: "file.owner.name";
/**
 * Full path to the file, including the file name. It should include the drive letter, when appropriate.
 *
 * @example /home/alice/example.png
 * @example C:\\Program Files\\MyApp\\myapp.exe
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_PATH: "file.path";
/**
 * File size in bytes.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_SIZE: "file.size";
/**
 * Path to the target of a symbolic link.
 *
 * @example /usr/bin/python3
 *
 * @note This attribute is only applicable to symbolic links.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_FILE_SYMBOLIC_LINK_TARGET_PATH: "file.symbolic_link.target_path";
/**
 * Identifies the Google Cloud service for which the official client library is intended.
 *
 * @example appengine
 * @example run
 * @example firestore
 * @example alloydb
 * @example spanner
 *
 * @note Intended to be a stable identifier for Google Cloud client libraries that is uniform across implementation languages. The value should be derived from the canonical service domain for the service; for example, 'foo.googleapis.com' should result in a value of 'foo'.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GCP_CLIENT_SERVICE: "gcp.client.service";
/**
 * The name of the Cloud Run [execution](https://cloud.google.com/run/docs/managing/job-executions) being run for the Job, as set by the [`CLOUD_RUN_EXECUTION`](https://cloud.google.com/run/docs/container-contract#jobs-env-vars) environment variable.
 *
 * @example job-name-xxxx
 * @example sample-job-mdw84
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GCP_CLOUD_RUN_JOB_EXECUTION: "gcp.cloud_run.job.execution";
/**
 * The index for a task within an execution as provided by the [`CLOUD_RUN_TASK_INDEX`](https://cloud.google.com/run/docs/container-contract#jobs-env-vars) environment variable.
 *
 * @example 0
 * @example 1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GCP_CLOUD_RUN_JOB_TASK_INDEX: "gcp.cloud_run.job.task_index";
/**
 * The hostname of a GCE instance. This is the full value of the default or [custom hostname](https://cloud.google.com/compute/docs/instances/custom-hostname-vm).
 *
 * @example my-host1234.example.com
 * @example sample-vm.us-west1-b.c.my-project.internal
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GCP_GCE_INSTANCE_HOSTNAME: "gcp.gce.instance.hostname";
/**
 * The instance name of a GCE instance. This is the value provided by `host.name`, the visible name of the instance in the Cloud Console UI, and the prefix for the default hostname of the instance as defined by the [default internal DNS name](https://cloud.google.com/compute/docs/internal-dns#instance-fully-qualified-domain-names).
 *
 * @example instance-1
 * @example my-vm-name
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GCP_GCE_INSTANCE_NAME: "gcp.gce.instance.name";
/**
 * Deprecated, use Event API to report completions contents.
 *
 * @example [{'role': 'assistant', 'content': 'The capital of France is Paris.'}]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Removed, no replacement at this time.
 */
declare const ATTR_GEN_AI_COMPLETION: "gen_ai.completion";
/**
 * The response format that is requested.
 *
 * @example json
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT: "gen_ai.openai.request.response_format";
/**
* Enum value "json_object" for attribute {@link ATTR_GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT}.
*/
declare const GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_JSON_OBJECT: "json_object";
/**
* Enum value "json_schema" for attribute {@link ATTR_GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT}.
*/
declare const GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_JSON_SCHEMA: "json_schema";
/**
* Enum value "text" for attribute {@link ATTR_GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT}.
*/
declare const GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_TEXT: "text";
/**
 * Deprecated, use `gen_ai.request.seed`.
 *
 * @example 100
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `gen_ai.request.seed` attribute.
 */
declare const ATTR_GEN_AI_OPENAI_REQUEST_SEED: "gen_ai.openai.request.seed";
/**
 * The service tier requested. May be a specific tier, default, or auto.
 *
 * @example auto
 * @example default
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_OPENAI_REQUEST_SERVICE_TIER: "gen_ai.openai.request.service_tier";
/**
* Enum value "auto" for attribute {@link ATTR_GEN_AI_OPENAI_REQUEST_SERVICE_TIER}.
*/
declare const GEN_AI_OPENAI_REQUEST_SERVICE_TIER_VALUE_AUTO: "auto";
/**
* Enum value "default" for attribute {@link ATTR_GEN_AI_OPENAI_REQUEST_SERVICE_TIER}.
*/
declare const GEN_AI_OPENAI_REQUEST_SERVICE_TIER_VALUE_DEFAULT: "default";
/**
 * The service tier used for the response.
 *
 * @example scale
 * @example default
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_OPENAI_RESPONSE_SERVICE_TIER: "gen_ai.openai.response.service_tier";
/**
 * A fingerprint to track any eventual change in the Generative AI environment.
 *
 * @example fp_44709d6fcb
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_OPENAI_RESPONSE_SYSTEM_FINGERPRINT: "gen_ai.openai.response.system_fingerprint";
/**
 * The name of the operation being performed.
 *
 * @note If one of the predefined values applies, but specific system uses a different name it's **RECOMMENDED** to document it in the semantic conventions for specific GenAI system and use system-specific name in the instrumentation. If a different name is not documented, instrumentation libraries **SHOULD** use applicable predefined value.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_OPERATION_NAME: "gen_ai.operation.name";
/**
* Enum value "chat" for attribute {@link ATTR_GEN_AI_OPERATION_NAME}.
*/
declare const GEN_AI_OPERATION_NAME_VALUE_CHAT: "chat";
/**
* Enum value "embeddings" for attribute {@link ATTR_GEN_AI_OPERATION_NAME}.
*/
declare const GEN_AI_OPERATION_NAME_VALUE_EMBEDDINGS: "embeddings";
/**
* Enum value "text_completion" for attribute {@link ATTR_GEN_AI_OPERATION_NAME}.
*/
declare const GEN_AI_OPERATION_NAME_VALUE_TEXT_COMPLETION: "text_completion";
/**
 * Deprecated, use Event API to report prompt contents.
 *
 * @example [{'role': 'user', 'content': 'What is the capital of France?'}]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Removed, no replacement at this time.
 */
declare const ATTR_GEN_AI_PROMPT: "gen_ai.prompt";
/**
 * The encoding formats requested in an embeddings operation, if specified.
 *
 * @example ["base64"]
 * @example ["float", "binary"]
 *
 * @note In some GenAI systems the encoding formats are called embedding types. Also, some GenAI systems only accept a single format per request.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_ENCODING_FORMATS: "gen_ai.request.encoding_formats";
/**
 * The frequency penalty setting for the GenAI request.
 *
 * @example 0.1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_FREQUENCY_PENALTY: "gen_ai.request.frequency_penalty";
/**
 * The maximum number of tokens the model generates for a request.
 *
 * @example 100
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_MAX_TOKENS: "gen_ai.request.max_tokens";
/**
 * The name of the GenAI model a request is being made to.
 *
 * @example "gpt-4"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_MODEL: "gen_ai.request.model";
/**
 * The presence penalty setting for the GenAI request.
 *
 * @example 0.1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_PRESENCE_PENALTY: "gen_ai.request.presence_penalty";
/**
 * Requests with same seed value more likely to return same result.
 *
 * @example 100
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_SEED: "gen_ai.request.seed";
/**
 * List of sequences that the model will use to stop generating further tokens.
 *
 * @example ["forest", "lived"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_STOP_SEQUENCES: "gen_ai.request.stop_sequences";
/**
 * The temperature setting for the GenAI request.
 *
 * @example 0.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_TEMPERATURE: "gen_ai.request.temperature";
/**
 * The top_k sampling setting for the GenAI request.
 *
 * @example 1.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_TOP_K: "gen_ai.request.top_k";
/**
 * The top_p sampling setting for the GenAI request.
 *
 * @example 1.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_REQUEST_TOP_P: "gen_ai.request.top_p";
/**
 * Array of reasons the model stopped generating tokens, corresponding to each generation received.
 *
 * @example ["stop"]
 * @example ["stop", "length"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_RESPONSE_FINISH_REASONS: "gen_ai.response.finish_reasons";
/**
 * The unique identifier for the completion.
 *
 * @example chatcmpl-123
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_RESPONSE_ID: "gen_ai.response.id";
/**
 * The name of the model that generated the response.
 *
 * @example gpt-4-0613
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_RESPONSE_MODEL: "gen_ai.response.model";
/**
 * The Generative AI product as identified by the client or server instrumentation.
 *
 * @example "openai"
 *
 * @note The `gen_ai.system` describes a family of GenAI models with specific model identified
 * by `gen_ai.request.model` and `gen_ai.response.model` attributes.
 *
 * The actual GenAI product may differ from the one identified by the client.
 * Multiple systems, including Azure OpenAI and Gemini, are accessible by OpenAI client
 * libraries. In such cases, the `gen_ai.system` is set to `openai` based on the
 * instrumentation's best knowledge, instead of the actual system. The `server.address`
 * attribute may help identify the actual system in use for `openai`.
 *
 * For custom model, a custom friendly name **SHOULD** be used.
 * If none of these options apply, the `gen_ai.system` **SHOULD** be set to `_OTHER`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_SYSTEM: "gen_ai.system";
/**
* Enum value "anthropic" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_ANTHROPIC: "anthropic";
/**
* Enum value "aws.bedrock" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_AWS_BEDROCK: "aws.bedrock";
/**
* Enum value "az.ai.inference" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_AZ_AI_INFERENCE: "az.ai.inference";
/**
* Enum value "az.ai.openai" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_AZ_AI_OPENAI: "az.ai.openai";
/**
* Enum value "cohere" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_COHERE: "cohere";
/**
* Enum value "deepseek" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_DEEPSEEK: "deepseek";
/**
* Enum value "gemini" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_GEMINI: "gemini";
/**
* Enum value "groq" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_GROQ: "groq";
/**
* Enum value "ibm.watsonx.ai" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_IBM_WATSONX_AI: "ibm.watsonx.ai";
/**
* Enum value "mistral_ai" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_MISTRAL_AI: "mistral_ai";
/**
* Enum value "openai" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_OPENAI: "openai";
/**
* Enum value "perplexity" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_PERPLEXITY: "perplexity";
/**
* Enum value "vertex_ai" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_VERTEX_AI: "vertex_ai";
/**
* Enum value "xai" for attribute {@link ATTR_GEN_AI_SYSTEM}.
*/
declare const GEN_AI_SYSTEM_VALUE_XAI: "xai";
/**
 * The type of token being counted.
 *
 * @example input
 * @example output
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_TOKEN_TYPE: "gen_ai.token.type";
/**
* Enum value "input" for attribute {@link ATTR_GEN_AI_TOKEN_TYPE}.
*/
declare const GEN_AI_TOKEN_TYPE_VALUE_INPUT: "input";
/**
* Enum value "output" for attribute {@link ATTR_GEN_AI_TOKEN_TYPE}.
*/
declare const GEN_AI_TOKEN_TYPE_VALUE_COMPLETION: "output";
/**
 * Deprecated, use `gen_ai.usage.output_tokens` instead.
 *
 * @example 42
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `gen_ai.usage.output_tokens` attribute.
 */
declare const ATTR_GEN_AI_USAGE_COMPLETION_TOKENS: "gen_ai.usage.completion_tokens";
/**
 * The number of tokens used in the GenAI input (prompt).
 *
 * @example 100
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_USAGE_INPUT_TOKENS: "gen_ai.usage.input_tokens";
/**
 * The number of tokens used in the GenAI response (completion).
 *
 * @example 180
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEN_AI_USAGE_OUTPUT_TOKENS: "gen_ai.usage.output_tokens";
/**
 * Deprecated, use `gen_ai.usage.input_tokens` instead.
 *
 * @example 42
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `gen_ai.usage.input_tokens` attribute.
 */
declare const ATTR_GEN_AI_USAGE_PROMPT_TOKENS: "gen_ai.usage.prompt_tokens";
/**
 * Two-letter code representing continent’s name.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEO_CONTINENT_CODE: "geo.continent.code";
/**
* Enum value "AF" for attribute {@link ATTR_GEO_CONTINENT_CODE}.
*/
declare const GEO_CONTINENT_CODE_VALUE_AF: "AF";
/**
* Enum value "AN" for attribute {@link ATTR_GEO_CONTINENT_CODE}.
*/
declare const GEO_CONTINENT_CODE_VALUE_AN: "AN";
/**
* Enum value "AS" for attribute {@link ATTR_GEO_CONTINENT_CODE}.
*/
declare const GEO_CONTINENT_CODE_VALUE_AS: "AS";
/**
* Enum value "EU" for attribute {@link ATTR_GEO_CONTINENT_CODE}.
*/
declare const GEO_CONTINENT_CODE_VALUE_EU: "EU";
/**
* Enum value "NA" for attribute {@link ATTR_GEO_CONTINENT_CODE}.
*/
declare const GEO_CONTINENT_CODE_VALUE_NA: "NA";
/**
* Enum value "OC" for attribute {@link ATTR_GEO_CONTINENT_CODE}.
*/
declare const GEO_CONTINENT_CODE_VALUE_OC: "OC";
/**
* Enum value "SA" for attribute {@link ATTR_GEO_CONTINENT_CODE}.
*/
declare const GEO_CONTINENT_CODE_VALUE_SA: "SA";
/**
 * Two-letter ISO Country Code ([ISO 3166-1 alpha2](https://wikipedia.org/wiki/ISO_3166-1#Codes)).
 *
 * @example CA
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEO_COUNTRY_ISO_CODE: "geo.country.iso_code";
/**
 * Locality name. Represents the name of a city, town, village, or similar populated place.
 *
 * @example Montreal
 * @example Berlin
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEO_LOCALITY_NAME: "geo.locality.name";
/**
 * Latitude of the geo location in [WGS84](https://wikipedia.org/wiki/World_Geodetic_System#WGS84).
 *
 * @example 45.505918
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEO_LOCATION_LAT: "geo.location.lat";
/**
 * Longitude of the geo location in [WGS84](https://wikipedia.org/wiki/World_Geodetic_System#WGS84).
 *
 * @example -73.61483
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEO_LOCATION_LON: "geo.location.lon";
/**
 * Postal code associated with the location. Values appropriate for this field may also be known as a postcode or ZIP code and will vary widely from country to country.
 *
 * @example 94040
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEO_POSTAL_CODE: "geo.postal_code";
/**
 * Region ISO code ([ISO 3166-2](https://wikipedia.org/wiki/ISO_3166-2)).
 *
 * @example CA-QC
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GEO_REGION_ISO_CODE: "geo.region.iso_code";
/**
 * The type of memory.
 *
 * @example other
 * @example stack
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GO_MEMORY_TYPE: "go.memory.type";
/**
* Enum value "other" for attribute {@link ATTR_GO_MEMORY_TYPE}.
*/
declare const GO_MEMORY_TYPE_VALUE_OTHER: "other";
/**
* Enum value "stack" for attribute {@link ATTR_GO_MEMORY_TYPE}.
*/
declare const GO_MEMORY_TYPE_VALUE_STACK: "stack";
/**
 * The GraphQL document being executed.
 *
 * @example "query findBookById { bookById(id: ?) { name } }"
 *
 * @note The value may be sanitized to exclude sensitive information.
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GRAPHQL_DOCUMENT: "graphql.document";
/**
 * The name of the operation being executed.
 *
 * @example "findBookById"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GRAPHQL_OPERATION_NAME: "graphql.operation.name";
/**
 * The type of the operation being executed.
 *
 * @example query
 * @example mutation
 * @example subscription
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_GRAPHQL_OPERATION_TYPE: "graphql.operation.type";
/**
* Enum value "mutation" for attribute {@link ATTR_GRAPHQL_OPERATION_TYPE}.
*/
declare const GRAPHQL_OPERATION_TYPE_VALUE_MUTATION: "mutation";
/**
* Enum value "query" for attribute {@link ATTR_GRAPHQL_OPERATION_TYPE}.
*/
declare const GRAPHQL_OPERATION_TYPE_VALUE_QUERY: "query";
/**
* Enum value "subscription" for attribute {@link ATTR_GRAPHQL_OPERATION_TYPE}.
*/
declare const GRAPHQL_OPERATION_TYPE_VALUE_SUBSCRIPTION: "subscription";
/**
 * Unique identifier for the application
 *
 * @example 2daa2797-e42b-4624-9322-ec3f968df4da
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HEROKU_APP_ID: "heroku.app.id";
/**
 * Commit hash for the current release
 *
 * @example e6134959463efd8966b20e75b913cafe3f5ec
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HEROKU_RELEASE_COMMIT: "heroku.release.commit";
/**
 * Time and date the release was created
 *
 * @example 2022-10-23T18:00:42Z
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HEROKU_RELEASE_CREATION_TIMESTAMP: "heroku.release.creation_timestamp";
/**
 * The CPU architecture the host system is running on.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_ARCH: "host.arch";
/**
* Enum value "amd64" for attribute {@link ATTR_HOST_ARCH}.
*/
declare const HOST_ARCH_VALUE_AMD64: "amd64";
/**
* Enum value "arm32" for attribute {@link ATTR_HOST_ARCH}.
*/
declare const HOST_ARCH_VALUE_ARM32: "arm32";
/**
* Enum value "arm64" for attribute {@link ATTR_HOST_ARCH}.
*/
declare const HOST_ARCH_VALUE_ARM64: "arm64";
/**
* Enum value "ia64" for attribute {@link ATTR_HOST_ARCH}.
*/
declare const HOST_ARCH_VALUE_IA64: "ia64";
/**
* Enum value "ppc32" for attribute {@link ATTR_HOST_ARCH}.
*/
declare const HOST_ARCH_VALUE_PPC32: "ppc32";
/**
* Enum value "ppc64" for attribute {@link ATTR_HOST_ARCH}.
*/
declare const HOST_ARCH_VALUE_PPC64: "ppc64";
/**
* Enum value "s390x" for attribute {@link ATTR_HOST_ARCH}.
*/
declare const HOST_ARCH_VALUE_S390X: "s390x";
/**
* Enum value "x86" for attribute {@link ATTR_HOST_ARCH}.
*/
declare const HOST_ARCH_VALUE_X86: "x86";
/**
 * The amount of level 2 memory cache available to the processor (in Bytes).
 *
 * @example 12288000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_CPU_CACHE_L2_SIZE: "host.cpu.cache.l2.size";
/**
 * Family or generation of the CPU.
 *
 * @example 6
 * @example PA-RISC 1.1e
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_CPU_FAMILY: "host.cpu.family";
/**
 * Model identifier. It provides more granular information about the CPU, distinguishing it from other CPUs within the same family.
 *
 * @example 6
 * @example 9000/778/B180L
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_CPU_MODEL_ID: "host.cpu.model.id";
/**
 * Model designation of the processor.
 *
 * @example 11th Gen Intel(R) Core(TM) i7-1185G7 @ 3.00GHz
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_CPU_MODEL_NAME: "host.cpu.model.name";
/**
 * Stepping or core revisions.
 *
 * @example 1
 * @example r1p1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_CPU_STEPPING: "host.cpu.stepping";
/**
 * Processor manufacturer identifier. A maximum 12-character string.
 *
 * @example GenuineIntel
 *
 * @note [CPUID](https://wiki.osdev.org/CPUID) command returns the vendor ID string in EBX, EDX and ECX registers. Writing these to memory in this order results in a 12-character string.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_CPU_VENDOR_ID: "host.cpu.vendor.id";
/**
 * Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider. For non-containerized systems, this should be the `machine-id`. See the table below for the sources to use to determine the `machine-id` based on operating system.
 *
 * @example fdbf79e8af94cb7f9e8df36789187052
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_ID: "host.id";
/**
 * VM image ID or host OS image ID. For Cloud, this value is from the provider.
 *
 * @example ami-07b06b442921831e5
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_IMAGE_ID: "host.image.id";
/**
 * Name of the VM image or OS install the host was instantiated from.
 *
 * @example infra-ami-eks-worker-node-7d4ec78312
 * @example CentOS-8-x86_64-1905
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_IMAGE_NAME: "host.image.name";
/**
 * The version string of the VM image or host OS as defined in [Version Attributes](/docs/resource/README.md#version-attributes).
 *
 * @example 0.1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_IMAGE_VERSION: "host.image.version";
/**
 * Available IP addresses of the host, excluding loopback interfaces.
 *
 * @example ["192.168.1.140", "fe80::abc2:4a28:737a:609e"]
 *
 * @note IPv4 Addresses **MUST** be specified in dotted-quad notation. IPv6 addresses **MUST** be specified in the [RFC 5952](https://www.rfc-editor.org/rfc/rfc5952.html) format.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_IP: "host.ip";
/**
 * Available MAC addresses of the host, excluding loopback interfaces.
 *
 * @example ["AC-DE-48-23-45-67", "AC-DE-48-23-45-67-01-9F"]
 *
 * @note MAC Addresses **MUST** be represented in [IEEE RA hexadecimal form](https://standards.ieee.org/wp-content/uploads/import/documents/tutorials/eui.pdf): as hyphen-separated octets in uppercase hexadecimal form from most to least significant.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_MAC: "host.mac";
/**
 * Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
 *
 * @example opentelemetry-test
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_NAME: "host.name";
/**
 * Type of host. For Cloud, this must be the machine type.
 *
 * @example n1-standard-1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HOST_TYPE: "host.type";
/**
 * Deprecated, use `client.address` instead.
 *
 * @example "83.164.160.102"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `client.address`.
 */
declare const ATTR_HTTP_CLIENT_IP: "http.client_ip";
/**
 * State of the HTTP connection in the HTTP connection pool.
 *
 * @example active
 * @example idle
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HTTP_CONNECTION_STATE: "http.connection.state";
/**
* Enum value "active" for attribute {@link ATTR_HTTP_CONNECTION_STATE}.
*/
declare const HTTP_CONNECTION_STATE_VALUE_ACTIVE: "active";
/**
* Enum value "idle" for attribute {@link ATTR_HTTP_CONNECTION_STATE}.
*/
declare const HTTP_CONNECTION_STATE_VALUE_IDLE: "idle";
/**
 * Deprecated, use `network.protocol.name` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.protocol.name`.
 */
declare const ATTR_HTTP_FLAVOR: "http.flavor";
/**
* Enum value "1.0" for attribute {@link ATTR_HTTP_FLAVOR}.
*/
declare const HTTP_FLAVOR_VALUE_HTTP_1_0: "1.0";
/**
* Enum value "1.1" for attribute {@link ATTR_HTTP_FLAVOR}.
*/
declare const HTTP_FLAVOR_VALUE_HTTP_1_1: "1.1";
/**
* Enum value "2.0" for attribute {@link ATTR_HTTP_FLAVOR}.
*/
declare const HTTP_FLAVOR_VALUE_HTTP_2_0: "2.0";
/**
* Enum value "3.0" for attribute {@link ATTR_HTTP_FLAVOR}.
*/
declare const HTTP_FLAVOR_VALUE_HTTP_3_0: "3.0";
/**
* Enum value "QUIC" for attribute {@link ATTR_HTTP_FLAVOR}.
*/
declare const HTTP_FLAVOR_VALUE_QUIC: "QUIC";
/**
* Enum value "SPDY" for attribute {@link ATTR_HTTP_FLAVOR}.
*/
declare const HTTP_FLAVOR_VALUE_SPDY: "SPDY";
/**
 * Deprecated, use one of `server.address`, `client.address` or `http.request.header.host` instead, depending on the usage.
 *
 * @example www.example.org
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by one of `server.address`, `client.address` or `http.request.header.host`, depending on the usage.
 */
declare const ATTR_HTTP_HOST: "http.host";
/**
 * Deprecated, use `http.request.method` instead.
 *
 * @example GET
 * @example POST
 * @example HEAD
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `http.request.method`.
 */
declare const ATTR_HTTP_METHOD: "http.method";
/**
 * The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#field.content-length) header. For requests using transport encoding, this should be the compressed size.
 *
 * @example 3495
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HTTP_REQUEST_BODY_SIZE: "http.request.body.size";
/**
 * The total size of the request in bytes. This should be the total number of bytes sent over the wire, including the request line (HTTP/1.1), framing (HTTP/2 and HTTP/3), headers, and request body if any.
 *
 * @example 1437
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HTTP_REQUEST_SIZE: "http.request.size";
/**
 * Deprecated, use `http.request.header.<key>` instead.
 *
 * @example 3495
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `http.request.header.<key>`.
 */
declare const ATTR_HTTP_REQUEST_CONTENT_LENGTH: "http.request_content_length";
/**
 * Deprecated, use `http.request.body.size` instead.
 *
 * @example 5493
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `http.request.body.size`.
 */
declare const ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED: "http.request_content_length_uncompressed";
/**
 * The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#field.content-length) header. For requests using transport encoding, this should be the compressed size.
 *
 * @example 3495
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HTTP_RESPONSE_BODY_SIZE: "http.response.body.size";
/**
 * The total size of the response in bytes. This should be the total number of bytes sent over the wire, including the status line (HTTP/1.1), framing (HTTP/2 and HTTP/3), headers, and response body and trailers if any.
 *
 * @example 1437
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HTTP_RESPONSE_SIZE: "http.response.size";
/**
 * Deprecated, use `http.response.header.<key>` instead.
 *
 * @example 3495
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `http.response.header.<key>`.
 */
declare const ATTR_HTTP_RESPONSE_CONTENT_LENGTH: "http.response_content_length";
/**
 * Deprecated, use `http.response.body.size` instead.
 *
 * @example 5493
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replace by `http.response.body.size`.
 */
declare const ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED: "http.response_content_length_uncompressed";
/**
 * Deprecated, use `url.scheme` instead.
 *
 * @example http
 * @example https
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `url.scheme` instead.
 */
declare const ATTR_HTTP_SCHEME: "http.scheme";
/**
 * Deprecated, use `server.address` instead.
 *
 * @example example.com
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `server.address`.
 */
declare const ATTR_HTTP_SERVER_NAME: "http.server_name";
/**
 * Deprecated, use `http.response.status_code` instead.
 *
 * @example 200
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `http.response.status_code`.
 */
declare const ATTR_HTTP_STATUS_CODE: "http.status_code";
/**
 * Deprecated, use `url.path` and `url.query` instead.
 *
 * @example /search?q=OpenTelemetry#SemConv
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Split to `url.path` and `url.query.
 */
declare const ATTR_HTTP_TARGET: "http.target";
/**
 * Deprecated, use `url.full` instead.
 *
 * @example https://www.foo.bar/search?q=OpenTelemetry#SemConv
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `url.full`.
 */
declare const ATTR_HTTP_URL: "http.url";
/**
 * Deprecated, use `user_agent.original` instead.
 *
 * @example CERN-LineMode/2.15 libwww/2.17b3
 * @example Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `user_agent.original`.
 */
declare const ATTR_HTTP_USER_AGENT: "http.user_agent";
/**
 * An identifier for the hardware component, unique within the monitored host
 *
 * @example win32battery_battery_testsysa33_1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HW_ID: "hw.id";
/**
 * An easily-recognizable name for the hardware component
 *
 * @example eth0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HW_NAME: "hw.name";
/**
 * Unique identifier of the parent component (typically the `hw.id` attribute of the enclosure, or disk controller)
 *
 * @example dellStorage_perc_0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HW_PARENT: "hw.parent";
/**
 * The current state of the component
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HW_STATE: "hw.state";
/**
* Enum value "degraded" for attribute {@link ATTR_HW_STATE}.
*/
declare const HW_STATE_VALUE_DEGRADED: "degraded";
/**
* Enum value "failed" for attribute {@link ATTR_HW_STATE}.
*/
declare const HW_STATE_VALUE_FAILED: "failed";
/**
* Enum value "ok" for attribute {@link ATTR_HW_STATE}.
*/
declare const HW_STATE_VALUE_OK: "ok";
/**
 * Type of the component
 *
 * @note Describes the category of the hardware component for which `hw.state` is being reported. For example, `hw.type=temperature` along with `hw.state=degraded` would indicate that the temperature of the hardware component has been reported as `degraded`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_HW_TYPE: "hw.type";
/**
* Enum value "battery" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_BATTERY: "battery";
/**
* Enum value "cpu" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_CPU: "cpu";
/**
* Enum value "disk_controller" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_DISK_CONTROLLER: "disk_controller";
/**
* Enum value "enclosure" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_ENCLOSURE: "enclosure";
/**
* Enum value "fan" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_FAN: "fan";
/**
* Enum value "gpu" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_GPU: "gpu";
/**
* Enum value "logical_disk" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_LOGICAL_DISK: "logical_disk";
/**
* Enum value "memory" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_MEMORY: "memory";
/**
* Enum value "network" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_NETWORK: "network";
/**
* Enum value "physical_disk" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_PHYSICAL_DISK: "physical_disk";
/**
* Enum value "power_supply" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_POWER_SUPPLY: "power_supply";
/**
* Enum value "tape_drive" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_TAPE_DRIVE: "tape_drive";
/**
* Enum value "temperature" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_TEMPERATURE: "temperature";
/**
* Enum value "voltage" for attribute {@link ATTR_HW_TYPE}.
*/
declare const HW_TYPE_VALUE_VOLTAGE: "voltage";
/**
 * Deprecated use the `device.app.lifecycle` event definition including `ios.state` as a payload field instead.
 *
 * @note The iOS lifecycle states are defined in the [UIApplicationDelegate documentation](https://developer.apple.com/documentation/uikit/uiapplicationdelegate#1656902), and from which the `OS terminology` column values are derived.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Moved to a payload field of `device.app.lifecycle`.
 */
declare const ATTR_IOS_STATE: "ios.state";
/**
* Enum value "active" for attribute {@link ATTR_IOS_STATE}.
*/
declare const IOS_STATE_VALUE_ACTIVE: "active";
/**
* Enum value "background" for attribute {@link ATTR_IOS_STATE}.
*/
declare const IOS_STATE_VALUE_BACKGROUND: "background";
/**
* Enum value "foreground" for attribute {@link ATTR_IOS_STATE}.
*/
declare const IOS_STATE_VALUE_FOREGROUND: "foreground";
/**
* Enum value "inactive" for attribute {@link ATTR_IOS_STATE}.
*/
declare const IOS_STATE_VALUE_INACTIVE: "inactive";
/**
* Enum value "terminate" for attribute {@link ATTR_IOS_STATE}.
*/
declare const IOS_STATE_VALUE_TERMINATE: "terminate";
/**
 * Name of the buffer pool.
 *
 * @example mapped
 * @example direct
 *
 * @note Pool names are generally obtained via [BufferPoolMXBean#getName()](https://docs.oracle.com/en/java/javase/11/docs/api/java.management/java/lang/management/BufferPoolMXBean.html#getName()).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_JVM_BUFFER_POOL_NAME: "jvm.buffer.pool.name";
/**
 * The name of the cluster.
 *
 * @example opentelemetry-cluster
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_CLUSTER_NAME: "k8s.cluster.name";
/**
 * A pseudo-ID for the cluster, set to the UID of the `kube-system` namespace.
 *
 * @example 218fc5a9-a5f1-4b54-aa05-46717d0ab26d
 *
 * @note K8s doesn't have support for obtaining a cluster ID. If this is ever
 * added, we will recommend collecting the `k8s.cluster.uid` through the
 * official APIs. In the meantime, we are able to use the `uid` of the
 * `kube-system` namespace as a proxy for cluster ID. Read on for the
 * rationale.
 *
 * Every object created in a K8s cluster is assigned a distinct UID. The
 * `kube-system` namespace is used by Kubernetes itself and will exist
 * for the lifetime of the cluster. Using the `uid` of the `kube-system`
 * namespace is a reasonable proxy for the K8s ClusterID as it will only
 * change if the cluster is rebuilt. Furthermore, Kubernetes UIDs are
 * UUIDs as standardized by
 * [ISO/IEC 9834-8 and ITU-T X.667](https://www.itu.int/ITU-T/studygroups/com17/oid.html).
 * Which states:
 *
 * > If generated according to one of the mechanisms defined in Rec.
 * > ITU-T X.667 | ISO/IEC 9834-8, a UUID is either guaranteed to be
 * > different from all other UUIDs generated before 3603 A.D., or is
 * > extremely likely to be different (depending on the mechanism chosen).
 *
 * Therefore, UIDs between clusters should be extremely unlikely to
 * conflict.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_CLUSTER_UID: "k8s.cluster.uid";
/**
 * The name of the Container from Pod specification, must be unique within a Pod. Container runtime usually uses different globally unique name (`container.name`).
 *
 * @example redis
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_CONTAINER_NAME: "k8s.container.name";
/**
 * Number of times the container was restarted. This attribute can be used to identify a particular container (running or stopped) within a container spec.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_CONTAINER_RESTART_COUNT: "k8s.container.restart_count";
/**
 * Last terminated reason of the Container.
 *
 * @example Evicted
 * @example Error
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_CONTAINER_STATUS_LAST_TERMINATED_REASON: "k8s.container.status.last_terminated_reason";
/**
 * The name of the CronJob.
 *
 * @example opentelemetry
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_CRONJOB_NAME: "k8s.cronjob.name";
/**
 * The UID of the CronJob.
 *
 * @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_CRONJOB_UID: "k8s.cronjob.uid";
/**
 * The name of the DaemonSet.
 *
 * @example opentelemetry
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_DAEMONSET_NAME: "k8s.daemonset.name";
/**
 * The UID of the DaemonSet.
 *
 * @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_DAEMONSET_UID: "k8s.daemonset.uid";
/**
 * The name of the Deployment.
 *
 * @example opentelemetry
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_DEPLOYMENT_NAME: "k8s.deployment.name";
/**
 * The UID of the Deployment.
 *
 * @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_DEPLOYMENT_UID: "k8s.deployment.uid";
/**
 * The name of the Job.
 *
 * @example opentelemetry
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_JOB_NAME: "k8s.job.name";
/**
 * The UID of the Job.
 *
 * @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_JOB_UID: "k8s.job.uid";
/**
 * The name of the namespace that the pod is running in.
 *
 * @example default
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_NAMESPACE_NAME: "k8s.namespace.name";
/**
 * The phase of the K8s namespace.
 *
 * @example active
 * @example terminating
 *
 * @note This attribute aligns with the `phase` field of the
 * [K8s NamespaceStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#namespacestatus-v1-core)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_NAMESPACE_PHASE: "k8s.namespace.phase";
/**
* Enum value "active" for attribute {@link ATTR_K8S_NAMESPACE_PHASE}.
*/
declare const K8S_NAMESPACE_PHASE_VALUE_ACTIVE: "active";
/**
* Enum value "terminating" for attribute {@link ATTR_K8S_NAMESPACE_PHASE}.
*/
declare const K8S_NAMESPACE_PHASE_VALUE_TERMINATING: "terminating";
/**
 * The name of the Node.
 *
 * @example node-1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_NODE_NAME: "k8s.node.name";
/**
 * The UID of the Node.
 *
 * @example 1eb3a0c6-0477-4080-a9cb-0cb7db65c6a2
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_NODE_UID: "k8s.node.uid";
/**
 * The annotation key-value pairs placed on the Pod, the `<key>` being the annotation name, the value being the annotation value.
 *
 * @example k8s.pod.annotation.kubernetes.io/enforce-mountable-secrets=true
 * @example k8s.pod.annotation.mycompany.io/arch=x64
 * @example k8s.pod.annotation.data=
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_POD_ANNOTATION: (key: string) => string;
/**
 * The label key-value pairs placed on the Pod, the `<key>` being the label name, the value being the label value.
 *
 * @example k8s.pod.label.app=my-app
 * @example k8s.pod.label.mycompany.io/arch=x64
 * @example k8s.pod.label.data=
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_POD_LABEL: (key: string) => string;
/**
 * Deprecated, use `k8s.pod.label` instead.
 *
 * @example k8s.pod.label.app=my-app
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `k8s.pod.label`.
 */
declare const ATTR_K8S_POD_LABELS: (key: string) => string;
/**
 * The name of the Pod.
 *
 * @example opentelemetry-pod-autoconf
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_POD_NAME: "k8s.pod.name";
/**
 * The UID of the Pod.
 *
 * @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_POD_UID: "k8s.pod.uid";
/**
 * The name of the ReplicaSet.
 *
 * @example opentelemetry
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_REPLICASET_NAME: "k8s.replicaset.name";
/**
 * The UID of the ReplicaSet.
 *
 * @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_REPLICASET_UID: "k8s.replicaset.uid";
/**
 * The name of the StatefulSet.
 *
 * @example opentelemetry
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_STATEFULSET_NAME: "k8s.statefulset.name";
/**
 * The UID of the StatefulSet.
 *
 * @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_STATEFULSET_UID: "k8s.statefulset.uid";
/**
 * The name of the K8s volume.
 *
 * @example volume0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_VOLUME_NAME: "k8s.volume.name";
/**
 * The type of the K8s volume.
 *
 * @example emptyDir
 * @example persistentVolumeClaim
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_K8S_VOLUME_TYPE: "k8s.volume.type";
/**
* Enum value "configMap" for attribute {@link ATTR_K8S_VOLUME_TYPE}.
*/
declare const K8S_VOLUME_TYPE_VALUE_CONFIG_MAP: "configMap";
/**
* Enum value "downwardAPI" for attribute {@link ATTR_K8S_VOLUME_TYPE}.
*/
declare const K8S_VOLUME_TYPE_VALUE_DOWNWARD_API: "downwardAPI";
/**
* Enum value "emptyDir" for attribute {@link ATTR_K8S_VOLUME_TYPE}.
*/
declare const K8S_VOLUME_TYPE_VALUE_EMPTY_DIR: "emptyDir";
/**
* Enum value "local" for attribute {@link ATTR_K8S_VOLUME_TYPE}.
*/
declare const K8S_VOLUME_TYPE_VALUE_LOCAL: "local";
/**
* Enum value "persistentVolumeClaim" for attribute {@link ATTR_K8S_VOLUME_TYPE}.
*/
declare const K8S_VOLUME_TYPE_VALUE_PERSISTENT_VOLUME_CLAIM: "persistentVolumeClaim";
/**
* Enum value "secret" for attribute {@link ATTR_K8S_VOLUME_TYPE}.
*/
declare const K8S_VOLUME_TYPE_VALUE_SECRET: "secret";
/**
 * The Linux Slab memory state
 *
 * @example reclaimable
 * @example unreclaimable
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_LINUX_MEMORY_SLAB_STATE: "linux.memory.slab.state";
/**
* Enum value "reclaimable" for attribute {@link ATTR_LINUX_MEMORY_SLAB_STATE}.
*/
declare const LINUX_MEMORY_SLAB_STATE_VALUE_RECLAIMABLE: "reclaimable";
/**
* Enum value "unreclaimable" for attribute {@link ATTR_LINUX_MEMORY_SLAB_STATE}.
*/
declare const LINUX_MEMORY_SLAB_STATE_VALUE_UNRECLAIMABLE: "unreclaimable";
/**
 * The basename of the file.
 *
 * @example audit.log
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_LOG_FILE_NAME: "log.file.name";
/**
 * The basename of the file, with symlinks resolved.
 *
 * @example uuid.log
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_LOG_FILE_NAME_RESOLVED: "log.file.name_resolved";
/**
 * The full path to the file.
 *
 * @example /var/log/mysql/audit.log
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_LOG_FILE_PATH: "log.file.path";
/**
 * The full path to the file, with symlinks resolved.
 *
 * @example /var/lib/docker/uuid.log
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_LOG_FILE_PATH_RESOLVED: "log.file.path_resolved";
/**
 * The stream associated with the log. See below for a list of well-known values.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_LOG_IOSTREAM: "log.iostream";
/**
* Enum value "stderr" for attribute {@link ATTR_LOG_IOSTREAM}.
*/
declare const LOG_IOSTREAM_VALUE_STDERR: "stderr";
/**
* Enum value "stdout" for attribute {@link ATTR_LOG_IOSTREAM}.
*/
declare const LOG_IOSTREAM_VALUE_STDOUT: "stdout";
/**
 * The complete original Log Record.
 *
 * @example 77 <86>1 2015-08-06T21:58:59.694Z 192.168.2.133 inactive - - - Something happened
 * @example [INFO] 8/3/24 12:34:56 Something happened
 *
 * @note This value **MAY** be added when processing a Log Record which was originally transmitted as a string or equivalent data type AND the Body field of the Log Record does not contain the same value. (e.g. a syslog or a log record read from a file.)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_LOG_RECORD_ORIGINAL: "log.record.original";
/**
 * A unique identifier for the Log Record.
 *
 * @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
 *
 * @note If an id is provided, other log records with the same id will be considered duplicates and can be removed safely. This means, that two distinguishable log records **MUST** have different values.
 * The id **MAY** be an [Universally Unique Lexicographically Sortable Identifier (ULID)](https://github.com/ulid/spec), but other identifiers (e.g. UUID) may be used as needed.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_LOG_RECORD_UID: "log.record.uid";
/**
 * Deprecated, use `rpc.message.compressed_size` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `rpc.message.compressed_size`.
 */
declare const ATTR_MESSAGE_COMPRESSED_SIZE: "message.compressed_size";
/**
 * Deprecated, use `rpc.message.id` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `rpc.message.id`.
 */
declare const ATTR_MESSAGE_ID: "message.id";
/**
 * Deprecated, use `rpc.message.type` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `rpc.message.type`.
 */
declare const ATTR_MESSAGE_TYPE: "message.type";
/**
* Enum value "RECEIVED" for attribute {@link ATTR_MESSAGE_TYPE}.
*/
declare const MESSAGE_TYPE_VALUE_RECEIVED: "RECEIVED";
/**
* Enum value "SENT" for attribute {@link ATTR_MESSAGE_TYPE}.
*/
declare const MESSAGE_TYPE_VALUE_SENT: "SENT";
/**
 * Deprecated, use `rpc.message.uncompressed_size` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `rpc.message.uncompressed_size`.
 */
declare const ATTR_MESSAGE_UNCOMPRESSED_SIZE: "message.uncompressed_size";
/**
 * The number of messages sent, received, or processed in the scope of the batching operation.
 *
 * @example 0
 * @example 1
 * @example 2
 *
 * @note Instrumentations **SHOULD NOT** set `messaging.batch.message_count` on spans that operate with a single message. When a messaging client library supports both batch and single-message API for the same operation, instrumentations **SHOULD** use `messaging.batch.message_count` for batching APIs and **SHOULD NOT** use it for single-message APIs.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_BATCH_MESSAGE_COUNT: "messaging.batch.message_count";
/**
 * A unique identifier for the client that consumes or produces a message.
 *
 * @example client-5
 * @example myhost@8742@s8083jm
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_CLIENT_ID: "messaging.client.id";
/**
 * The name of the consumer group with which a consumer is associated.
 *
 * @example my-group
 * @example indexer
 *
 * @note Semantic conventions for individual messaging systems **SHOULD** document whether `messaging.consumer.group.name` is applicable and what it means in the context of that system.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_CONSUMER_GROUP_NAME: "messaging.consumer.group.name";
/**
 * A boolean that is true if the message destination is anonymous (could be unnamed or have auto-generated name).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_DESTINATION_ANONYMOUS: "messaging.destination.anonymous";
/**
 * The message destination name
 *
 * @example MyQueue
 * @example MyTopic
 *
 * @note Destination name **SHOULD** uniquely identify a specific queue, topic or other entity within the broker. If
 * the broker doesn't have such notion, the destination name **SHOULD** uniquely identify the broker.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_DESTINATION_NAME: "messaging.destination.name";
/**
 * The identifier of the partition messages are sent to or received from, unique within the `messaging.destination.name`.
 *
 * @example "1"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_DESTINATION_PARTITION_ID: "messaging.destination.partition.id";
/**
 * The name of the destination subscription from which a message is consumed.
 *
 * @example subscription-a
 *
 * @note Semantic conventions for individual messaging systems **SHOULD** document whether `messaging.destination.subscription.name` is applicable and what it means in the context of that system.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_DESTINATION_SUBSCRIPTION_NAME: "messaging.destination.subscription.name";
/**
 * Low cardinality representation of the messaging destination name
 *
 * @example /customers/{customerId}
 *
 * @note Destination names could be constructed from templates. An example would be a destination name involving a user name or product id. Although the destination name in this case is of high cardinality, the underlying template is of low cardinality and can be effectively used for grouping and aggregation.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_DESTINATION_TEMPLATE: "messaging.destination.template";
/**
 * A boolean that is true if the message destination is temporary and might not exist anymore after messages are processed.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_DESTINATION_TEMPORARY: "messaging.destination.temporary";
/**
 * Deprecated, no replacement at this time.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated No replacement at this time.
 */
declare const ATTR_MESSAGING_DESTINATION_PUBLISH_ANONYMOUS: "messaging.destination_publish.anonymous";
/**
 * Deprecated, no replacement at this time.
 *
 * @example MyQueue
 * @example MyTopic
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated No replacement at this time.
 */
declare const ATTR_MESSAGING_DESTINATION_PUBLISH_NAME: "messaging.destination_publish.name";
/**
 * Deprecated, use `messaging.consumer.group.name` instead.
 *
 * @example "$Default"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.consumer.group.name`.
 */
declare const ATTR_MESSAGING_EVENTHUBS_CONSUMER_GROUP: "messaging.eventhubs.consumer.group";
/**
 * The UTC epoch seconds at which the message has been accepted and stored in the entity.
 *
 * @example 1701393730
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_EVENTHUBS_MESSAGE_ENQUEUED_TIME: "messaging.eventhubs.message.enqueued_time";
/**
 * The ack deadline in seconds set for the modify ack deadline request.
 *
 * @example 10
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ACK_DEADLINE: "messaging.gcp_pubsub.message.ack_deadline";
/**
 * The ack id for a given message.
 *
 * @example "ack_id"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ACK_ID: "messaging.gcp_pubsub.message.ack_id";
/**
 * The delivery attempt for a given message.
 *
 * @example 2
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_DELIVERY_ATTEMPT: "messaging.gcp_pubsub.message.delivery_attempt";
/**
 * The ordering key for a given message. If the attribute is not present, the message does not have an ordering key.
 *
 * @example "ordering_key"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ORDERING_KEY: "messaging.gcp_pubsub.message.ordering_key";
/**
 * Deprecated, use `messaging.consumer.group.name` instead.
 *
 * @example "my-group"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.consumer.group.name`.
 */
declare const ATTR_MESSAGING_KAFKA_CONSUMER_GROUP: "messaging.kafka.consumer.group";
/**
 * Deprecated, use `messaging.destination.partition.id` instead.
 *
 * @example 2
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.destination.partition.id`.
 */
declare const ATTR_MESSAGING_KAFKA_DESTINATION_PARTITION: "messaging.kafka.destination.partition";
/**
 * Message keys in Kafka are used for grouping alike messages to ensure they're processed on the same partition. They differ from `messaging.message.id` in that they're not unique. If the key is `null`, the attribute **MUST NOT** be set.
 *
 * @example "myKey"
 *
 * @note If the key type is not string, it's string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don't include its value.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_KAFKA_MESSAGE_KEY: "messaging.kafka.message.key";
/**
 * Deprecated, use `messaging.kafka.offset` instead.
 *
 * @example 42
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.kafka.offset`.
 */
declare const ATTR_MESSAGING_KAFKA_MESSAGE_OFFSET: "messaging.kafka.message.offset";
/**
 * A boolean that is true if the message is a tombstone.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_KAFKA_MESSAGE_TOMBSTONE: "messaging.kafka.message.tombstone";
/**
 * The offset of a record in the corresponding Kafka partition.
 *
 * @example 42
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_KAFKA_OFFSET: "messaging.kafka.offset";
/**
 * The size of the message body in bytes.
 *
 * @example 1439
 *
 * @note This can refer to both the compressed or uncompressed body size. If both sizes are known, the uncompressed
 * body size should be used.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_MESSAGE_BODY_SIZE: "messaging.message.body.size";
/**
 * The conversation ID identifying the conversation to which the message belongs, represented as a string. Sometimes called "Correlation ID".
 *
 * @example "MyConversationId"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_MESSAGE_CONVERSATION_ID: "messaging.message.conversation_id";
/**
 * The size of the message body and metadata in bytes.
 *
 * @example 2738
 *
 * @note This can refer to both the compressed or uncompressed size. If both sizes are known, the uncompressed
 * size should be used.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_MESSAGE_ENVELOPE_SIZE: "messaging.message.envelope.size";
/**
 * A value used by the messaging system as an identifier for the message, represented as a string.
 *
 * @example "452a7c7c7c7048c2f887f61572b18fc2"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_MESSAGE_ID: "messaging.message.id";
/**
 * Deprecated, use `messaging.operation.type` instead.
 *
 * @example publish
 * @example create
 * @example process
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.operation.type`.
 */
declare const ATTR_MESSAGING_OPERATION: "messaging.operation";
/**
 * The system-specific name of the messaging operation.
 *
 * @example ack
 * @example nack
 * @example send
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_OPERATION_NAME: "messaging.operation.name";
/**
 * A string identifying the type of the messaging operation.
 *
 * @note If a custom value is used, it **MUST** be of low cardinality.
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_OPERATION_TYPE: "messaging.operation.type";
/**
* Enum value "create" for attribute {@link ATTR_MESSAGING_OPERATION_TYPE}.
*/
declare const MESSAGING_OPERATION_TYPE_VALUE_CREATE: "create";
/**
* Enum value "deliver" for attribute {@link ATTR_MESSAGING_OPERATION_TYPE}.
*/
declare const MESSAGING_OPERATION_TYPE_VALUE_DELIVER: "deliver";
/**
* Enum value "process" for attribute {@link ATTR_MESSAGING_OPERATION_TYPE}.
*/
declare const MESSAGING_OPERATION_TYPE_VALUE_PROCESS: "process";
/**
* Enum value "publish" for attribute {@link ATTR_MESSAGING_OPERATION_TYPE}.
*/
declare const MESSAGING_OPERATION_TYPE_VALUE_PUBLISH: "publish";
/**
* Enum value "receive" for attribute {@link ATTR_MESSAGING_OPERATION_TYPE}.
*/
declare const MESSAGING_OPERATION_TYPE_VALUE_RECEIVE: "receive";
/**
* Enum value "send" for attribute {@link ATTR_MESSAGING_OPERATION_TYPE}.
*/
declare const MESSAGING_OPERATION_TYPE_VALUE_SEND: "send";
/**
* Enum value "settle" for attribute {@link ATTR_MESSAGING_OPERATION_TYPE}.
*/
declare const MESSAGING_OPERATION_TYPE_VALUE_SETTLE: "settle";
/**
 * RabbitMQ message routing key.
 *
 * @example "myKey"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY: "messaging.rabbitmq.destination.routing_key";
/**
 * RabbitMQ message delivery tag
 *
 * @example 123
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_RABBITMQ_MESSAGE_DELIVERY_TAG: "messaging.rabbitmq.message.delivery_tag";
/**
 * Deprecated, use `messaging.consumer.group.name` instead.
 *
 * @example "myConsumerGroup"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.consumer.group.name` on the consumer spans. No replacement for producer spans.
 */
declare const ATTR_MESSAGING_ROCKETMQ_CLIENT_GROUP: "messaging.rocketmq.client_group";
/**
 * Model of message consumption. This only applies to consumer spans.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_ROCKETMQ_CONSUMPTION_MODEL: "messaging.rocketmq.consumption_model";
/**
* Enum value "broadcasting" for attribute {@link ATTR_MESSAGING_ROCKETMQ_CONSUMPTION_MODEL}.
*/
declare const MESSAGING_ROCKETMQ_CONSUMPTION_MODEL_VALUE_BROADCASTING: "broadcasting";
/**
* Enum value "clustering" for attribute {@link ATTR_MESSAGING_ROCKETMQ_CONSUMPTION_MODEL}.
*/
declare const MESSAGING_ROCKETMQ_CONSUMPTION_MODEL_VALUE_CLUSTERING: "clustering";
/**
 * The delay time level for delay message, which determines the message delay time.
 *
 * @example 3
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_ROCKETMQ_MESSAGE_DELAY_TIME_LEVEL: "messaging.rocketmq.message.delay_time_level";
/**
 * The timestamp in milliseconds that the delay message is expected to be delivered to consumer.
 *
 * @example 1665987217045
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_ROCKETMQ_MESSAGE_DELIVERY_TIMESTAMP: "messaging.rocketmq.message.delivery_timestamp";
/**
 * It is essential for FIFO message. Messages that belong to the same message group are always processed one by one within the same consumer group.
 *
 * @example "myMessageGroup"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_ROCKETMQ_MESSAGE_GROUP: "messaging.rocketmq.message.group";
/**
 * Key(s) of message, another way to mark message besides message id.
 *
 * @example ["keyA", "keyB"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_ROCKETMQ_MESSAGE_KEYS: "messaging.rocketmq.message.keys";
/**
 * The secondary classifier of message besides topic.
 *
 * @example "tagA"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_ROCKETMQ_MESSAGE_TAG: "messaging.rocketmq.message.tag";
/**
 * Type of message.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_ROCKETMQ_MESSAGE_TYPE: "messaging.rocketmq.message.type";
/**
* Enum value "delay" for attribute {@link ATTR_MESSAGING_ROCKETMQ_MESSAGE_TYPE}.
*/
declare const MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_DELAY: "delay";
/**
* Enum value "fifo" for attribute {@link ATTR_MESSAGING_ROCKETMQ_MESSAGE_TYPE}.
*/
declare const MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_FIFO: "fifo";
/**
* Enum value "normal" for attribute {@link ATTR_MESSAGING_ROCKETMQ_MESSAGE_TYPE}.
*/
declare const MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_NORMAL: "normal";
/**
* Enum value "transaction" for attribute {@link ATTR_MESSAGING_ROCKETMQ_MESSAGE_TYPE}.
*/
declare const MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_TRANSACTION: "transaction";
/**
 * Namespace of RocketMQ resources, resources in different namespaces are individual.
 *
 * @example "myNamespace"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_ROCKETMQ_NAMESPACE: "messaging.rocketmq.namespace";
/**
 * Deprecated, use `messaging.destination.subscription.name` instead.
 *
 * @example "subscription-a"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.destination.subscription.name`.
 */
declare const ATTR_MESSAGING_SERVICEBUS_DESTINATION_SUBSCRIPTION_NAME: "messaging.servicebus.destination.subscription_name";
/**
 * Describes the [settlement type](https://learn.microsoft.com/azure/service-bus-messaging/message-transfers-locks-settlement#peeklock).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_SERVICEBUS_DISPOSITION_STATUS: "messaging.servicebus.disposition_status";
/**
* Enum value "abandon" for attribute {@link ATTR_MESSAGING_SERVICEBUS_DISPOSITION_STATUS}.
*/
declare const MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_ABANDON: "abandon";
/**
* Enum value "complete" for attribute {@link ATTR_MESSAGING_SERVICEBUS_DISPOSITION_STATUS}.
*/
declare const MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_COMPLETE: "complete";
/**
* Enum value "dead_letter" for attribute {@link ATTR_MESSAGING_SERVICEBUS_DISPOSITION_STATUS}.
*/
declare const MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_DEAD_LETTER: "dead_letter";
/**
* Enum value "defer" for attribute {@link ATTR_MESSAGING_SERVICEBUS_DISPOSITION_STATUS}.
*/
declare const MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_DEFER: "defer";
/**
 * Number of deliveries that have been attempted for this message.
 *
 * @example 2
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_SERVICEBUS_MESSAGE_DELIVERY_COUNT: "messaging.servicebus.message.delivery_count";
/**
 * The UTC epoch seconds at which the message has been accepted and stored in the entity.
 *
 * @example 1701393730
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_SERVICEBUS_MESSAGE_ENQUEUED_TIME: "messaging.servicebus.message.enqueued_time";
/**
 * The messaging system as identified by the client instrumentation.
 *
 * @note The actual messaging system may differ from the one known by the client. For example, when using Kafka client libraries to communicate with Azure Event Hubs, the `messaging.system` is set to `kafka` based on the instrumentation's best knowledge.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_MESSAGING_SYSTEM: "messaging.system";
/**
* Enum value "activemq" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_ACTIVEMQ: "activemq";
/**
* Enum value "aws_sqs" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_AWS_SQS: "aws_sqs";
/**
* Enum value "eventgrid" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_EVENTGRID: "eventgrid";
/**
* Enum value "eventhubs" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_EVENTHUBS: "eventhubs";
/**
* Enum value "gcp_pubsub" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_GCP_PUBSUB: "gcp_pubsub";
/**
* Enum value "jms" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_JMS: "jms";
/**
* Enum value "kafka" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_KAFKA: "kafka";
/**
* Enum value "pulsar" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_PULSAR: "pulsar";
/**
* Enum value "rabbitmq" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_RABBITMQ: "rabbitmq";
/**
* Enum value "rocketmq" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_ROCKETMQ: "rocketmq";
/**
* Enum value "servicebus" for attribute {@link ATTR_MESSAGING_SYSTEM}.
*/
declare const MESSAGING_SYSTEM_VALUE_SERVICEBUS: "servicebus";
/**
 * Deprecated, use `network.local.address`.
 *
 * @example "192.168.0.1"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.local.address`.
 */
declare const ATTR_NET_HOST_IP: "net.host.ip";
/**
 * Deprecated, use `server.address`.
 *
 * @example example.com
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `server.address`.
 */
declare const ATTR_NET_HOST_NAME: "net.host.name";
/**
 * Deprecated, use `server.port`.
 *
 * @example 8080
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `server.port`.
 */
declare const ATTR_NET_HOST_PORT: "net.host.port";
/**
 * Deprecated, use `network.peer.address`.
 *
 * @example "127.0.0.1"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.peer.address`.
 */
declare const ATTR_NET_PEER_IP: "net.peer.ip";
/**
 * Deprecated, use `server.address` on client spans and `client.address` on server spans.
 *
 * @example example.com
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `server.address` on client spans and `client.address` on server spans.
 */
declare const ATTR_NET_PEER_NAME: "net.peer.name";
/**
 * Deprecated, use `server.port` on client spans and `client.port` on server spans.
 *
 * @example 8080
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `server.port` on client spans and `client.port` on server spans.
 */
declare const ATTR_NET_PEER_PORT: "net.peer.port";
/**
 * Deprecated, use `network.protocol.name`.
 *
 * @example amqp
 * @example http
 * @example mqtt
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.protocol.name`.
 */
declare const ATTR_NET_PROTOCOL_NAME: "net.protocol.name";
/**
 * Deprecated, use `network.protocol.version`.
 *
 * @example "3.1.1"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.protocol.version`.
 */
declare const ATTR_NET_PROTOCOL_VERSION: "net.protocol.version";
/**
 * Deprecated, use `network.transport` and `network.type`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Split to `network.transport` and `network.type`.
 */
declare const ATTR_NET_SOCK_FAMILY: "net.sock.family";
/**
* Enum value "inet" for attribute {@link ATTR_NET_SOCK_FAMILY}.
*/
declare const NET_SOCK_FAMILY_VALUE_INET: "inet";
/**
* Enum value "inet6" for attribute {@link ATTR_NET_SOCK_FAMILY}.
*/
declare const NET_SOCK_FAMILY_VALUE_INET6: "inet6";
/**
* Enum value "unix" for attribute {@link ATTR_NET_SOCK_FAMILY}.
*/
declare const NET_SOCK_FAMILY_VALUE_UNIX: "unix";
/**
 * Deprecated, use `network.local.address`.
 *
 * @example /var/my.sock
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.local.address`.
 */
declare const ATTR_NET_SOCK_HOST_ADDR: "net.sock.host.addr";
/**
 * Deprecated, use `network.local.port`.
 *
 * @example 8080
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.local.port`.
 */
declare const ATTR_NET_SOCK_HOST_PORT: "net.sock.host.port";
/**
 * Deprecated, use `network.peer.address`.
 *
 * @example 192.168.0.1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.peer.address`.
 */
declare const ATTR_NET_SOCK_PEER_ADDR: "net.sock.peer.addr";
/**
 * Deprecated, no replacement at this time.
 *
 * @example /var/my.sock
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Removed.
 */
declare const ATTR_NET_SOCK_PEER_NAME: "net.sock.peer.name";
/**
 * Deprecated, use `network.peer.port`.
 *
 * @example 65531
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.peer.port`.
 */
declare const ATTR_NET_SOCK_PEER_PORT: "net.sock.peer.port";
/**
 * Deprecated, use `network.transport`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `network.transport`.
 */
declare const ATTR_NET_TRANSPORT: "net.transport";
/**
* Enum value "inproc" for attribute {@link ATTR_NET_TRANSPORT}.
*/
declare const NET_TRANSPORT_VALUE_INPROC: "inproc";
/**
* Enum value "ip_tcp" for attribute {@link ATTR_NET_TRANSPORT}.
*/
declare const NET_TRANSPORT_VALUE_IP_TCP: "ip_tcp";
/**
* Enum value "ip_udp" for attribute {@link ATTR_NET_TRANSPORT}.
*/
declare const NET_TRANSPORT_VALUE_IP_UDP: "ip_udp";
/**
* Enum value "other" for attribute {@link ATTR_NET_TRANSPORT}.
*/
declare const NET_TRANSPORT_VALUE_OTHER: "other";
/**
* Enum value "pipe" for attribute {@link ATTR_NET_TRANSPORT}.
*/
declare const NET_TRANSPORT_VALUE_PIPE: "pipe";
/**
 * The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
 *
 * @example "DE"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_CARRIER_ICC: "network.carrier.icc";
/**
 * The mobile carrier country code.
 *
 * @example "310"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_CARRIER_MCC: "network.carrier.mcc";
/**
 * The mobile carrier network code.
 *
 * @example "001"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_CARRIER_MNC: "network.carrier.mnc";
/**
 * The name of the mobile carrier.
 *
 * @example "sprint"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_CARRIER_NAME: "network.carrier.name";
/**
 * The state of network connection
 *
 * @example close_wait
 *
 * @note Connection states are defined as part of the [rfc9293](https://datatracker.ietf.org/doc/html/rfc9293#section-3.3.2)
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_CONNECTION_STATE: "network.connection.state";
/**
* Enum value "close_wait" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_CLOSE_WAIT: "close_wait";
/**
* Enum value "closed" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_CLOSED: "closed";
/**
* Enum value "closing" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_CLOSING: "closing";
/**
* Enum value "established" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_ESTABLISHED: "established";
/**
* Enum value "fin_wait_1" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_FIN_WAIT_1: "fin_wait_1";
/**
* Enum value "fin_wait_2" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_FIN_WAIT_2: "fin_wait_2";
/**
* Enum value "last_ack" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_LAST_ACK: "last_ack";
/**
* Enum value "listen" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_LISTEN: "listen";
/**
* Enum value "syn_received" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_SYN_RECEIVED: "syn_received";
/**
* Enum value "syn_sent" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_SYN_SENT: "syn_sent";
/**
* Enum value "time_wait" for attribute {@link ATTR_NETWORK_CONNECTION_STATE}.
*/
declare const NETWORK_CONNECTION_STATE_VALUE_TIME_WAIT: "time_wait";
/**
 * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
 *
 * @example "LTE"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_CONNECTION_SUBTYPE: "network.connection.subtype";
/**
* Enum value "cdma" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA: "cdma";
/**
* Enum value "cdma2000_1xrtt" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA2000_1XRTT: "cdma2000_1xrtt";
/**
* Enum value "edge" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_EDGE: "edge";
/**
* Enum value "ehrpd" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_EHRPD: "ehrpd";
/**
* Enum value "evdo_0" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_0: "evdo_0";
/**
* Enum value "evdo_a" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_A: "evdo_a";
/**
* Enum value "evdo_b" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_B: "evdo_b";
/**
* Enum value "gprs" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_GPRS: "gprs";
/**
* Enum value "gsm" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_GSM: "gsm";
/**
* Enum value "hsdpa" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_HSDPA: "hsdpa";
/**
* Enum value "hspa" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_HSPA: "hspa";
/**
* Enum value "hspap" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_HSPAP: "hspap";
/**
* Enum value "hsupa" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_HSUPA: "hsupa";
/**
* Enum value "iden" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_IDEN: "iden";
/**
* Enum value "iwlan" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_IWLAN: "iwlan";
/**
* Enum value "lte" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_LTE: "lte";
/**
* Enum value "lte_ca" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_LTE_CA: "lte_ca";
/**
* Enum value "nr" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_NR: "nr";
/**
* Enum value "nrnsa" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_NRNSA: "nrnsa";
/**
* Enum value "td_scdma" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_TD_SCDMA: "td_scdma";
/**
* Enum value "umts" for attribute {@link ATTR_NETWORK_CONNECTION_SUBTYPE}.
*/
declare const NETWORK_CONNECTION_SUBTYPE_VALUE_UMTS: "umts";
/**
 * The internet connection type.
 *
 * @example "wifi"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_CONNECTION_TYPE: "network.connection.type";
/**
* Enum value "cell" for attribute {@link ATTR_NETWORK_CONNECTION_TYPE}.
*/
declare const NETWORK_CONNECTION_TYPE_VALUE_CELL: "cell";
/**
* Enum value "unavailable" for attribute {@link ATTR_NETWORK_CONNECTION_TYPE}.
*/
declare const NETWORK_CONNECTION_TYPE_VALUE_UNAVAILABLE: "unavailable";
/**
* Enum value "unknown" for attribute {@link ATTR_NETWORK_CONNECTION_TYPE}.
*/
declare const NETWORK_CONNECTION_TYPE_VALUE_UNKNOWN: "unknown";
/**
* Enum value "wifi" for attribute {@link ATTR_NETWORK_CONNECTION_TYPE}.
*/
declare const NETWORK_CONNECTION_TYPE_VALUE_WIFI: "wifi";
/**
* Enum value "wired" for attribute {@link ATTR_NETWORK_CONNECTION_TYPE}.
*/
declare const NETWORK_CONNECTION_TYPE_VALUE_WIRED: "wired";
/**
 * The network interface name.
 *
 * @example lo
 * @example eth0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_INTERFACE_NAME: "network.interface.name";
/**
 * The network IO operation direction.
 *
 * @example transmit
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NETWORK_IO_DIRECTION: "network.io.direction";
/**
* Enum value "receive" for attribute {@link ATTR_NETWORK_IO_DIRECTION}.
*/
declare const NETWORK_IO_DIRECTION_VALUE_RECEIVE: "receive";
/**
* Enum value "transmit" for attribute {@link ATTR_NETWORK_IO_DIRECTION}.
*/
declare const NETWORK_IO_DIRECTION_VALUE_TRANSMIT: "transmit";
/**
 * The state of event loop time.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_NODEJS_EVENTLOOP_STATE: "nodejs.eventloop.state";
/**
* Enum value "active" for attribute {@link ATTR_NODEJS_EVENTLOOP_STATE}.
*/
declare const NODEJS_EVENTLOOP_STATE_VALUE_ACTIVE: "active";
/**
* Enum value "idle" for attribute {@link ATTR_NODEJS_EVENTLOOP_STATE}.
*/
declare const NODEJS_EVENTLOOP_STATE_VALUE_IDLE: "idle";
/**
 * The digest of the OCI image manifest. For container images specifically is the digest by which the container image is known.
 *
 * @example sha256:e4ca62c0d62f3e886e684806dfe9d4e0cda60d54986898173c1083856cfda0f4
 *
 * @note Follows [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/main/manifest.md), and specifically the [Digest property](https://github.com/opencontainers/image-spec/blob/main/descriptor.md#digests).
 * An example can be found in [Example Image Manifest](https://docs.docker.com/registry/spec/manifest-v2-2/#example-image-manifest).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_OCI_MANIFEST_DIGEST: "oci.manifest.digest";
/**
 * Parent-child Reference type
 *
 * @note The causal relationship between a child Span and a parent Span.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_OPENTRACING_REF_TYPE: "opentracing.ref_type";
/**
* Enum value "child_of" for attribute {@link ATTR_OPENTRACING_REF_TYPE}.
*/
declare const OPENTRACING_REF_TYPE_VALUE_CHILD_OF: "child_of";
/**
* Enum value "follows_from" for attribute {@link ATTR_OPENTRACING_REF_TYPE}.
*/
declare const OPENTRACING_REF_TYPE_VALUE_FOLLOWS_FROM: "follows_from";
/**
 * Unique identifier for a particular build or compilation of the operating system.
 *
 * @example TQ3C.230805.001.B2
 * @example 20E247
 * @example 22621
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_OS_BUILD_ID: "os.build_id";
/**
 * Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
 *
 * @example Microsoft Windows [Version 10.0.18363.778]
 * @example Ubuntu 18.04.1 LTS
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_OS_DESCRIPTION: "os.description";
/**
 * Human readable operating system name.
 *
 * @example iOS
 * @example Android
 * @example Ubuntu
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_OS_NAME: "os.name";
/**
 * The operating system type.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_OS_TYPE: "os.type";
/**
* Enum value "aix" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_AIX: "aix";
/**
* Enum value "darwin" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_DARWIN: "darwin";
/**
* Enum value "dragonflybsd" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_DRAGONFLYBSD: "dragonflybsd";
/**
* Enum value "freebsd" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_FREEBSD: "freebsd";
/**
* Enum value "hpux" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_HPUX: "hpux";
/**
* Enum value "linux" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_LINUX: "linux";
/**
* Enum value "netbsd" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_NETBSD: "netbsd";
/**
* Enum value "openbsd" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_OPENBSD: "openbsd";
/**
* Enum value "solaris" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_SOLARIS: "solaris";
/**
* Enum value "windows" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_WINDOWS: "windows";
/**
* Enum value "z_os" for attribute {@link ATTR_OS_TYPE}.
*/
declare const OS_TYPE_VALUE_Z_OS: "z_os";
/**
 * The version string of the operating system as defined in [Version Attributes](/docs/resource/README.md#version-attributes).
 *
 * @example 14.2.1
 * @example 18.04.1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_OS_VERSION: "os.version";
/**
 * Deprecated. Use the `otel.scope.name` attribute
 *
 * @example io.opentelemetry.contrib.mongodb
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Use the `otel.scope.name` attribute.
 */
declare const ATTR_OTEL_LIBRARY_NAME: "otel.library.name";
/**
 * Deprecated. Use the `otel.scope.version` attribute.
 *
 * @example 1.0.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Use the `otel.scope.version` attribute.
 */
declare const ATTR_OTEL_LIBRARY_VERSION: "otel.library.version";
/**
 * The [`service.name`](/docs/resource/README.md#service) of the remote service. **SHOULD** be equal to the actual `service.name` resource attribute of the remote service if any.
 *
 * @example "AuthTokenCache"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PEER_SERVICE: "peer.service";
/**
 * Deprecated, use `db.client.connection.pool.name` instead.
 *
 * @example myDataSource
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.pool.name`.
 */
declare const ATTR_POOL_NAME: "pool.name";
/**
 * Length of the process.command_args array
 *
 * @example 4
 *
 * @note This field can be useful for querying or performing bucket analysis on how many arguments were provided to start a process. More arguments may be an indication of suspicious activity.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_ARGS_COUNT: "process.args_count";
/**
 * The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
 *
 * @example cmd/otelcol
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_COMMAND: "process.command";
/**
 * All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
 *
 * @example ["cmd/otecol", "--config=config.yaml"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_COMMAND_ARGS: "process.command_args";
/**
 * The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
 *
 * @example C:\\cmd\\otecol --config="my directory\\config.yaml"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_COMMAND_LINE: "process.command_line";
/**
 * Specifies whether the context switches for this data point were voluntary or involuntary.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_CONTEXT_SWITCH_TYPE: "process.context_switch_type";
/**
* Enum value "involuntary" for attribute {@link ATTR_PROCESS_CONTEXT_SWITCH_TYPE}.
*/
declare const PROCESS_CONTEXT_SWITCH_TYPE_VALUE_INVOLUNTARY: "involuntary";
/**
* Enum value "voluntary" for attribute {@link ATTR_PROCESS_CONTEXT_SWITCH_TYPE}.
*/
declare const PROCESS_CONTEXT_SWITCH_TYPE_VALUE_VOLUNTARY: "voluntary";
/**
 * Deprecated, use `cpu.mode` instead.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cpu.mode`
 */
declare const ATTR_PROCESS_CPU_STATE: "process.cpu.state";
/**
* Enum value "system" for attribute {@link ATTR_PROCESS_CPU_STATE}.
*/
declare const PROCESS_CPU_STATE_VALUE_SYSTEM: "system";
/**
* Enum value "user" for attribute {@link ATTR_PROCESS_CPU_STATE}.
*/
declare const PROCESS_CPU_STATE_VALUE_USER: "user";
/**
* Enum value "wait" for attribute {@link ATTR_PROCESS_CPU_STATE}.
*/
declare const PROCESS_CPU_STATE_VALUE_WAIT: "wait";
/**
 * The date and time the process was created, in ISO 8601 format.
 *
 * @example 2023-11-21T09:25:34.853Z
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_CREATION_TIME: "process.creation.time";
/**
 * The GNU build ID as found in the `.note.gnu.build-id` ELF section (hex string).
 *
 * @example c89b11207f6479603b0d49bf291c092c2b719293
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_EXECUTABLE_BUILD_ID_GNU: "process.executable.build_id.gnu";
/**
 * The Go build ID as retrieved by `go tool buildid <go executable>`.
 *
 * @example foh3mEXu7BLZjsN9pOwG/kATcXlYVCDEFouRMQed_/WwRFB1hPo9LBkekthSPG/x8hMC8emW2cCjXD0_1aY
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_EXECUTABLE_BUILD_ID_GO: "process.executable.build_id.go";
/**
 * Profiling specific build ID for executables. See the OTel specification for Profiles for more information.
 *
 * @example 600DCAFE4A110000F2BF38C493F5FB92
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_EXECUTABLE_BUILD_ID_HTLHASH: "process.executable.build_id.htlhash";
/**
 * "Deprecated, use `process.executable.build_id.htlhash` instead."
 *
 * @example 600DCAFE4A110000F2BF38C493F5FB92
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `process.executable.build_id.htlhash`
 */
declare const ATTR_PROCESS_EXECUTABLE_BUILD_ID_PROFILING: "process.executable.build_id.profiling";
/**
 * The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
 *
 * @example otelcol
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_EXECUTABLE_NAME: "process.executable.name";
/**
 * The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
 *
 * @example /usr/bin/cmd/otelcol
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_EXECUTABLE_PATH: "process.executable.path";
/**
 * The exit code of the process.
 *
 * @example 127
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_EXIT_CODE: "process.exit.code";
/**
 * The date and time the process exited, in ISO 8601 format.
 *
 * @example 2023-11-21T09:26:12.315Z
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_EXIT_TIME: "process.exit.time";
/**
 * The PID of the process's group leader. This is also the process group ID (PGID) of the process.
 *
 * @example 23
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_GROUP_LEADER_PID: "process.group_leader.pid";
/**
 * Whether the process is connected to an interactive shell.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_INTERACTIVE: "process.interactive";
/**
 * The control group associated with the process.
 *
 * @example 1:name=systemd:/user.slice/user-1000.slice/session-3.scope
 * @example 0::/user.slice/user-1000.slice/user@1000.service/tmux-spawn-0267755b-4639-4a27-90ed-f19f88e53748.scope
 *
 * @note Control groups (cgroups) are a kernel feature used to organize and manage process resources. This attribute provides the path(s) to the cgroup(s) associated with the process, which should match the contents of the [/proc/[PID]/cgroup](https://man7.org/linux/man-pages/man7/cgroups.7.html) file.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_LINUX_CGROUP: "process.linux.cgroup";
/**
 * The username of the user that owns the process.
 *
 * @example root
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_OWNER: "process.owner";
/**
 * The type of page fault for this data point. Type `major` is for major/hard page faults, and `minor` is for minor/soft page faults.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_PAGING_FAULT_TYPE: "process.paging.fault_type";
/**
* Enum value "major" for attribute {@link ATTR_PROCESS_PAGING_FAULT_TYPE}.
*/
declare const PROCESS_PAGING_FAULT_TYPE_VALUE_MAJOR: "major";
/**
* Enum value "minor" for attribute {@link ATTR_PROCESS_PAGING_FAULT_TYPE}.
*/
declare const PROCESS_PAGING_FAULT_TYPE_VALUE_MINOR: "minor";
/**
 * Parent Process identifier (PPID).
 *
 * @example 111
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_PARENT_PID: "process.parent_pid";
/**
 * Process identifier (PID).
 *
 * @example 1234
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_PID: "process.pid";
/**
 * The real user ID (RUID) of the process.
 *
 * @example 1000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_REAL_USER_ID: "process.real_user.id";
/**
 * The username of the real user of the process.
 *
 * @example operator
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_REAL_USER_NAME: "process.real_user.name";
/**
 * An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
 *
 * @example "Eclipse OpenJ9 Eclipse OpenJ9 VM openj9-0.21.0"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_RUNTIME_DESCRIPTION: "process.runtime.description";
/**
 * The name of the runtime of this process.
 *
 * @example OpenJDK Runtime Environment
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_RUNTIME_NAME: "process.runtime.name";
/**
 * The version of the runtime of this process, as returned by the runtime without modification.
 *
 * @example "14.0.2"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_RUNTIME_VERSION: "process.runtime.version";
/**
 * The saved user ID (SUID) of the process.
 *
 * @example 1002
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_SAVED_USER_ID: "process.saved_user.id";
/**
 * The username of the saved user.
 *
 * @example operator
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_SAVED_USER_NAME: "process.saved_user.name";
/**
 * The PID of the process's session leader. This is also the session ID (SID) of the process.
 *
 * @example 14
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_SESSION_LEADER_PID: "process.session_leader.pid";
/**
 * Process title (proctitle)
 *
 * @example cat /etc/hostname
 * @example xfce4-session
 * @example bash
 *
 * @note In many Unix-like systems, process title (proctitle), is the string that represents the name or command line of a running process, displayed by system monitoring tools like ps, top, and htop.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_TITLE: "process.title";
/**
 * The effective user ID (EUID) of the process.
 *
 * @example 1001
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_USER_ID: "process.user.id";
/**
 * The username of the effective user of the process.
 *
 * @example root
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_USER_NAME: "process.user.name";
/**
 * Virtual process identifier.
 *
 * @example 12
 *
 * @note The process ID within a PID namespace. This is not necessarily unique across all processes on the host but it is unique within the process namespace that the process exists within.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_VPID: "process.vpid";
/**
 * The working directory of the process.
 *
 * @example /root
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROCESS_WORKING_DIRECTORY: "process.working_directory";
/**
 * Describes the interpreter or compiler of a single frame.
 *
 * @example cpython
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_PROFILE_FRAME_TYPE: "profile.frame.type";
/**
* Enum value "beam" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_BEAM: "beam";
/**
* Enum value "cpython" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_CPYTHON: "cpython";
/**
* Enum value "dotnet" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_DOTNET: "dotnet";
/**
* Enum value "jvm" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_JVM: "jvm";
/**
* Enum value "kernel" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_KERNEL: "kernel";
/**
* Enum value "native" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_NATIVE: "native";
/**
* Enum value "perl" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_PERL: "perl";
/**
* Enum value "php" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_PHP: "php";
/**
* Enum value "ruby" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_RUBY: "ruby";
/**
* Enum value "v8js" for attribute {@link ATTR_PROFILE_FRAME_TYPE}.
*/
declare const PROFILE_FRAME_TYPE_VALUE_V8JS: "v8js";
/**
 * The [error codes](https://connect.build/docs/protocol/#error-codes) of the Connect request. Error codes are always string values.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_CONNECT_RPC_ERROR_CODE: "rpc.connect_rpc.error_code";
/**
* Enum value "aborted" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_ABORTED: "aborted";
/**
* Enum value "already_exists" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_ALREADY_EXISTS: "already_exists";
/**
* Enum value "cancelled" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_CANCELLED: "cancelled";
/**
* Enum value "data_loss" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_DATA_LOSS: "data_loss";
/**
* Enum value "deadline_exceeded" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_DEADLINE_EXCEEDED: "deadline_exceeded";
/**
* Enum value "failed_precondition" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_FAILED_PRECONDITION: "failed_precondition";
/**
* Enum value "internal" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_INTERNAL: "internal";
/**
* Enum value "invalid_argument" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_INVALID_ARGUMENT: "invalid_argument";
/**
* Enum value "not_found" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_NOT_FOUND: "not_found";
/**
* Enum value "out_of_range" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_OUT_OF_RANGE: "out_of_range";
/**
* Enum value "permission_denied" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_PERMISSION_DENIED: "permission_denied";
/**
* Enum value "resource_exhausted" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_RESOURCE_EXHAUSTED: "resource_exhausted";
/**
* Enum value "unauthenticated" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNAUTHENTICATED: "unauthenticated";
/**
* Enum value "unavailable" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNAVAILABLE: "unavailable";
/**
* Enum value "unimplemented" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNIMPLEMENTED: "unimplemented";
/**
* Enum value "unknown" for attribute {@link ATTR_RPC_CONNECT_RPC_ERROR_CODE}.
*/
declare const RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNKNOWN: "unknown";
/**
 * Connect request metadata, `<key>` being the normalized Connect Metadata key (lowercase), the value being the metadata values.
 *
 * @example rpc.request.metadata.my-custom-metadata-attribute=["1.2.3.4", "1.2.3.5"]
 *
 * @note Instrumentations **SHOULD** require an explicit configuration of which metadata values are to be captured. Including all request metadata values can be a security risk - explicit configuration helps avoid leaking sensitive information.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_CONNECT_RPC_REQUEST_METADATA: (key: string) => string;
/**
 * Connect response metadata, `<key>` being the normalized Connect Metadata key (lowercase), the value being the metadata values.
 *
 * @example rpc.response.metadata.my-custom-metadata-attribute=["attribute_value"]
 *
 * @note Instrumentations **SHOULD** require an explicit configuration of which metadata values are to be captured. Including all response metadata values can be a security risk - explicit configuration helps avoid leaking sensitive information.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_CONNECT_RPC_RESPONSE_METADATA: (key: string) => string;
/**
 * gRPC request metadata, `<key>` being the normalized gRPC Metadata key (lowercase), the value being the metadata values.
 *
 * @example rpc.grpc.request.metadata.my-custom-metadata-attribute=["1.2.3.4", "1.2.3.5"]
 *
 * @note Instrumentations **SHOULD** require an explicit configuration of which metadata values are to be captured. Including all request metadata values can be a security risk - explicit configuration helps avoid leaking sensitive information.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_GRPC_REQUEST_METADATA: (key: string) => string;
/**
 * gRPC response metadata, `<key>` being the normalized gRPC Metadata key (lowercase), the value being the metadata values.
 *
 * @example rpc.grpc.response.metadata.my-custom-metadata-attribute=["attribute_value"]
 *
 * @note Instrumentations **SHOULD** require an explicit configuration of which metadata values are to be captured. Including all response metadata values can be a security risk - explicit configuration helps avoid leaking sensitive information.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_GRPC_RESPONSE_METADATA: (key: string) => string;
/**
 * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_GRPC_STATUS_CODE: "rpc.grpc.status_code";
/**
* Enum value 0 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_OK: 0;
/**
* Enum value 1 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_CANCELLED: 1;
/**
* Enum value 2 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_UNKNOWN: 2;
/**
* Enum value 3 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_INVALID_ARGUMENT: 3;
/**
* Enum value 4 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_DEADLINE_EXCEEDED: 4;
/**
* Enum value 5 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_NOT_FOUND: 5;
/**
* Enum value 6 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_ALREADY_EXISTS: 6;
/**
* Enum value 7 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_PERMISSION_DENIED: 7;
/**
* Enum value 8 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_RESOURCE_EXHAUSTED: 8;
/**
* Enum value 9 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_FAILED_PRECONDITION: 9;
/**
* Enum value 10 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_ABORTED: 10;
/**
* Enum value 11 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_OUT_OF_RANGE: 11;
/**
* Enum value 12 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_UNIMPLEMENTED: 12;
/**
* Enum value 13 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_INTERNAL: 13;
/**
* Enum value 14 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_UNAVAILABLE: 14;
/**
* Enum value 15 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_DATA_LOSS: 15;
/**
* Enum value 16 for attribute {@link ATTR_RPC_GRPC_STATUS_CODE}.
*/
declare const RPC_GRPC_STATUS_CODE_VALUE_UNAUTHENTICATED: 16;
/**
 * `error.code` property of response if it is an error response.
 *
 * @example -32700
 * @example 100
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_JSONRPC_ERROR_CODE: "rpc.jsonrpc.error_code";
/**
 * `error.message` property of response if it is an error response.
 *
 * @example Parse error
 * @example User already exists
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_JSONRPC_ERROR_MESSAGE: "rpc.jsonrpc.error_message";
/**
 * `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
 *
 * @example 10
 * @example request-7
 * @example
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_JSONRPC_REQUEST_ID: "rpc.jsonrpc.request_id";
/**
 * Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 doesn't specify this, the value can be omitted.
 *
 * @example 2.0
 * @example 1.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_JSONRPC_VERSION: "rpc.jsonrpc.version";
/**
 * Compressed size of the message in bytes.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_MESSAGE_COMPRESSED_SIZE: "rpc.message.compressed_size";
/**
 * **MUST** be calculated as two different counters starting from `1` one for sent messages and one for received message.
 *
 * @note This way we guarantee that the values will be consistent between different implementations.
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_MESSAGE_ID: "rpc.message.id";
/**
 * Whether this is a received or sent message.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_MESSAGE_TYPE: "rpc.message.type";
/**
* Enum value "RECEIVED" for attribute {@link ATTR_RPC_MESSAGE_TYPE}.
*/
declare const RPC_MESSAGE_TYPE_VALUE_RECEIVED: "RECEIVED";
/**
* Enum value "SENT" for attribute {@link ATTR_RPC_MESSAGE_TYPE}.
*/
declare const RPC_MESSAGE_TYPE_VALUE_SENT: "SENT";
/**
 * Uncompressed size of the message in bytes.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_MESSAGE_UNCOMPRESSED_SIZE: "rpc.message.uncompressed_size";
/**
 * The name of the (logical) method being called, must be equal to the $method part in the span name.
 *
 * @example "exampleMethod"
 *
 * @note This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function.name` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_METHOD: "rpc.method";
/**
 * The full (logical) name of the service being called, including its package name, if applicable.
 *
 * @example "myservice.EchoService"
 *
 * @note This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_SERVICE: "rpc.service";
/**
 * A string identifying the remoting system. See below for a list of well-known identifiers.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_RPC_SYSTEM: "rpc.system";
/**
* Enum value "apache_dubbo" for attribute {@link ATTR_RPC_SYSTEM}.
*/
declare const RPC_SYSTEM_VALUE_APACHE_DUBBO: "apache_dubbo";
/**
* Enum value "connect_rpc" for attribute {@link ATTR_RPC_SYSTEM}.
*/
declare const RPC_SYSTEM_VALUE_CONNECT_RPC: "connect_rpc";
/**
* Enum value "dotnet_wcf" for attribute {@link ATTR_RPC_SYSTEM}.
*/
declare const RPC_SYSTEM_VALUE_DOTNET_WCF: "dotnet_wcf";
/**
* Enum value "grpc" for attribute {@link ATTR_RPC_SYSTEM}.
*/
declare const RPC_SYSTEM_VALUE_GRPC: "grpc";
/**
* Enum value "java_rmi" for attribute {@link ATTR_RPC_SYSTEM}.
*/
declare const RPC_SYSTEM_VALUE_JAVA_RMI: "java_rmi";
/**
 * A categorization value keyword used by the entity using the rule for detection of this event
 *
 * @example Attempted Information Leak
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SECURITY_RULE_CATEGORY: "security_rule.category";
/**
 * The description of the rule generating the event.
 *
 * @example Block requests to public DNS over HTTPS / TLS protocols
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SECURITY_RULE_DESCRIPTION: "security_rule.description";
/**
 * Name of the license under which the rule used to generate this event is made available.
 *
 * @example Apache 2.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SECURITY_RULE_LICENSE: "security_rule.license";
/**
 * The name of the rule or signature generating the event.
 *
 * @example BLOCK_DNS_over_TLS
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SECURITY_RULE_NAME: "security_rule.name";
/**
 * Reference URL to additional information about the rule used to generate this event.
 *
 * @example https://en.wikipedia.org/wiki/DNS_over_TLS
 *
 * @note The URL can point to the vendor’s documentation about the rule. If that’s not available, it can also be a link to a more general page describing this type of alert.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SECURITY_RULE_REFERENCE: "security_rule.reference";
/**
 * Name of the ruleset, policy, group, or parent category in which the rule used to generate this event is a member.
 *
 * @example Standard_Protocol_Filters
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SECURITY_RULE_RULESET_NAME: "security_rule.ruleset.name";
/**
 * A rule ID that is unique within the scope of a set or group of agents, observers, or other entities using the rule for detection of this event.
 *
 * @example 550e8400-e29b-41d4-a716-446655440000
 * @example 1100110011
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SECURITY_RULE_UUID: "security_rule.uuid";
/**
 * The version / revision of the rule being used for analysis.
 *
 * @example 1.0.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SECURITY_RULE_VERSION: "security_rule.version";
/**
 * The string ID of the service instance.
 *
 * @example 627cc493-f310-47de-96bd-71410b7dec09
 *
 * @note **MUST** be unique for each instance of the same `service.namespace,service.name` pair (in other words
 * `service.namespace,service.name,service.instance.id` triplet **MUST** be globally unique). The ID helps to
 * distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled
 * service).
 *
 * Implementations, such as SDKs, are recommended to generate a random Version 1 or Version 4 [RFC
 * 4122](https://www.ietf.org/rfc/rfc4122.txt) UUID, but are free to use an inherent unique ID as the source of
 * this value if stability is desirable. In that case, the ID **SHOULD** be used as source of a UUID Version 5 and
 * **SHOULD** use the following UUID as the namespace: `4d63009a-8d0f-11ee-aad7-4c796ed8e320`.
 *
 * UUIDs are typically recommended, as only an opaque value for the purposes of identifying a service instance is
 * needed. Similar to what can be seen in the man page for the
 * [`/etc/machine-id`](https://www.freedesktop.org/software/systemd/man/latest/machine-id.html) file, the underlying
 * data, such as pod name and namespace should be treated as confidential, being the user's choice to expose it
 * or not via another resource attribute.
 *
 * For applications running behind an application server (like unicorn), we do not recommend using one identifier
 * for all processes participating in the application. Instead, it's recommended each division (e.g. a worker
 * thread in unicorn) to have its own instance.id.
 *
 * It's not recommended for a Collector to set `service.instance.id` if it can't unambiguously determine the
 * service instance that is generating that telemetry. For instance, creating an UUID based on `pod.name` will
 * likely be wrong, as the Collector might not know from which container within that pod the telemetry originated.
 * However, Collectors can set the `service.instance.id` if they can unambiguously determine the service instance
 * for that telemetry. This is typically the case for scraping receivers, as they know the target address and
 * port.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SERVICE_INSTANCE_ID: "service.instance.id";
/**
 * A namespace for `service.name`.
 *
 * @example Shop
 *
 * @note A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SERVICE_NAMESPACE: "service.namespace";
/**
 * A unique id to identify a session.
 *
 * @example "00112233-4455-6677-8899-aabbccddeeff"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SESSION_ID: "session.id";
/**
 * The previous `session.id` for this user, when known.
 *
 * @example "00112233-4455-6677-8899-aabbccddeeff"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SESSION_PREVIOUS_ID: "session.previous_id";
/**
 * Source address - domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name.
 *
 * @example source.example.com
 * @example 10.1.2.80
 * @example /tmp/my.sock
 *
 * @note When observed from the destination side, and when communicating through an intermediary, `source.address` **SHOULD** represent the source address behind any intermediaries, for example proxies, if it's available.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SOURCE_ADDRESS: "source.address";
/**
 * Source port number
 *
 * @example 3389
 * @example 2888
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SOURCE_PORT: "source.port";
/**
 * Deprecated, use `db.client.connection.state` instead.
 *
 * @example idle
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.state`.
 */
declare const ATTR_STATE: "state";
/**
* Enum value "idle" for attribute {@link ATTR_STATE}.
*/
declare const STATE_VALUE_IDLE: "idle";
/**
* Enum value "used" for attribute {@link ATTR_STATE}.
*/
declare const STATE_VALUE_USED: "used";
/**
 * The logical CPU number [0..n-1]
 *
 * @example 1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_CPU_LOGICAL_NUMBER: "system.cpu.logical_number";
/**
 * Deprecated, use `cpu.mode` instead.
 *
 * @example idle
 * @example interrupt
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `cpu.mode`
 */
declare const ATTR_SYSTEM_CPU_STATE: "system.cpu.state";
/**
* Enum value "idle" for attribute {@link ATTR_SYSTEM_CPU_STATE}.
*/
declare const SYSTEM_CPU_STATE_VALUE_IDLE: "idle";
/**
* Enum value "interrupt" for attribute {@link ATTR_SYSTEM_CPU_STATE}.
*/
declare const SYSTEM_CPU_STATE_VALUE_INTERRUPT: "interrupt";
/**
* Enum value "iowait" for attribute {@link ATTR_SYSTEM_CPU_STATE}.
*/
declare const SYSTEM_CPU_STATE_VALUE_IOWAIT: "iowait";
/**
* Enum value "nice" for attribute {@link ATTR_SYSTEM_CPU_STATE}.
*/
declare const SYSTEM_CPU_STATE_VALUE_NICE: "nice";
/**
* Enum value "steal" for attribute {@link ATTR_SYSTEM_CPU_STATE}.
*/
declare const SYSTEM_CPU_STATE_VALUE_STEAL: "steal";
/**
* Enum value "system" for attribute {@link ATTR_SYSTEM_CPU_STATE}.
*/
declare const SYSTEM_CPU_STATE_VALUE_SYSTEM: "system";
/**
* Enum value "user" for attribute {@link ATTR_SYSTEM_CPU_STATE}.
*/
declare const SYSTEM_CPU_STATE_VALUE_USER: "user";
/**
 * The device identifier
 *
 * @example (identifier)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_DEVICE: "system.device";
/**
 * The filesystem mode
 *
 * @example rw, ro
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_FILESYSTEM_MODE: "system.filesystem.mode";
/**
 * The filesystem mount path
 *
 * @example /mnt/data
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_FILESYSTEM_MOUNTPOINT: "system.filesystem.mountpoint";
/**
 * The filesystem state
 *
 * @example used
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_FILESYSTEM_STATE: "system.filesystem.state";
/**
* Enum value "free" for attribute {@link ATTR_SYSTEM_FILESYSTEM_STATE}.
*/
declare const SYSTEM_FILESYSTEM_STATE_VALUE_FREE: "free";
/**
* Enum value "reserved" for attribute {@link ATTR_SYSTEM_FILESYSTEM_STATE}.
*/
declare const SYSTEM_FILESYSTEM_STATE_VALUE_RESERVED: "reserved";
/**
* Enum value "used" for attribute {@link ATTR_SYSTEM_FILESYSTEM_STATE}.
*/
declare const SYSTEM_FILESYSTEM_STATE_VALUE_USED: "used";
/**
 * The filesystem type
 *
 * @example ext4
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_FILESYSTEM_TYPE: "system.filesystem.type";
/**
* Enum value "exfat" for attribute {@link ATTR_SYSTEM_FILESYSTEM_TYPE}.
*/
declare const SYSTEM_FILESYSTEM_TYPE_VALUE_EXFAT: "exfat";
/**
* Enum value "ext4" for attribute {@link ATTR_SYSTEM_FILESYSTEM_TYPE}.
*/
declare const SYSTEM_FILESYSTEM_TYPE_VALUE_EXT4: "ext4";
/**
* Enum value "fat32" for attribute {@link ATTR_SYSTEM_FILESYSTEM_TYPE}.
*/
declare const SYSTEM_FILESYSTEM_TYPE_VALUE_FAT32: "fat32";
/**
* Enum value "hfsplus" for attribute {@link ATTR_SYSTEM_FILESYSTEM_TYPE}.
*/
declare const SYSTEM_FILESYSTEM_TYPE_VALUE_HFSPLUS: "hfsplus";
/**
* Enum value "ntfs" for attribute {@link ATTR_SYSTEM_FILESYSTEM_TYPE}.
*/
declare const SYSTEM_FILESYSTEM_TYPE_VALUE_NTFS: "ntfs";
/**
* Enum value "refs" for attribute {@link ATTR_SYSTEM_FILESYSTEM_TYPE}.
*/
declare const SYSTEM_FILESYSTEM_TYPE_VALUE_REFS: "refs";
/**
 * The memory state
 *
 * @example free
 * @example cached
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_MEMORY_STATE: "system.memory.state";
/**
* Enum value "buffers" for attribute {@link ATTR_SYSTEM_MEMORY_STATE}.
*/
declare const SYSTEM_MEMORY_STATE_VALUE_BUFFERS: "buffers";
/**
* Enum value "cached" for attribute {@link ATTR_SYSTEM_MEMORY_STATE}.
*/
declare const SYSTEM_MEMORY_STATE_VALUE_CACHED: "cached";
/**
* Enum value "free" for attribute {@link ATTR_SYSTEM_MEMORY_STATE}.
*/
declare const SYSTEM_MEMORY_STATE_VALUE_FREE: "free";
/**
* Enum value "shared" for attribute {@link ATTR_SYSTEM_MEMORY_STATE}.
*/
declare const SYSTEM_MEMORY_STATE_VALUE_SHARED: "shared";
/**
* Enum value "used" for attribute {@link ATTR_SYSTEM_MEMORY_STATE}.
*/
declare const SYSTEM_MEMORY_STATE_VALUE_USED: "used";
/**
 * Deprecated, use `network.connection.state` instead.
 *
 * @example close_wait
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Removed, report network connection state with `network.connection.state` attribute
 */
declare const ATTR_SYSTEM_NETWORK_STATE: "system.network.state";
/**
* Enum value "close" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_CLOSE: "close";
/**
* Enum value "close_wait" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_CLOSE_WAIT: "close_wait";
/**
* Enum value "closing" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_CLOSING: "closing";
/**
* Enum value "delete" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_DELETE: "delete";
/**
* Enum value "established" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_ESTABLISHED: "established";
/**
* Enum value "fin_wait_1" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_FIN_WAIT_1: "fin_wait_1";
/**
* Enum value "fin_wait_2" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_FIN_WAIT_2: "fin_wait_2";
/**
* Enum value "last_ack" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_LAST_ACK: "last_ack";
/**
* Enum value "listen" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_LISTEN: "listen";
/**
* Enum value "syn_recv" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_SYN_RECV: "syn_recv";
/**
* Enum value "syn_sent" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_SYN_SENT: "syn_sent";
/**
* Enum value "time_wait" for attribute {@link ATTR_SYSTEM_NETWORK_STATE}.
*/
declare const SYSTEM_NETWORK_STATE_VALUE_TIME_WAIT: "time_wait";
/**
 * The paging access direction
 *
 * @example in
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_PAGING_DIRECTION: "system.paging.direction";
/**
* Enum value "in" for attribute {@link ATTR_SYSTEM_PAGING_DIRECTION}.
*/
declare const SYSTEM_PAGING_DIRECTION_VALUE_IN: "in";
/**
* Enum value "out" for attribute {@link ATTR_SYSTEM_PAGING_DIRECTION}.
*/
declare const SYSTEM_PAGING_DIRECTION_VALUE_OUT: "out";
/**
 * The memory paging state
 *
 * @example free
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_PAGING_STATE: "system.paging.state";
/**
* Enum value "free" for attribute {@link ATTR_SYSTEM_PAGING_STATE}.
*/
declare const SYSTEM_PAGING_STATE_VALUE_FREE: "free";
/**
* Enum value "used" for attribute {@link ATTR_SYSTEM_PAGING_STATE}.
*/
declare const SYSTEM_PAGING_STATE_VALUE_USED: "used";
/**
 * The memory paging type
 *
 * @example minor
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_PAGING_TYPE: "system.paging.type";
/**
* Enum value "major" for attribute {@link ATTR_SYSTEM_PAGING_TYPE}.
*/
declare const SYSTEM_PAGING_TYPE_VALUE_MAJOR: "major";
/**
* Enum value "minor" for attribute {@link ATTR_SYSTEM_PAGING_TYPE}.
*/
declare const SYSTEM_PAGING_TYPE_VALUE_MINOR: "minor";
/**
 * The process state, e.g., [Linux Process State Codes](https://man7.org/linux/man-pages/man1/ps.1.html#PROCESS_STATE_CODES)
 *
 * @example running
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_SYSTEM_PROCESS_STATUS: "system.process.status";
/**
* Enum value "defunct" for attribute {@link ATTR_SYSTEM_PROCESS_STATUS}.
*/
declare const SYSTEM_PROCESS_STATUS_VALUE_DEFUNCT: "defunct";
/**
* Enum value "running" for attribute {@link ATTR_SYSTEM_PROCESS_STATUS}.
*/
declare const SYSTEM_PROCESS_STATUS_VALUE_RUNNING: "running";
/**
* Enum value "sleeping" for attribute {@link ATTR_SYSTEM_PROCESS_STATUS}.
*/
declare const SYSTEM_PROCESS_STATUS_VALUE_SLEEPING: "sleeping";
/**
* Enum value "stopped" for attribute {@link ATTR_SYSTEM_PROCESS_STATUS}.
*/
declare const SYSTEM_PROCESS_STATUS_VALUE_STOPPED: "stopped";
/**
 * Deprecated, use `system.process.status` instead.
 *
 * @example running
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `system.process.status`.
 */
declare const ATTR_SYSTEM_PROCESSES_STATUS: "system.processes.status";
/**
* Enum value "defunct" for attribute {@link ATTR_SYSTEM_PROCESSES_STATUS}.
*/
declare const SYSTEM_PROCESSES_STATUS_VALUE_DEFUNCT: "defunct";
/**
* Enum value "running" for attribute {@link ATTR_SYSTEM_PROCESSES_STATUS}.
*/
declare const SYSTEM_PROCESSES_STATUS_VALUE_RUNNING: "running";
/**
* Enum value "sleeping" for attribute {@link ATTR_SYSTEM_PROCESSES_STATUS}.
*/
declare const SYSTEM_PROCESSES_STATUS_VALUE_SLEEPING: "sleeping";
/**
* Enum value "stopped" for attribute {@link ATTR_SYSTEM_PROCESSES_STATUS}.
*/
declare const SYSTEM_PROCESSES_STATUS_VALUE_STOPPED: "stopped";
/**
 * The name of the auto instrumentation agent or distribution, if used.
 *
 * @example parts-unlimited-java
 *
 * @note Official auto instrumentation agents and distributions **SHOULD** set the `telemetry.distro.name` attribute to
 * a string starting with `opentelemetry-`, e.g. `opentelemetry-java-instrumentation`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TELEMETRY_DISTRO_NAME: "telemetry.distro.name";
/**
 * The version string of the auto instrumentation agent or distribution, if used.
 *
 * @example 1.2.3
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TELEMETRY_DISTRO_VERSION: "telemetry.distro.version";
/**
 * The fully qualified human readable name of the [test case](https://wikipedia.org/wiki/Test_case).
 *
 * @example org.example.TestCase1.test1
 * @example example/tests/TestCase1.test1
 * @example ExampleTestCase1_test1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TEST_CASE_NAME: "test.case.name";
/**
 * The status of the actual test case result from test execution.
 *
 * @example pass
 * @example fail
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TEST_CASE_RESULT_STATUS: "test.case.result.status";
/**
* Enum value "fail" for attribute {@link ATTR_TEST_CASE_RESULT_STATUS}.
*/
declare const TEST_CASE_RESULT_STATUS_VALUE_FAIL: "fail";
/**
* Enum value "pass" for attribute {@link ATTR_TEST_CASE_RESULT_STATUS}.
*/
declare const TEST_CASE_RESULT_STATUS_VALUE_PASS: "pass";
/**
 * The human readable name of a [test suite](https://wikipedia.org/wiki/Test_suite).
 *
 * @example TestSuite1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TEST_SUITE_NAME: "test.suite.name";
/**
 * The status of the test suite run.
 *
 * @example success
 * @example failure
 * @example skipped
 * @example aborted
 * @example timed_out
 * @example in_progress
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TEST_SUITE_RUN_STATUS: "test.suite.run.status";
/**
* Enum value "aborted" for attribute {@link ATTR_TEST_SUITE_RUN_STATUS}.
*/
declare const TEST_SUITE_RUN_STATUS_VALUE_ABORTED: "aborted";
/**
* Enum value "failure" for attribute {@link ATTR_TEST_SUITE_RUN_STATUS}.
*/
declare const TEST_SUITE_RUN_STATUS_VALUE_FAILURE: "failure";
/**
* Enum value "in_progress" for attribute {@link ATTR_TEST_SUITE_RUN_STATUS}.
*/
declare const TEST_SUITE_RUN_STATUS_VALUE_IN_PROGRESS: "in_progress";
/**
* Enum value "skipped" for attribute {@link ATTR_TEST_SUITE_RUN_STATUS}.
*/
declare const TEST_SUITE_RUN_STATUS_VALUE_SKIPPED: "skipped";
/**
* Enum value "success" for attribute {@link ATTR_TEST_SUITE_RUN_STATUS}.
*/
declare const TEST_SUITE_RUN_STATUS_VALUE_SUCCESS: "success";
/**
* Enum value "timed_out" for attribute {@link ATTR_TEST_SUITE_RUN_STATUS}.
*/
declare const TEST_SUITE_RUN_STATUS_VALUE_TIMED_OUT: "timed_out";
/**
 * Current "managed" thread ID (as opposed to OS thread ID).
 *
 * @example 42
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_THREAD_ID: "thread.id";
/**
 * Current thread name.
 *
 * @example "main"
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_THREAD_NAME: "thread.name";
/**
 * String indicating the [cipher](https://datatracker.ietf.org/doc/html/rfc5246#appendix-A.5) used during the current connection.
 *
 * @example TLS_RSA_WITH_3DES_EDE_CBC_SHA
 * @example TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
 *
 * @note The values allowed for `tls.cipher` **MUST** be one of the `Descriptions` of the [registered TLS Cipher Suits](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#table-tls-parameters-4).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CIPHER: "tls.cipher";
/**
 * PEM-encoded stand-alone certificate offered by the client. This is usually mutually-exclusive of `client.certificate_chain` since this value also exists in that list.
 *
 * @example MII...
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_CERTIFICATE: "tls.client.certificate";
/**
 * Array of PEM-encoded certificates that make up the certificate chain offered by the client. This is usually mutually-exclusive of `client.certificate` since that value should be the first certificate in the chain.
 *
 * @example ["MII...", "MI..."]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_CERTIFICATE_CHAIN: "tls.client.certificate_chain";
/**
 * Certificate fingerprint using the MD5 digest of DER-encoded version of certificate offered by the client. For consistency with other hash values, this value should be formatted as an uppercase hash.
 *
 * @example 0F76C7F2C55BFD7D8E8B8F4BFBF0C9EC
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_HASH_MD5: "tls.client.hash.md5";
/**
 * Certificate fingerprint using the SHA1 digest of DER-encoded version of certificate offered by the client. For consistency with other hash values, this value should be formatted as an uppercase hash.
 *
 * @example 9E393D93138888D288266C2D915214D1D1CCEB2A
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_HASH_SHA1: "tls.client.hash.sha1";
/**
 * Certificate fingerprint using the SHA256 digest of DER-encoded version of certificate offered by the client. For consistency with other hash values, this value should be formatted as an uppercase hash.
 *
 * @example 0687F666A054EF17A08E2F2162EAB4CBC0D265E1D7875BE74BF3C712CA92DAF0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_HASH_SHA256: "tls.client.hash.sha256";
/**
 * Distinguished name of [subject](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1.2.6) of the issuer of the x.509 certificate presented by the client.
 *
 * @example CN=Example Root CA, OU=Infrastructure Team, DC=example, DC=com
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_ISSUER: "tls.client.issuer";
/**
 * A hash that identifies clients based on how they perform an SSL/TLS handshake.
 *
 * @example d4e5b18d6b55c71272893221c96ba240
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_JA3: "tls.client.ja3";
/**
 * Date/Time indicating when client certificate is no longer considered valid.
 *
 * @example 2021-01-01T00:00:00.000Z
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_NOT_AFTER: "tls.client.not_after";
/**
 * Date/Time indicating when client certificate is first considered valid.
 *
 * @example 1970-01-01T00:00:00.000Z
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_NOT_BEFORE: "tls.client.not_before";
/**
 * Deprecated, use `server.address` instead.
 *
 * @example opentelemetry.io
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `server.address`.
 */
declare const ATTR_TLS_CLIENT_SERVER_NAME: "tls.client.server_name";
/**
 * Distinguished name of subject of the x.509 certificate presented by the client.
 *
 * @example CN=myclient, OU=Documentation Team, DC=example, DC=com
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_SUBJECT: "tls.client.subject";
/**
 * Array of ciphers offered by the client during the client hello.
 *
 * @example ["TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384", "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CLIENT_SUPPORTED_CIPHERS: "tls.client.supported_ciphers";
/**
 * String indicating the curve used for the given cipher, when applicable
 *
 * @example secp256r1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_CURVE: "tls.curve";
/**
 * Boolean flag indicating if the TLS negotiation was successful and transitioned to an encrypted tunnel.
 *
 * @example true
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_ESTABLISHED: "tls.established";
/**
 * String indicating the protocol being tunneled. Per the values in the [IANA registry](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids), this string should be lower case.
 *
 * @example http/1.1
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_NEXT_PROTOCOL: "tls.next_protocol";
/**
 * Normalized lowercase protocol name parsed from original string of the negotiated [SSL/TLS protocol version](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version.html#RETURN-VALUES)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_PROTOCOL_NAME: "tls.protocol.name";
/**
* Enum value "ssl" for attribute {@link ATTR_TLS_PROTOCOL_NAME}.
*/
declare const TLS_PROTOCOL_NAME_VALUE_SSL: "ssl";
/**
* Enum value "tls" for attribute {@link ATTR_TLS_PROTOCOL_NAME}.
*/
declare const TLS_PROTOCOL_NAME_VALUE_TLS: "tls";
/**
 * Numeric part of the version parsed from the original string of the negotiated [SSL/TLS protocol version](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version.html#RETURN-VALUES)
 *
 * @example 1.2
 * @example 3
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_PROTOCOL_VERSION: "tls.protocol.version";
/**
 * Boolean flag indicating if this TLS connection was resumed from an existing TLS negotiation.
 *
 * @example true
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_RESUMED: "tls.resumed";
/**
 * PEM-encoded stand-alone certificate offered by the server. This is usually mutually-exclusive of `server.certificate_chain` since this value also exists in that list.
 *
 * @example MII...
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_CERTIFICATE: "tls.server.certificate";
/**
 * Array of PEM-encoded certificates that make up the certificate chain offered by the server. This is usually mutually-exclusive of `server.certificate` since that value should be the first certificate in the chain.
 *
 * @example ["MII...", "MI..."]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_CERTIFICATE_CHAIN: "tls.server.certificate_chain";
/**
 * Certificate fingerprint using the MD5 digest of DER-encoded version of certificate offered by the server. For consistency with other hash values, this value should be formatted as an uppercase hash.
 *
 * @example 0F76C7F2C55BFD7D8E8B8F4BFBF0C9EC
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_HASH_MD5: "tls.server.hash.md5";
/**
 * Certificate fingerprint using the SHA1 digest of DER-encoded version of certificate offered by the server. For consistency with other hash values, this value should be formatted as an uppercase hash.
 *
 * @example 9E393D93138888D288266C2D915214D1D1CCEB2A
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_HASH_SHA1: "tls.server.hash.sha1";
/**
 * Certificate fingerprint using the SHA256 digest of DER-encoded version of certificate offered by the server. For consistency with other hash values, this value should be formatted as an uppercase hash.
 *
 * @example 0687F666A054EF17A08E2F2162EAB4CBC0D265E1D7875BE74BF3C712CA92DAF0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_HASH_SHA256: "tls.server.hash.sha256";
/**
 * Distinguished name of [subject](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1.2.6) of the issuer of the x.509 certificate presented by the client.
 *
 * @example CN=Example Root CA, OU=Infrastructure Team, DC=example, DC=com
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_ISSUER: "tls.server.issuer";
/**
 * A hash that identifies servers based on how they perform an SSL/TLS handshake.
 *
 * @example d4e5b18d6b55c71272893221c96ba240
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_JA3S: "tls.server.ja3s";
/**
 * Date/Time indicating when server certificate is no longer considered valid.
 *
 * @example 2021-01-01T00:00:00.000Z
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_NOT_AFTER: "tls.server.not_after";
/**
 * Date/Time indicating when server certificate is first considered valid.
 *
 * @example 1970-01-01T00:00:00.000Z
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_NOT_BEFORE: "tls.server.not_before";
/**
 * Distinguished name of subject of the x.509 certificate presented by the server.
 *
 * @example CN=myserver, OU=Documentation Team, DC=example, DC=com
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_TLS_SERVER_SUBJECT: "tls.server.subject";
/**
 * Domain extracted from the `url.full`, such as "opentelemetry.io".
 *
 * @example www.foo.bar
 * @example opentelemetry.io
 * @example 3.12.167.2
 * @example [1080:0:0:0:8:800:200C:417A]
 *
 * @note In some cases a URL may refer to an IP and/or port directly, without a domain name. In this case, the IP address would go to the domain field. If the URL contains a [literal IPv6 address](https://www.rfc-editor.org/rfc/rfc2732#section-2) enclosed by `[` and `]`, the `[` and `]` characters should also be captured in the domain field.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_URL_DOMAIN: "url.domain";
/**
 * The file extension extracted from the `url.full`, excluding the leading dot.
 *
 * @example png
 * @example gz
 *
 * @note The file extension is only set if it exists, as not every url has a file extension. When the file name has multiple extensions `example.tar.gz`, only the last one should be captured `gz`, not `tar.gz`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_URL_EXTENSION: "url.extension";
/**
 * Unmodified original URL as seen in the event source.
 *
 * @example https://www.foo.bar/search?q=OpenTelemetry#SemConv
 * @example search?q=OpenTelemetry
 *
 * @note In network monitoring, the observed URL may be a full URL, whereas in access logs, the URL is often just represented as a path. This field is meant to represent the URL as it was observed, complete or not.
 * `url.original` might contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case password and username **SHOULD NOT** be redacted and attribute's value **SHOULD** remain the same.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_URL_ORIGINAL: "url.original";
/**
 * Port extracted from the `url.full`
 *
 * @example 443
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_URL_PORT: "url.port";
/**
 * The highest registered url domain, stripped of the subdomain.
 *
 * @example example.com
 * @example foo.co.uk
 *
 * @note This value can be determined precisely with the [public suffix list](http://publicsuffix.org). For example, the registered domain for `foo.example.com` is `example.com`. Trying to approximate this by simply taking the last two labels will not work well for TLDs such as `co.uk`.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_URL_REGISTERED_DOMAIN: "url.registered_domain";
/**
 * The subdomain portion of a fully qualified domain name includes all of the names except the host name under the registered_domain. In a partially qualified domain, or if the qualification level of the full name cannot be determined, subdomain contains all of the names below the registered domain.
 *
 * @example east
 * @example sub2.sub1
 *
 * @note The subdomain portion of `www.east.mydomain.co.uk` is `east`. If the domain has multiple levels of subdomain, such as `sub2.sub1.example.com`, the subdomain field should contain `sub2.sub1`, with no trailing period.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_URL_SUBDOMAIN: "url.subdomain";
/**
 * The low-cardinality template of an [absolute path reference](https://www.rfc-editor.org/rfc/rfc3986#section-4.2).
 *
 * @example /users/{id}
 * @example /users/:id
 * @example /users?id={id}
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_URL_TEMPLATE: "url.template";
/**
 * The effective top level domain (eTLD), also known as the domain suffix, is the last part of the domain name. For example, the top level domain for example.com is `com`.
 *
 * @example com
 * @example co.uk
 *
 * @note This value can be determined precisely with the [public suffix list](http://publicsuffix.org).
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_URL_TOP_LEVEL_DOMAIN: "url.top_level_domain";
/**
 * User email address.
 *
 * @example a.einstein@example.com
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_EMAIL: "user.email";
/**
 * User's full name
 *
 * @example Albert Einstein
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_FULL_NAME: "user.full_name";
/**
 * Unique user hash to correlate information for a user in anonymized form.
 *
 * @example 364fc68eaf4c8acec74a4e52d7d1feaa
 *
 * @note Useful if `user.id` or `user.name` contain confidential information and cannot be used.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_HASH: "user.hash";
/**
 * Unique identifier of the user.
 *
 * @example S-1-5-21-202424912787-2692429404-2351956786-1000
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_ID: "user.id";
/**
 * Short name or login/username of the user.
 *
 * @example a.einstein
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_NAME: "user.name";
/**
 * Array of user roles at the time of the event.
 *
 * @example ["admin", "reporting_user"]
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_ROLES: "user.roles";
/**
 * Name of the user-agent extracted from original. Usually refers to the browser's name.
 *
 * @example Safari
 * @example YourApp
 *
 * @note [Example](https://www.whatsmyua.info) of extracting browser's name from original string. In the case of using a user-agent for non-browser products, such as microservices with multiple names/versions inside the `user_agent.original`, the most significant name **SHOULD** be selected. In such a scenario it should align with `user_agent.version`
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_AGENT_NAME: "user_agent.name";
/**
 * Specifies the category of synthetic traffic, such as tests or bots.
 *
 * @note This attribute **MAY** be derived from the contents of the `user_agent.original` attribute. Components that populate the attribute are responsible for determining what they consider to be synthetic bot or test traffic. This attribute can either be set for self-identification purposes, or on telemetry detected to be generated as a result of a synthetic request. This attribute is useful for distinguishing between genuine client traffic and synthetic traffic generated by bots or tests.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_AGENT_SYNTHETIC_TYPE: "user_agent.synthetic.type";
/**
* Enum value "bot" for attribute {@link ATTR_USER_AGENT_SYNTHETIC_TYPE}.
*/
declare const USER_AGENT_SYNTHETIC_TYPE_VALUE_BOT: "bot";
/**
* Enum value "test" for attribute {@link ATTR_USER_AGENT_SYNTHETIC_TYPE}.
*/
declare const USER_AGENT_SYNTHETIC_TYPE_VALUE_TEST: "test";
/**
 * Version of the user-agent extracted from original. Usually refers to the browser's version
 *
 * @example 14.1.2
 * @example 1.0.0
 *
 * @note [Example](https://www.whatsmyua.info) of extracting browser's version from original string. In the case of using a user-agent for non-browser products, such as microservices with multiple names/versions inside the `user_agent.original`, the most significant version **SHOULD** be selected. In such a scenario it should align with `user_agent.name`
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_USER_AGENT_VERSION: "user_agent.version";
/**
 * The type of garbage collection.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_V8JS_GC_TYPE: "v8js.gc.type";
/**
* Enum value "incremental" for attribute {@link ATTR_V8JS_GC_TYPE}.
*/
declare const V8JS_GC_TYPE_VALUE_INCREMENTAL: "incremental";
/**
* Enum value "major" for attribute {@link ATTR_V8JS_GC_TYPE}.
*/
declare const V8JS_GC_TYPE_VALUE_MAJOR: "major";
/**
* Enum value "minor" for attribute {@link ATTR_V8JS_GC_TYPE}.
*/
declare const V8JS_GC_TYPE_VALUE_MINOR: "minor";
/**
* Enum value "weakcb" for attribute {@link ATTR_V8JS_GC_TYPE}.
*/
declare const V8JS_GC_TYPE_VALUE_WEAKCB: "weakcb";
/**
 * The name of the space type of heap memory.
 *
 * @note Value can be retrieved from value `space_name` of [`v8.getHeapSpaceStatistics()`](https://nodejs.org/api/v8.html#v8getheapspacestatistics)
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_V8JS_HEAP_SPACE_NAME: "v8js.heap.space.name";
/**
* Enum value "code_space" for attribute {@link ATTR_V8JS_HEAP_SPACE_NAME}.
*/
declare const V8JS_HEAP_SPACE_NAME_VALUE_CODE_SPACE: "code_space";
/**
* Enum value "large_object_space" for attribute {@link ATTR_V8JS_HEAP_SPACE_NAME}.
*/
declare const V8JS_HEAP_SPACE_NAME_VALUE_LARGE_OBJECT_SPACE: "large_object_space";
/**
* Enum value "map_space" for attribute {@link ATTR_V8JS_HEAP_SPACE_NAME}.
*/
declare const V8JS_HEAP_SPACE_NAME_VALUE_MAP_SPACE: "map_space";
/**
* Enum value "new_space" for attribute {@link ATTR_V8JS_HEAP_SPACE_NAME}.
*/
declare const V8JS_HEAP_SPACE_NAME_VALUE_NEW_SPACE: "new_space";
/**
* Enum value "old_space" for attribute {@link ATTR_V8JS_HEAP_SPACE_NAME}.
*/
declare const V8JS_HEAP_SPACE_NAME_VALUE_OLD_SPACE: "old_space";
/**
 * The ID of the change (pull request/merge request/changelist) if applicable. This is usually a unique (within repository) identifier generated by the VCS system.
 *
 * @example 123
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_CHANGE_ID: "vcs.change.id";
/**
 * The state of the change (pull request/merge request/changelist).
 *
 * @example open
 * @example closed
 * @example merged
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_CHANGE_STATE: "vcs.change.state";
/**
* Enum value "closed" for attribute {@link ATTR_VCS_CHANGE_STATE}.
*/
declare const VCS_CHANGE_STATE_VALUE_CLOSED: "closed";
/**
* Enum value "merged" for attribute {@link ATTR_VCS_CHANGE_STATE}.
*/
declare const VCS_CHANGE_STATE_VALUE_MERGED: "merged";
/**
* Enum value "open" for attribute {@link ATTR_VCS_CHANGE_STATE}.
*/
declare const VCS_CHANGE_STATE_VALUE_OPEN: "open";
/**
* Enum value "wip" for attribute {@link ATTR_VCS_CHANGE_STATE}.
*/
declare const VCS_CHANGE_STATE_VALUE_WIP: "wip";
/**
 * The human readable title of the change (pull request/merge request/changelist). This title is often a brief summary of the change and may get merged in to a ref as the commit summary.
 *
 * @example Fixes broken thing
 * @example feat: add my new feature
 * @example [chore] update dependency
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_CHANGE_TITLE: "vcs.change.title";
/**
 * The type of line change being measured on a branch or change.
 *
 * @example added
 * @example removed
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_LINE_CHANGE_TYPE: "vcs.line_change.type";
/**
* Enum value "added" for attribute {@link ATTR_VCS_LINE_CHANGE_TYPE}.
*/
declare const VCS_LINE_CHANGE_TYPE_VALUE_ADDED: "added";
/**
* Enum value "removed" for attribute {@link ATTR_VCS_LINE_CHANGE_TYPE}.
*/
declare const VCS_LINE_CHANGE_TYPE_VALUE_REMOVED: "removed";
/**
 * The name of the [reference](https://git-scm.com/docs/gitglossary#def_ref) such as **branch** or **tag** in the repository.
 *
 * @example my-feature-branch
 * @example tag-1-test
 *
 * @note `base` refers to the starting point of a change. For example, `main`
 * would be the base reference of type branch if you've created a new
 * reference of type branch from it and created new commits.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REF_BASE_NAME: "vcs.ref.base.name";
/**
 * The revision, literally [revised version](https://www.merriam-webster.com/dictionary/revision), The revision most often refers to a commit object in Git, or a revision number in SVN.
 *
 * @example 9d59409acf479dfa0df1aa568182e43e43df8bbe28d60fcf2bc52e30068802cc
 * @example main
 * @example 123
 * @example HEAD
 *
 * @note `base` refers to the starting point of a change. For example, `main`
 * would be the base reference of type branch if you've created a new
 * reference of type branch from it and created new commits. The
 * revision can be a full [hash value (see
 * glossary)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf),
 * of the recorded change to a ref within a repository pointing to a
 * commit [commit](https://git-scm.com/docs/git-commit) object. It does
 * not necessarily have to be a hash; it can simply define a [revision
 * number](https://svnbook.red-bean.com/en/1.7/svn.tour.revs.specifiers.html)
 * which is an integer that is monotonically increasing. In cases where
 * it is identical to the `ref.base.name`, it **SHOULD** still be included.
 * It is up to the implementer to decide which value to set as the
 * revision based on the VCS system and situational context.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REF_BASE_REVISION: "vcs.ref.base.revision";
/**
 * The type of the [reference](https://git-scm.com/docs/gitglossary#def_ref) in the repository.
 *
 * @example branch
 * @example tag
 *
 * @note `base` refers to the starting point of a change. For example, `main`
 * would be the base reference of type branch if you've created a new
 * reference of type branch from it and created new commits.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REF_BASE_TYPE: "vcs.ref.base.type";
/**
* Enum value "branch" for attribute {@link ATTR_VCS_REF_BASE_TYPE}.
*/
declare const VCS_REF_BASE_TYPE_VALUE_BRANCH: "branch";
/**
* Enum value "tag" for attribute {@link ATTR_VCS_REF_BASE_TYPE}.
*/
declare const VCS_REF_BASE_TYPE_VALUE_TAG: "tag";
/**
 * The name of the [reference](https://git-scm.com/docs/gitglossary#def_ref) such as **branch** or **tag** in the repository.
 *
 * @example my-feature-branch
 * @example tag-1-test
 *
 * @note `head` refers to where you are right now; the current reference at a
 * given time.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REF_HEAD_NAME: "vcs.ref.head.name";
/**
 * The revision, literally [revised version](https://www.merriam-webster.com/dictionary/revision), The revision most often refers to a commit object in Git, or a revision number in SVN.
 *
 * @example 9d59409acf479dfa0df1aa568182e43e43df8bbe28d60fcf2bc52e30068802cc
 * @example main
 * @example 123
 * @example HEAD
 *
 * @note `head` refers to where you are right now; the current reference at a
 * given time.The revision can be a full [hash value (see
 * glossary)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf),
 * of the recorded change to a ref within a repository pointing to a
 * commit [commit](https://git-scm.com/docs/git-commit) object. It does
 * not necessarily have to be a hash; it can simply define a [revision
 * number](https://svnbook.red-bean.com/en/1.7/svn.tour.revs.specifiers.html)
 * which is an integer that is monotonically increasing. In cases where
 * it is identical to the `ref.head.name`, it **SHOULD** still be included.
 * It is up to the implementer to decide which value to set as the
 * revision based on the VCS system and situational context.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REF_HEAD_REVISION: "vcs.ref.head.revision";
/**
 * The type of the [reference](https://git-scm.com/docs/gitglossary#def_ref) in the repository.
 *
 * @example branch
 * @example tag
 *
 * @note `head` refers to where you are right now; the current reference at a
 * given time.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REF_HEAD_TYPE: "vcs.ref.head.type";
/**
* Enum value "branch" for attribute {@link ATTR_VCS_REF_HEAD_TYPE}.
*/
declare const VCS_REF_HEAD_TYPE_VALUE_BRANCH: "branch";
/**
* Enum value "tag" for attribute {@link ATTR_VCS_REF_HEAD_TYPE}.
*/
declare const VCS_REF_HEAD_TYPE_VALUE_TAG: "tag";
/**
 * The type of the [reference](https://git-scm.com/docs/gitglossary#def_ref) in the repository.
 *
 * @example branch
 * @example tag
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REF_TYPE: "vcs.ref.type";
/**
* Enum value "branch" for attribute {@link ATTR_VCS_REF_TYPE}.
*/
declare const VCS_REF_TYPE_VALUE_BRANCH: "branch";
/**
* Enum value "tag" for attribute {@link ATTR_VCS_REF_TYPE}.
*/
declare const VCS_REF_TYPE_VALUE_TAG: "tag";
/**
 * Deprecated, use `vcs.change.id` instead.
 *
 * @example 123
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Deprecated, use `vcs.change.id` instead.
 */
declare const ATTR_VCS_REPOSITORY_CHANGE_ID: "vcs.repository.change.id";
/**
 * Deprecated, use `vcs.change.title` instead.
 *
 * @example Fixes broken thing
 * @example feat: add my new feature
 * @example [chore] update dependency
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Deprecated, use `vcs.change.title` instead.
 */
declare const ATTR_VCS_REPOSITORY_CHANGE_TITLE: "vcs.repository.change.title";
/**
 * The human readable name of the repository. It **SHOULD NOT** include any additional identifier like Group/SubGroup in GitLab or organization in GitHub.
 *
 * @example semantic-conventions
 * @example my-cool-repo
 *
 * @note Due to it only being the name, it can clash with forks of the same
 * repository if collecting telemetry across multiple orgs or groups in
 * the same backends.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REPOSITORY_NAME: "vcs.repository.name";
/**
 * Deprecated, use `vcs.ref.head.name` instead.
 *
 * @example my-feature-branch
 * @example tag-1-test
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Deprecated, use `vcs.ref.head.name` instead.
 */
declare const ATTR_VCS_REPOSITORY_REF_NAME: "vcs.repository.ref.name";
/**
 * Deprecated, use `vcs.ref.head.revision` instead.
 *
 * @example 9d59409acf479dfa0df1aa568182e43e43df8bbe28d60fcf2bc52e30068802cc
 * @example main
 * @example 123
 * @example HEAD
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Deprecated, use `vcs.ref.head.revision` instead.
 */
declare const ATTR_VCS_REPOSITORY_REF_REVISION: "vcs.repository.ref.revision";
/**
 * Deprecated, use `vcs.ref.head.type` instead.
 *
 * @example branch
 * @example tag
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Deprecated, use `vcs.ref.head.type` instead.
 */
declare const ATTR_VCS_REPOSITORY_REF_TYPE: "vcs.repository.ref.type";
/**
* Enum value "branch" for attribute {@link ATTR_VCS_REPOSITORY_REF_TYPE}.
*/
declare const VCS_REPOSITORY_REF_TYPE_VALUE_BRANCH: "branch";
/**
* Enum value "tag" for attribute {@link ATTR_VCS_REPOSITORY_REF_TYPE}.
*/
declare const VCS_REPOSITORY_REF_TYPE_VALUE_TAG: "tag";
/**
 * The [canonical URL](https://support.google.com/webmasters/answer/10347851?hl=en#:~:text=A%20canonical%20URL%20is%20the,Google%20chooses%20one%20as%20canonical.) of the repository providing the complete HTTP(S) address in order to locate and identify the repository through a browser.
 *
 * @example https://github.com/opentelemetry/open-telemetry-collector-contrib
 * @example https://gitlab.com/my-org/my-project/my-projects-project/repo
 *
 * @note In Git Version Control Systems, the canonical URL **SHOULD NOT** include
 * the `.git` extension.
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REPOSITORY_URL_FULL: "vcs.repository.url.full";
/**
 * The type of revision comparison.
 *
 * @example ahead
 * @example behind
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_VCS_REVISION_DELTA_DIRECTION: "vcs.revision_delta.direction";
/**
* Enum value "ahead" for attribute {@link ATTR_VCS_REVISION_DELTA_DIRECTION}.
*/
declare const VCS_REVISION_DELTA_DIRECTION_VALUE_AHEAD: "ahead";
/**
* Enum value "behind" for attribute {@link ATTR_VCS_REVISION_DELTA_DIRECTION}.
*/
declare const VCS_REVISION_DELTA_DIRECTION_VALUE_BEHIND: "behind";
/**
 * Additional description of the web engine (e.g. detailed version and edition information).
 *
 * @example WildFly Full 21.0.0.Final (WildFly Core 13.0.1.Final) - 2.2.2.Final
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_WEBENGINE_DESCRIPTION: "webengine.description";
/**
 * The name of the web engine.
 *
 * @example WildFly
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_WEBENGINE_NAME: "webengine.name";
/**
 * The version of the web engine.
 *
 * @example 21.0.0
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const ATTR_WEBENGINE_VERSION: "webengine.version";

/**
 * Number of active client instances
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_AZURE_COSMOSDB_CLIENT_ACTIVE_INSTANCE_COUNT: "azure.cosmosdb.client.active_instance.count";
/**
 * [Request units](https://learn.microsoft.com/azure/cosmos-db/request-units) consumed by the operation
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_AZURE_COSMOSDB_CLIENT_OPERATION_REQUEST_CHARGE: "azure.cosmosdb.client.operation.request_charge";
/**
 * The number of pipeline runs currently active in the system by state.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CICD_PIPELINE_RUN_ACTIVE: "cicd.pipeline.run.active";
/**
 * Duration of a pipeline run grouped by pipeline, state and result.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CICD_PIPELINE_RUN_DURATION: "cicd.pipeline.run.duration";
/**
 * The number of errors encountered in pipeline runs (eg. compile, test failures).
 *
 * @note There might be errors in a pipeline run that are non fatal (eg. they are suppressed) or in a parallel stage multiple stages could have a fatal error.
 * This means that this error count might not be the same as the count of metric `cicd.pipeline.run.duration` with run result `failure`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CICD_PIPELINE_RUN_ERRORS: "cicd.pipeline.run.errors";
/**
 * The number of errors in a component of the CICD system (eg. controller, scheduler, agent).
 *
 * @note Errors in pipeline run execution are explicitly excluded. Ie a test failure is not counted in this metric.
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CICD_SYSTEM_ERRORS: "cicd.system.errors";
/**
 * The number of workers on the CICD system by state.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CICD_WORKER_COUNT: "cicd.worker.count";
/**
 * Total CPU time consumed
 *
 * @note Total CPU time consumed by the specific container on all available CPU cores
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CONTAINER_CPU_TIME: "container.cpu.time";
/**
 * Container's CPU usage, measured in cpus. Range from 0 to the number of allocatable CPUs
 *
 * @note CPU usage of the specific container on all available CPU cores, averaged over the sample window
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CONTAINER_CPU_USAGE: "container.cpu.usage";
/**
 * Disk bytes for the container.
 *
 * @note The total number of bytes read/written successfully (aggregated from all disks).
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CONTAINER_DISK_IO: "container.disk.io";
/**
 * Memory usage of the container.
 *
 * @note Memory usage of the container.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CONTAINER_MEMORY_USAGE: "container.memory.usage";
/**
 * Network bytes for the container.
 *
 * @note The number of bytes sent/received on all network interfaces by the container.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CONTAINER_NETWORK_IO: "container.network.io";
/**
 * The time the container has been running
 *
 * @note Instrumentations **SHOULD** use a gauge with type `double` and measure uptime in seconds as a floating point number with the highest precision available.
 * The actual accuracy would depend on the instrumentation and operating system.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_CONTAINER_UPTIME: "container.uptime";
/**
 * The number of connections that are currently in state described by the `state` attribute
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_COUNT: "db.client.connection.count";
/**
 * The time it took to create a new connection
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_CREATE_TIME: "db.client.connection.create_time";
/**
 * The maximum number of idle open connections allowed
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_IDLE_MAX: "db.client.connection.idle.max";
/**
 * The minimum number of idle open connections allowed
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_IDLE_MIN: "db.client.connection.idle.min";
/**
 * The maximum number of open connections allowed
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_MAX: "db.client.connection.max";
/**
 * The number of current pending requests for an open connection
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_PENDING_REQUESTS: "db.client.connection.pending_requests";
/**
 * The number of connection timeouts that have occurred trying to obtain a connection from the pool
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_TIMEOUTS: "db.client.connection.timeouts";
/**
 * The time between borrowing a connection and returning it to the pool
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_USE_TIME: "db.client.connection.use_time";
/**
 * The time it took to obtain an open connection from the pool
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_CONNECTION_WAIT_TIME: "db.client.connection.wait_time";
/**
 * Deprecated, use `db.client.connection.create_time` instead. Note: the unit also changed from `ms` to `s`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.create_time`. Note: the unit also changed from `ms` to `s`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_CREATE_TIME: "db.client.connections.create_time";
/**
 * Deprecated, use `db.client.connection.idle.max` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.idle.max`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_IDLE_MAX: "db.client.connections.idle.max";
/**
 * Deprecated, use `db.client.connection.idle.min` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.idle.min`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_IDLE_MIN: "db.client.connections.idle.min";
/**
 * Deprecated, use `db.client.connection.max` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.max`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_MAX: "db.client.connections.max";
/**
 * Deprecated, use `db.client.connection.pending_requests` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.pending_requests`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_PENDING_REQUESTS: "db.client.connections.pending_requests";
/**
 * Deprecated, use `db.client.connection.timeouts` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.timeouts`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_TIMEOUTS: "db.client.connections.timeouts";
/**
 * Deprecated, use `db.client.connection.count` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.count`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_USAGE: "db.client.connections.usage";
/**
 * Deprecated, use `db.client.connection.use_time` instead. Note: the unit also changed from `ms` to `s`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.use_time`. Note: the unit also changed from `ms` to `s`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_USE_TIME: "db.client.connections.use_time";
/**
 * Deprecated, use `db.client.connection.wait_time` instead. Note: the unit also changed from `ms` to `s`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `db.client.connection.wait_time`. Note: the unit also changed from `ms` to `s`.
 */
declare const METRIC_DB_CLIENT_CONNECTIONS_WAIT_TIME: "db.client.connections.wait_time";
/**
 * Deprecated, use `azure.cosmosdb.client.active_instance.count` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.cosmosdb.client.active_instance.count`.
 */
declare const METRIC_DB_CLIENT_COSMOSDB_ACTIVE_INSTANCE_COUNT: "db.client.cosmosdb.active_instance.count";
/**
 * Deprecated, use `azure.cosmosdb.client.operation.request_charge` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `azure.cosmosdb.client.operation.request_charge`.
 */
declare const METRIC_DB_CLIENT_COSMOSDB_OPERATION_REQUEST_CHARGE: "db.client.cosmosdb.operation.request_charge";
/**
 * Duration of database client operations.
 *
 * @note Batch operations **SHOULD** be recorded as a single operation.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_OPERATION_DURATION: "db.client.operation.duration";
/**
 * The actual number of records returned by the database operation.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DB_CLIENT_RESPONSE_RETURNED_ROWS: "db.client.response.returned_rows";
/**
 * Measures the time taken to perform a DNS lookup.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_DNS_LOOKUP_DURATION: "dns.lookup.duration";
/**
 * Number of invocation cold starts
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_COLDSTARTS: "faas.coldstarts";
/**
 * Distribution of CPU usage per invocation
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_CPU_USAGE: "faas.cpu_usage";
/**
 * Number of invocation errors
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_ERRORS: "faas.errors";
/**
 * Measures the duration of the function's initialization, such as a cold start
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_INIT_DURATION: "faas.init_duration";
/**
 * Number of successful invocations
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_INVOCATIONS: "faas.invocations";
/**
 * Measures the duration of the function's logic execution
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_INVOKE_DURATION: "faas.invoke_duration";
/**
 * Distribution of max memory usage per invocation
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_MEM_USAGE: "faas.mem_usage";
/**
 * Distribution of net I/O usage per invocation
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_NET_IO: "faas.net_io";
/**
 * Number of invocation timeouts
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_FAAS_TIMEOUTS: "faas.timeouts";
/**
 * GenAI operation duration
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GEN_AI_CLIENT_OPERATION_DURATION: "gen_ai.client.operation.duration";
/**
 * Measures number of input and output tokens used
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GEN_AI_CLIENT_TOKEN_USAGE: "gen_ai.client.token.usage";
/**
 * Generative AI server request duration such as time-to-last byte or last output token
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GEN_AI_SERVER_REQUEST_DURATION: "gen_ai.server.request.duration";
/**
 * Time per output token generated after the first token for successful responses
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GEN_AI_SERVER_TIME_PER_OUTPUT_TOKEN: "gen_ai.server.time_per_output_token";
/**
 * Time to generate first token for successful responses
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GEN_AI_SERVER_TIME_TO_FIRST_TOKEN: "gen_ai.server.time_to_first_token";
/**
 * Heap size target percentage configured by the user, otherwise 100.
 *
 * @note The value range is [0.0,100.0]. Computed from `/gc/gogc:percent`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_CONFIG_GOGC: "go.config.gogc";
/**
 * Count of live goroutines.
 *
 * @note Computed from `/sched/goroutines:goroutines`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_GOROUTINE_COUNT: "go.goroutine.count";
/**
 * Memory allocated to the heap by the application.
 *
 * @note Computed from `/gc/heap/allocs:bytes`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_MEMORY_ALLOCATED: "go.memory.allocated";
/**
 * Count of allocations to the heap by the application.
 *
 * @note Computed from `/gc/heap/allocs:objects`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_MEMORY_ALLOCATIONS: "go.memory.allocations";
/**
 * Heap size target for the end of the GC cycle.
 *
 * @note Computed from `/gc/heap/goal:bytes`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_MEMORY_GC_GOAL: "go.memory.gc.goal";
/**
 * Go runtime memory limit configured by the user, if a limit exists.
 *
 * @note Computed from `/gc/gomemlimit:bytes`. This metric is excluded if the limit obtained from the Go runtime is math.MaxInt64.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_MEMORY_LIMIT: "go.memory.limit";
/**
 * Memory used by the Go runtime.
 *
 * @note Computed from `(/memory/classes/total:bytes - /memory/classes/heap/released:bytes)`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_MEMORY_USED: "go.memory.used";
/**
 * The number of OS threads that can execute user-level Go code simultaneously.
 *
 * @note Computed from `/sched/gomaxprocs:threads`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_PROCESSOR_LIMIT: "go.processor.limit";
/**
 * The time goroutines have spent in the scheduler in a runnable state before actually running.
 *
 * @note Computed from `/sched/latencies:seconds`. Bucket boundaries are provided by the runtime, and are subject to change.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_GO_SCHEDULE_DURATION: "go.schedule.duration";
/**
 * Number of active HTTP requests.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HTTP_CLIENT_ACTIVE_REQUESTS: "http.client.active_requests";
/**
 * The duration of the successfully established outbound HTTP connections.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HTTP_CLIENT_CONNECTION_DURATION: "http.client.connection.duration";
/**
 * Number of outbound HTTP connections that are currently active or idle on the client.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HTTP_CLIENT_OPEN_CONNECTIONS: "http.client.open_connections";
/**
 * Size of HTTP client request bodies.
 *
 * @note The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#field.content-length) header. For requests using transport encoding, this should be the compressed size.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HTTP_CLIENT_REQUEST_BODY_SIZE: "http.client.request.body.size";
/**
 * Size of HTTP client response bodies.
 *
 * @note The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#field.content-length) header. For requests using transport encoding, this should be the compressed size.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HTTP_CLIENT_RESPONSE_BODY_SIZE: "http.client.response.body.size";
/**
 * Number of active HTTP server requests.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HTTP_SERVER_ACTIVE_REQUESTS: "http.server.active_requests";
/**
 * Size of HTTP server request bodies.
 *
 * @note The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#field.content-length) header. For requests using transport encoding, this should be the compressed size.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HTTP_SERVER_REQUEST_BODY_SIZE: "http.server.request.body.size";
/**
 * Size of HTTP server response bodies.
 *
 * @note The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#field.content-length) header. For requests using transport encoding, this should be the compressed size.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HTTP_SERVER_RESPONSE_BODY_SIZE: "http.server.response.body.size";
/**
 * Energy consumed by the component
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HW_ENERGY: "hw.energy";
/**
 * Number of errors encountered by the component
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HW_ERRORS: "hw.errors";
/**
 * Instantaneous power consumed by the component
 *
 * @note It is recommended to report `hw.energy` instead of `hw.power` when possible.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HW_POWER: "hw.power";
/**
 * Operational status: `1` (true) or `0` (false) for each of the possible states
 *
 * @note `hw.status` is currently specified as an *UpDownCounter* but would ideally be represented using a [*StateSet* as defined in OpenMetrics](https://github.com/prometheus/OpenMetrics/blob/v1.0.0/specification/OpenMetrics.md#stateset). This semantic convention will be updated once *StateSet* is specified in OpenTelemetry. This planned change is not expected to have any consequence on the way users query their timeseries backend to retrieve the values of `hw.status` over time.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_HW_STATUS: "hw.status";
/**
 * Number of buffers in the pool.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_JVM_BUFFER_COUNT: "jvm.buffer.count";
/**
 * Measure of total memory capacity of buffers.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_JVM_BUFFER_MEMORY_LIMIT: "jvm.buffer.memory.limit";
/**
 * Deprecated, use `jvm.buffer.memory.used` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `jvm.buffer.memory.used`.
 */
declare const METRIC_JVM_BUFFER_MEMORY_USAGE: "jvm.buffer.memory.usage";
/**
 * Measure of memory used by buffers.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_JVM_BUFFER_MEMORY_USED: "jvm.buffer.memory.used";
/**
 * Measure of initial memory requested.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_JVM_MEMORY_INIT: "jvm.memory.init";
/**
 * Average CPU load of the whole system for the last minute as reported by the JVM.
 *
 * @note The value range is [0,n], where n is the number of CPU cores - or a negative number if the value is not available. This utilization is not defined as being for the specific interval since last measurement (unlike `system.cpu.utilization`). [Reference](https://docs.oracle.com/en/java/javase/17/docs/api/java.management/java/lang/management/OperatingSystemMXBean.html#getSystemLoadAverage()).
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_JVM_SYSTEM_CPU_LOAD_1M: "jvm.system.cpu.load_1m";
/**
 * Recent CPU utilization for the whole system as reported by the JVM.
 *
 * @note The value range is [0.0,1.0]. This utilization is not defined as being for the specific interval since last measurement (unlike `system.cpu.utilization`). [Reference](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.management/com/sun/management/OperatingSystemMXBean.html#getCpuLoad()).
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_JVM_SYSTEM_CPU_UTILIZATION: "jvm.system.cpu.utilization";
/**
 * The number of actively running jobs for a cronjob
 *
 * @note This metric aligns with the `active` field of the
 * [K8s CronJobStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#cronjobstatus-v1-batch).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.cronjob`](../resource/k8s.md#cronjob) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_CRONJOB_ACTIVE_JOBS: "k8s.cronjob.active_jobs";
/**
 * Number of nodes that are running at least 1 daemon pod and are supposed to run the daemon pod
 *
 * @note This metric aligns with the `currentNumberScheduled` field of the
 * [K8s DaemonSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#daemonsetstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.daemonset`](../resource/k8s.md#daemonset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_DAEMONSET_CURRENT_SCHEDULED_NODES: "k8s.daemonset.current_scheduled_nodes";
/**
 * Number of nodes that should be running the daemon pod (including nodes currently running the daemon pod)
 *
 * @note This metric aligns with the `desiredNumberScheduled` field of the
 * [K8s DaemonSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#daemonsetstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.daemonset`](../resource/k8s.md#daemonset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_DAEMONSET_DESIRED_SCHEDULED_NODES: "k8s.daemonset.desired_scheduled_nodes";
/**
 * Number of nodes that are running the daemon pod, but are not supposed to run the daemon pod
 *
 * @note This metric aligns with the `numberMisscheduled` field of the
 * [K8s DaemonSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#daemonsetstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.daemonset`](../resource/k8s.md#daemonset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_DAEMONSET_MISSCHEDULED_NODES: "k8s.daemonset.misscheduled_nodes";
/**
 * Number of nodes that should be running the daemon pod and have one or more of the daemon pod running and ready
 *
 * @note This metric aligns with the `numberReady` field of the
 * [K8s DaemonSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#daemonsetstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.daemonset`](../resource/k8s.md#daemonset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_DAEMONSET_READY_NODES: "k8s.daemonset.ready_nodes";
/**
 * Total number of available replica pods (ready for at least minReadySeconds) targeted by this deployment
 *
 * @note This metric aligns with the `availableReplicas` field of the
 * [K8s DeploymentStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#deploymentstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.deployment`](../resource/k8s.md#deployment) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_DEPLOYMENT_AVAILABLE_PODS: "k8s.deployment.available_pods";
/**
 * Number of desired replica pods in this deployment
 *
 * @note This metric aligns with the `replicas` field of the
 * [K8s DeploymentSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#deploymentspec-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.deployment`](../resource/k8s.md#deployment) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_DEPLOYMENT_DESIRED_PODS: "k8s.deployment.desired_pods";
/**
 * Current number of replica pods managed by this horizontal pod autoscaler, as last seen by the autoscaler
 *
 * @note This metric aligns with the `currentReplicas` field of the
 * [K8s HorizontalPodAutoscalerStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#horizontalpodautoscalerstatus-v2-autoscaling)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_HPA_CURRENT_PODS: "k8s.hpa.current_pods";
/**
 * Desired number of replica pods managed by this horizontal pod autoscaler, as last calculated by the autoscaler
 *
 * @note This metric aligns with the `desiredReplicas` field of the
 * [K8s HorizontalPodAutoscalerStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#horizontalpodautoscalerstatus-v2-autoscaling)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_HPA_DESIRED_PODS: "k8s.hpa.desired_pods";
/**
 * The upper limit for the number of replica pods to which the autoscaler can scale up
 *
 * @note This metric aligns with the `maxReplicas` field of the
 * [K8s HorizontalPodAutoscalerSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#horizontalpodautoscalerspec-v2-autoscaling)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_HPA_MAX_PODS: "k8s.hpa.max_pods";
/**
 * The lower limit for the number of replica pods to which the autoscaler can scale down
 *
 * @note This metric aligns with the `minReplicas` field of the
 * [K8s HorizontalPodAutoscalerSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#horizontalpodautoscalerspec-v2-autoscaling)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_HPA_MIN_PODS: "k8s.hpa.min_pods";
/**
 * The number of pending and actively running pods for a job
 *
 * @note This metric aligns with the `active` field of the
 * [K8s JobStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#jobstatus-v1-batch).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.job`](../resource/k8s.md#job) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_JOB_ACTIVE_PODS: "k8s.job.active_pods";
/**
 * The desired number of successfully finished pods the job should be run with
 *
 * @note This metric aligns with the `completions` field of the
 * [K8s JobSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#jobspec-v1-batch).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.job`](../resource/k8s.md#job) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_JOB_DESIRED_SUCCESSFUL_PODS: "k8s.job.desired_successful_pods";
/**
 * The number of pods which reached phase Failed for a job
 *
 * @note This metric aligns with the `failed` field of the
 * [K8s JobStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#jobstatus-v1-batch).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.job`](../resource/k8s.md#job) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_JOB_FAILED_PODS: "k8s.job.failed_pods";
/**
 * The max desired number of pods the job should run at any given time
 *
 * @note This metric aligns with the `parallelism` field of the
 * [K8s JobSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#jobspec-v1-batch.
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.job`](../resource/k8s.md#job) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_JOB_MAX_PARALLEL_PODS: "k8s.job.max_parallel_pods";
/**
 * The number of pods which reached phase Succeeded for a job
 *
 * @note This metric aligns with the `succeeded` field of the
 * [K8s JobStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#jobstatus-v1-batch).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.job`](../resource/k8s.md#job) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_JOB_SUCCESSFUL_PODS: "k8s.job.successful_pods";
/**
 * Describes number of K8s namespaces that are currently in a given phase.
 *
 * @note This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.namespace`](../resource/k8s.md#namespace) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_NAMESPACE_PHASE: "k8s.namespace.phase";
/**
 * Total CPU time consumed
 *
 * @note Total CPU time consumed by the specific Node on all available CPU cores
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_NODE_CPU_TIME: "k8s.node.cpu.time";
/**
 * Node's CPU usage, measured in cpus. Range from 0 to the number of allocatable CPUs
 *
 * @note CPU usage of the specific Node on all available CPU cores, averaged over the sample window
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_NODE_CPU_USAGE: "k8s.node.cpu.usage";
/**
 * Memory usage of the Node
 *
 * @note Total memory usage of the Node
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_NODE_MEMORY_USAGE: "k8s.node.memory.usage";
/**
 * Node network errors
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_NODE_NETWORK_ERRORS: "k8s.node.network.errors";
/**
 * Network bytes for the Node
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_NODE_NETWORK_IO: "k8s.node.network.io";
/**
 * The time the Node has been running
 *
 * @note Instrumentations **SHOULD** use a gauge with type `double` and measure uptime in seconds as a floating point number with the highest precision available.
 * The actual accuracy would depend on the instrumentation and operating system.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_NODE_UPTIME: "k8s.node.uptime";
/**
 * Total CPU time consumed
 *
 * @note Total CPU time consumed by the specific Pod on all available CPU cores
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_POD_CPU_TIME: "k8s.pod.cpu.time";
/**
 * Pod's CPU usage, measured in cpus. Range from 0 to the number of allocatable CPUs
 *
 * @note CPU usage of the specific Pod on all available CPU cores, averaged over the sample window
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_POD_CPU_USAGE: "k8s.pod.cpu.usage";
/**
 * Memory usage of the Pod
 *
 * @note Total memory usage of the Pod
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_POD_MEMORY_USAGE: "k8s.pod.memory.usage";
/**
 * Pod network errors
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_POD_NETWORK_ERRORS: "k8s.pod.network.errors";
/**
 * Network bytes for the Pod
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_POD_NETWORK_IO: "k8s.pod.network.io";
/**
 * The time the Pod has been running
 *
 * @note Instrumentations **SHOULD** use a gauge with type `double` and measure uptime in seconds as a floating point number with the highest precision available.
 * The actual accuracy would depend on the instrumentation and operating system.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_POD_UPTIME: "k8s.pod.uptime";
/**
 * Total number of available replica pods (ready for at least minReadySeconds) targeted by this replicaset
 *
 * @note This metric aligns with the `availableReplicas` field of the
 * [K8s ReplicaSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#replicasetstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.replicaset`](../resource/k8s.md#replicaset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_REPLICASET_AVAILABLE_PODS: "k8s.replicaset.available_pods";
/**
 * Number of desired replica pods in this replicaset
 *
 * @note This metric aligns with the `replicas` field of the
 * [K8s ReplicaSetSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#replicasetspec-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.replicaset`](../resource/k8s.md#replicaset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_REPLICASET_DESIRED_PODS: "k8s.replicaset.desired_pods";
/**
 * Total number of available replica pods (ready for at least minReadySeconds) targeted by this replication controller
 *
 * @note This metric aligns with the `availableReplicas` field of the
 * [K8s ReplicationControllerStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#replicationcontrollerstatus-v1-core)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_REPLICATION_CONTROLLER_AVAILABLE_PODS: "k8s.replication_controller.available_pods";
/**
 * Number of desired replica pods in this replication controller
 *
 * @note This metric aligns with the `replicas` field of the
 * [K8s ReplicationControllerSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#replicationcontrollerspec-v1-core)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_REPLICATION_CONTROLLER_DESIRED_PODS: "k8s.replication_controller.desired_pods";
/**
 * The number of replica pods created by the statefulset controller from the statefulset version indicated by currentRevision
 *
 * @note This metric aligns with the `currentReplicas` field of the
 * [K8s StatefulSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#statefulsetstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.statefulset`](../resource/k8s.md#statefulset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_STATEFULSET_CURRENT_PODS: "k8s.statefulset.current_pods";
/**
 * Number of desired replica pods in this statefulset
 *
 * @note This metric aligns with the `replicas` field of the
 * [K8s StatefulSetSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#statefulsetspec-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.statefulset`](../resource/k8s.md#statefulset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_STATEFULSET_DESIRED_PODS: "k8s.statefulset.desired_pods";
/**
 * The number of replica pods created for this statefulset with a Ready Condition
 *
 * @note This metric aligns with the `readyReplicas` field of the
 * [K8s StatefulSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#statefulsetstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.statefulset`](../resource/k8s.md#statefulset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_STATEFULSET_READY_PODS: "k8s.statefulset.ready_pods";
/**
 * Number of replica pods created by the statefulset controller from the statefulset version indicated by updateRevision
 *
 * @note This metric aligns with the `updatedReplicas` field of the
 * [K8s StatefulSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#statefulsetstatus-v1-apps).
 *
 * This metric **SHOULD**, at a minimum, be reported against a
 * [`k8s.statefulset`](../resource/k8s.md#statefulset) resource.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_K8S_STATEFULSET_UPDATED_PODS: "k8s.statefulset.updated_pods";
/**
 * Number of messages that were delivered to the application.
 *
 * @note Records the number of messages pulled from the broker or number of messages dispatched to the application in push-based scenarios.
 * The metric **SHOULD** be reported once per message delivery. For example, if receiving and processing operations are both instrumented for a single message delivery, this counter is incremented when the message is received and not reported when it is processed.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_MESSAGING_CLIENT_CONSUMED_MESSAGES: "messaging.client.consumed.messages";
/**
 * Duration of messaging operation initiated by a producer or consumer client.
 *
 * @note This metric **SHOULD NOT** be used to report processing duration - processing duration is reported in `messaging.process.duration` metric.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_MESSAGING_CLIENT_OPERATION_DURATION: "messaging.client.operation.duration";
/**
 * Deprecated. Use `messaging.client.sent.messages` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.client.sent.messages`.
 */
declare const METRIC_MESSAGING_CLIENT_PUBLISHED_MESSAGES: "messaging.client.published.messages";
/**
 * Number of messages producer attempted to send to the broker.
 *
 * @note This metric **MUST NOT** count messages that were created but haven't yet been sent.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_MESSAGING_CLIENT_SENT_MESSAGES: "messaging.client.sent.messages";
/**
 * Duration of processing operation.
 *
 * @note This metric **MUST** be reported for operations with `messaging.operation.type` that matches `process`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_MESSAGING_PROCESS_DURATION: "messaging.process.duration";
/**
 * Deprecated. Use `messaging.client.consumed.messages` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.client.consumed.messages`.
 */
declare const METRIC_MESSAGING_PROCESS_MESSAGES: "messaging.process.messages";
/**
 * Deprecated. Use `messaging.client.operation.duration` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.client.operation.duration`.
 */
declare const METRIC_MESSAGING_PUBLISH_DURATION: "messaging.publish.duration";
/**
 * Deprecated. Use `messaging.client.produced.messages` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.client.produced.messages`.
 */
declare const METRIC_MESSAGING_PUBLISH_MESSAGES: "messaging.publish.messages";
/**
 * Deprecated. Use `messaging.client.operation.duration` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.client.operation.duration`.
 */
declare const METRIC_MESSAGING_RECEIVE_DURATION: "messaging.receive.duration";
/**
 * Deprecated. Use `messaging.client.consumed.messages` instead.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 *
 * @deprecated Replaced by `messaging.client.consumed.messages`.
 */
declare const METRIC_MESSAGING_RECEIVE_MESSAGES: "messaging.receive.messages";
/**
 * Event loop maximum delay.
 *
 * @note Value can be retrieved from value `histogram.max` of [`perf_hooks.monitorEventLoopDelay([options])`](https://nodejs.org/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_DELAY_MAX: "nodejs.eventloop.delay.max";
/**
 * Event loop mean delay.
 *
 * @note Value can be retrieved from value `histogram.mean` of [`perf_hooks.monitorEventLoopDelay([options])`](https://nodejs.org/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_DELAY_MEAN: "nodejs.eventloop.delay.mean";
/**
 * Event loop minimum delay.
 *
 * @note Value can be retrieved from value `histogram.min` of [`perf_hooks.monitorEventLoopDelay([options])`](https://nodejs.org/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_DELAY_MIN: "nodejs.eventloop.delay.min";
/**
 * Event loop 50 percentile delay.
 *
 * @note Value can be retrieved from value `histogram.percentile(50)` of [`perf_hooks.monitorEventLoopDelay([options])`](https://nodejs.org/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_DELAY_P50: "nodejs.eventloop.delay.p50";
/**
 * Event loop 90 percentile delay.
 *
 * @note Value can be retrieved from value `histogram.percentile(90)` of [`perf_hooks.monitorEventLoopDelay([options])`](https://nodejs.org/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_DELAY_P90: "nodejs.eventloop.delay.p90";
/**
 * Event loop 99 percentile delay.
 *
 * @note Value can be retrieved from value `histogram.percentile(99)` of [`perf_hooks.monitorEventLoopDelay([options])`](https://nodejs.org/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_DELAY_P99: "nodejs.eventloop.delay.p99";
/**
 * Event loop standard deviation delay.
 *
 * @note Value can be retrieved from value `histogram.stddev` of [`perf_hooks.monitorEventLoopDelay([options])`](https://nodejs.org/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_DELAY_STDDEV: "nodejs.eventloop.delay.stddev";
/**
 * Cumulative duration of time the event loop has been in each state.
 *
 * @note Value can be retrieved from [`performance.eventLoopUtilization([utilization1[, utilization2]])`](https://nodejs.org/api/perf_hooks.html#performanceeventlooputilizationutilization1-utilization2)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_TIME: "nodejs.eventloop.time";
/**
 * Event loop utilization.
 *
 * @note The value range is [0.0, 1.0] and can be retrieved from [`performance.eventLoopUtilization([utilization1[, utilization2]])`](https://nodejs.org/api/perf_hooks.html#performanceeventlooputilizationutilization1-utilization2)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_NODEJS_EVENTLOOP_UTILIZATION: "nodejs.eventloop.utilization";
/**
 * Number of times the process has been context switched.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_CONTEXT_SWITCHES: "process.context_switches";
/**
 * Total CPU seconds broken down by different states.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_CPU_TIME: "process.cpu.time";
/**
 * Difference in process.cpu.time since the last measurement, divided by the elapsed time and number of CPUs available to the process.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_CPU_UTILIZATION: "process.cpu.utilization";
/**
 * Disk bytes transferred.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_DISK_IO: "process.disk.io";
/**
 * The amount of physical memory in use.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_MEMORY_USAGE: "process.memory.usage";
/**
 * The amount of committed virtual memory.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_MEMORY_VIRTUAL: "process.memory.virtual";
/**
 * Network bytes transferred.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_NETWORK_IO: "process.network.io";
/**
 * Number of file descriptors in use by the process.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_OPEN_FILE_DESCRIPTOR_COUNT: "process.open_file_descriptor.count";
/**
 * Number of page faults the process has made.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_PAGING_FAULTS: "process.paging.faults";
/**
 * Process threads count.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_THREAD_COUNT: "process.thread.count";
/**
 * The time the process has been running.
 *
 * @note Instrumentations **SHOULD** use a gauge with type `double` and measure uptime in seconds as a floating point number with the highest precision available.
 * The actual accuracy would depend on the instrumentation and operating system.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_PROCESS_UPTIME: "process.uptime";
/**
 * Measures the duration of outbound RPC.
 *
 * @note While streaming RPCs may record this metric as start-of-batch
 * to end-of-batch, it's hard to interpret in practice.
 *
 * **Streaming**: N/A.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_CLIENT_DURATION: "rpc.client.duration";
/**
 * Measures the size of RPC request messages (uncompressed).
 *
 * @note **Streaming**: Recorded per message in a streaming batch
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_CLIENT_REQUEST_SIZE: "rpc.client.request.size";
/**
 * Measures the number of messages received per RPC.
 *
 * @note Should be 1 for all non-streaming RPCs.
 *
 * **Streaming**: This metric is required for server and client streaming RPCs
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_CLIENT_REQUESTS_PER_RPC: "rpc.client.requests_per_rpc";
/**
 * Measures the size of RPC response messages (uncompressed).
 *
 * @note **Streaming**: Recorded per response in a streaming batch
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_CLIENT_RESPONSE_SIZE: "rpc.client.response.size";
/**
 * Measures the number of messages sent per RPC.
 *
 * @note Should be 1 for all non-streaming RPCs.
 *
 * **Streaming**: This metric is required for server and client streaming RPCs
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_CLIENT_RESPONSES_PER_RPC: "rpc.client.responses_per_rpc";
/**
 * Measures the duration of inbound RPC.
 *
 * @note While streaming RPCs may record this metric as start-of-batch
 * to end-of-batch, it's hard to interpret in practice.
 *
 * **Streaming**: N/A.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_SERVER_DURATION: "rpc.server.duration";
/**
 * Measures the size of RPC request messages (uncompressed).
 *
 * @note **Streaming**: Recorded per message in a streaming batch
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_SERVER_REQUEST_SIZE: "rpc.server.request.size";
/**
 * Measures the number of messages received per RPC.
 *
 * @note Should be 1 for all non-streaming RPCs.
 *
 * **Streaming** : This metric is required for server and client streaming RPCs
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_SERVER_REQUESTS_PER_RPC: "rpc.server.requests_per_rpc";
/**
 * Measures the size of RPC response messages (uncompressed).
 *
 * @note **Streaming**: Recorded per response in a streaming batch
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_SERVER_RESPONSE_SIZE: "rpc.server.response.size";
/**
 * Measures the number of messages sent per RPC.
 *
 * @note Should be 1 for all non-streaming RPCs.
 *
 * **Streaming**: This metric is required for server and client streaming RPCs
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_RPC_SERVER_RESPONSES_PER_RPC: "rpc.server.responses_per_rpc";
/**
 * Reports the current frequency of the CPU in Hz
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_CPU_FREQUENCY: "system.cpu.frequency";
/**
 * Reports the number of logical (virtual) processor cores created by the operating system to manage multitasking
 *
 * @note Calculated by multiplying the number of sockets by the number of cores per socket, and then by the number of threads per core
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_CPU_LOGICAL_COUNT: "system.cpu.logical.count";
/**
 * Reports the number of actual physical processor cores on the hardware
 *
 * @note Calculated by multiplying the number of sockets by the number of cores per socket
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_CPU_PHYSICAL_COUNT: "system.cpu.physical.count";
/**
 * Seconds each logical CPU spent on each mode
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_CPU_TIME: "system.cpu.time";
/**
 * Difference in system.cpu.time since the last measurement, divided by the elapsed time and number of logical CPUs
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_CPU_UTILIZATION: "system.cpu.utilization";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_DISK_IO: "system.disk.io";
/**
 * Time disk spent activated
 *
 * @note The real elapsed time ("wall clock") used in the I/O path (time from operations running in parallel are not counted). Measured as:
 *
 *   - Linux: Field 13 from [procfs-diskstats](https://www.kernel.org/doc/Documentation/ABI/testing/procfs-diskstats)
 *   - Windows: The complement of
 *     ["Disk% Idle Time"](https://learn.microsoft.com/archive/blogs/askcore/windows-performance-monitor-disk-counters-explained#windows-performance-monitor-disk-counters-explained)
 *     performance counter: `uptime * (100 - "Disk\% Idle Time") / 100`
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_DISK_IO_TIME: "system.disk.io_time";
/**
 * The total storage capacity of the disk
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_DISK_LIMIT: "system.disk.limit";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_DISK_MERGED: "system.disk.merged";
/**
 * Sum of the time each operation took to complete
 *
 * @note Because it is the sum of time each request took, parallel-issued requests each contribute to make the count grow. Measured as:
 *
 *   - Linux: Fields 7 & 11 from [procfs-diskstats](https://www.kernel.org/doc/Documentation/ABI/testing/procfs-diskstats)
 *   - Windows: "Avg. Disk sec/Read" perf counter multiplied by "Disk Reads/sec" perf counter (similar for Writes)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_DISK_OPERATION_TIME: "system.disk.operation_time";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_DISK_OPERATIONS: "system.disk.operations";
/**
 * The total storage capacity of the filesystem
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_FILESYSTEM_LIMIT: "system.filesystem.limit";
/**
 * Reports a filesystem's space usage across different states.
 *
 * @note The sum of all `system.filesystem.usage` values over the different `system.filesystem.state` attributes
 * **SHOULD** equal the total storage capacity of the filesystem, that is `system.filesystem.limit`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_FILESYSTEM_USAGE: "system.filesystem.usage";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_FILESYSTEM_UTILIZATION: "system.filesystem.utilization";
/**
 * An estimate of how much memory is available for starting new applications, without causing swapping
 *
 * @note This is an alternative to `system.memory.usage` metric with `state=free`.
 * Linux starting from 3.14 exports "available" memory. It takes "free" memory as a baseline, and then factors in kernel-specific values.
 * This is supposed to be more accurate than just "free" memory.
 * For reference, see the calculations [here](https://superuser.com/a/980821).
 * See also `MemAvailable` in [/proc/meminfo](https://man7.org/linux/man-pages/man5/proc.5.html).
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_LINUX_MEMORY_AVAILABLE: "system.linux.memory.available";
/**
 * Reports the memory used by the Linux kernel for managing caches of frequently used objects.
 *
 * @note The sum over the `reclaimable` and `unreclaimable` state values in `linux.memory.slab.usage` **SHOULD** be equal to the total slab memory available on the system.
 * Note that the total slab memory is not constant and may vary over time.
 * See also the [Slab allocator](https://blogs.oracle.com/linux/post/understanding-linux-kernel-memory-statistics) and `Slab` in [/proc/meminfo](https://man7.org/linux/man-pages/man5/proc.5.html).
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_LINUX_MEMORY_SLAB_USAGE: "system.linux.memory.slab.usage";
/**
 * Total memory available in the system.
 *
 * @note Its value **SHOULD** equal the sum of `system.memory.state` over all states.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_MEMORY_LIMIT: "system.memory.limit";
/**
 * Shared memory used (mostly by tmpfs).
 *
 * @note Equivalent of `shared` from [`free` command](https://man7.org/linux/man-pages/man1/free.1.html) or
 * `Shmem` from [`/proc/meminfo`](https://man7.org/linux/man-pages/man5/proc.5.html)"
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_MEMORY_SHARED: "system.memory.shared";
/**
 * Reports memory in use by state.
 *
 * @note The sum over all `system.memory.state` values **SHOULD** equal the total memory
 * available on the system, that is `system.memory.limit`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_MEMORY_USAGE: "system.memory.usage";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_MEMORY_UTILIZATION: "system.memory.utilization";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_NETWORK_CONNECTIONS: "system.network.connections";
/**
 * Count of packets that are dropped or discarded even though there was no error
 *
 * @note Measured as:
 *
 *   - Linux: the `drop` column in `/proc/dev/net` ([source](https://web.archive.org/web/20180321091318/http://www.onlamp.com/pub/a/linux/2000/11/16/LinuxAdmin.html))
 *   - Windows: [`InDiscards`/`OutDiscards`](https://docs.microsoft.com/windows/win32/api/netioapi/ns-netioapi-mib_if_row2)
 *     from [`GetIfEntry2`](https://docs.microsoft.com/windows/win32/api/netioapi/nf-netioapi-getifentry2)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_NETWORK_DROPPED: "system.network.dropped";
/**
 * Count of network errors detected
 *
 * @note Measured as:
 *
 *   - Linux: the `errs` column in `/proc/dev/net` ([source](https://web.archive.org/web/20180321091318/http://www.onlamp.com/pub/a/linux/2000/11/16/LinuxAdmin.html)).
 *   - Windows: [`InErrors`/`OutErrors`](https://docs.microsoft.com/windows/win32/api/netioapi/ns-netioapi-mib_if_row2)
 *     from [`GetIfEntry2`](https://docs.microsoft.com/windows/win32/api/netioapi/nf-netioapi-getifentry2).
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_NETWORK_ERRORS: "system.network.errors";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_NETWORK_IO: "system.network.io";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_NETWORK_PACKETS: "system.network.packets";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_PAGING_FAULTS: "system.paging.faults";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_PAGING_OPERATIONS: "system.paging.operations";
/**
 * Unix swap or windows pagefile usage
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_PAGING_USAGE: "system.paging.usage";
/**
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_PAGING_UTILIZATION: "system.paging.utilization";
/**
 * Total number of processes in each state
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_PROCESS_COUNT: "system.process.count";
/**
 * Total number of processes created over uptime of the host
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_PROCESS_CREATED: "system.process.created";
/**
 * The time the system has been running
 *
 * @note Instrumentations **SHOULD** use a gauge with type `double` and measure uptime in seconds as a floating point number with the highest precision available.
 * The actual accuracy would depend on the instrumentation and operating system.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_SYSTEM_UPTIME: "system.uptime";
/**
 * Garbage collection duration.
 *
 * @note The values can be retrieve from [`perf_hooks.PerformanceObserver(...).observe({ entryTypes: ['gc'] })`](https://nodejs.org/api/perf_hooks.html#performanceobserverobserveoptions)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_V8JS_GC_DURATION: "v8js.gc.duration";
/**
 * Heap space available size.
 *
 * @note Value can be retrieved from value `space_available_size` of [`v8.getHeapSpaceStatistics()`](https://nodejs.org/api/v8.html#v8getheapspacestatistics)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_V8JS_HEAP_SPACE_AVAILABLE_SIZE: "v8js.heap.space.available_size";
/**
 * Committed size of a heap space.
 *
 * @note Value can be retrieved from value `physical_space_size` of [`v8.getHeapSpaceStatistics()`](https://nodejs.org/api/v8.html#v8getheapspacestatistics)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_V8JS_HEAP_SPACE_PHYSICAL_SIZE: "v8js.heap.space.physical_size";
/**
 * Total heap memory size pre-allocated.
 *
 * @note The value can be retrieved from value `space_size` of [`v8.getHeapSpaceStatistics()`](https://nodejs.org/api/v8.html#v8getheapspacestatistics)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_V8JS_MEMORY_HEAP_LIMIT: "v8js.memory.heap.limit";
/**
 * Heap Memory size allocated.
 *
 * @note The value can be retrieved from value `space_used_size` of [`v8.getHeapSpaceStatistics()`](https://nodejs.org/api/v8.html#v8getheapspacestatistics)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_V8JS_MEMORY_HEAP_USED: "v8js.memory.heap.used";
/**
 * The number of changes (pull requests/merge requests/changelists) in a repository, categorized by their state (e.g. open or merged)
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_CHANGE_COUNT: "vcs.change.count";
/**
 * The time duration a change (pull request/merge request/changelist) has been in a given state.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_CHANGE_DURATION: "vcs.change.duration";
/**
 * The amount of time since its creation it took a change (pull request/merge request/changelist) to get the first approval.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_CHANGE_TIME_TO_APPROVAL: "vcs.change.time_to_approval";
/**
 * The amount of time since its creation it took a change (pull request/merge request/changelist) to get merged into the target(base) ref.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_CHANGE_TIME_TO_MERGE: "vcs.change.time_to_merge";
/**
 * The number of unique contributors to a repository
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_CONTRIBUTOR_COUNT: "vcs.contributor.count";
/**
 * The number of refs of type branch or tag in a repository.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_REF_COUNT: "vcs.ref.count";
/**
 * The number of lines added/removed in a ref (branch) relative to the ref from the `vcs.ref.base.name` attribute.
 *
 * @note This metric should be reported for each `vcs.line_change.type` value. For example if a ref added 3 lines and removed 2 lines,
 * instrumentation **SHOULD** report two measurements: 3 and 2 (both positive numbers).
 * If number of lines added/removed should be calculated from the start of time, then `vcs.ref.base.name` **SHOULD** be set to an empty string.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_REF_LINES_DELTA: "vcs.ref.lines_delta";
/**
 * The number of revisions (commits) a ref (branch) is ahead/behind the branch from the `vcs.ref.base.name` attribute
 *
 * @note This metric should be reported for each `vcs.revision_delta.direction` value. For example if branch `a` is 3 commits behind and 2 commits ahead of `trunk`,
 * instrumentation **SHOULD** report two measurements: 3 and 2 (both positive numbers) and `vcs.ref.base.name` is set to `trunk`.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_REF_REVISIONS_DELTA: "vcs.ref.revisions_delta";
/**
 * Time a ref (branch) created from the default branch (trunk) has existed. The `ref.type` attribute will always be `branch`
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_REF_TIME: "vcs.ref.time";
/**
 * The number of repositories in an organization.
 *
 * @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */
declare const METRIC_VCS_REPOSITORY_COUNT: "vcs.repository.count";

export { ANDROID_STATE_VALUE_BACKGROUND, ANDROID_STATE_VALUE_CREATED, ANDROID_STATE_VALUE_FOREGROUND, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED, ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE, ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS, ATTR_ANDROID_OS_API_LEVEL, ATTR_ANDROID_STATE, ATTR_ARTIFACT_ATTESTATION_FILENAME, ATTR_ARTIFACT_ATTESTATION_HASH, ATTR_ARTIFACT_ATTESTATION_ID, ATTR_ARTIFACT_FILENAME, ATTR_ARTIFACT_HASH, ATTR_ARTIFACT_PURL, ATTR_ARTIFACT_VERSION, ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT, ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE, ATTR_ASPNETCORE_RATE_LIMITING_POLICY, ATTR_ASPNETCORE_RATE_LIMITING_RESULT, ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED, ATTR_ASPNETCORE_ROUTING_IS_FALLBACK, ATTR_ASPNETCORE_ROUTING_MATCH_STATUS, ATTR_AWS_DYNAMODB_ATTRIBUTES_TO_GET, ATTR_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, ATTR_AWS_DYNAMODB_CONSISTENT_READ, ATTR_AWS_DYNAMODB_CONSUMED_CAPACITY, ATTR_AWS_DYNAMODB_COUNT, ATTR_AWS_DYNAMODB_EXCLUSIVE_START_TABLE, ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, ATTR_AWS_DYNAMODB_INDEX_NAME, ATTR_AWS_DYNAMODB_ITEM_COLLECTION_METRICS, ATTR_AWS_DYNAMODB_LIMIT, ATTR_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, ATTR_AWS_DYNAMODB_PROJECTION, ATTR_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, ATTR_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, ATTR_AWS_DYNAMODB_SCANNED_COUNT, ATTR_AWS_DYNAMODB_SCAN_FORWARD, ATTR_AWS_DYNAMODB_SEGMENT, ATTR_AWS_DYNAMODB_SELECT, ATTR_AWS_DYNAMODB_TABLE_COUNT, ATTR_AWS_DYNAMODB_TABLE_NAMES, ATTR_AWS_DYNAMODB_TOTAL_SEGMENTS, ATTR_AWS_ECS_CLUSTER_ARN, ATTR_AWS_ECS_CONTAINER_ARN, ATTR_AWS_ECS_LAUNCHTYPE, ATTR_AWS_ECS_TASK_ARN, ATTR_AWS_ECS_TASK_FAMILY, ATTR_AWS_ECS_TASK_ID, ATTR_AWS_ECS_TASK_REVISION, ATTR_AWS_EKS_CLUSTER_ARN, ATTR_AWS_EXTENDED_REQUEST_ID, ATTR_AWS_LAMBDA_INVOKED_ARN, ATTR_AWS_LOG_GROUP_ARNS, ATTR_AWS_LOG_GROUP_NAMES, ATTR_AWS_LOG_STREAM_ARNS, ATTR_AWS_LOG_STREAM_NAMES, ATTR_AWS_REQUEST_ID, ATTR_AWS_S3_BUCKET, ATTR_AWS_S3_COPY_SOURCE, ATTR_AWS_S3_DELETE, ATTR_AWS_S3_KEY, ATTR_AWS_S3_PART_NUMBER, ATTR_AWS_S3_UPLOAD_ID, ATTR_AZURE_CLIENT_ID, ATTR_AZURE_COSMOSDB_CONNECTION_MODE, ATTR_AZURE_COSMOSDB_CONSISTENCY_LEVEL, ATTR_AZURE_COSMOSDB_OPERATION_CONTACTED_REGIONS, ATTR_AZURE_COSMOSDB_OPERATION_REQUEST_CHARGE, ATTR_AZURE_COSMOSDB_REQUEST_BODY_SIZE, ATTR_AZURE_COSMOSDB_RESPONSE_SUB_STATUS_CODE, ATTR_AZ_NAMESPACE, ATTR_AZ_SERVICE_REQUEST_ID, ATTR_BROWSER_BRANDS, ATTR_BROWSER_LANGUAGE, ATTR_BROWSER_MOBILE, ATTR_BROWSER_PLATFORM, ATTR_CASSANDRA_CONSISTENCY_LEVEL, ATTR_CASSANDRA_COORDINATOR_DC, ATTR_CASSANDRA_COORDINATOR_ID, ATTR_CASSANDRA_PAGE_SIZE, ATTR_CASSANDRA_QUERY_IDEMPOTENT, ATTR_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, ATTR_CICD_PIPELINE_NAME, ATTR_CICD_PIPELINE_RESULT, ATTR_CICD_PIPELINE_RUN_ID, ATTR_CICD_PIPELINE_RUN_STATE, ATTR_CICD_PIPELINE_TASK_NAME, ATTR_CICD_PIPELINE_TASK_RUN_ID, ATTR_CICD_PIPELINE_TASK_RUN_URL_FULL, ATTR_CICD_PIPELINE_TASK_TYPE, ATTR_CICD_SYSTEM_COMPONENT, ATTR_CICD_WORKER_STATE, ATTR_CLIENT_ADDRESS, ATTR_CLIENT_PORT, ATTR_CLOUDEVENTS_EVENT_ID, ATTR_CLOUDEVENTS_EVENT_SOURCE, ATTR_CLOUDEVENTS_EVENT_SPEC_VERSION, ATTR_CLOUDEVENTS_EVENT_SUBJECT, ATTR_CLOUDEVENTS_EVENT_TYPE, ATTR_CLOUDFOUNDRY_APP_ID, ATTR_CLOUDFOUNDRY_APP_INSTANCE_ID, ATTR_CLOUDFOUNDRY_APP_NAME, ATTR_CLOUDFOUNDRY_ORG_ID, ATTR_CLOUDFOUNDRY_ORG_NAME, ATTR_CLOUDFOUNDRY_PROCESS_ID, ATTR_CLOUDFOUNDRY_PROCESS_TYPE, ATTR_CLOUDFOUNDRY_SPACE_ID, ATTR_CLOUDFOUNDRY_SPACE_NAME, ATTR_CLOUDFOUNDRY_SYSTEM_ID, ATTR_CLOUDFOUNDRY_SYSTEM_INSTANCE_ID, ATTR_CLOUD_ACCOUNT_ID, ATTR_CLOUD_AVAILABILITY_ZONE, ATTR_CLOUD_PLATFORM, ATTR_CLOUD_PROVIDER, ATTR_CLOUD_REGION, ATTR_CLOUD_RESOURCE_ID, ATTR_CODE_COLUMN, ATTR_CODE_COLUMN_NUMBER, ATTR_CODE_FILEPATH, ATTR_CODE_FILE_PATH, ATTR_CODE_FUNCTION, ATTR_CODE_FUNCTION_NAME, ATTR_CODE_LINENO, ATTR_CODE_LINE_NUMBER, ATTR_CODE_NAMESPACE, ATTR_CODE_STACKTRACE, ATTR_CONTAINER_COMMAND, ATTR_CONTAINER_COMMAND_ARGS, ATTR_CONTAINER_COMMAND_LINE, ATTR_CONTAINER_CPU_STATE, ATTR_CONTAINER_CSI_PLUGIN_NAME, ATTR_CONTAINER_CSI_VOLUME_ID, ATTR_CONTAINER_ID, ATTR_CONTAINER_IMAGE_ID, ATTR_CONTAINER_IMAGE_NAME, ATTR_CONTAINER_IMAGE_REPO_DIGESTS, ATTR_CONTAINER_IMAGE_TAGS, ATTR_CONTAINER_LABEL, ATTR_CONTAINER_LABELS, ATTR_CONTAINER_NAME, ATTR_CONTAINER_RUNTIME, ATTR_CPU_MODE, ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL, ATTR_DB_CASSANDRA_COORDINATOR_DC, ATTR_DB_CASSANDRA_COORDINATOR_ID, ATTR_DB_CASSANDRA_IDEMPOTENCE, ATTR_DB_CASSANDRA_PAGE_SIZE, ATTR_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, ATTR_DB_CASSANDRA_TABLE, ATTR_DB_CLIENT_CONNECTIONS_POOL_NAME, ATTR_DB_CLIENT_CONNECTIONS_STATE, ATTR_DB_CLIENT_CONNECTION_POOL_NAME, ATTR_DB_CLIENT_CONNECTION_STATE, ATTR_DB_COLLECTION_NAME, ATTR_DB_CONNECTION_STRING, ATTR_DB_COSMOSDB_CLIENT_ID, ATTR_DB_COSMOSDB_CONNECTION_MODE, ATTR_DB_COSMOSDB_CONSISTENCY_LEVEL, ATTR_DB_COSMOSDB_CONTAINER, ATTR_DB_COSMOSDB_OPERATION_TYPE, ATTR_DB_COSMOSDB_REGIONS_CONTACTED, ATTR_DB_COSMOSDB_REQUEST_CHARGE, ATTR_DB_COSMOSDB_REQUEST_CONTENT_LENGTH, ATTR_DB_COSMOSDB_STATUS_CODE, ATTR_DB_COSMOSDB_SUB_STATUS_CODE, ATTR_DB_ELASTICSEARCH_CLUSTER_NAME, ATTR_DB_ELASTICSEARCH_NODE_NAME, ATTR_DB_ELASTICSEARCH_PATH_PARTS, ATTR_DB_INSTANCE_ID, ATTR_DB_JDBC_DRIVER_CLASSNAME, ATTR_DB_MONGODB_COLLECTION, ATTR_DB_MSSQL_INSTANCE_NAME, ATTR_DB_NAME, ATTR_DB_NAMESPACE, ATTR_DB_OPERATION, ATTR_DB_OPERATION_BATCH_SIZE, ATTR_DB_OPERATION_NAME, ATTR_DB_OPERATION_PARAMETER, ATTR_DB_QUERY_PARAMETER, ATTR_DB_QUERY_SUMMARY, ATTR_DB_QUERY_TEXT, ATTR_DB_REDIS_DATABASE_INDEX, ATTR_DB_RESPONSE_RETURNED_ROWS, ATTR_DB_RESPONSE_STATUS_CODE, ATTR_DB_SQL_TABLE, ATTR_DB_STATEMENT, ATTR_DB_SYSTEM, ATTR_DB_SYSTEM_NAME, ATTR_DB_USER, ATTR_DEPLOYMENT_ENVIRONMENT, ATTR_DEPLOYMENT_ENVIRONMENT_NAME, ATTR_DEPLOYMENT_ID, ATTR_DEPLOYMENT_NAME, ATTR_DEPLOYMENT_STATUS, ATTR_DESTINATION_ADDRESS, ATTR_DESTINATION_PORT, ATTR_DEVICE_ID, ATTR_DEVICE_MANUFACTURER, ATTR_DEVICE_MODEL_IDENTIFIER, ATTR_DEVICE_MODEL_NAME, ATTR_DISK_IO_DIRECTION, ATTR_DNS_QUESTION_NAME, ATTR_DOTNET_GC_HEAP_GENERATION, ATTR_ELASTICSEARCH_NODE_NAME, ATTR_ENDUSER_ID, ATTR_ENDUSER_ROLE, ATTR_ENDUSER_SCOPE, ATTR_ERROR_TYPE, ATTR_EVENT_NAME, ATTR_EXCEPTION_ESCAPED, ATTR_EXCEPTION_MESSAGE, ATTR_EXCEPTION_STACKTRACE, ATTR_EXCEPTION_TYPE, ATTR_FAAS_COLDSTART, ATTR_FAAS_CRON, ATTR_FAAS_DOCUMENT_COLLECTION, ATTR_FAAS_DOCUMENT_NAME, ATTR_FAAS_DOCUMENT_OPERATION, ATTR_FAAS_DOCUMENT_TIME, ATTR_FAAS_INSTANCE, ATTR_FAAS_INVOCATION_ID, ATTR_FAAS_INVOKED_NAME, ATTR_FAAS_INVOKED_PROVIDER, ATTR_FAAS_INVOKED_REGION, ATTR_FAAS_MAX_MEMORY, ATTR_FAAS_NAME, ATTR_FAAS_TIME, ATTR_FAAS_TRIGGER, ATTR_FAAS_VERSION, ATTR_FEATURE_FLAG_CONTEXT_ID, ATTR_FEATURE_FLAG_EVALUATION_ERROR_MESSAGE, ATTR_FEATURE_FLAG_EVALUATION_REASON, ATTR_FEATURE_FLAG_KEY, ATTR_FEATURE_FLAG_PROVIDER_NAME, ATTR_FEATURE_FLAG_SET_ID, ATTR_FEATURE_FLAG_VARIANT, ATTR_FEATURE_FLAG_VERSION, ATTR_FILE_ACCESSED, ATTR_FILE_ATTRIBUTES, ATTR_FILE_CHANGED, ATTR_FILE_CREATED, ATTR_FILE_DIRECTORY, ATTR_FILE_EXTENSION, ATTR_FILE_FORK_NAME, ATTR_FILE_GROUP_ID, ATTR_FILE_GROUP_NAME, ATTR_FILE_INODE, ATTR_FILE_MODE, ATTR_FILE_MODIFIED, ATTR_FILE_NAME, ATTR_FILE_OWNER_ID, ATTR_FILE_OWNER_NAME, ATTR_FILE_PATH, ATTR_FILE_SIZE, ATTR_FILE_SYMBOLIC_LINK_TARGET_PATH, ATTR_GCP_CLIENT_SERVICE, ATTR_GCP_CLOUD_RUN_JOB_EXECUTION, ATTR_GCP_CLOUD_RUN_JOB_TASK_INDEX, ATTR_GCP_GCE_INSTANCE_HOSTNAME, ATTR_GCP_GCE_INSTANCE_NAME, ATTR_GEN_AI_COMPLETION, ATTR_GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT, ATTR_GEN_AI_OPENAI_REQUEST_SEED, ATTR_GEN_AI_OPENAI_REQUEST_SERVICE_TIER, ATTR_GEN_AI_OPENAI_RESPONSE_SERVICE_TIER, ATTR_GEN_AI_OPENAI_RESPONSE_SYSTEM_FINGERPRINT, ATTR_GEN_AI_OPERATION_NAME, ATTR_GEN_AI_PROMPT, ATTR_GEN_AI_REQUEST_ENCODING_FORMATS, ATTR_GEN_AI_REQUEST_FREQUENCY_PENALTY, ATTR_GEN_AI_REQUEST_MAX_TOKENS, ATTR_GEN_AI_REQUEST_MODEL, ATTR_GEN_AI_REQUEST_PRESENCE_PENALTY, ATTR_GEN_AI_REQUEST_SEED, ATTR_GEN_AI_REQUEST_STOP_SEQUENCES, ATTR_GEN_AI_REQUEST_TEMPERATURE, ATTR_GEN_AI_REQUEST_TOP_K, ATTR_GEN_AI_REQUEST_TOP_P, ATTR_GEN_AI_RESPONSE_FINISH_REASONS, ATTR_GEN_AI_RESPONSE_ID, ATTR_GEN_AI_RESPONSE_MODEL, ATTR_GEN_AI_SYSTEM, ATTR_GEN_AI_TOKEN_TYPE, ATTR_GEN_AI_USAGE_COMPLETION_TOKENS, ATTR_GEN_AI_USAGE_INPUT_TOKENS, ATTR_GEN_AI_USAGE_OUTPUT_TOKENS, ATTR_GEN_AI_USAGE_PROMPT_TOKENS, ATTR_GEO_CONTINENT_CODE, ATTR_GEO_COUNTRY_ISO_CODE, ATTR_GEO_LOCALITY_NAME, ATTR_GEO_LOCATION_LAT, ATTR_GEO_LOCATION_LON, ATTR_GEO_POSTAL_CODE, ATTR_GEO_REGION_ISO_CODE, ATTR_GO_MEMORY_TYPE, ATTR_GRAPHQL_DOCUMENT, ATTR_GRAPHQL_OPERATION_NAME, ATTR_GRAPHQL_OPERATION_TYPE, ATTR_HEROKU_APP_ID, ATTR_HEROKU_RELEASE_COMMIT, ATTR_HEROKU_RELEASE_CREATION_TIMESTAMP, ATTR_HOST_ARCH, ATTR_HOST_CPU_CACHE_L2_SIZE, ATTR_HOST_CPU_FAMILY, ATTR_HOST_CPU_MODEL_ID, ATTR_HOST_CPU_MODEL_NAME, ATTR_HOST_CPU_STEPPING, ATTR_HOST_CPU_VENDOR_ID, ATTR_HOST_ID, ATTR_HOST_IMAGE_ID, ATTR_HOST_IMAGE_NAME, ATTR_HOST_IMAGE_VERSION, ATTR_HOST_IP, ATTR_HOST_MAC, ATTR_HOST_NAME, ATTR_HOST_TYPE, ATTR_HTTP_CLIENT_IP, ATTR_HTTP_CONNECTION_STATE, ATTR_HTTP_FLAVOR, ATTR_HTTP_HOST, ATTR_HTTP_METHOD, ATTR_HTTP_REQUEST_BODY_SIZE, ATTR_HTTP_REQUEST_CONTENT_LENGTH, ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, ATTR_HTTP_REQUEST_HEADER, ATTR_HTTP_REQUEST_METHOD, ATTR_HTTP_REQUEST_METHOD_ORIGINAL, ATTR_HTTP_REQUEST_RESEND_COUNT, ATTR_HTTP_REQUEST_SIZE, ATTR_HTTP_RESPONSE_BODY_SIZE, ATTR_HTTP_RESPONSE_CONTENT_LENGTH, ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, ATTR_HTTP_RESPONSE_HEADER, ATTR_HTTP_RESPONSE_SIZE, ATTR_HTTP_RESPONSE_STATUS_CODE, ATTR_HTTP_ROUTE, ATTR_HTTP_SCHEME, ATTR_HTTP_SERVER_NAME, ATTR_HTTP_STATUS_CODE, ATTR_HTTP_TARGET, ATTR_HTTP_URL, ATTR_HTTP_USER_AGENT, ATTR_HW_ID, ATTR_HW_NAME, ATTR_HW_PARENT, ATTR_HW_STATE, ATTR_HW_TYPE, ATTR_IOS_STATE, ATTR_JVM_BUFFER_POOL_NAME, ATTR_JVM_GC_ACTION, ATTR_JVM_GC_NAME, ATTR_JVM_MEMORY_POOL_NAME, ATTR_JVM_MEMORY_TYPE, ATTR_JVM_THREAD_DAEMON, ATTR_JVM_THREAD_STATE, ATTR_K8S_CLUSTER_NAME, ATTR_K8S_CLUSTER_UID, ATTR_K8S_CONTAINER_NAME, ATTR_K8S_CONTAINER_RESTART_COUNT, ATTR_K8S_CONTAINER_STATUS_LAST_TERMINATED_REASON, ATTR_K8S_CRONJOB_NAME, ATTR_K8S_CRONJOB_UID, ATTR_K8S_DAEMONSET_NAME, ATTR_K8S_DAEMONSET_UID, ATTR_K8S_DEPLOYMENT_NAME, ATTR_K8S_DEPLOYMENT_UID, ATTR_K8S_JOB_NAME, ATTR_K8S_JOB_UID, ATTR_K8S_NAMESPACE_NAME, ATTR_K8S_NAMESPACE_PHASE, ATTR_K8S_NODE_NAME, ATTR_K8S_NODE_UID, ATTR_K8S_POD_ANNOTATION, ATTR_K8S_POD_LABEL, ATTR_K8S_POD_LABELS, ATTR_K8S_POD_NAME, ATTR_K8S_POD_UID, ATTR_K8S_REPLICASET_NAME, ATTR_K8S_REPLICASET_UID, ATTR_K8S_STATEFULSET_NAME, ATTR_K8S_STATEFULSET_UID, ATTR_K8S_VOLUME_NAME, ATTR_K8S_VOLUME_TYPE, ATTR_LINUX_MEMORY_SLAB_STATE, ATTR_LOG_FILE_NAME, ATTR_LOG_FILE_NAME_RESOLVED, ATTR_LOG_FILE_PATH, ATTR_LOG_FILE_PATH_RESOLVED, ATTR_LOG_IOSTREAM, ATTR_LOG_RECORD_ORIGINAL, ATTR_LOG_RECORD_UID, ATTR_MESSAGE_COMPRESSED_SIZE, ATTR_MESSAGE_ID, ATTR_MESSAGE_TYPE, ATTR_MESSAGE_UNCOMPRESSED_SIZE, ATTR_MESSAGING_BATCH_MESSAGE_COUNT, ATTR_MESSAGING_CLIENT_ID, ATTR_MESSAGING_CONSUMER_GROUP_NAME, ATTR_MESSAGING_DESTINATION_ANONYMOUS, ATTR_MESSAGING_DESTINATION_NAME, ATTR_MESSAGING_DESTINATION_PARTITION_ID, ATTR_MESSAGING_DESTINATION_PUBLISH_ANONYMOUS, ATTR_MESSAGING_DESTINATION_PUBLISH_NAME, ATTR_MESSAGING_DESTINATION_SUBSCRIPTION_NAME, ATTR_MESSAGING_DESTINATION_TEMPLATE, ATTR_MESSAGING_DESTINATION_TEMPORARY, ATTR_MESSAGING_EVENTHUBS_CONSUMER_GROUP, ATTR_MESSAGING_EVENTHUBS_MESSAGE_ENQUEUED_TIME, ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ACK_DEADLINE, ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ACK_ID, ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_DELIVERY_ATTEMPT, ATTR_MESSAGING_GCP_PUBSUB_MESSAGE_ORDERING_KEY, ATTR_MESSAGING_KAFKA_CONSUMER_GROUP, ATTR_MESSAGING_KAFKA_DESTINATION_PARTITION, ATTR_MESSAGING_KAFKA_MESSAGE_KEY, ATTR_MESSAGING_KAFKA_MESSAGE_OFFSET, ATTR_MESSAGING_KAFKA_MESSAGE_TOMBSTONE, ATTR_MESSAGING_KAFKA_OFFSET, ATTR_MESSAGING_MESSAGE_BODY_SIZE, ATTR_MESSAGING_MESSAGE_CONVERSATION_ID, ATTR_MESSAGING_MESSAGE_ENVELOPE_SIZE, ATTR_MESSAGING_MESSAGE_ID, ATTR_MESSAGING_OPERATION, ATTR_MESSAGING_OPERATION_NAME, ATTR_MESSAGING_OPERATION_TYPE, ATTR_MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY, ATTR_MESSAGING_RABBITMQ_MESSAGE_DELIVERY_TAG, ATTR_MESSAGING_ROCKETMQ_CLIENT_GROUP, ATTR_MESSAGING_ROCKETMQ_CONSUMPTION_MODEL, ATTR_MESSAGING_ROCKETMQ_MESSAGE_DELAY_TIME_LEVEL, ATTR_MESSAGING_ROCKETMQ_MESSAGE_DELIVERY_TIMESTAMP, ATTR_MESSAGING_ROCKETMQ_MESSAGE_GROUP, ATTR_MESSAGING_ROCKETMQ_MESSAGE_KEYS, ATTR_MESSAGING_ROCKETMQ_MESSAGE_TAG, ATTR_MESSAGING_ROCKETMQ_MESSAGE_TYPE, ATTR_MESSAGING_ROCKETMQ_NAMESPACE, ATTR_MESSAGING_SERVICEBUS_DESTINATION_SUBSCRIPTION_NAME, ATTR_MESSAGING_SERVICEBUS_DISPOSITION_STATUS, ATTR_MESSAGING_SERVICEBUS_MESSAGE_DELIVERY_COUNT, ATTR_MESSAGING_SERVICEBUS_MESSAGE_ENQUEUED_TIME, ATTR_MESSAGING_SYSTEM, ATTR_NETWORK_CARRIER_ICC, ATTR_NETWORK_CARRIER_MCC, ATTR_NETWORK_CARRIER_MNC, ATTR_NETWORK_CARRIER_NAME, ATTR_NETWORK_CONNECTION_STATE, ATTR_NETWORK_CONNECTION_SUBTYPE, ATTR_NETWORK_CONNECTION_TYPE, ATTR_NETWORK_INTERFACE_NAME, ATTR_NETWORK_IO_DIRECTION, ATTR_NETWORK_LOCAL_ADDRESS, ATTR_NETWORK_LOCAL_PORT, ATTR_NETWORK_PEER_ADDRESS, ATTR_NETWORK_PEER_PORT, ATTR_NETWORK_PROTOCOL_NAME, ATTR_NETWORK_PROTOCOL_VERSION, ATTR_NETWORK_TRANSPORT, ATTR_NETWORK_TYPE, ATTR_NET_HOST_IP, ATTR_NET_HOST_NAME, ATTR_NET_HOST_PORT, ATTR_NET_PEER_IP, ATTR_NET_PEER_NAME, ATTR_NET_PEER_PORT, ATTR_NET_PROTOCOL_NAME, ATTR_NET_PROTOCOL_VERSION, ATTR_NET_SOCK_FAMILY, ATTR_NET_SOCK_HOST_ADDR, ATTR_NET_SOCK_HOST_PORT, ATTR_NET_SOCK_PEER_ADDR, ATTR_NET_SOCK_PEER_NAME, ATTR_NET_SOCK_PEER_PORT, ATTR_NET_TRANSPORT, ATTR_NODEJS_EVENTLOOP_STATE, ATTR_OCI_MANIFEST_DIGEST, ATTR_OPENTRACING_REF_TYPE, ATTR_OS_BUILD_ID, ATTR_OS_DESCRIPTION, ATTR_OS_NAME, ATTR_OS_TYPE, ATTR_OS_VERSION, ATTR_OTEL_LIBRARY_NAME, ATTR_OTEL_LIBRARY_VERSION, ATTR_OTEL_SCOPE_NAME, ATTR_OTEL_SCOPE_VERSION, ATTR_OTEL_STATUS_CODE, ATTR_OTEL_STATUS_DESCRIPTION, ATTR_PEER_SERVICE, ATTR_POOL_NAME, ATTR_PROCESS_ARGS_COUNT, ATTR_PROCESS_COMMAND, ATTR_PROCESS_COMMAND_ARGS, ATTR_PROCESS_COMMAND_LINE, ATTR_PROCESS_CONTEXT_SWITCH_TYPE, ATTR_PROCESS_CPU_STATE, ATTR_PROCESS_CREATION_TIME, ATTR_PROCESS_EXECUTABLE_BUILD_ID_GNU, ATTR_PROCESS_EXECUTABLE_BUILD_ID_GO, ATTR_PROCESS_EXECUTABLE_BUILD_ID_HTLHASH, ATTR_PROCESS_EXECUTABLE_BUILD_ID_PROFILING, ATTR_PROCESS_EXECUTABLE_NAME, ATTR_PROCESS_EXECUTABLE_PATH, ATTR_PROCESS_EXIT_CODE, ATTR_PROCESS_EXIT_TIME, ATTR_PROCESS_GROUP_LEADER_PID, ATTR_PROCESS_INTERACTIVE, ATTR_PROCESS_LINUX_CGROUP, ATTR_PROCESS_OWNER, ATTR_PROCESS_PAGING_FAULT_TYPE, ATTR_PROCESS_PARENT_PID, ATTR_PROCESS_PID, ATTR_PROCESS_REAL_USER_ID, ATTR_PROCESS_REAL_USER_NAME, ATTR_PROCESS_RUNTIME_DESCRIPTION, ATTR_PROCESS_RUNTIME_NAME, ATTR_PROCESS_RUNTIME_VERSION, ATTR_PROCESS_SAVED_USER_ID, ATTR_PROCESS_SAVED_USER_NAME, ATTR_PROCESS_SESSION_LEADER_PID, ATTR_PROCESS_TITLE, ATTR_PROCESS_USER_ID, ATTR_PROCESS_USER_NAME, ATTR_PROCESS_VPID, ATTR_PROCESS_WORKING_DIRECTORY, ATTR_PROFILE_FRAME_TYPE, ATTR_RPC_CONNECT_RPC_ERROR_CODE, ATTR_RPC_CONNECT_RPC_REQUEST_METADATA, ATTR_RPC_CONNECT_RPC_RESPONSE_METADATA, ATTR_RPC_GRPC_REQUEST_METADATA, ATTR_RPC_GRPC_RESPONSE_METADATA, ATTR_RPC_GRPC_STATUS_CODE, ATTR_RPC_JSONRPC_ERROR_CODE, ATTR_RPC_JSONRPC_ERROR_MESSAGE, ATTR_RPC_JSONRPC_REQUEST_ID, ATTR_RPC_JSONRPC_VERSION, ATTR_RPC_MESSAGE_COMPRESSED_SIZE, ATTR_RPC_MESSAGE_ID, ATTR_RPC_MESSAGE_TYPE, ATTR_RPC_MESSAGE_UNCOMPRESSED_SIZE, ATTR_RPC_METHOD, ATTR_RPC_SERVICE, ATTR_RPC_SYSTEM, ATTR_SECURITY_RULE_CATEGORY, ATTR_SECURITY_RULE_DESCRIPTION, ATTR_SECURITY_RULE_LICENSE, ATTR_SECURITY_RULE_NAME, ATTR_SECURITY_RULE_REFERENCE, ATTR_SECURITY_RULE_RULESET_NAME, ATTR_SECURITY_RULE_UUID, ATTR_SECURITY_RULE_VERSION, ATTR_SERVER_ADDRESS, ATTR_SERVER_PORT, ATTR_SERVICE_INSTANCE_ID, ATTR_SERVICE_NAME, ATTR_SERVICE_NAMESPACE, ATTR_SERVICE_VERSION, ATTR_SESSION_ID, ATTR_SESSION_PREVIOUS_ID, ATTR_SIGNALR_CONNECTION_STATUS, ATTR_SIGNALR_TRANSPORT, ATTR_SOURCE_ADDRESS, ATTR_SOURCE_PORT, ATTR_STATE, ATTR_SYSTEM_CPU_LOGICAL_NUMBER, ATTR_SYSTEM_CPU_STATE, ATTR_SYSTEM_DEVICE, ATTR_SYSTEM_FILESYSTEM_MODE, ATTR_SYSTEM_FILESYSTEM_MOUNTPOINT, ATTR_SYSTEM_FILESYSTEM_STATE, ATTR_SYSTEM_FILESYSTEM_TYPE, ATTR_SYSTEM_MEMORY_STATE, ATTR_SYSTEM_NETWORK_STATE, ATTR_SYSTEM_PAGING_DIRECTION, ATTR_SYSTEM_PAGING_STATE, ATTR_SYSTEM_PAGING_TYPE, ATTR_SYSTEM_PROCESSES_STATUS, ATTR_SYSTEM_PROCESS_STATUS, ATTR_TELEMETRY_DISTRO_NAME, ATTR_TELEMETRY_DISTRO_VERSION, ATTR_TELEMETRY_SDK_LANGUAGE, ATTR_TELEMETRY_SDK_NAME, ATTR_TELEMETRY_SDK_VERSION, ATTR_TEST_CASE_NAME, ATTR_TEST_CASE_RESULT_STATUS, ATTR_TEST_SUITE_NAME, ATTR_TEST_SUITE_RUN_STATUS, ATTR_THREAD_ID, ATTR_THREAD_NAME, ATTR_TLS_CIPHER, ATTR_TLS_CLIENT_CERTIFICATE, ATTR_TLS_CLIENT_CERTIFICATE_CHAIN, ATTR_TLS_CLIENT_HASH_MD5, ATTR_TLS_CLIENT_HASH_SHA1, ATTR_TLS_CLIENT_HASH_SHA256, ATTR_TLS_CLIENT_ISSUER, ATTR_TLS_CLIENT_JA3, ATTR_TLS_CLIENT_NOT_AFTER, ATTR_TLS_CLIENT_NOT_BEFORE, ATTR_TLS_CLIENT_SERVER_NAME, ATTR_TLS_CLIENT_SUBJECT, ATTR_TLS_CLIENT_SUPPORTED_CIPHERS, ATTR_TLS_CURVE, ATTR_TLS_ESTABLISHED, ATTR_TLS_NEXT_PROTOCOL, ATTR_TLS_PROTOCOL_NAME, ATTR_TLS_PROTOCOL_VERSION, ATTR_TLS_RESUMED, ATTR_TLS_SERVER_CERTIFICATE, ATTR_TLS_SERVER_CERTIFICATE_CHAIN, ATTR_TLS_SERVER_HASH_MD5, ATTR_TLS_SERVER_HASH_SHA1, ATTR_TLS_SERVER_HASH_SHA256, ATTR_TLS_SERVER_ISSUER, ATTR_TLS_SERVER_JA3S, ATTR_TLS_SERVER_NOT_AFTER, ATTR_TLS_SERVER_NOT_BEFORE, ATTR_TLS_SERVER_SUBJECT, ATTR_URL_DOMAIN, ATTR_URL_EXTENSION, ATTR_URL_FRAGMENT, ATTR_URL_FULL, ATTR_URL_ORIGINAL, ATTR_URL_PATH, ATTR_URL_PORT, ATTR_URL_QUERY, ATTR_URL_REGISTERED_DOMAIN, ATTR_URL_SCHEME, ATTR_URL_SUBDOMAIN, ATTR_URL_TEMPLATE, ATTR_URL_TOP_LEVEL_DOMAIN, ATTR_USER_AGENT_NAME, ATTR_USER_AGENT_ORIGINAL, ATTR_USER_AGENT_SYNTHETIC_TYPE, ATTR_USER_AGENT_VERSION, ATTR_USER_EMAIL, ATTR_USER_FULL_NAME, ATTR_USER_HASH, ATTR_USER_ID, ATTR_USER_NAME, ATTR_USER_ROLES, ATTR_V8JS_GC_TYPE, ATTR_V8JS_HEAP_SPACE_NAME, ATTR_VCS_CHANGE_ID, ATTR_VCS_CHANGE_STATE, ATTR_VCS_CHANGE_TITLE, ATTR_VCS_LINE_CHANGE_TYPE, ATTR_VCS_REF_BASE_NAME, ATTR_VCS_REF_BASE_REVISION, ATTR_VCS_REF_BASE_TYPE, ATTR_VCS_REF_HEAD_NAME, ATTR_VCS_REF_HEAD_REVISION, ATTR_VCS_REF_HEAD_TYPE, ATTR_VCS_REF_TYPE, ATTR_VCS_REPOSITORY_CHANGE_ID, ATTR_VCS_REPOSITORY_CHANGE_TITLE, ATTR_VCS_REPOSITORY_NAME, ATTR_VCS_REPOSITORY_REF_NAME, ATTR_VCS_REPOSITORY_REF_REVISION, ATTR_VCS_REPOSITORY_REF_TYPE, ATTR_VCS_REPOSITORY_URL_FULL, ATTR_VCS_REVISION_DELTA_DIRECTION, ATTR_WEBENGINE_DESCRIPTION, ATTR_WEBENGINE_NAME, ATTR_WEBENGINE_VERSION, AWSECSLAUNCHTYPEVALUES_EC2, AWSECSLAUNCHTYPEVALUES_FARGATE, AWS_ECS_LAUNCHTYPE_VALUE_EC2, AWS_ECS_LAUNCHTYPE_VALUE_FARGATE, AZURE_COSMOSDB_CONNECTION_MODE_VALUE_DIRECT, AZURE_COSMOSDB_CONNECTION_MODE_VALUE_GATEWAY, AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_BOUNDED_STALENESS, AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_CONSISTENT_PREFIX, AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_EVENTUAL, AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_SESSION, AZURE_COSMOSDB_CONSISTENCY_LEVEL_VALUE_STRONG, AwsEcsLaunchtypeValues, CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL, CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY, CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM, CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE, CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM, CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL, CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE, CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM, CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL, CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE, CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO, CICD_PIPELINE_RESULT_VALUE_CANCELLATION, CICD_PIPELINE_RESULT_VALUE_ERROR, CICD_PIPELINE_RESULT_VALUE_FAILURE, CICD_PIPELINE_RESULT_VALUE_SKIP, CICD_PIPELINE_RESULT_VALUE_SUCCESS, CICD_PIPELINE_RESULT_VALUE_TIMEOUT, CICD_PIPELINE_RUN_STATE_VALUE_EXECUTING, CICD_PIPELINE_RUN_STATE_VALUE_FINALIZING, CICD_PIPELINE_RUN_STATE_VALUE_PENDING, CICD_PIPELINE_TASK_TYPE_VALUE_BUILD, CICD_PIPELINE_TASK_TYPE_VALUE_DEPLOY, CICD_PIPELINE_TASK_TYPE_VALUE_TEST, CICD_WORKER_STATE_VALUE_AVAILABLE, CICD_WORKER_STATE_VALUE_BUSY, CICD_WORKER_STATE_VALUE_OFFLINE, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC, CLOUDPLATFORMVALUES_AWS_EC2, CLOUDPLATFORMVALUES_AWS_ECS, CLOUDPLATFORMVALUES_AWS_EKS, CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK, CLOUDPLATFORMVALUES_AWS_LAMBDA, CLOUDPLATFORMVALUES_AZURE_AKS, CLOUDPLATFORMVALUES_AZURE_APP_SERVICE, CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES, CLOUDPLATFORMVALUES_AZURE_FUNCTIONS, CLOUDPLATFORMVALUES_AZURE_VM, CLOUDPLATFORMVALUES_GCP_APP_ENGINE, CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS, CLOUDPLATFORMVALUES_GCP_CLOUD_RUN, CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE, CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE, CLOUDPROVIDERVALUES_ALIBABA_CLOUD, CLOUDPROVIDERVALUES_AWS, CLOUDPROVIDERVALUES_AZURE, CLOUDPROVIDERVALUES_GCP, CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_ECS, CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_FC, CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_OPENSHIFT, CLOUD_PLATFORM_VALUE_AWS_APP_RUNNER, CLOUD_PLATFORM_VALUE_AWS_EC2, CLOUD_PLATFORM_VALUE_AWS_ECS, CLOUD_PLATFORM_VALUE_AWS_EKS, CLOUD_PLATFORM_VALUE_AWS_ELASTIC_BEANSTALK, CLOUD_PLATFORM_VALUE_AWS_LAMBDA, CLOUD_PLATFORM_VALUE_AWS_OPENSHIFT, CLOUD_PLATFORM_VALUE_AZURE_AKS, CLOUD_PLATFORM_VALUE_AZURE_APP_SERVICE, CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_APPS, CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_INSTANCES, CLOUD_PLATFORM_VALUE_AZURE_FUNCTIONS, CLOUD_PLATFORM_VALUE_AZURE_OPENSHIFT, CLOUD_PLATFORM_VALUE_AZURE_VM, CLOUD_PLATFORM_VALUE_GCP_APP_ENGINE, CLOUD_PLATFORM_VALUE_GCP_BARE_METAL_SOLUTION, CLOUD_PLATFORM_VALUE_GCP_CLOUD_FUNCTIONS, CLOUD_PLATFORM_VALUE_GCP_CLOUD_RUN, CLOUD_PLATFORM_VALUE_GCP_COMPUTE_ENGINE, CLOUD_PLATFORM_VALUE_GCP_KUBERNETES_ENGINE, CLOUD_PLATFORM_VALUE_GCP_OPENSHIFT, CLOUD_PLATFORM_VALUE_IBM_CLOUD_OPENSHIFT, CLOUD_PLATFORM_VALUE_ORACLE_CLOUD_COMPUTE, CLOUD_PLATFORM_VALUE_ORACLE_CLOUD_OKE, CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_CVM, CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_EKS, CLOUD_PLATFORM_VALUE_TENCENT_CLOUD_SCF, CLOUD_PROVIDER_VALUE_ALIBABA_CLOUD, CLOUD_PROVIDER_VALUE_AWS, CLOUD_PROVIDER_VALUE_AZURE, CLOUD_PROVIDER_VALUE_GCP, CLOUD_PROVIDER_VALUE_HEROKU, CLOUD_PROVIDER_VALUE_IBM_CLOUD, CLOUD_PROVIDER_VALUE_ORACLE_CLOUD, CLOUD_PROVIDER_VALUE_TENCENT_CLOUD, CONTAINER_CPU_STATE_VALUE_KERNEL, CONTAINER_CPU_STATE_VALUE_SYSTEM, CONTAINER_CPU_STATE_VALUE_USER, CPU_MODE_VALUE_IDLE, CPU_MODE_VALUE_INTERRUPT, CPU_MODE_VALUE_IOWAIT, CPU_MODE_VALUE_KERNEL, CPU_MODE_VALUE_NICE, CPU_MODE_VALUE_STEAL, CPU_MODE_VALUE_SYSTEM, CPU_MODE_VALUE_USER, CloudPlatformValues, CloudProviderValues, DBCASSANDRACONSISTENCYLEVELVALUES_ALL, DBCASSANDRACONSISTENCYLEVELVALUES_ANY, DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_THREE, DBCASSANDRACONSISTENCYLEVELVALUES_TWO, DBSYSTEMVALUES_ADABAS, DBSYSTEMVALUES_CACHE, DBSYSTEMVALUES_CASSANDRA, DBSYSTEMVALUES_CLOUDSCAPE, DBSYSTEMVALUES_COCKROACHDB, DBSYSTEMVALUES_COLDFUSION, DBSYSTEMVALUES_COSMOSDB, DBSYSTEMVALUES_COUCHBASE, DBSYSTEMVALUES_COUCHDB, DBSYSTEMVALUES_DB2, DBSYSTEMVALUES_DERBY, DBSYSTEMVALUES_DYNAMODB, DBSYSTEMVALUES_EDB, DBSYSTEMVALUES_ELASTICSEARCH, DBSYSTEMVALUES_FILEMAKER, DBSYSTEMVALUES_FIREBIRD, DBSYSTEMVALUES_FIRSTSQL, DBSYSTEMVALUES_GEODE, DBSYSTEMVALUES_H2, DBSYSTEMVALUES_HANADB, DBSYSTEMVALUES_HBASE, DBSYSTEMVALUES_HIVE, DBSYSTEMVALUES_HSQLDB, DBSYSTEMVALUES_INFORMIX, DBSYSTEMVALUES_INGRES, DBSYSTEMVALUES_INSTANTDB, DBSYSTEMVALUES_INTERBASE, DBSYSTEMVALUES_MARIADB, DBSYSTEMVALUES_MAXDB, DBSYSTEMVALUES_MEMCACHED, DBSYSTEMVALUES_MONGODB, DBSYSTEMVALUES_MSSQL, DBSYSTEMVALUES_MYSQL, DBSYSTEMVALUES_NEO4J, DBSYSTEMVALUES_NETEZZA, DBSYSTEMVALUES_ORACLE, DBSYSTEMVALUES_OTHER_SQL, DBSYSTEMVALUES_PERVASIVE, DBSYSTEMVALUES_POINTBASE, DBSYSTEMVALUES_POSTGRESQL, DBSYSTEMVALUES_PROGRESS, DBSYSTEMVALUES_REDIS, DBSYSTEMVALUES_REDSHIFT, DBSYSTEMVALUES_SQLITE, DBSYSTEMVALUES_SYBASE, DBSYSTEMVALUES_TERADATA, DBSYSTEMVALUES_VERTICA, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE, DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO, DB_CLIENT_CONNECTIONS_STATE_VALUE_IDLE, DB_CLIENT_CONNECTIONS_STATE_VALUE_USED, DB_CLIENT_CONNECTION_STATE_VALUE_IDLE, DB_CLIENT_CONNECTION_STATE_VALUE_USED, DB_COSMOSDB_CONNECTION_MODE_VALUE_DIRECT, DB_COSMOSDB_CONNECTION_MODE_VALUE_GATEWAY, DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_BOUNDED_STALENESS, DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_CONSISTENT_PREFIX, DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_EVENTUAL, DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_SESSION, DB_COSMOSDB_CONSISTENCY_LEVEL_VALUE_STRONG, DB_COSMOSDB_OPERATION_TYPE_VALUE_BATCH, DB_COSMOSDB_OPERATION_TYPE_VALUE_CREATE, DB_COSMOSDB_OPERATION_TYPE_VALUE_DELETE, DB_COSMOSDB_OPERATION_TYPE_VALUE_EXECUTE, DB_COSMOSDB_OPERATION_TYPE_VALUE_EXECUTE_JAVASCRIPT, DB_COSMOSDB_OPERATION_TYPE_VALUE_HEAD, DB_COSMOSDB_OPERATION_TYPE_VALUE_HEAD_FEED, DB_COSMOSDB_OPERATION_TYPE_VALUE_INVALID, DB_COSMOSDB_OPERATION_TYPE_VALUE_PATCH, DB_COSMOSDB_OPERATION_TYPE_VALUE_QUERY, DB_COSMOSDB_OPERATION_TYPE_VALUE_QUERY_PLAN, DB_COSMOSDB_OPERATION_TYPE_VALUE_READ, DB_COSMOSDB_OPERATION_TYPE_VALUE_READ_FEED, DB_COSMOSDB_OPERATION_TYPE_VALUE_REPLACE, DB_COSMOSDB_OPERATION_TYPE_VALUE_UPSERT, DB_SYSTEM_NAME_VALUE_ACTIAN_INGRES, DB_SYSTEM_NAME_VALUE_AWS_DYNAMODB, DB_SYSTEM_NAME_VALUE_AWS_REDSHIFT, DB_SYSTEM_NAME_VALUE_AZURE_COSMOSDB, DB_SYSTEM_NAME_VALUE_CASSANDRA, DB_SYSTEM_NAME_VALUE_CLICKHOUSE, DB_SYSTEM_NAME_VALUE_COCKROACHDB, DB_SYSTEM_NAME_VALUE_COUCHBASE, DB_SYSTEM_NAME_VALUE_COUCHDB, DB_SYSTEM_NAME_VALUE_DERBY, DB_SYSTEM_NAME_VALUE_ELASTICSEARCH, DB_SYSTEM_NAME_VALUE_FIREBIRDSQL, DB_SYSTEM_NAME_VALUE_GCP_SPANNER, DB_SYSTEM_NAME_VALUE_GEODE, DB_SYSTEM_NAME_VALUE_H2DATABASE, DB_SYSTEM_NAME_VALUE_HBASE, DB_SYSTEM_NAME_VALUE_HIVE, DB_SYSTEM_NAME_VALUE_HSQLDB, DB_SYSTEM_NAME_VALUE_IBM_DB2, DB_SYSTEM_NAME_VALUE_IBM_INFORMIX, DB_SYSTEM_NAME_VALUE_IBM_NETEZZA, DB_SYSTEM_NAME_VALUE_INFLUXDB, DB_SYSTEM_NAME_VALUE_INSTANTDB, DB_SYSTEM_NAME_VALUE_INTERSYSTEMS_CACHE, DB_SYSTEM_NAME_VALUE_MARIADB, DB_SYSTEM_NAME_VALUE_MEMCACHED, DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER, DB_SYSTEM_NAME_VALUE_MONGODB, DB_SYSTEM_NAME_VALUE_MYSQL, DB_SYSTEM_NAME_VALUE_NEO4J, DB_SYSTEM_NAME_VALUE_OPENSEARCH, DB_SYSTEM_NAME_VALUE_ORACLE_DB, DB_SYSTEM_NAME_VALUE_OTHER_SQL, DB_SYSTEM_NAME_VALUE_POSTGRESQL, DB_SYSTEM_NAME_VALUE_REDIS, DB_SYSTEM_NAME_VALUE_SAP_HANA, DB_SYSTEM_NAME_VALUE_SAP_MAXDB, DB_SYSTEM_NAME_VALUE_SOFTWAREAG_ADABAS, DB_SYSTEM_NAME_VALUE_SQLITE, DB_SYSTEM_NAME_VALUE_TERADATA, DB_SYSTEM_NAME_VALUE_TRINO, DB_SYSTEM_VALUE_ADABAS, DB_SYSTEM_VALUE_CACHE, DB_SYSTEM_VALUE_CASSANDRA, DB_SYSTEM_VALUE_CLICKHOUSE, DB_SYSTEM_VALUE_CLOUDSCAPE, DB_SYSTEM_VALUE_COCKROACHDB, DB_SYSTEM_VALUE_COLDFUSION, DB_SYSTEM_VALUE_COSMOSDB, DB_SYSTEM_VALUE_COUCHBASE, DB_SYSTEM_VALUE_COUCHDB, DB_SYSTEM_VALUE_DB2, DB_SYSTEM_VALUE_DERBY, DB_SYSTEM_VALUE_DYNAMODB, DB_SYSTEM_VALUE_EDB, DB_SYSTEM_VALUE_ELASTICSEARCH, DB_SYSTEM_VALUE_FILEMAKER, DB_SYSTEM_VALUE_FIREBIRD, DB_SYSTEM_VALUE_FIRSTSQL, DB_SYSTEM_VALUE_GEODE, DB_SYSTEM_VALUE_H2, DB_SYSTEM_VALUE_HANADB, DB_SYSTEM_VALUE_HBASE, DB_SYSTEM_VALUE_HIVE, DB_SYSTEM_VALUE_HSQLDB, DB_SYSTEM_VALUE_INFLUXDB, DB_SYSTEM_VALUE_INFORMIX, DB_SYSTEM_VALUE_INGRES, DB_SYSTEM_VALUE_INSTANTDB, DB_SYSTEM_VALUE_INTERBASE, DB_SYSTEM_VALUE_INTERSYSTEMS_CACHE, DB_SYSTEM_VALUE_MARIADB, DB_SYSTEM_VALUE_MAXDB, DB_SYSTEM_VALUE_MEMCACHED, DB_SYSTEM_VALUE_MONGODB, DB_SYSTEM_VALUE_MSSQL, DB_SYSTEM_VALUE_MSSQLCOMPACT, DB_SYSTEM_VALUE_MYSQL, DB_SYSTEM_VALUE_NEO4J, DB_SYSTEM_VALUE_NETEZZA, DB_SYSTEM_VALUE_OPENSEARCH, DB_SYSTEM_VALUE_ORACLE, DB_SYSTEM_VALUE_OTHER_SQL, DB_SYSTEM_VALUE_PERVASIVE, DB_SYSTEM_VALUE_POINTBASE, DB_SYSTEM_VALUE_POSTGRESQL, DB_SYSTEM_VALUE_PROGRESS, DB_SYSTEM_VALUE_REDIS, DB_SYSTEM_VALUE_REDSHIFT, DB_SYSTEM_VALUE_SPANNER, DB_SYSTEM_VALUE_SQLITE, DB_SYSTEM_VALUE_SYBASE, DB_SYSTEM_VALUE_TERADATA, DB_SYSTEM_VALUE_TRINO, DB_SYSTEM_VALUE_VERTICA, DEPLOYMENT_STATUS_VALUE_FAILED, DEPLOYMENT_STATUS_VALUE_SUCCEEDED, DISK_IO_DIRECTION_VALUE_READ, DISK_IO_DIRECTION_VALUE_WRITE, DOTNET_GC_HEAP_GENERATION_VALUE_GEN0, DOTNET_GC_HEAP_GENERATION_VALUE_GEN1, DOTNET_GC_HEAP_GENERATION_VALUE_GEN2, DOTNET_GC_HEAP_GENERATION_VALUE_LOH, DOTNET_GC_HEAP_GENERATION_VALUE_POH, DbCassandraConsistencyLevelValues, DbSystemValues, ERROR_TYPE_VALUE_OTHER, FAASDOCUMENTOPERATIONVALUES_DELETE, FAASDOCUMENTOPERATIONVALUES_EDIT, FAASDOCUMENTOPERATIONVALUES_INSERT, FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD, FAASINVOKEDPROVIDERVALUES_AWS, FAASINVOKEDPROVIDERVALUES_AZURE, FAASINVOKEDPROVIDERVALUES_GCP, FAASTRIGGERVALUES_DATASOURCE, FAASTRIGGERVALUES_HTTP, FAASTRIGGERVALUES_OTHER, FAASTRIGGERVALUES_PUBSUB, FAASTRIGGERVALUES_TIMER, FAAS_DOCUMENT_OPERATION_VALUE_DELETE, FAAS_DOCUMENT_OPERATION_VALUE_EDIT, FAAS_DOCUMENT_OPERATION_VALUE_INSERT, FAAS_INVOKED_PROVIDER_VALUE_ALIBABA_CLOUD, FAAS_INVOKED_PROVIDER_VALUE_AWS, FAAS_INVOKED_PROVIDER_VALUE_AZURE, FAAS_INVOKED_PROVIDER_VALUE_GCP, FAAS_INVOKED_PROVIDER_VALUE_TENCENT_CLOUD, FAAS_TRIGGER_VALUE_DATASOURCE, FAAS_TRIGGER_VALUE_HTTP, FAAS_TRIGGER_VALUE_OTHER, FAAS_TRIGGER_VALUE_PUBSUB, FAAS_TRIGGER_VALUE_TIMER, FEATURE_FLAG_EVALUATION_REASON_VALUE_CACHED, FEATURE_FLAG_EVALUATION_REASON_VALUE_DEFAULT, FEATURE_FLAG_EVALUATION_REASON_VALUE_DISABLED, FEATURE_FLAG_EVALUATION_REASON_VALUE_ERROR, FEATURE_FLAG_EVALUATION_REASON_VALUE_SPLIT, FEATURE_FLAG_EVALUATION_REASON_VALUE_STALE, FEATURE_FLAG_EVALUATION_REASON_VALUE_STATIC, FEATURE_FLAG_EVALUATION_REASON_VALUE_TARGETING_MATCH, FEATURE_FLAG_EVALUATION_REASON_VALUE_UNKNOWN, FaasDocumentOperationValues, FaasInvokedProviderValues, FaasTriggerValues, GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_JSON_OBJECT, GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_JSON_SCHEMA, GEN_AI_OPENAI_REQUEST_RESPONSE_FORMAT_VALUE_TEXT, GEN_AI_OPENAI_REQUEST_SERVICE_TIER_VALUE_AUTO, GEN_AI_OPENAI_REQUEST_SERVICE_TIER_VALUE_DEFAULT, GEN_AI_OPERATION_NAME_VALUE_CHAT, GEN_AI_OPERATION_NAME_VALUE_EMBEDDINGS, GEN_AI_OPERATION_NAME_VALUE_TEXT_COMPLETION, GEN_AI_SYSTEM_VALUE_ANTHROPIC, GEN_AI_SYSTEM_VALUE_AWS_BEDROCK, GEN_AI_SYSTEM_VALUE_AZ_AI_INFERENCE, GEN_AI_SYSTEM_VALUE_AZ_AI_OPENAI, GEN_AI_SYSTEM_VALUE_COHERE, GEN_AI_SYSTEM_VALUE_DEEPSEEK, GEN_AI_SYSTEM_VALUE_GEMINI, GEN_AI_SYSTEM_VALUE_GROQ, GEN_AI_SYSTEM_VALUE_IBM_WATSONX_AI, GEN_AI_SYSTEM_VALUE_MISTRAL_AI, GEN_AI_SYSTEM_VALUE_OPENAI, GEN_AI_SYSTEM_VALUE_PERPLEXITY, GEN_AI_SYSTEM_VALUE_VERTEX_AI, GEN_AI_SYSTEM_VALUE_XAI, GEN_AI_TOKEN_TYPE_VALUE_COMPLETION, GEN_AI_TOKEN_TYPE_VALUE_INPUT, GEO_CONTINENT_CODE_VALUE_AF, GEO_CONTINENT_CODE_VALUE_AN, GEO_CONTINENT_CODE_VALUE_AS, GEO_CONTINENT_CODE_VALUE_EU, GEO_CONTINENT_CODE_VALUE_NA, GEO_CONTINENT_CODE_VALUE_OC, GEO_CONTINENT_CODE_VALUE_SA, GO_MEMORY_TYPE_VALUE_OTHER, GO_MEMORY_TYPE_VALUE_STACK, GRAPHQL_OPERATION_TYPE_VALUE_MUTATION, GRAPHQL_OPERATION_TYPE_VALUE_QUERY, GRAPHQL_OPERATION_TYPE_VALUE_SUBSCRIPTION, HOSTARCHVALUES_AMD64, HOSTARCHVALUES_ARM32, HOSTARCHVALUES_ARM64, HOSTARCHVALUES_IA64, HOSTARCHVALUES_PPC32, HOSTARCHVALUES_PPC64, HOSTARCHVALUES_X86, HOST_ARCH_VALUE_AMD64, HOST_ARCH_VALUE_ARM32, HOST_ARCH_VALUE_ARM64, HOST_ARCH_VALUE_IA64, HOST_ARCH_VALUE_PPC32, HOST_ARCH_VALUE_PPC64, HOST_ARCH_VALUE_S390X, HOST_ARCH_VALUE_X86, HTTPFLAVORVALUES_HTTP_1_0, HTTPFLAVORVALUES_HTTP_1_1, HTTPFLAVORVALUES_HTTP_2_0, HTTPFLAVORVALUES_QUIC, HTTPFLAVORVALUES_SPDY, HTTP_CONNECTION_STATE_VALUE_ACTIVE, HTTP_CONNECTION_STATE_VALUE_IDLE, HTTP_FLAVOR_VALUE_HTTP_1_0, HTTP_FLAVOR_VALUE_HTTP_1_1, HTTP_FLAVOR_VALUE_HTTP_2_0, HTTP_FLAVOR_VALUE_HTTP_3_0, HTTP_FLAVOR_VALUE_QUIC, HTTP_FLAVOR_VALUE_SPDY, HTTP_REQUEST_METHOD_VALUE_CONNECT, HTTP_REQUEST_METHOD_VALUE_DELETE, HTTP_REQUEST_METHOD_VALUE_GET, HTTP_REQUEST_METHOD_VALUE_HEAD, HTTP_REQUEST_METHOD_VALUE_OPTIONS, HTTP_REQUEST_METHOD_VALUE_OTHER, HTTP_REQUEST_METHOD_VALUE_PATCH, HTTP_REQUEST_METHOD_VALUE_POST, HTTP_REQUEST_METHOD_VALUE_PUT, HTTP_REQUEST_METHOD_VALUE_TRACE, HW_STATE_VALUE_DEGRADED, HW_STATE_VALUE_FAILED, HW_STATE_VALUE_OK, HW_TYPE_VALUE_BATTERY, HW_TYPE_VALUE_CPU, HW_TYPE_VALUE_DISK_CONTROLLER, HW_TYPE_VALUE_ENCLOSURE, HW_TYPE_VALUE_FAN, HW_TYPE_VALUE_GPU, HW_TYPE_VALUE_LOGICAL_DISK, HW_TYPE_VALUE_MEMORY, HW_TYPE_VALUE_NETWORK, HW_TYPE_VALUE_PHYSICAL_DISK, HW_TYPE_VALUE_POWER_SUPPLY, HW_TYPE_VALUE_TAPE_DRIVE, HW_TYPE_VALUE_TEMPERATURE, HW_TYPE_VALUE_VOLTAGE, HostArchValues, HttpFlavorValues, IOS_STATE_VALUE_ACTIVE, IOS_STATE_VALUE_BACKGROUND, IOS_STATE_VALUE_FOREGROUND, IOS_STATE_VALUE_INACTIVE, IOS_STATE_VALUE_TERMINATE, JVM_MEMORY_TYPE_VALUE_HEAP, JVM_MEMORY_TYPE_VALUE_NON_HEAP, JVM_THREAD_STATE_VALUE_BLOCKED, JVM_THREAD_STATE_VALUE_NEW, JVM_THREAD_STATE_VALUE_RUNNABLE, JVM_THREAD_STATE_VALUE_TERMINATED, JVM_THREAD_STATE_VALUE_TIMED_WAITING, JVM_THREAD_STATE_VALUE_WAITING, K8S_NAMESPACE_PHASE_VALUE_ACTIVE, K8S_NAMESPACE_PHASE_VALUE_TERMINATING, K8S_VOLUME_TYPE_VALUE_CONFIG_MAP, K8S_VOLUME_TYPE_VALUE_DOWNWARD_API, K8S_VOLUME_TYPE_VALUE_EMPTY_DIR, K8S_VOLUME_TYPE_VALUE_LOCAL, K8S_VOLUME_TYPE_VALUE_PERSISTENT_VOLUME_CLAIM, K8S_VOLUME_TYPE_VALUE_SECRET, LINUX_MEMORY_SLAB_STATE_VALUE_RECLAIMABLE, LINUX_MEMORY_SLAB_STATE_VALUE_UNRECLAIMABLE, LOG_IOSTREAM_VALUE_STDERR, LOG_IOSTREAM_VALUE_STDOUT, MESSAGETYPEVALUES_RECEIVED, MESSAGETYPEVALUES_SENT, MESSAGE_TYPE_VALUE_RECEIVED, MESSAGE_TYPE_VALUE_SENT, MESSAGINGDESTINATIONKINDVALUES_QUEUE, MESSAGINGDESTINATIONKINDVALUES_TOPIC, MESSAGINGOPERATIONVALUES_PROCESS, MESSAGINGOPERATIONVALUES_RECEIVE, MESSAGING_OPERATION_TYPE_VALUE_CREATE, MESSAGING_OPERATION_TYPE_VALUE_DELIVER, MESSAGING_OPERATION_TYPE_VALUE_PROCESS, MESSAGING_OPERATION_TYPE_VALUE_PUBLISH, MESSAGING_OPERATION_TYPE_VALUE_RECEIVE, MESSAGING_OPERATION_TYPE_VALUE_SEND, MESSAGING_OPERATION_TYPE_VALUE_SETTLE, MESSAGING_ROCKETMQ_CONSUMPTION_MODEL_VALUE_BROADCASTING, MESSAGING_ROCKETMQ_CONSUMPTION_MODEL_VALUE_CLUSTERING, MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_DELAY, MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_FIFO, MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_NORMAL, MESSAGING_ROCKETMQ_MESSAGE_TYPE_VALUE_TRANSACTION, MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_ABANDON, MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_COMPLETE, MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_DEAD_LETTER, MESSAGING_SERVICEBUS_DISPOSITION_STATUS_VALUE_DEFER, MESSAGING_SYSTEM_VALUE_ACTIVEMQ, MESSAGING_SYSTEM_VALUE_AWS_SQS, MESSAGING_SYSTEM_VALUE_EVENTGRID, MESSAGING_SYSTEM_VALUE_EVENTHUBS, MESSAGING_SYSTEM_VALUE_GCP_PUBSUB, MESSAGING_SYSTEM_VALUE_JMS, MESSAGING_SYSTEM_VALUE_KAFKA, MESSAGING_SYSTEM_VALUE_PULSAR, MESSAGING_SYSTEM_VALUE_RABBITMQ, MESSAGING_SYSTEM_VALUE_ROCKETMQ, MESSAGING_SYSTEM_VALUE_SERVICEBUS, METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS, METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES, METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS, METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS, METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION, METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE, METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS, METRIC_AZURE_COSMOSDB_CLIENT_ACTIVE_INSTANCE_COUNT, METRIC_AZURE_COSMOSDB_CLIENT_OPERATION_REQUEST_CHARGE, METRIC_CICD_PIPELINE_RUN_ACTIVE, METRIC_CICD_PIPELINE_RUN_DURATION, METRIC_CICD_PIPELINE_RUN_ERRORS, METRIC_CICD_SYSTEM_ERRORS, METRIC_CICD_WORKER_COUNT, METRIC_CONTAINER_CPU_TIME, METRIC_CONTAINER_CPU_USAGE, METRIC_CONTAINER_DISK_IO, METRIC_CONTAINER_MEMORY_USAGE, METRIC_CONTAINER_NETWORK_IO, METRIC_CONTAINER_UPTIME, METRIC_DB_CLIENT_CONNECTIONS_CREATE_TIME, METRIC_DB_CLIENT_CONNECTIONS_IDLE_MAX, METRIC_DB_CLIENT_CONNECTIONS_IDLE_MIN, METRIC_DB_CLIENT_CONNECTIONS_MAX, METRIC_DB_CLIENT_CONNECTIONS_PENDING_REQUESTS, METRIC_DB_CLIENT_CONNECTIONS_TIMEOUTS, METRIC_DB_CLIENT_CONNECTIONS_USAGE, METRIC_DB_CLIENT_CONNECTIONS_USE_TIME, METRIC_DB_CLIENT_CONNECTIONS_WAIT_TIME, METRIC_DB_CLIENT_CONNECTION_COUNT, METRIC_DB_CLIENT_CONNECTION_CREATE_TIME, METRIC_DB_CLIENT_CONNECTION_IDLE_MAX, METRIC_DB_CLIENT_CONNECTION_IDLE_MIN, METRIC_DB_CLIENT_CONNECTION_MAX, METRIC_DB_CLIENT_CONNECTION_PENDING_REQUESTS, METRIC_DB_CLIENT_CONNECTION_TIMEOUTS, METRIC_DB_CLIENT_CONNECTION_USE_TIME, METRIC_DB_CLIENT_CONNECTION_WAIT_TIME, METRIC_DB_CLIENT_COSMOSDB_ACTIVE_INSTANCE_COUNT, METRIC_DB_CLIENT_COSMOSDB_OPERATION_REQUEST_CHARGE, METRIC_DB_CLIENT_OPERATION_DURATION, METRIC_DB_CLIENT_RESPONSE_RETURNED_ROWS, METRIC_DNS_LOOKUP_DURATION, METRIC_DOTNET_ASSEMBLY_COUNT, METRIC_DOTNET_EXCEPTIONS, METRIC_DOTNET_GC_COLLECTIONS, METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED, METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE, METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE, METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE, METRIC_DOTNET_GC_PAUSE_TIME, METRIC_DOTNET_JIT_COMPILATION_TIME, METRIC_DOTNET_JIT_COMPILED_IL_SIZE, METRIC_DOTNET_JIT_COMPILED_METHODS, METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS, METRIC_DOTNET_PROCESS_CPU_COUNT, METRIC_DOTNET_PROCESS_CPU_TIME, METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET, METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH, METRIC_DOTNET_THREAD_POOL_THREAD_COUNT, METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT, METRIC_DOTNET_TIMER_COUNT, METRIC_FAAS_COLDSTARTS, METRIC_FAAS_CPU_USAGE, METRIC_FAAS_ERRORS, METRIC_FAAS_INIT_DURATION, METRIC_FAAS_INVOCATIONS, METRIC_FAAS_INVOKE_DURATION, METRIC_FAAS_MEM_USAGE, METRIC_FAAS_NET_IO, METRIC_FAAS_TIMEOUTS, METRIC_GEN_AI_CLIENT_OPERATION_DURATION, METRIC_GEN_AI_CLIENT_TOKEN_USAGE, METRIC_GEN_AI_SERVER_REQUEST_DURATION, METRIC_GEN_AI_SERVER_TIME_PER_OUTPUT_TOKEN, METRIC_GEN_AI_SERVER_TIME_TO_FIRST_TOKEN, METRIC_GO_CONFIG_GOGC, METRIC_GO_GOROUTINE_COUNT, METRIC_GO_MEMORY_ALLOCATED, METRIC_GO_MEMORY_ALLOCATIONS, METRIC_GO_MEMORY_GC_GOAL, METRIC_GO_MEMORY_LIMIT, METRIC_GO_MEMORY_USED, METRIC_GO_PROCESSOR_LIMIT, METRIC_GO_SCHEDULE_DURATION, METRIC_HTTP_CLIENT_ACTIVE_REQUESTS, METRIC_HTTP_CLIENT_CONNECTION_DURATION, METRIC_HTTP_CLIENT_OPEN_CONNECTIONS, METRIC_HTTP_CLIENT_REQUEST_BODY_SIZE, METRIC_HTTP_CLIENT_REQUEST_DURATION, METRIC_HTTP_CLIENT_RESPONSE_BODY_SIZE, METRIC_HTTP_SERVER_ACTIVE_REQUESTS, METRIC_HTTP_SERVER_REQUEST_BODY_SIZE, METRIC_HTTP_SERVER_REQUEST_DURATION, METRIC_HTTP_SERVER_RESPONSE_BODY_SIZE, METRIC_HW_ENERGY, METRIC_HW_ERRORS, METRIC_HW_POWER, METRIC_HW_STATUS, METRIC_JVM_BUFFER_COUNT, METRIC_JVM_BUFFER_MEMORY_LIMIT, METRIC_JVM_BUFFER_MEMORY_USAGE, METRIC_JVM_BUFFER_MEMORY_USED, METRIC_JVM_CLASS_COUNT, METRIC_JVM_CLASS_LOADED, METRIC_JVM_CLASS_UNLOADED, METRIC_JVM_CPU_COUNT, METRIC_JVM_CPU_RECENT_UTILIZATION, METRIC_JVM_CPU_TIME, METRIC_JVM_GC_DURATION, METRIC_JVM_MEMORY_COMMITTED, METRIC_JVM_MEMORY_INIT, METRIC_JVM_MEMORY_LIMIT, METRIC_JVM_MEMORY_USED, METRIC_JVM_MEMORY_USED_AFTER_LAST_GC, METRIC_JVM_SYSTEM_CPU_LOAD_1M, METRIC_JVM_SYSTEM_CPU_UTILIZATION, METRIC_JVM_THREAD_COUNT, METRIC_K8S_CRONJOB_ACTIVE_JOBS, METRIC_K8S_DAEMONSET_CURRENT_SCHEDULED_NODES, METRIC_K8S_DAEMONSET_DESIRED_SCHEDULED_NODES, METRIC_K8S_DAEMONSET_MISSCHEDULED_NODES, METRIC_K8S_DAEMONSET_READY_NODES, METRIC_K8S_DEPLOYMENT_AVAILABLE_PODS, METRIC_K8S_DEPLOYMENT_DESIRED_PODS, METRIC_K8S_HPA_CURRENT_PODS, METRIC_K8S_HPA_DESIRED_PODS, METRIC_K8S_HPA_MAX_PODS, METRIC_K8S_HPA_MIN_PODS, METRIC_K8S_JOB_ACTIVE_PODS, METRIC_K8S_JOB_DESIRED_SUCCESSFUL_PODS, METRIC_K8S_JOB_FAILED_PODS, METRIC_K8S_JOB_MAX_PARALLEL_PODS, METRIC_K8S_JOB_SUCCESSFUL_PODS, METRIC_K8S_NAMESPACE_PHASE, METRIC_K8S_NODE_CPU_TIME, METRIC_K8S_NODE_CPU_USAGE, METRIC_K8S_NODE_MEMORY_USAGE, METRIC_K8S_NODE_NETWORK_ERRORS, METRIC_K8S_NODE_NETWORK_IO, METRIC_K8S_NODE_UPTIME, METRIC_K8S_POD_CPU_TIME, METRIC_K8S_POD_CPU_USAGE, METRIC_K8S_POD_MEMORY_USAGE, METRIC_K8S_POD_NETWORK_ERRORS, METRIC_K8S_POD_NETWORK_IO, METRIC_K8S_POD_UPTIME, METRIC_K8S_REPLICASET_AVAILABLE_PODS, METRIC_K8S_REPLICASET_DESIRED_PODS, METRIC_K8S_REPLICATION_CONTROLLER_AVAILABLE_PODS, METRIC_K8S_REPLICATION_CONTROLLER_DESIRED_PODS, METRIC_K8S_STATEFULSET_CURRENT_PODS, METRIC_K8S_STATEFULSET_DESIRED_PODS, METRIC_K8S_STATEFULSET_READY_PODS, METRIC_K8S_STATEFULSET_UPDATED_PODS, METRIC_KESTREL_ACTIVE_CONNECTIONS, METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES, METRIC_KESTREL_CONNECTION_DURATION, METRIC_KESTREL_QUEUED_CONNECTIONS, METRIC_KESTREL_QUEUED_REQUESTS, METRIC_KESTREL_REJECTED_CONNECTIONS, METRIC_KESTREL_TLS_HANDSHAKE_DURATION, METRIC_KESTREL_UPGRADED_CONNECTIONS, METRIC_MESSAGING_CLIENT_CONSUMED_MESSAGES, METRIC_MESSAGING_CLIENT_OPERATION_DURATION, METRIC_MESSAGING_CLIENT_PUBLISHED_MESSAGES, METRIC_MESSAGING_CLIENT_SENT_MESSAGES, METRIC_MESSAGING_PROCESS_DURATION, METRIC_MESSAGING_PROCESS_MESSAGES, METRIC_MESSAGING_PUBLISH_DURATION, METRIC_MESSAGING_PUBLISH_MESSAGES, METRIC_MESSAGING_RECEIVE_DURATION, METRIC_MESSAGING_RECEIVE_MESSAGES, METRIC_NODEJS_EVENTLOOP_DELAY_MAX, METRIC_NODEJS_EVENTLOOP_DELAY_MEAN, METRIC_NODEJS_EVENTLOOP_DELAY_MIN, METRIC_NODEJS_EVENTLOOP_DELAY_P50, METRIC_NODEJS_EVENTLOOP_DELAY_P90, METRIC_NODEJS_EVENTLOOP_DELAY_P99, METRIC_NODEJS_EVENTLOOP_DELAY_STDDEV, METRIC_NODEJS_EVENTLOOP_TIME, METRIC_NODEJS_EVENTLOOP_UTILIZATION, METRIC_PROCESS_CONTEXT_SWITCHES, METRIC_PROCESS_CPU_TIME, METRIC_PROCESS_CPU_UTILIZATION, METRIC_PROCESS_DISK_IO, METRIC_PROCESS_MEMORY_USAGE, METRIC_PROCESS_MEMORY_VIRTUAL, METRIC_PROCESS_NETWORK_IO, METRIC_PROCESS_OPEN_FILE_DESCRIPTOR_COUNT, METRIC_PROCESS_PAGING_FAULTS, METRIC_PROCESS_THREAD_COUNT, METRIC_PROCESS_UPTIME, METRIC_RPC_CLIENT_DURATION, METRIC_RPC_CLIENT_REQUESTS_PER_RPC, METRIC_RPC_CLIENT_REQUEST_SIZE, METRIC_RPC_CLIENT_RESPONSES_PER_RPC, METRIC_RPC_CLIENT_RESPONSE_SIZE, METRIC_RPC_SERVER_DURATION, METRIC_RPC_SERVER_REQUESTS_PER_RPC, METRIC_RPC_SERVER_REQUEST_SIZE, METRIC_RPC_SERVER_RESPONSES_PER_RPC, METRIC_RPC_SERVER_RESPONSE_SIZE, METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS, METRIC_SIGNALR_SERVER_CONNECTION_DURATION, METRIC_SYSTEM_CPU_FREQUENCY, METRIC_SYSTEM_CPU_LOGICAL_COUNT, METRIC_SYSTEM_CPU_PHYSICAL_COUNT, METRIC_SYSTEM_CPU_TIME, METRIC_SYSTEM_CPU_UTILIZATION, METRIC_SYSTEM_DISK_IO, METRIC_SYSTEM_DISK_IO_TIME, METRIC_SYSTEM_DISK_LIMIT, METRIC_SYSTEM_DISK_MERGED, METRIC_SYSTEM_DISK_OPERATIONS, METRIC_SYSTEM_DISK_OPERATION_TIME, METRIC_SYSTEM_FILESYSTEM_LIMIT, METRIC_SYSTEM_FILESYSTEM_USAGE, METRIC_SYSTEM_FILESYSTEM_UTILIZATION, METRIC_SYSTEM_LINUX_MEMORY_AVAILABLE, METRIC_SYSTEM_LINUX_MEMORY_SLAB_USAGE, METRIC_SYSTEM_MEMORY_LIMIT, METRIC_SYSTEM_MEMORY_SHARED, METRIC_SYSTEM_MEMORY_USAGE, METRIC_SYSTEM_MEMORY_UTILIZATION, METRIC_SYSTEM_NETWORK_CONNECTIONS, METRIC_SYSTEM_NETWORK_DROPPED, METRIC_SYSTEM_NETWORK_ERRORS, METRIC_SYSTEM_NETWORK_IO, METRIC_SYSTEM_NETWORK_PACKETS, METRIC_SYSTEM_PAGING_FAULTS, METRIC_SYSTEM_PAGING_OPERATIONS, METRIC_SYSTEM_PAGING_USAGE, METRIC_SYSTEM_PAGING_UTILIZATION, METRIC_SYSTEM_PROCESS_COUNT, METRIC_SYSTEM_PROCESS_CREATED, METRIC_SYSTEM_UPTIME, METRIC_V8JS_GC_DURATION, METRIC_V8JS_HEAP_SPACE_AVAILABLE_SIZE, METRIC_V8JS_HEAP_SPACE_PHYSICAL_SIZE, METRIC_V8JS_MEMORY_HEAP_LIMIT, METRIC_V8JS_MEMORY_HEAP_USED, METRIC_VCS_CHANGE_COUNT, METRIC_VCS_CHANGE_DURATION, METRIC_VCS_CHANGE_TIME_TO_APPROVAL, METRIC_VCS_CHANGE_TIME_TO_MERGE, METRIC_VCS_CONTRIBUTOR_COUNT, METRIC_VCS_REF_COUNT, METRIC_VCS_REF_LINES_DELTA, METRIC_VCS_REF_REVISIONS_DELTA, METRIC_VCS_REF_TIME, METRIC_VCS_REPOSITORY_COUNT, MessageTypeValues, MessagingDestinationKindValues, MessagingOperationValues, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT, NETHOSTCONNECTIONSUBTYPEVALUES_EDGE, NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B, NETHOSTCONNECTIONSUBTYPEVALUES_GPRS, NETHOSTCONNECTIONSUBTYPEVALUES_GSM, NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP, NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA, NETHOSTCONNECTIONSUBTYPEVALUES_IDEN, NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN, NETHOSTCONNECTIONSUBTYPEVALUES_LTE, NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA, NETHOSTCONNECTIONSUBTYPEVALUES_NR, NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA, NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA, NETHOSTCONNECTIONSUBTYPEVALUES_UMTS, NETHOSTCONNECTIONTYPEVALUES_CELL, NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE, NETHOSTCONNECTIONTYPEVALUES_UNKNOWN, NETHOSTCONNECTIONTYPEVALUES_WIFI, NETHOSTCONNECTIONTYPEVALUES_WIRED, NETTRANSPORTVALUES_INPROC, NETTRANSPORTVALUES_IP, NETTRANSPORTVALUES_IP_TCP, NETTRANSPORTVALUES_IP_UDP, NETTRANSPORTVALUES_OTHER, NETTRANSPORTVALUES_PIPE, NETTRANSPORTVALUES_UNIX, NETWORK_CONNECTION_STATE_VALUE_CLOSED, NETWORK_CONNECTION_STATE_VALUE_CLOSE_WAIT, NETWORK_CONNECTION_STATE_VALUE_CLOSING, NETWORK_CONNECTION_STATE_VALUE_ESTABLISHED, NETWORK_CONNECTION_STATE_VALUE_FIN_WAIT_1, NETWORK_CONNECTION_STATE_VALUE_FIN_WAIT_2, NETWORK_CONNECTION_STATE_VALUE_LAST_ACK, NETWORK_CONNECTION_STATE_VALUE_LISTEN, NETWORK_CONNECTION_STATE_VALUE_SYN_RECEIVED, NETWORK_CONNECTION_STATE_VALUE_SYN_SENT, NETWORK_CONNECTION_STATE_VALUE_TIME_WAIT, NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA, NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA2000_1XRTT, NETWORK_CONNECTION_SUBTYPE_VALUE_EDGE, NETWORK_CONNECTION_SUBTYPE_VALUE_EHRPD, NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_0, NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_A, NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_B, NETWORK_CONNECTION_SUBTYPE_VALUE_GPRS, NETWORK_CONNECTION_SUBTYPE_VALUE_GSM, NETWORK_CONNECTION_SUBTYPE_VALUE_HSDPA, NETWORK_CONNECTION_SUBTYPE_VALUE_HSPA, NETWORK_CONNECTION_SUBTYPE_VALUE_HSPAP, NETWORK_CONNECTION_SUBTYPE_VALUE_HSUPA, NETWORK_CONNECTION_SUBTYPE_VALUE_IDEN, NETWORK_CONNECTION_SUBTYPE_VALUE_IWLAN, NETWORK_CONNECTION_SUBTYPE_VALUE_LTE, NETWORK_CONNECTION_SUBTYPE_VALUE_LTE_CA, NETWORK_CONNECTION_SUBTYPE_VALUE_NR, NETWORK_CONNECTION_SUBTYPE_VALUE_NRNSA, NETWORK_CONNECTION_SUBTYPE_VALUE_TD_SCDMA, NETWORK_CONNECTION_SUBTYPE_VALUE_UMTS, NETWORK_CONNECTION_TYPE_VALUE_CELL, NETWORK_CONNECTION_TYPE_VALUE_UNAVAILABLE, NETWORK_CONNECTION_TYPE_VALUE_UNKNOWN, NETWORK_CONNECTION_TYPE_VALUE_WIFI, NETWORK_CONNECTION_TYPE_VALUE_WIRED, NETWORK_IO_DIRECTION_VALUE_RECEIVE, NETWORK_IO_DIRECTION_VALUE_TRANSMIT, NETWORK_TRANSPORT_VALUE_PIPE, NETWORK_TRANSPORT_VALUE_QUIC, NETWORK_TRANSPORT_VALUE_TCP, NETWORK_TRANSPORT_VALUE_UDP, NETWORK_TRANSPORT_VALUE_UNIX, NETWORK_TYPE_VALUE_IPV4, NETWORK_TYPE_VALUE_IPV6, NET_SOCK_FAMILY_VALUE_INET, NET_SOCK_FAMILY_VALUE_INET6, NET_SOCK_FAMILY_VALUE_UNIX, NET_TRANSPORT_VALUE_INPROC, NET_TRANSPORT_VALUE_IP_TCP, NET_TRANSPORT_VALUE_IP_UDP, NET_TRANSPORT_VALUE_OTHER, NET_TRANSPORT_VALUE_PIPE, NODEJS_EVENTLOOP_STATE_VALUE_ACTIVE, NODEJS_EVENTLOOP_STATE_VALUE_IDLE, NetHostConnectionSubtypeValues, NetHostConnectionTypeValues, NetTransportValues, OPENTRACING_REF_TYPE_VALUE_CHILD_OF, OPENTRACING_REF_TYPE_VALUE_FOLLOWS_FROM, OSTYPEVALUES_AIX, OSTYPEVALUES_DARWIN, OSTYPEVALUES_DRAGONFLYBSD, OSTYPEVALUES_FREEBSD, OSTYPEVALUES_HPUX, OSTYPEVALUES_LINUX, OSTYPEVALUES_NETBSD, OSTYPEVALUES_OPENBSD, OSTYPEVALUES_SOLARIS, OSTYPEVALUES_WINDOWS, OSTYPEVALUES_Z_OS, OS_TYPE_VALUE_AIX, OS_TYPE_VALUE_DARWIN, OS_TYPE_VALUE_DRAGONFLYBSD, OS_TYPE_VALUE_FREEBSD, OS_TYPE_VALUE_HPUX, OS_TYPE_VALUE_LINUX, OS_TYPE_VALUE_NETBSD, OS_TYPE_VALUE_OPENBSD, OS_TYPE_VALUE_SOLARIS, OS_TYPE_VALUE_WINDOWS, OS_TYPE_VALUE_Z_OS, OTEL_STATUS_CODE_VALUE_ERROR, OTEL_STATUS_CODE_VALUE_OK, OsTypeValues, PROCESS_CONTEXT_SWITCH_TYPE_VALUE_INVOLUNTARY, PROCESS_CONTEXT_SWITCH_TYPE_VALUE_VOLUNTARY, PROCESS_CPU_STATE_VALUE_SYSTEM, PROCESS_CPU_STATE_VALUE_USER, PROCESS_CPU_STATE_VALUE_WAIT, PROCESS_PAGING_FAULT_TYPE_VALUE_MAJOR, PROCESS_PAGING_FAULT_TYPE_VALUE_MINOR, PROFILE_FRAME_TYPE_VALUE_BEAM, PROFILE_FRAME_TYPE_VALUE_CPYTHON, PROFILE_FRAME_TYPE_VALUE_DOTNET, PROFILE_FRAME_TYPE_VALUE_JVM, PROFILE_FRAME_TYPE_VALUE_KERNEL, PROFILE_FRAME_TYPE_VALUE_NATIVE, PROFILE_FRAME_TYPE_VALUE_PERL, PROFILE_FRAME_TYPE_VALUE_PHP, PROFILE_FRAME_TYPE_VALUE_RUBY, PROFILE_FRAME_TYPE_VALUE_V8JS, RPCGRPCSTATUSCODEVALUES_ABORTED, RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS, RPCGRPCSTATUSCODEVALUES_CANCELLED, RPCGRPCSTATUSCODEVALUES_DATA_LOSS, RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED, RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION, RPCGRPCSTATUSCODEVALUES_INTERNAL, RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT, RPCGRPCSTATUSCODEVALUES_NOT_FOUND, RPCGRPCSTATUSCODEVALUES_OK, RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE, RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED, RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED, RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED, RPCGRPCSTATUSCODEVALUES_UNAVAILABLE, RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED, RPCGRPCSTATUSCODEVALUES_UNKNOWN, RPC_CONNECT_RPC_ERROR_CODE_VALUE_ABORTED, RPC_CONNECT_RPC_ERROR_CODE_VALUE_ALREADY_EXISTS, RPC_CONNECT_RPC_ERROR_CODE_VALUE_CANCELLED, RPC_CONNECT_RPC_ERROR_CODE_VALUE_DATA_LOSS, RPC_CONNECT_RPC_ERROR_CODE_VALUE_DEADLINE_EXCEEDED, RPC_CONNECT_RPC_ERROR_CODE_VALUE_FAILED_PRECONDITION, RPC_CONNECT_RPC_ERROR_CODE_VALUE_INTERNAL, RPC_CONNECT_RPC_ERROR_CODE_VALUE_INVALID_ARGUMENT, RPC_CONNECT_RPC_ERROR_CODE_VALUE_NOT_FOUND, RPC_CONNECT_RPC_ERROR_CODE_VALUE_OUT_OF_RANGE, RPC_CONNECT_RPC_ERROR_CODE_VALUE_PERMISSION_DENIED, RPC_CONNECT_RPC_ERROR_CODE_VALUE_RESOURCE_EXHAUSTED, RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNAUTHENTICATED, RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNAVAILABLE, RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNIMPLEMENTED, RPC_CONNECT_RPC_ERROR_CODE_VALUE_UNKNOWN, RPC_GRPC_STATUS_CODE_VALUE_ABORTED, RPC_GRPC_STATUS_CODE_VALUE_ALREADY_EXISTS, RPC_GRPC_STATUS_CODE_VALUE_CANCELLED, RPC_GRPC_STATUS_CODE_VALUE_DATA_LOSS, RPC_GRPC_STATUS_CODE_VALUE_DEADLINE_EXCEEDED, RPC_GRPC_STATUS_CODE_VALUE_FAILED_PRECONDITION, RPC_GRPC_STATUS_CODE_VALUE_INTERNAL, RPC_GRPC_STATUS_CODE_VALUE_INVALID_ARGUMENT, RPC_GRPC_STATUS_CODE_VALUE_NOT_FOUND, RPC_GRPC_STATUS_CODE_VALUE_OK, RPC_GRPC_STATUS_CODE_VALUE_OUT_OF_RANGE, RPC_GRPC_STATUS_CODE_VALUE_PERMISSION_DENIED, RPC_GRPC_STATUS_CODE_VALUE_RESOURCE_EXHAUSTED, RPC_GRPC_STATUS_CODE_VALUE_UNAUTHENTICATED, RPC_GRPC_STATUS_CODE_VALUE_UNAVAILABLE, RPC_GRPC_STATUS_CODE_VALUE_UNIMPLEMENTED, RPC_GRPC_STATUS_CODE_VALUE_UNKNOWN, RPC_MESSAGE_TYPE_VALUE_RECEIVED, RPC_MESSAGE_TYPE_VALUE_SENT, RPC_SYSTEM_VALUE_APACHE_DUBBO, RPC_SYSTEM_VALUE_CONNECT_RPC, RPC_SYSTEM_VALUE_DOTNET_WCF, RPC_SYSTEM_VALUE_GRPC, RPC_SYSTEM_VALUE_JAVA_RMI, RpcGrpcStatusCodeValues, SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET, SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ, SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY, SEMATTRS_AWS_DYNAMODB_COUNT, SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, SEMATTRS_AWS_DYNAMODB_INDEX_NAME, SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS, SEMATTRS_AWS_DYNAMODB_LIMIT, SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_PROJECTION, SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT, SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD, SEMATTRS_AWS_DYNAMODB_SEGMENT, SEMATTRS_AWS_DYNAMODB_SELECT, SEMATTRS_AWS_DYNAMODB_TABLE_COUNT, SEMATTRS_AWS_DYNAMODB_TABLE_NAMES, SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS, SEMATTRS_AWS_LAMBDA_INVOKED_ARN, SEMATTRS_CODE_FILEPATH, SEMATTRS_CODE_FUNCTION, SEMATTRS_CODE_LINENO, SEMATTRS_CODE_NAMESPACE, SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL, SEMATTRS_DB_CASSANDRA_COORDINATOR_DC, SEMATTRS_DB_CASSANDRA_COORDINATOR_ID, SEMATTRS_DB_CASSANDRA_IDEMPOTENCE, SEMATTRS_DB_CASSANDRA_KEYSPACE, SEMATTRS_DB_CASSANDRA_PAGE_SIZE, SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, SEMATTRS_DB_CASSANDRA_TABLE, SEMATTRS_DB_CONNECTION_STRING, SEMATTRS_DB_HBASE_NAMESPACE, SEMATTRS_DB_JDBC_DRIVER_CLASSNAME, SEMATTRS_DB_MONGODB_COLLECTION, SEMATTRS_DB_MSSQL_INSTANCE_NAME, SEMATTRS_DB_NAME, SEMATTRS_DB_OPERATION, SEMATTRS_DB_REDIS_DATABASE_INDEX, SEMATTRS_DB_SQL_TABLE, SEMATTRS_DB_STATEMENT, SEMATTRS_DB_SYSTEM, SEMATTRS_DB_USER, SEMATTRS_ENDUSER_ID, SEMATTRS_ENDUSER_ROLE, SEMATTRS_ENDUSER_SCOPE, SEMATTRS_EXCEPTION_ESCAPED, SEMATTRS_EXCEPTION_MESSAGE, SEMATTRS_EXCEPTION_STACKTRACE, SEMATTRS_EXCEPTION_TYPE, SEMATTRS_FAAS_COLDSTART, SEMATTRS_FAAS_CRON, SEMATTRS_FAAS_DOCUMENT_COLLECTION, SEMATTRS_FAAS_DOCUMENT_NAME, SEMATTRS_FAAS_DOCUMENT_OPERATION, SEMATTRS_FAAS_DOCUMENT_TIME, SEMATTRS_FAAS_EXECUTION, SEMATTRS_FAAS_INVOKED_NAME, SEMATTRS_FAAS_INVOKED_PROVIDER, SEMATTRS_FAAS_INVOKED_REGION, SEMATTRS_FAAS_TIME, SEMATTRS_FAAS_TRIGGER, SEMATTRS_HTTP_CLIENT_IP, SEMATTRS_HTTP_FLAVOR, SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_ROUTE, SEMATTRS_HTTP_SCHEME, SEMATTRS_HTTP_SERVER_NAME, SEMATTRS_HTTP_STATUS_CODE, SEMATTRS_HTTP_TARGET, SEMATTRS_HTTP_URL, SEMATTRS_HTTP_USER_AGENT, SEMATTRS_MESSAGE_COMPRESSED_SIZE, SEMATTRS_MESSAGE_ID, SEMATTRS_MESSAGE_TYPE, SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE, SEMATTRS_MESSAGING_CONSUMER_ID, SEMATTRS_MESSAGING_CONVERSATION_ID, SEMATTRS_MESSAGING_DESTINATION, SEMATTRS_MESSAGING_DESTINATION_KIND, SEMATTRS_MESSAGING_KAFKA_CLIENT_ID, SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP, SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY, SEMATTRS_MESSAGING_KAFKA_PARTITION, SEMATTRS_MESSAGING_KAFKA_TOMBSTONE, SEMATTRS_MESSAGING_MESSAGE_ID, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES, SEMATTRS_MESSAGING_OPERATION, SEMATTRS_MESSAGING_PROTOCOL, SEMATTRS_MESSAGING_PROTOCOL_VERSION, SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY, SEMATTRS_MESSAGING_SYSTEM, SEMATTRS_MESSAGING_TEMP_DESTINATION, SEMATTRS_MESSAGING_URL, SEMATTRS_NET_HOST_CARRIER_ICC, SEMATTRS_NET_HOST_CARRIER_MCC, SEMATTRS_NET_HOST_CARRIER_MNC, SEMATTRS_NET_HOST_CARRIER_NAME, SEMATTRS_NET_HOST_CONNECTION_SUBTYPE, SEMATTRS_NET_HOST_CONNECTION_TYPE, SEMATTRS_NET_HOST_IP, SEMATTRS_NET_HOST_NAME, SEMATTRS_NET_HOST_PORT, SEMATTRS_NET_PEER_IP, SEMATTRS_NET_PEER_NAME, SEMATTRS_NET_PEER_PORT, SEMATTRS_NET_TRANSPORT, SEMATTRS_PEER_SERVICE, SEMATTRS_RPC_GRPC_STATUS_CODE, SEMATTRS_RPC_JSONRPC_ERROR_CODE, SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE, SEMATTRS_RPC_JSONRPC_REQUEST_ID, SEMATTRS_RPC_JSONRPC_VERSION, SEMATTRS_RPC_METHOD, SEMATTRS_RPC_SERVICE, SEMATTRS_RPC_SYSTEM, SEMATTRS_THREAD_ID, SEMATTRS_THREAD_NAME, SEMRESATTRS_AWS_ECS_CLUSTER_ARN, SEMRESATTRS_AWS_ECS_CONTAINER_ARN, SEMRESATTRS_AWS_ECS_LAUNCHTYPE, SEMRESATTRS_AWS_ECS_TASK_ARN, SEMRESATTRS_AWS_ECS_TASK_FAMILY, SEMRESATTRS_AWS_ECS_TASK_REVISION, SEMRESATTRS_AWS_EKS_CLUSTER_ARN, SEMRESATTRS_AWS_LOG_GROUP_ARNS, SEMRESATTRS_AWS_LOG_GROUP_NAMES, SEMRESATTRS_AWS_LOG_STREAM_ARNS, SEMRESATTRS_AWS_LOG_STREAM_NAMES, SEMRESATTRS_CLOUD_ACCOUNT_ID, SEMRESATTRS_CLOUD_AVAILABILITY_ZONE, SEMRESATTRS_CLOUD_PLATFORM, SEMRESATTRS_CLOUD_PROVIDER, SEMRESATTRS_CLOUD_REGION, SEMRESATTRS_CONTAINER_ID, SEMRESATTRS_CONTAINER_IMAGE_NAME, SEMRESATTRS_CONTAINER_IMAGE_TAG, SEMRESATTRS_CONTAINER_NAME, SEMRESATTRS_CONTAINER_RUNTIME, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT, SEMRESATTRS_DEVICE_ID, SEMRESATTRS_DEVICE_MODEL_IDENTIFIER, SEMRESATTRS_DEVICE_MODEL_NAME, SEMRESATTRS_FAAS_ID, SEMRESATTRS_FAAS_INSTANCE, SEMRESATTRS_FAAS_MAX_MEMORY, SEMRESATTRS_FAAS_NAME, SEMRESATTRS_FAAS_VERSION, SEMRESATTRS_HOST_ARCH, SEMRESATTRS_HOST_ID, SEMRESATTRS_HOST_IMAGE_ID, SEMRESATTRS_HOST_IMAGE_NAME, SEMRESATTRS_HOST_IMAGE_VERSION, SEMRESATTRS_HOST_NAME, SEMRESATTRS_HOST_TYPE, SEMRESATTRS_K8S_CLUSTER_NAME, SEMRESATTRS_K8S_CONTAINER_NAME, SEMRESATTRS_K8S_CRONJOB_NAME, SEMRESATTRS_K8S_CRONJOB_UID, SEMRESATTRS_K8S_DAEMONSET_NAME, SEMRESATTRS_K8S_DAEMONSET_UID, SEMRESATTRS_K8S_DEPLOYMENT_NAME, SEMRESATTRS_K8S_DEPLOYMENT_UID, SEMRESATTRS_K8S_JOB_NAME, SEMRESATTRS_K8S_JOB_UID, SEMRESATTRS_K8S_NAMESPACE_NAME, SEMRESATTRS_K8S_NODE_NAME, SEMRESATTRS_K8S_NODE_UID, SEMRESATTRS_K8S_POD_NAME, SEMRESATTRS_K8S_POD_UID, SEMRESATTRS_K8S_REPLICASET_NAME, SEMRESATTRS_K8S_REPLICASET_UID, SEMRESATTRS_K8S_STATEFULSET_NAME, SEMRESATTRS_K8S_STATEFULSET_UID, SEMRESATTRS_OS_DESCRIPTION, SEMRESATTRS_OS_NAME, SEMRESATTRS_OS_TYPE, SEMRESATTRS_OS_VERSION, SEMRESATTRS_PROCESS_COMMAND, SEMRESATTRS_PROCESS_COMMAND_ARGS, SEMRESATTRS_PROCESS_COMMAND_LINE, SEMRESATTRS_PROCESS_EXECUTABLE_NAME, SEMRESATTRS_PROCESS_EXECUTABLE_PATH, SEMRESATTRS_PROCESS_OWNER, SEMRESATTRS_PROCESS_PID, SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION, SEMRESATTRS_PROCESS_RUNTIME_NAME, SEMRESATTRS_PROCESS_RUNTIME_VERSION, SEMRESATTRS_SERVICE_INSTANCE_ID, SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_NAMESPACE, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_TELEMETRY_AUTO_VERSION, SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, SEMRESATTRS_TELEMETRY_SDK_NAME, SEMRESATTRS_TELEMETRY_SDK_VERSION, SEMRESATTRS_WEBENGINE_DESCRIPTION, SEMRESATTRS_WEBENGINE_NAME, SEMRESATTRS_WEBENGINE_VERSION, SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN, SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE, SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT, SIGNALR_TRANSPORT_VALUE_LONG_POLLING, SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS, SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS, STATE_VALUE_IDLE, STATE_VALUE_USED, SYSTEM_CPU_STATE_VALUE_IDLE, SYSTEM_CPU_STATE_VALUE_INTERRUPT, SYSTEM_CPU_STATE_VALUE_IOWAIT, SYSTEM_CPU_STATE_VALUE_NICE, SYSTEM_CPU_STATE_VALUE_STEAL, SYSTEM_CPU_STATE_VALUE_SYSTEM, SYSTEM_CPU_STATE_VALUE_USER, SYSTEM_FILESYSTEM_STATE_VALUE_FREE, SYSTEM_FILESYSTEM_STATE_VALUE_RESERVED, SYSTEM_FILESYSTEM_STATE_VALUE_USED, SYSTEM_FILESYSTEM_TYPE_VALUE_EXFAT, SYSTEM_FILESYSTEM_TYPE_VALUE_EXT4, SYSTEM_FILESYSTEM_TYPE_VALUE_FAT32, SYSTEM_FILESYSTEM_TYPE_VALUE_HFSPLUS, SYSTEM_FILESYSTEM_TYPE_VALUE_NTFS, SYSTEM_FILESYSTEM_TYPE_VALUE_REFS, SYSTEM_MEMORY_STATE_VALUE_BUFFERS, SYSTEM_MEMORY_STATE_VALUE_CACHED, SYSTEM_MEMORY_STATE_VALUE_FREE, SYSTEM_MEMORY_STATE_VALUE_SHARED, SYSTEM_MEMORY_STATE_VALUE_USED, SYSTEM_NETWORK_STATE_VALUE_CLOSE, SYSTEM_NETWORK_STATE_VALUE_CLOSE_WAIT, SYSTEM_NETWORK_STATE_VALUE_CLOSING, SYSTEM_NETWORK_STATE_VALUE_DELETE, SYSTEM_NETWORK_STATE_VALUE_ESTABLISHED, SYSTEM_NETWORK_STATE_VALUE_FIN_WAIT_1, SYSTEM_NETWORK_STATE_VALUE_FIN_WAIT_2, SYSTEM_NETWORK_STATE_VALUE_LAST_ACK, SYSTEM_NETWORK_STATE_VALUE_LISTEN, SYSTEM_NETWORK_STATE_VALUE_SYN_RECV, SYSTEM_NETWORK_STATE_VALUE_SYN_SENT, SYSTEM_NETWORK_STATE_VALUE_TIME_WAIT, SYSTEM_PAGING_DIRECTION_VALUE_IN, SYSTEM_PAGING_DIRECTION_VALUE_OUT, SYSTEM_PAGING_STATE_VALUE_FREE, SYSTEM_PAGING_STATE_VALUE_USED, SYSTEM_PAGING_TYPE_VALUE_MAJOR, SYSTEM_PAGING_TYPE_VALUE_MINOR, SYSTEM_PROCESSES_STATUS_VALUE_DEFUNCT, SYSTEM_PROCESSES_STATUS_VALUE_RUNNING, SYSTEM_PROCESSES_STATUS_VALUE_SLEEPING, SYSTEM_PROCESSES_STATUS_VALUE_STOPPED, SYSTEM_PROCESS_STATUS_VALUE_DEFUNCT, SYSTEM_PROCESS_STATUS_VALUE_RUNNING, SYSTEM_PROCESS_STATUS_VALUE_SLEEPING, SYSTEM_PROCESS_STATUS_VALUE_STOPPED, SemanticAttributes, SemanticResourceAttributes, TELEMETRYSDKLANGUAGEVALUES_CPP, TELEMETRYSDKLANGUAGEVALUES_DOTNET, TELEMETRYSDKLANGUAGEVALUES_ERLANG, TELEMETRYSDKLANGUAGEVALUES_GO, TELEMETRYSDKLANGUAGEVALUES_JAVA, TELEMETRYSDKLANGUAGEVALUES_NODEJS, TELEMETRYSDKLANGUAGEVALUES_PHP, TELEMETRYSDKLANGUAGEVALUES_PYTHON, TELEMETRYSDKLANGUAGEVALUES_RUBY, TELEMETRYSDKLANGUAGEVALUES_WEBJS, TELEMETRY_SDK_LANGUAGE_VALUE_CPP, TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET, TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG, TELEMETRY_SDK_LANGUAGE_VALUE_GO, TELEMETRY_SDK_LANGUAGE_VALUE_JAVA, TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS, TELEMETRY_SDK_LANGUAGE_VALUE_PHP, TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON, TELEMETRY_SDK_LANGUAGE_VALUE_RUBY, TELEMETRY_SDK_LANGUAGE_VALUE_RUST, TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT, TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS, TEST_CASE_RESULT_STATUS_VALUE_FAIL, TEST_CASE_RESULT_STATUS_VALUE_PASS, TEST_SUITE_RUN_STATUS_VALUE_ABORTED, TEST_SUITE_RUN_STATUS_VALUE_FAILURE, TEST_SUITE_RUN_STATUS_VALUE_IN_PROGRESS, TEST_SUITE_RUN_STATUS_VALUE_SKIPPED, TEST_SUITE_RUN_STATUS_VALUE_SUCCESS, TEST_SUITE_RUN_STATUS_VALUE_TIMED_OUT, TLS_PROTOCOL_NAME_VALUE_SSL, TLS_PROTOCOL_NAME_VALUE_TLS, TelemetrySdkLanguageValues, USER_AGENT_SYNTHETIC_TYPE_VALUE_BOT, USER_AGENT_SYNTHETIC_TYPE_VALUE_TEST, V8JS_GC_TYPE_VALUE_INCREMENTAL, V8JS_GC_TYPE_VALUE_MAJOR, V8JS_GC_TYPE_VALUE_MINOR, V8JS_GC_TYPE_VALUE_WEAKCB, V8JS_HEAP_SPACE_NAME_VALUE_CODE_SPACE, V8JS_HEAP_SPACE_NAME_VALUE_LARGE_OBJECT_SPACE, V8JS_HEAP_SPACE_NAME_VALUE_MAP_SPACE, V8JS_HEAP_SPACE_NAME_VALUE_NEW_SPACE, V8JS_HEAP_SPACE_NAME_VALUE_OLD_SPACE, VCS_CHANGE_STATE_VALUE_CLOSED, VCS_CHANGE_STATE_VALUE_MERGED, VCS_CHANGE_STATE_VALUE_OPEN, VCS_CHANGE_STATE_VALUE_WIP, VCS_LINE_CHANGE_TYPE_VALUE_ADDED, VCS_LINE_CHANGE_TYPE_VALUE_REMOVED, VCS_REF_BASE_TYPE_VALUE_BRANCH, VCS_REF_BASE_TYPE_VALUE_TAG, VCS_REF_HEAD_TYPE_VALUE_BRANCH, VCS_REF_HEAD_TYPE_VALUE_TAG, VCS_REF_TYPE_VALUE_BRANCH, VCS_REF_TYPE_VALUE_TAG, VCS_REPOSITORY_REF_TYPE_VALUE_BRANCH, VCS_REPOSITORY_REF_TYPE_VALUE_TAG, VCS_REVISION_DELTA_DIRECTION_VALUE_AHEAD, VCS_REVISION_DELTA_DIRECTION_VALUE_BEHIND };
