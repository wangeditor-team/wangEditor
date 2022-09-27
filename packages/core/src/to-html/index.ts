/**
 * @description to-html entry
 * @author wangfupeng
 */

import { Element as SlateElement, Descendant } from 'slate'
import { IDomEditor } from '../editor/interface'

// ------------------------------------ style to html ------------------------------------

export type styleToHtmlFnType = (node: Descendant, elemHtml: string) => string

export const STYLE_TO_HTML_FN_LIST: styleToHtmlFnType[] = []

/**
 * 注册 toHtml 处理文本样式的函数
 * @param fn 处理 toHtml 文本样式的函数
 */
export function registerStyleToHtmlHandler(fn: styleToHtmlFnType) {
  STYLE_TO_HTML_FN_LIST.push(fn)
}

// ------------------------------------ elem node to html ------------------------------------

interface IElemToHtmlRes {
  html: string
  prefix?: string
  suffix?: string
}

export type ElemToHtmlFnType = (
  elemNode: SlateElement,
  childrenHtml: string,
  editor?: IDomEditor
) => string | IElemToHtmlRes

// 注册 element->html 配置
export const ELEM_TO_HTML_CONF: {
  [key: string]: ElemToHtmlFnType // key 要和 node.type 对应 ！！！
} = {}

export interface IElemToHtmlConf {
  type: string
  elemToHtml: ElemToHtmlFnType
}

/**
 * 注册 elem to html 函数
 * @param conf { type, elemToHtml } ，type 即 node.type
 */
export function registerElemToHtmlConf(conf: IElemToHtmlConf) {
  const { type, elemToHtml } = conf
  const key = type || ''

  // key 如果重复了，就后者覆盖前者
  ELEM_TO_HTML_CONF[key] = elemToHtml
}
