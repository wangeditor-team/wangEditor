/**
 * @description register builtin modules
 * @author wangfupeng
 */

// basic-modules
import '@wangeditor/basic-modules/dist/css/style.css'
import basicModules from '@wangeditor/basic-modules'

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
import { wangEditorCodeHighlightModule } from '@wangeditor/code-highlight'

import registerModule from './register'

basicModules.forEach(module => registerModule(module))
registerModule(wangEditorListModule)
registerModule(wangEditorTableModule)
registerModule(wangEditorVideoModule)
registerModule(wangEditorUploadImageModule)
registerModule(wangEditorCodeHighlightModule)
