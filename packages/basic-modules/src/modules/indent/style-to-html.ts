/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Element, Descendant } from 'slate'
import $ from '../../utils/dom'
import { IndentElement } from './custom-types'

export function styleToHtml(node: Descendant, elemHtml: string): string {
  if (!Element.isElement(node)) return elemHtml

  const { indent } = node as IndentElement // 如 '2em'
  if (!indent) return elemHtml

  // 设置样式
  const $elem = $(elemHtml)
  $elem.css('text-indent', indent)

  // 输出 html
  const $div = $('<div></div>')
  $div.append($elem)
  return $div.html()
}
