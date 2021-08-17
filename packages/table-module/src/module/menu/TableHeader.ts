/**
 * @description table header menu
 * @author wangfupeng
 */

import { Transforms, Range } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { TABLE_HEADER_SVG } from '../../constants/svg'
import { TableElement } from '../custom-types'

class TableHeader implements IButtonMenu {
  readonly title = t('tableModule.header')
  readonly iconSvg = TABLE_HEADER_SVG
  readonly tag = 'button'

  // 是否已设置表头
  getValue(editor: IDomEditor): string | boolean {
    const tableNode = DomEditor.getSelectedNodeByType(editor, 'table')
    if (tableNode == null) return false
    return !!(tableNode as TableElement).withHeader
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

    // 已经设置了表头，则取消。未设置表头，则设置
    const newValue = value ? null : true
    const props: Partial<TableElement> = { withHeader: newValue }
    Transforms.setNodes(editor, props, { mode: 'highest' })
  }
}

export default TableHeader
