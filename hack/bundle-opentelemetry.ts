#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=. --allow-env --allow-sys --allow-ffi

import { rollup, Plugin } from 'npm:rollup@4.17.2';
import { nodeResolve } from 'npm:@rollup/plugin-node-resolve@15.2.3';
import commonjs from 'npm:@rollup/plugin-commonjs@25.0.7';
import sourcemaps from 'npm:rollup-plugin-sourcemaps@0.6.3';
import cleanup from 'npm:rollup-plugin-cleanup@3.2.1';
import dts from 'npm:rollup-plugin-dts@4.2.3';

async function buildModuleWithRollup(directory: string, modName: string, external: string[]) {
  const entrypoint = 'index';
  const mainFile = await Deno.readTextFile(directory+'/build/esnext/'+entrypoint+'.js');
  const licenseComment = mainFile.startsWith('/*') ? mainFile.slice(0, mainFile.indexOf('*/')+3) : '';

  const bundle = await rollup({
    input: directory+'/build/esnext/'+entrypoint+'.js',
    external,
    plugins: [
      sourcemaps(),
      nodeResolve({
        // extensions : [".js",".jsx"],
        // resolveOnly: module => {console.error({module});return true},
      }),
      commonjs(),
      cleanup(),
    ],
  }).then(x => x.generate({
    format: 'es',
    file: `${modName}.js`,
    sourcemap: false, // TODO: we do post-processing :()
    banner: `${licenseComment}/// <reference types="./${modName}.d.ts" />\n`,
    // indent: false,
  }));

  const dtsPlugin = dts();
  const origOptions = dtsPlugin.outputOptions!;
  dtsPlugin.outputOptions = function (this: Plugin, ...args) {
    const opts = origOptions.call(this, ...args)
    opts.interop = 'esModule'
    delete opts.namespaceToStringTag
    opts.generatedCode = { symbols: false, ...opts.generatedCode }
    return opts
  }

  const tsBundle = await rollup({
    input: directory+'/build/esnext/'+entrypoint+'.d.ts',
    external,
    plugins: [
      // sourcemaps(), // not obeyed by dts plugin
      dtsPlugin,
    ],
  }).then(x => x.generate({
    format: 'es',
    file: `${modName}.d.ts`,
    banner: licenseComment,
    // indent: `\t`,
  }));

  // We write the chunks ourself to put them somewhere else
  for (const chunk of [ ...bundle.output, ...tsBundle.output ]) {

    let text = chunk.type == 'chunk' ? chunk.code : `${chunk.source}`;
    const importExtension = chunk.fileName.endsWith('.d.ts') ? '.d.ts' : '.js';

    const patternImport = /(?:import|export)(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/m;
    const patternImportG = new RegExp(patternImport, 'mg');
    text = text.replaceAll(patternImportG, matchText => {
      // console.error({matchText})
      let match = matchText.match(patternImport);
      if (!match) throw new Error('bug');
      let newImport = '';
      if (match[2].startsWith('@opentelemetry/')) {
        newImport = './' + match[2].split('/')[1] + importExtension;
      } else if (['path', 'os', 'process', 'fs'].includes(match[2])) {
        // newImport = 'node:'+match[2];
        return '';
      } else if (['shimmer'].includes(match[2])) {
        newImport = `https://esm.sh/${match[2]}@1.2.1`;
      } else {
        console.error('Unhandled import:', match[2]);
      }
      if (!newImport) return match[0];
      const start = match.index! + match[0].lastIndexOf(match[2]);
      const end = start + match[2].length
      return match[0].slice(0, start) + newImport + match[0].slice(end);
    });

    text = text.replace(`import { randomUUID } from 'crypto';`, '');
    text = text.replace(` randomUUID()`, ` crypto.randomUUID()`);
    text = text.replace(`typeof process !== 'undefined' && process && process.env\n        ? parseEnvironment(process.env)\n        : parseEnvironment(_globalThis$1);`, `parseEnvironment(Deno.env.toObject())`);
    text = text.replaceAll(`(process.env)`, `(Deno.env.toObject())`);
    text = text.replaceAll(/process\.env\[([^\]]+)\]/g, (_, x) => `Deno.env.get(${x})`);
    text = text.replaceAll(/process\.env\.([A-Z_]+)/g, (_, x) => `Deno.env.get('${x}')`);
    text = text.replace(`os.hostname()`, `Deno.hostname?.()`);
    text = text.replace("${process.argv0}", "deno");
    text = text.replace("import * as shimmer from 'npm:shimmer';", "import shimmer from 'npm:shimmer';");
    // text = text.replace("os.userInfo()", "") // this is ok if it just doesn't work so w/e
    text = text.replace("promises.readFile(path, { encoding: 'utf8' })", "Deno.readTextFile(path)");
    text = text.replaceAll("declare const enum", "declare enum"); // Cannot access ambient const enums when 'isolatedModules' is enabled.
    text = text.replace("PROCESS_RUNTIME_NAME]: 'node',", "PROCESS_RUNTIME_NAME]: 'deno',");
    text = text.replace("TELEMETRY_SDK_LANGUAGE]: TelemetrySdkLanguageValues.NODEJS,", "TELEMETRY_SDK_LANGUAGE]: 'js',");
    text = text.replace("normalizeType(platform())", "Deno.build.os");
    text = text.replace("HOST_ARCH]: normalizeArch(arch()),", "HOST_ARCH]: normalizeArch(Deno.build.arch),");
    text = text.replace("HOST_NAME]: hostname(),", "HOST_NAME]: Deno.hostname?.(),");
    text = text.replace("OS_VERSION]: release(),", "OS_VERSION]: Deno.osRelease?.(),");
    text = text.replace("fs.readFile(", "Deno.readTextFile(");
    text = text.replace("http.AgentOptions | https.AgentOptions", "never"); // TODO: replace this functionality with Deno.HttpClient arg
    text = text.replace("'User-Agent': `OTel-", "'User-Agent': `Deno/${Deno.version.deno} OTel-");
    text = text.replaceAll(/^  +/gm, x => '\t\t\t\t\t\t\t\t'.slice(0, Math.floor(x.length / 4)));

    await Deno.writeTextFile('opentelemetry/'+chunk.fileName, text);
  }
}

