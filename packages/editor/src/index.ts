/**
 * @description editor entry
 * @author wangfupeng
 */

import './assets/index.less'
import '@wangeditor/core/css/style.css'

// basic-modules
import '@wangeditor/basic-modules/css/style.css'
import basicModules from '@wangeditor/basic-modules'

// list-module
import '@wangeditor/list-module/css/style.css'
import wangEditorListModule from '@wangeditor/list-module'

// table-module
import '@wangeditor/table-module/css/style.css'
import wangEditorTableModule from '@wangeditor/table-module'

// video-module
import '@wangeditor/video-module/css/style.css'
import wangEditorVideoModule from '@wangeditor/video-module'

// upload-image-module
import '@wangeditor/upload-image-module/css/style.css'
import wangEditorUploadImageModule from '@wangeditor/upload-image-module'

// code-highlight
import '@wangeditor/code-highlight/css/style.css'
import {
  wangEditorCodeHighlightModule,
  wangEditorCodeHighLightDecorate,
} from '@wangeditor/code-highlight'

// 默认配置
import { getDefaultEditorConfig, genDefaultToolbarConfig } from './config'

import WangEditor from './WangEditor'

import registerModule from './register-module'

// 注册 basic-modules ，及其他 module
basicModules.forEach(module => registerModule(module))
registerModule(wangEditorListModule)
registerModule(wangEditorTableModule)
registerModule(wangEditorVideoModule) // TODO 第三方 module 需拆分出来 ？
registerModule(wangEditorUploadImageModule)
registerModule(wangEditorCodeHighlightModule)

// editor config
const defaultEditorConfig = getDefaultEditorConfig()
WangEditor.setEditorConfig({
  ...defaultEditorConfig,
  decorate: wangEditorCodeHighLightDecorate, // 代码高亮
})
const defaultToolbarConfig = genDefaultToolbarConfig()
WangEditor.setToolbarConfig(defaultToolbarConfig)

export default WangEditor
