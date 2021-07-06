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
import { merge } from 'lodash'

import commonConfig from './common'

const prdConfig = {
  output: {
    sourcemap: true,
  },
  plugins: [
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
  ],
}

export default merge({}, commonConfig, prdConfig)
