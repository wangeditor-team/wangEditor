/**
 * @description pm2 app 配置信息
 */

// const os = require('os')
// const cpuCoreLength = os.cpus().length // CPU 几核

module.exports = {
    apps: [
        {
            name: 'wangEditor-server',
            script: 'server/www.js',
            watch: false,
            // ignore_watch: ['node_modules', 'test', 'logs'],
            // instances: cpuCoreLength,
            instances: 1, // 一个实例，方便排错
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // Z 表示使用当前时区的时间格式
        },
    ],
}
