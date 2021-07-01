/**
 * @description undo menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { UNDO_SVG } from '../../../constants/icon-svg'

class UndoMenu implements IButtonMenu {
  title = '撤销'
  iconSvg = UNDO_SVG
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
    if (typeof editor.undo === 'function') {
      // @ts-ignore
      editor.undo()
    }
  }
}

export default UndoMenu
