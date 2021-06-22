/**
 * @description 添加文本相关的样式
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { VNode } from 'snabbdom'
import { TEXT_STYLE_HANDLER_LIST } from '../index'

/**
 * 给字符串增加样式
 * @param node slate elem node
 * @param vnode elem Vnode
 */
function renderTextStyle(elem: SlateElement, vnode: VNode): VNode {
  let newVnode = vnode

  TEXT_STYLE_HANDLER_LIST.forEach(styleHandler => {
    newVnode = styleHandler(elem, vnode)
  })

  return newVnode
}

export default renderTextStyle
