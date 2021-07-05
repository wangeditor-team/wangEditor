/**
 * @description Editor View class
 * @author wangfupeng
 */

// import $, { Dom7Array } from 'dom7'
import { Descendant } from 'slate'
import {
  IDomEditor,
  createEditor,
  Toolbar,
  createToolbar,

  // 配置
  IEditorConfig,
  IToolbarConfig,

  // 注册菜单
  IRegisterMenuConf,
  registerMenu,

  // 渲染 modal -> view
  IRenderElemConf,
  RenderTextStyleFnType,
  registerTextStyleHandler,
  registerRenderElemConf,

  // to html
  IElemToHtmlConf,
  TextToHtmlFnType,
  TextStyleToHtmlFnType,
  registerTextStyleToHtmlHandler,
  registerTextToHtmlHandler,
  registerElemToHtmlConf,
} from '@wangeditor/core'

type PluginType = <T extends IDomEditor>(editor: T) => T

interface ICreateEditorOption {
  textareaSelector: string
  config?: Partial<IEditorConfig>
  initContent?: Descendant[]
}

interface ICreateToolbarOption {
  editor: IDomEditor | null
  toolbarSelector: string
  config?: Partial<IToolbarConfig>
}

const wangEditor = {
  // editor 配置
  editorConfig: {},
  setEditorConfig(newConfig: Partial<IEditorConfig> = {}) {
    this.editorConfig = {
      ...this.editorConfig,
      ...newConfig,
    }
  },

  //toolbar 配置
  toolbarConfig: {},
  setToolbarConfig(newConfig: Partial<IToolbarConfig> = {}) {
    this.toolbarConfig = {
      ...this.toolbarConfig,
      ...newConfig,
    }
  },

  // 注册插件
  plugins: [],
  registerPlugin(plugin: PluginType) {
    !(this.plugins as PluginType[]).push(plugin)
  },

  // 注册 menu
  // TODO 可在注册时传入配置，在开发文档中说明
  registerMenu(menuConf: IRegisterMenuConf, customConfig?: { [key: string]: any }) {
    registerMenu(menuConf, customConfig)
  },

  // 注册 renderElem
  registerRenderElem(renderElemConf: IRenderElemConf) {
    registerRenderElemConf(renderElemConf)
  },

  // 注册 renderTextStyle
  registerRenderTextStyle(fn: RenderTextStyleFnType) {
    registerTextStyleHandler(fn)
  },

  // 注册 elemToHtml
  registerElemToHtml(elemToHtmlConf: IElemToHtmlConf) {
    registerElemToHtmlConf(elemToHtmlConf)
  },

  // 注册 textToHtml
  registerTextToHtml(fn: TextToHtmlFnType) {
    registerTextToHtmlHandler(fn)
  },

  // 注册 textStyleToHtml
  registerTextStyleToHtml(fn: TextStyleToHtmlFnType) {
    registerTextStyleToHtmlHandler(fn)
  },

  // -------------------------------------- 分割线 --------------------------------------

  /**
   * 创建 editor 实例
   */
  createEditor(option: ICreateEditorOption): IDomEditor {
    const { textareaSelector, initContent = [], config = {} } = option
    if (!textareaSelector) {
      throw new Error(`Cannot find 'textareaSelector' when create editor`)
    }

    const editor = createEditor({
      textareaSelector,
      config: {
        ...this.editorConfig, // 全局配置
        ...config,
      },
      initContent,
      plugins: this.plugins,
    })

    return editor
  },

  /**
   * 创建 toolbar 实例
   */
  createToolbar(option: ICreateToolbarOption): Toolbar {
    const { toolbarSelector, editor, config = {} } = option
    if (!toolbarSelector) {
      throw new Error(`Cannot find 'toolbarSelector' when create toolbar`)
    }
    const toolbar = createToolbar(editor, {
      toolbarSelector,
      config: {
        ...this.toolbarConfig, // 全局配置
        ...config,
      },
    })

    return toolbar
  },
}

export default wangEditor
