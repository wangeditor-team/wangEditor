/**
 * @description editor interface
 * @author wangfupeng
 */

import { Editor } from 'slate'
import ee from 'event-emitter'
import { IConfig, AlertType } from '../config/interface'

/**
 * 扩展 slate Editor 接口
 */
export interface IDomEditor extends Editor {
  id: string
  insertData: (data: DataTransfer) => void
  setFragmentData: (data: DataTransfer) => void
  getConfig: () => IConfig
  getMenuConfig: (menuKey: string) => { [key: string]: any }
  setConfig: (newConfig: IConfig) => void
  getAllMenuKeys: () => string[] // TODO 文档中说明，包括如何获取 toolbar hoverbar menu
  handleTab: () => void
  getHtml: () => string
  getText: () => string
  getSelectionText: () => string // 获取选区文字
  getHeaders: () => { id: string; type: string; text: string }[] // 获取所有标题
  focus: () => void
  blur: () => void
  destroy: () => void
  alert: (info: string, type: AlertType) => void
  scrollToElem: (id: string) => void
  showProgressBar: (progress: number) => void
  hidePanelOrModal: () => void
  // undo redo - 使用 slate-history 扩展
  undo?: () => void
  redo?: () => void
  // 自定义事件
  on: (type: string, listener: ee.EventListener) => void
  off: (type: string, listener: ee.EventListener) => void
  once: (type: string, listener: ee.EventListener) => void
  emit: (type: string) => void
}
