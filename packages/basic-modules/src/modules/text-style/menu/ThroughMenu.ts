/**
 * @description through menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { THROUGH_SVG } from '../../../constants/icon-svg'

class ThroughMenu extends BaseMenu {
  readonly mark = 'through'
  readonly title = '删除线'
  readonly iconSvg = THROUGH_SVG
  readonly hotkey = 'mod+shift+x'
}

export default ThroughMenu
