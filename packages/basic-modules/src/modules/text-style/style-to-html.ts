/**
 * @description text to html
 * @author wangfupeng
 */

import { Text, Descendant } from 'slate'
import { StyledText } from './custom-types'
import $, { getOuterHTML, getTagName, isPlainText } from '../../utils/dom'

//【注意】color bgColor fontSize fontFamily 在另外的菜单

/**
 * 生成加了样式的 text html
 * @param textNode textNode
 * @param html text html
 */
function genStyledHtml(textNode: Descendant, html: string): string {
  let styledHtml = html
  const { bold, italic, underline, code, through, sub, sup } = textNode as StyledText
  if (bold) styledHtml = `<strong>${styledHtml}</strong>`
  if (code) styledHtml = `<code>${styledHtml}</code>`
  if (italic) styledHtml = `<em>${styledHtml}</em>`
  if (underline) styledHtml = `<u>${styledHtml}</u>`
  if (through) styledHtml = `<s>${styledHtml}</s>`
  if (sub) styledHtml = `<sub>${styledHtml}</sub>`
  if (sup) styledHtml = `<sup>${styledHtml}</sup>`
  return styledHtml
}

/**
 * style to html
 * @param textNode slate text node
 * @param textHtml text html
 * @returns styled html
 */
export function styleToHtml(textNode: Descendant, textHtml: string): string {
  if (!Text.isText(textNode)) return textHtml

  if (isPlainText(textHtml)) {
    // textHtml 是纯文本，而不是 html tag
    return genStyledHtml(textNode, textHtml)
  }

  // textHtml 是 html tag
  const $text = $(textHtml)
  const tagName = getTagName($text)

  if (tagName === 'br') {
    return genStyledHtml(textNode, '<br>')
  }

  let innerHtml = $text.html()
  innerHtml = genStyledHtml(textNode, innerHtml)
  $text.html(innerHtml)
  return getOuterHTML($text)
}
