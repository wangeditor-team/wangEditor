/**
 * @description hover bar class
 * @author wangfupeng
 */

import { debounce } from 'lodash-es'
import { Editor, Node, Element, Text } from 'slate'
import $ from '../../utils/dom'
import { MENU_ITEM_FACTORIES } from '../register'
import { promiseResolveThen } from '../../utils/util'
import { IDomEditor } from '../../editor/dom-editor'
import { HOVER_BAR_TO_EDITOR, EDITOR_TO_TEXTAREA, BAR_ITEM_TO_EDITOR } from '../../utils/weak-maps'
import { IBarItem, createBarItem } from '../bar-item/index'
import { gen$barItemDivider } from '../helpers/helpers'
import { getPositionBySelection, getPositionByNode, correctPosition } from '../helpers/position'
import { IButtonMenu, ISelectMenu, IDropPanelMenu, IModalMenu } from '../interface'

type MenuType = IButtonMenu | ISelectMenu | IDropPanelMenu | IModalMenu

class HoverBar {
  private $elem = $('<div class="w-e-bar w-e-bar-hidden w-e-hover-bar"></div>')
  private menus: { [key: string]: MenuType } = {}
  private hoverbarItems: IBarItem[] = []

  constructor() {
    // 将 elem 渲染为 DOM（异步，否则获取不到 DOM 和 editor）
    promiseResolveThen(() => {
      const editor = this.getEditorInstance()
      const $elem = this.$elem
      const textarea = EDITOR_TO_TEXTAREA.get(editor)
      if (textarea == null) return
      textarea.$textAreaContainer.append($elem)
    })
  }

  private hideAndClean() {
    const $elem = this.$elem
    $elem.removeClass('w-e-bar-show').addClass('w-e-bar-hidden')

    // 及时先清空内容，否则影响下次
    this.hoverbarItems = []
    $elem.html('')
  }

  private show() {
    this.$elem.removeClass('w-e-bar-hidden').addClass('w-e-bar-show')
  }

  private registerItems(menuKeys: string[]) {
    const $elem = this.$elem

    menuKeys.forEach(key => {
      if (key === '|') {
        // 分割线
        const $divider = gen$barItemDivider()
        $elem.append($divider)
        return
      }

      // 正常菜单
      this.registerSingleItem(key)
    })
  }

  // 注册单个 bar item
  private registerSingleItem(key: string) {
    const editor = this.getEditorInstance()

    // 尝试从缓存中获取
    const { menus } = this
    let menu = menus[key]

    if (menu == null) {
      // 缓存获取失败，则重新创建
      const factory = MENU_ITEM_FACTORIES[key]
      if (factory == null) {
        throw new Error(`Not found menu item factory by key '${key}'`)
      }
      if (typeof factory !== 'function') {
        throw new Error(`Menu item factory (key='${key}') is not a function`)
      }

      // 创建 barItem 并记录缓存
      menu = factory()
      menus[key] = menu
    }

    const barItem = createBarItem(menu)
    this.hoverbarItems.push(barItem)

    // 保存 barItem 和 editor 的关系
    BAR_ITEM_TO_EDITOR.set(barItem, editor)
    barItem.init() // 初始化

    // 添加 DOM
    const $elem = this.$elem
    $elem.append(barItem.$elem)
  }

  private setPosition(node: Node) {
    const editor = this.getEditorInstance()
    const $elem = this.$elem
    $elem.attr('style', '') // 先清空 style ，再重新设置

    if (Element.isElement(node)) {
      // 根据 elem node 定位
      const positionStyle = getPositionByNode(editor, node, 'bar')
      $elem.css(positionStyle)
      correctPosition(editor, $elem) // 修正 position 避免超出 textContainer 边界
      return
    }
    if (Text.isText(node)) {
      // text node ，根据选区定位
      const positionStyle = getPositionBySelection(editor)
      $elem.css(positionStyle)
      correctPosition(editor, $elem) // 修正 position 避免超出 textContainer 边界
      return
    }
    // 其他情况，非 elem 非 text ，不处理
    throw new Error('hoverbar.setPosition error, current selected node is not elem nor text')
  }

  /**
   * 尝试匹配 node ，如匹配成功则显示 hoverbar
   */
  private tryMatchNodes() {
    const editor = this.getEditorInstance()
    const { selection } = editor

    if (selection == null) return // 无选区，则隐藏

    // 获取 hover bar 配置
    const keysConf = this.getHoverbarKeysConf()
    // 开始匹配
    let matchNode: Node | null = null
    let matchMenuKeys: string[] = []
    keysConf.some(conf => {
      const { match, menuKeys } = conf

      const [nodeEntry] = Editor.nodes(editor, {
        match: n => match(editor, n),
        universal: true,
      })

      // 匹配成功（找到第一个就停止，不再继续找了）
      if (nodeEntry != null) {
        matchNode = nodeEntry[0]
        matchMenuKeys = menuKeys
        return true
      }
    })

    // console.log('matchNode', matchNode, matchMenuKeys)

    if (matchNode) {
      // 如果匹配成功，则注册菜单，显示 hover bar
      this.registerItems(matchMenuKeys)
      this.setPosition(matchNode)
      this.show()
    }
  }

  /**
   * editor onChange 时触发（涉及 DOM 操作，加防抖）
   */
  onEditorChange = debounce(() => {
    this.hideAndClean() // 先隐藏
    this.tryMatchNodes() // 尝试匹配，重新渲染 hover bar
  }, 200)

  private getEditorInstance(): IDomEditor {
    const editor = HOVER_BAR_TO_EDITOR.get(this)
    if (editor == null) throw new Error('Can not get editor instance')
    return editor
  }

  private getHoverbarKeysConf() {
    const editor = this.getEditorInstance()
    const editorConfig = editor.getConfig()
    return editorConfig.hoverbarKeys || []
  }
}

export default HoverBar
