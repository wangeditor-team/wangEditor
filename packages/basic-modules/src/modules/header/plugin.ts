/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function withHeader<T extends IDomEditor>(editor: T): T {
  const { insertBreak, insertDomElem, insertNode } = editor
  const newEditor = editor

  // 重写 insertBreak - header 末尾回车时要插入 paragraph
  newEditor.insertBreak = () => {
    const [match] = Editor.nodes(newEditor, {
      match: n => {
        const type = DomEditor.getNodeType(n)
        return type.startsWith('header') // 匹配 node.type 是 header 开头的 node
      },
      universal: true,
    })

    if (!match) {
      // 未匹配到
      insertBreak()
      return
    }

    const isAtLineEnd = DomEditor.isSelectionAtLineEnd(editor, match[1])

    // 如果在行末插入一个空 p，否则正常换行
    if (isAtLineEnd) {
      const p = { type: 'paragraph', children: [{ text: '' }] }
      Transforms.insertNodes(newEditor, p, { mode: 'highest' })
    } else {
      insertBreak()
    }
  }

  // insert <h1> <h2> ... DOM Element
  newEditor.insertDomElem = (domElem: Element) => {
    const tag = domElem.tagName.toLowerCase()
    const reg = /^h(\d)$/
    const matchArr = tag.match(reg) // 如 ['h1', '1']
    if (matchArr == null) {
      insertDomElem(domElem) // 继续处理其他的
      return
    }

    const level = matchArr[1]
    if (level == null) return

    const text = domElem.textContent
    if (!text) return

    insertNode({
      type: `header${level}`,
      children: [{ text }],
    })
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withHeader
