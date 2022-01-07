/**
 * @description text to html
 * @author wangfupeng
 */

import { Text, Descendant } from 'slate'
import { StyledText } from './custom-types'
import $, { getOuterHTML } from '../../utils/dom'

//【注意】color bgColor fontSize fontFamily 在另外的菜单

/**
 * style to html
 * @param textNode slate text node
 * @param textHtml text html 格式如 `<span ...>xxx</span>`
 * @returns styled html
 */
export function styleToHtml(textNode: Descendant, textHtml: string): string {
  if (!Text.isText(textNode)) return textHtml

  const { bold, italic, underline, code, through, sub, sup } = textNode as StyledText

  const $text = $(textHtml)
  let innerHtml = $text.html() || '<br>'

  if (bold) innerHtml = `<strong>${innerHtml}</strong>`
  if (code) innerHtml = `<code>${innerHtml}</code>`
  if (italic) innerHtml = `<em>${innerHtml}</em>`
  if (underline) innerHtml = `<u>${innerHtml}</u>`
  if (through) innerHtml = `<s>${innerHtml}</s>`
  if (sub) innerHtml = `<sub>${innerHtml}</sub>`
  if (sup) innerHtml = `<sup>${innerHtml}</sup>`

  $text.html(innerHtml)

  // 返回最新 html
  return getOuterHTML($text)
}
