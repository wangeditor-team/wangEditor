/**
 * @description header helper
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

/**
 * 获取 node type（'header1' 'header2' 等），未匹配则返回 'paragraph'
 */
export function getHeaderType(editor: IDomEditor): string {
  const [match] = Editor.nodes(editor, {
    match: n => {
      const type = DomEditor.getNodeType(n)
      return type.startsWith('header') // 匹配 node.type 是 header 开头的 node
    },
    universal: true,
  })

  // 未匹配到 header
  if (match == null) return 'paragraph'

  // 匹配到 header
  const [n] = match

  return DomEditor.getNodeType(n)
}

export function isMenuDisabled(editor: IDomEditor): boolean {
  if (editor.selection == null) return true

  const [nodeEntry] = Editor.nodes(editor, {
    match: n => {
      const type = DomEditor.getNodeType(n)

      // 只可用于 p 和 header
      if (type === 'paragraph') return true
      if (type.startsWith('header')) return true

      return false
    },
    universal: true,
    mode: 'highest', // 匹配最高层级
  })

  // 匹配到 p header ，不禁用
  if (nodeEntry) {
    return false
  }
  // 未匹配到 p header ，则禁用
  return true
}

/**
 * 设置 node type （'header1' 'header2' 'paragraph' 等）
 */
export function setHeaderType(editor: IDomEditor, type: string) {
  if (!type) return

  // 执行命令
  Transforms.setNodes(editor, {
    type: type,
  })
}
