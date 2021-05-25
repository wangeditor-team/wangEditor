/**
 * @description editor config
 * @author wangfupeng
 */

import { Editor, Range, NodeEntry } from 'slate'

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
  toolButtonConf: {
    [key: string]: any
  }

  plugins: Array<PluginFnType>
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
