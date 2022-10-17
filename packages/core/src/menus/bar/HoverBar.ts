/**
 * @description hover bar class
 * @author wangfupeng
 */

import debounce from 'lodash.debounce'
import { Editor, Node, Element, Text, Path, Range } from 'slate'
import $ from '../../utils/dom'
import { MENU_ITEM_FACTORIES } from '../register'
import { promiseResolveThen } from '../../utils/util'
import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import { HOVER_BAR_TO_EDITOR, BAR_ITEM_TO_EDITOR } from '../../utils/weak-maps'
import { IBarItem, createBarItem } from '../bar-item/index'
import { gen$barItemDivider } from '../helpers/helpers'
import { getPositionBySelection, getPositionByNode, correctPosition } from '../helpers/position'
import { IButtonMenu, ISelectMenu, IDropPanelMenu, IModalMenu } from '../interface'
import { CustomElement } from '../../../../custom-types'

type MenuType = IButtonMenu | ISelectMenu | IDropPanelMenu | IModalMenu

/**
 * 是否选中了 text （用于 text hoverbarKeys）
 * @param editor editor
 * @param n node
 */
function isSelectedText(editor: IDomEditor, n: Node) {
  const { selection } = editor
  if (selection == null) return false // 无选区
  if (Range.isCollapsed(selection)) return false // 未选中文字，选区的是折叠的

  const selectedElems = DomEditor.getSelectedElems(editor)
  const notMatch = selectedElems.some((elem: CustomElement) => {
    if (editor.isVoid(elem)) return true

    const { type } = elem
    if (['pre', 'code', 'table'].includes(type)) return true
  })
  if (notMatch) return false

  if (Text.isText(n)) return true // 匹配 text node
  return false
}

class HoverBar {
  private readonly $elem = $('<div class="w-e-bar w-e-bar-hidden w-e-hover-bar"></div>')
  private menus: { [key: string]: MenuType } = {}
  private hoverbarItems: IBarItem[] = []
  private prevSelectedNode: Node | null = null // 上一次选中的 node
  private isShow = false

  constructor() {
    // 异步，否则获取不到 DOM 和 editor
    promiseResolveThen(() => {
      const editor = this.getEditorInstance()

      // 将 elem 渲染为 DOM
      const $elem = this.$elem
      // @ts-ignore
      $elem.on('mousedown', e => e.preventDefault(), { passive: false }) // 防止点击失焦
      const textarea = DomEditor.getTextarea(editor)
      textarea.$textAreaContainer.append($elem)

      // 绑定 editor onchange
      editor.on('change', this.changeHoverbarState)

      // 滚动时隐藏
      const hideAndClean = this.hideAndClean.bind(this)
      editor.on('scroll', hideAndClean)

      // fullScreen 时隐藏
      editor.on('fullScreen', hideAndClean)
      editor.on('unFullScreen', hideAndClean)
    })
  }

  getMenus() {
    return this.menus
  }

  hideAndClean() {
    const $elem = this.$elem
    $elem.removeClass('w-e-bar-show').addClass('w-e-bar-hidden')

    // 及时先清空内容，否则影响下次
    this.hoverbarItems = []
    $elem.empty()

    this.isShow = false
  }

  /**
   * 判断 hoverbar 是否在网页下部？
   * 如果是，SelectList 和 DropPanel 要显示在 hoverbar 上面
   */
  private checkPositionBottom() {
    const $elem = this.$elem

    let isBottom = false
    const { innerHeight } = window
    const minDistance = 360 // 距离底部最小 360px
    if (innerHeight && innerHeight >= minDistance) {
      const { bottom } = $elem[0].getBoundingClientRect()
      if (innerHeight - bottom < minDistance) {
        // hoverbar 距离底部不足 360
        isBottom = true
      }
    }
    if (isBottom) {
      $elem.addClass('w-e-bar-bottom')
    } else {
      $elem.removeClass('w-e-bar-bottom')
    }
  }

  private show() {
    this.$elem.removeClass('w-e-bar-hidden').addClass('w-e-bar-show')
    this.isShow = true

    // 判断 hoverbar 是否在网页下部
    this.checkPositionBottom()
  }

