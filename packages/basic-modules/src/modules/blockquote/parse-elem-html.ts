/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { Dom7Array } from 'dom7'
import { IDomEditor } from '@wangeditor/core'
import { BlockQuoteElement } from './custom-types'

function parseHtml(
  $elem: Dom7Array,
  children: Descendant[],
  editor: IDomEditor
): BlockQuoteElement {
  // 无 children ，则用纯文本
  if (children.length === 0) {
    children = [{ text: $elem.text().replace(/\s+/gm, ' ') }]
  }

  return {
    type: 'blockquote',
    // @ts-ignore
    children,
  }
}

export const parseHtmlConf = {
  selector: 'blockquote',
  parseElemHtml: parseHtml,
}
