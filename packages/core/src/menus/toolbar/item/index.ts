/**
 * @description toolbar item
 * @author wangfupeng
 */

import { Dom7Array } from '../../../utils/dom'
import { IButtonMenu, ISelectMenu, IDropPanelMenu, IModalMenu } from '../../interface'
import { IDomEditor } from '../../../editor/dom-editor'
import { TOOLBAR_ITEM_TO_EDITOR } from '../../../utils/weak-maps'
import SimpleButton from './SimpleButton'
import DropPanelButton from './DropPanelButton'
import ModalButton from './ModalButton'
import Select from './Select'

export function getEditorInstance(item: IToolbarItem): IDomEditor {
  const editor = TOOLBAR_ITEM_TO_EDITOR.get(item)
  if (editor == null) throw new Error('Can not get editor instance')
  return editor
}

export interface IToolbarItem {
  $elem: Dom7Array
  menu: IButtonMenu | ISelectMenu | IDropPanelMenu | IModalMenu
  init: () => void
  onSelectionChange: () => void
}

/**
 * 创建 toolbar button/select
 * @param menu menu
 * @param editor editor
 */
export function createToolbarItem(
  menu: IButtonMenu | ISelectMenu | IDropPanelMenu | IModalMenu
): IToolbarItem {
  const { tag } = menu
  if (tag === 'button') {
    // @ts-ignore
    if (menu.showDropPanel) {
      return new DropPanelButton(menu as IDropPanelMenu)
    }
    // @ts-ignore
    if (menu.showModal) {
      return new ModalButton(menu as IModalMenu)
    }

    return new SimpleButton(menu)
  }
  if (tag === 'select') {
    return new Select(menu as ISelectMenu)
  }
  throw new Error(`Invalid tag in menu ${JSON.stringify(menu)}`)
}
