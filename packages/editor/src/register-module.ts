/**
 * @description 注册 module
 * @author wangfupeng
 */

import wangEditor from './wangEditor'
import { IModuleConf } from '@wangeditor/core'

function registerModule(module: Partial<IModuleConf>) {
  const {
    menus,
    renderElems,
    renderTextStyle,
    elemsToHtml,
    textToHtml,
    textStyleToHtml,
    editorPlugin,
  } = module

  if (menus) {
    menus.forEach(menu => wangEditor.registerMenu(menu))
  }
  if (renderElems) {
    renderElems.forEach(renderElemConf => wangEditor.registerRenderElem(renderElemConf))
  }
  if (renderTextStyle) {
    wangEditor.registerRenderTextStyle(renderTextStyle)
  }
  if (elemsToHtml) {
    elemsToHtml.forEach(elemToHtmlConf => wangEditor.registerElemToHtml(elemToHtmlConf))
  }
  if (textToHtml) {
    wangEditor.registerTextToHtml(textToHtml)
  }
  if (textStyleToHtml) {
    wangEditor.registerTextStyleToHtml(textStyleToHtml)
  }
  if (editorPlugin) {
    wangEditor.registerPlugin(editorPlugin)
  }
}

export default registerModule
