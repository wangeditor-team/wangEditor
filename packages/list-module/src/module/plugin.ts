/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms, Node } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { getSelectedNodeByType } from './_helpers/node'

function withList<T extends IDomEditor>(editor: T): T {
  const { insertBreak } = editor
  const newEditor = editor

  // 重写 insertBreak
  newEditor.insertBreak = () => {
    const selectedNode = getSelectedNodeByType(newEditor, 'list-item')
    if (selectedNode == null) {
      // 未匹配到 list-item
      insertBreak()
      return
    }

    const listNode = DomEditor.getParentNode(newEditor, selectedNode) // 获取 list-item 的父节点，即 list 节点
    const children = listNode?.children || []
    const childrenLength = children.length
    if (selectedNode === children[childrenLength - 1]) {
      // 当前 list-item 是 list 的最后一个 child
      const str = Node.string(selectedNode)
      if (str === '') {
        // 当前 list-item 无内容。则删除这个空白 list-item，并跳出 list ，插入一个空行
        Transforms.removeNodes(newEditor, {
          // @ts-ignore
          match: n => n.type === 'list-item',
        })

        const p = { type: 'paragraph', children: [{ text: '' }] }
        Transforms.insertNodes(newEditor, p, {
          mode: 'highest', // 在最高层级插入，否则会插入到 list 下面
        })

        return // 阻止默认的 insertBreak ，重要！！！
      }
    }

    // 其他情况，执行默认的 insertBreak()
    insertBreak()
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withList
