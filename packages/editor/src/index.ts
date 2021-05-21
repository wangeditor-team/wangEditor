/**
 * @description editor index
 * @author wangfupeng
 */

import './assets/index.less'

import {
  createEditor,
  registerTextStyleHandler,
  registerRenderElemConf,
  registerMenuItemFactory,
} from '@wangeditor/core'
import { textStyle, header, p } from '@wangeditor/basic'

const plugins = []

// --------------------- 注册 p ---------------------
if (p.renderElems && p.renderElems.length) {
  p.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}

// --------------------- 注册 textStyle module ---------------------
if (textStyle.addTextStyle) {
  registerTextStyleHandler(textStyle.addTextStyle)
}
if (textStyle.renderElems && textStyle.renderElems.length) {
  textStyle.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (textStyle.menus && textStyle.menus.length) {
  textStyle.menus.forEach(menuConf => registerMenuItemFactory(menuConf))
}
if (textStyle.editorPlugin) {
  plugins.push(textStyle.editorPlugin)
}

// --------------------- 注册 header module ---------------------
if (header.addTextStyle) {
  registerTextStyleHandler(header.addTextStyle)
}
if (header.renderElems && header.renderElems.length) {
  header.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (header.menus && header.menus.length) {
  header.menus.forEach(menuConf => registerMenuItemFactory(menuConf))
}
if (header.editorPlugin) {
  plugins.push(header.editorPlugin)
}

// --------------------- 创建 editor 实例 ---------------------
let editor = createEditor('editor-container', {
  toolbarKeys: ['header', ['bold', 'underline', 'italic', 'through'], 'code'],
  onChange() {
    console.log('selection', editor.selection)
  },
  plugins,
})

// console.log('editor', editor)
// console.log('editor.config', editor.getConfig())
