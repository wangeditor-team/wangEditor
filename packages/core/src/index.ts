/**
 * @description core index
 * @author wangfupeng
 */

import './assets/index.less'

import create from './create-editor'
import { TextStyleFnType, RenderElemFnType } from './formats/index'
import { IMenuConf } from './menus/index'
import { IDomEditor } from './editor/dom-editor'

// 创建编辑器
export const createEditor = create

// editor 接口和 command
export * from './editor/dom-editor'

// 注册 formats
export * from './formats/index'

// 注册 menus
export * from './menus/index'

// 扩展模块的接口
interface IRenderElemConf {
  type: string
  renderElem: RenderElemFnType
}

export interface IModuleConf {
  addTextStyle?: TextStyleFnType
  renderElems?: Array<IRenderElemConf>
  menus?: Array<IMenuConf>
  editorPlugin?: <T extends IDomEditor>(editor: T) => T
}
