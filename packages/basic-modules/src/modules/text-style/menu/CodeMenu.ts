/**
 * @description code menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { CODE_SVG } from '../../../constants/icon-svg'

class CodeMenu extends BaseMenu {
  readonly mark = 'code'
  readonly title = '行内代码'
  readonly iconSvg = CODE_SVG
  readonly hotkey = 'mod+e'
}

export default CodeMenu
