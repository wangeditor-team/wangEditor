/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Text, Descendant } from 'slate'
import $, { getOuterHTML, getTagName, isPlainText } from '../../utils/dom'
import { FontSizeAndFamilyText } from './custom-types'

/**
 * style to html
 * @param textNode slate text node
 * @param textHtml text html
 * @returns styled html
 */
export function styleToHtml(textNode: Descendant, textHtml: string): string {
  if (!Text.isText(textNode)) return textHtml

  const { fontSize, fontFamily } = textNode as FontSizeAndFamilyText
  if (!fontSize && !fontFamily) return textHtml

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

  if (fontSize) $text.css('font-size', fontSize)
  if (fontFamily) $text.css('font-family', fontFamily)

  return getOuterHTML($text)
}
