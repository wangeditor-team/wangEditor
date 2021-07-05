/**
 * @description editor config
 * @author wangfupeng
 */

import { cloneDeep } from 'lodash-es'
import { IEditorConfig, IToolbarConfig } from './interface'
import { GLOBAL_MENU_CONF } from './register'

/**
 * 生成编辑器默认配置
 */
export function genEditorConfig(userConfig?: Partial<IEditorConfig>): IEditorConfig {
  const menuConf = cloneDeep(GLOBAL_MENU_CONF)

  return {
    // 默认配置
    scroll: true,
    readOnly: false,
    autoFocus: true,
    decorate: () => [],
    maxLength: 0, // 默认不限制
    menuConf,
    hoverbarKeys: [],
    alert(info: string, type: string = 'info') {
      window.alert(info)
    },

    // 合并用户配置
    ...(userConfig || {}),
  }
}

/**
 * 生成 toolbar 默认配置
 */
export function genToolbarConfig(userConfig?: Partial<IToolbarConfig>): IToolbarConfig {
  return {
    // 默认配置
    toolbarKeys: [],

    // 合并用户配置
    ...(userConfig || {}),
  }
}
