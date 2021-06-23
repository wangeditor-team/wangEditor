/**
 * @description create editor
 * @author wangfupeng
 */

import { createEditor, Node, Editor } from 'slate'
import { withHistory } from 'slate-history'
import { withDOM } from './editor/with-dom'
import TextArea from './text-area/TextArea'
import Toolbar from './menus/bar/Toolbar'
import HoverBar from './menus/bar/HoverBar'
import { IConfig, genConfig } from './config/index'
import { IDomEditor } from './editor/dom-editor'
import {
  EDITOR_TO_TEXTAREA,
  TEXTAREA_TO_EDITOR,
  TOOLBAR_TO_EDITOR,
  EDITOR_TO_TOOLBAR,
  EDITOR_TO_ON_CHANGE,
  EDITOR_TO_CONFIG,
  HOVER_BAR_TO_EDITOR,
  EDITOR_TO_HOVER_BAR,
  IS_READ_ONLY,
} from './utils/weak-maps'
import { genRandomStr } from './utils/util'
import $ from './utils/dom'

type PluginFnType = <T extends IDomEditor>(editor: T) => T

interface ICreateOption {
  containerId: string
  config?: IConfig
  content?: Node[]
  plugins?: PluginFnType[]
}

function genDefaultInitialContent() {
  return [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]
}

/**
 * 创建编辑器
 */
function create(option: ICreateOption) {
  const { containerId, config = {}, content, plugins = [] } = option

  // 创建实例
  let editor = withHistory(withDOM(createEditor()))

  // 处理配置
  const editorConfig = genConfig(config || {})
  EDITOR_TO_CONFIG.set(editor, editorConfig)

  // editor plugins
  plugins.forEach(plugin => {
    editor = plugin(editor)
  })

  // 处理 DOM
  let textarea: TextArea
  let toolbar: Toolbar | null = null
  const { toolbarId, toolbarKeys = [], hoverbarKeys = [] } = editorConfig
  if (toolbarId) {
    // 手动指定了 toolbarId
    textarea = new TextArea(containerId)
    toolbar = new Toolbar(toolbarId)
  } else {
    // 未手动指定 toolbarId
    const $container = $(`#${containerId}`)

    if (toolbarKeys.length > 0) {
      // 要显示 toolbar
      const newToolbarId = genRandomStr('toolbar')
      const $toolbar = $(
        `<div id="${newToolbarId}" class="w-e-bar w-e-bar-show w-e-toolbar"></div>`
      )
      $container.append($toolbar)
      toolbar = new Toolbar(newToolbarId)
      editorConfig.toolbarId = newToolbarId
    }

    const newContainerId = genRandomStr('text-container')
    const $textContainer = $(`<div id="${newContainerId}" class="w-e-text-container"></div>`)
    $textContainer.css('height', '300px') // TODO height 可配置
    $container.append($textContainer)
    textarea = new TextArea(newContainerId)
  }
  EDITOR_TO_TEXTAREA.set(editor, textarea)
  TEXTAREA_TO_EDITOR.set(textarea, editor)
  if (toolbar) {
    TOOLBAR_TO_EDITOR.set(toolbar, editor)
    EDITOR_TO_TOOLBAR.set(editor, toolbar)
  }

  // hoverbar
  let hoverbar: HoverBar | null
  if (hoverbarKeys.length > 0) {
    hoverbar = new HoverBar()
    HOVER_BAR_TO_EDITOR.set(hoverbar, editor)
    EDITOR_TO_HOVER_BAR.set(editor, hoverbar)
  }

  // 初始化内容
  let initialContent: Node[] = content && content.length > 0 ? content : genDefaultInitialContent()
  editor.children = initialContent
  textarea.onEditorChange() // 初始化时触发一次，以便能初始化 textarea DOM 和 selection

  // 绑定 editor onchange
  EDITOR_TO_ON_CHANGE.set(editor, () => {
    // 触发 textarea DOM 变化
    textarea.onEditorChange()

    // 触发 toolbar hoverbar DOM 变化
    toolbar && toolbar.onEditorChange()
    hoverbar && hoverbar.onEditorChange()

    // 触发用户配置的 onchange 函数
    if (editorConfig.onChange) editorConfig.onChange(editor)
  })

  // 记录编辑状态
  IS_READ_ONLY.set(editor, !!editorConfig.readOnly)

  return editor
}

export default create
