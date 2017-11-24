# 问题记录

## 版本修复

### v3.0.1 

- [done] 如何设置自动增加高度（补充文档）
- [done] src/js/editor/Bar 改为 Progress，仅供上传图片使用
- [done] Panel 在右上角增加一个“关闭”按钮
- [done] 显示页面 table、quote、code 等样式，说明一下
- [done] 增加自定义上传回调函数，用以自定义返回图片的格式
- [done] 上传附带的参数，也加入到 form-data 中一份
- [done] 编辑器默认情况下，菜单栏不能点击，必须focus了编辑器求之后才能点击
- [done] 点击菜单弹出panel之后，再点击编辑器区域其他地方，panel不消失
- [done] 自定义filename，v2版本就有
- [done] ff 中的 bug
- [done] ff 中粘贴图片和文字出现问题 https://github.com/wangfupeng1988/wangEditor/issues/609
- [done] 火狐浏览器下，创建表格，编辑表格内容时，会出现两个控制点（有人提供了解决方案）
- [done] 配置最多上传的文件个数
- [done] 连续给两段内容 添加有/无序列表时，样式会出问题，且其他内容找不到了，并且编辑器不处于编辑状态。
- [done] onchange
- [done] IE11下面一直报错。并且表格无法正常使用

### v3.0.2

- [done] 用 onchange 完善 vue react 的 demo
- [done] 插入图片之后，光标移动到图片的前面，然后回车，图片消失，并且不能撤销
- [done] 修复上传图片 customInsert 无效的bug
- [done] 编辑区域 z-index 可配置
- [done] 上传图片不应该把状态码限制在 200，而是 2xx
- [done] editor.txt.html() 之后，没有定位光标位置

### v3.0.3

- [done] 粘贴图片在低版本的谷歌浏览器中无法使用，提示验证图片未通过，undefined不是图片。
- [done] 动态赋值内容，会自动换行，因为给自动加了`<p><br></p>`
- [done] 不选中任何内容，点击“加粗”报错：Failed to execute 'setEnd' on 'Range' 
- [done] toolbar 小图标的 z-index 可配置

### v3.0.4

- [done] 允许使用者通过`replace`实现多语言
- [done] `_alert()`，可自定义配置提示框
- [done] 支持用户自定义上传图片的事件，如用户要上传到七牛云、阿里云

### v3.0.5

- [done] 图片上传中，insertLinkImg 方法中，去掉 img.onload 之后再插入的逻辑吧，这样会打乱多个图片的顺序
- [done] `<h>` 标签重叠问题，两行文字都是`h2`，然后将第一行选中设置为`h1`，结果是 `<h2><h1>测试1</h1>测试2</h2>`
- [done] 补充 ng 集成的示例 https://github.com/wangfupeng1988/wangEditor/issues/859
- [done] 菜单不能折叠的说明，加入到文档中
- [done] 上传图片 before 函数中，增加一个判断，可以让用户终止图片的上传

### v3.0.6

- [done] src/fonts 中的字体文件名改一下，用 icomoon 容易发生冲突
- [done] 将禁用编辑器的操作完善到文档中 https://www.kancloud.cn/wangfupeng/wangeditor3/368562
- [done] 开放表格中的粘贴功能（之前因不明问题而封闭）
- [done] 代码块中，光标定位到最后位置时，连续两次回车要跳出代码块

### v3.0.7

- [done] 紧急修复上一个版本导致的菜单图标不显示的 bug

### v3.0.8

- [done] 修复 backColor 和 foreColor 代码文件名混淆的问题
- [done] 修改 IE 中 “引用” 的功能
- [done] 增加粘贴过滤样式的可配置
- [done] 修复 IE 粘贴文字的问题

### v3.0.9

