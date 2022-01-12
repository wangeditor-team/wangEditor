/**
 * @description parse style html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { Descendant, Text } from 'slate'
import { ColorText } from './custom-types'
import { getStyleValue } from '../../utils/dom'

export function parseStyleHtml($text: Dom7Array, node: Descendant): Descendant {
  if (!Text.isText(node)) return node

  const textNode = node as ColorText

  const color = getStyleValue($text, 'color')
  if (color) {
    textNode.color = color
  }

  const bgColor = getStyleValue($text, 'background-color')
  if (bgColor) {
    textNode.bgColor = bgColor
  }

  return textNode
}
