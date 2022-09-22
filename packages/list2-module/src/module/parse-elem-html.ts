/**
 * @description parse elem html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import $, { DOMElement } from '../utils/dom'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { List2ItemElement } from './custom-types'

function parseItemHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): List2ItemElement {
  const $elem = $(elem)

  // 获取 ordered
  let ordered = false
  if ($elem.attr('data-list-item-ordered') != null) ordered = true

  // TODO 获取 level

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
    type: 'list2-item',
    ordered,
    // @ts-ignore
    children,
  }
}

export default {
  selector: 'li:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseItemHtml,
}
