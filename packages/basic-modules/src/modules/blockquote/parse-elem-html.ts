/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import $, { DOMElement } from '../../utils/dom'
import { IDomEditor } from '@wangeditor/core'
import { BlockQuoteElement } from './custom-types'

function parseHtml(
  elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
): BlockQuoteElement {
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
    type: 'blockquote',
    // @ts-ignore
    children,
  }
}

export const parseHtmlConf = {
  selector: 'blockquote:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseHtml,
}
