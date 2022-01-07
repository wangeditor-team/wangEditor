/**
 * @description font-size font-family
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { textStyleToHtml } from './text-style-to-html'
import { fontSizeMenuConf, fontFamilyMenuConf } from './menu/index'

const fontSizeAndFamily: Partial<IModuleConf> = {
  renderStyle,
  textStyleToHtml,
  menus: [fontSizeMenuConf, fontFamilyMenuConf],
}

export default fontSizeAndFamily
