# wangEditor (v5 公测中...)

[English README](./README-en.md)

开源 Web 富文本编辑器，开箱即用，配置简单

- [用户文档](https://www.wangeditor.com/v5/)
- [demo 演示](https://www.wangeditor.com/demo/zh-CN/)
- [开发文档 & 加入研发团队](./docs/README.md)

![](./docs/images/editor.png)

## 使用

```js
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, createToolbar } from '@wangeditor/editor'

// 创建编辑器
const editor = createEditor({
  selector: '#editor-container'
})
// 创建工具栏
const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container'
})
```

## 兼容性

- 兼容主流的 PC 浏览器，如 Chrome Firefox Safari Edge 等
- 暂不支持移动端（后续支持～）
- **不再支持 IE 浏览器**

## 交流

- 加入 QQ 群 `681464059`
- [提交问题和建议](https://github.com/wangeditor-team/wangEditor-v5/issues)