console.error(`Patching opentelemetry-js installation to remove NodeJSisms...`);

// use runtime's performance instead of node's
await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/node/performance.ts', 'export const otperformance = performance;');

await Deno.writeTextFile('hack/opentelemetry-js/packages/sdk-metrics/test/index-webpack.ts', '');
await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/test/browser/index-webpack.ts', '');

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/node/timer-util.ts',
`// Typescript seems to think that setTimeout will return a "Timeout" like in NodeJS
export function unrefTimer(timer: any): void {
  // @ts-expect-error TODO: Deno types in tsc
  Deno.unrefTimer?.(timer);
}`);

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/platform/node/utils.ts',
`export const normalizeArch = (archString: string) => ({
  'x64_64': 'amd64',
  'aarch64': 'arm64',
})[archString] ?? archString;
export const normalizeType = (os: string) => os;`);

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/detectors/platform/node/machine-id/getMachineId.ts',
`import { getMachineId as bsdGetId } from './getMachineId-bsd';
import { getMachineId as darwinGetId } from './getMachineId-darwin';
import { getMachineId as linuxGetId } from './getMachineId-linux';
import { getMachineId as unsupportedGetId } from './getMachineId-unsupported';
import { getMachineId as winGetId } from './getMachineId-win';

// @ts-expect-error TODO: Deno types in tsc
export const getMachineId = {
  'freebsd': bsdGetId,
  'netbsd': bsdGetId,
  'darwin': darwinGetId,
  'linux': linuxGetId,
  'windows': winGetId,
}[Deno.build.os] ?? unsupportedGetId;
`);

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/detectors/platform/node/machine-id/execAsync.ts',
`export async function execAsync(command: string) {
  const [cmd, ...args] = command.replace(/"/g, '').split(' ');
  // @ts-expect-error TODO: Deno types in tsc
  const output = await new Deno.Command(cmd, {
    args,
    stdout: 'piped',
  }).output();
  if (!output.success) throw new Error(\`\${cmd} exited with code \${output.code}\`);
  return { stdout: new TextDecoder().decode(output.stdout) };
}
`);

