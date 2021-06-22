/**
 * @description code highlight module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderTextStyle } from './render-text-style'
import { selectLangMenuConf } from './menu/index'
import { codeToHtmlConf } from './elem-to-html'

const codeHighlightModule: IModuleConf = {
  renderTextStyle,
  menus: [selectLangMenuConf],
  elemsToHtml: [codeToHtmlConf],
}

export default codeHighlightModule
