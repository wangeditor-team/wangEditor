# 发布到 npm

发布项目要有节奏，每周定期发布。除非遇到紧急 bug ，需紧急应对。

## 技术方案

- release-it 发布 tag 和 ChangeLog
- github actions 监控 tag 提交，自动发布到 npm

### release-it

`v4.1.0` 版本开始，采用 [release-it](https://github.com/release-it/release-it) 来执行发布操作。
不过，release-it 仅仅用来创建 tag 并 push ，真正 publish 到 npm 是在 github actions 中实现的，代码见 `.github/workflows/npm-publish.yml` 。

### set upstream

切换到 master 分支，执行 `git branch --set-upstream-to=origin/master master`

## 明确发布的范围

打开以下页面，分别找到“待发布”的任务

- bugs https://github.com/wangeditor-team/wangEditor/projects/1
- feature https://www.teambition.com/project/5eb8b4e2ce8c00002237bb81/tasks/view/all

要确定这些任务的 pr ，都已经被合并到了 `dev` 分支。否则，终止发布，联系任务负责人确认。

## 合并代码

到 https://github.com/wangeditor-team/wangEditor/pulls 创建 pr ，分别将以下分支，合并到 `master` 分支。

- `dev`
- `feature-third-contribution` （其他人贡献的代码，会合并到这里）

然后，等待 master 分支的 [github actions](https://github.com/wangeditor-team/wangEditor/actions) 执行完成，主要 jest 和 cypress 测试的流程。

## 触发 release

本地执行 `npm run release` 。主要进行如下步骤（配置见 `.release-it.js`）

- 必须是 master 分支
- 首先 `git pull origin master`
- 然后 `npm run all-check`
- 创建 tag 并 push （它会自动推荐 tag 的版本号，我们默认用即可）

## release 注意事项

**【注意1】选择版本时，一定要慎重！！！** 日常的小改动，选择 `patch` 版本。
如果要选择 `minor` 甚至 `major` 版本，请一定与作者联系确定！！！

**【注意2】千万不要随意执行 `npm run release` ！！！**
如果想要体验一下发布过程，可执行 `npm run just-try-release` ，这个随便玩。

## 发布到 npm

提交 tag 会触发 [github actions](https://github.com/wangeditor-team/wangEditor/actions?query=workflow%3A%22npm-publish+and+test%22) ，自动发布到 npm 。

待 github actions 执行完成，只要没有报错，即表示发布完成。

## 合并代码到开发分支

提交 pr ，把 master 的代码合并到以下分支，以便接接下来开发。

- `dev`
- `feature-third-contribution`

## 回归测试

发布完成之后，访问 http://106.12.198.214:8881/publish-npm-test/ 即可得到最新版本的 demo 。

## 修改任务状态

将任务列表中，“待发布”的任务，拖拽到“已发布”阶段。并通知任务负责人。

如果修改的是 issue ，则回复“已修复，请更新到最新版本”，并关闭。

## 看是否需要修改文档

刚刚已发布的任务，如果是新增的功能或者配置，可能需要修改用户文档。
和任务负责人确认一下，如果需要，则尽快修改文档。

【注意】必须先发布功能，再修改文档。顺序不能反了。
