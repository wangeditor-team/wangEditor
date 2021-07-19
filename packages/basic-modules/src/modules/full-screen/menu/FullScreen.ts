/**
 * @description redo menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { FULL_SCREEN } from '../../../constants/icon-svg'

class FullScreen implements IButtonMenu {
  title = '全屏'
  iconSvg = FULL_SCREEN
  tag = 'button'

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
