/**
 * @description base button class
 * @author wangfupeng
 */

import { IButtonMenu, IDropPanelMenu, IModalMenu } from '../interface'
import $, { Dom7Array } from '../../utils/dom'
import { IBarItem, getEditorInstance } from './index'
import { clearSvgStyle } from '../helpers/helpers'
import { promiseResolveThen } from '../../utils/util'
import { addTooltip } from './tooltip'

abstract class BaseButton implements IBarItem {
  readonly $elem: Dom7Array = $(`<div class="w-e-bar-item"></div>`)
  protected readonly $button: Dom7Array = $(`<button type="button"></button>`)
  menu: IButtonMenu | IDropPanelMenu | IModalMenu
  private disabled = false

  constructor(key: string, menu: IButtonMenu | IDropPanelMenu | IModalMenu, inGroup = false) {
    this.menu = menu

    // 验证 tag
    const { tag, width } = menu
    if (tag !== 'button') throw new Error(`Invalid tag '${tag}', expected 'button'`)

    // ----------------- 初始化 dom -----------------
    const { title, hotkey = '', iconSvg = '' } = menu
    const { $button } = this
    if (iconSvg) {
      const $svg = $(iconSvg)
      clearSvgStyle($svg) // 清理 svg 样式（扩展的菜单，svg 是不可控的，所以要清理一下）
      $button.append($svg)
    } else {
      // 无 icon 则显示 title
      $button.text(title)
    }
    addTooltip($button, iconSvg, title, hotkey, inGroup) // 设置 tooltip
    if (inGroup && iconSvg) {
      // in groupButton（且有 icon），显示 menu title
      // 如果没有 icon ，上面已添加 title ，不用重复添加
      $button.append($(`<span class="title">${title}</span>`))
    }
    if (width) {
      $button.css('width', `${width}px`)
    }
    $button.attr('data-menu-key', key) // menu key
    this.$elem.append($button)

    // ----------------- 异步绑定事件 -----------------
    promiseResolveThen(() => this.init())
  }

  private init() {
    // 设置 button 属性
    this.setActive()
    this.setDisabled()

    // button click
    this.$button.on('click', e => {
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
    const { $button } = this
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
    const { $button } = this
    let disabled = this.menu.isDisabled(editor)

    if (editor.selection == null || editor.isDisabled()) {
      // 未选中，或者 readOnly ，强行设置为 disabled
      disabled = true
    }

    // 永远 enable
    if (this.menu.alwaysEnable) disabled = false

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

  changeMenuState() {
    this.setActive()
    this.setDisabled()
  }
}

export default BaseButton
