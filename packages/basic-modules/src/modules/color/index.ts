/**
 * @description color bgColor
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { styleToHtml } from './style-to-html'
import { colorMenuConf, bgColorMenuConf } from './menu/index'
import withColor from './plugin'

const color: Partial<IModuleConf> = {
  renderStyle,
  styleToHtml,
  menus: [colorMenuConf, bgColorMenuConf],
  editorPlugin: withColor,
}

export default color
