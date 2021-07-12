/**
 * @description 处理 dragend 事件
 * @author luochao
 */

import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import { hasTarget } from '../helpers'

function handleOnDragend(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as DragEvent
  const { editorConfig } = textarea

  if (editorConfig.readOnly) return
  if (!textarea.isDraggingInternally) return
  if (!hasTarget(editor, event.target)) return

  textarea.isDraggingInternally = false
}

export default handleOnDragend
