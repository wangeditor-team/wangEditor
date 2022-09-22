/**
 * @description bulleted list menu
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { BULLETED_LIST_SVG } from '../../constants/svg'

class BulletedListMenu extends BaseMenu {
  readonly ordered = false
  readonly title = t('listModule.unOrderedList')
  readonly iconSvg = BULLETED_LIST_SVG
}

export default BulletedListMenu
