/**
 * @description 处理 onblur 事件
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor, DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'
import { isDOMElement, isDOMNode } from '../../utils/dom'
import { IS_FOCUSED } from '../../utils/weak-maps'

function handleOnBlur(event: Event, textarea: TextArea, editor: IDomEditor) {
  const { editorConfig, isUpdatingSelection, latestElement } = textarea

  if (editorConfig.readOnly) return
  if (isUpdatingSelection) return
  if (!hasEditableTarget(editor, event.target)) return

  // COMPAT: If the current `activeElement` is still the previous
  // one, this is due to the window being blurred when the tab
  // itself becomes unfocused, so we want to abort early to allow to
  // editor to stay focused when the tab becomes focused again.
  if (latestElement === window.document.activeElement) return

  // @ts-ignore relatedTarget 即 blur 之后又 focus 到了哪个元素，如果没有则是 null
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

  // 检验完毕，可正式触发 onblur
  IS_FOCUSED.delete(editor)
  // TODO 触发用户配置的 onblur 事件，还有 editor.blur
}

export default handleOnBlur
