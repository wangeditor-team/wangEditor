/**
 * @description Editor View class
 * @author wangfupeng
 */

// import $, { Dom7Array } from 'dom7'
import { Transforms, Descendant } from 'slate'
import {
  IDomEditor,
  DomEditor,
  createEditor,
  Toolbar,
  createToolbar,

  // 配置
  IEditorConfig,
  IToolbarConfig,
  genEditorConfig,
  genToolbarConfig,

  // 注册菜单
  IMenuConf,
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

class WangEditor {
  editorConfig: IEditorConfig = {
    ...genEditorConfig(), // @wangeditor/core default config
    ...WangEditor.globalEditorConfig, // 全局配置
  }
  toolbarConfig: IToolbarConfig = {
    ...genToolbarConfig(),
    ...WangEditor.globalToolbarConfig,
  }
  editorCore: IDomEditor | null = null // TODO 输出 editor API - 封装为 command 即 editor.xxx ，让用户能友好的调用，不要再引入其他 lib
  toolbar: Toolbar | null = null

  /**
   * 修改 menu config
   * @param menuKey menu key
   * @param newMenuConfig menu config
   */
  setMenuConfig(menuKey: string, newMenuConfig: { [key: string]: any }) {
    const { editorConfig } = this
    if (editorConfig.menuConf == null) editorConfig.menuConf = {}
    const { menuConf } = editorConfig
    // 合并配置
    menuConf[menuKey] = {
      ...(menuConf[menuKey] || {}),
      ...(newMenuConfig || {}),
    }

    this.tryUpdateView()
  }

  /**
   * 修改编辑器 config ，并重新渲染
   * @param newConfig new config
   */
  setEditorConfig(newConfig: Partial<IEditorConfig> = {}) {
    this.editorConfig = {
      ...this.editorConfig,
      ...newConfig,
    }

    this.tryUpdateView()
  }

  /**
   * 创建 editorCore 实例
   */
  createCore(textareaSelector: string, initContent?: Descendant[]) {
    if (!textareaSelector) {
      throw new Error(`Cannot find 'textareaSelector' when create editor`)
    }

    const editorCore = createEditor({
      textareaSelector,
      config: this.editorConfig,
      initContent,
      plugins: WangEditor.globalPlugins, // 全局的插件
    })
    this.editorConfig = editorCore.getConfig() // 重新覆盖 config
    this.editorCore = editorCore
  }

  /**
   * 创建 toolbar
   */
  createToolbar(toolbarSelector: string) {
    if (!toolbarSelector) {
      throw new Error(`Cannot find 'toolbarSelector' when create toolbar`)
    }
    const toolbar = createToolbar(this.editorCore, {
      toolbarSelector,
      config: this.toolbarConfig,
    })

    this.toolbar = toolbar
  }

  /**
   * 尝试重新渲染编辑器视图
   */
  private tryUpdateView() {
    const { editorCore, editorConfig } = this
    if (editorCore == null) return

    // 取消选择
    Transforms.deselect(editorCore)
    // 重新设置 config ，重要！！！
    editorCore.setConfig(editorConfig)

    // 触发 更新视图
    const textarea = DomEditor.getTextarea(editorCore)
    textarea.onEditorChange()

    // 尝试 focus
    if (editorConfig.autoFocus !== false) {
      DomEditor.focus(editorCore)
    }
  }

  /**
   * 销毁 editorCore 实例
   */
  destroy() {
    const { editorCore } = this
    if (editorCore == null) return

    // 销毁，并重置 config
    editorCore.destroy()
    this.editorCore = null
  }

  // -------------------------------------- 分割线 --------------------------------------

  // 全局 - toolbar 配置
  static globalToolbarConfig: Partial<IToolbarConfig> = {}
  static setToolbarConfig(newConfig: Partial<IToolbarConfig> = {}) {
    this.globalToolbarConfig = {
      ...this.globalToolbarConfig,
      ...newConfig,
    }
  }

  // 全局 - editor 配置
  static globalEditorConfig: Partial<IEditorConfig> = {}
  static setEditorConfig(newConfig: Partial<IEditorConfig> = {}) {
    this.globalEditorConfig = {
      ...this.globalEditorConfig,
      ...newConfig,
    }
  }

  // 全局 - 注册插件
  static globalPlugins: PluginType[] = []
  static registerPlugin(plugin: PluginType) {
    this.globalPlugins.push(plugin)
  }

  // 全局 - 注册 menu
  // TODO 可在注册时传入配置，在开发文档中说明
  static registerMenu(menuConf: IMenuConf, customConfig?: { [key: string]: any }) {
    registerMenu(menuConf, customConfig)
  }

  // 全局 - 注册 renderElem
  static registerRenderElem(renderElemConf: IRenderElemConf) {
    registerRenderElemConf(renderElemConf)
  }

  // 全局 - 注册 renderTextStyle
  static registerRenderTextStyle(fn: RenderTextStyleFnType) {
    registerTextStyleHandler(fn)
  }

  // 全局 - 注册 elemToHtml
  static registerElemToHtml(elemToHtmlConf: IElemToHtmlConf) {
    registerElemToHtmlConf(elemToHtmlConf)
  }

  // 全局 - 注册 textToHtml
  static registerTextToHtml(fn: TextToHtmlFnType) {
    registerTextToHtmlHandler(fn)
  }

  // 全局 - 注册 textStyleToHtml
  static registerTextStyleToHtml(fn: TextStyleToHtmlFnType) {
    registerTextStyleToHtmlHandler(fn)
  }
}

export default WangEditor
