#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=. --allow-env --allow-sys

// pass --refresh-yarn to force rerunning yarn on the opentelemetry packages

import 'npm:@rollup/rollup-linux-x64-gnu@4.17.2';
import { rollup, Plugin } from 'npm:rollup@4.17.2';
import { nodeResolve } from 'npm:@rollup/plugin-node-resolve@15.2.3';
import commonjs from 'npm:@rollup/plugin-commonjs@25.0.7';
import sourcemaps from 'npm:rollup-plugin-sourcemaps@0.6.3';
import cleanup from 'npm:rollup-plugin-cleanup@3.2.1';
import dts from 'npm:rollup-plugin-dts@4.2.3';
// import { terser } from "npm:rollup-plugin-terser";

// import magicString from 'npm:rollup-plugin-magic-string'


// import MagicStringMod from 'npm:magic-string';
// const MagicString = MagicStringMod as unknown as MagicStringMod.default;
// import fs from 'node:fs'
// import path from 'node:path'
// function escape(str: string) {
//     return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
// }
// // Figures out where the correct relative path should
// // based on the output directory and the appendPath
// function rollupOutputDir(opts, appendPath) {
//     let dir = ''
//     if (opts.file) {
//         dir = path.dirname(opts.file)
//     }
//     else if (opts.dir) {
//         dir = path.dirname(opts.dir)
//     }
//     return path.relative(dir, appendPath)
// }

// const patternImport = new RegExp(/import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/, 'mg')
// const rewritePlugin: Plugin = {
//     name: 'rewriteImports',
//     renderChunk(code, info, opts) {
//         // get the location of the output directory
//         const magicString = new MagicString(code);
//         let hasReplacements = false;
//         let match: RegExpMatchArray | null = null;
//         function replaceImport() {
//             let newImport = '';
//             if (match![2].startsWith('@opentelemetry/')) {
//               newImport = match![2].split('/')[1] + '.js';
//             }
//             if (newImport) {
//               hasReplacements = true
//               const start = match!.index!
//               const end = start + match![0].length
//               magicString.overwrite(start, end, newImport)
//             }
//         }
//         while (match = patternImport.exec(code)) {
//           replaceImport()
//         }
//         if (!hasReplacements) return null
//         const result = { code: magicString.toString() }
//         return result
//     }
// };

