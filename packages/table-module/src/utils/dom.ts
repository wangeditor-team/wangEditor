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

export default $
