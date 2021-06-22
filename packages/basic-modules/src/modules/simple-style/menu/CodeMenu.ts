/**
 * @description code menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { CODE_SVG } from '../../_helpers/icon-svg'

class CodeMenu extends BaseMenu {
  mark = 'code'
  title = '行内代码'
  iconSvg = CODE_SVG
  hotkey = 'mod+e'
}

export default CodeMenu
