/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function withHeader<T extends IDomEditor>(editor: T): T {
  const { insertBreak } = editor
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

    // const [n] = match

    // TODO 需判断是否是 header 末尾，参考 https://github.com/ianstormtaylor/slate/blob/main/packages/slate-react/src/utils/lines.ts
    // 插入一个空 p
    const p = { type: 'paragraph', children: [{ text: '' }] }
    Transforms.insertNodes(newEditor, p, { mode: 'highest' })
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withHeader
