/**
 * @description render element node
 * @author wangfupeng
 */

import { Editor, Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { node2Vnode } from '../node2Vnode'
import { DomEditor } from '../../editor/dom-editor'
import { IDomEditor } from '../../editor/interface'
import {
  KEY_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_INDEX,
  NODE_TO_PARENT,
} from '../../utils/weak-maps'
import getRenderElem from './getRenderElem'
import renderStyle from './renderStyle'
import { promiseResolveThen } from '../../utils/util'
import { genElemId } from '../helper'
import { getElementById } from '../../utils/dom'

interface IAttrs {
  id: string
  key: string | number
  'data-slate-node': 'element'
  'data-slate-inline'?: boolean
  'data-slate-void'?: boolean
  contentEditable?: Boolean
}

function renderElement(elemNode: SlateElement, editor: IDomEditor): VNode {
  const key = DomEditor.findKey(editor, elemNode)
  // const readOnly = editor.isDisabled()
  const isInline = editor.isInline(elemNode)
  const isVoid = Editor.isVoid(editor, elemNode)
  const domId = genElemId(key.id)
  const attrs: IAttrs = {
    id: domId,
    key: key.id,
    'data-slate-node': 'element',
    'data-slate-inline': isInline,
  }

  // 根据 type 生成 vnode 的函数
  const { type, children = [] } = elemNode
  let renderElem = getRenderElem(type)

  let childrenVnode
  if (isVoid) {
    childrenVnode = null // void 节点 render elem 时不传入 children
  } else {
    childrenVnode = children.map((child: Node, index: number) => {
      return node2Vnode(child, index, elemNode, editor)
    })
  }

  // 创建 vnode
  let vnode = renderElem(elemNode, childrenVnode, editor)

  // void node 要特殊处理
  if (isVoid) {
    attrs['data-slate-void'] = true

    // 如果这里设置 contentEditable = false ，那图片就无法删除了 ？？？
    // if (!readOnly && isInline) {
    //     attrs.contentEditable = false
    // }

    const Tag = isInline ? 'span' : 'div'
    const [[text]] = Node.texts(elemNode)

    const textVnode = node2Vnode(text, 0, elemNode, editor)
    const textWrapperVnode = (
      <Tag
        data-slate-spacer
        style={{
          height: '0',
          color: 'transparent',
          outline: 'none',
          position: 'absolute',
        }}
      >
        {textVnode}
      </Tag>
    )

    // 重写 vnode
    vnode = (
      // 设置 position: relative，保证 absolute 的 textWrapperVnode 不乱跑
      <Tag style={{ position: 'relative' }}>
        {vnode}
        {textWrapperVnode}
      </Tag>
    )

    // 记录 text 相关 weakMap
    NODE_TO_INDEX.set(text, 0)
    NODE_TO_PARENT.set(text, elemNode)
  }

  // 添加 element 属性
  if (vnode.data == null) vnode.data = {}
  Object.assign(vnode.data, attrs)

  // 添加文本相关的样式，如 text-align
  if (!isVoid && !isInline) {
    // 非 void + 非 inline
    vnode = renderStyle(elemNode, vnode)
  }

  // 更新 element 相关的 weakMap
  promiseResolveThen(() => {
    // 异步，否则拿不到 DOM 节点
    const dom = getElementById(domId)
    if (dom == null) return
    KEY_TO_ELEMENT.set(key, dom)
    NODE_TO_ELEMENT.set(elemNode, dom)
    ELEMENT_TO_NODE.set(dom, elemNode)
  })

  return vnode
}

export default renderElement
