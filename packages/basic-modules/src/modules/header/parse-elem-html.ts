/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import $, { DOMElement } from '../../utils/dom'
import { IDomEditor } from '@wangeditor/core'
import {
  Header1Element,
  Header2Element,
  Header3Element,
  Header4Element,
  Header5Element,
} from './custom-types'

function genParser<T>(level: number) {
  function parseHtml(elem: DOMElement, children: Descendant[], editor: IDomEditor): T {
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

    const headerNode = {
      type: `header${level}`,
      children,
    } as unknown as T

    return headerNode
  }
  return parseHtml
}

export const parseHeader1HtmlConf = {
  selector: 'h1:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: genParser<Header1Element>(1),
}

export const parseHeader2HtmlConf = {
  selector: 'h2:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: genParser<Header2Element>(2),
}

export const parseHeader3HtmlConf = {
  selector: 'h3:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: genParser<Header3Element>(3),
}

export const parseHeader4HtmlConf = {
  selector: 'h4:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: genParser<Header4Element>(4),
}

export const parseHeader5HtmlConf = {
  selector: 'h5:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: genParser<Header5Element>(5),
}
