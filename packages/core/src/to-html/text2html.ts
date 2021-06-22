/**
 * @description text -> html
 * @author wangfupeng
 */

import { Text } from 'slate'
import { IDomEditor } from '../editor/dom-editor'
import { TEXT_TO_HTML_FN_LIST, TEXT_STYLE_TO_HTML_FN_LIST } from './index'

function textToHtml(textNode: Text, editor: IDomEditor): string {
  const { text } = textNode
  if (text == null) throw new Error(`Current node is not slate Text ${JSON.stringify(textNode)}`)
  let textHtml = text

  // 生成 text -> html
  TEXT_TO_HTML_FN_LIST.forEach(fn => (textHtml = fn(textNode, textHtml, editor)))

  // 增加文本样式，如 color bgColor
  TEXT_STYLE_TO_HTML_FN_LIST.forEach(fn => (textHtml = fn(textNode, textHtml)))

  return textHtml
}

export default textToHtml
