# 问题记录

统一整理 public protected private   

`text/index.ts` 代码角度，需要拆分
- 获取 json 还没做
- `_bindEvent` 还没写完

`text/index.ts` 设置钩子：把事件处理，分散到各个 menu 中，不在 text 中统一处理了
- 回车时处理 code ，还没做
- drop 时上传图片，还没做
- 粘贴事件（普通文字、code、td、图片）
- tab 处理
- img 点击

`utils/paste.ts` 中，`getPasteHtml` 还没有实现。这个需要整改一下，用 parseHtml 做过滤。

`DropList.ts` 中，替换多语言，还没写
`Panel.ts` 中，替换多语言，还没写
`editor/init-fns/init-config.ts` 多语言

`menus/links/create-panel-conf.ts` 中 `insertLink` ，检查链接格式，还没写

点击编辑区域的空白处，光标没有 focus 到编辑区域中（ `examples/division.html` 中 ）

文件上传还没写 `init-fns/init-upload.ts`
