/**
 * @description text 样式
 * @author wangfupeng
 */

import { Text as SlateText } from 'slate'
import { VNode } from 'snabbdom'
import { RENDER_STYLE_HANDLER_LIST } from '../index'

/**
 * 给字符串增加样式
 * @param leafNode slate text leaf node
 * @param textVnode textVnode
 */
function addTextVnodeStyle(leafNode: SlateText, textVnode: VNode): VNode {
  let newTextVnode = textVnode

  RENDER_STYLE_HANDLER_LIST.forEach(styleHandler => {
    newTextVnode = styleHandler(leafNode, newTextVnode)
  })

  return newTextVnode
}

export default addTextVnodeStyle
