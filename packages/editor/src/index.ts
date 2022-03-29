/**
 * @description editor entry
 * @author wangfupeng
 */

import './assets/index.less'
import '@wangeditor/core/dist/css/style.css'

// 兼容性（要放在最开始就执行）
import './utils/browser-polyfill'
import './utils/node-polyfill'

// 配置多语言
import './locale/index'

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
  // 第三方模块 - 接口
  IModuleConf,
  IButtonMenu,
  ISelectMenu,
  IDropPanelMenu,
  IModalMenu,
  // 第三方模块 - 多语言
  i18nChangeLanguage,
  i18nAddResources,
  i18nGetResources,
  t,
  // 第三方模块 - modal 中用到的 API
  genModalTextareaElems,
  genModalInputElems,
  genModalButtonElems,
  // 第三方模块 - 上传时用到
  createUploader,
  IUploadConfig,
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
