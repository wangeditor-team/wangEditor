/**
 * @description slate 插件 - selection 相关
 * @author wangfupeng
 */

import { Editor, Transforms, Location, Node } from 'slate'
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

  return e
}
