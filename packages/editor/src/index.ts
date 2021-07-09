/**
 * @description editor entry
 * @author wangfupeng
 */

import './assets/index.less'
import '@wangeditor/core/dist/css/style.css'

// basic-modules
import '@wangeditor/basic-modules/dist/css/style.css'
import basicModules from '@wangeditor/basic-modules'

// list-module
import '@wangeditor/list-module/dist/css/style.css'
import wangEditorListModule from '@wangeditor/list-module'

// table-module
import '@wangeditor/table-module/dist/css/style.css'
import wangEditorTableModule from '@wangeditor/table-module'

// video-module
import '@wangeditor/video-module/dist/css/style.css'
import wangEditorVideoModule from '@wangeditor/video-module'

// upload-image-module
import '@wangeditor/upload-image-module/dist/css/style.css'
import wangEditorUploadImageModule from '@wangeditor/upload-image-module'

// code-highlight
import '@wangeditor/code-highlight/dist/css/style.css'
import {
  wangEditorCodeHighlightModule,
  wangEditorCodeHighLightDecorate,
} from '@wangeditor/code-highlight'

// 默认配置
import { getDefaultEditorConfig, genDefaultToolbarConfig } from './config'

import wangEditor from './wangEditorClass'

import registerModule from './register-module'

// 注册 basic-modules ，及其他 module
basicModules.forEach(module => registerModule(module))
registerModule(wangEditorListModule)
registerModule(wangEditorTableModule)
registerModule(wangEditorVideoModule)
registerModule(wangEditorUploadImageModule)
registerModule(wangEditorCodeHighlightModule)

// editor config
const defaultEditorConfig = getDefaultEditorConfig()
wangEditor.setEditorConfig({
  ...defaultEditorConfig,
  decorate: wangEditorCodeHighLightDecorate, // 代码高亮
})
const defaultToolbarConfig = genDefaultToolbarConfig()
wangEditor.setToolbarConfig(defaultToolbarConfig)

// ------------------------------------ 分割线，以下是 export ------------------------------------

// 导出 core （注意，此处按需导出，不可直接用 `*` ）
export { DomEditor, IDomEditor, IEditorConfig, IToolbarConfig, Toolbar } from '@wangeditor/core'

// 导出 slate （需重命名，加 `Slate` 前缀）
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

export default wangEditor
