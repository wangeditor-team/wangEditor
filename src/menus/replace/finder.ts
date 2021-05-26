/**
 * @description 查找器
 * @author TanShun
 */

import Editor from '../../editor'

declare type Document2 = Document & {
    /**
     * The method document.createNodeIterator in IE only follows [Document Object Model (DOM) Level 2 Traversal and Range Specification]
     * {@link https://www.w3.org/TR/DOM-Level-2-Traversal-Range/#traversal-Traversal-NodeIteratorFactory-createNodeIterator},
     * unlike other browsers, the parameter "entityReferenceExpansion" is required.
     * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
     * @param root The root element or node to start traversing on.
     * @param whatToShow The type of nodes or elements to appear in the node list
     * @param filter A custom NodeFilter function to use. For more information, see filter. Use null for no filter.
     * @param entityReferenceExpansion A flag that specifies whether entity reference nodes are expanded.
     */
    createNodeIterator(
        root: Node,
        whatToShow: number,
        filter: NodeFilter | null,
        entityReferenceExpansion: boolean
    ): NodeIterator
}

export default class Finder {
    private searchValue: string
    private nodeIterator: NodeIterator

    private cursor: number = 0

    private lastModifiedNode: Node | null = null

    constructor(editor: Editor, searchValue: string) {
        const root = editor.$textElem.elems[0]
        this.nodeIterator = (document as Document2).createNodeIterator(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        )
        this.searchValue = searchValue
    }

    *[Symbol.iterator]() {
        let startNode
        let startOffset = 0
        let middleNodes: Node[] = []
        let endNode
        let endOffset = 0

        let isContinued = false
        let restSearchValue = ''

        let referenceNode
        while ((referenceNode = this.nextNode())) {
            let text = referenceNode.textContent || ''
            let skipCurrentNode = false
            this.cursor = 0

            while (isContinued) {
                if (text.startsWith(restSearchValue)) {
                    endNode = referenceNode
                    endOffset = restSearchValue.length

                    this.cursor = endOffset
                    isContinued = false

                    yield {
                        startNode: startNode as Node,
                        startOffset,
                        middleNodes,
                        endNode,
                        endOffset,
                    }
                    text = referenceNode.textContent || ''
                } else if (restSearchValue.startsWith(text)) {
                    restSearchValue = restSearchValue.substr(text.length)
                    middleNodes.push(referenceNode)
                    skipCurrentNode = true
                    break
                } else {
                    isContinued = false
                }
            }

            if (skipCurrentNode) continue

            while (text.includes(this.searchValue, this.cursor)) {
                startNode = endNode = referenceNode
                startOffset = text.indexOf(this.searchValue, this.cursor)
                endOffset = startOffset + this.searchValue.length
                middleNodes = []

                this.cursor = endOffset
                yield {
                    startNode,
                    startOffset,
                    middleNodes,
                    endNode,
                    endOffset,
                }
                text = referenceNode.textContent || ''
            }

            let windowSize = Math.min(this.searchValue.length, text.length - this.cursor)
            while (windowSize > 0) {
                if (text.endsWith(this.searchValue.substr(0, windowSize))) {
                    isContinued = true
                    restSearchValue = this.searchValue.substr(windowSize)
                    startNode = referenceNode
                    startOffset = text.length - windowSize
                    middleNodes = []
                    break
                }
                windowSize--
            }
        }
        return null
    }

    adjustCursor(step: number) {
        this.cursor = this.cursor + step
    }

    setCursor(cursor: number) {
        this.cursor = cursor
    }

    setLastModifiedNode(node: Node) {
        this.lastModifiedNode = node
    }

    nextNode() {
        let node = this.nodeIterator.nextNode()
        if (this.lastModifiedNode != null && node == this.lastModifiedNode) {
            // If the current node in NodeIterator was modified, the NodeIterator.nextNode() method will return the modified one in IE, so call it twice.
            node = this.nodeIterator.nextNode()
        }
        return node
    }
}
