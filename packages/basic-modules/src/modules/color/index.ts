/**
 * @description color bgColor
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderTextStyle } from './render-text-style'
import { textStyleToHtml } from './text-style-to-html'
import { colorMenuConf, bgColorMenuConf } from './menu/index'
import withColor from './plugin'

const color: Partial<IModuleConf> = {
  renderTextStyle,
  textStyleToHtml,
  menus: [colorMenuConf, bgColorMenuConf],
  editorPlugin: withColor,
}

export default color
