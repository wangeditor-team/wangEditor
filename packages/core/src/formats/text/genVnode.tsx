/**
 * @description 生成 text vnode
 * @author wangfupeng
 */

import { Editor, Path, Node, Text as SlateText, Ancestor } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { DomEditor } from '../../editor/dom-editor'
import { IDomEditor } from '../../editor/interface'

function str(text: string, isTrailing = false): VNode {
  return <span data-slate-string>{isTrailing ? text + '\n' : text}</span>
}

function zeroWidthStr(length = 0, isLineBreak = false): VNode {
  return (
    <span data-slate-zero-width={isLineBreak ? 'n' : 'z'} data-slate-length={length}>
      {'\uFEFF'}
      {isLineBreak ? <br /> : null}
    </span>
  )
}

function genTextVnode(
  leafNode: SlateText,
  isLast: boolean = false,
  textNode: SlateText,
  parent: Ancestor,
  editor: IDomEditor
): VNode {
  const { text } = leafNode
  const path = DomEditor.findPath(editor, textNode)
  const parentPath = Path.parent(path)

  if (Editor.isEditor(parent)) {
    throw new Error(`Text node ${JSON.stringify(textNode)} parent is Editor`)
  }

  // COMPAT: Render text inside void nodes with a zero-width space.
  // So the node can contain selection but the text is not visible.
  if (editor.isVoid(parent)) {
    return zeroWidthStr(Node.string(parent).length)
  }

  // COMPAT: If this is the last text node in an empty block, render a zero-
  // width space that will convert into a line break when copying and pasting
  // to support expected plain text.
  if (
    text === '' &&
    parent.children[parent.children.length - 1] === textNode &&
    !editor.isInline(parent) &&
    Editor.string(editor, parentPath) === ''
  ) {
    return zeroWidthStr(0, true)
  }

  // COMPAT: If the text is empty, it's because it's on the edge of an inline
  // node, so we render a zero-width space so that the selection can be
  // inserted next to it still.
  if (text === '') {
    return zeroWidthStr()
  }

  // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
  // so we need to add an extra trailing new lines to prevent that.
  if (isLast && text.slice(-1) === '\n') {
    return str(text, true)
  }

  return str(text)
}

export default genTextVnode
