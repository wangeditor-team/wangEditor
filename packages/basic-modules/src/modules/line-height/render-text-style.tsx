/**
 * @description register formats
 * @author wangfupeng
 */

import { Text, Element } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'
import { LineHeightElement } from './custom-types'

/**
 * 添加文本样式
 * @param node slate node
 * @param vnode vnode
 * @returns vnode
 */
export function renderTextStyle(node: Text | Element, vnode: VNode): VNode {
  if (!Element.isElement(node)) return vnode

  const { lineHeight } = node as LineHeightElement // 如 '1' '1.5'
  let styleVnode: VNode = vnode

  if (lineHeight) {
    addVnodeStyle(styleVnode, { lineHeight })
  }

  return styleVnode
}
