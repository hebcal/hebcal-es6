const {nodeResolve} = require('@rollup/plugin-node-resolve');
const bundleSize = require('rollup-plugin-bundle-size');
const json = require('@rollup/plugin-json');
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

module.exports = defineConfig([
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'es',
      banner,
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    plugins: [
      typescript({outDir: 'dist/esm', rootDir: './src'}),
      json({compact: true, preferConst: true}),
      nodeResolve(),
    ],
    external: [/node_modules/],
  },
  // Standalone JS file for use without bundlers. Avoid if possible.
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
      },
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'hebcal',
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      // target es2021 (broader browser support) and no .d.ts for the bundle
      typescript({rootDir: './src', target: 'es2021', declaration: false}),
      nodeResolve(),
      json({compact: true, preferConst: true}),
      bundleSize(),
    ],
  },
]);
