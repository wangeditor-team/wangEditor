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
  const { editorConfig } = textarea
  const data = event.dataTransfer

  if (editorConfig.readOnly) return
  if (!hasTarget(editor, event.target)) return
  if (data == null) return

  if (HAS_BEFORE_INPUT_SUPPORT) {
    if (IS_SAFARI) {
      // safari 不支持拖拽文件
      if (data.files.length > 0) return
    }
  }

  event.preventDefault()

  const range = DomEditor.findEventRange(editor, event)
  Transforms.select(editor, range)
  editor.insertData(data)
}

export default handleOnDrop
