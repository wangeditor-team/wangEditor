/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Element } from 'slate'
import { LineHeightElement } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'

export function parseStyleHtml(elem: DOMElement, node: Descendant): Descendant {
  const $elem = $(elem)
  if (!Element.isElement(node)) return node

  const elemNode = node as LineHeightElement

  const lineHeight = getStyleValue($elem, 'line-height')
  if (lineHeight) {
    elemNode.lineHeight = lineHeight
  }

  return elemNode
}
