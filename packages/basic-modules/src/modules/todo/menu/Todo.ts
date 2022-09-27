/**
 * @description Todo menu
 * @author wangfupeng
 */

import { Editor, Element, Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { CHECK_BOX_SVG } from '../../../constants/icon-svg'

class TodoMenu implements IButtonMenu {
  readonly title = t('todo.todo')
  readonly iconSvg = CHECK_BOX_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    return !!DomEditor.getSelectedNodeByType(editor, 'todo')
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const selectedElems = DomEditor.getSelectedElems(editor)
    const notMatch = selectedElems.some((elem: Element) => {
      if (Editor.isVoid(editor, elem) && Editor.isBlock(editor, elem)) return true

      const { type } = elem as Element
      if (['pre', 'table', 'list-item'].includes(type)) return true
    })
    if (notMatch) return true

    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const active = this.isActive(editor)
    Transforms.setNodes(editor, { type: active ? 'paragraph' : 'todo' })
  }
}

export default TodoMenu
