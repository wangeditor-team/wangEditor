/**
 * @description core index
 * @author wangfupeng
 */

import { Editor } from 'slate'
import create from './create-editor'
import { TextStyleFnType, RenderElemFnType } from './formats/index'
import { IMenuItem } from './menus/index'

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
  renderFn: RenderElemFnType
}
interface IMenuConf {
  key: string
  factory: () => IMenuItem
  config?: { [key: string]: any }
}
export interface IModuleConf {
  addTextStyle?: TextStyleFnType
  renderElems?: Array<IRenderElemConf>
  menus?: Array<IMenuConf>
  editorPlugin?: <T extends Editor>(editor: T) => T
}
