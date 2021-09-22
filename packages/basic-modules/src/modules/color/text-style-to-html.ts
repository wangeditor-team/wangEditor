/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Element, Text } from 'slate'
import $ from '../../utils/dom'
import { replaceSymbols } from '../../utils/util'
import { ColorText } from './custom-types'

export function textStyleToHtml(node: Text | Element, elemHtml: string): string {
  if (!Text.isText(node)) return elemHtml

  const { color, bgColor, text } = node as ColorText
  if (!color && !bgColor) return elemHtml

  // 如果当前 elemHtml 是 node.text ，则包裹一个 <span> ，否则无法设置样式
  if (elemHtml === replaceSymbols(text)) {
    elemHtml = `<span>${elemHtml}</span>`
  }

  // 设置样式
  const $elem = $(elemHtml)
  if (color) $elem.css('color', color)
  if (bgColor) $elem.css('background-color', bgColor)

  // 输出 html
  const $div = $('<div></div>')
  $div.append($elem)
  return $div.html()
}
