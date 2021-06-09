/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Node, Transforms } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function withVideo<T extends IDomEditor>(editor: T): T {
  const { isVoid, normalizeNode } = editor
  const newEditor = editor

  // 重写 isVoid
  newEditor.isVoid = elem => {
    // @ts-ignore
    const { type } = elem

    if (type === 'video') {
      return true
    }

    return isVoid(elem)
  }

  // 重写 normalizeNode
  newEditor.normalizeNode = ([node, path]) => {
    // @ts-ignore
    const { type } = node

    // ----------------- video 后面必须跟一个 p 或 header -----------------
    if (type === 'video') {
      const topLevelNodes = newEditor.children || []
      const nextNode = topLevelNodes[path[0] + 1] || {}
      // @ts-ignore
      const { type: nextNodeType = '' } = nextNode
      if (nextNodeType !== 'paragraph' || nextNodeType.startsWith('header')) {
        // video node 后面不是 p 或 header ，则插入一个空 p
        const p = { type: 'paragraph', children: [{ text: '' }] }
        const insertPath = [path[0] + 1]
        Transforms.insertNodes(newEditor, p, {
          at: insertPath, // 在表格后面插入
        })
      }
    }

    // 执行默认的 normalizeNode ，重要！！！
    return normalizeNode([node, path])
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withVideo
