/**
 * @description editor config
 * @author wangfupeng
 */

import { cloneDeep } from 'lodash-es'
import { IConfig } from './interface'
import { GLOBAL_MENU_CONF } from './register'

/**
 * 默认配置
 */
function getDefaultConfig(): IConfig {
  const menuConf = cloneDeep(GLOBAL_MENU_CONF)

  return {
    scroll: true,
    readOnly: false,
    autoFocus: true,
    decorate: () => [],
    maxLength: 0, // 默认不限制
    menuConf,
    toolbarKeys: [],
    hoverbarKeys: [],
    alert(info: string, type: string = 'info') {
      window.alert(info)
    },
  }
}

// 生成配置
export function genEditorConfig(userConfig?: Partial<IConfig>): IConfig {
  // 默认配置
  const defaultConfig = getDefaultConfig()

  // 合并默认配置，和用户配置
  return {
    ...defaultConfig,
    ...(userConfig || {}),
  }
}
