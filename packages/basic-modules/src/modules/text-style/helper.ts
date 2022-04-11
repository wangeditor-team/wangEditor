/**
 * @description helper
 * @author wangfupeng
 */

import { Editor, Node } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

export function isMenuDisabled(editor: IDomEditor, mark?: string): boolean {
  if (editor.selection == null) return true

  const [match] = Editor.nodes(editor, {
    match: n => {
      const type = DomEditor.getNodeType(n)

      if (type === 'pre') return true // 代码块
      if (Editor.isVoid(editor, n)) return true // void node

      return false
    },
    universal: true,
  })

  // 命中，则禁用
  if (match) return true
  return false
}

export function removeMarks(editor: IDomEditor, textNode: Node) {
  // 遍历 text node 属性，清除样式
  const keys = Object.keys(textNode as object)
  keys.forEach(key => {
    if (key === 'text') {
      // 保留 text 属性，text node 必须的
      return
    }
    // 其他属性，全部清除
    Editor.removeMark(editor, key)
  })
}
