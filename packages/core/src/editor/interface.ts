/**
 * @description editor interface
 * @author wangfupeng
 */

import { Editor, Location, Node, Ancestor, Element } from 'slate'
import ee from 'event-emitter'
import { IEditorConfig, AlertType, ISingleMenuConfig } from '../config/interface'
import { IPositionStyle } from '../menus/interface'
import { DOMElement } from '../utils/dom'

export type ElementWithId = Element & { id: string }

/**
 * 扩展 slate Editor 接口
 */
export interface IDomEditor extends Editor {
  // data 相关（粘贴、拖拽等）
  insertData: (data: DataTransfer) => void
  setFragmentData: (data: Pick<DataTransfer, 'getData' | 'setData'>) => void

  // config
  getConfig: () => IEditorConfig
  getMenuConfig: (menuKey: string) => ISingleMenuConfig
  getAllMenuKeys: () => string[]
  alert: (info: string, type: AlertType) => void

  // 内容处理
  handleTab: () => void
  getHtml: () => string
  getText: () => string
  getSelectionText: () => string // 获取选区文字
  getElemsByTypePrefix: (typePrefix: string) => ElementWithId[]
  getElemsByType: (type: string, isPrefix?: boolean) => ElementWithId[]
  getParentNode: (node: Node) => Ancestor | null
  isEmpty: () => boolean
  clear: () => void
  dangerouslyInsertHtml: (html: string, isRecursive?: boolean) => void
  setHtml: (html: string) => void

  // dom 相关
  id: string
  isDestroyed: boolean
  isFullScreen: boolean
  focus: (isEnd?: boolean) => void
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
  toDOMNode: (node: Node) => HTMLElement
  fullScreen: () => void
  unFullScreen: () => void
  getEditableContainer: () => DOMElement

  // selection 相关
  select: (at: Location) => void
  deselect: () => void
  move: (distance: number, reverse?: boolean) => void
  moveReverse: (distance: number) => void
  restoreSelection: () => void
  getSelectionPosition: () => Partial<IPositionStyle>
  getNodePosition: (node: Node) => Partial<IPositionStyle>
  isSelectedAll: () => boolean
  selectAll: () => void

  // 自定义事件
  on: (type: string, listener: ee.EventListener) => void
  off: (type: string, listener: ee.EventListener) => void
  once: (type: string, listener: ee.EventListener) => void
  emit: (type: string, ...args: any[]) => void

  // undo redo - 不用自己实现，使用 slate-history 扩展
  undo?: () => void
  redo?: () => void
}
