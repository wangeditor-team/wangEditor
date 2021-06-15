/**
 * @description register formats
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'

function genRenderFn(level: number) {
  /**
   * render header elem
   * @param elemNode slate elem
   * @param children children
   * @param editor editor
   * @returns vnode
   */
  function renderHeader(
    elemNode: SlateElement,
    children: VNode[] | null,
    editor: IDomEditor
  ): VNode {
    const Tag = `h${level}`
    const vnode = <Tag>{children}</Tag>
    return vnode
  }

  return renderHeader
}

const renderHeader1Conf = {
  type: 'header1', // 和 elemNode.type 一致
  renderFn: genRenderFn(1),
}
const renderHeader2Conf = {
  type: 'header2',
  renderFn: genRenderFn(2),
}
const renderHeader3Conf = {
  type: 'header3',
  renderFn: genRenderFn(3),
}

export { renderHeader1Conf, renderHeader2Conf, renderHeader3Conf }
