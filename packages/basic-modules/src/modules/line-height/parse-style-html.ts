/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { LineHeightElement } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'

export function parseStyleHtml(elem: DOMElement, node: Descendant, editor: IDomEditor): Descendant {
  const $elem = $(elem)
  if (!Element.isElement(node)) return node

  const elemNode = node as LineHeightElement

  const { lineHeightList = [] } = editor.getMenuConfig('lineHeight')
  const lineHeight = getStyleValue($elem, 'line-height')
  if (lineHeight && lineHeightList.includes(lineHeight)) {
    elemNode.lineHeight = lineHeight
  }

  return elemNode
}
