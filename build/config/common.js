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

export default {
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
      // 声明加载 node_module package 时默认使用 package.json 的 main 属性指定的文件
      // 之前加载 es module，默认不会被处理，导致最后生成的代码有箭头函数
      mainFields: isProd ? ['main'] : ['module', 'main'],
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
