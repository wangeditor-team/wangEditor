/**
 * @description 扩展 slate Editor（参考 slate-react react-editor.ts ）
 * @author wangfupeng
 */

import isEqual from 'lodash.isequal'
import toArray from 'lodash.toarray'
import { Editor, Node, Element, Path, Point, Range, Ancestor, Text } from 'slate'
import { IDomEditor } from './interface'
import { Key } from '../utils/key'
import TextArea from '../text-area/TextArea'
import Toolbar from '../menus/bar/Toolbar'
import HoverBar from '../menus/bar/HoverBar'
import {
  EDITOR_TO_ELEMENT,
  ELEMENT_TO_NODE,
  KEY_TO_ELEMENT,
  NODE_TO_INDEX,
  NODE_TO_KEY,
  NODE_TO_PARENT,
  CHANGING_NODE_PATH,
  EDITOR_TO_TEXTAREA,
  EDITOR_TO_TOOLBAR,
  EDITOR_TO_HOVER_BAR,
  EDITOR_TO_WINDOW,
} from '../utils/weak-maps'
import $, {
  DOMElement,
  DOMNode,
  DOMPoint,
  DOMRange,
  DOMSelection,
  DOMStaticRange,
  isDOMElement,
  normalizeDOMPoint,
  isDOMSelection,
  hasShadowRoot,
  walkTextNodes,
} from '../utils/dom'
import { IS_CHROME } from '../utils/ua'

/**
 * 自定义全局 command
 */
