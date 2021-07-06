/**
 * @description rollup dev config
 * @author wangfupeng
 */

import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import { merge } from 'lodash'

import commonConfig from './common'

const devConfig = {
  plugins: [
    postcss({
      plugins: [autoprefixer()],
      extract: 'css/style.css',
    }),
  ],
}

const config = merge({}, commonConfig, devConfig)

export default config
