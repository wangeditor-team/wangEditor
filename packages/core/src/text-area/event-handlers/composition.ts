/**
 * @description 监听 composition 事件
 * @author wangfupeng
 */

import { Editor, Range, Element } from 'slate'
import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'
import { IS_SAFARI, IS_CHROME, IS_FIREFOX } from '../../utils/ua'
import { DOMNode } from '../../utils/dom'
import { hidePlaceholder } from '../place-holder'
import { editorSelectionToDOM } from '../syncSelection'

const EDITOR_TO_TEXT: WeakMap<IDomEditor, string> = new WeakMap()
const EDITOR_TO_START_CONTAINER: WeakMap<IDomEditor, DOMNode> = new WeakMap()

/**
 * composition start 事件
 * @param e event
 * @param textarea textarea
 * @param editor editor
 */
export function handleCompositionStart(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as CompositionEvent

  if (!hasEditableTarget(editor, event.target)) return

  const { selection } = editor
  if (selection && Range.isExpanded(selection)) {
    Editor.deleteFragment(editor)

    Promise.resolve().then(() => {
      // deleteFragment 会在一个 Promise 后更新 dom，导致浏览器选区不正确
      // 因此这里延迟一下再设置选区，使选区在正确位置
      // 这里 model 选区没有发生变化，不能使用 editor.restoreSelection
      // restoreSelection 会对比前后 model 选区是否相同，相同就不更新了
      editorSelectionToDOM(textarea, editor, true)
    })
  }

  if (selection && Range.isCollapsed(selection)) {
    // 记录下 dom text ，以便触发 maxLength 时使用
    const domRange = DomEditor.toDOMRange(editor, selection)
    const startContainer = domRange.startContainer
    const curText = startContainer.textContent || ''
    EDITOR_TO_TEXT.set(editor, curText)

    // 记录下 dom range startContainer
    EDITOR_TO_START_CONTAINER.set(editor, startContainer)
  }
  textarea.isComposing = true

  // 隐藏 placeholder
  hidePlaceholder(textarea, editor)
}

/**
 * composition update 事件
 * @param e event
 * @param textarea textarea
 * @param editor editor
 */
export function handleCompositionUpdate(event: Event, textarea: TextArea, editor: IDomEditor) {
  if (!hasEditableTarget(editor, event.target)) return

  textarea.isComposing = true
}

/**
 * composition end 事件
 * @param e event
 * @param textarea textarea
 * @param editor editor
 */
export function handleCompositionEnd(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as CompositionEvent

  if (!hasEditableTarget(editor, event.target)) return
  textarea.isComposing = false

  const { selection } = editor
  if (selection == null) return

  // 清理可能暴露的 text 节点
  // 例如 chrome 在链接后面，输入拼音，就会出现有暴露出来的 text node
  if (IS_CHROME || IS_FIREFOX) {
    DomEditor.cleanExposedTexNodeInSelectionBlock(editor)
  }

  // 在中文输入法下，浏览器的默认行为会使一些dom产生不可逆的变化
  // 比如在 Safari 中 url 后面输入，初始是 a > span > spans
  // 输入后变成 span > span > a
  // 因此需要设置新的 key 来强刷整行
  const start = Range.isBackward(selection) ? selection.focus : selection.anchor
  const [paragraph] = Editor.node(editor, [start.path[0]])

  for (let i = 0; i < start.path.length; i++) {
    const [node] = Editor.node(editor, start.path.slice(0, i + 1))
    if (Element.isElement(node)) {
      if (((IS_SAFARI || IS_FIREFOX) && node.type === 'link') || node.type === 'code') {
        DomEditor.setNewKey(paragraph)
        break
      }
    }
  }

  const { data } = event
  if (!data) return

  // 检查 maxLength -【注意】这里只处理拼音输入的 maxLength 限制。其他限制，在插件 with-max-length.ts 中处理
  const { maxLength } = editor.getConfig()
  if (maxLength) {
    const leftLengthOfMaxLength = DomEditor.getLeftLengthOfMaxLength(editor)
    if (leftLengthOfMaxLength < data.length) {
      const domRange = DomEditor.toDOMRange(editor, selection)
      domRange.startContainer.textContent = EDITOR_TO_TEXT.get(editor) || ''
      if (leftLengthOfMaxLength > 0) {
        // 剩余长度 >0 ，但小于 data 长度，截取一部分插入
        Editor.insertText(editor, data.slice(0, leftLengthOfMaxLength))
      }
      textarea.changeViewState() // 重新定位光标
    } else {
      Editor.insertText(editor, data)
    }
  } else {
    Editor.insertText(editor, data)
  }

  // 检查拼音输入是否夸 DOM 节点了，解决 wangEditor-v5/issues/47
  if (!IS_SAFARI) {
    setTimeout(() => {
      const { selection } = editor
      if (selection == null) return
      const oldStartContainer = EDITOR_TO_START_CONTAINER.get(editor) // 拼音输入开始时的 text node
      if (oldStartContainer == null) return
      const curStartContainer = DomEditor.toDOMRange(editor, selection).startContainer // 拼音输入结束时的 text node
      if (curStartContainer === oldStartContainer) {
        // 拼音输入的开始和结束，都在同一个 text node ，则不做处理
        return
      }
      // 否则，拼音输入的开始和结束，不是同一个 text node ，则将第一个 text node 重新设置 text
      oldStartContainer.textContent = EDITOR_TO_TEXT.get(editor) || ''
    })
  }
}
