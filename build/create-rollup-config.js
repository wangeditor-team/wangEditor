/**
 * @description 创建 rollup 配置
 * @author wangfupeng
 */

import path from 'path'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { visualizer } from 'rollup-plugin-visualizer'
import devConf from './config/dev'
import prdConf from './config/prd'

// 环境变量
const ENV = process.env.NODE_ENV || 'production'
const IS_PRD = ENV === 'production'
const IS_SIZE_STATS = ENV === 'size_stats'

/**
 * 生成单个 rollup 配置
 * @param {object} customConfig { input, output, plugins ... }
 */
function genSingleConfig(customConfig = {}) {
  const { input, output = {}, plugins = [] } = customConfig

  let config
  if (IS_PRD) {
    config = prdConf
  } else {
    config = devConf
  }

  const insertedPlugins = []
  if (output.format !== 'iife') {
    // 打包结果不包含 peerDependencies （ 但 iife 格式不能用 ）
    insertedPlugins.push(peerDepsExternal())
  }
  if (IS_SIZE_STATS) {
    // 分析包体积。运行之后可查看 package 下的 `stats.html`
    insertedPlugins.push(visualizer())
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
 * @param {object} opt { distDir, name, plugins, outputUmdOnDev }
 */
function createRollupConfig(opt = {}) {
  const { distDir, name, plugins = [], outputUmdOnDev = false } = opt
  if (!distDir || !name) {
    throw new Error(`Cannot find 'distDir' or 'name' when create rollup config`)
  }

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

  // 返回结果
  if (IS_PRD) {
    // 生产环境下，全部输出
    return [esmConf, umdConf]
  } else {
    // 开发环境，只输出一个即可，提高打包速度
    if (outputUmdOnDev) {
      // 强制输出 umd —— 某些 package 打包之后需要在浏览器中引用，如 packages/editor
      return umdConf
    }
    // 默认输出 esm —— rollup 引用，默认只需要 mjs （对应 package.json module ）
    return esmConf
  }
}

export default createRollupConfig