// Trying to avoid embedding the generated protobuf code, at least for now
for (const file of [
  'hack/opentelemetry-js/experimental/packages/otlp-transformer/src/logs/protobuf/logs.ts',
  'hack/opentelemetry-js/experimental/packages/otlp-transformer/src/metrics/protobuf/metrics.ts',
  'hack/opentelemetry-js/experimental/packages/otlp-transformer/src/trace/protobuf/trace.ts',
]) {
  await Deno.writeTextFile(file, `
import { ISerializer } from '../../i-serializer';
export const MissingSerializer: ISerializer<
  any,
  any
> = {
  serializeRequest: (arg: any[]) => {throw new Error('not implemented')},
  deserializeResponse: (arg: Uint8Array) => {throw new Error('not implemented')},
};

export const ProtobufLogsSerializer = MissingSerializer;
export const ProtobufMetricsSerializer = MissingSerializer;
export const ProtobufTraceSerializer = MissingSerializer;
`);
}

await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/opentelemetry-instrumentation/src/platform/index.ts', `export * from './browser';`);

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-sdk-trace-base/src/platform/node/RandomIdGenerator.ts',
  await Deno.readTextFile('hack/opentelemetry-js/packages/opentelemetry-sdk-trace-base/src/platform/browser/RandomIdGenerator.ts'));

// TODO: does dynamic require crap
await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/detectors/platform/node/machine-id/getMachineId.ts',
  await Deno.readTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/detectors/platform/node/machine-id/getMachineId-linux.ts'));

await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/opentelemetry-exporter-metrics-otlp-http/src/platform/node/OTLPMetricExporter.ts',
  await Deno.readTextFile('hack/opentelemetry-js/experimental/packages/opentelemetry-exporter-metrics-otlp-http/src/platform/node/OTLPMetricExporter.ts').then(text => text
    .replace('@opentelemetry/otlp-exporter-base/node-http', '@opentelemetry/otlp-exporter-base')));

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/node/environment.ts',
  await Deno.readTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/node/environment.ts').then(text => text
    .replace(`import { inspect } from 'util'`, '')
    .replaceAll('inspect(raw)', 'JSON.stringify(raw)')));

// make sure the file exists before we replace it
await Deno.readTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/configuration/convert-legacy-node-http-options.ts');
await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/configuration/convert-legacy-node-http-options.ts', `
import { OTLPExporterNodeConfigBase } from './legacy-node-configuration';
import {
  getHttpConfigurationDefaults,
  mergeOtlpHttpConfigurationWithDefaults,
  OtlpHttpConfiguration,
} from './otlp-http-configuration';
import { getHttpConfigurationFromEnvironment } from './otlp-http-env-configuration';
import { diag } from '@opentelemetry/api';
import { wrapStaticHeadersInFunction } from './shared-configuration';

/**
 * @deprecated this will be removed in 2.0
 * @param config
 * @param signalIdentifier
 * @param signalResourcePath
 * @param requiredHeaders
 */
