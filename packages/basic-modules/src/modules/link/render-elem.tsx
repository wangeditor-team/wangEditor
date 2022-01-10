/**
 * @description render link elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'
import { LinkElement } from './custom-types'

/**
 * render link elem
 * @param elemNode slate elem
 * @param children children
 * @param editor editor
 * @returns vnode
 */
function renderLink(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  const { url, target = '_blank' } = elemNode as LinkElement
  const vnode = (
    <a href={url} target={target}>
      {children}
    </a>
  )

  return vnode
}

const renderLinkConf = {
  type: 'link', // 和 elemNode.type 一致
  renderElem: renderLink,
}

export { renderLinkConf }
