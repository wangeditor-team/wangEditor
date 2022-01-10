/**
 * @description slate node to vnode
 * @author wangfupeng
 */

import { Element, Text, Node, Ancestor } from 'slate'
import { VNode } from 'snabbdom'
import { IDomEditor } from '../editor/interface'
import renderElement from './element/renderElement'
import renderText from './text/renderText'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'

/**
 * 根据 slate node 生成 snabbdom vnode
 * @param node node
 * @param index node index in parent.children
 * @param parent parent node
 * @param editor editor
 */
export function node2Vnode(node: Node, index: number, parent: Ancestor, editor: IDomEditor): VNode {
  // 设置相关 weakMap 信息
  NODE_TO_INDEX.set(node, index)
  NODE_TO_PARENT.set(node, parent)

  let vnode: VNode
  if (Element.isElement(node)) {
    // element
    vnode = renderElement(node as Element, editor)
  } else {
    // text
    vnode = renderText(node as Text, parent, editor)
  }

  return vnode
}
