/**
 * @description render divider elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { h, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function renderDivider(
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const renderStyle: any = {}

  // 是否选中
  const selected = DomEditor.isNodeSelected(editor, elemNode)

  const vnode = h(
    'div',
    {
      props: {
        contentEditable: false,
        className: 'w-e-textarea-divider',
      },
      dataset: {
        selected: selected ? 'true' : '',
      },
      style: renderStyle,
      on: {
        mousedown: event => event.preventDefault(),
      },
    },
    [h('hr')]
  )
  // 【注意】void node 中，renderElem 不用处理 children 。core 会统一处理。

  return vnode
}

const renderDividerConf = {
  type: 'divider', // 和 elemNode.type 一致
  renderElem: renderDivider,
}

export { renderDividerConf }
