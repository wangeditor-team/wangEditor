/**
 * @description 处理 dragover 事件
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IDomEditor, DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { hasTarget } from '../helpers'

function handleOnDragover(event: Event, textarea: TextArea, editor: IDomEditor) {
  if (!hasTarget(editor, event.target)) return

  // Only when the target is void, call `preventDefault` to signal
  // that drops are allowed. Editable content is droppable by
  // default, and calling `preventDefault` hides the cursor.
  const node = DomEditor.toSlateNode(editor, event.target)
  if (Editor.isVoid(editor, node)) {
    event.preventDefault()
  }
}

export default handleOnDragover
