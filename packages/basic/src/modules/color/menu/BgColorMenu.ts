/**
 * @description bg color menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { BG_COLOR_SVG } from '../../_helpers/icon-svg'

class BgColorMenu extends BaseMenu {
  title = '背景颜色'
  iconSvg = BG_COLOR_SVG
  mark = 'bgColor'
}

export default BgColorMenu
