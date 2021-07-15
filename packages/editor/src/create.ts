/**
 * @description create
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import Boot from './Boot'
import { DOMElement } from './utils/dom'
import {
  IEditorConfig,
  IDomEditor,
  IToolbarConfig,
  coreCreateEditor,
  coreCreateToolbar,
  Toolbar,
} from '@wangeditor/core'

interface ICreateEditorOption {
  textareaSelector: string | DOMElement
  config: Partial<IEditorConfig>
  content: Descendant[]
  mode: string
}

interface ICreateToolbarOption {
  editor: IDomEditor | null
  toolbarSelector: string | DOMElement
  config?: Partial<IToolbarConfig>
  mode?: string
}

/**
 * 创建 editor 实例
 */
export function createEditor(option: Partial<ICreateEditorOption> = {}): IDomEditor {
  const { textareaSelector = '', content = [], config = {}, mode = 'default' } = option

  let globalConfig = mode === 'simple' ? Boot.simpleEditorConfig : Boot.editorConfig

  const editor = coreCreateEditor({
    textareaSelector,
    config: {
      ...globalConfig, // 全局配置
      ...config,
    },
    content,
    plugins: Boot.plugins,
  })

  return editor
}

/**
 * 创建 toolbar 实例
 */
export function createToolbar(option: ICreateToolbarOption): Toolbar {
  const { toolbarSelector, editor, config = {}, mode = 'default' } = option
  if (!toolbarSelector) {
    throw new Error(`Cannot find 'toolbarSelector' when create toolbar`)
  }

  let globalConfig = mode === 'simple' ? Boot.simpleToolbarConfig : Boot.toolbarConfig

  const toolbar = coreCreateToolbar(editor, {
    toolbarSelector,
    config: {
      ...globalConfig, // 全局配置
      ...config,
    },
  })

  return toolbar
}
