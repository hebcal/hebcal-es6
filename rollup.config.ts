import {defineConfig} from 'rollup';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import bundleSize from 'rollup-plugin-bundle-size';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {dts} from 'rollup-plugin-dts';
import pkg from './package.json' with {type: 'json'};
const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

const TARGET_NODE_VER = '16.0.0';
const TARGETS_BROWSER = {
  chrome: '103',
  firefox: '91',
  edge: '84',
  safari: '15.6',
};

export default defineConfig([
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
]);
