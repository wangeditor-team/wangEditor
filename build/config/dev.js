/**
 * @description rollup dev config
 * @author wangfupeng
 */

import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import commonConfig from './common'

const { input, output = {}, plugins = [], external } = commonConfig

export default {
  input,
  output,
  external,
  plugins: [
    ...plugins,

    postcss({
      plugins: [autoprefixer()],
      extract: 'css/style.css',
    }),
  ],
}
