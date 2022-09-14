/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import $, { DOMElement } from '../../utils/dom'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { PreElement, CodeElement } from './custom-types'

function parseCodeHtml(elem: DOMElement, children: Descendant[], editor: IDomEditor): CodeElement {
  const $elem = $(elem)

  return {
    type: 'code',
    language: '', // language 在 code-highlight 中实现
    children: [{ text: $elem[0].textContent || '' }],
  }
}

export const parseCodeHtmlConf = {
  selector: 'pre:not([data-w-e-type])>code', // 匹配 <pre> 下的 <code>
  parseElemHtml: parseCodeHtml,
}

function parsePreHtml(elem: DOMElement, children: Descendant[], editor: IDomEditor): PreElement {
  const $elem = $(elem)

  children = children.filter(child => DomEditor.getNodeType(child) === 'code')
  if (children.length === 0) {
    children = [{ type: 'code', language: '', children: [{ text: $elem[0].textContent || '' }] }]
  }

  return {
    type: 'pre',
    // @ts-ignore
    children: children.filter(child => DomEditor.getNodeType(child) === 'code'),
  }
}

export const parsePreHtmlConf = {
  selector: 'pre:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parsePreHtml,
}
