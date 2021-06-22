/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function linkToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  // @ts-ignore
  const { url, target = '_blank' } = elem

  return `<a href="${url}" target="${target}">${childrenHtml}</a>`
}

export const linkToHtmlConf = {
  type: 'link',
  elemToHtml: linkToHtml,
}
