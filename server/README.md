# 服务端

提供文件上传接口，用于测试。

## 开发环境

`npm start` 时会启动 server ，并且依赖于 koa2-static 来启动 examples 页面的静态服务。

## 测试环境

### 发布到测试机

代码 push 到 `server` 分支，即可自动发布到测试机。

具体可参考 `.github/workflows/server.yml` 。

### 测试机配置

nginx 需要配置，做反向代理，参考测试机 `/etc/nginx/nginx.conf`
- 代理接口 `/api/`
- 代理图片 url `/server/upload-files/`

定时删除文件，配置 crontab 定时执行 `server/rm.sh`
