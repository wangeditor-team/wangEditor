/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Element } from 'slate'
import { JustifyElement } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'

export function parseStyleHtml(elem: DOMElement, node: Descendant): Descendant {
  const $elem = $(elem)
  if (!Element.isElement(node)) return node

  const elemNode = node as JustifyElement

  const textAlign = getStyleValue($elem, 'text-align')
  if (textAlign) {
    elemNode.textAlign = textAlign
  }

  return elemNode
}
