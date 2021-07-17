/**
 * @description 处理 click 事件
 * @author wangfupeng
 */

import { Editor, Path, Transforms } from 'slate'
import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { hasTarget } from '../helpers'
import { isDOMNode } from '../../utils/dom'

function handleOnClick(event: Event, textarea: TextArea, editor: IDomEditor) {
  const { readOnly } = editor.getConfig()

  if (readOnly) return
  if (!hasTarget(editor, event.target)) return
  if (!isDOMNode(event.target)) return

  const node = DomEditor.toSlateNode(editor, event.target)
  const path = DomEditor.findPath(editor, node)
  const start = Editor.start(editor, path)
  const end = Editor.end(editor, path)

  const startVoid = Editor.void(editor, { at: start })
  const endVoid = Editor.void(editor, { at: end })

  // 选中 void 元素 （文本可以通过监听 onSelectionChange 来选中）
  if (startVoid && endVoid && Path.equals(startVoid[1], endVoid[1])) {
    const range = Editor.range(editor, start)
    Transforms.select(editor, range)
  }
}

export default handleOnClick
