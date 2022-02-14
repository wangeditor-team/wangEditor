/**
 * @description parse elem html
 * @author wangfupeng
 */

import $, { Dom7Array } from 'dom7'
import { Editor, Element, Descendant } from 'slate'
import { IDomEditor } from '../editor/interface'
import parseElemHtml from './parse-elem-html'
import { PARSE_ELEM_HTML_CONF, ParseElemHtmlFnType, PARSE_STYLE_HTML_FN_LIST } from './index'
import { NodeType, DOMElement } from '../utils/dom'

/**
 * 生成 slate node children
 * @param $elem $elem
 * @param editor editor
 */
function genChildren($elem: Dom7Array, editor: IDomEditor): Descendant[] {
  const children: Descendant[] = []

  // void node（ html 中编辑的，如 video 的 html 中会有 data-w-e-is-void 属性 ），不需要生成 children
  const isVoid = $elem.attr('data-w-e-is-void') != null
  if (isVoid) {
    return children
  }

  // 处理空行（只有一个 child ，是 <br>）
  if ($elem[0].children.length === 1) {
    if ($elem[0].children[0].nodeName === 'BR') {
      children.push({ text: '' })
      return children // 直接返回
    }
  }

  // 遍历 DOM 子节点，生成 slate elem node children
  const childNodes = $elem[0].childNodes
  childNodes.forEach(child => {
    if (child.nodeType === NodeType.ELEMENT_NODE) {
      // elem
      const $child = $(child)
      children.push(parseElemHtml($child, editor))
      return
    }
    if (child.nodeType === NodeType.TEXT_NODE) {
      // text
      let text = child.textContent || ''
      if (text.trim() === '' && text.indexOf('\n') >= 0) {
        // 有换行，但无实际内容
        return
      }

      // text
      text = text.replace(/\s+/gm, ' ')
      if (text) {
        children.push({ text })
      }
      return
    }
  })
  return children
}

/**
 * 默认的 parseElemHtml ，直接转换为 paragraph
 * @param elem elem
 * @param children children
 */
function defaultParser(elem: DOMElement, children: Descendant[], editor: IDomEditor): Element {
  return {
    type: 'paragraph',
    children: [{ text: $(elem).text().replace(/\s+/gm, ' ') }],
  }
}

/**
 * 获取当前 html 元素的 parseElemHtml 函数
 * @param $elem $elem
 */
function getParser($elem: Dom7Array): ParseElemHtmlFnType {
  for (let selector in PARSE_ELEM_HTML_CONF) {
    if ($elem[0].matches(selector)) {
      return PARSE_ELEM_HTML_CONF[selector]
    }
  }
  return defaultParser
}

/**
 * 处理普通 DOM elem html ，非 span font 等文本 elem
 * @param $elem $elem
 * @param editor editor
 * @returns slate element
 */
function parseCommonElemHtml($elem: Dom7Array, editor: IDomEditor): Element {
  const children = genChildren($elem, editor)

  // parse
  const parser = getParser($elem)
  let elem = parser($elem[0], children, editor)

  const isVoid = Editor.isVoid(editor, elem)
  if (!isVoid) {
    // 非 void ，如果没有 children ，则取纯文本
    if (children.length === 0) {
      elem.children = [{ text: $elem.text().replace(/\s+/gm, ' ') }]
    }

    // 处理 style
    PARSE_STYLE_HTML_FN_LIST.forEach(fn => {
      elem = fn($elem[0], elem) as Element
    })
  }

  return elem
}

export default parseCommonElemHtml
