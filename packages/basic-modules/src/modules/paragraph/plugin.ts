/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Element, Transforms, Node, Text } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function deleteHandler(newEditor: IDomEditor): boolean {
  const [nodeEntry] = Editor.nodes(newEditor, {
    match: n => newEditor.children[0] === n, // editor 第一个节点
    mode: 'highest', // 最高层级
  })
  if (nodeEntry == null) return false

  const n = nodeEntry[0]
  if (!Element.isElement(n)) return false
  // @ts-ignore
  if (n.type === 'paragraph') return false // 命中了 paragraph ，则不再继续判断
  if (Node.string(n) !== '') return false // 未删除全部内容，则不再继续判断

  const { children = [] } = n
  if (!Text.isText(children[0])) return false // n.children 不是 text （如 table），则不再继续判断

  // 至此，就命中了一个（非 paragraph）+（children 都是 text）+（内容为空）的顶级 node ，如 header blockQuote 等
  // 然后，将其却换为 paragraph
  Transforms.setNodes(newEditor, {
    // @ts-ignore
    type: 'paragraph',
  })
  return true
}

function withParagraph<T extends IDomEditor>(editor: T): T {
  const { deleteBackward, deleteForward } = editor
  const newEditor = editor

  // 删除非 p 的文本 elem（如 header blockQuote 等），删除没有内容时，切换为 p
  newEditor.deleteBackward = unit => {
    const res = deleteHandler(newEditor)
    if (res) return // 命中结果，则 return

    // 执行默认的删除
    deleteBackward(unit)
  }
  newEditor.deleteForward = unit => {
    const res = deleteHandler(newEditor)
    if (res) return // 命中结果，则 return

    // 执行默认的删除
    deleteForward(unit)
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withParagraph
