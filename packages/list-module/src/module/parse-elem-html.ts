/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import { Dom7Array } from 'dom7'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { ListItemElement, BulletedListElement, NumberedListElement } from './custom-types'

function parseItemHtml(
  $elem: Dom7Array,
  children: Descendant[],
  editor: IDomEditor
): ListItemElement {
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
  selector: 'li',
  parseElemHtml: parseItemHtml,
}

function parseBulletedListHtml(
  $elem: Dom7Array,
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
  selector: 'ul',
  parseElemHtml: parseBulletedListHtml,
}

function parseNumberedListHtml(
  $elem: Dom7Array,
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
  selector: 'ol',
  parseElemHtml: parseNumberedListHtml,
}
