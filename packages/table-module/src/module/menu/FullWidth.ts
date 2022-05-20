/**
 * @description table full width menu
 * @author wangfupeng
 */

import { Transforms, Range } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { FULL_WIDTH_SVG } from '../../constants/svg'
import { TableElement } from '../custom-types'

class TableFullWidth implements IButtonMenu {
  readonly title = t('tableModule.widthAuto')
  readonly iconSvg = FULL_WIDTH_SVG
  readonly tag = 'button'

  // 是否已设置 宽度自适应
  getValue(editor: IDomEditor): string | boolean {
    const tableNode = DomEditor.getSelectedNodeByType(editor, 'table')
    if (tableNode == null) return false
    return (tableNode as TableElement).width === '100%'
  }

  isActive(editor: IDomEditor): boolean {
    return !!this.getValue(editor)
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true

    const tableNode = DomEditor.getSelectedNodeByType(editor, 'table')
    if (tableNode == null) {
      // 选区未处于 table node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    const props: Partial<TableElement> = {
      width: value ? 'auto' : '100%', // 切换 'auto' 和 '100%'
    }
    Transforms.setNodes(editor, props, { mode: 'highest' })
  }
}

export default TableFullWidth
