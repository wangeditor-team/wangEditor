/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import isEqual from 'lodash.isequal'
import {
  Editor,
  Transforms,
  Point,
  Element as SlateElement,
  Descendant,
  NodeEntry,
  Node,
  BaseText,
} from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import $ from '../utils/dom'

function genEmptyParagraph(): SlateElement {
  return { type: 'paragraph', children: [{ text: '' }] }
}

// table cell 内部的删除处理
function deleteHandler(newEditor: IDomEditor): boolean {
  const { selection } = newEditor
  if (selection == null) return false

  const [cellNodeEntry] = Editor.nodes(newEditor, {
    match: n => DomEditor.checkNodeType(n, 'table-cell'),
  })
  if (cellNodeEntry) {
    const [, cellPath] = cellNodeEntry
    const start = Editor.start(newEditor, cellPath)

    if (Point.equals(selection.anchor, start)) {
      return true // 阻止删除 cell
    }
  }

  return false
}

function withTable<T extends IDomEditor>(editor: T): T {
  const {
    insertBreak,
    deleteBackward,
    deleteForward,
    normalizeNode,
    insertData,
    handleTab,
    selectAll,
  } = editor
  const newEditor = editor

  // 重写 insertBreak - cell 内换行，只换行文本，不拆分 node
  newEditor.insertBreak = () => {
    const selectedNode = DomEditor.getSelectedNodeByType(newEditor, 'table')
    if (selectedNode != null) {
      // 选中了 table ，则在 cell 内换行
      newEditor.insertText('\n')
      return
    }

    // 未选中 table ，默认的换行
    insertBreak()
  }

  // 重写 delete - cell 内删除，只删除文字，不删除 node
  newEditor.deleteBackward = unit => {
    const res = deleteHandler(newEditor)
    if (res) return // 命中 table cell ，自己处理删除

    // 执行默认的删除
    deleteBackward(unit)
  }

  // 重写 handleTab 在table内按tab时跳到下一个单元格
  newEditor.handleTab = () => {
    const selectedNode = DomEditor.getSelectedNodeByType(newEditor, 'table')
    if (selectedNode) {
      const above = Editor.above(editor) as NodeEntry<SlateElement>

      // 常规情况下选中文字外层 table-cell 进行跳转
      if (DomEditor.checkNodeType(above[0], 'table-cell')) {
        Transforms.select(editor, above[1])
      }

      let next = Editor.next(editor)
      if (next) {
        if (next[0] && (next[0] as BaseText).text) {
          // 多个单元格同时选中按 tab 导致错位修复
          next = (Editor.above(editor, { at: next[1] }) as NodeEntry<Descendant>) ?? next
        }
        Transforms.select(editor, next[1])
      } else {
        const topLevelNodes = newEditor.children || []
        const topLevelNodesLength = topLevelNodes.length
        // 在最后一个单元格按tab时table末尾如果没有p则插入p后光标切到p上
        if (DomEditor.checkNodeType(topLevelNodes[topLevelNodesLength - 1], 'table')) {
          const p = genEmptyParagraph()
          Transforms.insertNodes(newEditor, p, { at: [topLevelNodesLength] })
          // 在表格末尾插入p后再次执行使光标切到p上
          newEditor.handleTab()
        }
      }
      return
    }

    handleTab()
  }

  newEditor.deleteForward = unit => {
    const res = deleteHandler(newEditor)
    if (res) return // 命中 table cell ，自己处理删除

    // 执行默认的删除
    deleteForward(unit)
  }

  // 重新 normalize
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)
    if (type !== 'table') {
      // 未命中 table ，执行默认的 normalizeNode
      return normalizeNode([node, path])
    }
    const { children: rows = [] } = node as SlateElement
    const topLevelNodes = newEditor.children || []
    const topLevelNodesLength = topLevelNodes.length

    const isFirstNode = topLevelNodes[0] === node
    const isLastNode = topLevelNodes[topLevelNodesLength - 1] === node

    if (isFirstNode && !isLastNode) {
      // -------------- table 仅是 editor 第一个节点，需要前面插入 p --------------
      Transforms.insertNodes(newEditor, genEmptyParagraph(), { at: path })
    }
    if (isLastNode && !isFirstNode) {
      // -------------- table 仅是 editor 最后一个节点，需要后面插入 p --------------
      Transforms.insertNodes(newEditor, genEmptyParagraph(), { at: [path[0] + 1] })
    }
    if (isFirstNode && isLastNode) {
      // -------------- table 是 editor 唯一一个节点，需要前后都插入 p --------------
      Transforms.insertNodes(newEditor, genEmptyParagraph(), { at: path })
      Transforms.insertNodes(newEditor, genEmptyParagraph(), { at: [path[0] + 2] })
    }

    // --------------------- table 后面必须跟一个 p header blockquote（否则后面无法继续输入文字） ---------------------
    const nextNode = topLevelNodes[path[0] + 1] || {}
    if (SlateElement.isElement(nextNode)) {
      const { type: nextNodeType = '' } = nextNode
      if (
        nextNodeType !== 'paragraph' &&
        nextNodeType !== 'blockquote' &&
        !nextNodeType.startsWith('header')
      ) {
        // table node 后面不是 p 或 header ，则插入一个空 p
        const p = genEmptyParagraph()
        const insertPath = [path[0] + 1]
        Transforms.insertNodes(newEditor, p, {
          at: insertPath, // 在表格后面插入
        })
      }
    }

    // --------------------- table 前面不能是 table 或者 void（否则前面插入 p） ---------------------
    const prevNode = topLevelNodes[path[0] - 1] || {}
    if (SlateElement.isElement(prevNode)) {
      const prevNodeType = DomEditor.getNodeType(prevNode)
      if (prevNodeType === 'table' || newEditor.isVoid(prevNode)) {
        const p = genEmptyParagraph()
        Transforms.insertNodes(newEditor, p, {
          at: path, // 在表格前面插入
        })
      }
    }

    // --------------------- 保证 table 结构完整性（某些操作可能会导致操作 table 结构不完整） ---------------------
    // 是否正在修改中
    const changing = DomEditor.isChangingPath(newEditor, path)
    if (changing) {
      // table 正在修改中，则不操作
      return normalizeNode([node, path])
    }

    // 获取表格最多有多少列（表格结构乱掉之后，每一列数量不一样多）
    let maxColNum = 0
    rows.forEach((rowNode: Descendant) => {
      if (!SlateElement.isElement(rowNode)) return
      const cells = rowNode.children || []
      const l = cells.length
      if (maxColNum < l) maxColNum = l // TODO 这里没有考虑到 colSpan 和单元格合并
    })

    // 遍历每一行，修整
    rows.forEach((rowNode: Descendant, index: number) => {
      if (!SlateElement.isElement(rowNode)) return
      const cells = rowNode.children || []
      const rowPath = path.concat(index) // 当前 tr 的 path

      // 如果当前行，缺失 cell ，则补充
      // TODO 这里没有考虑到 colSpan 和单元格合并
      if (cells.length < maxColNum) {
        for (let i = cells.length; i < maxColNum; i++) {
          const cellPath = rowPath.concat(i) // cell path
          const newCell = { type: 'table-cell', children: [{ text: '' }] }
          Transforms.insertNodes(newEditor, newCell, {
            at: cellPath,
          })
        }
      }

      // 遍历每一个 cell ，修整
      cells.forEach((cellNode, i) => {
        if (!SlateElement.isElement(cellNode)) return

        if (cellNode.type !== 'table-cell') {
          const cellPath = rowPath.concat(i) // cell path
          Transforms.setNodes(newEditor, { type: 'table-cell' }, { at: cellPath })
        }
      })
      // table row 修复结束
    })
  }

  // 重写 insertData - 粘贴文本
  newEditor.insertData = (data: DataTransfer) => {
    const tableNode = DomEditor.getSelectedNodeByType(newEditor, 'table')
    if (tableNode == null) {
      insertData(data) // 执行默认的 insertData
      return
    }

    // 获取文本，并插入到 cell
    const text = data.getData('text/plain')

    // 单图或图文 插入
    if (text === '\n' || /<img[^>]+>/.test(data.getData('text/html'))) {
      insertData(data)
      return
    }

    Editor.insertText(newEditor, text)
  }

  // 重写 table-cell 中的全选
  newEditor.selectAll = () => {
    const selection = newEditor.selection
    if (selection == null) {
      selectAll()
      return
    }

    const cell = DomEditor.getSelectedNodeByType(newEditor, 'table-cell')
    if (cell == null) {
      selectAll()
      return
    }

    if (isEqual(selection.anchor.path, selection.focus.path) === false) {
      // 选中了多个 cell ，忽略
      selectAll()
      return
    }

    const text = Node.string(cell)
    const textLength = text.length
    if (textLength === 0) {
      selectAll()
      return
    }

    const path = DomEditor.findPath(newEditor, cell)
    const textPath = [...path, 0]
    const newSelection = {
      anchor: { path: textPath, offset: 0 },
      focus: { path: textPath, offset: textLength },
    }
    newEditor.select(newSelection) // 选中 table-cell 内部的全部文字
  }

  // 可继续修改其他 newEditor API ...

  // 返回 editor ，重要！
  return newEditor
}

export default withTable
