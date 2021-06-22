/**
 * @description register formats
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'
import { isNodeSelected } from '../_helpers/node'

function renderDivider(
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const renderStyle: any = {}

  // 是否选中
  const selected = isNodeSelected(editor, elemNode, 'divider')
  renderStyle.boxShadow = selected ? '0 0 0 3px #B4D5FF' : 'none'
  // TODO 抽离选中样式

  const vnode = (
    <div className="w-e-textarea-divider" style={renderStyle}>
      <hr />
    </div>
  )
  // 【注意】void node 中，renderElem 不用处理 children 。core 会统一处理。

  return vnode
}

const renderDividerConf = {
  type: 'divider', // 和 elemNode.type 一致
  renderElem: renderDivider,
}

export { renderDividerConf }
