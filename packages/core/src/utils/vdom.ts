/**
 * @description vdom 相关方法
 * @author wangfupeng
 */

import camelCase from 'lodash.camelcase'
import {
  VNode,
  init,
  classModule,
  propsModule,
  styleModule,
  datasetModule,
  VNodeStyle,
  Props,
  Dataset,
  eventListenersModule,
  attributesModule,
} from 'snabbdom'

export type PatchFn = (oldVnode: VNode | Element, vnode: VNode) => VNode

/**
 * 创建 snabbdom patch
 * @returns snabbdom patch 函数
 */
export function genPatchFn(): PatchFn {
  const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    datasetModule,
    eventListenersModule, // attaches event listeners
    attributesModule,
  ])
  return patch
}

// vnode.data 保留属性，参考 snabbdom VNodeData
const DATA_PRESERVE_KEYS = ['props', 'attrs', 'style', 'dataset', 'on', 'hook']

/**
 * 整理 vnode.data ，将暴露出来的零散属性（如 id className data-xxx）放在 data.props 或 data.dataset
 * @param vnode vnode
 */
export function normalizeVnodeData(vnode: VNode) {
  const { data = {}, children = [] } = vnode
  const dataKeys = Object.keys(data)
  dataKeys.forEach((key: string) => {
    const value = data[key]

    // 赋值 key
    if (key === 'key') {
      vnode.key = value
      return
    }

    // 忽略 data 保留属性
    if (DATA_PRESERVE_KEYS.includes(key)) return

    // dataset
    if (key.startsWith('data-')) {
      let datasetKey = key.slice(5) // 截取掉最前面的 'data-'
      datasetKey = camelCase(datasetKey) // 转为驼峰写法

      // 存储到 data.dataset
      addVnodeDataset(vnode, { [datasetKey]: value })

      delete data[key] // 删掉原有的属性
      return
    }

    // 其他的，都算 props ，存储到 props
    addVnodeProp(vnode, { [key]: value })

    delete data[key] // 删掉原有的属性
  })

  // 遍历 children
  if (children.length > 0) {
    children.forEach(child => {
      if (typeof child === 'string') return
      normalizeVnodeData(child)
    })
  }
}

/**
 * 给 vnode 添加 prop
 * @param vnode vnode
 * @param newProp { key: val }
 */
export function addVnodeProp(vnode: VNode, newProp: Props) {
  if (vnode.data == null) vnode.data = {}
  const data = vnode.data
  if (data.props == null) data.props = {}

  Object.assign(data.props, newProp)
}

/**
 * 给 vnode 添加 dataset
 * @param vnode vnode
 * @param newDataset { key: val }
 */
export function addVnodeDataset(vnode: VNode, newDataset: Dataset) {
  if (vnode.data == null) vnode.data = {}
  const data = vnode.data
  if (data.dataset == null) data.dataset = {}

  Object.assign(data.dataset, newDataset)
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