export async function buildModuleWithRollup(directory: string, modName: string, external: string[]) {

  const mainFile = await Deno.readTextFile(directory+'/build/esnext/index.js');
  const licenseComment = mainFile.startsWith('/*') ? mainFile.slice(0, mainFile.indexOf('*/')+3) : '';

  const bundle = await rollup({
    // input: fromFileUrl(inputUrl),
    input: directory+'/build/esnext/index.js',
    external,
    plugins: [
      sourcemaps(),
      nodeResolve({
        // extensions : [".js",".jsx"],
        // resolveOnly: module => {console.log({module});return true},
      }),
      commonjs(),
      cleanup(),
      // terser(),
      // magicString({
      //   magic(code: string, id, string) {
      //     const patternImport = new RegExp(/import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/, 'mg')
      //     let match: RegExpMatchArray | null = null;
      //     while (match = patternImport.exec(code)) {
      //       let newImport = '';
      //       if (match[2].startsWith('@opentelemetry/')) {
      //         newImport = './' + match[2].split('/')[1] + '.js';
      //       }
      //       if (newImport) {
      //         const start = match.index! + match[0].indexOf(match[2]);
      //         const end = start + match[2].length
      //         string.overwrite(start, end, newImport)
      //       }
      //     }
      //   },
      // }),
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
      // console.log({matchText})
      let match = matchText.match(patternImport);
      if (!match) throw new Error('bug');
      let newImport = '';
      if (match[2].startsWith('@opentelemetry/')) {
        newImport = './' + match[2].split('/')[1] + importExtension;
      } else if (['path', 'os', 'process', 'fs'].includes(match[2])) {
        // newImport = 'node:'+match[2];
        return '';
      } else if (['shimmer'].includes(match[2])) {
        newImport = `https://esm.sh/${match[2]}`;
      } else {
        console.log('Unhandled import:', match[2]);
      }
      if (!newImport) return match[0];
      const start = match.index! + match[0].lastIndexOf(match[2]);
      const end = start + match[2].length
      return match[0].slice(0, start) + newImport + match[0].slice(end);
    });

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

const modules = [
  'hack/opentelemetry-js/api',
  'hack/opentelemetry-js/packages/opentelemetry-core',
  // 'hack/opentelemetry-js/packages/opentelemetry-context-async-hooks',
  // 'hack/opentelemetry-js/packages/opentelemetry-context-zone-peer-dep',
  // 'hack/opentelemetry-js/packages/opentelemetry-context-zone',
  'hack/opentelemetry-js/packages/opentelemetry-semantic-conventions',
  'hack/opentelemetry-js/packages/opentelemetry-resources',
  'hack/opentelemetry-js/packages/opentelemetry-propagator-b3',
  'hack/opentelemetry-js/packages/opentelemetry-sdk-trace-base',
  // 'hack/opentelemetry-js/packages/opentelemetry-sdk-trace-web',
  'hack/opentelemetry-js/packages/sdk-metrics',
  'hack/opentelemetry-js/experimental/packages/api-events',
  'hack/opentelemetry-js/experimental/packages/api-logs',
  'hack/opentelemetry-js/experimental/packages/otlp-exporter-base',
  'hack/opentelemetry-js/experimental/packages/otlp-transformer',
  // 'hack/opentelemetry-js/experimental/packages/exporter-trace-otlp-http',
  // 'hack/opentelemetry-js/experimental/packages/opentelemetry-browser-detector',
  'hack/opentelemetry-js/experimental/packages/opentelemetry-exporter-metrics-otlp-http',
  'hack/opentelemetry-js/experimental/packages/opentelemetry-instrumentation',
  // 'hack/opentelemetry-js/experimental/packages/opentelemetry-instrumentation-fetch',
  // 'hack/opentelemetry-js/experimental/packages/opentelemetry-instrumentation-http',
  // 'hack/opentelemetry-js/experimental/packages/opentelemetry-instrumentation-xml-http-request',
  'hack/opentelemetry-js/experimental/packages/sdk-logs',
];

// use runtime's performance instead of node's
await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/node/performance.ts', 'export const otperformance = performance;');

await Deno.writeTextFile('hack/opentelemetry-js/packages/sdk-metrics/test/index-webpack.ts', '');
await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/otlp-exporter-base/test/browser/index-webpack.ts', '');

await Deno.writeTextFile('hack/opentelemetry-js/packages/opentelemetry-core/src/platform/node/timer-util.ts',
`export function unrefTimer(timer: number): void {
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
await Deno.writeTextFile('hack/opentelemetry-js/experimental/packages/opentelemetry-exporter-metrics-otlp-http/src/platform/index.ts', 'export {};');
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

async function yarnInstall(directory: string) {
  if (!Deno.args.includes('--refresh-yarn')) {
    if (await Deno.stat(directory+'/node_modules').then(() => true, () => false)) return;
  }
  const yarn = new Deno.Command('yarn', {
    args: ['install', /*'--production',*/ '--ignore-scripts'],
    cwd: directory,
    stdout: 'inherit',
    stderr: 'inherit',
  });
  const yarnOut = await yarn.output();
  // if (yarnOut.stdout.byteLength > 0) {
  //   console.log(new TextDecoder().decode(yarnOut.stdout));
  // }
  if (!yarnOut.success) throw new Error(`yarn failed on ${directory}`);
}

await yarnInstall('hack/opentelemetry-js');

// import ts from "npm:typescript";

for (const mod of modules) {
  console.log('---------------')
  console.log(mod);
  console.log();

  const {
    name, version,
    dependencies, peerDependencies,
  } = JSON.parse(await Deno.readTextFile(mod+'/package.json'));
  const modName = name.split('/')[1];
  await Deno.writeTextFile(mod+'/src/version.ts', `export const VERSION = ${JSON.stringify(version)};`);

  await yarnInstall(mod);

  const tsc = new Deno.Command('hack/opentelemetry-js/node_modules/.bin/tsc', {
    args: [
      '--project', mod+'/tsconfig.esnext.json',
      '--target', 'es2021',
      '--module', 'es2020',
      // '--lib', TODO: can we provide deno's lib somehow?
    ],
  });
  const tscOut = await tsc.output();
  console.log(new TextDecoder().decode(tscOut.stdout));
  if (!tscOut.success) throw new Error(`TSC failed on ${mod}`);

  await buildModuleWithRollup(mod, modName, [
    ...Object.keys(dependencies ?? {}),
    ...Object.keys(peerDependencies ?? {}),
  ]);
}
