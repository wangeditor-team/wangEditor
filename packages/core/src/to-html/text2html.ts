/**
 * @description text -> html
 * @author wangfupeng
 */

import { Text } from 'slate'
import { IDomEditor } from '../editor/interface'
import { DomEditor } from '../editor/dom-editor'
import { STYLE_TO_HTML_FN_LIST } from './index'
import { replaceHtmlSpecialSymbols } from '../utils/util'

function textToHtml(textNode: Text, editor: IDomEditor): string {
  const { text } = textNode
  if (text == null) throw new Error(`Current node is not slate Text ${JSON.stringify(textNode)}`)
  let textHtml = text

  // 替换 html 特殊字符
  textHtml = replaceHtmlSpecialSymbols(textHtml)

  // 替换 \n 为 <br> （一定要在替换特殊字符之后）
  const parents = DomEditor.getParentsNodes(editor, textNode)
  const hasPre = parents.some(p => DomEditor.getNodeType(p) === 'pre') // 上级节点中，是否存在 <pre>
  // 在 <pre> 标签不替换，其他都替换
  if (!hasPre) {
    textHtml = textHtml.replace(/\n|\r/g, '<br>')
  }

  // 在 <pre> 内部，&nbsp; 替换为空格
  if (hasPre) {
    textHtml = textHtml.replace(/&nbsp;/g, ' ')
  }

  // 空标签
  if (!textHtml) textHtml = '<br>'

  // text html 必须用 <span> 包裹
  textHtml = `<span>${textHtml}</span>`

  // 增加文本样式，如 color bgColor
  STYLE_TO_HTML_FN_LIST.forEach(fn => (textHtml = fn(textNode, textHtml)))

  return textHtml
}

export default textToHtml
