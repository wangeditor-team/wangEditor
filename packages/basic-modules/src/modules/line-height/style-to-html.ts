/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Element, Descendant } from 'slate'
import $, { getOuterHTML } from '../../utils/dom'
import { LineHeightElement } from './custom-types'

export function styleToHtml(node: Descendant, elemHtml: string): string {
  if (!Element.isElement(node)) return elemHtml

  const { lineHeight } = node as LineHeightElement // 如 '1' '1.5'
  if (!lineHeight) return elemHtml

  // 设置样式
  const $elem = $(elemHtml)
  $elem.css('line-height', lineHeight)

  // 输出 html
  return getOuterHTML($elem)
}
