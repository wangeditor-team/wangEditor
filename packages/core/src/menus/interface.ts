/**
 * @description menu interface
 * @author wangfupeng
 */

import { Node } from 'slate'
import { IDomEditor } from '../editor/interface'
import { DOMElement } from '../utils/dom'

export interface IMenuGroup {
  key: string
  title: string
  iconSvg?: string
  menuKeys: string[]
}

export interface IPositionStyle {
  top: string
  left: string
  right: string
  bottom: string
}

export interface IOption {
  value: string
  text: string
  selected?: boolean
  styleForRenderMenuList?: { [key: string]: string } // 渲染菜单 list 时的样式
}

interface IBaseMenu {
  readonly title: string
  readonly iconSvg?: string
  readonly hotkey?: string // 快捷键，使用 https://www.npmjs.com/package/is-hotkey
  readonly alwaysEnable?: boolean // 永远不 disabled ，如“全屏”

  readonly tag: string // 'button' | 'select'
  readonly width?: number // 设置 button 宽度

  getValue: (editor: IDomEditor) => string | boolean // 获取菜单相关的 val 。如是否加粗、颜色值、h1/h2/h3 等
  isActive: (editor: IDomEditor) => boolean // 是否激活菜单，如选区处于加粗文本时，激活 bold
  isDisabled: (editor: IDomEditor) => boolean // 是否禁用菜单，如选区处于 code-block 时，禁用 bold 等样式操作

  exec: (editor: IDomEditor, value: string | boolean) => void // button click 或 select change 时触发
}

export interface IButtonMenu extends IBaseMenu {
  /* 其他属性 */
}

export interface ISelectMenu extends IBaseMenu {
  readonly selectPanelWidth?: number
  getOptions: (editor: IDomEditor) => IOption[] // select -> options
}

export interface IDropPanelMenu extends IBaseMenu {
  readonly showDropPanel: boolean // 点击 'button' 显示 dropPanel
  getPanelContentElem: (editor: IDomEditor) => DOMElement // showDropPanel 情况下，获取 content elem
}

export interface IModalMenu extends IBaseMenu {
  readonly showModal: boolean // 点击 'button' 显示 modal
  readonly modalWidth: number
  getModalContentElem: (editor: IDomEditor) => DOMElement // showModal 情况下，获取 content elem
  getModalPositionNode: (editor: IDomEditor) => Node | null // 获取 modal 定位的 node ，null 即依据选区定位
}

export type MenuFactoryType = () => IButtonMenu | ISelectMenu | IDropPanelMenu | IModalMenu

export interface IRegisterMenuConf {
  key: string
  factory: MenuFactoryType
  config?: { [key: string]: any }
}
