/**
 * @description ToolbarItemSelect
 * @author wangfupeng
 */

import { IMenuItem } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolbarItem, getEditorInstance } from './index'

class ToolbarItemSelect implements IToolbarItem {
  $elem: Dom7Array
  private $select: Dom7Array
  menuItem: IMenuItem
  private disabled = false

  constructor(menuItem: IMenuItem) {
    // 验证 tag
    const { tag, options = [], title } = menuItem
    if (tag !== 'select') throw new Error(`Invalid tag '${tag}', expected 'select'`)

    // 初始化 dom
    const optionsHtml = options.map(option => {
      return `<option value="${option.value}" ${option.selected ? 'selected' : ''}>
        ${option.text}
      </option>`
    })
    const $select = $(`<select>${optionsHtml}</select>`)
    const $elem = $(`<span class="w-e-toolbar-item" tooltip="${title}"></span>`)
    $elem.append($select)

    this.$elem = $elem
    this.$select = $select
    this.menuItem = menuItem
  }

  init() {
    // 设置 select 属性
    this.setValue()

    // select change
    this.$select.on('change', this.onChange.bind(this))
  }

  private onChange() {
    if (this.disabled) return

    const editor = getEditorInstance(this)
    const value = this.$select.val()
    this.menuItem.cmd(editor, value)
  }

  private setValue() {
    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    const value = menuItem.getValue(editor)
    this.$select.val(value)
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

export default ToolbarItemSelect
