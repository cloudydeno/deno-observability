#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=. --allow-env --allow-sys --allow-ffi

import { rollup, Plugin } from 'npm:rollup@4.17.2';
import { nodeResolve } from 'npm:@rollup/plugin-node-resolve@15.2.3';
import commonjs from 'npm:@rollup/plugin-commonjs@25.0.7';
import sourcemaps from 'npm:rollup-plugin-sourcemaps@0.6.3';
import cleanup from 'npm:rollup-plugin-cleanup@3.2.1';
import dts from 'npm:rollup-plugin-dts@4.2.3';

async function buildModuleWithRollup(directory: string, modName: string, external: string[]) {

  const mainFile = await Deno.readTextFile(directory+'/build/esnext/index.js');
  const licenseComment = mainFile.startsWith('/*') ? mainFile.slice(0, mainFile.indexOf('*/')+3) : '';

  const bundle = await rollup({
    input: directory+'/build/esnext/index.js',
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
    input: directory+'/build/esnext/index.d.ts',
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
    text = text.replace(`(process.env)`, `(Deno.env.toObject())`);
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
    text = text.replaceAll(/^  +/gm, x => '\t\t\t\t\t\t\t\t'.slice(0, Math.floor(x.length / 4)));

    await Deno.writeTextFile('opentelemetry/'+chunk.fileName, text);
  }
}

console.error(`Patching opentelemetry-js installation to remove NodeJSisms...`);

await new Deno.Command('rm', {
  args: ['-rf', 'experimental/packages/opentelemetry-exporter-metrics-otlp-http/src/platform'],
  cwd: 'hack/opentelemetry-js',
  stdout: 'inherit',
  stderr: 'inherit',
}).output();

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

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/platform/node/machine-id/getMachineId.ts',
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

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/platform/node/machine-id/execAsync.ts',
`export async function execAsync(command: string) {
  const [cmd, ...args] = command.replaceAll('"', '').split(' ');
  // @ts-expect-error TODO: Deno types in tsc
  const output = await new Deno.Command(cmd, {
    args,
    stdout: 'piped',
  }).output();
  if (!output.success) throw new Error(\`\${cmd} exited with code \${output.code}\`);
  return { stdout: new TextDecoder().decode(output.stdout) };
}
`);

// TODO: maybe put a deno impl in there?
await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/src/platform/index.ts', 'export {};');
await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/opentelemetry-exporter-metrics-otlp-http/src/platform.ts', 'export {};');
await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/opentelemetry-instrumentation/src/platform/index.ts', `export * from './browser';`);

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/node/RandomIdGenerator.ts',
  await Deno.readTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/browser/RandomIdGenerator.ts'));
await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/node/hex-to-base64.ts',
  await Deno.readTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/browser/hex-to-base64.ts'));
await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-sdk-trace-base/src/platform/node/RandomIdGenerator.ts',
  await Deno.readTextFile('hack/opentelemetry-js/packages/opentelemetry-sdk-trace-base/src/platform/browser/RandomIdGenerator.ts'));

// TODO: does dynamic require crap
await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/platform/node/machine-id/getMachineId.ts',
  await Deno.readTextFile('hack/opentelemetry-js/packages/opentelemetry-resources/src/platform/node/machine-id/getMachineId-linux.ts'));

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
  // "packages/opentelemetry-context-zone",
  // "packages/opentelemetry-context-zone-peer-dep",
  "packages/opentelemetry-core",
  // "packages/opentelemetry-exporter-zipkin",
  "packages/opentelemetry-propagator-b3",
  "packages/opentelemetry-propagator-jaeger",
  "packages/opentelemetry-resources",
  "packages/opentelemetry-sdk-trace-base",
  // "packages/opentelemetry-sdk-trace-web",
  "packages/opentelemetry-semantic-conventions",
  // "packages/propagator-aws-xray",
  "packages/sdk-metrics",
  "experimental/packages/api-events",
  "experimental/packages/api-logs",
  // "experimental/packages/exporter-logs-otlp-http",
  // "experimental/packages/exporter-logs-otlp-proto",
  // "experimental/packages/exporter-trace-otlp-http",
  // "experimental/packages/exporter-trace-otlp-proto",
  // "experimental/packages/opentelemetry-browser-detector",
  "experimental/packages/opentelemetry-exporter-metrics-otlp-http",
  // "experimental/packages/opentelemetry-exporter-metrics-otlp-proto",
  "experimental/packages/opentelemetry-instrumentation",
  // "experimental/packages/opentelemetry-instrumentation-fetch",
  // "experimental/packages/opentelemetry-instrumentation-xml-http-request",
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
  const npm = new Deno.Command('npm', {
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
  });
  const npmOut = await npm.output();
  if (!npmOut.success) throw new Error(`npm failed on hack/opentelemetry-js`);
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
  ]);

}
console.error('Bundled', packagePaths.length, 'packages.');
console.error();
