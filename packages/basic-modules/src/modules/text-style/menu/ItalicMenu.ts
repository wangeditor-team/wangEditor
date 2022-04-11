/**
 * @description italic menu
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { ITALIC_SVG } from '../../../constants/icon-svg'

class ItalicMenu extends BaseMenu {
  readonly mark = 'italic'
  readonly title = t('textStyle.italic')
  readonly iconSvg = ITALIC_SVG
  readonly hotkey = 'mod+i'
}

export default ItalicMenu
