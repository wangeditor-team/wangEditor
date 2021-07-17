/**
 * @description 监听 keypress 事件
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import { HAS_BEFORE_INPUT_SUPPORT } from '../../utils/ua'
import { hasEditableTarget } from '../helpers'

// 【注意】虽然 keypress 事件已经过时（建议用 keydown 取代），但这里是为了兼容 beforeinput ，所以不会在高级浏览器生效，不用升级 keydown

function handleKeypress(event: Event, textarea: TextArea, editor: IDomEditor) {
  // 这里是兼容不完全支持 beforeInput 的浏览器。对于支持 beforeInput 的浏览器，会用 beforeinput 事件处理
  if (HAS_BEFORE_INPUT_SUPPORT) return

  const { readOnly } = editor.getConfig()
  if (readOnly) return
  if (!hasEditableTarget(editor, event.target)) return

  event.preventDefault()

  const text = (event as any).key as string

  // 这里只兼容 beforeInput 的 insertText 类型，其他的（如删除、换行）使用 keydown 来兼容
  Editor.insertText(editor, text)
}

export default handleKeypress
