/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'

function codeToHtml(elem: Element, childrenHtml: string): string {
  // 代码高亮 `class="language-xxx"` 在 code-highlight 中实现
  return `<code>${childrenHtml}</code>`
}

export const codeToHtmlConf = {
  type: 'code',
  elemToHtml: codeToHtml,
}

function preToHtml(elem: Element, childrenHtml: string): string {
  return `<pre>${childrenHtml}</pre>`
}

export const preToHtmlConf = {
  type: 'pre',
  elemToHtml: preToHtml,
}
