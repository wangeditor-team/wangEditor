/**
 * @description render elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'

function renderTable(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  const vnode = (
    <table>
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
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  // @ts-ignore
  const { colSpan = 1, rowSpan = 1 } = elemNode
  const vnode = (
    <td colSpan={colSpan} rowSpan={rowSpan}>
      {children}
    </td>
  )
  return vnode
}

export const renderTableConf = {
  type: 'table',
  renderFn: renderTable,
}

export const renderTableRowConf = {
  type: 'table-row',
  renderFn: renderTableRow,
}

export const renderTableCellConf = {
  type: 'table-cell',
  renderFn: renderTableCell,
}
