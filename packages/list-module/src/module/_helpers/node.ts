/**
 * @description module node helpers
 * @author wangfupeng
 */

import { Editor, Node, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'

/**
 * 检查 node.type
 * @param n node
 * @param type node.type
 */
export function checkNodeType(n: Node, type: string): boolean {
  if (Editor.isEditor(n)) return false
  if (Element.isElement(n)) {
    // @ts-ignore
    return n.type === type
  }
  return false
}

/**
 * 根据 node.type 获取当前选中的 node
 * @param editor editor
 * @param type type
 */
export function getSelectedNodeByType(editor: IDomEditor, type: string): Node | null {
  const [nodeEntry] = Editor.nodes(editor, {
    match: n => checkNodeType(n, type),
    universal: true,
  })

  if (nodeEntry == null) return null
  return nodeEntry[0]
}

/**
 * 检查 node 是否被选中
 * @param editor editor
 * @param node slate node
 * @param type node.type
 */
export function isNodeSelected(editor: IDomEditor, node: Node, type: string): boolean {
  const [match] = Editor.nodes(editor, {
    match: n => checkNodeType(n, type),
    universal: true,
  })
  if (match == null) return false

  const [n] = match
  if (n === node) return true

  return false
}
