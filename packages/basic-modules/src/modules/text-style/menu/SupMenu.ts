/**
 * @description sup menu
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { SUP_SVG } from '../../../constants/icon-svg'

class SupMenu extends BaseMenu {
  readonly mark = 'sup'
  readonly title = t('textStyle.sup')
  readonly iconSvg = SUP_SVG
  readonly hotkey = ''
}

export default SupMenu
