/**
 * @description render list elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'
import { genTag } from './helper'

function genRenderElem(type: string) {
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
  renderElem: genRenderElem('bulleted-list'),
}
const renderNumberedListConf = {
  type: 'numbered-list',
  renderElem: genRenderElem('numbered-list'),
}
const renderListItemConf = {
  type: 'list-item',
  renderElem: genRenderElem('list-item'),
}

export { renderBulletedListConf, renderNumberedListConf, renderListItemConf }
