/**
 * @description parse style html
 * @author wangfupeng
 */

import $, { DOMElement } from '../utils/dom'
import { Descendant, Element } from 'slate'
import { DomEditor, IDomEditor } from '@wangeditor/core'
import { CodeElement } from '../custom-types'

export function parseCodeStyleHtml(
  elem: DOMElement,
  node: Descendant,
  editor: IDomEditor
): Descendant {
  const $elem = $(elem)

  if (!Element.isElement(node)) return node
  if (DomEditor.getNodeType(node) !== 'code') return node // 只针对 pre/code 元素

  const elemNode = node as CodeElement

  const langAttr = $elem.attr('class') || ''
  if (langAttr.indexOf('language-') === 0) {
    // V5 版本，格式如 class="language-javascript"
    elemNode.language = langAttr.split('-')[1] || '' // 获取 'javascript'
  } else {
    // 兼容 V4 版本，格式如 class="Javascript"
    elemNode.language = langAttr.toLowerCase()
  }

  return elemNode
}
