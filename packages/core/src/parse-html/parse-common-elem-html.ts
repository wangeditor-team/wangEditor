/**
 * @description parse elem html
 * @author wangfupeng
 */

import $, { Dom7Array } from 'dom7'
import { Editor, Element, Descendant, Text } from 'slate'
import { IDomEditor } from '../editor/interface'
import parseElemHtml from './parse-elem-html'
import { PARSE_ELEM_HTML_CONF, ParseElemHtmlFnType, PARSE_STYLE_HTML_FN_LIST } from './index'
import { NodeType, DOMElement } from '../utils/dom'
import { replaceSpace160 } from './helper'

/**
 * 往 children 最后一个 item（如果是 text node） 插入文字
 * @param children children
 * @param str str
 * @returns 是否插入成功
 */
function tryInsertTextToChildrenLastItem(children: Descendant[], str: string): boolean {
  const len = children.length
  if (len) {
    const lastItem = children[len - 1]
    if (Text.isText(lastItem)) {
      const keys = Object.keys(lastItem)
      if (keys.length === 1 && keys[0] === 'text') {
        // lastItem 必须是纯文本，没有 marks
        lastItem.text = lastItem.text + str
        return true
      }
    }
  }
  return false
}

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

  const childNodes = $elem[0].childNodes

  // 处理空行（只有一个 child ，是 <br>）
  if (childNodes.length === 1) {
    if (childNodes[0].nodeName === 'BR') {
      children.push({ text: '' })
      return children // 直接返回
    }
  }

  // 遍历 DOM 子节点，生成 slate elem node children
  childNodes.forEach(child => {
    if (child.nodeType === NodeType.ELEMENT_NODE) {
      // <br> ，则往 children 最后一个元素（如果是 text ）追加 `\n`
      if (child.nodeName === 'BR') {
        // 尝试把 text 插入到最后一个 children
        const res = tryInsertTextToChildrenLastItem(children, '\n')
        if (!res) {
          // 若插入失败，则新建 item
          children.push({ text: '\n' })
        }
        return
      }

      // 其他 elem
      const $child = $(child)
      const parsedRes = parseElemHtml($child, editor)
      if (Array.isArray(parsedRes)) {
        parsedRes.forEach(el => children.push(el))
      } else {
        children.push(parsedRes)
      }
      return
    }
    if (child.nodeType === NodeType.TEXT_NODE) {
      // text
      let text = child.textContent || ''
      if (text.trim() === '' && text.indexOf('\n') >= 0) {
        // 有换行，但无实际内容
        return
      }

      if (text) {
        // 把 charCode 160 的空格（`&nbsp` 转换的），替换为 charCode 32 的空格（JS 默认的）
        text = replaceSpace160(text)

        // 尝试把 text 插入到最后一个 children
        const res = tryInsertTextToChildrenLastItem(children, text)
        if (!res) {
          // 若插入失败，则新建 item
          children.push({ text })
        }
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
function parseCommonElemHtml($elem: Dom7Array, editor: IDomEditor): Element[] {
  const children = genChildren($elem, editor)

  // parse
  const parser = getParser($elem)
  let parsedRes = parser($elem[0], children, editor)

  if (!Array.isArray(parsedRes)) parsedRes = [parsedRes] // 临时处理为数组

  parsedRes.forEach(elem => {
    const isVoid = Editor.isVoid(editor, elem)
    if (!isVoid) {
      // 非 void ，如果没有 children ，则取纯文本
      if (children.length === 0) {
        elem.children = [{ text: $elem.text().replace(/\s+/gm, ' ') }]
      }

      // 处理 style
      PARSE_STYLE_HTML_FN_LIST.forEach(fn => {
        elem = fn($elem[0], elem, editor) as Element
      })
    }
  })

  return parsedRes
}

export default parseCommonElemHtml
