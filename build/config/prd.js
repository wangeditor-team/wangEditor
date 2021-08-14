/**
 * @description rollup prd config
 * @author wangfupeng
 */

import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
import commonConfig from './common'
import copy from 'rollup-plugin-copy'
import path from 'path'

const { input, output = {}, plugins = [], external } = commonConfig

export default {
  input,
  output: {
    sourcemap: true,
    ...output,
  },
  external,
  plugins: [
    ...plugins,

    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    postcss({
      plugins: [
        autoprefixer(),
        cssnano(), // 压缩 css
      ],
      extract: 'css/style.css',
    }),
    cleanup({
      comments: 'none',
      extensions: ['.ts', '.tsx'],
    }),
    terser(), // 压缩 js
    copy({
      targets: [
        { src: path.resolve(__dirname, './package.json'), dest: 'dist' },
        { src: path.resolve(__dirname, './README.md'), dest: 'dist' },
      ],
    }),
  ],
}
