/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function dividerToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  return `<hr/>`
}

export const dividerToHtmlConf = {
  type: 'divider',
  elemToHtml: dividerToHtml,
}