export function convertLegacyHttpOptions(
  config: OTLPExporterNodeConfigBase,
  signalIdentifier: string,
  signalResourcePath: string,
  requiredHeaders: Record<string, string>
): OtlpHttpConfiguration {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((config as any).metadata) {
    diag.warn('Metadata cannot be set when using http');
  }

  return mergeOtlpHttpConfigurationWithDefaults(
    {
      url: config.url,
      headers: wrapStaticHeadersInFunction(config.headers),
      concurrencyLimit: config.concurrencyLimit,
      timeoutMillis: config.timeoutMillis,
      compression: config.compression,
    },
    getHttpConfigurationFromEnvironment(signalIdentifier, signalResourcePath),
    getHttpConfigurationDefaults(requiredHeaders, signalResourcePath)
  );
}
`);

for (const file of [
  // Delete tests that want protobuf generated files
  'experimental/packages/otlp-transformer/test/logs.test.ts',
  'experimental/packages/otlp-transformer/test/metrics.test.ts',
  'experimental/packages/otlp-transformer/test/trace.test.ts',
  // Delete tests that can't typetype without node-specific HttpAgent fields
  'experimental/packages/otlp-exporter-base/test/node/configuration/convert-legacy-node-otlp-http-options.test.ts',
  'experimental/packages/otlp-exporter-base/test/node/otlp-http-export-delegate.test.ts',
  'experimental/packages/otlp-exporter-base/test/node/http-exporter-transport.test.ts',
  'experimental/packages/otlp-exporter-base/test/common/configuration/otlp-http-configuration.test.ts',
]) {
  await Deno.remove(`hack/opentelemetry-js/${file}`).catch(err =>
    err instanceof Deno.errors.NotFound ? null : Promise.reject(err));
}

{
  const text = await Deno.readTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/index.ts');
  if (!text.includes('index-node-http')) {
    Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/index.ts',
      text + `\nexport * from './index-node-http';\n`);
  }
}

{
  const text = await Deno.readTextFile('hack/opentelemetry-js/semantic-conventions/src/index.ts');
  if (!text.includes('experimental')) {
    Deno.writeTextFile('hack/opentelemetry-js/semantic-conventions/src/index.ts',
      text + `\nexport * from './experimental_attributes';\nexport * from './experimental_metrics';;\n`);
  }
}

{
  let text = await Deno.readTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/configuration/otlp-http-configuration.ts');
  text = text.replaceAll(/^import type \*/gm, x => `// ${x}`);
  text = text.replaceAll(/^ +.+agentOptions.+$/gm, x => `// ${x}`);
  await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/configuration/otlp-http-configuration.ts', text);
}

{
  let text = await Deno.readTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/configuration/legacy-node-configuration.ts');
  text = text.replaceAll(/^import type \*/gm, x => `// ${x}`);
  text = text.replaceAll(/^ +.+httpAgentOptions.+$/gm, x => `// ${x}`);
  text = text.replaceAll(/^ +.+keepAlive.+$/gm, x => `// ${x}`);
  await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/configuration/legacy-node-configuration.ts', text);
}

// A mix of experimental/packages/otlp-exporter-base/src/transport/http-exporter-transport.ts
// and experimental/packages/otlp-exporter-base/src/transport/http-transport-utils.ts
// but implemented with standard fetch() instead.
// Wow so clean and portable :)
// And that gzip support, wowie
await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/transport/http-exporter-transport.ts', `
import { OtlpHttpConfiguration } from '../configuration/otlp-http-configuration';
import { ExportResponse } from '../export-response';
import { IExporterTransport } from '../exporter-transport';
import { isExportRetryable, parseRetryAfterToMills } from '../is-export-retryable';
import { OTLPExporterError } from '../types';

class HttpExporterTransport implements IExporterTransport {
  constructor(private _parameters: OtlpHttpConfiguration) {}

