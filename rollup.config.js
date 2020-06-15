import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';

export default [
  // browser-friendly UMD build
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
      babel({
        babelHelpers: 'bundled',
        exclude: ['node_modules/**'],
      }),
      resolve(),
      commonjs(),
    ],
  },
];