  private changeItemsState() {
    promiseResolveThen(() => {
      this.hoverbarItems.forEach(item => {
        item.changeMenuState()
      })
    })
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

    const barItem = createBarItem(key, menu)
    this.hoverbarItems.push(barItem)

    // 保存 barItem 和 editor 的关系
    BAR_ITEM_TO_EDITOR.set(barItem, editor)

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
   * 获取选中的 node ，以及对应的 menu keys
   */
  private getSelectedNodeAndMenuKeys(): { node: Node; menuKeys: string[] } | null {
    const editor = this.getEditorInstance()

    if (editor.selection == null) {
      return null
    }

    // 获取 hover bar 配置
    const keysConf = this.getHoverbarKeysConf()
    // 开始匹配
    let matchNode: Node | null = null
    let matchMenuKeys: string[] = []

    for (const elemType in keysConf) {
      const conf = keysConf[elemType]
      const { match, menuKeys = [] } = conf

      // 定义了 match 则用 match 。未定义 match 则用 elemType
      const matchFn = match
        ? match
        : (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, elemType)

      const [nodeEntry] = Editor.nodes(editor, {
        match: n => matchFn(editor, n),
        universal: true,
      })

      // 匹配成功（找到第一个就停止，不再继续找了）
      if (nodeEntry != null) {
        matchNode = nodeEntry[0]
        matchMenuKeys = menuKeys
        break
      }
    }

    // 未匹配成功
    if (matchNode == null || matchMenuKeys.length === 0) return null

    // 匹配成功
    return {
      node: matchNode,
      menuKeys: matchMenuKeys,
    }
  }

  /**
   * editor onChange 时触发（涉及 DOM 操作，加防抖）
   */
  changeHoverbarState = debounce(() => {
    // 获取选中的 node ，以及对应的 menu keys
    const { isShow } = this
    const { node = null, menuKeys = [] } = this.getSelectedNodeAndMenuKeys() || {}

    if (node != null) {
      this.changeItemsState() // 更新菜单状态
    }

    if (node && Element.isElement(node)) {
      // 选中了 elem node（不可以是 text node）
      if (isShow) {
        // hoverbar 当前已显示
        const samePath = this.isSamePath(node, this.prevSelectedNode)
        if (samePath) {
          // 和之前选中的 node path 相同 —— 满足这些条件，即终止
          return
        }
      }
    }

    // 选择了新的 node（或选区是 null），先隐藏
    this.hideAndClean()

    if (node != null) {
      // 选中了新的 node
      this.registerItems(menuKeys)
      this.setPosition(node)
      this.show()
    }

    // 最后，重新记录 prevSelectedNode ，重要
    this.prevSelectedNode = node
  }, 200)

  private getEditorInstance(): IDomEditor {
    const editor = HOVER_BAR_TO_EDITOR.get(this)
    if (editor == null) throw new Error('Can not get editor instance')
    return editor
  }

  private getHoverbarKeysConf() {
    const editor = this.getEditorInstance()
    const { hoverbarKeys = {} } = editor.getConfig()

    const textHoverbarKeys = hoverbarKeys.text
    if (textHoverbarKeys && textHoverbarKeys.match == null) {
      // 对 text hoverbarKeys 增加 match 函数（否则无法判断是否选中了 text）
      textHoverbarKeys.match = isSelectedText
    }

    return hoverbarKeys
  }

  /**
   * 检查两个 node 是否 path 相等
   */
  private isSamePath(node1: Node | null, node2: Node | null) {
    if (node1 == null || node2 == null) {
      return false
    }

    const path1 = DomEditor.findPath(null, node1)
    const path2 = DomEditor.findPath(null, node2)
    const res = Path.equals(path1, path2)
    return res
  }

  /**
   * 销毁 hoverbar
   */
  destroy() {
    // fix https://github.com/wangeditor-team/wangEditor-v5/issues/410
    this.changeHoverbarState.cancel()
    // 销毁 DOM
    this.$elem.remove()

    // 清空属性
    this.menus = {}
    this.hoverbarItems = []
    this.prevSelectedNode = null
  }
}

export default HoverBar
