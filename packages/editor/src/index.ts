/**
 * @description editor index
 * @author wangfupeng
 */

import {
  createEditor,
  registerTextStyleHandler,
  registerRenderElemConf,
  registerMenuItemFactory,
} from '@wangeditor/core'
import { bold, header } from '@wangeditor/basic'

const plugins = []

// --------------------- 注册 bold module ---------------------
if (bold.addTextStyle) {
  registerTextStyleHandler(bold.addTextStyle)
}
if (bold.renderElemConfArr && bold.renderElemConfArr.length) {
  bold.renderElemConfArr.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (bold.menuConf) {
  registerMenuItemFactory(bold.menuConf)
}
if (bold.editorPlugin) {
  plugins.push(bold.editorPlugin)
}

// --------------------- 注册 header module ---------------------
if (header.addTextStyle) {
  registerTextStyleHandler(header.addTextStyle)
}
if (header.renderElemConfArr && header.renderElemConfArr.length) {
  header.renderElemConfArr.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (header.menuConf) {
  registerMenuItemFactory(header.menuConf)
}
if (header.editorPlugin) {
  plugins.push(header.editorPlugin)
}

// --------------------- 创建 editor 实例 ---------------------
let editor = createEditor('editor-container', {
  toolbarKeys: ['bold', 'header'],
  onChange() {
    console.log('selection', editor.selection)
  },
  plugins,
})

// console.log('editor', editor)
// console.log('editor.config', editor.getConfig())
