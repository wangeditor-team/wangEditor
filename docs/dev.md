# 开发规范

所有的项目开发人员，都需要遵守以下开发规范，不得私定标准，不得跳过任何步骤。

这个文档没有一句废话，请各位开发人员详细阅读，并确定完全理解。如有疑问请一定联系作者。

## 前言

该项目用 github 管理代码。如果你对 git 和 github 了解不多，请务必先去学习并熟悉。否则会给你接下来的工作带来很大阻碍。

可以通过以下问题来确定自己是否熟悉，确定熟悉了再继续往下看。

- git 常见命令有哪些？
- git 如何通过分支多人协作开发？
- github 的 ssh key 有何作用？
- github Pull Request 是什么，自己是否亲自操作过？

## 下载代码

`git clone` 下载本项目代码，`master` 分支即可

进入项目目录，修改 git 配置，写上自己 github 的账号和邮箱。这一步很重要！！！否则 commit 不知道谁提交的。

```sh
git config user.name xxx
git config user.email xxx@xxx.com
```

## 运行代码

```sh
npm install
npm run start
# 浏览器访问 http://localhost:8881/examples/index.html
```

## 创建分支

开发新功能或者修复 bug 之前，要用**最新**的 dev 分支代码，拉新的分支，然后进行开发。git 分支命名规范如下：

- `master` 主干分支，当前正在运行的代码。**不可**直接往 `master` 提交代码。
- `dev` 开发分支，当前正在开发、但尚未发布的代码。**不可**直接往 `dev` 提交代码，但可以合并其他分支。
- `feature-xxx` 开发新功能
- `fix-xxx` bug 修复
- `hotfix-xxx` 高优紧急 bug 修复，修复完需紧急上线
- `doc-xxx` 仅修改文档，不修改代码

例如你要开发一个图片上传的功能，可以根据 master 分支拉一个新的分支 `git checkout -b feature-upload-img`

切忌遵守以上规范，不可乱来！！！

## 开发

开发代码需要注意以下事情：

- 编码规范，具体可查看 `.eslintrc.js`
- 符合 jsdoc 规范的注释（不了解 jsdoc 的先去查一查）
- 编写单元测试，即 `test` 目录下的测试代码
- 编写文档，看是否要修改开发文档和使用文档。

写完代码之后，一定要进行自测：

- 运行 `npm run test` 进行单元测试
- 运行 `npm start` 打开页面，进行功能测试
    - 自己的功能正常
    - 其他功能不影响

## 提交 commit

请按照一下步骤提交代码，不要怕麻烦

- `git status` 确认修改的文件，都符合预期
- `git diff` 确认修改的内容，都符合预期
- `git add .`
- `git commit -m "xxx"` 提交代码，此时会自动进行 eslint 和 prettier 的检查和修复，请耐心等待

注意，在执行 `git commit` 时，请务必遵守 commit 规范，程序也会强制按照如下格式提交：

- `feat: xxx` 新功能 —— **【注意】请务必谨慎使用 `feat` ，除非真的是新功能，否则不要乱用。不确定的可以群里问一问。**
- `fix: xxx` bug 修复
- `style: xxx` 修改样式
- `docs: xxx` 修改文档
- `refactor: xxx` 重构某个功能
- `test: xxx` 增加或修改测试用例
- `chore: xxx` 修改辅助功能（如 webpack eslint 等）
- `perf: xxx` 性能优化
- `release: xxx` 发布新版本
- `revert: xxx` 回退


例如，你本次 commit 是修复了一个 bug ，那就执行 `git commit -m "fix: 说明本次修改了哪个 bug"`

（PS：有一些工具可以帮助你规范自己的 commit ，如 `commitizen` ）

## 合并 commit

如果当前分支在开发过程中，提交的 commit 太多、太零散，那就需要合并 commit 。否则，发布新版本之后 CHANGELOG.md 会难以阅读！

合并 commit 的操作，如果不了解的话，可以花 10min 看看作者制作的[视频教程](https://www.bilibili.com/video/bv15h411f74h)。

最后再 push 分支到 github 。
## 自动部署远程测试页

说明：只有以 `feature-` `fix-` 和 `hotfix-` 开头的分支，才具有这个功能。

当提交完自己的分支之后，github actions 会自动触发部署到腾讯云测试机。
查看 [actions 列表](https://github.com/wangeditor-team/wangEditor/actions)，待所有任务运行完成之后。
打开浏览器访问 `http://106.12.198.214:8881/<你的分支名>/examples/index.html` ，这就是你本次分支代码的远程测试环境。

要保证这一步成功，再进行下一步。

## 创建 PR（Pull Request）

> 【注意】如果自己不了解或者没用过 github Pull Request ，可以去网上搜一下“github Pull Request”，学习一下，并且在自己的 github 项目上亲自操作一遍。**不要怕麻烦，这是为以后节省时间，否则以后自己麻烦，你导师也得跟着麻烦！！**

登录 github ，进入该项目。创建 Pull Request ，将当前分支合并到 **dev** 分支（不是 master 分支）。此时先不要着急 Merge ，重要！！

然后，一定要自己先看一看 PR 的 **Files Changed** ，看是否符合自己的预期，重要！！如果不符合预期，则把这个 PR 关掉，再重新修改代码，重新提交 PR 。

将 Pull Request 的链接贴到任务卡片中，这样其他人就能看到了。

## 如果 PR 有冲突

例如，你的分支 `feature-xxx` 提交 PR 之后，提示和 dev 分支有冲突。正确的解决步骤是：

- 本地获取最新的 dev 分支代码
- 在 `feature-xxx` 分支执行 `git rebase dev` 。**【注意】一定要用 `rebase` ，而不是 `merge` ！！！**
- 重新 push `feature-xxx` 分支
- 再检查 PR 是否还有冲突

PS：如果 `git rebase` 命令有不了解的，可以看一看这个[视频教程](https://www.bilibili.com/video/BV1Qb411N7ay)。
再遇到问题，一定要及时在群里沟通。

## 剩下的步骤

剩下的步骤，也非常重要，加入团队之后可以从团队知识库中找到说明。

- 交叉测试
- code review

## 非团队人员贡献源码

自己测试，自己 code review，具体参考 [contribution.md](./contribution.md)
