/**
 * @description elem -> html
 * @author wangfupeng
 */

import { Editor, Element } from 'slate'
import { IDomEditor } from '../editor/interface'
import node2html from './node2html'
import { ElemToHtmlFnType, ELEM_TO_HTML_CONF, STYLE_TO_HTML_FN_LIST } from './index'

/**
 * 默认的 toHtml 函数
 * @param elemNode elem node
 * @param childrenHtml children html
 * @param editor editor
 */
function defaultParser(elemNode: Element, childrenHtml: string, editor: IDomEditor) {
  const isInline = editor.isInline(elemNode)
  const tag = isInline ? 'span' : 'div'
  return `<${tag}>${childrenHtml}</${tag}>`
}

/**
 * 根据 type 获取 toHtml 函数
 * @param type node.type
 */
function getParser(type: string): ElemToHtmlFnType {
  const fn = ELEM_TO_HTML_CONF[type]
  return fn || defaultParser
}

function elemToHtml(elemNode: Element, editor: IDomEditor): string {
  const { type = '', children = [] } = elemNode
  const isVoid = Editor.isVoid(editor, elemNode)

  // 计算 children html
  let childrenHtml = ''
  if (!isVoid) {
    // 非 void node
    childrenHtml = children.map(child => node2html(child, editor)).join('')
  }

  // 生成 html
  const toHtmlFn = getParser(type)
  const res = toHtmlFn(elemNode, childrenHtml, editor)

  let elemHtml = ''
  if (typeof res === 'string') elemHtml = res
  else elemHtml = res.html || ''

  // 添加样式（如 text-align line-height 等）
  if (!isVoid) {
    STYLE_TO_HTML_FN_LIST.forEach(fn => (elemHtml = fn(elemNode, elemHtml)))
  }

  // 直接返回 html 字符串
  if (typeof res === 'string') return elemHtml

  // 解析 prefix suffix （如 list-item）
  const { prefix = '', suffix = '' } = res
  if (prefix) elemHtml = prefix + elemHtml
  if (suffix) elemHtml = elemHtml + suffix
  return elemHtml
}

export default elemToHtml
