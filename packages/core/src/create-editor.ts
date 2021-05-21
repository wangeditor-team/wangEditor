/**
 * @description create editor
 * @author wangfupeng
 */

import { createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { withDOM } from './editor/with-dom'
import TextArea from './text-area/TextArea'
import Toolbar from './menus/toolbar/Toolbar'
import { IConfig, genConfig } from './config/index'
import {
  TEXTAREA_TO_EDITOR,
  TOOLBAR_TO_EDITOR,
  EDITOR_TO_ON_CHANGE,
  EDITOR_TO_CONFIG,
} from './utils/weak-maps'
import { genRandomStr } from './utils/util'
import $ from './utils/dom'

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
 * @param containerId DOM 容器 ID
 * @param config editor config
 * @param content editor content
 */
function create(containerId: string, config: IConfig | {} = {}, content?: Node[]) {
  // 创建实例
  let editor = withHistory(withDOM(createEditor()))

  // 处理配置
  const editorConfig = genConfig(config || {})
  EDITOR_TO_CONFIG.set(editor, editorConfig)

  // editor plugins
  const { plugins = [] } = editorConfig
  plugins.forEach(plugin => {
    editor = plugin(editor)
  })

  // 处理 DOM
  let textarea: TextArea
  let toolbar: Toolbar | null = null
  const { toolbarId, showToolbar } = editorConfig
  if (toolbarId) {
    // 手动指定了 toolbarId
    textarea = new TextArea(containerId)
    toolbar = new Toolbar(toolbarId)
  } else {
    // 未手动指定 toolbarId
    const $container = $(`#${containerId}`)

    if (showToolbar) {
      // 要显示 toolbar
      const newToolbarId = genRandomStr('w-e-toolbar')
      const $toolbar = $(`<div id="${newToolbarId}" class="w-e-toolbar"></div>`)
      $container.append($toolbar)
      toolbar = new Toolbar(newToolbarId)
      editorConfig.toolbarId = newToolbarId
    }

    const newContainerId = genRandomStr('w-e-text-container')
    const $textContainer = $(`<div id="${newContainerId}" class="w-e-text-container"></div>`)
    $textContainer.css('height', '300px') // TODO height 可配置
    $container.append($textContainer)
    textarea = new TextArea(newContainerId)
  }
  TEXTAREA_TO_EDITOR.set(textarea, editor)
  toolbar && TOOLBAR_TO_EDITOR.set(toolbar, editor)

  // 初始化内容
  let initialContent: Node[] = content && content.length > 0 ? content : genDefaultInitialContent()
  editor.children = initialContent
  textarea.onEditorChange() // 初始化时触发一次，以便能初始化 textarea DOM 和 selection

  // 绑定 editor onchange
  EDITOR_TO_ON_CHANGE.set(editor, () => {
    // 触发 textarea DOM 变化
    textarea.onEditorChange()

    // 触发 toolbar DOM 变化
    toolbar && toolbar.onEditorChange()

    // 触发用户配置的 onchange 函数
    if (editorConfig.onChange) editorConfig.onChange()
  })

  return editor
}

export default create
