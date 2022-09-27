/**
 * @description parse elem html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { Descendant, Text } from 'slate'
import $, { DOMElement, getTagName } from '../utils/dom'
import { IDomEditor } from '@wangeditor/core'
import { ListItemElement } from './custom-types'

/**
 * 获取 ordered
 * @param $elem list $elem
 */
function getOrdered($elem: Dom7Array): boolean {
  const $list = $elem.parent()
  const listTagName = getTagName($list)
  if (listTagName === 'ol') return true
  return false
}

/**
 * 获取 level
 * @param $elem list $elem
 */
function getLevel($elem: Dom7Array): number {
  let level = 0

  let $cur: Dom7Array = $elem.parent()
  let tagName: string = getTagName($cur)

  while (tagName === 'ul' || tagName === 'ol') {
    $cur = $cur.parent()
    tagName = getTagName($cur)
    level++
  }

  return level - 1
}

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

  const ordered = getOrdered($elem)
  const level = getLevel($elem)

  return {
    type: 'list-item',
    ordered,
    level,
    // @ts-ignore
    children,
  }
}

export const parseItemHtmlConf = {
  selector: 'li:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseItemHtml,
}

function parseListHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): ListItemElement[] {
  // @ts-ignore flatten 因为可能有 ul/ol 嵌套，重要！！！
  return children.flat(Infinity)
}

export const parseListHtmlConf = {
  selector: 'ul:not([data-w-e-type]),ol:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseListHtml,
}
