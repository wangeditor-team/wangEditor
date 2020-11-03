/**
 * @description webpack 配置，生产环境
 * @author wangfupeng
 */

const { smart } = require('webpack-merge')
const CommonConf = require('./webpack.common')
const { distPath } = require('./myPath')

module.exports = smart(CommonConf, {
    mode: 'production',
    output: {
        filename: '[name].js',
        path: distPath,
        library: 'wangEditor',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    // plugins: [new CleanWebpackPlugin()], // 一定要注释掉，否则会将 min js 文件清空掉 ！！！
    devtool: 'source-map',
    optimization: {
        minimize: false, // 非压缩
    },
})
