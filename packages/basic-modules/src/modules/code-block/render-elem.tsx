/**
 * @description render elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'

function renderPre(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  const vnode = <pre>{children}</pre>
  return vnode
}

function renderCode(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // 和 basic/simple-style module 的“行内代码”并不冲突。一个是根据 mark 渲染，一个是根据 node.type 渲染
  const vnode = <code>{children}</code>
  return vnode
}

export const renderPreConf = {
  type: 'pre',
  renderElem: renderPre,
}

export const renderCodeConf = {
  type: 'code',
  renderElem: renderCode,
}
