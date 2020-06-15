import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: [
      {file: pkg.main, format: 'cjs', name: pkg.name},
      {file: 'dist/bundle.js', format: 'umd', name: 'hebcal__core'},
      {
        file: 'dist/bundle.min.js',
        format: 'umd',
        name: 'hebcal__core',
        plugins: [terser()],
      },
    ],
    plugins: [
      json({compact: true}),
      babel({
        babelHelpers: 'bundled',
        exclude: ['node_modules/**'],
      }),
      resolve(),
      commonjs(),
    ],
  },
];
