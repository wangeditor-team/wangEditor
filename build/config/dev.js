/**
 * @description rollup dev config
 * @author wangfupeng
 */

import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'

import commonConfig from './common'

export default {
  input: commonConfig.input,
  output: commonConfig.output,
  plugins: [
    ...commonConfig.plugins,
    postcss({
      plugins: [autoprefixer()],
      extract: 'css/style.css',
    }),
  ],
}
