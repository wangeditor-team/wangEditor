import path from 'path'
import cleanup from 'rollup-plugin-cleanup'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const env = process.env.NODE_ENV || 'production'

function genSingleConfig(distDir, options) {
  const { name = 'index', format, suffix = 'js', plugins = [] } = options

  return {
    input: path.resolve(__dirname, './src/index.ts'),
    output: {
      file: path.resolve(distDir, `${name}.${suffix}`),
      format,
      name,
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(), // 打包结果不包含 peerDependencies
      json({
        compact: true,
        indent: '  ',
        preferConst: true,
      }),
      typescript({
        clean: true,
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
      }),
      resolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
        preventAssignment: true,
      }),
      commonjs(),
      cleanup({
        comments: 'none',
        extensions: ['.ts'],
      }),
      postcss({
        plugins: [autoprefixer(), cssnano()],
        // extract: 'css/index.css',
      }),
      ...plugins,
    ],
  }
}

/**
 * 获取默认的 rollup 配置
 * @param {string} distDir dirt dir
 */
export default function createDefaultRollupConfig(distDir) {
  // 开发环境下
  let conf = [genSingleConfig(distDir, { format: 'umd' })]

  // 非开发环境下
  if (env !== 'development') {
    conf = [
      genSingleConfig(distDir, { format: 'umd', plugins: [terser()] }),
      genSingleConfig(distDir, {
        name: 'index.module',
        format: 'es',
        suffix: 'mjs',
      }),
    ]
  }

  return conf
}
