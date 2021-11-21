/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { DomEditor } from '@wangeditor/core'
import { TableCellElement, TableRowElement, TableElement } from './custom-types'

function tableToHtml(elemNode: Element, childrenHtml: string): string {
  const { fullWidth = false } = elemNode as TableElement

  let styleStr = ''
  if (fullWidth) styleStr += 'width: 100%;'

  return `<table style="${styleStr}"><tbody>${childrenHtml}</tbody></table>`
}

function tableRowToHtml(elem: Element, childrenHtml: string): string {
  return `<tr>${childrenHtml}</tr>`
}

function tableCellToHtml(cellNode: Element, childrenHtml: string): string {
  const { colSpan = 1, rowSpan = 1 } = cellNode as TableCellElement
  let tag = 'td'

  const rowNode = DomEditor.getParentNode(null, cellNode)
  if (rowNode == null)
    throw new Error(`Cannot get table row node by cell node ${JSON.stringify(cellNode)}`)
  const tableNode = DomEditor.getParentNode(null, rowNode) as TableElement
  if (tableNode == null)
    throw new Error(`Cannot get table node by cell node ${JSON.stringify(cellNode)}`)

  if (tableNode.withHeader && tableNode.children.findIndex(r => r === rowNode) === 0) {
    // 首行，表头
    tag = 'th'
  }

  return `<${tag} colSpan="${colSpan}" rowSpan="${rowSpan}">${childrenHtml}</${tag}>`
}

export const tableToHtmlConf = {
  type: 'table',
  elemToHtml: tableToHtml,
}

export const tableRowToHtmlConf = {
  type: 'table-row',
  elemToHtml: tableRowToHtml,
}

export const tableCellToHtmlConf = {
  type: 'table-cell',
  elemToHtml: tableCellToHtml,
}
