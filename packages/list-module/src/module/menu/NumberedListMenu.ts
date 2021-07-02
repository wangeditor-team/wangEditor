/**
 * @description numbered list menu
 * @author wangfupeng
 */

import BaseMenu from './BaseMenu'
import { NUMBERED_LIST_SVG } from '../../constants/svg'

class NumberedListMenu extends BaseMenu {
  readonly type = 'numbered-list'
  readonly title = '有序列表'
  readonly iconSvg = NUMBERED_LIST_SVG
}

export default NumberedListMenu
