/**
 * @description delete divider menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { TRASH_SVG } from '../../../constants/icon-svg'

class DeleteDividerMenu implements IButtonMenu {
  readonly title = t('common.delete')
  readonly iconSvg = TRASH_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const dividerNode = DomEditor.getSelectedNodeByType(editor, 'divider')
    if (dividerNode == null) {
      // 选区未处于 divider node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    // 删除
    Transforms.removeNodes(editor, {
      match: n => DomEditor.checkNodeType(n, 'divider'),
    })
  }
}

export default DeleteDividerMenu
