/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms, Node, Point } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function withBlockquote<T extends IDomEditor>(editor: T): T {
  const { insertBreak, insertText } = editor
  const newEditor = editor

  // 重写 insertBreak - 换行时插入 p
  newEditor.insertBreak = () => {
    const { selection } = newEditor
    if (selection == null) return insertBreak()

    const [nodeEntry] = Editor.nodes(editor, {
      match: n => DomEditor.checkNodeType(n, 'blockquote'),
      universal: true,
    })
    if (!nodeEntry) return insertBreak()

    const quoteElem = nodeEntry[0]
    const quotePath = DomEditor.findPath(editor, quoteElem)
    const quoteEndLocation = Editor.end(editor, quotePath)

    if (Point.equals(quoteEndLocation, selection.focus)) {
      // 光标位于 blockquote 最后
      const str = Node.string(quoteElem)
      if (str && str.slice(-1) === '\n') {
        // blockquote 文本最后一个是 \n
        editor.deleteBackward('character') // 删除最后一个 \n

        // 则插入一个 paragraph
        const p = { type: 'paragraph', children: [{ text: '' }] }
        Transforms.insertNodes(newEditor, p, { mode: 'highest' })
        return
      }
    }

    // 情况情况，插入换行符
    insertText('\n')
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withBlockquote
