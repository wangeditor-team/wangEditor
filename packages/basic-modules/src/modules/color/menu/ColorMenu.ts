/**
 * @description color menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { FONT_COLOR_SVG } from '../../../constants/icon-svg'

class ColorMenu extends BaseMenu {
  readonly title = '文字颜色'
  readonly iconSvg = FONT_COLOR_SVG
  readonly mark = 'color'
}

export default ColorMenu
