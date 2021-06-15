/**
 * @description table header menu
 * @author wangfupeng
 */

import { Transforms, Range } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { getSelectedNodeByType } from '../_helpers/node'
import { TABLE_HEADER_SVG } from '../../constants/svg'

class TableHeader implements IButtonMenu {
  title = '表头'
  iconSvg = TABLE_HEADER_SVG
  tag = 'button'

  // 是否已设置表头
  getValue(editor: IDomEditor): string | boolean {
    const tableNode = getSelectedNodeByType(editor, 'table')
    if (tableNode == null) return false
    // @ts-ignore
    return !!tableNode.withHeader
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
      // 已经设置了表头，则取消
      Transforms.setNodes(
        editor,
        {
          // @ts-ignore
          withHeader: null,
        },
        { mode: 'highest' }
      )
    } else {
      // 未设置表头，则设置
      Transforms.setNodes(
        editor,
        {
          // @ts-ignore
          withHeader: true,
        },
        { mode: 'highest' }
      )
    }
  }
}

export default TableHeader
