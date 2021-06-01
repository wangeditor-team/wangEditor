/**
 * @description register menu
 * @author wangfupeng
 */

import { IMenuItem } from './interface'
import { registerGlobalMenuConf } from '../config/index'

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
