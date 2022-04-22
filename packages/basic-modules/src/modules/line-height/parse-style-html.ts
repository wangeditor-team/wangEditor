/**
 * @description parse style html
 * @author wangfupeng
 */

import { Descendant, Element } from 'slate'
import { LineHeightElement } from './custom-types'
import $, { DOMElement, getStyleValue } from '../../utils/dom'
import { genLineHeightConfig } from './menu/config'

export function parseStyleHtml(elem: DOMElement, node: Descendant): Descendant {
  const $elem = $(elem)
  if (!Element.isElement(node)) return node

  const elemNode = node as LineHeightElement

  const lineHeightConf = genLineHeightConfig()
  const lineHeight = getStyleValue($elem, 'line-height')
  if (lineHeight && lineHeightConf.includes(lineHeight)) {
    elemNode.lineHeight = lineHeight
  }

  return elemNode
}
