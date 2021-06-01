/**
 * @description
 * @author wangfupeng
 */

import { IMenuItem } from '../../interface'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolbarItem, getEditorInstance } from './index'
import {
  clearSvgStyle,
  gen$downArrow,
  hideAllPanelsAndModals,
  getModalPosition,
} from '../../helpers'
import DropPanel from '../DropPanel'
import Modal from '../Modal'
import { EDITOR_TO_TEXTAREA } from '../../../utils/weak-maps'

class ToolbarItemButton implements IToolbarItem {
  $elem: Dom7Array = $(`<div class="w-e-toolbar-item"></div>`)
  private $button: Dom7Array
  menuItem: IMenuItem
  private disabled = false
  private dropPanel: DropPanel | null = null
  private modal: Modal | null = null

  constructor(menuItem: IMenuItem) {
    // 验证 tag
    const { tag, width, showDropPanel } = menuItem
    if (tag !== 'button') throw new Error(`Invalid tag '${tag}', expected 'button'`)

    // 初始化 dom
    const { title, iconSvg } = menuItem
    const $svg = $(iconSvg)
    clearSvgStyle($svg) // 清理 svg 样式（扩展的菜单，svg 是不可控的，所以要清理一下）
    const $button = $(`<button tooltip="${title}"></button>`)
    $button.append($svg)
    if (showDropPanel) {
      const $arrow = gen$downArrow()
      $button.append($arrow)
    }
    if (width) {
      $button.css('width', `${width}px`)
    }
    this.$elem.append($button)

    this.$button = $button
    this.menuItem = menuItem
  }

  init() {
    // 设置 button 属性
    this.setActive()
    this.setDisabled()

    // click
    this.$button.on('click', e => {
      e.stopPropagation()
      hideAllPanelsAndModals() // 隐藏当前的各种 panel
      this.trigger()
    })
  }

  private trigger() {
    if (this.disabled) return

    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    const value = menuItem.getValue(editor)

    if (!menuItem.showDropPanel && menuItem.exec) {
      // 不显示 dropPanel ，普通的 button
      menuItem.exec(editor, value)
      return
    }

    if (menuItem.showDropPanel) {
      // 显示/隐藏 dropPanel
      this.handleDropPanel()
    }

    if (menuItem.showModal) {
      // 显示/隐藏 modal
      this.handleModal()
    }
  }

  private handleDropPanel() {
    const menuItem = this.menuItem
    if (menuItem.getPanelContentElem == null) return
    const editor = getEditorInstance(this)

    if (this.dropPanel == null) {
      // 初次创建
      const dropPanel = new DropPanel()
      const $content = menuItem.getPanelContentElem(editor)
      dropPanel.renderContent($content)
      dropPanel.appendTo(this.$elem)
      dropPanel.show()

      // 记录下来，防止重复创建
      this.dropPanel = dropPanel
    } else {
      // 不是初次创建
      const dropPanel = this.dropPanel
      if (dropPanel.isShow) {
        // 当前处于显示状态，则隐藏
        dropPanel.hide()
      } else {
        // 当前未处于显示状态，则重新渲染内容 ，并显示
        const $content = menuItem.getPanelContentElem(editor)
        dropPanel.renderContent($content)
        dropPanel.show()
      }
    }

    // 判断 dropPanel 的位置：在菜单右侧/左侧
    const dropPanel = this.dropPanel
    if (dropPanel.isShow) {
      const $menu = this.$elem
      const { left } = $menu.offset() // 菜单元素 left

      const $toolbar = $menu.parents('.w-e-toolbar')
      const { left: toolbarLeft } = $toolbar.offset() // toolbar left
      const toolbarWidth = $toolbar.width() // toolbar width
      const halfToolbarWidth = toolbarWidth / 2 // toolbar width 的 1/2

      if (left - toolbarLeft >= halfToolbarWidth) {
        // 菜单在 toolbar 的右半部分，则 dropPanel 要显示在菜单左侧
        dropPanel.$elem.css({
          left: 'none',
          right: '0',
        })
      } else {
        // 菜单在 toolbar 左半部分，则 dropPanel 显示在菜单右侧
        dropPanel.$elem.css({
          left: '0',
          right: 'none',
        })
      }
    }
  }

  private handleModal() {
    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    if (menuItem.getModalContentElem == null) return

    const textarea = EDITOR_TO_TEXTAREA.get(editor)
    if (textarea == null) return

    if (this.modal == null) {
      // 初次创建
      const modal = new Modal()
      const $content = menuItem.getModalContentElem(editor)
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
        const $content = menuItem.getModalContentElem(editor)
        modal.renderContent($content)
        const positionStyle = getModalPosition(editor) // 获取 modal position
        modal.setStyle(positionStyle)
        modal.show()
      }
    }
  }

  private setActive() {
    const editor = getEditorInstance(this)
    const $button = this.$button
    const menuItem = this.menuItem
    const value = menuItem.getValue(editor)

    const className = 'active'
    if (value) {
      // 设置为 active
      $button.addClass(className)
    } else {
      // 取消 active
      $button.removeClass(className)
    }
  }

  private setDisabled() {
    const editor = getEditorInstance(this)
    const $button = this.$button
    const menuItem = this.menuItem
    const disabled = menuItem.isDisabled(editor)

    const className = 'disabled'
    if (disabled) {
      // 设置为 disabled
      $button.addClass(className)
    } else {
      // 取消 disabled
      $button.removeClass(className)
    }

    this.disabled = disabled // 记录下来
  }

  onSelectionChange() {
    this.setActive()
    this.setDisabled()
  }
}

export default ToolbarItemButton