export const DomEditor = {
  /**
   * Return the host window of the current editor.
   */
  getWindow(editor: IDomEditor): Window {
    const window = EDITOR_TO_WINDOW.get(editor)
    if (!window) {
      throw new Error('Unable to find a host window element for this editor')
    }
    return window
  },

  /**
   * Find a key for a Slate node.
   * key 即一个累加不重复的 id ，每一个 slate node 都对对应一个 key ，意思相当于 node.id
   */
  findKey(editor: IDomEditor | null, node: Node): Key {
    let key = NODE_TO_KEY.get(node)

    // 如果没绑定，就立马新建一个 key 来绑定
    if (!key) {
      key = new Key()
      NODE_TO_KEY.set(node, key)
    }

    return key
  },

  /**
   * Find the path of Slate node.
   * path 是一个数组，代表 slate node 的位置 https://docs.slatejs.org/concepts/03-locations#path
   */
  findPath(editor: IDomEditor | null, node: Node): Path {
    const path: Path = []
    let child = node

    // eslint-disable-next-line
    while (true) {
      const parent = NODE_TO_PARENT.get(child)

      if (parent == null) {
        if (Editor.isEditor(child)) {
          // 已到达最顶层，返回 patch
          return path
        } else {
          break
        }
      }

      // 获取该节点在父节点中的 index
      const i = NODE_TO_INDEX.get(child)

      if (i == null) {
        break
      }

      // 拼接 patch
      path.unshift(i)

      // 继续向上递归
      child = parent
    }

    throw new Error(`Unable to find the path for Slate node: ${JSON.stringify(node)}`)
  },

  /**
   * Find the DOM node that implements DocumentOrShadowRoot for the editor.
   */
  findDocumentOrShadowRoot(editor: IDomEditor): Document | ShadowRoot {
    if (editor.isDestroyed) {
      return window.document
    }

    const el = DomEditor.toDOMNode(editor, editor)
    const root = el.getRootNode()

    // The below exception will always be thrown for iframes because the document inside an iframe
    // does not inherit it's prototype from the parent document, therefore we return early
    if (el.ownerDocument !== document) return el.ownerDocument

    if (!(root instanceof Document || root instanceof ShadowRoot))
      throw new Error(`Unable to find DocumentOrShadowRoot for editor element: ${el}`)

    // COMPAT: Only Chrome implements the DocumentOrShadowRoot mixin for
    // ShadowRoot; other browsers still implement it on the Document
    // interface. (2020/08/08)
    // https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot#Properties
    if (root.getSelection === undefined && el.ownerDocument !== null) return el.ownerDocument

    return root
  },

  /**
   * 获取父节点
   * @param editor editor
   * @param node cur node
   */
  getParentNode(editor: IDomEditor | null, node: Node): Ancestor | null {
    return NODE_TO_PARENT.get(node) || null
  },

  /**
   * Find the native DOM element from a Slate node or editor.
   */
  toDOMNode(editor: IDomEditor, node: Node): HTMLElement {
    let domNode
    const isEditor = Editor.isEditor(node)
    if (isEditor) {
      domNode = EDITOR_TO_ELEMENT.get(editor)
    } else {
      const key = DomEditor.findKey(editor, node)
      domNode = KEY_TO_ELEMENT.get(key)
    }

    if (!domNode) {
      throw new Error(`Cannot resolve a DOM node from Slate node: ${JSON.stringify(node)}`)
    }

    return domNode
  },

  /**
   * Check if a DOM node is within the editor.
   */
  hasDOMNode(editor: IDomEditor, target: DOMNode, options: { editable?: boolean } = {}): boolean {
    const { editable = false } = options
    const editorEl = DomEditor.toDOMNode(editor, editor)
    let targetEl

    // COMPAT: In Firefox, reading `target.nodeType` will throw an error if
    // target is originating from an internal "restricted" element (e.g. a
    // stepper arrow on a number input). (2018/05/04)
    // https://github.com/ianstormtaylor/slate/issues/1819
    try {
      targetEl = (isDOMElement(target) ? target : target.parentElement) as HTMLElement
    } catch (err) {
      if (!err.message.includes('Permission denied to access property "nodeType"')) {
        throw err
      }
    }

    if (!targetEl) {
      return false
    }

    return (
      // 祖先节点中包括 data-slate-editor 属性，即 textarea
      targetEl.closest(`[data-slate-editor]`) === editorEl &&
      // 这里不解何意 ？？？
      (!editable || targetEl.isContentEditable || !!targetEl.getAttribute('data-slate-zero-width'))
    )
  },

  /**
   * Find a native DOM range from a Slate `range`.
   *
   * Notice: the returned range will always be ordinal regardless of the direction of Slate `range` due to DOM API limit.
   *
   * there is no way to create a reverse DOM Range using Range.setStart/setEnd
   * according to https://dom.spec.whatwg.org/#concept-range-bp-set.
   */
  toDOMRange(editor: IDomEditor, range: Range): DOMRange {
    const { anchor, focus } = range
    const isBackward = Range.isBackward(range)
    const domAnchor = DomEditor.toDOMPoint(editor, anchor)
    const domFocus = Range.isCollapsed(range) ? domAnchor : DomEditor.toDOMPoint(editor, focus)

    const window = DomEditor.getWindow(editor)
    const domRange = window.document.createRange()
    const [startNode, startOffset] = isBackward ? domFocus : domAnchor
    const [endNode, endOffset] = isBackward ? domAnchor : domFocus

    // A slate Point at zero-width Leaf always has an offset of 0 but a native DOM selection at
    // zero-width node has an offset of 1 so we have to check if we are in a zero-width node and
    // adjust the offset accordingly.
    const startEl = (isDOMElement(startNode) ? startNode : startNode.parentElement) as HTMLElement
    const isStartAtZeroWidth = !!startEl.getAttribute('data-slate-zero-width')
    const endEl = (isDOMElement(endNode) ? endNode : endNode.parentElement) as HTMLElement
    const isEndAtZeroWidth = !!endEl.getAttribute('data-slate-zero-width')

    domRange.setStart(startNode, isStartAtZeroWidth ? 1 : startOffset)
    domRange.setEnd(endNode, isEndAtZeroWidth ? 1 : endOffset)
    return domRange
  },

  /**
   * Find a native DOM selection point from a Slate point.
   */
  toDOMPoint(editor: IDomEditor, point: Point): DOMPoint {
    const [node] = Editor.node(editor, point.path)
    const el = DomEditor.toDOMNode(editor, node)
    let domPoint: DOMPoint | undefined

    // If we're inside a void node, force the offset to 0, otherwise the zero
    // width spacing character will result in an incorrect offset of 1
    if (Editor.void(editor, { at: point })) {
      // void 节点，offset 必须为 0
      point = { path: point.path, offset: 0 }
    }

    // For each leaf, we need to isolate its content, which means filtering
    // to its direct text and zero-width spans. (We have to filter out any
    // other siblings that may have been rendered alongside them.)
    const selector = `[data-slate-string], [data-slate-zero-width]`
    const texts = Array.from(el.querySelectorAll(selector))
    let start = 0

    for (const text of texts) {
      const domNode = text.childNodes[0] as HTMLElement

      if (domNode == null || domNode.textContent == null) {
        continue
      }

      const { length } = domNode.textContent
      const attr = text.getAttribute('data-slate-length')
      const trueLength = attr == null ? length : parseInt(attr, 10)
      const end = start + trueLength

      if (point.offset <= end) {
        const offset = Math.min(length, Math.max(0, point.offset - start))
        domPoint = [domNode, offset]
        break
      }

      start = end
    }

    if (!domPoint) {
      throw new Error(`Cannot resolve a DOM point from Slate point: ${JSON.stringify(point)}`)
    }

    return domPoint
  },

  /**
   * Find a Slate node from a native DOM `element`.
   */
  toSlateNode(editor: IDomEditor | null, domNode: DOMNode): Node {
    let domEl = isDOMElement(domNode) ? domNode : domNode.parentElement

    if (domEl && !domEl.hasAttribute('data-slate-node')) {
      domEl = domEl.closest(`[data-slate-node]`)
    }

    const node = domEl ? ELEMENT_TO_NODE.get(domEl as HTMLElement) : null

    if (!node) {
      throw new Error(`Cannot resolve a Slate node from DOM node: ${domEl}`)
    }

    return node
  },

  /**
   * Get the target range from a DOM `event`.
   */
  findEventRange(editor: IDomEditor, event: any): Range {
    if ('nativeEvent' in event) {
      // 兼容 react 的合成事件，DOM 事件中没什么用
      event = event.nativeEvent
    }

    const { clientX: x, clientY: y, target } = event

    if (x == null || y == null) {
      throw new Error(`Cannot resolve a Slate range from a DOM event: ${event}`)
    }

    const node = DomEditor.toSlateNode(editor, event.target)
    const path = DomEditor.findPath(editor, node)

    // If the drop target is inside a void node, move it into either the
    // next or previous node, depending on which side the `x` and `y`
    // coordinates are closest to.
    if (Editor.isVoid(editor, node)) {
      const rect = target.getBoundingClientRect()
      const isPrev = editor.isInline(node)
        ? x - rect.left < rect.left + rect.width - x
        : y - rect.top < rect.top + rect.height - y

      const edge = Editor.point(editor, path, {
        edge: isPrev ? 'start' : 'end',
      })
      const point = isPrev ? Editor.before(editor, edge) : Editor.after(editor, edge)

      if (point) {
        const range = Editor.range(editor, point)
        return range
      }
    }

    // Else resolve a range from the caret position where the drop occured.
    let domRange
    const { document } = window

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (document.caretRangeFromPoint) {
      domRange = document.caretRangeFromPoint(x, y)
    } else {
      const position = document.caretPositionFromPoint(x, y)
      if (position) {
        domRange = document.createRange()
        domRange.setStart(position.offsetNode, position.offset)
        domRange.setEnd(position.offsetNode, position.offset)
      }
    }

    if (!domRange) {
      throw new Error(`Cannot resolve a Slate range from a DOM event: ${event}`)
    }

    // Resolve a Slate range from the DOM range.
    const range = DomEditor.toSlateRange(editor, domRange, {
      exactMatch: false,
    })
    return range
  },

  /**
   * Find a Slate range from a DOM range or selection.
   */
  toSlateRange<T extends boolean>(
    editor: IDomEditor,
    domRange: DOMRange | DOMStaticRange | DOMSelection,
    options: {
      exactMatch: T
    }
  ): T extends true ? Range | null : Range {
    const { exactMatch } = options
    const el = isDOMSelection(domRange) ? domRange.anchorNode : domRange.startContainer
    let anchorNode
    let anchorOffset
    let focusNode
    let focusOffset
    let isCollapsed

    if (el) {
      if (isDOMSelection(domRange)) {
        anchorNode = domRange.anchorNode
        anchorOffset = domRange.anchorOffset
        focusNode = domRange.focusNode
        focusOffset = domRange.focusOffset
        // COMPAT: There's a bug in chrome that always returns `true` for
        // `isCollapsed` for a Selection that comes from a ShadowRoot.
        // (2020/08/08)
        // https://bugs.chromium.org/p/chromium/issues/detail?id=447523
        if (IS_CHROME && hasShadowRoot()) {
          isCollapsed =
            domRange.anchorNode === domRange.focusNode &&
            domRange.anchorOffset === domRange.focusOffset
        } else {
          isCollapsed = domRange.isCollapsed
        }
      } else {
        anchorNode = domRange.startContainer
        anchorOffset = domRange.startOffset
        focusNode = domRange.endContainer
        focusOffset = domRange.endOffset
        isCollapsed = domRange.collapsed
      }
    }

    if (anchorNode == null || focusNode == null || anchorOffset == null || focusOffset == null) {
      throw new Error(`Cannot resolve a Slate range from DOM range: ${domRange}`)
    }

    const anchor = DomEditor.toSlatePoint(editor, [anchorNode, anchorOffset], exactMatch)
    if (!anchor) {
      return null as T extends true ? Range | null : Range
    }

    const focus = isCollapsed
      ? anchor
      : DomEditor.toSlatePoint(editor, [focusNode, focusOffset], exactMatch)
    if (!focus) {
      return null as T extends true ? Range | null : Range
    }

    return { anchor, focus } as unknown as T extends true ? Range | null : Range
  },

  /**
   * Find a Slate point from a DOM selection's `domNode` and `domOffset`.
   */
  toSlatePoint<T extends boolean>(
    editor: IDomEditor,
    domPoint: DOMPoint,
    exactMatch: T
  ): T extends true ? Point | null : Point {
    const [nearestNode, nearestOffset] = exactMatch ? domPoint : normalizeDOMPoint(domPoint)
    const parentNode = nearestNode.parentNode as DOMElement
    let textNode: DOMElement | null = null
    let offset = 0

    if (parentNode) {
      const voidNode = parentNode.closest('[data-slate-void="true"]')
      let leafNode = parentNode.closest('[data-slate-leaf]')
      let domNode: DOMElement | null = null

      // Calculate how far into the text node the `nearestNode` is, so that we
      // can determine what the offset relative to the text node is.
      if (leafNode) {
        textNode = leafNode.closest('[data-slate-node="text"]')!
        const window = DomEditor.getWindow(editor)
        const range = window.document.createRange()
        range.setStart(textNode, 0)
        range.setEnd(nearestNode, nearestOffset)
        const contents = range.cloneContents()
        const removals = [
          ...toArray(contents.querySelectorAll('[data-slate-zero-width]')),
          ...toArray(contents.querySelectorAll('[contenteditable=false]')),
        ]

        removals.forEach(el => {
          el!.parentNode!.removeChild(el)
        })

        // COMPAT: Edge has a bug where Range.prototype.toString() will
        // convert \n into \r\n. The bug causes a loop when slate-react
        // attempts to reposition its cursor to match the native position. Use
        // textContent.length instead.
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10291116/
        offset = contents.textContent!.length
        domNode = textNode
      } else if (voidNode) {
        // For void nodes, the element with the offset key will be a cousin, not an
        // ancestor, so find it by going down from the nearest void parent.
        leafNode = voidNode.querySelector('[data-slate-leaf]')!

        // COMPAT: In read-only editors the leaf is not rendered.
        if (!leafNode) {
          offset = 1
        } else {
          textNode = leafNode.closest('[data-slate-node="text"]')!
          domNode = leafNode
          offset = domNode.textContent!.length
          domNode.querySelectorAll('[data-slate-zero-width]').forEach(el => {
            offset -= el.textContent!.length
          })
        }
      }

      // COMPAT: If the parent node is a Slate zero-width space, editor is
      // because the text node should have no characters. However, during IME
      // composition the ASCII characters will be prepended to the zero-width
      // space, so subtract 1 from the offset to account for the zero-width
      // space character.
      if (
        domNode &&
        offset === domNode.textContent!.length &&
        parentNode.hasAttribute('data-slate-zero-width')
      ) {
        offset--
      }
    }

    if (!textNode) {
      if (exactMatch) {
        return null as T extends true ? Point | null : Point
      }
      throw new Error(`Cannot resolve a Slate point from DOM point: ${domPoint}`)
    }

    // COMPAT: If someone is clicking from one Slate editor into another,
    // the select event fires twice, once for the old editor's `element`
    // first, and then afterwards for the correct `element`. (2017/03/03)
    const slateNode = DomEditor.toSlateNode(editor, textNode!)
    const path = DomEditor.findPath(editor, slateNode)
    return { path, offset } as T extends true ? Point | null : Point
  },

  hasRange(editor: IDomEditor, range: Range): boolean {
    const { anchor, focus } = range
    return Editor.hasPath(editor, anchor.path) && Editor.hasPath(editor, focus.path)
  },

  getNodeType(node: Node): string {
    if (Element.isElement(node)) {
      return node.type
    }
    return ''
  },

  checkNodeType(node: Node, type: string) {
    return this.getNodeType(node) === type
  },

  getNodesStr(nodes: Node[]): string {
    return nodes.map(node => Node.string(node)).join('')
  },

  getSelectedNodeByType(editor: IDomEditor, type: string): Node | null {
    const [nodeEntry] = Editor.nodes(editor, {
      match: n => this.checkNodeType(n, type),
      universal: true,
    })

    if (nodeEntry == null) return null
    return nodeEntry[0]
  },

  getSelectedTextNode(editor: IDomEditor): Node | null {
    const [nodeEntry] = Editor.nodes(editor, {
      match: n => Text.isText(n),
      universal: true,
    })

    if (nodeEntry == null) return null
    return nodeEntry[0]
  },

  isNodeSelected(editor: IDomEditor, node: Node): boolean {
    const [nodeEntry] = Editor.nodes(editor, {
      match: n => n === node,
      universal: true,
    })
    if (nodeEntry == null) return false

    const [n] = nodeEntry
    if (n === node) return true

    return false
  },

  isSelectionAtLineEnd(editor: IDomEditor, path: Path): boolean {
    const { selection } = editor

    if (!selection) return false

    const isAtLineEnd =
      Editor.isEnd(editor, selection.anchor, path) || Editor.isEnd(editor, selection.focus, path)

    return isAtLineEnd
  },

  // 临时记录当前正在发生变化的 node path
  recordChangingPath(editor: IDomEditor, path: Path) {
    CHANGING_NODE_PATH.set(editor, path)
  },
  deleteChangingPath(editor: IDomEditor) {
    CHANGING_NODE_PATH.delete(editor)
  },
  isChangingPath(editor: IDomEditor, path: Path): boolean {
    const curPath = CHANGING_NODE_PATH.get(editor) || []
    return isEqual(curPath, path)
  },

  // 获取 textarea 实例
  getTextarea(editor: IDomEditor): TextArea {
    const textarea = EDITOR_TO_TEXTAREA.get(editor)
    if (textarea == null) throw new Error('Cannot find textarea instance by editor')
    return textarea
  },

  // 获取 toolbar 实例
  getToolbar(editor: IDomEditor): Toolbar | null {
    return EDITOR_TO_TOOLBAR.get(editor) || null
  },

  // 获取 hoverbar 实例
  getHoverbar(editor: IDomEditor): HoverBar | null {
    return EDITOR_TO_HOVER_BAR.get(editor) || null
  },

  // 格式化 editor content
  normalizeContent(editor: IDomEditor) {
    editor.children.forEach((node, index) => {
      editor.normalizeNode([node, [index]])
    })
  },

  /**
   * 是否触发 maxLength ？
   * @param editor editor
   * @param willInsertText 即将输入的文字
   */
  checkMaxLength(editor: IDomEditor, willInsertText: string = ''): boolean {
    const { maxLength, onMaxLength } = editor.getConfig()

    if (typeof maxLength === 'number' && maxLength > 0) {
      const editorText = editor.getText()

      if (!willInsertText) willInsertText = ' ' // 这些加一个空格，下面判断时就可以写 `>` 而不是 `>=`

      if (editorText.length + willInsertText.length > maxLength) {
        // 触发 maxLength 限制，不再继续插入文字
        if (onMaxLength) onMaxLength(editor)
        return true
      }
    }

    return false
  },

  // 清理暴露的 text 节点（拼音输入时经常出现）
  cleanExposedTexNodeInSelectionBlock(editor: IDomEditor) {
    const nodeEntries = Editor.nodes(editor, {
      match: n => {
        if (Element.isElement(n)) {
          if (!editor.isInline(n)) {
            // 匹配 block element
            return true
          }
        }
        return false
      },
      universal: true,
    })
    for (let nodeEntry of nodeEntries) {
      if (nodeEntry != null) {
        const n = nodeEntry[0]
        const elem = DomEditor.toDOMNode(editor, n)

        // 只遍历 elem 范围，考虑性能
        walkTextNodes(elem, (textNode, parent) => {
          const $parent = $(parent)
          if ($parent.attr('data-slate-string')) {
            return // 正常的 text
          }
          if ($parent.attr('data-slate-zero-width')) {
            return // 正常的 text
          }

          // 暴露的 text node ，删除
          parent.removeChild(textNode)
        })
      }
    }
  },

  /**
   * editor 内容是否为空，即只有一个空 paragraph
   * @param editor editor
   */
  isEditorEmpty(editor: IDomEditor): boolean {
    const { children = [] } = editor
    if (children.length > 1) return false // >1 个顶级节点

    const firstNode = children[0]
    if (firstNode == null) return true // editor.children 空数组

    if (Element.isElement(firstNode) && firstNode.type === 'paragraph') {
      const { children: texts = [] } = firstNode
      if (texts.length > 1) return false // >1 text node

      const t = texts[0]
      if (t == null) return true // 无 text 节点

      if (Text.isText(t) && t.text === '') return true // 只有一个 text 且是空字符串
    }

    return false
  },
}
