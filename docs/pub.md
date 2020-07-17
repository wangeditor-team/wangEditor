# 发布到 npm

把已合并的代码发布到 npm 。

## 合并代码到 master

创建 Pull Request ，将 dev 分支合并到 master 分支。

## 升级版本并提交 tag

### 升级三级版本

如将 `1.1.1` 升级为 `1.1.2`。一般用于 bug 修复，功能补全，小改动。

本地运行 `sh ./build/up-version.sh`，即可升级版本并提交 tag

### 升级二级版本

如将 `1.1.1` 升级为 `1.2.1`。一般用于增加新功能，新模块。

本地运行 `sh ./build/up-version.sh minor`，即可升级版本并提交 tag

### 升级一级版本

如将 `1.1.1` 升级为 `2.1.1`。一般用于项目全面升级、重构，大改动。

本地运行 `sh ./build/up-version.sh major`，即可升级版本并提交 tag

## 发布到 npm

提交 tag 会触发 github actions ，自动发布到 npm 。

待 actions 执行完成，只要没有报错，即表示发布完成。

## 回归测试

### 自动流程

github actions 在发布完 npm 之后，会自动安装最新版，并打包出一个测试页 http://106.55.153.217:8881/publish-npm-test/ 用于回归测试。

PS：配置代码见 `.github/workflows/npm-publish.yml`

### 手动测试

可下载测试 demo `git clone git@github.com:wangeditor-team/we-demo.git` ，安装最新的包，本地运行。
