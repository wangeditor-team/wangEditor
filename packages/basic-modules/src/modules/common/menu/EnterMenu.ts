/**
 * @description enter menu
 * @author wangfupeng
 */

import { Range, Transforms, Editor } from 'slate'
import { IButtonMenu, IDomEditor, t } from '@wangeditor/core'
import { ENTER_SVG } from '../../../constants/icon-svg'

class EnterMenu implements IButtonMenu {
  title = t('common.enter')
  iconSvg = ENTER_SVG
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (Range.isExpanded(selection)) return true
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const { selection } = editor
    if (selection == null) return
    const { anchor } = selection
    const { path } = anchor

    // 在当前位置插入空行，当前元素下移
    const newElem = { type: 'paragraph', children: [{ text: '' }] }
    const newPath = [path[0]]
    Transforms.insertNodes(editor, newElem, { at: newPath })
    editor.select(Editor.start(editor, newPath))
  }
}

export default EnterMenu
