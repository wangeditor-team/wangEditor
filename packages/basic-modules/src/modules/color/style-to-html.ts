/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Text, Descendant } from 'slate'
import $, { getOuterHTML, getTagName, isPlainText } from '../../utils/dom'
import { ColorText } from './custom-types'

/**
 * style to html
 * @param textNode slate text node
 * @param textHtml text html
 * @returns styled html
 */
export function styleToHtml(textNode: Descendant, textHtml: string): string {
  if (!Text.isText(textNode)) return textHtml

  const { color, bgColor } = textNode as ColorText
  if (!color && !bgColor) return textHtml

  let $text

  if (isPlainText(textHtml)) {
    // textHtml 是纯文本，不是 html tag
    $text = $(`<span>${textHtml}</span>`)
  } else {
    // textHtml 是 html tag
    $text = $(textHtml)
    const tagName = getTagName($text)
    if (tagName !== 'span') {
      // 如果不是 span ，则包裹一层，接下来要设置 css
      $text = $(`<span>${textHtml}</span>`)
    }
  }

  // 设置样式
  if (color) $text.css('color', color)
  if (bgColor) $text.css('background-color', bgColor)

  // 输出 html
  return getOuterHTML($text)
}
