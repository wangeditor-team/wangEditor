/**
 * @description editor index
 * @author wangfupeng
 */

import './assets/index.less'

import {
  createEditor,
  registerTextStyleHandler,
  registerRenderElemConf,
  registerMenuItem,
} from '@wangeditor/core'
import { simpleStyle, header, p, color } from '@wangeditor/basic'

const plugins = []

// --------------------- 注册 p ---------------------
if (p.renderElems && p.renderElems.length) {
  p.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}

// --------------------- 注册 simpleStyle module ---------------------
if (simpleStyle.addTextStyle) {
  registerTextStyleHandler(simpleStyle.addTextStyle)
}
if (simpleStyle.menus && simpleStyle.menus.length) {
  simpleStyle.menus.forEach(menuConf => registerMenuItem(menuConf))
}

// --------------------- 注册 header module ---------------------
if (header.addTextStyle) {
  registerTextStyleHandler(header.addTextStyle)
}
if (header.renderElems && header.renderElems.length) {
  header.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (header.menus && header.menus.length) {
  header.menus.forEach(menuConf => registerMenuItem(menuConf))
}
if (header.editorPlugin) {
  plugins.push(header.editorPlugin)
}

// --------------------- 注册 color module ---------------------
if (color.addTextStyle) {
  registerTextStyleHandler(color.addTextStyle)
}
if (color.menus && color.menus.length) {
  color.menus.forEach(menuConf => registerMenuItem(menuConf))
}

// --------------------- 创建 editor 实例 ---------------------
let editor = createEditor('editor-container', {
  toolbarKeys: [
    'header',
    '|',
    'bold',
    'underline',
    'italic',
    'through',
    '|',
    'color',
    'bgColor',
    '|',
    'code',
  ],
  onChange() {
    console.log('selection', editor.selection)
  },
  plugins,
})

// console.log('editor', editor)
// console.log('editor.config', editor.getConfig())
