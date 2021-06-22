/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Element, Text } from 'slate'
import $ from '../../utils/dom'

export function textStyleToHtml(node: Text | Element, elemHtml: string): string {
  if (!Element.isElement(node)) return elemHtml

  // @ts-ignore
  const { lineHeight } = node // 如 '1' '1.5'
  if (!lineHeight) return elemHtml

  // 设置样式
  const $elem = $(elemHtml)
  $elem.css('line-height', lineHeight)

  // 输出 html
  const $div = $('<div></div>')
  $div.append($elem)
  return $div.html()
}
