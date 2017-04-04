const path = require('path')

const koa = require('koa')
const app = koa()

// 捕获错误
const onerror = require('koa-onerror')
onerror(app)

// post body 解析
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 静态文件服务，针对 html js css fonts 文件
const staticCache = require('koa-static-cache')
const exampleDir = path.join(__dirname, '..', '..', 'example')
const releaseDir = path.join(__dirname, '..', '..', 'release')
app.use(staticCache(exampleDir))
app.use(staticCache(releaseDir))

// 配置路由
const router = require('koa-router')()

// 启动服务
app.listen(3000)
console.log('listening on port %s', 3000)

module.exports = app