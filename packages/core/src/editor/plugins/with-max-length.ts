/**
 * @description slate 插件 - maxLength
 * @author wangfupeng
 */

//【注意】拼音输入时 maxLength 限制在 CompositionEnd 事件中处理

import { Editor, Node } from 'slate'
import { IDomEditor, DomEditor } from '../..'

export const withMaxLength = <T extends Editor>(editor: T) => {
  const e = editor as T & IDomEditor
  const { insertText, insertNode, insertFragment } = e

  // 处理 text
  e.insertText = (text: string) => {
    const { maxLength } = e.getConfig()
    if (!maxLength) {
      insertText(text)
      return
    }

    const leftLength = DomEditor.getLeftLengthOfMaxLength(e)
    if (leftLength <= 0) {
      // 已经触发 maxLength ，不再输入文字
      return
    }

    if (leftLength < text.length) {
      // 剩余长度小于 text 长度，则截取 text
      insertText(text.slice(0, leftLength))
      return
    }

    insertText(text)
  }

  // 处理 node
  e.insertNode = (node: Node) => {
    const { maxLength } = e.getConfig()
    if (!maxLength) {
      insertNode(node)
      return
    }

    const leftLength = DomEditor.getLeftLengthOfMaxLength(e)
    if (leftLength <= 0) {
      // 已经触发 maxLength ，不再插入
      return
    }

    const text = Node.string(node)
    if (leftLength < text.length) {
      // 剩余长度，不够 node text 长度，不再插入
      return
    }

    insertNode(node)
  }

  // 处理 fragment
  e.insertFragment = (fragment: Node[]) => {
    const { maxLength } = e.getConfig()
    if (!maxLength) {
      // 无 maxLength
      insertFragment(fragment)
      return
    }

    // 有 maxLength ，则分别插入 node
    fragment.forEach(n => {
      e.insertNode(n) //【注意】这里必须使用 `e.insertNode` ，而不是 insertNode
    })
  }

  return e // 返回 editor 实例
}
