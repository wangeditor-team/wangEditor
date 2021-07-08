/**
 * @description classic toolbar
 * @author wangfupeng
 */

import { debounce } from 'lodash-es'
import $, { Dom7Array, DOMElement } from '../../utils/dom'
import { MENU_ITEM_FACTORIES } from '../register'
import { promiseResolveThen } from '../../utils/util'
import { TOOLBAR_TO_EDITOR, BAR_ITEM_TO_EDITOR } from '../../utils/weak-maps'
import { IDomEditor } from '../../editor/interface'
import { IBarItem, createBarItem, createBarItemGroup } from '../bar-item/index'
import { gen$barItemDivider } from '../helpers/helpers'
import { IMenuGroup, IButtonMenu, ISelectMenu, IDropPanelMenu, IModalMenu } from '../interface'
import GroupButton from '../bar-item/GroupButton'
import { IToolbarConfig } from '../../config/interface'

type MenuType = IButtonMenu | ISelectMenu | IDropPanelMenu | IModalMenu

class Toolbar {
  private readonly $toolbar: Dom7Array = $(`<div class="w-e-bar w-e-bar-show w-e-toolbar"></div>`)
  private menus: { [key: string]: MenuType } = {}
  private toolbarItems: IBarItem[] = []
  private config: IToolbarConfig = {}

  constructor(selector: string | DOMElement, config: IToolbarConfig) {
    this.config = config

    // @ts-ignore 初始化 DOM
    const $box = $(selector)
    if ($box.length === 0) {
      throw new Error(`Cannot find toolbar DOM by selector '${selector}'`)
    }
    const $toolbar = this.$toolbar
    $toolbar.on('mousedown', e => e.preventDefault()) // 防止点击失焦
    $box.append($toolbar)

    // 异步，否则拿不到 editor 实例
    promiseResolveThen(() => {
      // 注册 items
      this.registerItems()

      // 创建完，先模拟一次 onchange
      this.changeToolbarState()

      // 监听 editor onchange
      const editor = this.getEditorInstance()
      editor.on('change', this.changeToolbarState)
    })
  }

  getMenus() {
    return this.menus
  }

  getConfig() {
    return this.config
  }

  // 注册 toolbarItems
  private registerItems() {
    const $toolbar = this.$toolbar
    const { toolbarKeys = [] } = this.config // 格式如 ['a', '|', 'b', 'c', '|', 'd']
    toolbarKeys.forEach(key => {
      if (key === '|') {
        // 分割线
        const $divider = gen$barItemDivider()
        $toolbar.append($divider)
        return
      }

      // 正常菜单
      if (typeof key === 'string') {
        this.registerSingleItem(key, this)
        return
      }

      // 菜单组
      this.registerGroup(key)
    })
  }

  // 注册菜单组
  private registerGroup(menu: IMenuGroup) {
    const $toolbar = this.$toolbar
    const group = createBarItemGroup(menu)
    const { menuKeys = [] } = menu

    // 注册子菜单
    menuKeys.forEach(key => {
      this.registerSingleItem(
        key,
        group // 将子菜单，添加到 group
      )
    })

    // 添加到 DOM
    $toolbar.append(group.$elem)
  }

  // 注册单个 toolbarItem
  private registerSingleItem(key: string, container: GroupButton | Toolbar) {
    const editor = this.getEditorInstance()
    const inGroup = container instanceof GroupButton // 要添加到 groupButton

    // 尝试从缓存中获取
    const { menus } = this
    let menu = menus[key]

    if (menu == null) {
      // 缓存中没有，则创建
      const factory = MENU_ITEM_FACTORIES[key]
      if (factory == null) {
        throw new Error(`Not found menu item factory by key '${key}'`)
      }
      if (typeof factory !== 'function') {
        throw new Error(`Menu item factory (key='${key}') is not a function`)
      }

      // 创建 toolbarItem 并记录缓存
      menu = factory()
      menus[key] = menu
    } else {
      console.warn(`Duplicated toolbar menu key '${key}'\n重复注册了菜单栏 menu '${key}'`)
    }

    const toolbarItem = createBarItem(menu, inGroup)
    this.toolbarItems.push(toolbarItem)

    // 保存 toolbarItem 和 editor 的关系
    BAR_ITEM_TO_EDITOR.set(toolbarItem, editor)

    // 添加 DOM
    if (inGroup) {
      // barItem 是 groupButton
      const group = container as GroupButton
      group.appendBarItem(toolbarItem)
    } else {
      // barItem 添加到 toolbar
      const toolbar = container as Toolbar
      toolbar.$toolbar.append(toolbarItem.$elem)
    }
  }

  private getEditorInstance(): IDomEditor {
    const editor = TOOLBAR_TO_EDITOR.get(this)
    if (editor == null) throw new Error('Can not get editor instance')
    return editor
  }

  /**
   * editor onChange 时触发（涉及 DOM 操作，加防抖）
   */
  changeToolbarState = debounce(() => {
    this.toolbarItems.forEach(toolbarItem => {
      toolbarItem.changeMenuState()
    })
  }, 200)

  /**
   * 销毁 toolbar
   */
  destroy() {
    // 销毁 DOM
    this.$toolbar.remove()

    // 清空属性
    this.menus = {}
    this.toolbarItems = []
  }
}

export default Toolbar
