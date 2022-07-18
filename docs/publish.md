# 发布到 NPM

因为我们的项目是使用 `independent` 的方式组织 `muti-packgae`，所以每个包都有单独的版本号，默认使用 `lerna publish` 发布包，我们需要根据包的修改内容选择合适的版本号。**对于没有变动的 `package`，lerna 发布的时候不会算在本次发布的内容里面**。

发布的流程分两步：

第一步：将所有要发版的代码合并到 `master`  分支后，先在本地执行 `yarn release:version` 生成各个本次变动的 `package` 的版本后，自动生成 `changelog`，接着 lerna 会生成 `git tag` 并 `push` 到远程。

第二步：上面步骤完成后， `lerna` push `git tag` 到远程的时候会触发我们配置的 `git action`，走完正常的发版 `action`，具体看 [`action` 配置]('./../.github/workflows/release.yml') 。

因为目前我们还在开发当中，所以为了更加方便发版到 `npm` 进行测试，目前，项目中集成了以下 `release` 的 `script command`：

## 正常发布一个版本

```bash
yarn release:publish
```

## 发布指定的 dist-tag 版本

发布一个 `experimental` [dist-tag](https://docs.npmjs.com/cli/v7/commands/npm-dist-tag) 的版本：

```bash
yarn release:publish:experimental
```

发布一个 `next` [dist-tag](https://docs.npmjs.com/cli/v7/commands/npm-dist-tag) 的版本：

```bash
yarn release:next
```

## 发布 canary 版本

发布一个 `canary` 版本：
```bash
# 1.0.0 => 1.0.1-alpha.0+${SHA} of packages changed since the previous commit
lerna publish --canary
```

