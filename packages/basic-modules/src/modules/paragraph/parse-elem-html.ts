/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import { Dom7Array } from 'dom7'
import { IDomEditor } from '@wangeditor/core'
import { ParagraphElement } from './custom-types'

function parseParagraphHtml(
  $elem: Dom7Array,
  children: Descendant[],
  editor: IDomEditor
): ParagraphElement {
  // 无 children ，则用纯文本
  if (children.length === 0) {
    children = [{ text: $elem.text().replace(/\s+/gm, ' ') }]
  }

  return {
    type: 'paragraph',
    // @ts-ignore
    children,
  }
}

export const parseParagraphHtmlConf = {
  selector: 'p',
  parseElemHtml: parseParagraphHtml,
}
