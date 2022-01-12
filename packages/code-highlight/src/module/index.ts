/**
 * @description code highlight module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { parseCodeStyleHtml } from './parse-style-html'
import { selectLangMenuConf } from './menu/index'
import { codeToHtmlConf } from './elem-to-html'

const codeHighlightModule: Partial<IModuleConf> = {
  renderStyle,
  parseStyleHtml: parseCodeStyleHtml,
  menus: [selectLangMenuConf],
  elemsToHtml: [codeToHtmlConf],
}

export default codeHighlightModule
