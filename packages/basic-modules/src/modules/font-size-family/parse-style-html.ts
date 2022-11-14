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

  // -------- 处理 font-size --------
  const { fontSizeList = [] } = editor.getMenuConfig('fontSize')
  const fontSize = getStyleValue($text, 'font-size')

  const includesSize =
    fontSizeList.find(item => item.value && item.value === fontSize) ||
    fontSizeList.includes(fontSize)

  if (fontSize && includesSize) {
    textNode.fontSize = fontSize
  }

  // -------- 处理 font-family --------
  const { fontFamilyList = [] } = editor.getMenuConfig('fontFamily')
  // 这里需要替换掉 "， css 设置 font-family，会将有空格的字体使用 " 包裹
  const fontFamily = getStyleValue($text, 'font-family').replace(/"/g, '')

  // getFontFamilyConfig 配置支持对象形式
  const includesFamily =
    fontFamilyList.find(item => item.value && item.value === fontFamily) ||
    fontFamilyList.includes(fontFamily)

  if (fontFamily && includesFamily) {
    textNode.fontFamily = fontFamily
  }

  return textNode
}
