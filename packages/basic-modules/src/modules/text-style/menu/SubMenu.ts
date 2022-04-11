/**
 * @description sub menu
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { SUB_SVG } from '../../../constants/icon-svg'

class SubMenu extends BaseMenu {
  readonly mark = 'sub'
  readonly marksNeedToRemove = ['sup'] // sub 和 sup 不能共存
  readonly title = t('textStyle.sub')
  readonly iconSvg = SUB_SVG
  readonly hotkey = ''
}

export default SubMenu
