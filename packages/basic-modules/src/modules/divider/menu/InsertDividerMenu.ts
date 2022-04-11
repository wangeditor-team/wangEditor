/**
 * @description insert divider menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { DIVIDER_SVG } from '../../../constants/icon-svg'
import { DividerElement } from '../custom-types'

class InsertDividerMenu implements IButtonMenu {
  readonly title = t('divider.title')
  readonly iconSvg = DIVIDER_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 不需要 active
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true

    const selectedElems = DomEditor.getSelectedElems(editor)
    const hasVoidOrTableOrPre = selectedElems.some(elem => {
      if (editor.isVoid(elem)) return true
      const type = DomEditor.getNodeType(elem)
      if (type === 'table') return true
      if (type === 'pre') return true
    })
    if (hasVoidOrTableOrPre) return true // 匹配，则 disable

    return false
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    const node: DividerElement = {
      type: 'divider',
      children: [{ text: '' }], // 【注意】void node 需要一个空 text 作为 children
    }

    Transforms.insertNodes(editor, node, { mode: 'highest' })
  }
}

export default InsertDividerMenu
