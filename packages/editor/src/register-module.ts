/**
 * @description 注册 module
 * @author wangfupeng
 */

import WangEditor from './WangEditor'
import { IModuleConf } from '@wangeditor/core'

function registerModule(module: IModuleConf) {
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
    menus.forEach(menu => WangEditor.registerMenu(menu))
  }
  if (renderElems) {
    renderElems.forEach(renderElemConf => WangEditor.registerRenderElem(renderElemConf))
  }
  if (renderTextStyle) {
    WangEditor.registerRenderTextStyle(renderTextStyle)
  }
  if (elemsToHtml) {
    elemsToHtml.forEach(elemToHtmlConf => WangEditor.registerElemToHtml(elemToHtmlConf))
  }
  if (textToHtml) {
    WangEditor.registerTextToHtml(textToHtml)
  }
  if (textStyleToHtml) {
    WangEditor.registerTextStyleToHtml(textStyleToHtml)
  }
  if (editorPlugin) {
    WangEditor.registerPlugin(editorPlugin)
  }
}

export default registerModule
