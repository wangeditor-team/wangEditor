/**
 * @description register menu
 * @author wangfupeng
 */

import { MenuFactoryType, IRegisterMenuConf } from './interface'
import { registerGlobalMenuConf } from '../config/register'

// menu item 的工厂函数 - 集合
export const MENU_ITEM_FACTORIES: {
  [key: string]: MenuFactoryType
} = {}

/**
 * 注册菜单配置
 * @param registerMenuConf { key, factory, config } ，各个 menu key 不能重复
 * @param customConfig 自定义 menu config
 */
export function registerMenu(
  registerMenuConf: IRegisterMenuConf,
  customConfig?: { [key: string]: any }
) {
  const { key, factory, config } = registerMenuConf

  // 合并 config
  const newConfig = { ...config, ...(customConfig || {}) }

  // 注册 menu
  if (MENU_ITEM_FACTORIES[key] != null) {
    throw new Error(`Duplicated key '${key}' in menu items`)
  }
  MENU_ITEM_FACTORIES[key] = factory

  // 将 config 保存到全局
  registerGlobalMenuConf(key, newConfig)
}
