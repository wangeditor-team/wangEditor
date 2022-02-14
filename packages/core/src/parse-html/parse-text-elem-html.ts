/**
 * @description parse text html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { Text } from 'slate'
import { IDomEditor } from '../editor/interface'
import { PARSE_STYLE_HTML_FN_LIST } from './index'
import { deReplaceHtmlSpecialSymbols } from '../utils/util'

/**
 * 处理 text elem ，如 <span> <strong> <em> 等（并不是 DOM Text Node）
 * @param $text $text
 * @param editor editor
 * @returns slate text
 */
function parseTextElemHtml($text: Dom7Array, editor: IDomEditor): Text {
  // 用 textContent ，不能用 .text() 。后者无法识别 text 开头和末尾的 &nbsp;
  let text = $text[0].textContent || ''
  text = text.replace(/\s+/gm, ' ')

  //【翻转】替换 html 特殊字符，如 &lt; 替换为 <
  text = deReplaceHtmlSpecialSymbols(text)

  // 生成 text node
  let textNode = { text }

  // 处理 style
  PARSE_STYLE_HTML_FN_LIST.forEach(fn => {
    textNode = fn($text[0], textNode) as Text
  })

  return textNode
}

export default parseTextElemHtml
