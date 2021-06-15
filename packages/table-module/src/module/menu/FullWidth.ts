/**
 * @description table full width menu
 * @author wangfupeng
 */

import { Transforms, Range } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { getSelectedNodeByType } from '../_helpers/node'
import { FULL_WIDTH_SVG } from '../../constants/svg'

class TableFullWidth implements IButtonMenu {
  title = '宽度自适应'
  iconSvg = FULL_WIDTH_SVG
  tag = 'button'

  // 是否已设置 宽度自适应
  getValue(editor: IDomEditor): string | boolean {
    const tableNode = getSelectedNodeByType(editor, 'table')
    if (tableNode == null) return false
    // @ts-ignore
    return !!tableNode.fullWidth
  }

  isActive(editor: IDomEditor): boolean {
    return !!this.getValue(editor)
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true

    const tableNode = getSelectedNodeByType(editor, 'table')
    if (tableNode == null) {
      // 选区未处于 table node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    if (value) {
      // 已经设置了 宽度自适应，则取消
      Transforms.setNodes(
        editor,
        {
          // @ts-ignore
          fullWidth: null,
        },
        { mode: 'highest' }
      )
    } else {
      // 未设置 宽度自适应，则设置
      Transforms.setNodes(
        editor,
        {
          // @ts-ignore
          fullWidth: true,
        },
        { mode: 'highest' }
      )
    }
  }
}

export default TableFullWidth
