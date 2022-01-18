/**
 * @description parse style html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { Descendant, Element } from 'slate'
import { LineHeightElement } from './custom-types'
import { getStyleValue } from '../../utils/dom'

export function parseStyleHtml($elem: Dom7Array, node: Descendant): Descendant {
  if (!Element.isElement(node)) return node

  const elemNode = node as LineHeightElement

  const lineHeight = getStyleValue($elem, 'line-height')
  if (lineHeight) {
    elemNode.lineHeight = lineHeight
  }

  return elemNode
}
