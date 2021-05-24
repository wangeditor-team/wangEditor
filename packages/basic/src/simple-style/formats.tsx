/**
 * @description register formats
 * @author wangfupeng
 */

import { Text as SlateText, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'

/**
 * 添加文本样式
 * @param node slate node
 * @param vnode vnode
 * @returns vnode
 */
export function addTextStyle(node: SlateText | SlateElement, vnode: VNode): VNode {
  // @ts-ignore
  const { bold, italic, underline, code, through } = node
  let styleVnode: VNode = vnode

  // color bgColor

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

  return styleVnode
}
