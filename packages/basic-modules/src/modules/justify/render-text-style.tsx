/**
 * @description register formats
 * @author wangfupeng
 */

import { Text, Element } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'
import { JustifyElement } from './custom-types'

/**
 * 添加文本样式
 * @param node slate node
 * @param vnode vnode
 * @returns vnode
 */
export function renderTextStyle(node: Text | Element, vnode: VNode): VNode {
  if (!Element.isElement(node)) return vnode

  const { textAlign } = node as JustifyElement // 如 'left'/'right'/'center' 等
  let styleVnode: VNode = vnode

  if (textAlign) {
    addVnodeStyle(styleVnode, { textAlign })
  }

  return styleVnode
}
