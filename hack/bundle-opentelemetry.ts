#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=. --allow-env

import { rollup, Plugin } from 'npm:rollup';
import { nodeResolve } from 'npm:@rollup/plugin-node-resolve';
import commonjs from 'npm:@rollup/plugin-commonjs';
import sourcemaps from 'npm:rollup-plugin-sourcemaps';
import cleanup from 'npm:rollup-plugin-cleanup';
import dts from 'npm:rollup-plugin-dts';
// import { terser } from "npm:rollup-plugin-terser";

import magicString from 'npm:rollup-plugin-magic-string'


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

  const tsBundle = await rollup({
    input: directory+'/build/esnext/index.d.ts',
    external,
    plugins: [
      // sourcemaps(), // not obeyed by dts plugin
      dts(),
    ],
  }).then(x => x.generate({
    format: 'es',
    file: `${modName}.d.ts`,
    banner: licenseComment,
    // indent: `\t`,
  }));

  // We write the chunks ourself to put them somewhere else
  for (const chunk of [ ...bundle.output, ...tsBundle.output ]) {

    let text = chunk.type == 'chunk' ? chunk.code : `${chunk.source}`

    const patternImportG = new RegExp(/(?:import|export)(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/, 'mg');
    const patternImport = new RegExp(/(?:import|export)(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/, 'm');
    text = text.replaceAll(patternImportG, matchText => {
      // console.log({matchText})
      let match = matchText.match(patternImport);
      if (!match) throw new Error('bug');
      let newImport = '';
      if (match[2].startsWith('@opentelemetry/')) {
        newImport = './' + match[2].split('/')[1] + '.js';
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
    text = text.replace("import { hostname, arch, platform, release } from 'node:os';",
      `const hostname = () => Deno.hostname?.(), arch = Deno.build.arch, platform = Deno.build.os, release = () => Deno.osRelease();`);
    text = text.replaceAll("declare const enum", "declare enum"); // Cannot access ambient const enums when 'isolatedModules' is enabled.
    text = text.replaceAll(/^  +/gm, x => '\t\t\t\t\t\t\t\t'.slice(0, Math.floor(x.length / 4)));

    await Deno.writeTextFile('opentelemetry/'+chunk.fileName, text);
  }
}

const modules = [
  'hack/opentelemetry-js/api',
  'hack/opentelemetry-js/packages/opentelemetry-core',
  // 'hack/opentelemetry-js/packages/opentelemetry-context-async-hooks',
  'hack/opentelemetry-js/packages/opentelemetry-context-zone-peer-dep',
  'hack/opentelemetry-js/packages/opentelemetry-context-zone',
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
  'hack/opentelemetry-js/experimental/packages/exporter-trace-otlp-http',
  'hack/opentelemetry-js/experimental/packages/opentelemetry-browser-detector',
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
  //@ts-expect-error TODO: deno types in tsc
  Deno.unrefTimer?.(timer);
}`);

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
  if (await Deno.stat(directory+'/node_modules').then(() => true, () => false)) return;
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



// // Deno.cw
//   const jsonText = await Deno.readTextFile(mod+'/tsconfig.esnext.json');
//   const parsed = ts.parseConfigFileTextToJson('tsconfig.esnext.json', jsonText);
//   // const tsconfig = JSON.parse(await Deno.readTextFile(mod+'/tsconfig.esnext.json'));
//   // const tscConfig = ts.parseJsonConfigFileContent(tsconfig, ts.sys, 'hack', undefined, `${mod}/tsconfig.esnext.json`.slice(5));
//   const tscConfig = ts.parseJsonConfigFileContent(parsed.config, {
//     useCaseSensitiveFileNames: false,
//     readDirectory: function(rootDir: string,extensions: readonly string[],excludes: readonly string[]|undefined,includes: readonly string[],depth?: number|undefined): readonly string[] {
//       console.log({rootDir, extensions, excludes, includes, depth})
//       const res = ts.sys.readDirectory(mod, extensions, excludes, includes, depth);
//       console.log({res})
//       return res;
//     },
//     fileExists: function(path: string): boolean {
//       console.log({path})
//       return ts.sys.fileExists(mod+'/'+path);
//     },
//     readFile: function(path: string): string|undefined {
//       console.log({path})
//       return ts.sys.readFile(mod+'/'+path);
//     }
//   }, '', undefined, `tsconfig.esnext.json`);
//   console.log(mod, tscConfig.fileNames);
//   const program = ts.createProgram(tscConfig.fileNames.filter(filename => {
//     if (filename.includes('/test/')) return false;
//     return true;
//   }), tscConfig.options);
//   const emitResult = program.emit();

//   let allDiagnostics = ts
//     .getPreEmitDiagnostics(program)
//     .concat(emitResult.diagnostics);

//   allDiagnostics.forEach(diagnostic => {
//     if (diagnostic.file) {
//       let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
//       let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
//       console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
//     } else {
//       // console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
//     }
//   });

//   let exitCode = emitResult.emitSkipped ? 1 : 0;
//   console.log(`tsc exited with code '${exitCode}'.`);

//   throw new Error('tod')



  const tsc = new Deno.Command('hack/opentelemetry-js/node_modules/.bin/tsc', {
    args: ['--build', mod+'/tsconfig.esnext.json'],
  });// --build tsconfig.json tsconfig.esm.json tsconfig.esnext.json')
  const tscOut = await tsc.output();
  console.log(new TextDecoder().decode(tscOut.stdout));
  if (!tscOut.success) throw new Error(`TSC failed on ${mod}`);

  await buildModuleWithRollup(mod, modName, [
    ...Object.keys(dependencies ?? {}),
    ...Object.keys(peerDependencies ?? {}),
  ]);
}
