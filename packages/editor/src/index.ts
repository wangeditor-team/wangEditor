/**
 * @description editor index
 * @author wangfupeng
 */

// 引入必要的 css
import './assets/index.less'
import '@wangeditor/core/css/style.css'
import '@wangeditor/basic/css/style.css'

import {
  createEditor,
  registerTextStyleHandler,
  registerRenderElemConf,
  registerMenu,
} from '@wangeditor/core'
import { simpleStyle, header, p, color, link } from '@wangeditor/basic'

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
  simpleStyle.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 header module ---------------------
if (header.addTextStyle) {
  registerTextStyleHandler(header.addTextStyle)
}
if (header.renderElems && header.renderElems.length) {
  header.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (header.menus && header.menus.length) {
  header.menus.forEach(menuConf => registerMenu(menuConf))
}
if (header.editorPlugin) {
  plugins.push(header.editorPlugin)
}

// --------------------- 注册 link module ---------------------
if (link.renderElems && link.renderElems.length) {
  link.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (link.menus && link.menus.length) {
  link.menus.forEach(menuConf => registerMenu(menuConf))
}
if (link.editorPlugin) {
  plugins.push(link.editorPlugin)
}

// --------------------- 注册 color module ---------------------
if (color.addTextStyle) {
  registerTextStyleHandler(color.addTextStyle)
}
if (color.menus && color.menus.length) {
  color.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 创建 editor 实例 ---------------------
let editor = createEditor(
  'editor-container',
  {
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
      'insertLink',
      'updateLink',
      'unLink',
      'viewLink',
      '|',
      'code',
    ],
    onChange() {
      console.log('selection', editor.selection)
    },
    plugins,
  },
  // @ts-ignore
  window.content
)

// console.log('editor', editor)
// console.log('editor.config', editor.getConfig())
