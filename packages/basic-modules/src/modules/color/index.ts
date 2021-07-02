/**
 * @description color bgColor
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderTextStyle } from './render-text-style'
import { textStyleToHtml } from './text-style-to-html'
import { colorMenuConf, bgColorMenuConf } from './menu/index'

const color: Partial<IModuleConf> = {
  renderTextStyle,
  textStyleToHtml,
  menus: [colorMenuConf, bgColorMenuConf],
}

export default color
