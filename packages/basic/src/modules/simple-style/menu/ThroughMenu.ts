/**
 * @description through menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { THROUGH_SVG } from '../../_helpers/icon-svg'

class ThroughMenu extends BaseMenu {
  mark = 'through'
  title = '删除线'
  iconSvg = THROUGH_SVG
}

export default ThroughMenu
