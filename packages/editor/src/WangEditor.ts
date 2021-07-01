/**
 * @description Editor class
 * @author wangfupeng
 */

// import $, { Dom7Array } from 'dom7'
import { Transforms, Descendant } from 'slate'
import {
  IDomEditor,
  DomEditor,
  IConfig,
  genConfig,
  createEditor,

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

interface IOption {
  toolbarSelector?: string
  textareaSelector: string
  initContent?: Descendant[]
}

class WangEditor {
  // private $container: Dom7Array
  private toolbarSelector: string
  private textareaSelector: string
  private initContent: Descendant[]
  config: IConfig = {}
  editorCore: IDomEditor | null = null // TODO 输出 editor API - 封装为 command 即 editor.xxx ，让用户能友好的调用，不要再引入其他 lib

  constructor(opt: IOption) {
    const { toolbarSelector = '', textareaSelector, initContent } = opt
    if (!textareaSelector) {
      throw new Error(
        `Cannot find 'textareaSelector' when 'new WangEditor({...})'\n当 new WangEditor({...}) 时需要输入 'textareaSelector' `
      )
    }

    this.toolbarSelector = toolbarSelector
    this.textareaSelector = textareaSelector
    this.initContent = initContent || []
    this.initConfig()
  }

  private initConfig() {
    this.config = {
      ...genConfig({}), // @wangeditor/core default config
      ...WangEditor.config, // 全局配置
    }
  }

  /**
   * 修改 menu config
   * @param menuKey menu key
   * @param newMenuConfig menu config
   */
  setMenuConfig(menuKey: string, newMenuConfig: { [key: string]: any }) {
    const { config } = this
    if (config.menuConf == null) config.menuConf = {}
    const { menuConf } = config
    // 合并配置
    menuConf[menuKey] = {
      ...(menuConf[menuKey] || {}),
      ...(newMenuConfig || {}),
    }

    this.tryUpdateView()
  }

  /**
   * 创建 editorCore 实例
   */
  createCore() {
    const { toolbarSelector, textareaSelector, config, initContent } = this
    const { plugins } = WangEditor

    const editorCore = createEditor({
      toolbarSelector,
      textareaSelector,
      config,
      initContent,
      plugins,
    })
    this.config = editorCore.getConfig() // TODO 重新覆盖 config —— 有点绕
    this.editorCore = editorCore
  }

  /**
   * 修改编辑器 config ，并重新渲染
   * @param newConfig new config
   */
  setConfig(newConfig: Partial<IConfig> = {}) {
    this.config = {
      ...this.config,
      ...newConfig,
    }

    this.tryUpdateView()
  }

  /**
   * 尝试重新渲染编辑器视图
   */
  private tryUpdateView() {
    const { editorCore, config } = this
    if (editorCore == null) return

    // 取消选择
    Transforms.deselect(editorCore)
    // 重新设置 config ，重要！！！
    editorCore.setConfig(config)

    // 触发 更新视图
    const textarea = DomEditor.getTextarea(editorCore)
    textarea.onEditorChange()

    // 尝试 focus
    if (config.autoFocus !== false) {
      DomEditor.focus(editorCore)
    }
  }

  /**
   * 销毁 editorCore 实例
   */
  destroyCore() {
    const { editorCore } = this
    if (editorCore == null) return

    // 销毁，并重置 config
    editorCore.destroy()
    this.editorCore = null
  }

  // -------------------------------------- 分割线 --------------------------------------

  // 全局 - 配置
  static config: IConfig = {}
  static setConfig(newConfig: Partial<IConfig> = {}) {
    this.config = {
      ...this.config,
      ...newConfig,
    }
  }

  // 全局 - 注册插件
  static plugins: PluginType[] = []
  static registerPlugin(plugin: PluginType) {
    this.plugins.push(plugin)
  }

  // 全局 - 注册 menu
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
