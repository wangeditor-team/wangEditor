# 发布到 npm

## 技术方案

`v4.1.0` 版本开始，采用 [release-it](https://github.com/release-it/release-it) 来执行发布操作。
不过，release-it 仅仅用来创建 tag 并 push ，真正 publish 到 npm 是在 github actions 中实现的，代码见 `.github/workflows/npm-publish.yml` 。

## set upstream

切换到 master 分支，执行 `git branch --set-upstream-to=origin/master master`

## 触发 release

执行 `npm run release` 。主要进行如下步骤（配置见 `.release-it.js`）

- 必须是 master 分支
- 首先 `git pull origin master`
- 然后 `npm run all-check`
- 创建 tag 并 push （它会自动推荐 tag 的版本号，我们默认用即可）

**【注意】千万不要随意执行 `npm run release` ！！！**

如果想要体验一下发布过程，可执行 `npm run just-try-release` ，这个随便玩。

## 发布到 npm

提交 tag 会触发 [github actions](https://github.com/wangeditor-team/wangEditor/actions?query=workflow%3A%22npm-publish+and+test%22) ，自动发布到 npm 。

待 github actions 执行完成，只要没有报错，即表示发布完成。

## 回归测试

### 自动流程

github actions 在发布完 npm 之后，会自动安装最新版，并打包出一个测试页 http://106.55.153.217:8881/publish-npm-test/ 用于回归测试。

PS：配置代码见 `.github/workflows/npm-publish.yml`

### 手动测试

可下载测试 demo `git clone git@github.com:wangeditor-team/we-demo.git` ，安装最新的包，本地运行。

## 合并代码到 dev

发布完成之后，将 master 代码合并到 dev 分支，并提交。
以便后续开发 merge 时，代码更简洁。
