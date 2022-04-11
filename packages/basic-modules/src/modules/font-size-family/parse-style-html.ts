/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import { FontSizeAndFamilyText } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'

export function parseStyleHtml(text: DOMElement, node: Descendant): Descendant {
  const $text = $(text)
  if (!Text.isText(node)) return node

  const textNode = node as FontSizeAndFamilyText

  const fontSize = getStyleValue($text, 'font-size')
  if (fontSize) {
    textNode.fontSize = fontSize
  }

  const fontFamily = getStyleValue($text, 'font-family')
  if (fontFamily) {
    textNode.fontFamily = fontFamily
  }

  return textNode
}
