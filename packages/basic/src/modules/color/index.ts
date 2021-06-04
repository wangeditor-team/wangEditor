/**
 * @description color bgColor
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { genMenuConf } from './menu/index'
import { FONT_COLOR_SVG, BG_COLOR_SVG } from '../_helpers/icon-svg'

const colorMenu = genMenuConf('color', '字体颜色', FONT_COLOR_SVG)

const bgColorMenu = genMenuConf('bgColor', '背景颜色', BG_COLOR_SVG)

const color: IModuleConf = {
  addTextStyle,
  menus: [colorMenu, bgColorMenu],
}

export default color
