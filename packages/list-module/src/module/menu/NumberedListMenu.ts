/**
 * @description numbered list menu
 * @author wangfupeng
 */

import { IDomEditor, t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { NUMBERED_LIST_SVG } from '../../constants/svg'

class NumberedListMenu extends BaseMenu {
  readonly type = 'numbered-list'
  readonly title = t('listModule.orderedList')
  readonly iconSvg = NUMBERED_LIST_SVG
}

export default NumberedListMenu
