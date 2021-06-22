/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Element, Text } from 'slate'
import $ from '../../utils/dom'

export function textStyleToHtml(node: Text | Element, elemHtml: string): string {
  if (!Element.isElement(node)) return elemHtml

  // @ts-ignore
  const { textAlign } = node // 如 'left'/'right'/'center' 等
  if (!textAlign) return elemHtml

  // 设置样式
  const $elem = $(elemHtml)
  $elem.css('text-align', textAlign)

  // 输出 html
  const $div = $('<div></div>')
  $div.append($elem)
  return $div.html()
}
