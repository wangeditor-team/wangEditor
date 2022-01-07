/**
 * @description core index
 * @author wangfupeng
 */

import './assets/index.less'

import { RenderStyleFnType, IRenderElemConf } from './formats/index'
import { TextStyleToHtmlFnType, IElemToHtmlConf } from './to-html/index'
import { IRegisterMenuConf } from './menus/index'
import { IDomEditor } from './editor/interface'

// 创建
export * from './create/index'

// config
export { IEditorConfig, IToolbarConfig } from './config/interface'

// editor 接口和 command
export * from './editor/interface'
export * from './editor/dom-editor'

// 注册 formats
export * from './formats/index'

// to html
export * from './to-html/index'

// menu 的接口、注册、方法等
export * from './menus/index'

// upload
export * from './upload/index'

// i18n
export * from './i18n/index'

export interface IModuleConf {
  // 注册菜单
  menus: Array<IRegisterMenuConf>

  // 渲染 modal -> view
  renderStyle: RenderStyleFnType
  renderElems: Array<IRenderElemConf>

  // to html
  textStyleToHtml: TextStyleToHtmlFnType
  elemsToHtml: Array<IElemToHtmlConf>

  // 注册插件
  editorPlugin: <T extends IDomEditor>(editor: T) => T
}
