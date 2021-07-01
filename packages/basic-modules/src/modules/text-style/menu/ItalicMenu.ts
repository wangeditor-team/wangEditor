/**
 * @description italic menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { ITALIC_SVG } from '../../../constants/icon-svg'

class ItalicMenu extends BaseMenu {
  mark = 'italic'
  title = '斜体'
  iconSvg = ITALIC_SVG
  hotkey = 'mod+i'
}

export default ItalicMenu
