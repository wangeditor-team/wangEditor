/**
 * @description editor index
 * @author wangfupeng
 */

import { createEditor } from '@wangeditor/core'

const editor = createEditor('editor-container')
console.log('editor', editor)
console.log('editor.config', editor.getConfig())
