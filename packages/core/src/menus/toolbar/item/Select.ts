/**
 * @description ToolbarItemSelect
 * @author wangfupeng
 */

import { IMenuItem } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolbarItem, getEditorInstance } from './index'
import { IOption } from '../../index'
import SelectList from '../../SelectList'

// 箭头图标 svg
function gen$downArrow() {
  const $downArrow = $(
    `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 729.86624c-13.70112 0-27.40224-5.23264-37.84704-15.6672l-328.69376-328.704c-20.91008-20.91008-20.91008-54.80448 0-75.70432 20.89984-20.89984 54.79424-20.89984 75.70432 0L512 600.63744l290.83648-290.83648c20.91008-20.89984 54.80448-20.89984 75.70432 0 20.91008 20.89984 20.91008 54.79424 0 75.70432l-328.69376 328.704C539.40224 724.64384 525.70112 729.86624 512 729.86624z"></path></svg>`
  )
  return $downArrow
}

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

// 根据 selectedValue 重新生成 options
function genOptions(options: IOption[], selectedValue: string): IOption[] {
  return options.map(opt => {
    const { value, text, styleForRenderMenuList } = opt
    if (value === selectedValue) {
      // 选中的 opt
      return { value, text, styleForRenderMenuList, selected: true }
    }
    // 未选中的 opt
    return { value, text, styleForRenderMenuList }
  })
}

class ToolbarItemSelect implements IToolbarItem {
  $elem: Dom7Array = $(`<div class="w-e-toolbar-item"></div>`)
  private $button: Dom7Array
  menuItem: IMenuItem
  private disabled = false
  private selectList: SelectList | null = null

  constructor(menuItem: IMenuItem) {
    // 验证 tag
    const { tag, title, width } = menuItem
    if (tag !== 'select') throw new Error(`Invalid tag '${tag}', expected 'select'`)

    // 初始化 dom
    const $button = $(`<button class="select-button" tooltip="${title}"></button>`)
    if (width) {
      $button.css('width', `${width}px`)
    }
    this.$elem.append($button)

    this.$button = $button
    this.menuItem = menuItem
  }

  init() {
    // 设置 select 属性
    this.setSelectedValue()

    // click
    this.$button.on('click', (e: Event) => {
      e.stopPropagation()
      this.trigger()
    })
  }

  private trigger() {
    if (this.disabled) return

    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    const { options = [] } = menuItem
    const value = menuItem.getValue(editor)
    const newOptions = genOptions(options, value.toString()) // 根据 value 重新生成 options（value 可能会随时变化）

    // 显示下拉列表
    if (this.selectList == null) {
      // 初次创建，渲染 list 并显示
      this.selectList = new SelectList()
      const selectList = this.selectList
      selectList.renderList(newOptions, 'list')
      selectList.appendTo(this.$elem)
      selectList.show()

      // 初次创建，绑定事件
      selectList.$elem.on('mousedown', 'li', (e: Event) => {
        e.preventDefault()
        // @ts-ignore
        const $li = $(e.target)
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
        selectList.renderList(newOptions, 'list')
        selectList.show()
      }
    }
  }

  private onChange(value: string) {
    const editor = getEditorInstance(this)
    this.menuItem.cmd(editor, value)
  }

  private setSelectedValue() {
    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    const value = menuItem.getValue(editor)

    const { options = [] } = menuItem
    const optText = getOptionText(options, value.toString())

    const $button = this.$button
    const $downArrow = gen$downArrow() // 向下的箭头图标
    $button.html('')
    $button.text(optText)
    $button.append($downArrow)
  }

  private setDisabled() {
    const editor = getEditorInstance(this)
    const menuItem = this.menuItem
    const disabled = menuItem.isDisabled(editor)
    const $button = this.$button

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
    this.setSelectedValue()
    this.setDisabled()
  }
}

export default ToolbarItemSelect
