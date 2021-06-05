/**
 * @description underline menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { UNDER_LINE_SVG } from '../../_helpers/icon-svg'

class UnderlineMenu extends BaseMenu {
  mark = 'underline'
  title = '下划线'
  iconSvg = UNDER_LINE_SVG
}

export default UnderlineMenu
