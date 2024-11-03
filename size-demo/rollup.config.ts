import prettyBytes from 'pretty-bytes';
import {defineConfig, OutputChunk, Plugin, RollupOptions} from 'rollup';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import bundleSize from 'rollup-plugin-bundle-size';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {appendFileSync, readdirSync, writeFileSync} from 'fs';
import {basename} from 'path';
import {visualizer} from 'rollup-plugin-visualizer';

const TARGETS_BROWSER = {
  chrome: '103',
  firefox: '91',
  edge: '84',
  safari: '15.6',
};

const sizeFile = './size-demo/sizes.md';
writeFileSync(sizeFile, '# Bundle sizes\n\n');

export default defineConfig(
  readdirSync('./size-demo')
    .filter(f => f.endsWith('.ts'))
    .filter(f => !f.endsWith('.d.ts') && !f.endsWith('.config.ts'))
    .map((file): RollupOptions => {
      const name = basename(file, '.ts');
      return {
        input: `size-demo/${name}.ts`,
        output: [
          {
            file: `size-demo/dist/${name}.mjs`,
            format: 'es',
            inlineDynamicImports: true,
          },
          {
            file: `size-demo/dist/${name}.min.mjs`,
            format: 'es',
            inlineDynamicImports: true,
            plugins: [terser()],
          },
        ],

        plugins: [
          typescript({tsconfig: './size-demo/tsconfig.json'}),
          json({compact: true, preferConst: true}),
          nodeResolve(),
          commonjs(),
          bundleSize(),
          {
            name: 'record-size-to-file',
            generateBundle(options, bundle) {
              const asset = basename(options.file!);
              const result = bundle[asset] as OutputChunk;
              appendFileSync(
                sizeFile,
                `- \`${asset}\`: ${prettyBytes(result.code.length)}\n`
              );
            },
          } satisfies Plugin,
          visualizer({filename: `size-demo/dist/${name}.stats.html`}),
        ],
      };
    })
);
