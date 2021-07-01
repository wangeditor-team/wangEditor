/**
 * @description render elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'
import { TableCellElement, TableRowElement, TableElement } from '../custom-types'

function renderTable(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  const { withHeader = false, fullWidth = false } = elemNode as TableElement

  let classNames: string[] = []
  if (withHeader) classNames.push('with-header') // 表头
  if (fullWidth) classNames.push('full-width') // 宽度自适应

  const vnode = (
    <table className={classNames.join(' ')}>
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
  const { colSpan = 1, rowSpan = 1 } = cellNode as TableCellElement
  const vnode = (
    <td colSpan={colSpan} rowSpan={rowSpan}>
      {children}
    </td>
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
