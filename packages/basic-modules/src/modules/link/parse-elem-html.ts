/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { Dom7Array } from 'dom7'
import { IDomEditor } from '@wangeditor/core'
import { LinkElement } from './custom-types'

function parseHtml($elem: Dom7Array, children: Descendant[], editor: IDomEditor): LinkElement {
  // 无 children ，则用纯文本
  if (children.length === 0) {
    children = [{ text: $elem.text().replace(/\s+/gm, ' ') }]
  }

  return {
    type: 'link',
    url: $elem.attr('href') || '',
    target: $elem.attr('target') || '',
    // @ts-ignore
    children,
  }
}

export const parseHtmlConf = {
  selector: 'a',
  parseElemHtml: parseHtml,
}
