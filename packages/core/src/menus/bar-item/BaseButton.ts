/**
 * @description base button class
 * @author wangfupeng
 */

import { IButtonMenu, IDropPanelMenu, IModalMenu } from '../interface'
import $, { Dom7Array } from '../../utils/dom'
import { IBarItem, getEditorInstance } from './index'
import { clearSvgStyle } from '../helpers/helpers'
import { promiseResolveThen } from '../../utils/util'

abstract class BaseButton implements IBarItem {
  $elem: Dom7Array = $(`<div class="w-e-bar-item"></div>`)
  protected $button: Dom7Array
  menu: IButtonMenu | IDropPanelMenu | IModalMenu
  private disabled = false

  constructor(menu: IButtonMenu | IDropPanelMenu | IModalMenu, inGroup = false) {
    this.menu = menu

    // 验证 tag
    const { tag, width } = menu
    if (tag !== 'button') throw new Error(`Invalid tag '${tag}', expected 'button'`)

    // ----------------- 初始化 dom -----------------
    const { title, hotkey, iconSvg } = menu
    const $svg = $(iconSvg)
    clearSvgStyle($svg) // 清理 svg 样式（扩展的菜单，svg 是不可控的，所以要清理一下）
    const $button = $(`<button></button>`)
    $button.append($svg)
    if (inGroup) {
      // in groupButton ，显示 menu title
      $button.append($(`<span class="title">${title}</span>`))
    }
    if (width) {
      $button.css('width', `${width}px`)
    }
    this.$elem.append($button)
    this.$button = $button

    // ----------------- 设置 tooltip -----------------
    if (inGroup) {
      // in groupButton ，tooltip 只显示 快捷键
      if (hotkey) {
        $button.attr('data-tooltip', hotkey)
        $button.addClass('w-e-menu-tooltip')
        $button.addClass('tooltip-right') // tooltip 显示在右侧
      }
    } else {
      // 非 in groupButton ，正常实现 tooltip
      const tooltip = hotkey ? `${title}\n${hotkey}` : title
      $button.attr('data-tooltip', tooltip)
      $button.addClass('w-e-menu-tooltip')
    }

    // ----------------- 异步绑定事件 -----------------
    promiseResolveThen(() => this.init())
  }

  private init() {
    // 设置 button 属性
    this.setActive()
    this.setDisabled()

    // button click
    this.$button.on('mousedown', e => {
      e.preventDefault()
      const editor = getEditorInstance(this)

      editor.hidePanelOrModal() // 隐藏当前的各种 panel

      if (this.disabled) return

      this.exec() // 执行 menu.exec
      this.onButtonClick() // 执行其他的逻辑
    })
  }

  /**
   * 执行 menu.exec
   */
  private exec() {
    const editor = getEditorInstance(this)
    const menu = this.menu
    const value = menu.getValue(editor)
    menu.exec(editor, value)
  }

  // 交给子类去扩展
  abstract onButtonClick(): void

  private setActive() {
    const editor = getEditorInstance(this)
    const $button = this.$button
    const active = this.menu.isActive(editor)

    const className = 'active'
    if (active) {
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
    const disabled = this.menu.isDisabled(editor)

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

export default BaseButton
