/**
 * @description text to html
 * @author wangfupeng
 */

import { Text } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { StyledText } from './custom-types'

export function textToHtml(textNode: Text, textHtml: string, editor: IDomEditor): string {
  const { bold, italic, underline, code, through } = textNode as StyledText

  // color bgColor 在另外的菜单

  let res = textHtml

  if (bold) res = `<strong>${res}</strong>`
  if (code) res = `<code>${res}</code>`
  if (italic) res = `<em>${res}</em>`
  if (underline) res = `<u>${res}</u>`
  if (through) res = `<s>${res}</s>`

  return res
}
