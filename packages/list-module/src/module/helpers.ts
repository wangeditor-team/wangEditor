/**
 * @description table menu helpers
 * @author wangfupeng
 */

import { Path, Editor } from 'slate'
import { DomEditor, IDomEditor } from '@wangeditor/core'
import { ListItemElement } from './custom-types'

/**
 * 获取上一个同一 level 的 list item
 * @param editor 编辑器实例
 * @param elem elem
 */
export function getBrotherListNodeByLevel(
  editor: IDomEditor,
  elem: ListItemElement,
  level?: number
): ListItemElement | null {
  const { type, ...otherProps } = elem
  // level 可能是 退格前的值,所以这里需要判断
  const elemLevel = level !== undefined ? level : otherProps.level || 0

  const path = DomEditor.findPath(editor, elem)
  let brotherPath = path

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (brotherPath.length === 0) {
      return null // 没有找到有效的前一个 list 节点
    }
    brotherPath = Path.previous(brotherPath)
    const brotherEntry = Editor.node(editor, brotherPath)

    if (!brotherEntry) {
      return null // 没有找到有效的前一个 list 节点
    }

    const [brotherElem] = brotherEntry
    const { level: brotherLevel = 0 } = brotherElem as ListItemElement
    const brotherType = DomEditor.getNodeType(brotherElem)

    // 验证兄弟节点是否是期望的类型和层级
    if (brotherType !== type) {
      return null
    }
    if (brotherLevel === elemLevel) {
      return brotherElem as ListItemElement
    }
  }
}

export function hasSameOrderWithBrother(
  editor: IDomEditor,
  elem: ListItemElement,
  level?: number
): boolean {
  const brotherElem = getBrotherListNodeByLevel(editor, elem, level)
  return brotherElem ? brotherElem.ordered === elem.ordered : false
}
