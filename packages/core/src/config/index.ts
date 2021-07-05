/**
 * @description editor config
 * @author wangfupeng
 */

import { cloneDeep, each } from 'lodash-es'
import { IEditorConfig, IMenuConfig, IToolbarConfig } from './interface'
import { GLOBAL_MENU_CONF } from './register'

/**
 * 生成编辑器默认配置
 */
export function genEditorConfig(userConfig: Partial<IEditorConfig> = {}): IEditorConfig {
  const defaultMenuConf = cloneDeep(GLOBAL_MENU_CONF)
  const newMenuConf: IMenuConfig = {}

  // 单独处理 menuConf
  const { MENU_CONF: userMenuConf = {} } = userConfig
  each(defaultMenuConf, (menuConf, menuKey) => {
    // 生成新的 menu config
    newMenuConf[menuKey] = {
      ...menuConf,
      ...(userMenuConf[menuKey] || {}),
    }
  })
  delete userConfig.MENU_CONF // 处理完，则删掉 menuConf ，以防下面 merge 时造成干扰

  return {
    // 默认配置
    scroll: true,
    readOnly: false,
    autoFocus: true,
    decorate: () => [],
    maxLength: 0, // 默认不限制
    MENU_CONF: newMenuConf,
    hoverbarKeys: [],
    alert(info: string, type: string = 'info') {
      window.alert(info)
    },

    // 合并用户配置
    ...userConfig,
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
