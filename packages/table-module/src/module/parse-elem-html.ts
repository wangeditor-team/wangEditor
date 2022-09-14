/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { TableCellElement, TableRowElement, TableElement } from './custom-types'
import $, { getTagName, getStyleValue, DOMElement } from '../utils/dom'

function parseCellHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): TableCellElement {
  const $elem = $(elem)

  children = children.filter(child => {
    if (Text.isText(child)) return true
    if (editor.isInline(child)) return true
    return false
  })

  // 无 children ，则用纯文本
  if (children.length === 0) {
    children = [{ text: $elem.text().replace(/\s+/gm, ' ') }]
  }

  const colSpan = parseInt($elem.attr('colSpan') || '1')
  const rowSpan = parseInt($elem.attr('rowSpan') || '1')
  const width = $elem.attr('width') || 'auto'

  return {
    type: 'table-cell',
    isHeader: getTagName($elem) === 'th',
    colSpan,
    rowSpan,
    width,
    // @ts-ignore
    children,
  }
}

export const parseCellHtmlConf = {
  selector: 'td:not([data-w-e-type]),th:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseCellHtml,
}

function parseRowHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): TableRowElement {
  return {
    type: 'table-row',
    // @ts-ignore
    children: children.filter(child => DomEditor.getNodeType(child) === 'table-cell'),
  }
}

export const parseRowHtmlConf = {
  selector: 'tr:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseRowHtml,
}

function parseTableHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): TableElement {
  const $elem = $(elem)

  // 计算宽度
  let width = 'auto'
  if (getStyleValue($elem, 'width') === '100%') width = '100%'
  if ($elem.attr('width') === '100%') width = '100%' // 兼容 v4 格式

  return {
    type: 'table',
    width,
    // @ts-ignore
    children: children.filter(child => DomEditor.getNodeType(child) === 'table-row'),
  }
}

export const parseTableHtmlConf = {
  selector: 'table:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseTableHtml,
}
