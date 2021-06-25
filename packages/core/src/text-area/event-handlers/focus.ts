/**
 * @description 处理 onfocus 事件
 * @author wangfupeng
 */

import { IDomEditor, DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { IS_FIREFOX } from '../../utils/ua'
import { IS_FOCUSED } from '../../utils/weak-maps'

function handleOnFocus(event: Event, textarea: TextArea, editor: IDomEditor) {
  const el = DomEditor.toDOMNode(editor, editor)
  textarea.latestElement = window.document.activeElement

  // COMPAT: If the editor has nested editable elements, the focus
  // can go to them. In Firefox, this must be prevented because it
  // results in issues with keyboard navigation. (2017/03/30)
  if (IS_FIREFOX && event.target !== el) {
    el.focus()
    return
  }

  IS_FOCUSED.set(editor, true)

  // TODO 触发用户配置的 onfocus 事件，还有 editor.focus
}

export default handleOnFocus
