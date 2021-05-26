/**
 * @description 查找器的管理器
 * @author TanShun
 */

import Editor from '../../editor'
import Finder from './finder'

declare type Result = {
    startNode: Node
    startOffset: number
    middleNodes: Node[]
    endNode: Node
    endOffset: number
}

export default class FinderManager {
    private editor: Editor

    private finder: Finder | null = null
    private finderGenerator: Generator<Result, null, unknown> | null = null

    private result: Result | null = null
    private searchValue: string | null = null

    constructor(editor: Editor) {
        this.editor = editor
    }

    next(searchValue: string) {
        if (this.finderGenerator == null || searchValue != this.searchValue) {
            this.searchValue = searchValue
            this.finder = new Finder(this.editor, searchValue)
            this.finderGenerator = this.finder[Symbol.iterator]()
        }
        return this.finderGenerator.next()?.value
    }

    createSelection(result: Result) {
        this.result = result
        let range = document.createRange()
        range.setStart(result.startNode, result.startOffset)
        range.setEnd(result.endNode, result.endOffset)
        let selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)

        let root = this.editor.$textElem.elems[0]
        let rangeRect = range.getBoundingClientRect()
        let rootTop = root.getBoundingClientRect().top

        if (rangeRect.top - rootTop > root.offsetHeight - rangeRect.height) {
            root.scrollTop = Math.min(
                root.scrollTop + rangeRect.top - rootTop,
                root.scrollHeight - root.offsetHeight
            )
        } else if (rangeRect.top < rootTop) {
            root.scrollTop += rangeRect.top - rootTop
        }
    }

    replace(result: Result, replaceValue: string) {
        let { startNode, startOffset, middleNodes, endNode, endOffset } = result
        if (startNode == endNode) {
            let text = startNode.textContent
            if (text != null) {
                let prefix = text.substr(0, startOffset)
                let subfix = text.substr(endOffset)

                let textContent = prefix + replaceValue + subfix
                if (textContent == '') {
                    this.removeNode(startNode)
                } else {
                    startNode.textContent = textContent
                    this.finder?.setLastModifiedNode(startNode)
                    this.finder?.adjustCursor(replaceValue.length - (this.searchValue?.length || 0))
                }
            }
        } else {
            middleNodes.forEach(node => this.removeNode(node))

            let prefix = startNode.textContent?.substr(0, startOffset)
            let subfix = endNode.textContent?.substr(endOffset)

            this.removeNode(startNode)

            let textContent = prefix + replaceValue + subfix
            if (textContent == '') {
                this.removeNode(endNode)
            } else {
                endNode.textContent = prefix + replaceValue + subfix
                this.finder?.setLastModifiedNode(endNode)
                this.finder?.setCursor(startOffset + replaceValue.length)
            }
        }
    }

    getSelectionResult() {
        return this.result
    }

    getSearchValue() {
        return this.searchValue
    }

    removeNode(node: Node) {
        let parentNode = node.parentNode
        let root = this.editor.$textElem.elems[0]

        parentNode?.removeChild(node)
        if (parentNode?.textContent == '' && root != parentNode) {
            this.removeNode(parentNode)
        }
    }
}
