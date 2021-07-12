/**
 * @description 监听 composition 事件
 * @author wangfupeng
 */

import { Editor, Range } from 'slate'
import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'
import { IS_SAFARI, IS_FIREFOX_LEGACY } from '../../utils/ua'

export function handleCompositionStart(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as CompositionEvent

  if (!hasEditableTarget(editor, event.target)) return

  const { selection } = editor
  if (selection && !Range.isCollapsed(selection)) {
    // COMPAT: ctrl + A 全选，然后立刻使用中文输入法，会有 bug （官网 examples 也有这个问题）
    Editor.deleteFragment(editor)
  }
}

export function handleCompositionUpdate(event: Event, textarea: TextArea, editor: IDomEditor) {
  if (!hasEditableTarget(editor, event.target)) return

  textarea.isComposing = true
}

export function handleCompositionEnd(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as CompositionEvent

  if (!hasEditableTarget(editor, event.target)) return
  textarea.isComposing = false

  const { data } = event

  // COMPAT: In Chrome, `beforeinput` events for compositions
  // aren't correct and never fire the "insertFromComposition"
  // type that we need. So instead, insert whenever a composition
  // ends since it will already have been committed to the DOM.
  if (!IS_SAFARI && !IS_FIREFOX_LEGACY && data) {
    Editor.insertText(editor, data)
  }
}
