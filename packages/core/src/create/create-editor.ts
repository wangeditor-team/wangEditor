/**
 * @description create editor
 * @author wangfupeng
 */

import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { withDOM } from '../editor/plugins/with-dom'
import { withEmitter } from '../editor/plugins/with-emitter'
import TextArea from '../text-area/TextArea'
import HoverBar from '../menus/bar/HoverBar'
import { genEditorConfig } from '../config/index'
import { IDomEditor } from '../editor/interface'
import { IEditorConfig } from '../config/interface'
import { promiseResolveThen } from '../utils/util'
import { isRepeatedCreate, genDefaultContent } from './helper'
import { DOMElement } from '../utils/dom'
import {
  EDITOR_TO_TEXTAREA,
  TEXTAREA_TO_EDITOR,
  EDITOR_TO_CONFIG,
  HOVER_BAR_TO_EDITOR,
  EDITOR_TO_HOVER_BAR,
} from '../utils/weak-maps'

type PluginFnType = <T extends IDomEditor>(editor: T) => T

interface ICreateOption {
  textareaSelector: string | DOMElement
  config?: Partial<IEditorConfig>
  content?: Descendant[]
  plugins?: PluginFnType[]
}

/**
 * 创建编辑器
 */
export default function (option: ICreateOption) {
  const { textareaSelector, config = {}, content, plugins = [] } = option

  // 创建实例 - 使用插件
  let editor = withHistory(withEmitter(withDOM(createEditor())))
  if (isRepeatedCreate(editor, textareaSelector)) {
    // 对同一个 DOM 重复创建
    throw new Error(`Repeated create editor by textareaSelector '${textareaSelector}'`)
  }

  // 处理配置
  const editorConfig = genEditorConfig(config)
  EDITOR_TO_CONFIG.set(editor, editorConfig)
  const { hoverbarKeys = [] } = editorConfig

  // editor plugins
  plugins.forEach(plugin => {
    editor = plugin(editor)
  })

  // 创建 textarea DOM
  const textarea = new TextArea(textareaSelector)
  EDITOR_TO_TEXTAREA.set(editor, textarea)
  TEXTAREA_TO_EDITOR.set(textarea, editor)
  // 判断 textarea 最小高度，并给出提示
  promiseResolveThen(() => {
    const $textarea = textarea.$textArea
    if ($textarea == null) return
    if ($textarea.height() < 300) {
      let info = '编辑区域高度 < 300px 这可能会导致 modal hoverbar 定位异常'
      info += '\nTextarea height < 300px . This may be cause modal and hoverbar position error'
      console.warn(info, $textarea)
    }
  })

  // 创建 hoverbar DOM
  let hoverbar: HoverBar | null
  if (hoverbarKeys.length > 0) {
    hoverbar = new HoverBar()
    HOVER_BAR_TO_EDITOR.set(hoverbar, editor)
    EDITOR_TO_HOVER_BAR.set(editor, hoverbar)
  }

  // 隐藏 panel and modal
  editor.on('change', () => {
    editor.hidePanelOrModal()
  })
  editor.on('scroll', () => {
    editor.hidePanelOrModal()
  })

  // 初始化内容
  if (content && content.length) {
    editor.children = content
  } else {
    editor.children = genDefaultContent()
  }
  textarea.changeViewState() // 初始化时触发一次，以便能初始化 textarea DOM 和 selection

  // 触发生命周期
  const { onCreated, onChange, onDestroyed } = editorConfig
  if (onCreated) {
    editor.on('created', () => onCreated(editor))
  }
  if (onChange) {
    editor.on('change', () => onChange(editor))
  }
  if (onDestroyed) {
    editor.on('destroyed', () => onDestroyed(editor))
  }

  // 创建完毕，异步触发 created
  promiseResolveThen(() => editor.emit('created'))

  return editor
}
