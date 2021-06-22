/**
 * @description to html
 * @author wangfupeng
 */

import { Node, Element } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function tableToHtml(elemNode: Element, childrenHtml: string, editor: IDomEditor): string {
  // @ts-ignore
  const { fullWidth = false } = elemNode

  let styleStr = ''
  if (fullWidth) styleStr += 'width: 100%;'

  return `<table style="${styleStr}"><tbody>${childrenHtml}\n</tbody></table>`
}

function tableRowToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  return `\n<tr>${childrenHtml}</tr>`
}

function tableCellToHtml(cellNode: Element, childrenHtml: string, editor: IDomEditor): string {
  // @ts-ignore
  const { colSpan = 1, rowSpan = 1 } = cellNode
  let tag = 'td'

  const rowNode = DomEditor.getParentNode(editor, cellNode)
  if (rowNode == null)
    throw new Error(`Cannot get table row node by cell node ${JSON.stringify(cellNode)}`)
  const tableNode = DomEditor.getParentNode(editor, rowNode)
  if (tableNode == null)
    throw new Error(`Cannot get table node by cell node ${JSON.stringify(cellNode)}`)

  // @ts-ignore
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
