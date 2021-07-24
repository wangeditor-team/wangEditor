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
    const [nodeEntry] = Editor.nodes(editor, {
      match: n => DomEditor.checkNodeType(n, 'blockquote'),
      universal: true,
    })
    if (!nodeEntry) {
      insertBreak()
      return
    }

    const isAtLineEnd = DomEditor.isSelectionAtLineEnd(editor, nodeEntry[1])

    // 如果在行末插入一个空 p，否则正常换行
    if (isAtLineEnd) {
      const p = { type: 'paragraph', children: [{ text: '' }] }
      Transforms.insertNodes(newEditor, p, { mode: 'highest' })
    } else {
      insertBreak()
    }
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withBlockquote
