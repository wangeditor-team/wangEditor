/**
 * @description DOM 操作
 * @author wangfupeng
 */

import { $, append, on, focus, attr, val, html, parent, hasClass, Dom7Array } from 'dom7'
export { Dom7Array } from 'dom7'

$.fn.append = append
$.fn.on = on
$.fn.focus = focus
$.fn.attr = attr
$.fn.val = val
$.fn.html = html
$.fn.parent = parent
$.fn.hasClass = hasClass

export default $

/**
 * 获取 tagName lower-case
 * @param $elem $elem
 */
export function getTagName($elem: Dom7Array): string {
  if ($elem.length) return $elem[0].tagName.toLowerCase()
  return ''
}
