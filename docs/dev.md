# 开发规范

所有的项目开发人员，都需要遵守以下开发规范，不得私定标准，不得跳过任何步骤。

这个文档没有一句废话，请各位开发人员详细阅读，并确定完全理解。如有疑问请一定联系作者。

## 加入项目研发小组

请联系作者，提供自己的 github 账号，加入项目开发小组。否则接下来的步骤无法正常进行。

## 下载代码

`git clone` 下载本项目代码，`master` 分支即可

进入项目目录，修改 git 配置，写上自己 github 的账号和邮箱。这一步很重要，否则 commit 不知道谁提交的。

```sh
git config user.name xxx
git config user.email xxx@xxx.com
```

## 运行代码

打开两个控制台，进入项目目录，分别运行 `npm run dev` 和 `npm run example` ，然后浏览器访问 `http://127.0.0.1:8881/examples/` 即可。

## 创建分支

开发新功能或者修复 bug 之前，要用**最新**的 master 分支代码，拉新的分支，然后进行开发。git 分支命名规范如下：

- `master` 主干分支，当前正在运行的代码。**不可**直接往 `master` 提交代码。
- `dev` 开发分支，当前正在开发、但尚未发布的代码。**不可**直接往 `dev` 提交代码，但可以合并其他分支。
- `feature-xxx` 开发新功能
- `fix-xxx` bug 修复

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
- 功能测试
    - 自己的功能正常
    - 其他功能不影响

## 提交代码到自己的分支

请按照一下步骤提交代码，不要怕麻烦

- `git status` 确认修改的文件，都符合预期
- `git diff` 确认修改的内容，都符合预期
- `git add .`
- `git commit -m "xxx"` 提交代码，此时会自动进行 eslint 和 prettier 的检查和修复，请耐心等待

注意，在执行 `git commit` 之前，**请务必遵守 commit 规范**。

- `feat: xxx` 新功能
- `fix: xxx` bug 修复
- `style: xxx` 修改样式
- `docs: xxx` 修改文档
- `refactor: xxx` 重构某个功能
- `test: xxx` 增加或修改测试用例
- `chore: xxx` 修改辅助功能（如 webpack eslint 等）

例如，你本次 commit 是修复了一个 bug ，那就执行 `git commit -m "fix: 说明本次修改了哪个 bug"`

（PS：有一些工具可以帮助你规范自己的 commit ，如 `commitizen` ）

最后再 push 分支到 github 。

## 代码走查

登录 github ，进入该项目。创建 Pull Request ，将当前分支合并到 dev 分支。**【注意】先不要着急 Merge Pull Request** ！！！

把 Pull Request 的链接，贴到任务卡片（参考 [任务管理](./task.md)）的备注或者评论中，并通知作者进行代码走查。

代码走查会重点关注：

- 代码逻辑是否合理
- 代码注释是否规范且合理
- 单元测试，用例是否完整
- 开发文档，使用文档，是否齐全

代码走查如果有问题，会在 Pull Request 上回复评论意见。开发者根据评论意见，继续修改，然后重新提交，重新代码走查。

## 合并代码到 dev 分支

代码走查没有问题，可以进行 Merge Pull Request 合并到 dev 分支。

如果合并出现冲突，开发者需要重新修改代码，重新提交 Pull Request 。

成功合并了 dev 分支之后，确保 [actions](https://github.com/wangeditor-team/we-next/actions) 的任务能执行通过。如果 actions 任务有问题，要查看日志，解决问题。
