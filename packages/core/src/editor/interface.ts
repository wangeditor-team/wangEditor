/**
 * @description editor interface
 * @author wangfupeng
 */

import { Editor, Location, Node } from 'slate'
import ee from 'event-emitter'
import { IEditorConfig, AlertType, ISingleMenuConfig } from '../config/interface'
import { IPositionStyle } from '../menus/interface'

/**
 * 扩展 slate Editor 接口
 */
export interface IDomEditor extends Editor {
  // TODO 这些 API 都在文档中说明
  // 包括 slate 原生提供的 editor API ，如 insertText deleteFragment 等，查一查

  // data 相关（粘贴、拖拽等）
  insertData: (data: DataTransfer) => void
  setFragmentData: (data: DataTransfer) => void

  // config
  getConfig: () => IEditorConfig
  getMenuConfig: (menuKey: string) => ISingleMenuConfig
  getAllMenuKeys: () => string[] // TODO 文档中说明，包括如何获取 toolbar hoverbar menu
  alert: (info: string, type: AlertType) => void

  // 内容处理
  handleTab: () => void
  getHtml: (withFormat: boolean) => string
  getText: () => string
  getSelectionText: () => string // 获取选区文字
  getHeaders: () => { id: string; type: string; text: string }[] // 获取所有标题

  // dom 相关
  id: string
  focus: () => void
  isFocused: () => boolean
  blur: () => void
  updateView: () => void
  destroy: () => void
  scrollToElem: (id: string) => void
  showProgressBar: (progress: number) => void
  hidePanelOrModal: () => void
  enable: () => void
  disable: () => void
  isDisabled: () => boolean

  // selection 相关
  select: (at: Location) => void
  deselect: () => void
  restoreSelection: () => void
  getSelectionPosition: () => Partial<IPositionStyle>
  getNodePosition: (node: Node) => Partial<IPositionStyle>

  // 自定义事件
  on: (type: string, listener: ee.EventListener) => void
  off: (type: string, listener: ee.EventListener) => void
  once: (type: string, listener: ee.EventListener) => void
  emit: (type: string) => void

  // undo redo - 不用自己实现，使用 slate-history 扩展
  undo?: () => void
  redo?: () => void
}
