/**
 * @description render text style
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { StyledText } from './custom-types'

/**
 * 添加样式
 * @param node slate text
 * @param vnode vnode
 * @returns vnode
 */
export function renderStyle(node: Descendant, vnode: VNode): VNode {
  const { bold, italic, underline, code, through, sub, sup } = node as StyledText
  let styleVnode: VNode = vnode

  // color bgColor 在另外的菜单

  if (bold) {
    styleVnode = <strong>{styleVnode}</strong>
  }
  if (code) {
    styleVnode = <code>{styleVnode}</code>
  }
  if (italic) {
    styleVnode = <em>{styleVnode}</em>
  }
  if (underline) {
    styleVnode = <u>{styleVnode}</u>
  }
  if (through) {
    styleVnode = <s>{styleVnode}</s>
  }
  if (sub) {
    styleVnode = <sub>{styleVnode}</sub>
  }
  if (sup) {
    styleVnode = <sup>{styleVnode}</sup>
  }

  return styleVnode
}
