/**
 * @description config interface
 * @author wangfupeng
 */

import { Range, NodeEntry, Node } from 'slate'
import { IDomEditor } from '../editor/interface'
import { IMenuGroup } from '../menus/interface'

interface IHoverbarConf {
  desc: string // 描述
  match: (editor: IDomEditor, n: Node) => boolean // 匹配成功，才显示 hoverbar
  menuKeys: string[]
}

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export interface ISingleMenuConfig {
  [key: string]: any
}

export interface IMenuConfig {
  [key: string]: ISingleMenuConfig
}

/**
 * editor config
 */
export interface IEditorConfig {
  //【注意】如增加 onXxx 回调函数时，要同步到 editor-for-vue2/vue3
  customAlert: (info: string, type: AlertType) => void

  onCreated?: (editor: IDomEditor) => void
  onChange?: (editor: IDomEditor) => void
  onDestroyed?: (editor: IDomEditor) => void

  onMaxLength?: (editor: IDomEditor) => void
  onFocus?: (editor: IDomEditor) => void
  onBlur?: (editor: IDomEditor) => void

  // edit state
  scroll: boolean
  placeholder?: string
  readOnly: boolean
  autoFocus: boolean
  decorate?: (nodeEntry: NodeEntry) => Range[]
  maxLength?: number

  // 各个 menu 的配置汇总，可以通过 key 获取单个 menu 的配置
  MENU_CONF?: IMenuConfig

  // 悬浮菜单栏 menu
  hoverbarKeys?: Array<IHoverbarConf>
}

/**
 * toolbar config
 */
export interface IToolbarConfig {
  toolbarKeys?: Array<string | IMenuGroup>
}
