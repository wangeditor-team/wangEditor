/**
 * @description toolbar button/select
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { IMenuItem } from '../index'
import { IDomEditor } from '../../editor/dom-editor'
import { TOOLBAR_ITEM_TO_EDITOR } from '../../utils/weak-maps'

function getEditorInstance(item: IToolbarItem): IDomEditor {
  const editor = TOOLBAR_ITEM_TO_EDITOR.get(item)
  if (editor == null) throw new Error('Can not get editor instance')
  return editor
}

export interface IToolbarItem {
  $elem: Dom7Array
  menuItem: IMenuItem
  init: () => void
  onSelectionChange: () => void
}

/**
 * toolbar button
 */
class ToolbarItemButton implements IToolbarItem {
  $elem: Dom7Array = $('<button></button>')
  menuItem: IMenuItem
  private disabled = false

  constructor(menuItem: IMenuItem) {
    // 验证 tag
    const { tag } = menuItem
    if (tag !== 'button') throw new Error(`Invalid tag '${tag}', expected 'button'`)

    // 初始化 dom
    const { title, iconClass } = menuItem
    const $elem = $(`<span class="w-e-toolbar-item"><i class="${iconClass}"></i>${title}</span>`)

    this.$elem = $elem
    this.menuItem = menuItem
  }

  init() {
    // 设置 button 属性
    this.setActive()
    this.setDisabled()

    // click
    this.$elem.on('mousedown', (e: Event) => {
      e.preventDefault()
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
    const $elem = this.$elem
    const menuItem = this.menuItem
    const value = menuItem.getValue(editor)

    const className = 'active'
    if (value) {
      // 设置为 active
      $elem.addClass(className)
    } else {
      // 取消 active
      $elem.removeClass(className)
    }
  }

  private setDisabled() {
    const editor = getEditorInstance(this)
    const $elem = this.$elem
    const menuItem = this.menuItem
    const disabled = menuItem.isDisabled(editor)

    const className = 'disabled'
    if (disabled) {
      // 设置为 disabled
      $elem.addClass(className)
    } else {
      // 取消 disabled
      $elem.removeClass(className)
    }

    this.disabled = disabled // 记录下来
  }

  onSelectionChange() {
    this.setActive()
    this.setDisabled()
  }
}

/**
 * toolbar select
 */
class ToolbarItemSelect implements IToolbarItem {
  $elem: Dom7Array
  menuItem: IMenuItem
  private disabled = false

  constructor(menuItem: IMenuItem) {
    // 验证 tag
    const { tag, options = [] } = menuItem
    if (tag !== 'select') throw new Error(`Invalid tag '${tag}', expected 'select'`)

    // 初始化 dom
    const optionsHtml = options.map(option => {
      return `<option value="${option.value}" ${option.selected ? 'selected' : ''}>
        ${option.text}
      </option>`
    })
    const $elem = $(`<select>${optionsHtml}</select>`)

    this.$elem = $elem
    this.menuItem = menuItem
  }

  init() {
    // 设置 select 属性
    this.setValue()

    // select change
    this.$elem.on('change', this.onChange.bind(this))
  }

  private onChange() {
    if (this.disabled) return

    const editor = getEditorInstance(this)
    const value = this.$elem.val()
    this.menuItem.cmd(editor, value)
  }

  private setValue() {
    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    const value = menuItem.getValue(editor)
    this.$elem.val(value)
  }

  private setDisabled() {
    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    const disabled = menuItem.isDisabled(editor)

    const $elem = this.$elem
    if (disabled) {
      $elem.attr('disabled', 'true')
    } else {
      $elem.removeAttr('disabled')
    }

    this.disabled = disabled // 记录下来
  }

  onSelectionChange() {
    this.setValue()
    this.setDisabled()
  }
}

/**
 * 创建 toolbar button/select
 * @param menuItem menuItem
 * @param editor editor
 */
export function createToolbarItem(menuItem: IMenuItem): IToolbarItem {
  const { tag } = menuItem
  if (tag === 'button') {
    return new ToolbarItemButton(menuItem)
  }
  if (tag === 'select') {
    return new ToolbarItemSelect(menuItem)
  }
  throw new Error(`Invalid tag in menuItem ${JSON.stringify(menuItem)}`)
}
