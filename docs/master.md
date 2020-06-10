# 发布到 npm

把当前的代码发布到 npm 。

## 合并代码到 master

本地获取最新的 master 分支代码，获取最新的 dev 分支代码。

合并 dev 分支代码到 master 分支，然后 push master 分支代码。

（以上步骤也可以通过 Pull Request 实现，但要保证本地 master 代码时最新的！！！）

## 升级版本并提交 tag

```sh
git pull origin master # 确保本地是最新的 master 分支代码

npm version major|minor|patch # 升级 npm 版本并自动生成 git tag 。【注意】major|minor|patch 三选一

git push origin --tags # 提交 tag 到 github
```

解释一下 `major|minor|patch` 的区别。例如当前版本是 `1.2.3`

- `major` 将版本升级到 `2.2.3` ，即重构大版本的升级
- `minor` 将版本升级到 `1.3.3` ，当前版本的主要功能升级
- `patch` 将版本升级到 `1.2.4` ，小版本升级，bug 修复，增加非重要功能

## 发布到 npm

提交 tag 会触发 github actions ，自动发布到 npm 。

待 actions 执行完成，只要没有报错，即表示发布完成。

## 回归测试

在本地安装最新版本的 npm 包，测试有没有问题。
