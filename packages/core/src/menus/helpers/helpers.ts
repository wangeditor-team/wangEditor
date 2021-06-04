/**
 * @description menu helpers
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'

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
  const $downArrow = $(
    `<svg viewBox="0 0 1024 1024"><path d="M498.7 655.8l-197.6-268c-8.1-10.9-0.3-26.4 13.3-26.4h395.2c13.6 0 21.4 15.4 13.3 26.4l-197.6 268c-6.6 9-20 9-26.6 0z"></path></svg>`
  )
  return $downArrow
}

/**
 * bar item 分割线
 */
export function gen$barItemDivider() {
  return $('<div class="w-e-bar-divider"></div>')
}
