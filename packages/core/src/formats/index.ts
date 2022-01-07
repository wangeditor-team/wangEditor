/**
 * @description formats entry
 * @author wangfupeng
 */

import { Element as SlateElement, Descendant } from 'slate'
import { VNode } from 'snabbdom'
import { IDomEditor } from '../editor/interface'

// ------------------------------------ render style ------------------------------------

export type RenderStyleFnType = (node: Descendant, vnode: VNode) => VNode

// 存储：处理文本样式的函数，如 b u color 等
export const RENDER_STYLE_HANDLER_LIST: RenderStyleFnType[] = []

/**
 * 注册处理文本样式的函数
 * @param fn 处理文本样式的函数
 */
export function registerStyleHandler(fn: RenderStyleFnType) {
  RENDER_STYLE_HANDLER_LIST.push(fn)
}

// ------------------------------------ render elem ------------------------------------

export type RenderElemFnType = (
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
) => VNode

// 注册 render element 配置
export const RENDER_ELEM_CONF: {
  [key: string]: RenderElemFnType // key 要和 node.type 对应 ！！！
} = {}

export interface IRenderElemConf {
  type: string
  renderElem: RenderElemFnType
}

/**
 * 注册 render elem 函数
 * @param conf { type, renderElem } ，type 即 node.type
 */
export function registerRenderElemConf(conf: IRenderElemConf) {
  const { type, renderElem } = conf
  const key = type || ''

  // 如果 key 重复了，就后者覆盖前者
  RENDER_ELEM_CONF[key] = renderElem
}
