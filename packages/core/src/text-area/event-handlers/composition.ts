/**
 * @description 监听 composition 事件
 * @author wangfupeng
 */

import { Editor, Range } from 'slate'
import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'
import { IS_SAFARI, IS_FIREFOX_LEGACY } from '../../utils/ua'

const EDITOR_TO_TEXT: WeakMap<IDomEditor, string> = new WeakMap()

export function handleCompositionStart(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as CompositionEvent

  if (!hasEditableTarget(editor, event.target)) return

  const { selection } = editor
  if (selection && Range.isExpanded(selection)) {
    Editor.deleteFragment(editor)
  }

  // 记录下 dom text ，以便触发 maxLength 时使用
  if (selection && Range.isCollapsed(selection)) {
    const domRange = DomEditor.toDOMRange(editor, selection)
    const curText = domRange.startContainer.textContent || ''
    EDITOR_TO_TEXT.set(editor, curText)
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

  // 触发了 maxLength
  //【注意】这里只处理拼音输入的 maxLength 限制，英文、数组的限制，在 editor.insertText 中处理
  if (DomEditor.isMaxLength(editor)) {
    const { selection } = editor
    if (selection) {
      const domRange = DomEditor.toDOMRange(editor, selection)
      domRange.startContainer.textContent = EDITOR_TO_TEXT.get(editor) || ''
      editor.updateView() // 重新定位光标
    }
    return
  }

  // 未触发 maxLength ，则继续输入
  const { data } = event

  // COMPAT: In Chrome, `beforeinput` events for compositions
  // aren't correct and never fire the "insertFromComposition"
  // type that we need. So instead, insert whenever a composition
  // ends since it will already have been committed to the DOM.
  if (!IS_SAFARI && !IS_FIREFOX_LEGACY && data) {
    Editor.insertText(editor, data)
  }
}
