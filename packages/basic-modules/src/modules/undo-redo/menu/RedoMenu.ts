/**
 * @description redo menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { REDO_SVG } from '../../../constants/icon-svg'

class RedoMenu implements IButtonMenu {
  title = '重做'
  iconSvg = REDO_SVG
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // @ts-ignore
    if (typeof editor.redo === 'function') {
      // @ts-ignore
      editor.redo()
    }
  }
}

export default RedoMenu
