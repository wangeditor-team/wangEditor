/**
 * @description 显示/隐藏 placeholder
 * @author wangfupeng
 */

import { IDomEditor } from '../editor/interface'
import { DomEditor } from '../editor/dom-editor'
import TextArea from './TextArea'
import $ from '../utils/dom'

/**
 * 处理 placeholder
 * @param textarea textarea
 * @param editor editor
 */
function handlePlaceholder(textarea: TextArea, editor: IDomEditor) {
  const { placeholder } = editor.getConfig()
  if (!placeholder) return

  const isEmpty = editor.isEmpty()

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
