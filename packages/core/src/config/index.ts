/**
 * @description editor config
 * @author wangfupeng
 */

import { cloneDeep } from 'lodash-es'
import { Editor, Range, NodeEntry } from 'slate'

// 全局的菜单配置
const GLOBAL_MENU_CONF: { [key: string]: any } = {}

/**
 * 注册全局菜单配置
 * @param key menu key
 * @param config config
 */
export function registerGlobalMenuConf(key: string, config?: { [key: string]: any }) {
  if (config == null) return
  GLOBAL_MENU_CONF[key] = config
}

type PluginFnType = <T extends Editor>(editor: T) => T
export interface IConfig {
  toolbarId?: string
  showToolbar: boolean

  onChange?: () => void

  placeholder?: string
  readOnly?: boolean
  autoFocus?: boolean
  decorate?: (nodeEntry: NodeEntry) => Range[]

  toolbarKeys: string[]
  menuConf: {
    [key: string]: any
  }

  plugins: Array<PluginFnType>
}

/**
 * 默认配置
 */
function getDefaultConfig(): IConfig {
  const menuConf = cloneDeep(GLOBAL_MENU_CONF)

  return {
    showToolbar: true,
    readOnly: false,
    autoFocus: true,
    decorate: () => [],
    toolbarKeys: [],
    menuConf,
    plugins: [],
  }
}

// 生成配置
export function genConfig(userConfig: IConfig | {}): IConfig {
  // 默认配置
  const defaultConfig = getDefaultConfig()

  // 合并默认配置，和用户配置
  return {
    ...defaultConfig,
    ...userConfig,
  }
}
