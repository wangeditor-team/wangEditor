/**
 * @description parse style html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { Descendant, Text } from 'slate'
import { StyledText } from './custom-types'
import { getTagName } from '../../utils/dom'

/**
 * $text 是否匹配 tags
 * @param $text $text
 * @param tags tags，如 ['b', 'strong']
 */
function isMatch($text: Dom7Array, tags: string[] | string): boolean {
  const tagName = getTagName($text)
  if (typeof tags === 'string') tags = [tags]

  const length = tags.length
  for (let i = 0; i < length; i++) {
    const tag = tags[i]
    if (tagName === tag) return true
    break
  }

  if ($text.find(tags.join(',')).length > 0) return true

  return false
}

export function parseStyleHtml($text: Dom7Array, node: Descendant): Descendant {
  if (!Text.isText(node)) return node

  const textNode = node as StyledText

  // bold
  if (isMatch($text, ['b', 'strong'])) {
    textNode.bold = true
  }

  // italic
  if (isMatch($text, ['i', 'em'])) {
    textNode.italic = true
  }

  // underline
  if (isMatch($text, 'u')) {
    textNode.underline = true
  }

  // through
  if (isMatch($text, ['s', 'strike'])) {
    textNode.through = true
  }

  // sub
  if (isMatch($text, 'sub')) {
    textNode.sub = true
  }

  // sup
  if (isMatch($text, 'sup')) {
    textNode.sup = true
  }

  // code
  if (isMatch($text, 'code')) {
    textNode.code = true
  }

  return textNode
}
