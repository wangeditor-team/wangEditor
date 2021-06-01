/**
 * @description toolbar item
 * @author wangfupeng
 */

import { Dom7Array } from '../../../utils/dom'
import { IMenuItem } from '../../interface'
import { IDomEditor } from '../../../editor/dom-editor'
import { TOOLBAR_ITEM_TO_EDITOR } from '../../../utils/weak-maps'
import ToolbarItemButton from './Button'
import ToolbarItemSelect from './Select'

export function getEditorInstance(item: IToolbarItem): IDomEditor {
  const editor = TOOLBAR_ITEM_TO_EDITOR.get(item)
  if (editor == null) throw new Error('Can not get editor instance')
  return editor
}

export interface IToolbarItem {
  $elem: Dom7Array
  menuItem: IMenuItem
  init: () => void
  onSelectionChange: () => void
}

/**
 * 创建 toolbar button/select
 * @param menuItem menuItem
 * @param editor editor
 */
export function createToolbarItem(menuItem: IMenuItem): IToolbarItem {
  const { tag } = menuItem
  if (tag === 'button') {
    return new ToolbarItemButton(menuItem)
  }
  if (tag === 'select') {
    return new ToolbarItemSelect(menuItem)
  }
  throw new Error(`Invalid tag in menuItem ${JSON.stringify(menuItem)}`)
}
