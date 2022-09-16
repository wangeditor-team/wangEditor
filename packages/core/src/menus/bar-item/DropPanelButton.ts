/**
 * @description dropPanel button class
 * @author wangfupeng
 */

import { IDropPanelMenu } from '../interface'
import BaseButton from './BaseButton'
import DropPanel from '../panel-and-modal/DropPanel'
import { gen$downArrow } from '../helpers/helpers'
import { getEditorInstance } from './index'

class DropPanelButton extends BaseButton {
  private dropPanel: DropPanel | null = null
  menu: IDropPanelMenu

  constructor(key: string, menu: IDropPanelMenu, inGroup = false) {
    super(key, menu, inGroup)
    this.menu = menu

    if (menu.showDropPanel) {
      const $arrow = gen$downArrow()
      this.$button.append($arrow)
    }
  }

  // button 点击之后
  onButtonClick() {
    if (this.menu.showDropPanel) {
      this.handleDropPanel()
    }
  }

  // 显示/隐藏 dropPanel
  private handleDropPanel() {
    const menu = this.menu
    if (menu.getPanelContentElem == null) return
    const editor = getEditorInstance(this)

    if (this.dropPanel == null) {
      // 初次创建
      const dropPanel = new DropPanel(editor)
      const contentElem = menu.getPanelContentElem(editor)
      dropPanel.renderContent(contentElem)
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
        const contentElem = menu.getPanelContentElem(editor)
        dropPanel.renderContent(contentElem)
        dropPanel.show()
      }
    }

    // 判断 dropPanel 的位置：在菜单右侧/左侧
    const dropPanel = this.dropPanel
    if (dropPanel.isShow) {
      const $menu = this.$elem
      const { left } = $menu.offset() // 菜单元素 left

      const $toolbar = $menu.parents('.w-e-bar')
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
}

export default DropPanelButton
