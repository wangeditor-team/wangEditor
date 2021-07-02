/**
 * @description helper
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

export function isMenuDisabled(editor: IDomEditor, mark?: string): boolean {
  if (editor.selection == null) return true

  const [match] = Editor.nodes(editor, {
    match: n => {
      const type = DomEditor.getNodeType(n)

      if (type === 'pre') return true // 代码块
      if (Editor.isVoid(editor, n)) return true // void node

      if (mark === 'bold') {
        // header 中禁用 bold
        if (type.startsWith('header')) return true
      }

      return false
    },
    universal: true,
  })

  // 命中，则禁用
  if (match) return true
  return false
}
