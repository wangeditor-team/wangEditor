/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Transforms, Range } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { List2ItemElement } from './custom-types'

/**
 * 获取选中的 top elems
 * @param editor editor
 */
function getTopSelectedElemsBySelection(editor: IDomEditor) {
  return Editor.nodes(editor, {
    at: editor.selection || undefined,
    match: n => DomEditor.findPath(editor, n).length === 1, // 只匹配顶级元素
  })
}

function withList<T extends IDomEditor>(editor: T): T {
  const { deleteBackward, handleTab } = editor
  const newEditor = editor

  // 重写 deleteBackward - 降低 level 或者转换为 p 元素
  newEditor.deleteBackward = unit => {
    const { selection } = newEditor
    if (selection == null) {
      deleteBackward(unit)
      return
    }

    if (Range.isExpanded(selection)) {
      deleteBackward(unit)
      return
    }

    const listItemElem = DomEditor.getSelectedNodeByType(newEditor, 'list2-item')
    if (listItemElem == null) {
      // 未匹配到 list2-item
      deleteBackward(unit)
      return
    }

    if (selection.focus.offset === 0) {
      // 选中了当前 list-item 文本的开头，此时按删除键，应该降低 level 或转换为 p 元素
      const { level = 0 } = listItemElem as List2ItemElement
      if (level > 0) {
        // 降低 level
        Transforms.setNodes(newEditor, { level: level - 1 })
      } else {
        // 转换为 p 元素
        Transforms.setNodes(newEditor, {
          type: 'paragraph',
          ordered: undefined,
          level: undefined,
        })
      }
      return
    }

    // 其他情况
    deleteBackward(unit)
  }

  // 重写 tab - 当选中 list-item 文本开头时，增加 level
  newEditor.handleTab = () => {
    const { selection } = newEditor
    if (selection == null) {
      handleTab()
      return
    }

    // 选区是合并的，判断单个 list-item 即可
    if (Range.isCollapsed(selection)) {
      const listItemElem = DomEditor.getSelectedNodeByType(newEditor, 'list2-item')
      if (listItemElem == null) {
        // 未匹配到 list2-item
        handleTab()
        return
      }

      if (selection.focus.offset === 0) {
        // 选中了当前 list-item 文本的开头，此时按 tab 应该增加 level
        const { level = 0 } = listItemElem as List2ItemElement
        Transforms.setNodes(newEditor, { level: level + 1 })
        return
      }
    }

    // 选区是展开的，要判断多个 list-item
    if (Range.isExpanded(selection)) {
      let list2ItemNum = 0 // 选中的 list2-item 有几个
      let hasOtherElem = false // 是否有其他元素

      for (const entry of getTopSelectedElemsBySelection(newEditor)) {
        const [elem] = entry
        const type = DomEditor.getNodeType(elem)
        if (type === 'list2-item') list2ItemNum++
        else hasOtherElem = true
      }

      if (hasOtherElem || list2ItemNum <= 1) {
        // 选中了其他元素，或者只选中一个 list-item ，则执行默认行为
        handleTab()
        return
      }

      // 未选中其他元素，且选中多个 list-item ，则增加 level
      for (const entry of getTopSelectedElemsBySelection(newEditor)) {
        const [elem, path] = entry
        const { level = 0 } = elem as List2ItemElement
        Transforms.setNodes(newEditor, { level: level + 1 }, { at: path })
      }
      return
    }

    // 其他情况
    handleTab()
  }

  return newEditor
}

export default withList
