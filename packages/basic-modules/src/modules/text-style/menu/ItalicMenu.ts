/**
 * @description italic menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { ITALIC_SVG } from '../../../constants/icon-svg'

class ItalicMenu extends BaseMenu {
  readonly mark = 'italic'
  readonly title = '斜体'
  readonly iconSvg = ITALIC_SVG
  readonly hotkey = 'mod+i'
}

export default ItalicMenu
