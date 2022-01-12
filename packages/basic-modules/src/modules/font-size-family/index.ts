/**
 * @description font-size font-family
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { styleToHtml } from './style-to-html'
import { preParseHtmlConf } from './pre-parse-html'
import { parseStyleHtml } from './parse-style-html'
import { fontSizeMenuConf, fontFamilyMenuConf } from './menu/index'

const fontSizeAndFamily: Partial<IModuleConf> = {
  renderStyle,
  styleToHtml,
  preParseHtml: [preParseHtmlConf],
  parseStyleHtml,
  menus: [fontSizeMenuConf, fontFamilyMenuConf],
}

export default fontSizeAndFamily
