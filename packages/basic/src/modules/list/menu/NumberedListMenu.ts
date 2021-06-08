/**
 * @description numbered list menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { NUMBERED_LIST_SVG } from '../../_helpers/icon-svg'

class NumberedListMenu extends BaseMenu {
  type = 'numbered-list'
  title = '有序列表'
  iconSvg = NUMBERED_LIST_SVG
}

export default NumberedListMenu
