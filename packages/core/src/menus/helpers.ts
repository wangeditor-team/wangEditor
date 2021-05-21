/**
 * @description menu helpers
 * @author wangfupeng
 */

import $, { Dom7Array } from '../utils/dom'

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
