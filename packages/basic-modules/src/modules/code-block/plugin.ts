/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms, Node } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { getSelectedNodeByType } from '../_helpers/node'

function withCodeBlock<T extends IDomEditor>(editor: T): T {
  const { insertBreak, normalizeNode, insertData } = editor
  const newEditor = editor

  // 重写换行操作
  newEditor.insertBreak = () => {
    const codeNode = getSelectedNodeByType(newEditor, 'code')
    if (codeNode == null) {
      insertBreak() // 执行默认的换行
      return
    }

    const codeStr = Node.string(codeNode)

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

  // 重写 normalizeNode
  newEditor.normalizeNode = ([node, path]) => {
    // @ts-ignore
    const { type } = node

    // -------------- code node 不能是顶层，否则替换为 p --------------
    if (type === 'code' && path.length <= 1) {
      Transforms.setNodes(
        newEditor,
        {
          // @ts-ignore
          type: 'paragraph',
        },
        { at: path }
      )
      return
    }

    // -------------- pre 不能是 editor 第一个节点，否则前面插入 p
    if (type === 'pre' && newEditor.children[0] === node) {
      const p = { type: 'paragraph', children: [{ text: '' }] }
      Transforms.insertNodes(newEditor, p, { at: path })
    }

    // 执行默认行为
    return normalizeNode([node, path])
  }

  // 重写 insertData - 粘贴文本
  newEditor.insertData = (data: DataTransfer) => {
    const codeNode = getSelectedNodeByType(newEditor, 'code')
    if (codeNode == null) {
      insertData(data) // 执行默认的 insertData
      return
    }

    // 获取文本，并插入到代码块
    const text = data.getData('text/plain')
    Editor.insertText(newEditor, text)
  }

  // TODO 选中多行 - tab 键

  // 返回 editor ，重要！
  return newEditor
}

export default withCodeBlock
