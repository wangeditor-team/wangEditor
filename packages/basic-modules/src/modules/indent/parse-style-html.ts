/**
 * @description parse style html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { Descendant, Element } from 'slate'
import { IndentElement } from './custom-types'
import { getStyleValue } from '../../utils/dom'

export function parseStyleHtml($elem: Dom7Array, node: Descendant): Descendant {
  if (!Element.isElement(node)) return node

  const elemNode = node as IndentElement

  const indent = getStyleValue($elem, 'padding-left')
  if (indent) {
    elemNode.indent = indent
  }

  return elemNode
}
