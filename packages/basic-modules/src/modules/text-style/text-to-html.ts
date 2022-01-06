/**
 * @description text to html
 * @author wangfupeng
 */

import { Text } from 'slate'
import { StyledText } from './custom-types'

export function textToHtml(textNode: Text, textHtml: string): string {
  // color bgColor fontSize fontFamily 在另外的菜单

  const { text, bold, italic, underline, code, through, sub, sup } = textNode as StyledText

  let res = text || '<br>'

  if (bold) res = `<strong>${res}</strong>`
  if (code) res = `<code>${res}</code>`
  if (italic) res = `<em>${res}</em>`
  if (underline) res = `<u>${res}</u>`
  if (through) res = `<s>${res}</s>`
  if (sub) res = `<sub>${res}</sub>`
  if (sup) res = `<sup>${res}</sup>`

  return `<span>${res}</span>`
}
