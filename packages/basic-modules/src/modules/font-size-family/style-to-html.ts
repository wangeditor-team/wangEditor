/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Text, Descendant } from 'slate'
import $, { getOuterHTML, getTagName } from '../../utils/dom'
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

  let $text = $()
  try {
    $text = $(textHtml) // textHtml 可能是 html tag ，也可能是纯字符串，所以要 try
  } catch (err) {} // eslint-disable-line

  // 如果 textHtml 不是 <span> 标签，则包裹一层
  const tagName = getTagName($text)
  if (tagName !== 'span') {
    $text = $(`<span>${textHtml}</span>`)
  }

  if (fontSize) $text.css('font-size', fontSize)
  if (fontFamily) $text.css('font-family', fontFamily)

  return getOuterHTML($text)
}
