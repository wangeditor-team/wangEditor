/**
 * @description 处理 onblur 事件
 * @author wangfupeng
 */

import { Element } from 'slate'
import { DomEditor } from '../../editor/dom-editor'
import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'
import { isDOMElement, isDOMNode } from '../../utils/dom'
import { IS_FOCUSED } from '../../utils/weak-maps'
import { IS_SAFARI } from '../../utils/ua'

function handleOnBlur(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as FocusEvent

  const { isUpdatingSelection, latestElement } = textarea
  const { readOnly } = editor.getConfig()

  if (readOnly) return
  if (isUpdatingSelection) return
  if (!hasEditableTarget(editor, event.target)) return
  const root = DomEditor.findDocumentOrShadowRoot(editor)

  // COMPAT: If the current `activeElement` is still the previous
  // one, this is due to the window being blurred when the tab
  // itself becomes unfocused, so we want to abort early to allow to
  // editor to stay focused when the tab becomes focused again.
  if (latestElement === root.activeElement) return

  // relatedTarget 即 blur 之后又 focus 到了哪个元素，如果没有则是 null
  const { relatedTarget } = event
  const el = DomEditor.toDOMNode(editor, editor)

  // COMPAT: The event should be ignored if the focus is returning
  // to the editor from an embedded editable element (eg. an <input>
  // element inside a void node).
  if (relatedTarget === el) {
    return
  }

  // COMPAT: The event should be ignored if the focus is moving from
  // the editor to inside a void node's spacer element.
  if (isDOMElement(relatedTarget) && relatedTarget.hasAttribute('data-slate-spacer')) {
    return
  }

  // COMPAT: The event should be ignored if the focus is moving to a
  // non- editable section of an element that isn't a void node (eg.
  // a list item of the check list example).
  if (
    relatedTarget != null &&
    isDOMNode(relatedTarget) &&
    DomEditor.hasDOMNode(editor, relatedTarget)
  ) {
    const node = DomEditor.toSlateNode(editor, relatedTarget)
    if (Element.isElement(node) && !editor.isVoid(node)) {
      return
    }
  }

  // COMPAT: Safari doesn't always remove the selection even if the content-
  // editable element no longer has focus. Refer to:
  // https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
  // 修复在 Safari 下，即使 contenteditable 元素非聚焦状态，并不会删除所选内容
  if (IS_SAFARI) {
    const domSelection = root.getSelection()
    domSelection?.removeAllRanges()
  }

  // 检验完毕，可正式触发 onblur
  IS_FOCUSED.delete(editor)
}

export default handleOnBlur
