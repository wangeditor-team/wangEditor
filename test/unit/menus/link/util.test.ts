import { insertHtml } from '../../../../src/menus/link/util'

/**
 * 生成带选区的selection对象
 */
function createSelection(
    anchorNode: Node,
    anchorPos: number,
    focusNode: Node,
    focusPos: number
): Selection {
    const selection = window.getSelection() as Selection
    const range = new Range()
    range.setStart(anchorNode, anchorPos)
    range.setEnd(focusNode, focusPos)
    selection.removeAllRanges()
    selection.addRange(range)
    return selection
}

describe('测试insertHtml函数', () => {
    test('选区anchorNode和focusNode是同一个且外层只有p标签包裹', () => {
        document.body.innerHTML = `<p id="link">123456</p>`
        const p = document.getElementById('link') as Node
        const anchorNode = p.childNodes[0]
        const selection = createSelection(anchorNode, 2, anchorNode, 5)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe('345')
    })

    test('anchorNode和focusNode父节点p标签，且两者间是一个带标签的节点', () => {
        document.body.innerHTML = `<p id="link">123456<b>test</b>7890</p>`
        const p = document.getElementById('link') as Node
        const len = p.childNodes.length
        const anchorNode = p.childNodes[0]
        const focusNode = p.childNodes[len - 1]
        const selection = createSelection(anchorNode, 2, focusNode, 3)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe('3456<b>test</b>789')
    })

    test('anchorNode和focusNode父节点为p标签，且两者间是多个带标签的节点', () => {
        document.body.innerHTML = `<p id="link">123456<b><i>test</i></b><i>test1</i>7890</p>`
        const p = document.getElementById('link') as Node
        const len = p.childNodes.length
        const anchorNode = p.childNodes[0]
        const focusNode = p.childNodes[len - 1]
        const selection = createSelection(anchorNode, 2, focusNode, 3)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe('3456<b><i>test</i></b><i>test1</i>789')
    })

    test('anchorNode和focusNode父节点为p标签，且两者间是带标签的节点以及文本节点', () => {
        document.body.innerHTML = `<p id="link">123456<b><i>test</i></b>middle<i>test1</i>7890</p>`
        const p = document.getElementById('link') as Node
        const len = p.childNodes.length
        const anchorNode = p.childNodes[0]
        const focusNode = p.childNodes[len - 1]
        const selection = createSelection(anchorNode, 2, focusNode, 3)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe('3456<b><i>test</i></b>middle<i>test1</i>789')
    })

    test('anchorNode和focusNode父节点为非p标签', () => {
        document.body.innerHTML = `<p id="link"><b>123456</b>0000<b>7890</b></p>`
        const p = document.getElementById('link') as Node
        const len = p.childNodes.length
        const anchorNode = p.childNodes[0].childNodes[0]
        const focusNode = p.childNodes[len - 1].childNodes[0]
        const selection = createSelection(anchorNode, 2, focusNode, 3)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe('<b>3456</b>0000<b>789</b>')
    })

    test('选中的行中最外层包裹有除了p之外的其他标签', () => {
        document.body.innerHTML = `<p id="link"><i><b>123456</b>0000<b>7890</b></i></p>`
        const p = document.getElementById('link') as Node
        const anchorNode = p.childNodes[0].childNodes[0].childNodes[0]
        const focusNode = p.childNodes[0].childNodes[2].childNodes[0]
        const selection = createSelection(anchorNode, 2, focusNode, 3)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe('<i><b>3456</b>0000<b>789</b></i>')
    })

    test('测试背景颜色是否保存', () => {
        document.body.innerHTML = `<p id="link">123456<span style="background-color: rgb(139, 170, 74);">test</span>78900</p>`
        const p = document.getElementById('link') as Node
        const len = p.childNodes.length
        const anchorNode = p.childNodes[0]
        const focusNode = p.childNodes[len - 1]
        const selection = createSelection(anchorNode, 2, focusNode, 3)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe(
            '3456<span style="background-color: rgb(139, 170, 74);">test</span>789'
        )
    })

    test('测试字体颜色是否保存', () => {
        document.body.innerHTML = `<p id="link">12345678<font color="#8baa4a">test</font>67890</p>`
        const p = document.getElementById('link') as Node
        const len = p.childNodes.length
        const anchorNode = p.childNodes[0]
        const focusNode = p.childNodes[len - 1]
        const selection = createSelection(anchorNode, 2, focusNode, 3)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe('345678<font color="#8baa4a">test</font>678')
    })

    test('测试设置后的字体是否保存', () => {
        document.body.innerHTML = `<p id="link">12345<font face="华文仿宋">test</font>67890</p>`
        const p = document.getElementById('link') as Node
        const len = p.childNodes.length
        const anchorNode = p.childNodes[0]
        const focusNode = p.childNodes[len - 1]
        const selection = createSelection(anchorNode, 2, focusNode, 3)

        const htmlString = insertHtml(selection, p)
        expect(htmlString).toBe('345<font face="华文仿宋">test</font>678')
    })
})
