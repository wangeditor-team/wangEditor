/**
 * @description vdom utils fn
 * @author wangfupeng
 */

import { VNode, VNodeStyle, Dataset } from 'snabbdom'

// /**
//  * 给 vnode 添加 dataset
//  * @param vnode vnode
//  * @param newDataset { key: val }
//  */
// export function addVnodeDataset(vnode: VNode, newDataset: Dataset) {
//   if (vnode.data == null) vnode.data = {}
//   const data = vnode.data
//   if (data.dataset == null) data.dataset = {}

//   Object.assign(data.dataset, newDataset)
// }

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