  async send(data: Uint8Array, timeoutMillis: number): Promise<ExportResponse> {
    const headers = new Headers(this._parameters.headers());
    //@ts-ignore TODO: Remove after experimental/v0.58.0 upgrades typescript to >=4.9.5
    let body = ReadableStream.from([data]);
    if (this._parameters.compression == 'gzip') {
      headers.set('content-encoding', 'gzip');
      //@ts-ignore TODO: Remove after typescript is happy with CompressionStream
      body = body.pipeThrough(new CompressionStream('gzip'));
    }
    return await fetch(this._parameters.url, {
      method: 'POST',
      body, headers,
      //@ts-ignore TODO: Remove after experimental/v0.58.0 upgrades typescript to >=4.9.5
      signal: AbortSignal.timeout(timeoutMillis),
    }).then<ExportResponse>(async res => {
      if (res.ok) {
        const data = new Uint8Array(await res.arrayBuffer());
        return { status: 'success', data };
      }
      if (isExportRetryable(res.status)) {
        const retryInMillis = parseRetryAfterToMills(res.headers.get('retry-after'));
        return { status: 'retryable', retryInMillis };
      }
      const error = new OTLPExporterError(res.statusText, res.status, await res.text());
      return { status: 'failure', error };
    }).catch(error => ({ status: 'failure', error }));
  }
  shutdown() {}
}
export function createHttpExporterTransport(parameters: OtlpHttpConfiguration): IExporterTransport {
  return new HttpExporterTransport(parameters);
}
`);

{ // Reverse targetted import for specific http client
  const json = JSON.parse(await Deno.readTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/package.json'));
  if (!json['exports']['./node-http']) throw new Error(`expected node-http export is missing`);
  json['exports']['.']['module'] = json['exports']['.']['esnext'];
  json['exports']['./node-http'] = json['exports']['.'];
  await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/package.json', JSON.stringify(json, null, 2));
}

// tsconfig doesn't allow module/target overrides in build mode, so we patch
await Deno.writeTextFile('hack/opentelemetry-js/tsconfig.base.esnext.json',
  await Deno.readTextFile('hack/opentelemetry-js/tsconfig.base.esnext.json').then(text => text
    .replace('esnext', 'es2020') // module
    .replace('es2017', 'es2021'))); // target
await Deno.writeTextFile('hack/opentelemetry-js/tsconfig.base.json',
  await Deno.readTextFile('hack/opentelemetry-js/tsconfig.base.json').then(text => text
    .replace('es2017', 'es2021'))); // target

// from upstream tsconfig.esnext.json
const packagePaths = [
  "api",
  "semantic-conventions",
  "packages/opentelemetry-core",
  "packages/opentelemetry-propagator-b3",
  "packages/opentelemetry-propagator-jaeger",
  "packages/opentelemetry-resources",
  "packages/opentelemetry-sdk-trace-base",
  "packages/sdk-metrics",
  "experimental/packages/api-events",
  "experimental/packages/api-logs",
  "experimental/packages/exporter-logs-otlp-http",
  // "experimental/packages/exporter-logs-otlp-proto",
  "experimental/packages/exporter-trace-otlp-http",
  // "experimental/packages/exporter-trace-otlp-proto",
  "experimental/packages/opentelemetry-exporter-metrics-otlp-http",
  // "experimental/packages/opentelemetry-exporter-metrics-otlp-proto",
  "experimental/packages/opentelemetry-instrumentation",
  "experimental/packages/otlp-exporter-base",
  // "experimental/packages/otlp-proto-exporter-base",
  "experimental/packages/otlp-transformer",
  "experimental/packages/sdk-logs",
]

console.error(`Writing new tsconfig...`);
// create tsconfig project with the subset of modules we care about
await Deno.writeTextFile('hack/opentelemetry-js/tsconfig.esnext.deno.json', JSON.stringify({
  "extends": "./tsconfig.base.esnext.json",
  "files": [],
  "references": packagePaths.map(x => ({
    "path": `${x}/tsconfig.esnext.json`,
  })),
}, null, 2));

console.error(`Running npm install...`);
{
  const result = await new Deno.Command('npm', {
    args: [
      'install',
      // '--production',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
    ],
    cwd: 'hack/opentelemetry-js',
    stdout: 'inherit',
    stderr: 'inherit',
  }).output();
  if (!result.success) throw new Error(`npm failed on hack/opentelemetry-js`);
}

console.error(`Adding version.ts to each package...`);
for (const mod of packagePaths) {
  const path = `hack/opentelemetry-js/${mod}`;
  const {
    version,
  } = JSON.parse(await Deno.readTextFile(path+'/package.json'));
  await Deno.writeTextFile(path+'/src/version.ts', `export const VERSION = ${JSON.stringify(version)};`);
}

console.error(`Running tsc build...`);
{
  const tsc = new Deno.Command('node_modules/.bin/tsc', {
    args: [ '--build', 'tsconfig.esnext.deno.json' ],
    cwd: 'hack/opentelemetry-js',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  const tscOut = await tsc.output();
  if (!tscOut.success) throw new Error(`TSC failed :(`);
}

console.error(`Bundling packages with rollup...`);
for (const mod of packagePaths) {
  const path = `hack/opentelemetry-js/${mod}`;

  const {
    name,
    dependencies,
    peerDependencies,
  } = JSON.parse(await Deno.readTextFile(path+'/package.json'));
  const modName = name.split('/')[1];
  console.error('  Bundling', name);

  await buildModuleWithRollup(path, modName, [
    ...Object.keys(dependencies ?? {}),
    ...Object.keys(peerDependencies ?? {}),
    '@opentelemetry/otlp-exporter-base/node-http',
  ]);

}
console.error('Bundled', packagePaths.length, 'packages.');
console.error();
