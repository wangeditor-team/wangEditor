/**
 * @description 扩展 slate Editor（参考 slate-react react-editor.ts ）
 * @author wangfupeng
 */

import toArray from 'lodash.toarray'
import { Editor, Node, Element, Path, Point, Range, Ancestor, Text } from 'slate'
import type { IDomEditor } from './interface'
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
import { IS_CHROME, IS_FIREFOX } from '../utils/ua'

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

  setNewKey(node: Node) {
    const key = new Key()
    NODE_TO_KEY.set(node, key)
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

    if ((root instanceof Document || root instanceof ShadowRoot) && root.getSelection != null) {
      return root
    }
    return el.ownerDocument
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
   * 获取当前节点的所有父节点
   * @param editor editor
   * @param node cur node
   */
  getParentsNodes(editor: IDomEditor, node: Node): Ancestor[] {
    const nodes: Ancestor[] = []
    let curNode = node
    while (curNode !== editor && curNode != null) {
      const parentNode = DomEditor.getParentNode(editor, curNode)
      if (parentNode == null) {
        break
      } else {
        nodes.push(parentNode)
        curNode = parentNode
      }
    }
    return nodes
  },

  /**
   * 获取当前节点对应的顶级节点
   * @param editor editor
   * @param curNode cur node
   */
  getTopNode(editor: IDomEditor, curNode: Node): Node {
    const path = DomEditor.findPath(editor, curNode)
    const topPath = [path[0]]
    return Node.get(editor, topPath)
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
      // 通过参数 editable 控制开启是否验证是可编辑元素或零宽字符
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
    const { document } = this.getWindow(editor)

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
      suppressThrow: false,
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
      suppressThrow: T
    }
  ): T extends true ? Range | null : Range {
    const { exactMatch, suppressThrow } = options
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

    const anchor = DomEditor.toSlatePoint(editor, [anchorNode, anchorOffset], {
      exactMatch,
      suppressThrow,
    })
    if (!anchor) {
      return null as T extends true ? Range | null : Range
    }

    const focus = isCollapsed
      ? anchor
      : DomEditor.toSlatePoint(editor, [focusNode, focusOffset], { exactMatch, suppressThrow })
    if (!focus) {
      return null as T extends true ? Range | null : Range
    }

    // return { anchor, focus } as unknown as T extends true ? Range | null : Range

    let range: Range = { anchor: anchor as Point, focus: focus as Point }
    // if the selection is a hanging range that ends in a void
    // and the DOM focus is an Element
    // (meaning that the selection ends before the element)
    // unhang the range to avoid mistakenly including the void
    if (
      Range.isExpanded(range) &&
      Range.isForward(range) &&
      isDOMElement(focusNode) &&
      Editor.void(editor, { at: range.focus, mode: 'highest' })
    ) {
      range = Editor.unhangRange(editor, range, { voids: true })
    }

    return range as unknown as T extends true ? Range | null : Range
  },

  /**
   * Find a Slate point from a DOM selection's `domNode` and `domOffset`.
   */
  toSlatePoint<T extends boolean>(
    editor: IDomEditor,
    domPoint: DOMPoint,
    options: {
      exactMatch: T
      suppressThrow: T
    }
  ): T extends true ? Point | null : Point {
    const { exactMatch, suppressThrow } = options
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

      if (
        domNode &&
        offset === domNode.textContent!.length &&
        // COMPAT: If the parent node is a Slate zero-width space, editor is
        // because the text node should have no characters. However, during IME
        // composition the ASCII characters will be prepended to the zero-width
        // space, so subtract 1 from the offset to account for the zero-width
        // space character.
        (parentNode.hasAttribute('data-slate-zero-width') ||
          // COMPAT: In Firefox, `range.cloneContents()` returns an extra trailing '\n'
          // when the document ends with a new-line character. This results in the offset
          // length being off by one, so we need to subtract one to account for this.
          (IS_FIREFOX && domNode.textContent?.endsWith('\n')))
      ) {
        offset--
      }
    }

    if (!textNode) {
      if (suppressThrow) {
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

  getSelectedElems(editor: IDomEditor): Element[] {
    const elems: Element[] = []

    const nodeEntries = Editor.nodes(editor, { universal: true })
    for (let nodeEntry of nodeEntries) {
      const [node] = nodeEntry
      if (Element.isElement(node)) elems.push(node)
    }

    return elems
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
   * 获取：距离触发 maxLength，还可以插入多少字符
   * @param editor editor
   */
  getLeftLengthOfMaxLength(editor: IDomEditor): number {
    const { maxLength, onMaxLength } = editor.getConfig()

    // 未设置 maxLength ，则返回 number 最大值
    if (typeof maxLength !== 'number' || maxLength <= 0) return Infinity

    const editorText = editor.getText().replace(/\r|\n|(\r\n)/g, '') // 去掉换行
    const curLength = editorText.length
    const leftLength = maxLength - curLength

    if (leftLength <= 0) {
      // 触发 maxLength 限制，不再继续插入文字
      if (onMaxLength) onMaxLength(editor)
    }

    return leftLength
  },

  // 清理暴露的 text 节点（拼音输入时经常出现）
  cleanExposedTexNodeInSelectionBlock(editor: IDomEditor) {
    // 有时候全选删除新增的文本节点可能不在段落内，因此遍历textArea删除掉
    const { $textArea } = DomEditor.getTextarea(editor)
    const childNodes = $textArea?.[0].childNodes
    if (childNodes) {
      for (const node of Array.from(childNodes)) {
        if (node.nodeType === 3) {
          node.remove()
        } else {
          break
        }
      }
    }

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
          if ($parent.attr('data-w-e-reserve')) {
            return // 故意保留的节点
          }

          // 暴露的 text node ，删除
          parent.removeChild(textNode)
        })
      }
    }
  },

  /**
   * 是否是编辑器里最后一个元素
   * @param editor editor
   * @param node node
   */
  isLastNode(editor: IDomEditor, node: Node) {
    const editorChildren = editor.children || []
    const editorChildrenLength = editorChildren.length
    return editorChildren[editorChildrenLength - 1] === node
  },

  /**
   * 生成空白 paragraph
   */
  genEmptyParagraph(): Element {
    return { type: 'paragraph', children: [{ text: '' }] }
  },

  /**
   * 是否选中了 void node
   * @param editor editor
   */
  isSelectedVoidNode(editor: IDomEditor): boolean {
    const voidNodes = Editor.nodes(editor, {
      match: n => editor.isVoid(n as Element),
    })
    let len = 0
    for (const n of voidNodes) {
      len++
    }
    return len > 0
  },

  /**
   * 选区是否在一个空行
   * @param editor editor
   */
  isSelectedEmptyParagraph(editor: IDomEditor) {
    const { selection } = editor
    if (selection == null) return false

    if (Range.isExpanded(selection)) return false

    const selectedNode = DomEditor.getSelectedNodeByType(editor, 'paragraph')
    if (selectedNode === null) return false

    const { children } = selectedNode as Element
    if (children.length !== 1) return false

    const { text } = children[0] as Text
    if (text === '') return true
  },

  /**
   * 当前 path 指向的 node ，是否是空的（无内容）
   * @param editor editor
   * @param path path
   */
  isEmptyPath(editor: IDomEditor, path: Path): boolean {
    const entry = Editor.node(editor, path)
    if (entry == null) return false

    const [node] = entry

    const { children } = node as Element
    if (children.length === 1) {
      const { text } = children[0] as Text
      if (text === '') return true // 内容为空
    }

    return false
  },
}
