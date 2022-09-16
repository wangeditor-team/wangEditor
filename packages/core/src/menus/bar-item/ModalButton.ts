/**
 * @description modal button class
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IModalMenu, IPositionStyle } from '../interface'
import BaseButton from './BaseButton'
import Modal from '../panel-and-modal/Modal'
import { getEditorInstance } from './index'
import { getPositionBySelection, getPositionByNode, correctPosition } from '../helpers/position'
import { DomEditor } from '../../editor/dom-editor'
import $ from '../../utils/dom'

class ModalButton extends BaseButton {
  private $body = $('body')
  private modal: Modal | null = null
  menu: IModalMenu

  constructor(key: string, menu: IModalMenu, inGroup = false) {
    super(key, menu, inGroup)
    this.menu = menu
  }

  onButtonClick() {
    if (this.menu.showModal) {
      this.handleModal()
    }
  }

  /**
   * 获取 modal 定位
   */
  private getPosition(): Partial<IPositionStyle> {
    const editor = getEditorInstance(this)
    const positionNode = this.menu.getModalPositionNode(editor)

    if (Element.isElement(positionNode)) {
      // elem node ，按 node 定位
      return getPositionByNode(editor, positionNode, 'modal')
    }

    // 其他情况（如 positionNode == null 或是 text node）则按选区定位
    return getPositionBySelection(editor)
  }

  // 显示/隐藏 modal
  private handleModal() {
    const editor = getEditorInstance(this)
    const menu = this.menu

    if (this.modal == null) {
      // 初次创建
      const modal = new Modal(editor, menu.modalWidth)
      this.renderAndShowModal(modal, true)

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
        this.renderAndShowModal(modal, false)
      }
    }
  }

  /**
   * 渲染并显示 modal
   * @param modal modal
   * @param firstTime 是否第一次显示 modal
   */
  private renderAndShowModal(modal: Modal, firstTime: boolean = false) {
    const editor = getEditorInstance(this)
    const menu = this.menu
    if (menu.getModalContentElem == null) return

    const textarea = DomEditor.getTextarea(editor)
    const toolbar = DomEditor.getToolbar(editor)
    const { modalAppendToBody } = toolbar?.getConfig() || {}

    const contentElem = menu.getModalContentElem(editor)
    modal.renderContent(contentElem)

    if (modalAppendToBody) {
      // appendTo body 时，用户自己设置 modal 定位
      modal.setStyle({ left: '0', right: '0' })
    } else {
      // 计算并设置 modal position
      const positionStyle = this.getPosition()
      modal.setStyle(positionStyle)
    }

    if (firstTime) {
      if (modalAppendToBody) {
        modal.appendTo(this.$body)
      } else {
        modal.appendTo(textarea.$textAreaContainer)
      }
    }

    modal.show()

    if (!modalAppendToBody) {
      // 修正 modal 定位，避免超出 textContainer 边界（ appendTo body 则不用设置，用户自己设置 ）
      correctPosition(editor, modal.$elem)
    }

    // 让 editor 失焦，否则点击 modal 触发 onChange 会导致 modal 隐藏
    setTimeout(() => {
      editor.blur()
    })
  }
}

export default ModalButton
