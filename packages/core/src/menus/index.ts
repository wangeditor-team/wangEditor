/**
 * @description menus entry
 * @author wangfupeng
 */

import { IDomEditor } from '../editor/dom-editor'
import { Dom7Array } from '../utils/dom'
import { registerGlobalMenuConf } from '../config/index'

export { DropPanel } from './DropPanel'

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
  withDownArrow?: boolean // button 是否需要一个箭头 icon ，如文字颜色、背景色
  options?: IOption[] // select -> option
  width?: number

  getValue: (editor: IDomEditor) => string | boolean
  isDisabled: (editor: IDomEditor) => boolean
  cmd: (editor: IDomEditor, value: string | boolean, $menuElem?: Dom7Array) => void // button click 或 select change 时触发
}

// menu item 的工厂函数 - 集合
export const MENU_ITEM_FACTORIES: {
  [key: string]: () => IMenuItem
} = {}

/**
 * 注册 menu item 工厂函数
 * @param conf { key, factory } ，各个 menu key 不能重复
 */
function registerMenuItemFactory(conf: { key: string; factory: () => IMenuItem }) {
  const { key, factory } = conf

  if (MENU_ITEM_FACTORIES[key] != null) {
    throw new Error(`Duplicated key '${key}' in menu items`)
  }

  MENU_ITEM_FACTORIES[key] = factory
}

/**
 * 注册 menu item 配置
 * @param conf { key, config }  ，各个 menu key 不能重复
 */
function registerMenuItemConfig(conf: { key: string; config?: { [key: string]: any } }) {
  const { key, config } = conf
  registerGlobalMenuConf(key, config)
}

/**
 * 注册菜单配置
 * @param conf { key, factory, config } ，各个 menu key 不能重复
 */
export function registerMenuItem(conf: {
  key: string
  factory: () => IMenuItem
  config?: { [key: string]: any }
}) {
  const { key, factory, config } = conf
  registerMenuItemFactory({ key, factory })
  registerMenuItemConfig({ key, config })
}
