/**
 * @description color menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { FONT_COLOR_SVG } from '../../_helpers/icon-svg'

class ColorMenu extends BaseMenu {
  title = '文字颜色'
  iconSvg = FONT_COLOR_SVG
  mark = 'color'
}

export default ColorMenu
