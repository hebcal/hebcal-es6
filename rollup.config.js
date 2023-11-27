import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import MANIFEST from './package.json' assert { type: 'json' };
const {name, version, main, module} = MANIFEST;

const banner = `/*! ${name} v${version} */`;

const TARGET_NODE_VER = '16.0.0';
const TARGETS_BROWSER = {
  chrome: '103',
  firefox: '91',
  edge: '84',
  safari: '15.6',
};

export default [
  {
    input: 'src/index.js',
    output: [
      {file: main, format: 'cjs', name, banner,
        inlineDynamicImports: true,
        globals: {
          'temporal-polyfill': 'Temporal',
        },
      },
    ],
    plugins: [
      json({compact: true, preferConst: true}),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              node: TARGET_NODE_VER,
            },
          }],
        ],
        exclude: ['node_modules/**'],
      }),
      nodeResolve(),
      commonjs(),
    ],
    external: ['temporal-polyfill'],
  },
  {
    input: 'src/index.js',
    output: [
      {file: module, format: 'es', name, banner,
        inlineDynamicImports: true,
        globals: {
          'temporal-polyfill': 'Temporal',
        },
      },
    ],
    plugins: [
      json({compact: true, preferConst: true}),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              node: TARGET_NODE_VER,
            },
          }],
        ],
        exclude: ['node_modules/**'],
      }),
      nodeResolve(),
      commonjs(),
    ],
    external: ['temporal-polyfill'],
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'hebcal',
        indent: false,
        banner,
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
        inlineDynamicImports: true,
        globals: {
          'temporal-polyfill': 'Temporal',
        },
      },
    ],
    plugins: [
      json({compact: true, preferConst: true}),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: TARGETS_BROWSER,
            useBuiltIns: 'usage',
            corejs: 3,
          }],
        ],
        exclude: ['node_modules/core-js/**'],
      }),
    ],
    external: ['temporal-polyfill'],
  },
];
