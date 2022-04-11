/**
 * @description vdom utils fn
 * @author wangfupeng
 */

import { VNode, VNodeStyle } from 'snabbdom'

/**
 * 给 vnode 添加 className
 * @param vnode vnode
 * @param className css class
 */
export function addVnodeClassName(vnode: VNode, className: string) {
  if (vnode.data == null) vnode.data = {}
  const data = vnode.data
  if (data.props == null) data.props = {}

  Object.assign(data.props, { className })
}

/**
 * 给 vnode 添加样式
 * @param vnode vnode
 * @param newStyle { key: val }
 */
export function addVnodeStyle(vnode: VNode, newStyle: VNodeStyle) {
  if (vnode.data == null) vnode.data = {}
  const data = vnode.data
  if (data.style == null) data.style = {}

  Object.assign(data.style, newStyle)
}
