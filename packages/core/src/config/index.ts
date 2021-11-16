/**
 * @description editor config
 * @author wangfupeng
 */

import forEach from 'lodash.foreach'
import cloneDeep from 'lodash.clonedeep'
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
  forEach(defaultMenuConf, (menuConf, menuKey) => {
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
    hoverbarKeys: {
      // 'link': { menuKeys: ['editLink', 'unLink', 'viewLink'] },
    },
    customAlert(info: string, type: string) {
      window.alert(`${type}:\n${info}`)
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
    excludeKeys: [],
    insertKeys: { index: 0, keys: [] },
    modalAppendToBody: false,

    // 合并用户配置
    ...(userConfig || {}),
  }
}
