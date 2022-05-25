/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms, Node as SlateNode, Element as SlateElement } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function getLastTextLineBeforeSelection(codeNode: SlateNode, editor: IDomEditor): string {
  const selection = editor.selection
  if (selection == null) return ''

  const codeText = SlateNode.string(codeNode)
  const anchorOffset = selection.anchor.offset
  const textBeforeAnchor = codeText.slice(0, anchorOffset) // 选区前的 text
  const arr = textBeforeAnchor.split('\n') // 选区前的 text ，按换行拆分
  const length = arr.length
  if (length === 0) return ''

  return arr[length - 1]
}

function withCodeBlock<T extends IDomEditor>(editor: T): T {
  const { insertBreak, normalizeNode, insertData, insertNode } = editor
  const newEditor = editor

  // 重写换行操作
  newEditor.insertBreak = () => {
    const codeNode = DomEditor.getSelectedNodeByType(newEditor, 'code')
    if (codeNode == null) {
      insertBreak() // 执行默认的换行
      return
    }

    // 回车时，根据当前行的空格，自动插入空格
    const lastLineBeforeSelection = getLastTextLineBeforeSelection(codeNode, newEditor)
    if (lastLineBeforeSelection) {
      const arr = lastLineBeforeSelection.match(/^\s+/) // 行开始的空格
      if (arr != null && arr[0] != null) {
        const spaces = arr[0]
        newEditor.insertText(`\n${spaces}`) // 换行后插入空格
        return
      }
    }

    // 普通换行
    newEditor.insertText('\n')
  }

  // 重写 normalizeNode
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)

    // -------------- code node 不能是顶层，否则替换为 p --------------
    if (type === 'code' && path.length <= 1) {
      Transforms.setNodes(newEditor, { type: 'paragraph' }, { at: path })
    }

    if (type === 'pre') {
      // -------------- pre 是 editor 最后一个节点，需要后面插入 p --------------
      const isLast = DomEditor.isLastNode(newEditor, node)
      if (isLast) {
        Transforms.insertNodes(newEditor, DomEditor.genEmptyParagraph(), { at: [path[0] + 1] })
      }

      // -------------- pre 下面必须是 code --------------
      if (DomEditor.getNodeType((node as SlateElement).children[0]) !== 'code') {
        Transforms.unwrapNodes(newEditor)
        Transforms.setNodes(newEditor, { type: 'paragraph' }, { mode: 'highest' })
      }
    }

    // 执行默认行为
    return normalizeNode([node, path])
  }

  // 重写 insertData - 粘贴文本
  newEditor.insertData = (data: DataTransfer) => {
    const codeNode = DomEditor.getSelectedNodeByType(newEditor, 'code')
    if (codeNode == null) {
      insertData(data) // 执行默认的 insertData
      return
    }

    // 获取文本，并插入到代码块
    const text = data.getData('text/plain')
    Editor.insertText(newEditor, text)
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withCodeBlock
