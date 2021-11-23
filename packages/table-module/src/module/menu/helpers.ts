/**
 * @description table menu helpers
 * @author wangfupeng
 */

import { TableElement, TableCellElement } from '../custom-types'

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
