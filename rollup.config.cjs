const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const bundleSize = require('rollup-plugin-bundle-size');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const {dts} = require('rollup-plugin-dts');
const pkg = require('./package.json');
const {defineConfig} = require('rollup');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

const TARGET_NODE_VER = '16.0.0';
const TARGETS_BROWSER = {
  chrome: '103',
  firefox: '91',
  edge: '84',
  safari: '15.6',
};

// Override tsconfig.json, which includes ./size-demo.
const tsOptions = {rootDir: './src'};
module.exports = defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        name: pkg.name,
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
        globals: {
          'temporal-polyfill': 'Temporal',
        },
      },
    ],
    plugins: [
      typescript(tsOptions),
      json({compact: true, preferConst: true}),
      babel({
        babelHelpers: 'runtime',
        plugins: ['@babel/plugin-transform-runtime'],
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                node: TARGET_NODE_VER,
              },
            },
          ],
        ],
        exclude: ['node_modules/**'],
      }),
      nodeResolve(),
      commonjs(),
      bundleSize(),
    ],
    external: [/node_modules/],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/es',
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
        outDir: 'dist/es',
        rootDir: './src',
      }),
      json({compact: true, preferConst: true}),
      babel({
        babelHelpers: 'runtime',
        plugins: ['@babel/plugin-transform-runtime'],
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                node: TARGET_NODE_VER,
              },
            },
          ],
        ],
        exclude: ['node_modules/**'],
      }),
      nodeResolve(),
      commonjs(),
    ],
    external: [/node_modules/],
  },
  {
    input: 'dist/es/index.d.ts',
    output: [{file: 'dist/module.d.ts', format: 'es'}],
    external: ['node:fs'],
    plugins: [dts()],
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
    plugins: [
      typescript(tsOptions),
      json({compact: true, preferConst: true}),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: TARGETS_BROWSER,
              useBuiltIns: 'usage',
              corejs: 3,
            },
          ],
        ],
        exclude: ['node_modules/core-js/**'],
      }),
      bundleSize(),
    ],
  },
]);
