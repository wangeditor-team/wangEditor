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
  maxLength?: number // TODO 在文档中说明，要慎用 maxLength 。因为 maxLength 会在每次输入是都做判断，可能会影响性能

  // 各个 menu 的配置汇总，可以通过 key 获取单个 menu 的配置
  MENU_CONF?: IMenuConfig

  // 悬浮菜单栏 menu
  hoverbarKeys?: Array<IHoverbarConf>

  alert: (info: string, type?: AlertType) => void
}

/**
 * toolbar config
 */
export interface IToolbarConfig {
  toolbarKeys?: Array<string | IMenuGroup>
}
