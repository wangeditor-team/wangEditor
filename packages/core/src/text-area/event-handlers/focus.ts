/**
 * @description 处理 onfocus 事件
 * @author wangfupeng
 */

import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { IS_FIREFOX } from '../../utils/ua'
import { IS_FOCUSED } from '../../utils/weak-maps'

function handleOnFocus(event: Event, textarea: TextArea, editor: IDomEditor) {
  const el = DomEditor.toDOMNode(editor, editor)
  const root = DomEditor.findDocumentOrShadowRoot(editor)
  textarea.latestElement = root.activeElement

  // COMPAT: If the editor has nested editable elements, the focus
  // can go to them. In Firefox, this must be prevented because it
  // results in issues with keyboard navigation. (2017/03/30)
  if (IS_FIREFOX && event.target !== el) {
    el.focus()
    return
  }

  IS_FOCUSED.set(editor, true)
}

export default handleOnFocus
