/**
 * @description 显示/隐藏 placeholder
 * @author wangfupeng
 */

import { IDomEditor } from '../editor/interface'
import TextArea from './TextArea'
import $ from '../utils/dom'

/**
 * 处理 placeholder
 * @param textarea textarea
 * @param editor editor
 */
export function handlePlaceholder(textarea: TextArea, editor: IDomEditor) {
  const { placeholder } = editor.getConfig()
  if (!placeholder) return

  const isEmpty = editor.isEmpty()

  // 内容为空，且目前未显示 placeholder ，则显示
  if (isEmpty && !textarea.showPlaceholder && !textarea.isComposing) {
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

/**
 * 隐藏 placeholder （如拼音输入 compositionStart 时，要先隐藏，等 compositionEnd 时再判断是否显示）
 * @param textarea textarea
 * @param editor editor
 */
export function hidePlaceholder(textarea: TextArea, editor: IDomEditor) {
  const { placeholder } = editor.getConfig()
  if (!placeholder) return

  const isEmpty = editor.isEmpty()
  if (!isEmpty) return

  if (textarea.showPlaceholder) {
    textarea.$placeholder?.hide()
    textarea.showPlaceholder = false // 记录
  }
}
