/**
 * @description 监听 keypress 事件
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import { HAS_BEFORE_INPUT_SUPPORT } from '../../utils/ua'
import { hasEditableTarget } from '../helpers'

// 

function handleInput(event: Event, textarea: TextArea, editor: IDomEditor) {
  // 这里是兼容不完全支持 beforeInput 的浏览器。对于支持 beforeInput 的浏览器，会用 beforeinput 事件处理
  if (HAS_BEFORE_INPUT_SUPPORT) return
  
  if (textarea.isComposing) return

  const { readOnly } = editor.getConfig()
  if (readOnly) return
  if (!hasEditableTarget(editor, event.target)) return

  event.preventDefault()

  const text = (event as any).data as string

  // 这里只兼容 beforeInput 的 insertText 类型，其他的（如删除、换行）使用 keydown 来兼容
  Editor.insertText(editor, text)
}

export default handleInput
