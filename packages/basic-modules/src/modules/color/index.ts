/**
 * @description color bgColor
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { styleToHtml } from './style-to-html'
import { preParseHtmlConf } from './pre-parse-html'
import { parseStyleHtml } from './parse-style-html'
import { colorMenuConf, bgColorMenuConf } from './menu/index'

const color: Partial<IModuleConf> = {
  renderStyle,
  styleToHtml,
  preParseHtml: [preParseHtmlConf],
  parseStyleHtml,
  menus: [colorMenuConf, bgColorMenuConf],
}

export default color
