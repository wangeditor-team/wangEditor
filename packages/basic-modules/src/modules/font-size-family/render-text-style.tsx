/**
 * @description register formats
 * @author wangfupeng
 */

import { Text as SlateText, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'

/**
 * 添加文本样式
 * @param node slate node
 * @param vnode vnode
 * @returns vnode
 */
export function renderTextStyle(node: SlateText | SlateElement, vnode: VNode): VNode {
  // @ts-ignore
  const { fontSize, fontFamily } = node
  let styleVnode: VNode = vnode

  if (fontSize) {
    addVnodeStyle(styleVnode, { fontSize })
  }
  if (fontFamily) {
    addVnodeStyle(styleVnode, { fontFamily })
  }

  return styleVnode
}
