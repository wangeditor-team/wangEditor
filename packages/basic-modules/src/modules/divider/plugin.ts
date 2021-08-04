/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function withDivider<T extends IDomEditor>(editor: T): T {
  const { isVoid, normalizeNode } = editor
  const newEditor = editor

  // 重写 isVoid
  newEditor.isVoid = elem => {
    const { type } = elem

    if (type === 'divider') {
      return true
    }

    return isVoid(elem)
  }

  // 重新 normalize
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)
    if (type !== 'divider') {
      // 未命中 divider ，执行默认的 normalizeNode
      return normalizeNode([node, path])
    }

    // editor 顶级 node
    const topLevelNodes = newEditor.children || []

    // --------------------- divider 后面必须跟一个 p header blockquote（否则后面无法继续输入文字） ---------------------
    const nextNode = topLevelNodes[path[0] + 1] || {}
    const { type: nextNodeType = '' } = nextNode as Element
    if (
      nextNodeType !== 'paragraph' &&
      nextNodeType !== 'blockquote' &&
      !nextNodeType.startsWith('header')
    ) {
      // divider node 后面不是 p 或 header ，则插入一个空 p
      const p = { type: 'paragraph', children: [{ text: '' }] }
      const insertPath = [path[0] + 1]
      Transforms.insertNodes(newEditor, p, {
        at: insertPath, // 在分割线后面插入
      })
    }
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withDivider
