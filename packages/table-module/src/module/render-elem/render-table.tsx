/**
 * @description render table
 * @author wangfupeng
 */

import { Editor, Element as SlateElement, Range, Point, Path } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { TableElement } from '../custom-types'
import { getFirstRowCells } from '../helpers'

/**
 * 计算 table 是否可编辑。如果选区跨域 table 和外部内容，删除，会导致 table 结构打乱。所以，有时要让 table 不可编辑
 * @param editor editor
 * @param tableElem table elem
 */
function getContentEditable(editor: IDomEditor, tableElem: SlateElement): boolean {
  if (editor.isDisabled()) return false

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

  // 宽度
  const { width = 'auto' } = elemNode as TableElement

  // 是否选中
  const selected = DomEditor.isNodeSelected(editor, elemNode)

  // 第一行的 cells ，以计算列宽
  const firstRowCells = getFirstRowCells(elemNode as TableElement)

  const vnode = (
    <div
      className="table-container"
      data-selected={selected}
      on={{
        mousedown: (e: MouseEvent) => {
          // @ts-ignore 阻止光标定位到 table 后面
          if (e.target.tagName === 'DIV') e.preventDefault()

          if (editor.isDisabled()) return

          // 是否需要定位到 table 内部
          const tablePath = DomEditor.findPath(editor, elemNode)
          const tableStart = Editor.start(editor, tablePath)
          const { selection } = editor
          if (selection == null) {
            editor.select(tableStart) // 选中 table 内部
            return
          }
          const { path } = selection.anchor
          if (path[0] === tablePath[0]) return // 当前选区，就在 table 内部

          editor.select(tableStart) // 选中 table 内部
        },
      }}
    >
      <table width={width} contentEditable={editable}>
        <colgroup>
          {firstRowCells.map(cell => {
            const { width = 'auto' } = cell
            return <col width={width}></col>
          })}
        </colgroup>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
  return vnode
}

export default renderTable
