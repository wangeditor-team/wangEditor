/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { IndentElement } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'

export function parseStyleHtml(elem: DOMElement, node: Descendant, editor: IDomEditor): Descendant {
  const $elem = $(elem)
  if (!Element.isElement(node)) return node

  const elemNode = node as IndentElement

  const indent = getStyleValue($elem, 'text-indent')
  if (indent) {
    elemNode.indent = indent
  }

  return elemNode
}
