/**
 * @description 处理 dragover 事件
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { DomEditor } from '../../editor/dom-editor'
import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import { hasTarget } from '../helpers'

export function handleOnDragstart(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as DragEvent
  if (!hasTarget(editor, event.target)) return

  const { readOnly } = editor.getConfig()
  if (readOnly) return

  const node = DomEditor.toSlateNode(editor, event.target)
  const path = DomEditor.findPath(editor, node)
  const voidMatch = Editor.isVoid(editor, node) || Editor.void(editor, { at: path, voids: true })

  // If starting a drag on a void node, make sure it is selected
  // so that it shows up in the selection's fragment.
  if (voidMatch) {
    const range = Editor.range(editor, path)
    Transforms.select(editor, range)
  }

  const data = event.dataTransfer
  if (data == null) return

  textarea.isDraggingInternally = true

  editor.setFragmentData(data)
}

export function handleOnDragover(event: Event, textarea: TextArea, editor: IDomEditor) {
  if (!hasTarget(editor, event.target)) return

  // Only when the target is void, call `preventDefault` to signal
  // that drops are allowed. Editable content is droppable by
  // default, and calling `preventDefault` hides the cursor.
  const node = DomEditor.toSlateNode(editor, event.target)
  if (Editor.isVoid(editor, node)) {
    event.preventDefault()
  }
}

export function handleOnDragend(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as DragEvent
  const { readOnly } = editor.getConfig()

  if (readOnly) return
  if (!textarea.isDraggingInternally) return
  if (!hasTarget(editor, event.target)) return

  textarea.isDraggingInternally = false
}
