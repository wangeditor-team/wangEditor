/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Element, Text } from 'slate'
import $ from '../../utils/dom'

export function textStyleToHtml(node: Text | Element, elemHtml: string): string {
  if (!Element.isElement(node)) return elemHtml

  // @ts-ignore
  const { indent } = node // 如 '32px'
  if (!indent) return elemHtml

  // 设置样式
  const $elem = $(elemHtml)
  $elem.css('padding-left', indent)

  // 输出 html
  const $div = $('<div></div>')
  $div.append($elem)
  return $div.html()
}
