/**
 * @description menus entry
 * @author wangfupeng
 */

import { IDomEditor } from '../editor/dom-editor'

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
  cmd: (editor: IDomEditor, value?: string | boolean) => void // button click 或 select change 时触发
}

// menu item 的工厂函数 - 集合
export const MENU_ITEM_FACTORIES: {
  [key: string]: () => IMenuItem
} = {}

/**
 * 注册 menu item 工厂函数
 * @param conf { key, factory } ，各个 menu key 不能重复
 */
export function registerMenuItemFactory(conf: { key: string; factory: () => IMenuItem }) {
  const { key, factory } = conf

  if (MENU_ITEM_FACTORIES[key] != null) {
    throw new Error(`Duplicated key '${key}' in menu items`)
  }

  MENU_ITEM_FACTORIES[key] = factory
}
