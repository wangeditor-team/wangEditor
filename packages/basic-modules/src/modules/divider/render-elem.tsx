/**
 * @description register formats
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function renderDivider(
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const renderStyle: any = {}

  // 是否选中
  const selected = DomEditor.isNodeSelected(editor, elemNode)

  const vnode = (
    <div
      contentEditable={false}
      className="w-e-textarea-divider"
      data-selected={selected ? 'true' : ''} // 标记为 选中
      style={renderStyle}
    >
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
