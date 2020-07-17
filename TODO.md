# Todo

## 项目和模块

- 官网，使用 github pages
- 文档，使用 gitbook
- 用于 React
- 用于 Vue

## 待开发功能

### 菜单

- 格式刷
- 分割线
- 行高（参考语雀）
- 支持可配置的 `font-size`
- 表格
- 撤销，重做
- 待办事项（参考语雀）
- 全屏
- 查看/修改 源码
- 上传附件
- 查找替换
- 数学公式

### 编辑区域

- 图片相关
    - 拖拽上传图片
    - 点击图片 tooltip
    - 拖拽调整图片大小
    - 粘贴图片、粘贴截图
- 表格相关（看表格菜单做完之后的效果，再定）

### 配置项

- 多语言 `i18n`
    - dropList
    - panel
- 链接校验，图片 url 校验
- 整理菜单顺序，菜单的 key（按文档来）（顺带将 `FontSizeType` 替换为 `DicType`）

### API

- 销毁（用于 Vue 或 React 组件 willUnMount 生命周期）

### 其他

- 上传图片到云存储

## 遗留问题

- v3 记录的，但未解决的问题 https://github.com/wangfupeng1988/wangEditor/blob/master/ISSUE.md#%E8%BF%91%E6%9C%9F%E8%AE%A1%E5%88%92%E8%A7%A3%E5%86%B3
- v3 github issues https://github.com/wangfupeng1988/wangEditor/issues
- 处理 v3 PR https://github.com/wangfupeng1988/wangEditor/pulls

## 待整理总结

引入 ts 之后，多了类型，DOM 操作中常用的类型

- Event MouseEvent KeyboardEvent 等类型 https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
- Node Element HtmlElement 等类型
