/**
 * @description config register
 * @author wangfupeng
 */

import { IMenuConfig, ISingleMenuConfig } from '../config/interface'

// 全局的菜单配置
export const GLOBAL_MENU_CONF: IMenuConfig = {}

/**
 * 注册全局菜单配置
 * @param key menu key
 * @param config config
 */
export function registerGlobalMenuConf(key: string, config?: ISingleMenuConfig) {
  if (config == null) return
  GLOBAL_MENU_CONF[key] = config
}
