/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { Dom7Array } from 'dom7'
import { IDomEditor } from '@wangeditor/core'
import { DividerElement } from './custom-types'

function parseHtml($elem: Dom7Array, children: Descendant[], editor: IDomEditor): DividerElement {
  return {
    type: 'divider',
    children: [{ text: '' }], // void node 有一个空白 text
  }
}

export const parseHtmlConf = {
  selector: 'hr',
  parseElemHtml: parseHtml,
}
