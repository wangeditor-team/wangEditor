/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Text, Descendant } from 'slate'
import $, { getOuterHTML } from '../../utils/dom'
import { FontSizeAndFamilyText } from './custom-types'

/**
 * style to html
 * @param textNode slate text node
 * @param textHtml text html 格式如 `<span ...>xxx</span>`
 * @returns styled html
 */
export function styleToHtml(textNode: Descendant, textHtml: string): string {
  if (!Text.isText(textNode)) return textHtml

  const { fontSize, fontFamily } = textNode as FontSizeAndFamilyText
  if (!fontSize && !fontFamily) return textHtml

  // 设置样式
  const $text = $(textHtml)
  if (fontSize) $text.css('font-size', fontSize)
  if (fontFamily) $text.css('font-family', fontFamily)

  // 输出 html
  return getOuterHTML($text)
}
