/**
 * @description core index
 * @author wangfupeng
 */

import create from './create-editor'

// 创建编辑器
export const createEditor = create

// editor 接口和 command
export * from './editor/dom-editor'

// 注册 formats
export * from './formats/index'

// 注册 menus
export * from './menus/index'
