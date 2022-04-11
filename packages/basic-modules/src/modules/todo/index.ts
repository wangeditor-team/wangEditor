/**
 * @description todo entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderTodoConf } from './render-elem'
import withTodo from './plugin'
import { todoMenuConf } from './menu/index'
import { todoToHtmlConf } from './elem-to-html'
import { parseHtmlConf } from './parse-elem-html'
import { preParseHtmlConf } from './pre-parse-html'

const todo: Partial<IModuleConf> = {
  renderElems: [renderTodoConf],
  elemsToHtml: [todoToHtmlConf],
  preParseHtml: [preParseHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [todoMenuConf],
  editorPlugin: withTodo,
}

export default todo
