/**
 * @description bar item
 * @author wangfupeng
 */

import { Dom7Array } from '../../utils/dom'
import { IButtonMenu, ISelectMenu, IDropPanelMenu, IModalMenu } from '../interface'
import { IDomEditor } from '../../editor/dom-editor'
import { BAR_ITEM_TO_EDITOR } from '../../utils/weak-maps'
import SimpleButton from './SimpleButton'
import DropPanelButton from './DropPanelButton'
import ModalButton from './ModalButton'
import Select from './Select'

export interface IBarItem {
  $elem: Dom7Array
  menu: IButtonMenu | ISelectMenu | IDropPanelMenu | IModalMenu
  init: () => void
  onSelectionChange: () => void
}

export function getEditorInstance(item: IBarItem): IDomEditor {
  const editor = BAR_ITEM_TO_EDITOR.get(item)
  if (editor == null) throw new Error('Can not get editor instance')
  return editor
}

/**
 * 创建 bar button/select
 * @param menu menu
 * @param editor editor
 */
export function createBarItem(
  menu: IButtonMenu | ISelectMenu | IDropPanelMenu | IModalMenu
): IBarItem {
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
