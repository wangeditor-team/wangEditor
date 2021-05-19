/**
 * @description menus entry
 * @author wangfupeng
 */

import { IDomEditor } from '../editor/dom-editor'

type OptionType = {
  value: string
  text: string
}

export interface IMenuItem {
  title: string
  iconClass: string

  tag: string // 'button' / 'select'
  options?: OptionType[] // select -> option

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
 * @param key menu item key 不可重复
 * @param fn 工厂函数
 */
export function registerMenuItemFactory(key: string, fn: () => IMenuItem) {
  if (MENU_ITEM_FACTORIES[key] != null) {
    throw new Error(`Duplicated key '${key}' in menu items`)
  }

  MENU_ITEM_FACTORIES[key] = fn
}
