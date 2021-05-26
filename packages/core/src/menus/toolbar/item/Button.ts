/**
 * @description
 * @author wangfupeng
 */

import { IMenuItem } from '../../index'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolbarItem, getEditorInstance } from './index'
import { clearSvgStyle, gen$downArrow } from '../../helpers'
class ToolbarItemButton implements IToolbarItem {
  $elem: Dom7Array = $(`<div class="w-e-toolbar-item"></div>`)
  private $button: Dom7Array
  menuItem: IMenuItem
  private disabled = false

  constructor(menuItem: IMenuItem) {
    // 验证 tag
    const { tag, width, withDownArrow } = menuItem
    if (tag !== 'button') throw new Error(`Invalid tag '${tag}', expected 'button'`)

    // 初始化 dom
    const { title, iconSvg } = menuItem
    const $svg = $(iconSvg)
    clearSvgStyle($svg) // 清理 svg 样式（扩展的菜单，svg 是不可控的，所以要清理一下）
    const $button = $(`<button tooltip="${title}"></button>`)
    $button.append($svg)
    if (withDownArrow) {
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
    this.$button.on('click', () => {
      this.trigger()
    })
  }

  private trigger() {
    if (this.disabled) return

    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    const value = menuItem.getValue(editor)
    menuItem.cmd(editor, value)
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
