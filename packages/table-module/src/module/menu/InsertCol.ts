/**
 * @description insert col menu
 * @author wangfupeng
 */

import isEqual from 'lodash.isequal'
import { Editor, Element, Transforms, Range, Node } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { ADD_COL_SVG } from '../../constants/svg'
import { TableCellElement, TableElement } from '../custom-types'
import { isTableWithHeader } from '../helpers'

class InsertCol implements IButtonMenu {
  readonly title = t('tableModule.insertCol')
  readonly iconSvg = ADD_COL_SVG
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
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true

    const tableNode = DomEditor.getSelectedNodeByType(editor, 'table')
    if (tableNode == null) {
      // 选区未处于 table cell node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    const [cellEntry] = Editor.nodes(editor, {
      match: n => DomEditor.checkNodeType(n, 'table-cell'),
      universal: true,
    })
    const [selectedCellNode, selectedCellPath] = cellEntry

    const rowNode = DomEditor.getParentNode(editor, selectedCellNode)
    if (rowNode == null) return
    const tableNode = DomEditor.getParentNode(editor, rowNode) as TableElement
    if (tableNode == null) return

    // 遍历所有 rows ，挨个添加 cell
    const rows = tableNode.children || []
    rows.forEach((row, rowIndex) => {
      if (!Element.isElement(row)) return

      const cells = row.children || []
      // 遍历一个 row 的所有 cells
      cells.forEach((cell: Node) => {
        const path = DomEditor.findPath(editor, cell)
        if (
          path.length === selectedCellPath.length &&
          isEqual(path.slice(-1), selectedCellPath.slice(-1)) // 俩数组，最后一位相同
        ) {
          // 如果当前 td 的 path 和选中 td 的 path ，最后一位相同，说明是同一列
          // 则在其后插入一个 cell
          const newCell: TableCellElement = { type: 'table-cell', children: [{ text: '' }] }
          if (rowIndex === 0 && isTableWithHeader(tableNode)) {
            newCell.isHeader = true
          }
          Transforms.insertNodes(editor, newCell, { at: path })
        }
      })
    })
  }
}

export default InsertCol
