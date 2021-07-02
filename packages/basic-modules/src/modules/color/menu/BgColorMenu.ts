/**
 * @description bg color menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { BG_COLOR_SVG } from '../../../constants/icon-svg'

class BgColorMenu extends BaseMenu {
  readonly title = '背景颜色'
  readonly iconSvg = BG_COLOR_SVG
  readonly mark = 'bgColor'
}

export default BgColorMenu
