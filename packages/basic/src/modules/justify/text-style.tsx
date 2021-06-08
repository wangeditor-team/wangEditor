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
export function addTextStyle(node: SlateText | SlateElement, vnode: VNode): VNode {
  // @ts-ignore
  const { textAlign } = node // 如 'left'/'right'/'center' 等
  let styleVnode: VNode = vnode

  if (textAlign) {
    addVnodeStyle(styleVnode, { textAlign })
  }

  return styleVnode
}
