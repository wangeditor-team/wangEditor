/**
 * @description 获取 elem render 函数
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/interface'
import { RENDER_ELEM_CONF, RenderElemFnType } from '../index'

/**
 * 默认的 render elem
 * @param elemNode elem
 * @param editor editor
 * @param children children vnode
 * @returns vnode
 */
function defaultRender(
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const Tag = editor.isInline(elemNode) ? 'span' : 'div'

  const vnode = <Tag>{children}</Tag>

  return vnode
}

/**
 * 根据 elemNode.type 获取 renderElement 函数
 * @param type elemNode.type
 */
function getRenderElem(type: string): RenderElemFnType {
  const fn = RENDER_ELEM_CONF[type]
  return fn || defaultRender
}

export default getRenderElem
