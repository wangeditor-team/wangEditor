/**
 * @description numbered list menu
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { NUMBERED_LIST_SVG } from '../../constants/svg'

class NumberedListMenu extends BaseMenu {
  readonly ordered = true
  readonly title = t('listModule.orderedList')
  readonly iconSvg = NUMBERED_LIST_SVG
}

export default NumberedListMenu
