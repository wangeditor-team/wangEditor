/**
 * @description selection range API
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import { UA } from '../utils/util'
import Editor from './index'

class SelectionAndRange {
    public editor: Editor
    private _currentRange: Range | null

    constructor(editor: Editor) {
        this.editor = editor
        this._currentRange = null
    }

    /**
     * 获取当前 range
     */
    public getRange(): Range | null {
        return this._currentRange
    }

    /**
     * 保存选区范围
     * @param _range 选区范围
     */
    public saveRange(_range?: Range): void {
        if (_range) {
            // 保存已有选区
            this._currentRange = _range
            return
        }

        // 获取当前的选区
        const selection = window.getSelection() as Selection
        if (selection.rangeCount === 0) {
            return
        }
        const range = selection.getRangeAt(0)

        // 保证选区的 DOM ，是在编辑区域之内
        const $containerElem = this.getSelectionContainerElem(range)
        if (!$containerElem) {
            return
        }
        if (
            $containerElem.attr('contenteditable') === 'false' ||
            $containerElem.parentUntil('[contenteditable=false]')
        ) {
            return
        }

        const editor = this.editor
        const $textElem = editor.$textElem
        if ($textElem.isContain($containerElem)) {
            // 是编辑内容之内的
            this._currentRange = range
        }
    }

    /**
     * 折叠选区范围
     * @param toStart true 开始位置，false 结束位置
     */
    public collapseRange(toStart: boolean = false): void {
        const range = this._currentRange
        if (range) {
            range.collapse(toStart)
        }
    }

    /**
     * 获取选区范围内的文字
     */
    public getSelectionText(): string {
        const range = this._currentRange
        if (range) {
            return range.toString()
        } else {
            return ''
        }
    }

    /**
     * 获取选区范围的 DOM 元素
     * @param range 选区范围
     */
    public getSelectionContainerElem(range?: Range): DomElement | undefined {
        let r: Range | null | undefined
        r = range || this._currentRange
        let elem: Node
        if (r) {
            elem = r.commonAncestorContainer
            return $(elem.nodeType === 1 ? elem : elem.parentNode)
        }
    }

    /**
     * 选区范围开始的 DOM 元素
     * @param range 选区范围
     */
    public getSelectionStartElem(range?: Range): DomElement | undefined {
        let r: Range | null | undefined
        r = range || this._currentRange
        let elem: Node
        if (r) {
            elem = r.startContainer
            return $(elem.nodeType === 1 ? elem : elem.parentNode)
        }
    }

    /**
     * 选区范围结束的 DOM 元素
     * @param range 选区范围
     */
    public getSelectionEndElem(range?: Range): DomElement | undefined {
        let r: Range | null | undefined
        r = range || this._currentRange
        let elem: Node
        if (r) {
            elem = r.endContainer
            return $(elem.nodeType === 1 ? elem : elem.parentNode)
        }
    }

    /**
     * 选区是否为空（没有选择文字）
     */
    public isSelectionEmpty(): boolean {
        const range = this._currentRange
        if (range && range.startContainer) {
            if (range.startContainer === range.endContainer) {
                if (range.startOffset === range.endOffset) {
                    return true
                }
            }
        }
        return false
    }

    /**
     * 恢复选区范围
     */
    public restoreSelection(): void {
        const selection = window.getSelection()
        const r = this._currentRange
        if (selection && r) {
            selection.removeAllRanges()
            selection.addRange(r)
        }
    }

    /**
     * 创建一个空白（即 &#8203 字符）选区
     */
    public createEmptyRange(): void {
        const editor = this.editor
        const range = this.getRange()
        let $elem: DomElement

        if (!range) {
            // 当前无 range
            return
        }
        if (!this.isSelectionEmpty()) {
            // 当前选区必须没有内容才可以，有内容就直接 return
            return
        }

        try {
            // 目前只支持 webkit 内核
            if (UA.isWebkit()) {
                // 插入 &#8203
                editor.cmd.do('insertHTML', '&#8203;')
                // 修改 offset 位置
                range.setEnd(range.endContainer, range.endOffset + 1)
                // 存储
                this.saveRange(range)
            } else {
                $elem = $('<strong>&#8203;</strong>')
                editor.cmd.do('insertElem', $elem)
                this.createRangeByElem($elem, true)
            }
        } catch (ex) {
            // 部分情况下会报错，兼容一下
        }
    }

    /**
     * 根据 DOM 元素设置选区
     * @param $elem DOM 元素
     * @param toStart true 开始位置，false 结束位置
     * @param isContent 是否选中 $elem 的内容
     */
    public createRangeByElem($elem: DomElement, toStart?: boolean, isContent?: boolean): void {
        if (!$elem.length) {
            return
        }

        const elem = $elem.elems[0]
        const range = document.createRange()

        if (isContent) {
            range.selectNodeContents(elem)
        } else {
            // 如果用户没有传入 isContent 参数，那就默认为 false
            range.selectNode(elem)
        }

        if (toStart != null) {
            // 传入了 toStart 参数，折叠选区。如果没传入 toStart 参数，则忽略这一步
            range.collapse(toStart)
        }

        // 存储 range
        this.saveRange(range)
    }
}

export default SelectionAndRange
