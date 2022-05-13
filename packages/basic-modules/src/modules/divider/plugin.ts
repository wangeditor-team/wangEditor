/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function genEmptyP(): Element {
  return { type: 'paragraph', children: [{ text: '' }] }
}

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

    const editorChildren = newEditor.children
    const editorChildrenLength = editorChildren.length
    const isLastNode = editorChildren[editorChildrenLength - 1] === node

    if (isLastNode) {
      // -------------- divider 是 editor 最后一个节点，需要后面插入 p --------------
      Transforms.insertNodes(newEditor, genEmptyP(), { at: [path[0] + 1] })
    }
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withDivider
