/**
 * @description code-highlight decorate
 * @author wangfupeng
 */

import { Node, NodeEntry, Range, Text } from 'slate'
import { DomEditor } from '@wangeditor/core'
import { getPrismTokens, getPrismTokenLength } from '../vendor/prism'
import { CodeElement } from '../custom-types'

/**
 * 获取 code elem
 * @param node text node
 */
function getCodeElem(textNode: Node): CodeElement | null {
  if (!Text.isText(textNode)) return null // 非文本 node

  const codeNode = DomEditor.getParentNode(null, textNode)
  if (codeNode && DomEditor.getNodeType(codeNode) === 'code') {
    const preNode = DomEditor.getParentNode(null, codeNode)
    if (preNode && DomEditor.getNodeType(preNode) === 'pre') {
      return codeNode as CodeElement
    }
  }
  return null
}

const codeHighLightDecorate = (nodeEntry: NodeEntry): Range[] => {
  const [n, path] = nodeEntry
  const ranges: Range[] = []

  // 节点不合法，则不处理
  const codeElem = getCodeElem(n)
  if (codeElem == null) return ranges
  const { language = '' } = codeElem
  if (!language) return ranges

  const textNode = n as Text
  const tokens = getPrismTokens(textNode, language)

  let start = 0
  for (const token of tokens) {
    const length = getPrismTokenLength(token)
    const end = start + length

    if (typeof token !== 'string') {
      // 遇到关键字，则拆分多个 range —— decorate 规则
      ranges.push({
        [token.type]: true, // 记录类型，以便 css 使用不同的颜色
        anchor: { path, offset: start },
        focus: { path, offset: end },
      })
    }

    start = end
  }

  return ranges
}

export default codeHighLightDecorate
