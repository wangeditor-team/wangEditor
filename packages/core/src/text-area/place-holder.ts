/**
 * @description 显示/隐藏 placeholder
 * @author wangfupeng
 */

import { Element, Text } from 'slate'
import { IDomEditor } from '../editor/interface'
import TextArea from './TextArea'
import $ from '../utils/dom'

/**
 * editor 内容是否为空，即只有一个空 paragraph
 * @param editor editor
 */
function isEditorEmpty(editor: IDomEditor): boolean {
  const { children = [] } = editor
  if (children.length > 1) return false // >1 个顶级节点

  const firstNode = children[0]
  if (firstNode == null) return true // editor.children 空数组

  if (Element.isElement(firstNode) && firstNode.type === 'paragraph') {
    const { children: texts = [] } = firstNode
    if (texts.length > 1) return false // >1 text node

    const t = texts[0]
    if (t == null) return true // 无 text 节点

    if (Text.isText(t) && t.text === '') return true // 只有一个 text 且是空字符串
  }

  return false
}

/**
 * 处理 placeholder
 * @param textarea textarea
 * @param editor editor
 */
function handlePlaceholder(textarea: TextArea, editor: IDomEditor) {
  const { placeholder } = editor.getConfig()
  if (!placeholder) return

  const isEmpty = isEditorEmpty(editor)

  // 内容为空，且目前未显示 placeholder ，则显示
  if (isEmpty && !textarea.showPlaceholder) {
    if (textarea.$placeholder == null) {
      const $placeholder = $(`<div class="w-e-text-placeholder">${placeholder}</div>`)
      textarea.$textAreaContainer.append($placeholder)
      textarea.$placeholder = $placeholder
    }
    textarea.$placeholder.show()
    textarea.showPlaceholder = true // 记录
    return
  }

  // 内容不是空，且目前显示着 placeholder ，则隐藏
  if (!isEmpty && textarea.showPlaceholder) {
    textarea.$placeholder?.hide()
    textarea.showPlaceholder = false // 记录
    return
  }
}

export default handlePlaceholder
