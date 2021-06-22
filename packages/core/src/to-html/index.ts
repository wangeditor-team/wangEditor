/**
 * @description to-html entry
 * @author wangfupeng
 */

import { Text as SlateText, Element as SlateElement } from 'slate'
import { IDomEditor } from '../editor/dom-editor'

// ------------------------------------ text style ------------------------------------

export type TextStyleToHtmlFnType = (node: SlateText | SlateElement, elemHtml: string) => string

export const TEXT_STYLE_TO_HTML_FN_LIST: TextStyleToHtmlFnType[] = []

/**
 * 注册 toHtml 处理文本样式的函数
 * @param fn 处理 toHtml 文本样式的函数
 */
export function registerTextStyleToHtmlHandler(fn: TextStyleToHtmlFnType) {
  TEXT_STYLE_TO_HTML_FN_LIST.push(fn)
}

// ------------------------------------ text node -> html ------------------------------------

export type TextToHtmlFnType = (textNode: SlateText, textHtml: string, editor: IDomEditor) => string

export const TEXT_TO_HTML_FN_LIST: TextToHtmlFnType[] = []

/**
 * 注册 textToHtml 函数
 * @param fn textToHtml 函数
 */
export function registerTextToHtmlHandler(fn: TextToHtmlFnType) {
  TEXT_TO_HTML_FN_LIST.push(fn)
}

// ------------------------------------ elem node -> html ------------------------------------

export type ElemToHtmlFnType = (
  elemNode: SlateElement,
  childrenHtml: string,
  editor: IDomEditor
) => string

// 注册 element->html 配置
export const ELEM_TO_HTML_CONF: {
  [key: string]: ElemToHtmlFnType // key 要和 node.type 对应 ！！！
} = {}

/**
 * 注册 elem to html 函数
 * @param conf { type, elemToHtml } ，type 即 node.type
 */
export function registerElemToHtmlConf(conf: { type: string; elemToHtml: ElemToHtmlFnType }) {
  const { type, elemToHtml } = conf
  const key = type || ''

  // key 如果重复了，就后者覆盖前者
  ELEM_TO_HTML_CONF[key] = elemToHtml
}
