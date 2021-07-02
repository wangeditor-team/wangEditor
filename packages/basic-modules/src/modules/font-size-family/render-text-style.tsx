/**
 * @description register formats
 * @author wangfupeng
 */

import { Text as SlateText, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'
import { FontSizeAndFamilyText } from './custom-types'

/**
 * 添加文本样式
 * @param node slate node
 * @param vnode vnode
 * @returns vnode
 */
export function renderTextStyle(node: SlateText | SlateElement, vnode: VNode): VNode {
  const { fontSize, fontFamily } = node as FontSizeAndFamilyText
  let styleVnode: VNode = vnode

  if (fontSize) {
    addVnodeStyle(styleVnode, { fontSize })
  }
  if (fontFamily) {
    addVnodeStyle(styleVnode, { fontFamily })
  }

  return styleVnode
}
