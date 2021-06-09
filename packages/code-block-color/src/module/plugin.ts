/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms, Node } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function withCodeBlock<T extends IDomEditor>(editor: T): T {
  const { insertBreak, normalizeNode } = editor
  const newEditor = editor

  // 重写换行操作
  newEditor.insertBreak = () => {
    const [nodeEntry] = Editor.nodes(newEditor, {
      // @ts-ignore
      match: n => n.type === 'pre',
      universal: true,
    })
    if (nodeEntry == null) {
      insertBreak() // 执行默认的换行
      return
    }

    const [n] = nodeEntry
    const codeStr = Node.string(n)

    if (codeStr.slice(-2) === '\n\n') {
      // 结尾两处空行，则跳出 pre ，插入空行
      const emptyP = { type: 'paragraph', children: [{ text: '' }] }
      Transforms.insertNodes(editor, emptyP, {
        mode: 'highest', // 在最高层级插入，否则会插入到 pre 下面
      })
    } else {
      newEditor.insertText('\n') // code block 内部的文本换行
    }
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withCodeBlock
