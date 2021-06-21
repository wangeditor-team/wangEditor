/**
 * @description link helper
 * @author wangfupeng
 */

import { Editor, Range, Transforms } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

export function isMenuDisabled(editor: IDomEditor): boolean {
  if (editor.selection == null) return true

  const [match] = Editor.nodes(editor, {
    // @ts-ignore
    match: n => {
      // @ts-ignore
      const { type = '' } = n

      if (type === 'pre') return true // 代码块
      if (Editor.isVoid(editor, n)) return true // void node
      if (type === 'link') return true // 当前处于链接之内

      return false
    },
    universal: true,
  })

  if (match) return true
  return false
}
/**
 * 插入 link
 * @param editor editor
 * @param text text
 * @param url url
 */
export function insertLink(editor: IDomEditor, text: string, url: string) {
  if (!url) return
  if (!text) text = url // 无 text 则用 url 代替

  // 还原选区
  DomEditor.restoreSelection(editor)

  if (isMenuDisabled(editor)) return

  // 判断选区是否折叠
  const { selection } = editor
  if (selection == null) return
  const isCollapsed = Range.isCollapsed(selection)

  // 新建一个 link node
  const linkNode = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text }] : [],
  }

  // 执行：插入链接
  if (isCollapsed) {
    Transforms.insertNodes(editor, linkNode)
  } else {
    Transforms.wrapNodes(editor, linkNode, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}
