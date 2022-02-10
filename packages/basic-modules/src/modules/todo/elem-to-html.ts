/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { TodoElement } from './custom-types'

function todoToHtml(elem: Element, childrenHtml: string): string {
  const { checked } = elem as TodoElement
  const checkedAttr = checked ? 'checked' : ''
  return `<div data-w-e-type="todo"><input type="checkbox" disabled ${checkedAttr}>${childrenHtml}</div>`
}

export const todoToHtmlConf = {
  type: 'todo',
  elemToHtml: todoToHtml,
}