- [done] config 中，上传图片的 token 注视掉
- [done] 将一些常见 API 开放，写到文档中 https://www.kancloud.cn/wangfupeng/wangeditor3/404586
- [done] IE 火狐 插入多行代码有问题
- [done] 粘贴时，在`<p>`中，不能只粘贴纯文本，还得要图片 
- [done] 粘贴内容中，过滤掉`<!--xxx-->`注释
- [done] **支持上传七牛云存储**

### v3.0.10

- [done] 支持插入网络图片的回调函数
- [done] 插入链接时候的格式校验
- [done] 支持拖拽上传

### v3.0.11

- [done] 如何用 textarea 创建编辑器，完善到文档中，许多人提问
- [done] 修复`editor.customConfig.customUploadImg`不触发的 bug
- [done] 修复有序列表和无序列表切换时 onchange 不触发的 bug

### v3.0.12

- [done] 增加 onfocus 和 onblur （感谢 [hold-baby](https://github.com/hold-baby) 提交的 [PR](https://github.com/wangfupeng1988/wangEditor/pull/1076)）
- [done] 上传的自定义参数`editor.customConfig.uploadImgParams`是否拼接到 url 中，支持可配置
- [done] onchange 触发的延迟时间，支持可配置

### v3.0.13

- [done] 修复图片 选中/取消选中 时，触发 onchange 的问题
- [done] 修复只通过 length 判断 onchange 是否触发的问题
- [done] 增加插入网络图片的校验函数
- [done] 增加自定义处理粘贴文本的事件
- [done] 修复选中一个图片时点击删除键会误删除其他内容的 bug 
- [done] 修复 window chrome 中“复制图片”然后粘贴图片，会粘贴为两张的 bug 
- [done] 修复无法撤销“引用”的问题

### v3.0.14

- [done] 可以配置前景色、背景色
- [done] 回车时无法从`<p><code>....</code></p>`中跳出
- [done] 增加获取 JSON 格式内容的 API

### v3.0.15

- [done] 表情兼容图片和 emoji ，都可自定义配置

### 近期计划解决

- 撤销的兼容性问题（会误伤其他编辑器或者 input textarea 等），考虑用 onchange 记录 undo 和 redo 的内容（但是得考虑直接修改 dom 的情况，如 quote code img list table 菜单）
    - 列表撤销会删除一行？https://github.com/wangfupeng1988/wangEditor/issues/1131
    - 页面中有 input 等输入标签时，undo redo 会误伤 https://github.com/wangfupeng1988/wangEditor/issues/1024
    - 两个编辑器 undo 的问题 https://github.com/wangfupeng1988/wangEditor/issues/1010
    - list undo redo 有问题。选中几行，先设置有序列表，再设置无序列表，然后撤销，就能复现问题
- 粘贴文字的样式问题（可暂时配置 `pasteTextHandle` 自行处理）
    - 先输入文字，再粘贴 excel 表格，样式丢失 https://github.com/wangfupeng1988/wangEditor/issues/1000
    - IE 11 直接输入文字会空一行在第二行出现内容 https://github.com/wangfupeng1988/wangEditor/issues/919
    - windows 下 word excel 的粘贴，存在垃圾数据

## 待排期

- 调研 safari、IE 和ff中粘贴图片  https://github.com/wangfupeng1988/wangEditor/issues/831
- 图片调整大小，表格调整的方式，是否用 toolbar 的方式？
- 删除掉`./release`之后，执行`npm run release`会报错，原因是`fonts`文件没拷贝全，就要去替换`css`中的字体文件为`base64`格式，导致找不到文件。
- 先点击'B'再输入内容这种形式，前期先支持 webkit 和 IE，火狐的支持后面再加上
- 图片压缩 canvas https://github.com/think2011/localResizeIMG 
- github 徽章 https://github.com/EyreFree/GitHubBadgeIntroduction
- 将代码在进行拆分，做到“每个程序只做一件事”，不要出现过长的代码文件。例如 `src/js/command/index.js` 和 `src/js/selection/index.js`

