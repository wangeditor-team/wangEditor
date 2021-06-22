/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function quoteToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  return `<blockquote>${childrenHtml}</blockquote>`
}

export const quoteToHtmlConf = {
  type: 'blockquote',
  elemToHtml: quoteToHtml,
}
