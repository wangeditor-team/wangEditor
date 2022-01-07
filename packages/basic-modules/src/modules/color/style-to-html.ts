/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Text, Descendant } from 'slate'
import $, { getOuterHTML } from '../../utils/dom'
import { ColorText } from './custom-types'

/**
 * style to html
 * @param textNode slate text node
 * @param textHtml text html 格式如 `<span ...>xxx</span>`
 * @returns styled html
 */
export function styleToHtml(textNode: Descendant, textHtml: string): string {
  if (!Text.isText(textNode)) return textHtml

  const { color, bgColor } = textNode as ColorText
  if (!color && !bgColor) return textHtml

  // 设置样式
  const $text = $(textHtml)
  if (color) $text.css('color', color)
  if (bgColor) $text.css('background-color', bgColor)

  // 输出 html
  return getOuterHTML($text)
}
