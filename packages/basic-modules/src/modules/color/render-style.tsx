/**
 * @description render color style
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'
import { ColorText } from './custom-types'

/**
 * 添加样式
 * @param node text node
 * @param vnode vnode
 * @returns vnode
 */
export function renderStyle(node: Descendant, vnode: VNode): VNode {
  const { color, bgColor } = node as ColorText
  let styleVnode: VNode = vnode

  if (color) {
    addVnodeStyle(styleVnode, { color })
  }
  if (bgColor) {
    addVnodeStyle(styleVnode, { backgroundColor: bgColor })
  }

  return styleVnode
}
