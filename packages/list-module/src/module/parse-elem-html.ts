/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import $, { DOMElement } from '../utils/dom'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { ListItemElement, BulletedListElement, NumberedListElement } from './custom-types'

function parseItemHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): ListItemElement {
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

  return {
    type: 'list-item',
    // @ts-ignore
    children,
  }
}

export const parseItemHtmlConf = {
  selector: 'li:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseItemHtml,
}

function parseBulletedListHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): BulletedListElement {
  return {
    type: 'bulleted-list',
    // @ts-ignore
    children: children.filter(child => DomEditor.getNodeType(child) === 'list-item'),
  }
}

export const parseBulletedListHtmlConf = {
  selector: 'ul:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseBulletedListHtml,
}

function parseNumberedListHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): NumberedListElement {
  return {
    type: 'numbered-list',
    // @ts-ignore
    children: children.filter(child => DomEditor.getNodeType(child) === 'list-item'),
  }
}

export const parseNumberedListHtmlConf = {
  selector: 'ol:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseNumberedListHtml,
}
