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
import { IToolbarItem, createToolbarItem } from './ToolbarItem'

function genDividerElem() {
  return $('<div class="w-e-toolbar-divider"></div>')
}

class Toolbar {
  private $toolbar: Dom7Array
  private toolbarItems: IToolbarItem[] = []

  constructor(toolbarId: string) {
    this.$toolbar = $(`#${toolbarId}`)

    // 注册 items 。异步，否则拿不到 editor 实例
    promiseResolveThen(() => {
      this.registerItems()
    })
  }

  // 注册 toolbarItems
  private registerItems(keys?: Array<string | string[]>) {
    const $toolbar = this.$toolbar
    const editor = this.getEditorInstance()
    const { toolbarKeys } = editor.getConfig() // 格式如 ['a', ['b', 'c'], 'd']

    const curKeys = keys || toolbarKeys

    curKeys.forEach(keyOrGroup => {
      if (typeof keyOrGroup === 'string') {
        // 单个菜单，如 'a'
        const key = keyOrGroup
        this.registerSingleItem(key)
      } else if (Array.isArray(keyOrGroup)) {
        // 一组菜单，如 ['b', 'c']

        // 添加分割线
        const $divider = genDividerElem()
        $toolbar.append($divider)

        // 继续注册单个菜单
        const group = keyOrGroup
        this.registerItems(group)
      } else {
        // 其他形式，报错
        throw new Error(`Invalid keys form: ${JSON.stringify(curKeys)}`)
      }
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
    const editor = this.getEditorInstance()
    this.toolbarItems.forEach(toolbarItem => {
      toolbarItem.onSelectionChange()
    })
  })
}

export default Toolbar
