/**
 * @description select
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { IBarItem, getEditorInstance } from './index'
import { IOption, ISelectMenu } from '../interface'
import SelectList from '../panel-and-modal/SelectList'
import { gen$downArrow } from '../helpers/helpers'
import { promiseResolveThen } from '../../utils/util'
import { addTooltip } from './tooltip'

// 根据 option value 获取 text
function getOptionText(options: IOption[], value: string): string {
  const length = options.length
  let text = ''
  for (let i = 0; i < length; i++) {
    const opt = options[i]
    if (opt.value === value) {
      text = opt.text
      break
    }
  }
  return text
}

class BarItemSelect implements IBarItem {
  readonly $elem: Dom7Array = $(`<div class="w-e-bar-item"></div>`)
  private readonly $button: Dom7Array = $(`<button type="button" class="select-button"></button>`)
  menu: ISelectMenu
  private disabled = false
  private selectList: SelectList | null = null

  constructor(key: string, menu: ISelectMenu, inGroup = false) {
    // 验证 tag
    const { tag, title, width, iconSvg = '', hotkey = '' } = menu
    if (tag !== 'select') throw new Error(`Invalid tag '${tag}', expected 'select'`)

    // 初始化 dom
    const $button = this.$button
    if (width) {
      $button.css('width', `${width}px`)
    }
    $button.attr('data-menu-key', key) // menu key
    addTooltip($button, iconSvg, title, hotkey, inGroup) // 设置 tooltip
    this.$elem.append($button)

    this.menu = menu

    // 异步绑定事件
    promiseResolveThen(() => this.init())
  }

  private init() {
    // 设置 select 属性
    this.setSelectedValue()

    // select button click
    this.$button.on('click', (e: Event) => {
      e.preventDefault()
      const editor = getEditorInstance(this)
      editor.hidePanelOrModal() // 隐藏当前的各种 panel
      this.trigger()
    })
  }

  private trigger() {
    const editor = getEditorInstance(this)

    if (editor.isDisabled()) return
    if (this.disabled) return

    const menu = this.menu

    // 显示下拉列表
    if (this.selectList == null) {
      // 初次创建，渲染 list 并显示
      this.selectList = new SelectList(editor, menu.selectPanelWidth)
      const selectList = this.selectList
      const options = menu.getOptions(editor)
      selectList.renderList(options)
      selectList.appendTo(this.$elem)
      selectList.show()

      // 初次创建，绑定事件
      selectList.$elem.on('click', 'li', (e: Event) => {
        const { target } = e
        if (target == null) return

        e.preventDefault()
        const $li = $(target)
        const val = $li.attr('data-value')
        this.onChange(val)
      })
    } else {
      // 不是初次创建
      const selectList = this.selectList
      if (selectList.isShow) {
        // 当前处于显示状态，则隐藏
        selectList.hide()
      } else {
        // 当前未处于显示状态，则重新渲染 list ，并显示
        const options = menu.getOptions(editor) // 每次都要重新获取 options ，因为选中项可能会变化
        selectList.renderList(options)
        selectList.show()
      }
    }
  }

  private onChange(value: string) {
    const editor = getEditorInstance(this)
    const menu = this.menu
    menu.exec && menu.exec(editor, value)
  }

  private setSelectedValue() {
    const editor = getEditorInstance(this)
    const menu = this.menu
    const value = menu.getValue(editor)

    const options = menu.getOptions(editor)
    const optText = getOptionText(options, value.toString())

    const $button = this.$button
    const $downArrow = gen$downArrow() // 向下的箭头图标
    $button.empty()
    $button.text(optText)
    $button.append($downArrow)
  }

  private setDisabled() {
    const editor = getEditorInstance(this)
    const menu = this.menu
    let disabled = menu.isDisabled(editor)
    const $button = this.$button

    if (editor.selection == null || editor.isDisabled()) {
      // 未选中，或者 readOnly ，强行设置为 disabled
      disabled = true
    }

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
    this.setSelectedValue()
    this.setDisabled()
  }
}

export default BarItemSelect
