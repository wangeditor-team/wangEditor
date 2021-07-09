/**
 * @description menu helpers
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { SVG_DOWN_ARROW } from '../../constants/svg'

/**
 * 清理 svg 的样式
 * @param $elem svg elem
 */
export function clearSvgStyle($elem: Dom7Array) {
  $elem.removeAttr('width')
  $elem.removeAttr('height')
  $elem.removeAttr('fill')
  $elem.removeAttr('class')
  $elem.removeAttr('t')
  $elem.removeAttr('p-id')

  const children = $elem.children()
  if (children.length) {
    clearSvgStyle(children)
  }
}

/**
 * 向下箭头 icon svg
 */
export function gen$downArrow() {
  const $downArrow = $(SVG_DOWN_ARROW)
  return $downArrow
}

/**
 * bar item 分割线
 */
export function gen$barItemDivider() {
  return $('<div class="w-e-bar-divider"></div>')
}
