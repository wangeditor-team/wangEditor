/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import { ColorText } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'

export function parseStyleHtml(text: DOMElement, node: Descendant): Descendant {
  const $text = $(text)
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
