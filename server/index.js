/**
 * @description 服务端
 * @author wangfupeng
 */

const path = require('path')
const Koa = require('koa')
const app = new Koa()
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const koaStatic = require('koa-static')

// error handler
onerror(app)

app.use(logger())
const staticPath = path.join(__dirname, '..')
app.use(koaStatic(staticPath))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

module.exports = app
