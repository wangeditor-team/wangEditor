/**
 * @description editor config
 * @author wangfupeng
 */

import { cloneDeep } from 'lodash-es'
import { Range, NodeEntry, Node } from 'slate'
import { IDomEditor } from '../editor/dom-editor'
import { IMenuGroup } from '../menus/interface'

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

export interface IConfig {
  onCreated?: (editor: IDomEditor) => void
  onChange?: (editor: IDomEditor) => void
  onDestroyed?: (editor: IDomEditor) => void
  onMaxLength?: (editor: IDomEditor) => void

  // edit state
  scroll?: boolean
  placeholder?: string
  readOnly?: boolean
  autoFocus?: boolean
  decorate?: (nodeEntry: NodeEntry) => Range[]
  maxLength?: number // TODO 在文档中说明，要慎用 maxLength 。因为 maxLength 会在每次输入是都做判断，可能会影响性能

  // 各个 menu 的配置汇总，可以通过 key 获取单个 menu 的配置
  menuConf?: {
    [key: string]: any
  }

  // 传统菜单栏的 menu
  toolbarKeys?: Array<string | IMenuGroup>
  // 悬浮菜单栏 menu
  hoverbarKeys?: Array<IHoverbarConf>

  // TODO 右键菜单栏 menu

  alert?: (info: string, type?: string) => void
}

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
    alert(info: string, type?: string) {
      window.alert(info)
    },
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
