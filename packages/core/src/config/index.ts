/**
 * @description editor config
 * @author wangfupeng
 */

import { Range, NodeEntry } from 'slate'

export interface IConfig {
  toolbarId?: string
  showToolbar: boolean

  onChange?: () => void

  placeholder?: string
  readOnly?: boolean
  autoFocus?: boolean
  decorate?: (nodeEntry: NodeEntry) => Range[]

  toolbarKeys: Array<string | string[]>
  toolButtonConf: {
    [key: string]: any
  }
}

/**
 * 默认配置
 */
function getDefaultConfig(): IConfig {
  return {
    showToolbar: true,
    readOnly: false,
    autoFocus: true,
    decorate: () => [],
    toolbarKeys: [],
    toolButtonConf: {},
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
