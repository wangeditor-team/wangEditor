/**
 * @description 处理 paste 事件
 * @author wangfupeng
 */

import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'
import { isPlainTextOnlyPaste } from '../../utils/dom'
import { HAS_BEFORE_INPUT_SUPPORT } from '../../utils/ua'

function handleOnPaste(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as ClipboardEvent
  const { editorConfig } = textarea

  if (editorConfig.readOnly) return
  if (!hasEditableTarget(editor, event.target)) return

  // 如果支持 beforeInput 且不是纯粘贴文本（如 html、图片文件），则使用 beforeInput 来实现
  // 这里只处理：不支持 beforeInput 或者 粘贴纯文本
  if (HAS_BEFORE_INPUT_SUPPORT && !isPlainTextOnlyPaste(event)) return

  event.preventDefault()

  const data = event.clipboardData
  if (data == null) return
  DomEditor.insertData(editor, data)
}

export default handleOnPaste
