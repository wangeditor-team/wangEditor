/**
 * @description 处理 copy 事件
 * @author wangfupeng
 */

import { IDomEditor, DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'

function handleOnCopy(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as ClipboardEvent

  if (!hasEditableTarget(editor, event.target)) return
  event.preventDefault()

  const data = event.clipboardData
  if (data == null) return
  DomEditor.setFragmentData(editor, data)
}

export default handleOnCopy
