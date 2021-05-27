/**
 * @description
 * @author wangfupeng
 */

import { IMenuItem } from '../../index'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolbarItem, getEditorInstance } from './index'
import { clearSvgStyle, gen$downArrow, hideAllPanels } from '../../helpers'
import DropPanel from './DropPanel'
class ToolbarItemButton implements IToolbarItem {
  $elem: Dom7Array = $(`<div class="w-e-toolbar-item"></div>`)
  private $button: Dom7Array
  menuItem: IMenuItem
  private disabled = false
  private dropPanel: DropPanel | null = null

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
      hideAllPanels() // 隐藏当前的各种 panel
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
