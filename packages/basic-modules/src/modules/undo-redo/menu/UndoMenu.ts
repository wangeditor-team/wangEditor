/**
 * @description undo menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor, t } from '@wangeditor/core'
import { UNDO_SVG } from '../../../constants/icon-svg'

class UndoMenu implements IButtonMenu {
  title = t('undo.undo')
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
    if (typeof editor.undo === 'function') {
      editor.undo()
    }
  }
}

export default UndoMenu
