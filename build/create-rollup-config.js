/**
 * @description 创建 rollup 配置
 * @author wangfupeng
 */

import { merge } from 'lodash'
import { visualizer } from 'rollup-plugin-visualizer'
import devConf from './config/dev'
import prdConf from './config/prd'

// 环境变量
const ENV = process.env.NODE_ENV || 'production'
export const IS_PRD = ENV.indexOf('production') >= 0
const IS_SIZE_STATS = ENV.indexOf('size_stats') >= 0

/**
 * 生成单个 rollup 配置
 * @param {object} customConfig { input, output, plugins ... }
 */
export function createRollupConfig(customConfig = {}) {
  const { input, output = {}, plugins = [] } = customConfig

  let baseConfig
  if (IS_PRD) {
    baseConfig = prdConf
  } else {
    baseConfig = devConf
  }

  if (IS_SIZE_STATS) {
    // 分析包体积。运行之后可查看 package 下的 `stats.html`
    plugins.push(visualizer())
  }

  const config = {
    input: input ? input : baseConfig.input,
    output,
    plugins,
  }

  return merge({}, baseConfig, config)
}
