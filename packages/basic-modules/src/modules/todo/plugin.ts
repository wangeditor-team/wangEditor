/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Node, Transforms, Range } from 'slate'
import { DomEditor, IDomEditor } from '@wangeditor/core'

function withTodo<T extends IDomEditor>(editor: T): T {
  const { deleteBackward } = editor
  const newEditor = editor

  /**
   * 删除 todo 无内容时，变为 paragraph
   */
  newEditor.deleteBackward = unit => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      // 获取选中的 todo
      const selectedTodo = DomEditor.getSelectedNodeByType(editor, 'todo')
      if (selectedTodo) {
        if (Node.string(selectedTodo).length === 0) {
          // 当前 todo 已经没有文字，则转换为 paragraph
          Transforms.setNodes(editor, { type: 'paragraph' }, { mode: 'highest' })
          return
        }
      }
    }

    deleteBackward(unit)
  }

  return newEditor
}

export default withTodo
