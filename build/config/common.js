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
import cleanup from 'rollup-plugin-cleanup'

export default {
  input: path.resolve(__dirname, './src/index.ts'),
  output: {
    // 属性有 file format name sourcemap 等
  },
  plugins: [
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
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    cleanup({
      comments: 'none',
      extensions: ['.ts', '.tsx'],
    }),
  ],
}
