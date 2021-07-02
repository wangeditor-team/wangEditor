/**
 * @description textStyle to html
 * @author wangfupeng
 */

import { Element, Text } from 'slate'
import $ from '../../utils/dom'
import { FontSizeAndFamilyText } from './custom-types'

export function textStyleToHtml(node: Text | Element, elemHtml: string): string {
  if (!Text.isText(node)) return elemHtml

  const { fontSize, fontFamily, text } = node as FontSizeAndFamilyText
  if (!fontSize && !fontFamily) return elemHtml

  // 如果当前 elemHtml 是 node.text ，则包裹一个 <span> ，否则无法设置样式
  if (elemHtml === text) {
    elemHtml = `<span>${text}</span>`
  }

  // 设置样式
  const $elem = $(elemHtml)
  if (fontSize) $elem.css('font-size', fontSize)
  if (fontFamily) $elem.css('font-family', fontFamily)

  // 输出 html
  const $div = $('<div></div>')
  $div.append($elem)
  return $div.html()
}
