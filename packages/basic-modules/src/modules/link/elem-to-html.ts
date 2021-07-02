/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { LinkElement } from './custom-types'

function linkToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  const { url, target = '_blank' } = elem as LinkElement

  return `<a href="${url}" target="${target}">${childrenHtml}</a>`
}

export const linkToHtmlConf = {
  type: 'link',
  elemToHtml: linkToHtml,
}
