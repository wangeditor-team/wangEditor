/**
 * @description redo menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor, t } from '@wangeditor/core'
import { FULL_SCREEN_SVG } from '../../../constants/icon-svg'

class FullScreen implements IButtonMenu {
  title = t('fullScreen.title')
  iconSvg = FULL_SCREEN_SVG
  tag = 'button'
  alwaysEnable = true

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    return editor.isFullScreen
  }

  isDisabled(editor: IDomEditor): boolean {
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (editor.isFullScreen) {
      editor.unFullScreen()
    } else {
      editor.fullScreen()
    }
  }
}

export default FullScreen
