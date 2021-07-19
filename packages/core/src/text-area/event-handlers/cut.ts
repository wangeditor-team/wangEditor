/**
 * @description 处理 cut 事件
 * @author wangfupeng
 */

import { Editor, Range, Node, Transforms } from 'slate'
import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'

function handleOnCut(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as ClipboardEvent
  const { selection } = editor
  const { readOnly } = editor.getConfig()

  if (readOnly) return
  if (!hasEditableTarget(editor, event.target)) return

  event.preventDefault()

  const data = event.clipboardData
  if (data == null) return
  editor.setFragmentData(data)

  if (selection) {
    if (Range.isExpanded(selection)) {
      Editor.deleteFragment(editor)
    } else {
      const node = Node.parent(editor, selection.anchor.path)
      if (Editor.isVoid(editor, node)) {
        Transforms.delete(editor)
      }
    }
  }
}

export default handleOnCut
