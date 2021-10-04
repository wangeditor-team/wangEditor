# wangEditor (v5)

[中文介绍](./README.md)

Open source web rich text editor, run right out of the box.

- [Document](https://www.wangeditor.com/v5/en/)
- [Demo](https://www.wangeditor.com/demo/en/)

![](./docs/images/editor-en.png)

## Usage

```js
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, createToolbar } from '@wangeditor/editor'

// Create editor
const editor = createEditor({
  selector: '#editor-container'
})
// Create toolbar
const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container'
})
```

## Compatibility

- Support most PC browsers, like Chrome, Firefox, Safari, Edge
- Not support mobile browsers at the moment
- **No longer support IE browser**

## Communication

- [Commit an issue](https://github.com/wangeditor-team/wangEditor-v5/issues)
