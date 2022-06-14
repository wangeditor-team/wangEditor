/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { FontSizeAndFamilyText } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'

export function parseStyleHtml(text: DOMElement, node: Descendant, editor: IDomEditor): Descendant {
  const $text = $(text)
  if (!Text.isText(node)) return node

  const textNode = node as FontSizeAndFamilyText

  const { fontSizeList = [] } = editor.getMenuConfig('fontSize')
  const fontSize = getStyleValue($text, 'font-size')
  if (fontSize && fontSizeList.includes(fontSize)) {
    textNode.fontSize = fontSize
  }

  const { fontFamilyList = [] } = editor.getMenuConfig('fontFamily')
  const fontFamily = getStyleValue($text, 'font-family')

  // getFontFamilyConfig 配置支持对象形式
  const includesFamily = fontFamilyList.find(item => item.name && item.name === fontFamily) || fontFamilyList.includes(fontFamily)

  if (fontFamily && includesFamily) {
    textNode.fontFamily = fontFamily
  }

  return textNode
}
