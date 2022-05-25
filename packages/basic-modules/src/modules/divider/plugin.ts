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

    // -------------- divider 是 editor 最后一个节点，需要后面插入 p --------------
    const isLast = DomEditor.isLastNode(newEditor, node)
    if (isLast) {
      Transforms.insertNodes(newEditor, DomEditor.genEmptyParagraph(), { at: [path[0] + 1] })
    }
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withDivider
