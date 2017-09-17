# 常用 API

## 属性

- 获取编辑器的唯一标识 `editor.id`
- 获取编辑区域 DOM 节点 `editor.$textElem[0]`
- 获取菜单栏 DOM 节点 `editor.$toolbarElem[0]`
- 获取编辑器配置信息 `editor.config`
- 获取编辑区域 DOM 节点 ID `editor.textElemId`
- 获取菜单栏 DOM 节点 ID `editor.toolbarElemId`
- 获取菜单栏中“图片”菜单的 DOM 节点 ID `editor.imgMenuId`

## 方法

### 选取操作

- 获取选中的文字 `editor.selection.getSelectionText()`
- 获取选取所在的 DOM 节点 `editor.selection.getSelectionContainerElem()[0]`
    - 开始节点 `editor.selection.getSelectionStartElem()[0]`
    - 结束节点 `editor.selection.getSelectionEndElem()[0]`
- 折叠选取 `editor.selection.collapseRange()`
- 更多可参见[源码中](https://github.com/wangfupeng1988/wangEditor/blob/master/src/js/selection/index.js)定义的方法

### 编辑内容操作

- 插入 HTML `editor.do.cmd('insertHTML', '<p>...</p>')`
- 可通过`editor.do.cmd(name, value)`来执行`document.execCommand(name, false, value)`的操作