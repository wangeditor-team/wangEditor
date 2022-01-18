/**
 * @description parse style html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { Descendant, Element } from 'slate'
import { JustifyElement } from './custom-types'
import { getStyleValue } from '../../utils/dom'

export function parseStyleHtml($elem: Dom7Array, node: Descendant): Descendant {
  if (!Element.isElement(node)) return node

  const elemNode = node as JustifyElement

  const textAlign = getStyleValue($elem, 'text-align')
  if (textAlign) {
    elemNode.textAlign = textAlign
  }

  return elemNode
}
