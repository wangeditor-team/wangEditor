/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function codeToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  // 代码高亮 `class="language-xxx"` 在 code-highlight 中实现
  return `<code>${childrenHtml}</code>`
}

export const codeToHtmlConf = {
  type: 'code',
  elemToHtml: codeToHtml,
}

function preToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  return `<pre>${childrenHtml}</pre>`
}

export const preToHtmlConf = {
  type: 'pre',
  elemToHtml: preToHtml,
}
