const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const bundleSize = require('rollup-plugin-bundle-size');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const {dts} = require('rollup-plugin-dts');
const pkg = require('./package.json');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

const TARGET_NODE_VER = '16.0.0';
const TARGETS_BROWSER = {
  chrome: '103',
  firefox: '91',
  edge: '84',
  safari: '15.6',
};

module.exports = [
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
      typescript(),
      json({compact: true, preferConst: true}),
      babel({
        babelHelpers: 'bundled',
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
    // external: ['temporal-polyfill'],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'es',
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
      typescript(),
      json({compact: true, preferConst: true}),
      babel({
        babelHelpers: 'bundled',
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
    // external: ['temporal-polyfill'],
  },
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

        plugins: [terser(), bundleSize()],
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
        globals: {
          'temporal-polyfill': 'Temporal',
        },
      },
    ],
    plugins: [
      typescript(),
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
    // external: ['temporal-polyfill'],
  },
  {
    input: 'dist/index.d.ts',
    output: [{file: 'dist/module.d.ts', format: 'es'}],
    plugins: [dts()],
  },
];
