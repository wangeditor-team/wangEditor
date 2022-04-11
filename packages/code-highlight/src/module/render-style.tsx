/**
 * @description render code highlight style
 * @author wangfupeng
 */

import { Text as SlateText, Descendant } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeClassName } from '../utils/vdom'
import { prismTokenTypes } from '../vendor/prism'

/**
 * 添加样式
 * @param node slate text
 * @param vnode vnode
 * @returns vnode
 */
export function renderStyle(node: Descendant, vnode: VNode): VNode {
  const leafNode = node as SlateText & { [key: string]: string }
  let styleVnode: VNode = vnode

  let className = ''
  prismTokenTypes.forEach(type => {
    if (leafNode[type]) className = type
  })

  if (className) {
    className = `token ${className}` // 如 'token keyword' - prismjs 渲染的规则
    addVnodeClassName(styleVnode, className)
  }

  return styleVnode
}
