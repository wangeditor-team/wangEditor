/**
 * @description parse node html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { Descendant } from 'slate'
import { IDomEditor } from '../editor/interface'
import parseCommonElemHtml from './parse-common-elem-html'
import parseTextElemHtml from './parse-text-elem-html'
import { getTagName } from '../utils/dom'
import { PRE_PARSE_HTML_CONF_LIST } from '../index'

// 常见的 text tag
const TEXT_TAGS = ['span', 'b', 'strong', 'i', 'em', 's', 'strike', 'u', 'font']

/**
 * 处理 DOM Elem html
 * @param $elem $elem
 * @param editor editor
 * @returns slate Descendant
 */
function parseElemHtml($elem: Dom7Array, editor: IDomEditor): Descendant {
  // pre-parse
  PRE_PARSE_HTML_CONF_LIST.forEach(conf => {
    const { selector, preParseHtml } = conf
    if ($elem[0].matches(selector)) {
      $elem = preParseHtml($elem)
    }
  })

  const tagName = getTagName($elem)

  // <code> 特殊处理
  if (tagName === 'code') {
    const parentTagName = getTagName($elem.parent())
    if (parentTagName === 'pre') {
      // <code> 在 <pre> 内，则是 elem
      return parseCommonElemHtml($elem, editor)
    } else {
      // <code> 不在 <pre> 内，则是 text
      return parseTextElemHtml($elem, editor)
    }
  }

  // 非 <code> ，正常处理
  if (TEXT_TAGS.includes(tagName)) {
    // text node
    return parseTextElemHtml($elem, editor)
  } else {
    // elem node
    return parseCommonElemHtml($elem, editor)
  }
}

export default parseElemHtml
