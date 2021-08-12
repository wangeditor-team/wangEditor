/**
 * @description sup menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { SUP_SVG } from '../../../constants/icon-svg'

class SupMenu extends BaseMenu {
  readonly mark = 'sup'
  readonly title = '上标'
  readonly iconSvg = SUP_SVG
  readonly hotkey = ''
}

export default SupMenu
