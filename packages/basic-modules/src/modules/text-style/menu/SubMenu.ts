/**
 * @description sub menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { SUB_SVG } from '../../../constants/icon-svg'

class SubMenu extends BaseMenu {
  readonly mark = 'sub'
  readonly title = '下标'
  readonly iconSvg = SUB_SVG
  readonly hotkey = ''
}

export default SubMenu
