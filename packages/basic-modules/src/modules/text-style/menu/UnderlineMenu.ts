/**
 * @description underline menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { UNDER_LINE_SVG } from '../../../constants/icon-svg'

class UnderlineMenu extends BaseMenu {
  readonly mark = 'underline'
  readonly title = '下划线'
  readonly iconSvg = UNDER_LINE_SVG
  readonly hotkey = 'mod+u'
}

export default UnderlineMenu
