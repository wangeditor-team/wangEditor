/**
 * @description webpack 配置，生产环境
 * @author wangfupeng
 */

// const path = require('path')
const { smart } = require('webpack-merge')
const CommonConf = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { distPath } = require('./myPath')

module.exports = smart(CommonConf, {
    mode: 'production',
    output: {
        filename: 'wangEditor.min.js',
        path: distPath,
        library: 'wangEditor',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    plugins: [new CleanWebpackPlugin()],
})
