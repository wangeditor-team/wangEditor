/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms, Node as SlateNode } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

const EMPTY_P = { type: 'paragraph', children: [{ text: '' }] }

function withCodeBlock<T extends IDomEditor>(editor: T): T {
  const { insertBreak, normalizeNode, insertData, insertDomElem, insertNode } = editor
  const newEditor = editor

  // 重写换行操作
  newEditor.insertBreak = () => {
    const codeNode = DomEditor.getSelectedNodeByType(newEditor, 'code')
    if (codeNode == null) {
      insertBreak() // 执行默认的换行
      return
    }

    const codeStr = SlateNode.string(codeNode)

    if (codeStr.slice(-2) === '\n\n') {
      // 结尾两处空行，则跳出 pre ，插入空行
      Transforms.insertNodes(editor, EMPTY_P, {
        mode: 'highest', // 在最高层级插入，否则会插入到 pre 下面
      })
    } else {
      newEditor.insertText('\n') // code block 内部的文本换行
    }
  }

  // 重写 normalizeNode
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)

    // -------------- code node 不能是顶层，否则替换为 p --------------
    if (type === 'code' && path.length <= 1) {
      Transforms.setNodes(newEditor, { type: 'paragraph' }, { at: path })
      return
    }

    // -------------- pre 不能是 editor 第一个节点，否则前面插入 p
    if (type === 'pre' && newEditor.children[0] === node) {
      Transforms.insertNodes(newEditor, EMPTY_P, { at: path })
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

  // insert <pre><code> DOM Element
  newEditor.insertDomElem = (domElem: Element) => {
    const tag = domElem.tagName.toLowerCase()
    if (tag !== 'pre') {
      insertDomElem(domElem) // 执行默认处理
      return
    }

    const firstChild = domElem.children[0]
    if (!firstChild) return

    if (firstChild.tagName.toLowerCase() !== 'code') return

    const text = firstChild.textContent
    if (!text) return

    insertNode({
      type: 'pre',
      children: [
        {
          type: 'code',
          language: '',
          children: [{ text }],
        },
      ],
    })

    // 插入 p ，跳出 code 内部
    Transforms.insertNodes(newEditor, EMPTY_P, {
      mode: 'highest',
    })
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withCodeBlock
