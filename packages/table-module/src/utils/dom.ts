/**
 * @description DOM 操作
 * @author wangfupeng
 */

import {
  $,
  append,
  on,
  focus,
  attr,
  val,
  html,
  dataset,
  addClass,
  removeClass,
  children,
  each,
  find,
  Dom7Array,
} from 'dom7'
export { Dom7Array } from 'dom7'

$.fn.append = append
$.fn.on = on
$.fn.focus = focus
$.fn.attr = attr
$.fn.val = val
$.fn.html = html
$.fn.dataset = dataset
$.fn.addClass = addClass
$.fn.removeClass = removeClass
$.fn.children = children
$.fn.each = each
$.fn.find = find

export default $

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
