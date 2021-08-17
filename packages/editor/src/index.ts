/**
 * @description editor entry
 * @author wangfupeng
 */

import './assets/index.less'
import '@wangeditor/core/dist/css/style.css'

// 配置多语言
import './locale/index'

// 兼容浏览器
import './utils/browser-polyfill'
// 兼容 node 环境
import './utils/node-polyfill'
// 注册内置模块
import './register-builtin-modules/index'
// 初始化默认配置
import './init-default-config'

// 全局注册
import Boot from './Boot'
export { Boot }

// 导出 core API 和接口（注意，此处按需导出，不可直接用 `*` ）
export {
  DomEditor,
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
  Toolbar,
  i18nChangeLanguage,
} from '@wangeditor/core'

// 导出 slate API 和接口 （需重命名，加 `Slate` 前缀）
export {
  Transforms as SlateTransforms,
  Descendant as SlateDescendant,
  Editor as SlateEditor,
  Node as SlateNode,
  Element as SlateElement,
  Text as SlateText,
  Path as SlatePath,
  Range as SlateRange,
  Location as SlateLocation,
  Point as SlatePoint,
} from 'slate'

// 导出 create 函数
export { createEditor, createToolbar } from './create'

export default {}
