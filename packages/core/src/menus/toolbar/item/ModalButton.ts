/**
 * @description modal button class
 * @author wangfupeng
 */

import { IModalMenu } from '../../interface'
import BaseButton from './BaseButton'
import Modal from '../Modal'
import { EDITOR_TO_TEXTAREA } from '../../../utils/weak-maps'
import { getEditorInstance } from './index'
import { getModalPosition } from '../../helpers'

class ToolbarItemModalButton extends BaseButton {
  private modal: Modal | null = null
  menu: IModalMenu

  constructor(menu: IModalMenu) {
    super(menu)
    this.menu = menu
  }

  onClick() {
    if (this.menu.showModal) {
      this.handleModal()
    }
  }

  // 显示/隐藏 modal
  private handleModal() {
    const editor = getEditorInstance(this)
    const menu = this.menu
    if (menu.getModalContentElem == null) return

    const textarea = EDITOR_TO_TEXTAREA.get(editor)
    if (textarea == null) return

    if (this.modal == null) {
      // 初次创建
      const modal = new Modal()
      const $content = menu.getModalContentElem(editor)
      modal.renderContent($content)
      const positionStyle = getModalPosition(editor) // 获取 modal position
      modal.setStyle(positionStyle)
      modal.appendTo(textarea.$textAreaContainer)
      modal.show()

      // 记录下来，防止重复创建
      this.modal = modal
    } else {
      // 不是初次创建
      const modal = this.modal
      if (modal.isShow) {
        // 当前处于显示状态，则隐藏
        modal.hide()
      } else {
        // 当前未处于显示状态，则重新渲染内容 ，并显示
        const $content = menu.getModalContentElem(editor)
        modal.renderContent($content)
        const positionStyle = getModalPosition(editor) // 获取 modal position
        modal.setStyle(positionStyle)
        modal.show()
      }
    }
  }
}

export default ToolbarItemModalButton
