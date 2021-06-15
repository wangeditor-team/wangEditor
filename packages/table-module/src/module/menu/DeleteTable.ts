/**
 * @description del table menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { getSelectedNodeByType } from '../_helpers/node'
import { REMOVE_SVG } from '../../constants/svg'

class DeleteTable implements IButtonMenu {
  title = '删除表格'
  iconSvg = REMOVE_SVG
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const tableNode = getSelectedNodeByType(editor, 'table')
    if (tableNode == null) {
      // 选区未处于 table node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    // 删除表格
    Transforms.removeNodes(editor, { mode: 'highest' })
  }
}

export default DeleteTable
