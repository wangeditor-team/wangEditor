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
  const { lineHeight } = node // 如 '1' '1.5'
  let styleVnode: VNode = vnode

  if (lineHeight) {
    addVnodeStyle(styleVnode, { lineHeight })
  }

  return styleVnode
}
