/**
 * @description create editor
 * @author wangfupeng
 */

import { createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { withDOM } from './editor/plugins/with-dom'
import { withEmitter } from './editor/plugins/with-emitter'
import TextArea from './text-area/TextArea'
import Toolbar from './menus/bar/Toolbar'
import HoverBar from './menus/bar/HoverBar'
import { IConfig, genConfig } from './config/index'
import { IDomEditor } from './editor/interface'
import {
  EDITOR_TO_TEXTAREA,
  TEXTAREA_TO_EDITOR,
  TOOLBAR_TO_EDITOR,
  EDITOR_TO_TOOLBAR,
  EDITOR_TO_CONFIG,
  HOVER_BAR_TO_EDITOR,
  EDITOR_TO_HOVER_BAR,
  IS_READ_ONLY,
} from './utils/weak-maps'
import { promiseResolveThen } from './utils/util'
import $ from './utils/dom'

type PluginFnType = <T extends IDomEditor>(editor: T) => T

interface ICreateOption {
  toolbarSelector?: string
  textareaSelector: string
  config?: IConfig
  initContent?: Node[]
  plugins?: PluginFnType[]
}

function genDefaultContent() {
  return [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]
}

/**
 * 检查是否重复创建
 */
function isRepeatedCreate(
  editor: IDomEditor,
  textareaSelector: string,
  toolbarSelector: string = ''
): boolean {
  const attrKey = 'data-w-e-created'

  const textareaElem = $(textareaSelector)
  if (textareaElem.attr(attrKey)) {
    return true // 有属性，说明已经创建过
  }
  const toolbarElem = $(toolbarSelector)
  if (toolbarElem.attr(attrKey)) {
    return true // 有属性，说明已经创建过
  }

  // 至此，说明未创建过，则记录
  textareaElem.attr(attrKey, 'true')
  toolbarElem.attr(attrKey, 'true')

  // 销毁时删除属性
  editor.on('destroyed', () => {
    textareaElem.removeAttr(attrKey)
    toolbarElem.removeAttr(attrKey)
  })

  return false
}

/**
 * 创建编辑器
 */
function create(option: ICreateOption) {
  const { toolbarSelector, textareaSelector, config = {}, initContent, plugins = [] } = option

  // 创建实例 - 使用插件
  let editor = withHistory(withEmitter(withDOM(createEditor())))
  if (isRepeatedCreate(editor, textareaSelector, toolbarSelector)) {
    // 对同一个 DOM 重复创建
    throw new Error(
      `Repeated create editor by textareaSelector '${textareaSelector}' and toolbarSelector '${toolbarSelector}'`
    )
  }

  // 处理配置
  const editorConfig = genConfig(config || {})
  EDITOR_TO_CONFIG.set(editor, editorConfig)
  const { toolbarKeys = [], hoverbarKeys = [] } = editorConfig

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

  // 创建 toolbar DOM
  let toolbar: Toolbar | null = null
  if (toolbarSelector) {
    if (toolbarKeys.length === 0) {
      console.warn(
        `Cannot find 'toolbarKeys' in editor config\n在 editor config 中未找到 'toolbarKeys'`
      )
    }

    toolbar = new Toolbar(toolbarSelector)
    TOOLBAR_TO_EDITOR.set(toolbar, editor)
    EDITOR_TO_TOOLBAR.set(editor, toolbar)
  }

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
  if (initContent && initContent.length) {
    editor.children = initContent
  } else {
    editor.children = genDefaultContent()
  }
  textarea.onEditorChange() // 初始化时触发一次，以便能初始化 textarea DOM 和 selection

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

  // 记录编辑状态
  const { readOnly } = editorConfig
  IS_READ_ONLY.set(editor, !!readOnly)

  // 创建完毕，异步触发 created
  promiseResolveThen(() => editor.emit('created'))

  return editor
}

export default create
