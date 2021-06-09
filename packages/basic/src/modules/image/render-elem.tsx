/**
 * @description image render elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'
import { isNodeSelected } from '../_helpers/node'

/**
 * render image elem
 * @param elemNode slate elem
 * @param children children
 * @param editor editor
 * @returns vnode
 */
function renderImage(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // @ts-ignore
  const { src, alt = '', url = '', style = {} } = elemNode
  const { width = '', height = '' } = style

  const renderStyle: any = {}

  // 图片是否选中
  const selected = isNodeSelected(editor, elemNode, 'image')
  renderStyle.boxShadow = selected ? '0 0 0 3px #B4D5FF' : 'none'
  // TODO 选中时，显示拖拽框（不要在这里渲染，考虑一个独立的插件）
  // TODO 抽离选中样式

  // 尺寸
  if (width) renderStyle.width = width
  if (height) renderStyle.height = height

  const vnode = <img style={renderStyle} src={src} alt={alt} data-href={url} />
  // 【注意】void node 中，renderElem 不用处理 children 。core 会统一处理。

  return vnode
}

const renderImageConf = {
  type: 'image', // 和 elemNode.type 一致
  renderFn: renderImage,
}

export { renderImageConf }
