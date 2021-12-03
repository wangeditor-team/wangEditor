/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { IDomEditor, DomEditor } from '@wangeditor/core'
import { removeMarks } from './helper'

const HTML_TAG_TO_MARK = new Map([
  ['b', 'bold'],
  ['strong', 'bold'],
  ['em', 'italic'],
  ['i', 'italic'],
  ['code', 'code'],
  ['s', 'through'],
  ['strike', 'through'],
  ['u', 'underline'],
  ['sub', 'sub'],
  ['sup', 'sup'],
])

function withTextStyle<T extends IDomEditor>(editor: T): T {
  const { insertDomElem, insertNode } = editor
  const newEditor = editor

  // insert <p> DOM Element
  newEditor.insertDomElem = (domElem: Element) => {
    const tag = domElem.tagName.toLowerCase()
    if (!HTML_TAG_TO_MARK.has(tag)) {
      insertDomElem(domElem)
      return
    }
    const mark = HTML_TAG_TO_MARK.get(tag)
    if (!mark) {
      insertDomElem(domElem)
      return
    }

    const text = domElem.textContent
    if (!text) {
      insertDomElem(domElem)
      return
    }

    // 插入带格式的 text node
    const textNode = { text }
    textNode[mark] = true
    insertNode(textNode)

    // 清除格式
    const selectedTextNode = DomEditor.getSelectedTextNode(editor)
    if (selectedTextNode) removeMarks(editor, selectedTextNode)
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withTextStyle
