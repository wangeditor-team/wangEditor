/**
 * @description register formats
 * @author wangfupeng
 */

import { Text, Element } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'
import { IndentElement } from './custom-types'

/**
 * 添加文本样式
 * @param node slate node
 * @param vnode vnode
 * @returns vnode
 */
export function renderTextStyle(node: Text | Element, vnode: VNode): VNode {
  if (!Element.isElement(node)) return vnode

  const { indent } = node as IndentElement // 如 '32px'
  let styleVnode: VNode = vnode

  if (indent) {
    addVnodeStyle(styleVnode, { paddingLeft: indent })
  }

  return styleVnode
}
