/**
 * @description menu interface
 * @author wangfupeng
 */

import { IDomEditor } from '../editor/dom-editor'
import { Dom7Array } from '../utils/dom'

export interface IPositionStyle {
  top?: string
  left?: string
  right?: string
  bottom?: string
}

export interface IPanel {
  $elem: Dom7Array
  show: () => void
  hide: () => void
}

export interface IOption {
  value: string
  text: string
  selected?: boolean
  styleForRenderMenuList?: { [key: string]: string } // 渲染菜单 list 时的样式
}

export interface IMenuItem {
  title: string
  iconSvg: string

  tag: string // 'button' / 'select'
  options?: IOption[] // select -> options
  width?: number // 设置 button 宽度

  showDropPanel?: boolean // 点击 'button' 显示 dropPanel
  showModal?: boolean // 点击 'button' 显示 modal

  getValue: (editor: IDomEditor) => string | boolean
  isDisabled: (editor: IDomEditor) => boolean

  exec?: (editor: IDomEditor, value: string | boolean) => void // button click 或 select change 时触发
  getPanelContentElem?: (editor: IDomEditor) => Dom7Array // showDropPanel 情况下，获取 content elem
  getModalContentElem?: (editor: IDomEditor) => Dom7Array // showModal 情况下，获取 content elem

  // TODO 该接口需要拆分，不能混合在一起
}
