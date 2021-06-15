/**
 * @description del row menu
 * @author wangfupeng
 */

import { Editor, Transforms, Range } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'
import { getSelectedNodeByType } from '../_helpers/node'
import { DEL_ROW_SVG } from '../../constants/svg'

class DeleteRow implements IButtonMenu {
  title = '删除行'
  iconSvg = DEL_ROW_SVG
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true

    const rowNode = getSelectedNodeByType(editor, 'table-row')
    if (rowNode == null) {
      // 选区未处于 table row node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    const [rowEntry] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => n.type === 'table-row',
      universal: true,
    })
    const [rowNode, rowPath] = rowEntry

    const tableNode = DomEditor.getParentNode(editor, rowNode)
    const rowsLength = tableNode?.children.length || 0
    if (rowsLength <= 1) {
      // row 只有一行，则删掉整个表格
      Transforms.removeNodes(editor, { mode: 'highest' })
      return
    }

    // row > 1 行，则删掉这一行
    Transforms.removeNodes(editor, { at: rowPath })
  }
}

export default DeleteRow
