/**
 * @description rollup prd config
 * @author wangfupeng
 */

import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { terser } from 'rollup-plugin-terser'

import commonConfig from './common'

export default {
  input: commonConfig.input,
  output: {
    ...commonConfig.output,
    sourcemap: true,
  },
  plugins: [
    ...commonConfig.plugins,
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
    terser(), // 压缩 js
  ],
}
