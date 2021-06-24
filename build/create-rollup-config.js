/**
 * @description 创建 rollup 配置
 * @author wangfupeng
 */

import path from 'path'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
// import { visualizer } from 'rollup-plugin-visualizer'
import devConf from './config/dev'
import prdConf from './config/prd'

const ENV = process.env.NODE_ENV || 'production'

/**
 * 生成单个 rollup 配置
 * @param {object} customConfig { input, output, plugins ... }
 */
function genSingleConfig(customConfig = {}) {
  const { input, output = {}, plugins = [] } = customConfig

  let config
  if (ENV === 'production') {
    config = prdConf
  } else {
    config = devConf
  }

  const insertedPlugins = []
  if (output.format !== 'iife') {
    // 打包结果不包含 peerDependencies （ 但 iife 格式不能用 ）
    insertedPlugins.push(peerDepsExternal())
  }

  return {
    input: input ? input : config.input,
    output: {
      ...config.output,
      ...output,
    },
    plugins: [...insertedPlugins, ...config.plugins, ...plugins],
  }
}

/**
 * 生成 rollup 配置
 * @param {string} distDir dist dir
 * @param {string} name output.name
 * @param {Array} plugins rollup plugins
 */
function createRollupConfig(distDir, name, plugins = []) {
  const configList = []

  // 生成 umd 格式，对应 package.json main
  const umdConf = genSingleConfig({
    // input - 默认为 src/index.ts
    output: {
      file: path.resolve(distDir, 'index.js'),
      format: 'umd',
      name,
    },
    plugins,
  })
  configList.push(umdConf)

  // 生成 esm 格式，对应 package.json module
  const esmConf = genSingleConfig({
    // input - 默认为 src/index.ts
    output: {
      file: path.resolve(distDir, 'index.mjs'), // mjs 格式
      format: 'esm',
      name,
    },
    plugins,
  })
  configList.push(esmConf)

  return configList
}

export default createRollupConfig
