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
    textHtml = textHtml.replace(/\r\n|\r|\n/g, '<br>')
  }

  // 在 <pre> 内部，&nbsp; 替换为空格
  if (hasPre) {
    textHtml = textHtml.replace(/&nbsp;/g, ' ')
  }

  // 处理空字符串
  if (textHtml === '') {
    const parentNode = DomEditor.getParentNode(null, textNode)
    if (parentNode && parentNode.children.length === 0) {
      // textNode 是唯一的子节点，则改为 <br>
      textHtml = '<br>'
    } else {
      // 其他情况的 空字符串 ，直接返回
      return textHtml
    }
  }

  // 增加文本样式，如 color bgColor
  STYLE_TO_HTML_FN_LIST.forEach(fn => (textHtml = fn(textNode, textHtml)))

  return textHtml
}

export default textToHtml
