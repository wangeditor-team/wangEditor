/**
 * @description render elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'
import { TableCellElement, TableRowElement, TableElement } from './custom-types'

function renderTable(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  const { fullWidth = false } = elemNode as TableElement

  let classNames: string[] = []
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
