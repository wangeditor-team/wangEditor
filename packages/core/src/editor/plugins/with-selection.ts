/**
 * @description slate 插件 - selection 相关
 * @author wangfupeng
 */

import { Editor, Transforms, Location, Node, Range, Point } from 'slate'
import { IDomEditor } from '../interface'
import { DomEditor } from '../dom-editor'
import { getPositionByNode, getPositionBySelection } from '../../menus/helpers/position'
import { EDITOR_TO_SELECTION } from '../../utils/weak-maps'

export const withSelection = <T extends Editor>(editor: T) => {
  const e = editor as T & IDomEditor

  // 选中
  e.select = (at: Location) => {
    Transforms.select(e, at)
  }

  // 取消选中
  e.deselect = () => {
    const { selection } = e
    const root = DomEditor.findDocumentOrShadowRoot(e)
    const domSelection = root.getSelection()

    if (domSelection && domSelection.rangeCount > 0) {
      domSelection.removeAllRanges()
    }

    if (selection) {
      Transforms.deselect(editor)
    }
  }

  // 移动光标
  e.move = (distance: number, reverse = false) => {
    if (!distance) return
    if (distance < 0) return

    Transforms.move(editor, {
      distance,
      unit: 'character',
      reverse,
    })
  }

  // 反向移动光标
  e.moveReverse = (distance: number) => {
    e.move(distance, true)
  }

  /**
   * 还原选区
   */
  e.restoreSelection = () => {
    const selection = EDITOR_TO_SELECTION.get(e)
    if (selection == null) return

    e.focus()
    Transforms.select(e, selection)
  }

  /**
   * 获取选区的 position
   */
  e.getSelectionPosition = () => {
    return getPositionBySelection(e)
  }

  /**
   * 获取 node 的 position
   */
  e.getNodePosition = (node: Node) => {
    return getPositionByNode(e, node)
  }

  /**
   * 是否全选
   */
  e.isSelectedAll = () => {
    const { selection } = e
    if (selection == null) return false

    const [start1, end1] = Range.edges(selection) // 获取当前选取的开始、结束 point
    const [start2, end2] = Editor.edges(e, []) // 获取编辑器全部的开始、结束 point

    if (Point.equals(start1, start2) && Point.equals(end1, end2)) {
      return true
    }
    return false
  }

  /**
   * 全选
   */
  e.selectAll = () => {
    const start = Editor.start(e, [])
    const end = Editor.end(e, [])

    Transforms.select(e, {
      anchor: start,
      focus: end,
    })
  }

  return e
}
