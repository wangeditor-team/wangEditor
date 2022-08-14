# 开发

## 准备工作

- 了解 slate.js
- 了解 vdom 和 snabbdom.js
- 了解 lerna
- 已安装 yarn

## 本地启动

### 打包

- 下载代码到本地，进入 `wangEditor` 目录
- 安装所有依赖 `yarn bootstrap`
- 打包所有模块 `yarn dev` 或者 `yarn build`

### 运行 demo

- 进入 `packages/editor` 目录，运行 `yarn example` ，浏览器打开 `http://localhost:8881/examples/`

## 注意事项

- 修改代码、重新打包后，要**强制刷新**浏览器
- 如果本地包依赖有问题，试试 `lerna link` 关联内部包

## 记录

全局安装一个插件 `yarn add xxx --dev -W`

注意合理使用 `peerDependencies` 和 `dependencies` ，不要重复打包一个第三方库

执行 `lerna add ...` 之后，需要重新 `lerna link` 建立内部连接

分析包体积
- 命令行，进入某个 package ，如 `cd packages/editor`
- 执行 `yarn size-stats` ，等待执行完成
- 结果会记录在 `packages/editor/stats.html` 用浏览器打开