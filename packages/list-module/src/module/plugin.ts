/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms, Node as SlateNode, Element as SlateElement } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { checkList } from './helper'

function genEmptyP(): SlateElement {
  return { type: 'paragraph', children: [{ text: '' }] }
}

function deleteHandler(newEditor: IDomEditor): boolean {
  const [nodeEntry] = Editor.nodes(newEditor, {
    match: n => newEditor.children[0] === n, // editor 第一个节点
    mode: 'highest', // 最高层级
  })
  if (nodeEntry == null) return false
  const n = nodeEntry[0]
  if (!SlateElement.isElement(n)) return false

  if (!SlateNode.string(n) && checkList(n)) {
    // 当 list 作为 editor 第一个节点且内容为空时
    // 移除 ul ol 的父节点
    Transforms.unwrapNodes(newEditor, {
      match: n => checkList(n),
      split: true,
    })
    // 转换为 paragraph
    Transforms.setNodes(newEditor, {
      type: 'paragraph',
    })
    return true
  }
  return false
}

function withList<T extends IDomEditor>(editor: T): T {
  const { insertBreak, deleteBackward, insertDomElem, insertNode } = editor
  const newEditor = editor

  // 重写 insertBreak
  newEditor.insertBreak = () => {
    const selection = newEditor.selection
    if (selection == null) {
      insertBreak()
      return
    }

    const selectedNode = DomEditor.getSelectedNodeByType(newEditor, 'list-item')
    if (selectedNode == null) {
      // 未匹配到 list-item
      insertBreak()
      return
    }

    const listNode = DomEditor.getParentNode(newEditor, selectedNode) // 获取 list-item 的父节点，即 list 节点
    const children = listNode?.children || []
    const childrenLength = children.length
    if (selectedNode === children[childrenLength - 1]) {
      // 当前 list-item 是 list 的最后一个 child
      const str = SlateNode.string(selectedNode)
      if (str === '') {
        // 当前 list-item 无内容。则删除这个空白 list-item，并跳出 list ，插入一个空行
        Transforms.removeNodes(newEditor, {
          match: n => DomEditor.checkNodeType(n, 'list-item'),
        })
        const emptyParagraphPath = [selection.anchor.path[0] + 1] // 在 ul/ol 的下一行
        Transforms.insertNodes(newEditor, genEmptyP(), {
          at: emptyParagraphPath,
        })
        newEditor.select({ path: emptyParagraphPath.concat(0), offset: 0 }) // 选中空行的文字

        return // 阻止默认的 insertBreak ，重要！！！
      }
    }

    // 其他情况，执行默认的 insertBreak()
    insertBreak()
  }

  // 重写 deleteBackward
  newEditor.deleteBackward = unit => {
    const res = deleteHandler(newEditor)
    if (res) return // 命中结果，则 return

    // 执行默认的删除
    deleteBackward(unit)
  }

  // insert <ul> <ol> <li> DOM Element
  newEditor.insertDomElem = (domElem: Element) => {
    const tag = domElem.tagName.toLowerCase()
    if (tag !== 'ol' && tag !== 'ul') {
      insertDomElem(domElem) // 继续其他的
      return
    }

    const children: SlateElement[] = []
    Array.from(domElem.children).forEach(child => {
      const tag = child.tagName.toLowerCase()
      if (tag !== 'li') return

      const text = child.textContent
      if (!text) return

      children.push({ type: 'list-item', children: [{ text }] })
    })

    if (children.length === 0) return

    insertNode({
      type: tag === 'ol' ? 'numbered-list' : 'bulleted-list',
      children,
    })

    // 插入 p ，跳出 list 内部
    Transforms.insertNodes(newEditor, genEmptyP(), {
      mode: 'highest',
    })
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withList
