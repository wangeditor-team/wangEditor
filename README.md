# we-2021

## 准备工作

- 了解 slate.js
- 了解 vdom 和 snabbdom.js
- 了解 lerna
- 已安装 yarn

## 本地启动

### 打包

- 下载代码到本地，进入 `we-2021` 目录
- 安装所有依赖 `yarn bootstrap`
- 打包所有模块 `yarn dev` 或者 `yarn build`

PS：也可以单独进入 `packages/xxx` 目录，单独运行 `yarn dev` 或者 `yarn build`

### 运行 demo

- 进入 `packages/editor` 目录，运行 `yarn example`
- 进入 `packages/editor-for-vue` 目录，运行 `yarn example`
- 进入 `packages/editor-for-react` 目录，运行 `yarn example`

## 注意事项

- 修改代码、重新打包后，要**强制刷新**浏览器
- 如果本地包依赖有问题，试试 `lerna link` 关联内部包

## 发布到测试机

先临时用 `scp` 拷贝，后续修改为自动化发布

- 进入 `we-2021` 目录
- 执行 `yarn dev` 打包
- 执行 `yarn scp-demo` 拷贝到测试机（管理员才有权限）
- 访问 `http://106.12.198.214:8882/editor/examples/index.html`

## 记录

全局安装一个插件 `yarn add xxx --dev -W`

注意合理使用 `peerDependencies` 和 `dependencies` ，不要重复打包一个第三方库

执行 `lerna add ...` 之后，需要重新 `lerna link` 建立内部连接

分析包体积
- 命令行，进入某个 package ，如 `cd packages/editor`
- 执行 `yarn size-stats` ，等待执行完成
- 结果会记录在 `packages/editor/stats.html` 用浏览器打开

## 发布到 NPM
因为我们的项目是使用 `independent` 的方式组织 `muti-packgae`，所以每个包都有单独的版本号，默认使用 `lerna publish` 发布包，我们需要根据包的修改内容选择合适的版本号。**对于没有变动的 `package`，lerna 发布的时候不会算在本次发布的内容里面**。

发布的流程分两步：

第一步：将所有要发版的代码合并到 `main`  分支后，先在本地执行 `yarn release:version` 生成各个本次变动的 `package` 的版本后，生成 `changelog` ，**目前先暂时禁用了生成 `changelog` 流程**。然后 lerna 会走到 `prompts` 选择版本的命令行交互流程，选完各个包的版本后，lerna 会生成 `git tag` 并 `push` 到远程。

第二步：上面步骤完成后， `lerna` push `git tag` 到远程的时候会触发我们配置的 `git action`，走完正常的发版 `action`，具体看 [`action` 配置]('./../.github/workflows/release.yml') 。

因为目前我们还在开发当中，所以为了更加方便发版到 `npm` 进行测试，目前，项目中集成了以下 `release` 的 `script command`：
### 正常发布一个版本
```bash
yarn release:publish
```

### 发布指定的 dist-tag 版本
发布一个 `experimental` [dist-tag](https://docs.npmjs.com/cli/v7/commands/npm-dist-tag) 的版本：

```bash
yarn release:publish:experimental
```

发布一个 `next` [dist-tag](https://docs.npmjs.com/cli/v7/commands/npm-dist-tag) 的版本：

```bash
yarn release:next
```

### 发布 canary 版本
发布一个 `canary` 版本：
```bash
# 1.0.0 => 1.0.1-alpha.0+${SHA} of packages changed since the previous commit
lerna publish --canary
```