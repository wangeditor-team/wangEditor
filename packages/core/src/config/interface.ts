/**
 * @description config interface
 * @author wangfupeng
 */

import { Range, NodeEntry, Node } from 'slate'
import { IDomEditor } from '../editor/interface'
import { IMenuGroup } from '../menus/interface'

interface IHoverbarConf {
  // key 即 element type
  [key: string]: {
    match?: (editor: IDomEditor, n: Node) => boolean // 自定义匹配函数，优先级高于“key 即 element type”
    menuKeys: string[]
  }
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
  //【注意】如增加 onXxx 回调函数时，要同步到 vue2/vue3 组件
  customAlert: (info: string, type: AlertType) => void

  onCreated?: (editor: IDomEditor) => void
  onChange?: (editor: IDomEditor) => void
  onDestroyed?: (editor: IDomEditor) => void

  onMaxLength?: (editor: IDomEditor) => void
  onFocus?: (editor: IDomEditor) => void
  onBlur?: (editor: IDomEditor) => void

  /**
   * 自定义粘贴。返回 true 则继续粘贴，返回 false 则自行实现粘贴，阻止默认粘贴
   */
  customPaste?: (editor: IDomEditor, e: ClipboardEvent) => boolean

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
  hoverbarKeys?: IHoverbarConf

  // 自由扩展其他配置
  EXTEND_CONF?: any
}

/**
 * toolbar config
 */
export interface IToolbarConfig {
  toolbarKeys: Array<string | IMenuGroup>
  insertKeys: { index: number; keys: string | Array<string | IMenuGroup> }
  excludeKeys: Array<string> // 排除哪些菜单
  modalAppendToBody: boolean // modal append 到 body ，而非 $textAreaContainer 内
}
