/**
 * @description parse html
 * @author wangfupeng
 */

import { DOMElement } from '../utils/dom'
import { Element as SlateElement, Descendant } from 'slate'
import { IDomEditor } from '../editor/interface'

// 常见的 text tag
export const TEXT_TAGS = [
  'span',
  'b',
  'strong',
  'i',
  'em',
  's',
  'strike',
  'u',
  'font',
  'sub',
  'sup',
]

// ------------------------------------ pre-parse html ------------------------------------
export type PreParseHtmlFnType = ($node: DOMElement) => DOMElement

export interface IPreParseHtmlConf {
  selector: string // css 选择器，如 `p` `div[data-type="xxx"]`
  preParseHtml: PreParseHtmlFnType
}

export const PRE_PARSE_HTML_CONF_LIST: IPreParseHtmlConf[] = []

/**
 * 注册 pre-parse html 配置
 * @param conf pre-parse html conf
 */
export function registerPreParseHtmlConf(conf: IPreParseHtmlConf) {
  PRE_PARSE_HTML_CONF_LIST.push(conf)
}

// ------------------------------------ parse style html ------------------------------------

export type ParseStyleHtmlFnType = (
  $node: DOMElement,
  node: Descendant,
  editor: IDomEditor
) => Descendant

export const PARSE_STYLE_HTML_FN_LIST: ParseStyleHtmlFnType[] = []

/**
 * 注册 parseStyleHtml 函数
 * @param fn parse style html 的函数
 */
export function registerParseStyleHtmlHandler(fn: ParseStyleHtmlFnType) {
  PARSE_STYLE_HTML_FN_LIST.push(fn)
}

// ------------------------------------ parse elem html ------------------------------------

export type ParseElemHtmlFnType = (
  $elem: DOMElement,
  children: Descendant[],
  editor: IDomEditor
) => SlateElement | SlateElement[]

export const PARSE_ELEM_HTML_CONF: {
  [key: string]: ParseElemHtmlFnType // key 是 css 选择器，如 `p` `div[data-type="xxx"]`
} = {}

export interface IParseElemHtmlConf {
  selector: string
  parseElemHtml: ParseElemHtmlFnType
}

export function registerParseElemHtmlConf(conf: IParseElemHtmlConf) {
  const { selector, parseElemHtml } = conf
  PARSE_ELEM_HTML_CONF[selector] = parseElemHtml
}
