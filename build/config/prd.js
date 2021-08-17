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
import { extensions } from './common'

const { input, output = {}, plugins = [], external } = commonConfig
const isBuildForTest = process.env.ENV_TYPE === 'test'

const finalPlugins = [
  ...plugins,
  babel({
    rootMode: 'upward',
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
    extensions,
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
]

// 发布包的时候需要用到 package.json 文件，但是单元测试添加后报错，所以需要特殊处理下
if (!isBuildForTest) {
  plugins.push(
    copy({
      targets: [
        { src: path.resolve(__dirname, './package.json'), dest: 'dist' },
        { src: path.resolve(__dirname, './README.md'), dest: 'dist' },
      ],
    })
  )
}

export default {
  input,
  output: {
    sourcemap: true,
    ...output,
  },
  external,
  plugins: finalPlugins,
}
