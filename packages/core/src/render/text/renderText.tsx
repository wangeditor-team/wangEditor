/**
 * @description render text node
 * @author wangfupeng
 */

import { Text as SlateText, Ancestor } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { DomEditor } from '../../editor/dom-editor'
import { IDomEditor } from '../../editor/interface'
import { KEY_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE } from '../../utils/weak-maps'
import genTextVnode from './genVnode'
import addTextVnodeStyle from './renderStyle'
import { promiseResolveThen } from '../../utils/util'
import { genTextId } from '../helper'
import { getElementById } from '../../utils/dom'

function renderText(textNode: SlateText, parent: Ancestor, editor: IDomEditor): VNode {
  if (textNode.text == null)
    throw new Error(`Current node is not slate Text ${JSON.stringify(textNode)}`)
  const key = DomEditor.findKey(editor, textNode)

  // 根据 decorate 将 text 拆分为多个叶子节点 text[]
  const { decorate } = editor.getConfig()
  if (decorate == null) throw new Error(`Can not get config.decorate`)
  const path = DomEditor.findPath(editor, textNode)
  const ds = decorate([textNode, path])
  const leaves = SlateText.decorations(textNode, ds)

  // 生成 leaves vnode
  const leavesVnode = leaves.map((leafNode, index) => {
    // 文字和样式
    const isLast = index === leaves.length - 1
    let strVnode = genTextVnode(leafNode, isLast, textNode, parent, editor)
    strVnode = addTextVnodeStyle(leafNode, strVnode)
    // 生成每一个 leaf 节点
    return <span data-slate-leaf>{strVnode}</span>
  })

  // 生成 text vnode
  const textId = genTextId(key.id)
  const vnode = (
    <span data-slate-node="text" id={textId} key={key.id}>
      {leavesVnode /* 一个 text 可能包含多个 leaf */}
    </span>
  )

  // 更新 weak-map
  promiseResolveThen(() => {
    // 异步，否则拿不到 DOM
    const dom = getElementById(textId)
    if (dom == null) return
    KEY_TO_ELEMENT.set(key, dom)
    NODE_TO_ELEMENT.set(textNode, dom)
    ELEMENT_TO_NODE.set(dom, textNode)
  })

  return vnode
}

export default renderText
