/**
 * @description DOM 操作
 * @author wangfupeng
 */

import $, {
  css,
  append,
  prepend,
  addClass,
  removeClass,
  hasClass,
  on,
  off,
  focus,
  attr,
  hide,
  show,
  parents,
  dataset,
  val,
  text,
  removeAttr,
  children,
  html,
  remove,
  find,
  width,
  height,
  Dom7Array,
  filter,
  empty,
} from 'dom7'
export { Dom7Array } from 'dom7'

if (css) $.fn.css = css
if (append) $.fn.append = append
if (prepend) $.fn.prepend = prepend
if (addClass) $.fn.addClass = addClass
if (removeClass) $.fn.removeClass = removeClass
if (hasClass) $.fn.hasClass = hasClass
if (on) $.fn.on = on
if (off) $.fn.off = off
if (focus) $.fn.focus = focus
if (attr) $.fn.attr = attr
if (removeAttr) $.fn.removeAttr = removeAttr
if (hide) $.fn.hide = hide
if (show) $.fn.show = show
if (parents) $.fn.parents = parents
if (dataset) $.fn.dataset = dataset
if (val) $.fn.val = val
if (text) $.fn.text = text
if (html) $.fn.html = html
if (children) $.fn.children = children
if (remove) $.fn.remove = remove
if (find) $.fn.find = find
if (width) $.fn.width = width
if (height) $.fn.height = height
if (filter) $.fn.filter = filter
if (empty) $.fn.empty = empty

export default $

/**
 * 判断 str 是不是纯字符串，而不是 html tag
 * @param str str
 */
export function isPlainText(str: string) {
  const $container = $(`<div>${str}</div>`)

  // 获取 children length （过滤 `<br>`）
  const childrenLength = $container.children().filter((child: DOMElement) => {
    if (child.tagName === 'BR') return false
    return true
  }).length

  return childrenLength === 0
}

/**
 * 获取 outerHTML
 * @param $elem dom7 elem
 */
export function getOuterHTML($elem: Dom7Array) {
  if ($elem.length === 0) return ''
  return $elem[0].outerHTML
}

/**
 * 获取 tagName lower-case
 * @param $elem $elem
 */
export function getTagName($elem: Dom7Array): string {
  if ($elem.length) return $elem[0].tagName.toLowerCase()
  return ''
}

/**
 * 获取 $elem 某一个 style 值
 * @param $elem $elem
 * @param styleKey style key
 */
export function getStyleValue($elem: Dom7Array, styleKey: string): string {
  let res = ''

  const styleStr = $elem.attr('style') || '' // 如 'line-height: 2.5; color: red;'
  const styleArr = styleStr.split(';') // 如 ['line-height: 2.5', ' color: red', '']
  const length = styleArr.length
  for (let i = 0; i < length; i++) {
    const styleItemStr = styleArr[i] // 如 'line-height: 2.5'
    if (styleItemStr) {
      const arr = styleItemStr.split(':') // ['line-height', ' 2.5']
      if (arr[0].trim() === styleKey) {
        res = arr[1].trim()
      }
    }
  }

  return res
}

// COMPAT: This is required to prevent TypeScript aliases from doing some very
// weird things for Slate's types with the same name as globals. (2019/11/27)
// https://github.com/microsoft/TypeScript/issues/35002
import DOMNode = globalThis.Node
import DOMComment = globalThis.Comment
import DOMElement = globalThis.Element
import DOMText = globalThis.Text
import DOMRange = globalThis.Range
import DOMSelection = globalThis.Selection
import DOMStaticRange = globalThis.StaticRange
export { DOMNode, DOMComment, DOMElement, DOMText, DOMRange, DOMSelection, DOMStaticRange }
