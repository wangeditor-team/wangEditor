/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function withBlockquote<T extends IDomEditor>(editor: T): T {
  const { insertBreak } = editor
  const newEditor = editor

  // 重写 insertBreak - 换行时插入 p
  newEditor.insertBreak = () => {
    // const [nodeEntry] = Editor.nodes(newEditor, {
    //   match: n => DomEditor.getNodeType(n) === 'blockquote',
    //   universal: true,
    // })
    // if (nodeEntry == null) {
    //   // 未命中，则结束
    //   insertBreak()
    //   return
    // }

    const n = DomEditor.getSelectedNodeByType(editor, 'blockquote')
    if (n == null) {
      // 未命中，则结束
      insertBreak()
      return
    }

    // TODO 需判断是否是 blockquote 末尾
    // 插入一个空 p
    const p = { type: 'paragraph', children: [{ text: '' }] }
    Transforms.insertNodes(newEditor, p, { mode: 'highest' })
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withBlockquote
