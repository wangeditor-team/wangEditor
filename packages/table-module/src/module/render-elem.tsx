/**
 * @description render elem
 * @author wangfupeng
 */

import { Editor, Element as SlateElement, Range, Point, Path } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { TableCellElement, TableRowElement, TableElement } from './custom-types'

/**
 * 计算 table 是否可编辑。如果选区跨域 table 和外部内容，删除，会导致 table 结构打乱。所以，有时要让 table 不可编辑
 * @param editor editor
 * @param tableElem table elem
 */
function getContentEditable(editor: IDomEditor, tableElem: SlateElement): boolean {
  const { selection } = editor
  if (selection == null) return true
  if (Range.isCollapsed(selection)) return true

  const { anchor, focus } = selection
  const tablePath = DomEditor.findPath(editor, tableElem)

  const tableStart = Editor.start(editor, tablePath)
  const tableEnd = Editor.end(editor, tablePath)
  const isAnchorInTable =
    Point.compare(anchor, tableEnd) <= 0 && Point.compare(anchor, tableStart) >= 0
  const isFocusInTable =
    Point.compare(focus, tableEnd) <= 0 && Point.compare(focus, tableStart) >= 0

  // 选区在 table 内部，且选中了同一个单元格。表格可以编辑
  if (isAnchorInTable && isFocusInTable) {
    if (Path.equals(anchor.path.slice(0, 3), focus.path.slice(0, 3))) {
      return true
    }
  }

  return false
}

function renderTable(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // 是否可编辑
  const editable = getContentEditable(editor, elemNode)

  // 宽度自适应
  const { fullWidth = false } = elemNode as TableElement
  let classNames: string[] = []
  if (fullWidth) classNames.push('full-width')

  const vnode = (
    <table className={classNames.join(' ')} contentEditable={editable}>
      <tbody>{children}</tbody>
    </table>
  )
  return vnode
}

function renderTableRow(
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const vnode = <tr>{children}</tr>
  return vnode
}

function renderTableCell(
  cellNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const { colSpan = 1, rowSpan = 1, isHeader = false } = cellNode as TableCellElement
  const Tag = isHeader ? 'th' : 'td'
  const vnode = (
    <Tag colSpan={colSpan} rowSpan={rowSpan}>
      {children}
    </Tag>
  )
  return vnode
}

export const renderTableConf = {
  type: 'table',
  renderElem: renderTable,
}

export const renderTableRowConf = {
  type: 'table-row',
  renderElem: renderTableRow,
}

export const renderTableCellConf = {
  type: 'table-cell',
  renderElem: renderTableCell,
}
