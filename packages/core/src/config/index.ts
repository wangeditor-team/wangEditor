/**
 * @description editor config
 * @author wangfupeng
 */

import { cloneDeep } from 'lodash-es'
import { Editor, Range, NodeEntry, Node } from 'slate'
import { IDomEditor } from '../editor/dom-editor'

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

interface IHoverbarConf {
  match: (editor: IDomEditor, n: Node) => boolean // 匹配成功，才显示 hoverbar
  menuKeys: string[]
}

type PluginFnType = <T extends Editor>(editor: T) => T
export interface IConfig {
  onChange?: () => void

  // edit state
  placeholder?: string
  readOnly?: boolean
  autoFocus?: boolean
  decorate?: (nodeEntry: NodeEntry) => Range[]
  // TODO 开发 changeState API ，通过 API 修改 edit state

  // 各个 menu 的配置汇总，可以通过 key 获取单个 menu 的配置
  menuConf: {
    [key: string]: any
  }

  // 传统菜单栏的 menu
  toolbarId?: string
  toolbarKeys: string[]
  // 悬浮菜单栏 menu
  hoverbarKeys: Array<IHoverbarConf>
  // TODO 右键菜单栏 menu

  plugins: Array<PluginFnType>
}

/**
 * 默认配置
 */
function getDefaultConfig(): IConfig {
  const menuConf = cloneDeep(GLOBAL_MENU_CONF)

  return {
    readOnly: false,
    autoFocus: true,
    decorate: () => [],
    menuConf,
    toolbarKeys: [],
    hoverbarKeys: [],
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
