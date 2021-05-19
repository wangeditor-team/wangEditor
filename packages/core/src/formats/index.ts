/**
 * @description formats entry
 * @author wangfupeng
 */

import { Text as SlateText, Element as SlateElement } from 'slate'
import { VNode } from 'snabbdom'
import { IDomEditor } from '../editor/dom-editor'

// ------------------------------------ 处理 text 样式 ------------------------------------

type TextStyleFn = (node: SlateText | SlateElement, vnode: VNode) => VNode

// 存储：处理文本样式的函数，如 b u color 等
export const TEXT_STYLE_HANDLER_LIST: TextStyleFn[] = []

/**
 * 注册处理文本样式的函数
 * @param fn 处理文本样式的函数
 */
export function registerTextStyleHandler(fn: TextStyleFn) {
  TEXT_STYLE_HANDLER_LIST.push(fn)
}

// ------------------------------------ render elem ------------------------------------

export type RenderFnType = (
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
) => VNode

// 注册 render element 配置
export const RENDER_ELEM_CONF: {
  [key: string]: RenderFnType // key 要和 node.type 对应 ！！！
} = {}

/**
 * 注册 render elem 函数
 * @param key 和 slate node.type 统一，重要
 * @param renderFn 渲染函数
 */
export function registerRenderElemConf(key: string, renderFn: RenderFnType) {
  if (RENDER_ELEM_CONF[key] != null) {
    throw new Error(`duplicated key '${key}' in renderElemConf`)
  }

  RENDER_ELEM_CONF[key] = renderFn
}
