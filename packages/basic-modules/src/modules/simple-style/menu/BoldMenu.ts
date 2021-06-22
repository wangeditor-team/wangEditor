/**
 * @description bold menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { BOLD_SVG } from '../../_helpers/icon-svg'

class BoldMenu extends BaseMenu {
  mark = 'bold'
  title = '加粗'
  iconSvg = BOLD_SVG
  hotkey = 'mod+b'
}

export default BoldMenu
