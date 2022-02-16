/**
 * @description rollup common config
 * @author wangfupeng
 */

import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
// import del from 'rollup-plugin-delete'

export const extensions = ['.js', '.jsx', '.ts', '.tsx']
const isProd = process.env.NODE_ENV === 'production'

/**
 * 生成 common conf
 * @param {string} format 'umd' 'esm'
 * @returns common conf
 */
function genCommonConf(format) {
  return {
    input: path.resolve(__dirname, './src/index.ts'),
    output: {
      // 属性有 file format name sourcemap 等
      // https://www.rollupjs.com/guide/big-list-of-options
    },
    plugins: [
      peerDepsExternal(), // 打包结果不包含 package.json 的 peerDependencies
      json({
        compact: true,
        indent: '  ',
        preferConst: true,
      }),
      typescript({
        clean: true,
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
      }),
      nodeResolve({
        browser: true, // 重要
        mainFields: format === 'esm' ? ['module', 'main'] : ['main'],
        extensions,
      }),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true,
      }),
      // del({ targets: 'dist/*' }),
    ],
  }
}

export default genCommonConf
