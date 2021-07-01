/**
 * @description textarea helper fns
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { DOMRange, DOMNode, isDOMNode } from '../utils/dom'
import { IDomEditor } from '../editor/interface'
import { DomEditor } from '../editor/dom-editor'

/**
 * Check if two DOM range objects are equal.
 */
export const isRangeEqual = (a: DOMRange, b: DOMRange) => {
  return (
    (a.startContainer === b.startContainer &&
      a.startOffset === b.startOffset &&
      a.endContainer === b.endContainer &&
      a.endOffset === b.endOffset) ||
    (a.startContainer === b.endContainer &&
      a.startOffset === b.endOffset &&
      a.endContainer === b.startContainer &&
      a.endOffset === b.startOffset)
  )
}

/**
 * Check if the target is editable and in the editor.
 */
export function hasEditableTarget(
  editor: IDomEditor,
  target: EventTarget | null
): target is DOMNode {
  return isDOMNode(target) && DomEditor.hasDOMNode(editor, target, { editable: true })
}

/**
 * Check if the target is inside void and in the editor.
 */
export function isTargetInsideVoid(editor: IDomEditor, target: EventTarget | null): boolean {
  const slateNode = hasTarget(editor, target) && DomEditor.toSlateNode(editor, target)
  return Editor.isVoid(editor, slateNode)
}

/**
 * Check if the target is in the editor.
 */
export function hasTarget(editor: IDomEditor, target: EventTarget | null): target is DOMNode {
  return isDOMNode(target) && DomEditor.hasDOMNode(editor, target)
}

/**
 * Check if a DOM event is overrode by a handler.
 */
export function isDOMEventHandled(event: Event, handler?: (event: Event) => void) {
  if (!handler) {
    return false
  }

  handler(event)
  return event.defaultPrevented
}
