/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import {
  Editor,
  Element as SlateElement,
  Transforms,
  Node as SlateNode,
  Text as SlateText,
} from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

/**
 * 是否是空 p
 * @param domElem dom elem
 */
function isEmptyParagraph(domElem: Element): boolean {
  if (domElem.tagName.toLowerCase() !== 'p') {
    throw new Error('domElem is not a <p>')
  }

  const innerHTML = domElem.innerHTML
  if (innerHTML === '') return true

  if (innerHTML === '<br>' || innerHTML === '<br/>') {
    return true
  }

  const children = Array.from(domElem.children)
  if (children.length === 1) {
    if (children[0].tagName.toLowerCase() === 'br') {
      return true
    }
  }

  return false
}

function deleteHandler(newEditor: IDomEditor): boolean {
  const [nodeEntry] = Editor.nodes(newEditor, {
    match: n => newEditor.children[0] === n, // editor 第一个节点
    mode: 'highest', // 最高层级
  })
  if (nodeEntry == null) return false

  const n = nodeEntry[0]
  if (!SlateElement.isElement(n)) return false
  if (n.type === 'paragraph') return false // 命中了 paragraph ，则不再继续判断
  if (SlateNode.string(n) !== '') return false // 未删除全部内容，则不再继续判断

  const { children = [] } = n
  if (!SlateText.isText(children[0])) return false // n.children 不是 text （如 table），则不再继续判断

  // 至此，就命中了一个（非 paragraph）+（children 都是 text）+（内容为空）的顶级 node ，如 header blockQuote 等
  // 然后，将其却换为 paragraph
  Transforms.setNodes(newEditor, {
    type: 'paragraph',
  })
  return true
}

function withParagraph<T extends IDomEditor>(editor: T): T {
  const { deleteBackward, deleteForward, insertDomElem, insertText, insertBreak } = editor
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

  // insert <p> DOM Element
  newEditor.insertDomElem = (domElem: Element) => {
    if (domElem.tagName.toLowerCase() !== 'p') {
      insertDomElem(domElem) // 继续其他的 elem
      return
    }

    // 空行
    const isEmpty = isEmptyParagraph(domElem)
    if (isEmpty) {
      insertBreak()
      return
    }

    // DOM 子节点
    const childNodes = Array.from(domElem.childNodes)
    if (childNodes.length === 0) return

    const selectedElem = DomEditor.getSelectedElems(editor)[0]
    if (DomEditor.getNodeType(selectedElem) !== 'paragraph') {
      // 如果当前选中的不是 p ，则换行，并设置为 p
      insertBreak()
      Transforms.setNodes(editor, { type: 'paragraph' })
    }

    // 插入子节点
    childNodes.forEach(child => {
      const nodeType = child.nodeType
      if (nodeType === 1) {
        // @ts-ignore DOM Element ，继续插入
        insertDomElem(child as Element)
      }
      if (nodeType === 3) {
        // DOM Text
        const text = child.textContent || ''
        if (text) insertText(text)
      }
    })

    // 最后换行
    insertBreak()
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withParagraph
