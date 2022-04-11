/**
 * @description 处理 drop 事件
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { hasTarget } from '../helpers'
import { HAS_BEFORE_INPUT_SUPPORT, IS_SAFARI } from '../../utils/ua'

function handleOnDrop(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as DragEvent
  const data = event.dataTransfer
  const { readOnly } = editor.getConfig()

  if (readOnly) return
  if (!hasTarget(editor, event.target)) return
  if (data == null) return

  if (HAS_BEFORE_INPUT_SUPPORT) {
    if (IS_SAFARI) {
      // safari 不支持拖拽文件
      if (data.files.length > 0) return
    }
  }

  event.preventDefault()

  // Keep a reference to the dragged range before updating selection
  const draggedRange = editor.selection
  const range = DomEditor.findEventRange(editor, event)
  Transforms.select(editor, range)

  if (textarea.isDraggingInternally) {
    if (draggedRange) {
      Transforms.delete(editor, {
        at: draggedRange,
      })
    }

    textarea.isDraggingInternally = false
  }

  editor.insertData(data)

  // When dragging from another source into the editor, it's possible
  // that the current editor does not have focus.
  if (!editor.isFocused()) {
    editor.focus()
  }
}

export default handleOnDrop
