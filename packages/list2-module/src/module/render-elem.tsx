/**
 * @description render list2 elem
 * @author wangfupeng
 */

import { Element as SlateElement, Path, Editor } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { List2ItemElement } from './custom-types'
import { ELEM_TO_EDITOR } from '../utils/maps'

/**
 * 无序列表：根据 level 获取的前置符号
 * @param level 层级
 */
function genPreSymbol(level = 0): string {
  let s = ''
  switch (level) {
    case 0:
      s = '•' // 第一层级
      break
    case 1:
      s = '◦' // 第一层级
      break
    case 2:
      s = '▪' // 第三层级
      break
    default:
      s = '▪' // 其他层级
  }
  return s
}

/**
 * 有序列表：获取前缀 number
 * @param editor editor
 * @param elem listItem elem
 */
function getOrderedItemNumber(editor: IDomEditor, elem: SlateElement): number {
  const { type, level = 0, ordered = false } = elem as List2ItemElement
  if (!ordered) {
    return -1 // 不是有序列表
  }

  let num = 1 // 默认值 1
  let curElem = elem
  let curPath = DomEditor.findPath(editor, curElem)

  // 第一个元素，直接返回 1
  if (curPath[0] === 0) return 1

  while (curPath[0] > 0) {
    const prevPath = Path.previous(curPath)
    const prevEntry = Editor.node(editor, prevPath)
    if (prevEntry == null) break
    const prevElem = prevEntry[0] as List2ItemElement // 上一个节点
    const { level: prevLevel = 0, type: prevType, ordered: prevOrdered } = prevElem

    // type 不一致，退出循环，不再累加 num
    if (prevType !== type) break
    // prevLevel 更小，退出循环，不再累加 num
    if (prevLevel < level) break

    if (prevLevel === level) {
      // level 一样，如果 ordered 不一样，则退出循环，不再累加 num
      if (prevOrdered !== ordered) break
      // level 一样，order 一样，则累加 num
      else num++
    }

    // prevLevel 更大，不累加 num ，继续向前
    curElem = prevElem
    curPath = prevPath
  }

  return num
}

function renderList2Elem(
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  ELEM_TO_EDITOR.set(elemNode, editor) // 记录 elem 和 editor 关系，elem-to-html 时要用

  const { level = 0, ordered = false } = elemNode as List2ItemElement

  // 根据 level 增加 margin-left
  const listStyle = { margin: `5px 0 5px ${level * 20}px` }

  // list-item 前缀
  let prefix = ''
  if (ordered) {
    // 有序列表：获取前缀 number
    const orderedNumber = getOrderedItemNumber(editor, elemNode)
    prefix = `${orderedNumber}.`
  } else {
    // 无序列表：根据层级，使用不同的前缀符号
    prefix = genPreSymbol(level)
  }

  const vnode = (
    <div style={listStyle}>
      <span contentEditable={false} style={{ marginRight: '0.5em' }} data-w-e-reserve>
        {prefix}
      </span>
      <span>{children}</span>
    </div>
  )
  return vnode
}

const renderList2ItemConf = {
  type: 'list2-item',
  renderElem: renderList2Elem,
}

export default renderList2ItemConf
