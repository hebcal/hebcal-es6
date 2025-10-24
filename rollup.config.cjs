const {nodeResolve} = require('@rollup/plugin-node-resolve');
const bundleSize = require('rollup-plugin-bundle-size');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');
const {defineConfig} = require('rollup');

const banner =
  '/*! ' +
  pkg.name +
  ' v' +
  pkg.version +
  ', distributed under GPLv2 https://www.gnu.org/licenses/gpl-2.0.txt */';

// Override tsconfig.json, which includes ./size-demo.
const tsOptions = {rootDir: './src'};
module.exports = defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'es',
        name: pkg.name,
        banner,
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        globals: {
          'temporal-polyfill': 'Temporal',
        },
      },
    ],
    plugins: [
      typescript({
        outDir: 'dist/esm',
        rootDir: './src',
      }),
      nodeResolve(),
    ],
    external: [/node_modules/],
  },
  // Standalone JS file for use without bundlers.
  // Avoid if possible.
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'hebcal',
        indent: false,
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
        globals: {
          'temporal-polyfill': 'Temporal',
        },
      },
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'hebcal',

        plugins: [terser()],
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
        globals: {
          'temporal-polyfill': 'Temporal',
        },
      },
    ],
    plugins: [typescript(tsOptions), nodeResolve(), bundleSize()],
  },
]);
