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
  Dom7Array,
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

/**
 * 获取 outerHTML
 * @param $elem dom7 elem
 */
export function getOuterHTML($elem: Dom7Array) {
  const $div = $('<div></div>')
  $div.append($elem)
  return $div.html()
}
