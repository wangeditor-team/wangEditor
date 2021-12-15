/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { ColorText } from './custom-types'

function withColor<T extends IDomEditor>(editor: T): T {
  const { insertDomElem, insertNode } = editor
  const newEditor = editor

  // insert <p> DOM Element
  newEditor.insertDomElem = (domElem: Element) => {
    const tag = domElem.tagName.toLowerCase()
    if (tag !== 'span' && tag !== 'font') {
      insertDomElem(domElem)
      return
    }

    const text = domElem.textContent
    if (!text) {
      insertDomElem(domElem)
      return
    }

    // @ts-ignore
    const style = domElem.style || {}

    // 尝试获取 color bgColor
    const color = style.color || domElem.getAttribute('color')
    const bgColor = style.backgroundColor

    // 插入带格式的 text node
    const textNode: ColorText = { text }
    if (color) textNode.color = color
    if (bgColor) textNode.bgColor = bgColor
    insertNode(textNode)

    // 清除格式
    Editor.removeMark(editor, 'color')
    Editor.removeMark(editor, 'bgColor')
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withColor
