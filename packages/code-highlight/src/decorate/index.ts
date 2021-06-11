/**
 * @description code-highlight decorate
 * @author wangfupeng
 */

import { Node, NodeEntry, Range, Text } from 'slate'
import { DomEditor } from '@wangeditor/core'
import { getPrismTokens, getPrismTokenLength } from '../vendor/prism'

/**
 * 获取 code node
 * @param node text node
 */
function getCodeNode(textNode: Node): Node | null {
  if (!Text.isText(textNode)) return null // 非文本 node

  const codeNode = DomEditor.getParentNode(null, textNode)
  // @ts-ignore 确定上级是 code 节点
  if (codeNode && codeNode.type === 'code') {
    const preNode = DomEditor.getParentNode(null, codeNode)
    // @ts-ignore 确定上上级是 pre 节点
    if (preNode && preNode.type === 'pre') {
      return codeNode
    }
  }
  return null
}

const codeHighLightDecorate = (nodeEntry: NodeEntry): Range[] => {
  const [n, path] = nodeEntry
  const ranges: Range[] = []

  // 节点不合法，则不处理
  const codeNode = getCodeNode(n)
  if (codeNode == null) return ranges
  // @ts-ignore 获取语言
  const { language = '' } = codeNode
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
