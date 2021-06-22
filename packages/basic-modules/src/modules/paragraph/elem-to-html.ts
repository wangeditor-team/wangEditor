/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function pToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  return `<p>${childrenHtml}</p>`
}

export const pToHtmlConf = {
  type: 'paragraph',
  elemToHtml: pToHtml,
}
