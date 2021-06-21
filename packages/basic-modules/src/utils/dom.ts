/**
 * @description DOM 操作
 * @author wangfupeng
 */

import {
  $,
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
} from 'dom7'
export { Dom7Array } from 'dom7'

$.fn.css = css
$.fn.append = append
$.fn.prepend = prepend
$.fn.addClass = addClass
$.fn.removeClass = removeClass
$.fn.hasClass = hasClass
$.fn.on = on
$.fn.off = off
$.fn.focus = focus
$.fn.attr = attr
$.fn.removeAttr = removeAttr
$.fn.hide = hide
$.fn.show = show
$.fn.parents = parents
$.fn.dataset = dataset
$.fn.val = val
$.fn.text = text
$.fn.html = html
$.fn.children = children
$.fn.remove = remove
$.fn.find = find
$.fn.width = width
$.fn.height = height

export default $
