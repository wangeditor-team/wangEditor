/**
 * @description table menu helpers
 * @author wangfupeng
 */

import { DomEditor, IDomEditor } from '@wangeditor/core'
import { TableElement, TableCellElement } from './custom-types'

/**
 * 获取第一行所有 cells
 * @param tableNode table node
 */
export function getFirstRowCells(tableNode: TableElement): TableCellElement[] {
  const rows = tableNode.children || [] // 所有行
  if (rows.length === 0) return []
  const firstRow = rows[0] || {} // 第一行
  const cells = firstRow.children || [] // 第一行所有 cell
  return cells
}

/**
 * 表格是否带有表头？
 * @param tableNode table node
 */
export function isTableWithHeader(tableNode: TableElement): boolean {
  const firstRowCells = getFirstRowCells(tableNode)
  return firstRowCells.every(cell => !!cell.isHeader)
}

/**
 * 单元格是否在第一行
 * @param editor editor
 * @param cellNode cell node
 */
export function isCellInFirstRow(editor: IDomEditor, cellNode: TableCellElement): boolean {
  const rowNode = DomEditor.getParentNode(editor, cellNode)
  if (rowNode == null) return false
  const tableNode = DomEditor.getParentNode(editor, rowNode)
  if (tableNode == null) return false

  const firstRowCells = getFirstRowCells(tableNode as TableElement)
  return firstRowCells.some(c => c === cellNode)
}
