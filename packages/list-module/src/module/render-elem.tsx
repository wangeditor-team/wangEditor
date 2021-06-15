/**
 * @description register formats
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'

function genTag(type: string): string {
  if (type === 'bulleted-list') return 'ul'
  if (type === 'numbered-list') return 'ol'
  if (type === 'list-item') return 'li'
  throw new Error(`list type '${type}' is invalid`)
}

function genRenderFn(type: string) {
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
    const Tag = genTag(type)
    const vnode = <Tag>{children}</Tag>
    return vnode
  }

  return renderHeader
}

const renderBulletedListConf = {
  type: 'bulleted-list', // 和 elemNode.type 一致
  renderFn: genRenderFn('bulleted-list'),
}
const renderNumberedListConf = {
  type: 'numbered-list',
  renderFn: genRenderFn('numbered-list'),
}
const renderListItemConf = {
  type: 'list-item',
  renderFn: genRenderFn('list-item'),
}

export { renderBulletedListConf, renderNumberedListConf, renderListItemConf }
