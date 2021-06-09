/**
 * @description register formats
 * @author wangfupeng
 */

import { Text as SlateText, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../utils/vdom'

/**
 * 添加文本样式
 * @param node slate node
 * @param vnode vnode
 * @returns vnode
 */
export function addTextStyle(node: SlateText | SlateElement, vnode: VNode): VNode {
  const leafNode = node as SlateText & { [key: string]: string }
  let styleVnode: VNode = vnode

  // 根据 token type 设置高亮的颜色
  let color = ''

  if (leafNode.comment) color = 'gray'
  if (leafNode.operator || leafNode.url) color = '#9a6e3a'
  if (leafNode.keyword) color = '#07a'
  if (leafNode.variable || leafNode.regex) color = '#e90'
  if (
    leafNode.number ||
    leafNode.boolean ||
    leafNode.tag ||
    leafNode.constant ||
    leafNode.symbol ||
    leafNode['attr-name'] ||
    leafNode.selector
  ) {
    color = '#905'
  }
  if (leafNode.punctuation) color = '#999'
  if (leafNode.string || leafNode.char) color = '#690'
  if (leafNode.function || leafNode['class-name']) color = '#dd4a68'

  // 如果命中了关键字，则设置 style
  if (color) {
    const style = {
      fontFamily: 'monospace',
      background: 'hsla(0, 0%, 100%, .5)',
      color,
    }
    addVnodeStyle(styleVnode, style)
  }

  return styleVnode
}
