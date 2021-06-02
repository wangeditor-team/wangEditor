/**
 * @description register menu
 * @author wangfupeng
 */

import { MenuFactoryType, IMenuConf } from './interface'
import { registerGlobalMenuConf } from '../config/index'

// menu item 的工厂函数 - 集合
export const MENU_ITEM_FACTORIES: {
  [key: string]: MenuFactoryType
} = {}

/**
 * 注册 menu 工厂函数
 * @param conf { key, factory } ，各个 menu key 不能重复
 */
function registerMenuFactory(conf: { key: string; factory: MenuFactoryType }) {
  const { key, factory } = conf

  if (MENU_ITEM_FACTORIES[key] != null) {
    throw new Error(`Duplicated key '${key}' in menu items`)
  }

  MENU_ITEM_FACTORIES[key] = factory
}

/**
 * 注册 menu 配置
 * @param conf { key, config }  ，各个 menu key 不能重复
 */
function registerMenuConfig(conf: { key: string; config?: { [key: string]: any } }) {
  const { key, config } = conf
  registerGlobalMenuConf(key, config)
}

/**
 * 注册菜单配置
 * @param conf { key, factory, config } ，各个 menu key 不能重复
 */
export function registerMenu(conf: IMenuConf) {
  const { key, factory, config } = conf
  registerMenuFactory({ key, factory })
  registerMenuConfig({ key, config })
}
