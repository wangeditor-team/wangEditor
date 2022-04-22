/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import { FontSizeAndFamilyText } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'
import { genFontSizeConfig, getFontFamilyConfig } from './menu/config'

export function parseStyleHtml(text: DOMElement, node: Descendant): Descendant {
  const $text = $(text)
  if (!Text.isText(node)) return node

  const textNode = node as FontSizeAndFamilyText

  const fontSizeConfig = genFontSizeConfig()
  const fontSize = getStyleValue($text, 'font-size')
  if (fontSize && fontSizeConfig.includes(fontSize)) {
    textNode.fontSize = fontSize
  }

  const fontFamilyConf = getFontFamilyConfig()
  const fontFamily = getStyleValue($text, 'font-family')
  if (fontFamily && fontFamilyConf.includes(fontFamily)) {
    textNode.fontFamily = fontFamily
  }

  return textNode
}
