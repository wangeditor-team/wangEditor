/**
 * @description classic toolbar
 * @author wangfupeng
 */

import { debounce } from 'lodash-es'
import $, { Dom7Array } from '../../utils/dom'
import { MENU_ITEM_FACTORIES } from '../index'
import { promiseResolveThen } from '../../utils/util'
import { TOOLBAR_TO_EDITOR, TOOLBAR_ITEM_TO_EDITOR } from '../../utils/weak-maps'
import { IDomEditor } from '../../editor/dom-editor'
import { IToolbarItem, createToolbarItem } from './item/index'

function gen$divider() {
  return $('<div class="w-e-toolbar-divider"></div>')
}

class Toolbar {
  private $toolbar: Dom7Array
  private toolbarItems: IToolbarItem[] = []

  constructor(toolbarId: string) {
    const $toolbar = $(`#${toolbarId}`)
    $toolbar.on('mousedown', e => e.preventDefault())

    this.$toolbar = $toolbar

    // 注册 items 。异步，否则拿不到 editor 实例
    promiseResolveThen(() => {
      this.registerItems()
    })
  }

  // 注册 toolbarItems
  private registerItems() {
    const $toolbar = this.$toolbar
    const editor = this.getEditorInstance()
    const { toolbarKeys } = editor.getConfig() // 格式如 ['a', '|', 'b', 'c', '|', 'd']
    toolbarKeys.forEach(key => {
      if (key === '|') {
        // 分割线
        const $divider = gen$divider()
        $toolbar.append($divider)
        return
      }

      // 正常菜单
      this.registerSingleItem(key)
    })
  }

  // 注册单个 toolbarItem
  private registerSingleItem(key: string) {
    const editor = this.getEditorInstance()

    const factory = MENU_ITEM_FACTORIES[key]
    if (factory == null) {
      throw new Error(`Not found menu item factory by key '${key}'`)
      return
    }
    if (typeof factory !== 'function') {
      throw new Error(`Menu item factory (key='${key}') is not a function`)
      return
    }

    // 创建 toolbarItem 并记录下
    const menuItem = factory()
    const toolbarItem = createToolbarItem(menuItem)
    this.toolbarItems.push(toolbarItem)

    // 保存 toolbarItem 和 editor 的关系
    TOOLBAR_ITEM_TO_EDITOR.set(toolbarItem, editor)
    toolbarItem.init() // 初始化

    // 添加 DOM
    const $toolbar = this.$toolbar
    $toolbar.append(toolbarItem.$elem)
  }

  private getEditorInstance(): IDomEditor {
    const editor = TOOLBAR_TO_EDITOR.get(this)
    if (editor == null) throw new Error('Can not get editor instance')
    return editor
  }

  /**
   * editor onChange 时触发（涉及 DOM 操作，加防抖）
   */
  onEditorChange = debounce(() => {
    this.toolbarItems.forEach(toolbarItem => {
      toolbarItem.onSelectionChange()
    })
  })
}

export default Toolbar
