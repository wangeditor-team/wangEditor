/**
 * @description sub menu
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { SUB_SVG } from '../../../constants/icon-svg'

class SubMenu extends BaseMenu {
  readonly mark = 'sub'
  readonly title = t('textStyle.sub')
  readonly iconSvg = SUB_SVG
  readonly hotkey = ''
}

export default SubMenu
