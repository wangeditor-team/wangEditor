/**
 * @description quote test
 */

import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'
import createQuote from '../../../src/menus/quote/create-quote-node'
import QuoteMenu from '../../../src/menus/quote'
import { getMenuInstance } from '../../helpers/menus'
import $, { DomElement } from '../../../src/utils/dom-core'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let editor: Editor
let id = 1
let quoteMenu: QuoteMenu
describe('Editor quote menu', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
        quoteMenu = getMenuInstance(editor, QuoteMenu)
    })
    test('创建编辑器会初始化 quote 菜单', () => {
        expect(editor.txt.eventHooks.enterDownEvents.length).toBeGreaterThanOrEqual(1)
        expect(quoteMenu).not.toBeNull()
    })

    test('给编辑器添加单行引用', () => {
        editor.selection.createEmptyRange()
        quoteMenu.clickHandler()

        expect((editor.txt.html() as string).indexOf('blockquote')).toBeGreaterThanOrEqual(0)
    })

    test('取消编辑器添加单行引用', () => {
        editor.selection.createEmptyRange()
        quoteMenu.clickHandler()
        expect((editor.txt.html() as string).indexOf('blockquote')).toBeGreaterThanOrEqual(0)
        quoteMenu.clickHandler()
        expect((editor.txt.html() as string).indexOf('blockquote')).toEqual(-1)
    })

    test('执行 enterDownEvents 里面的函数会触发 quoteEnter 函数执行', () => {
        const $childElem: DomElement[] = [$(`<p>123</p>`)]
        const $quote = createQuote($childElem)

        editor.$textElem.append($quote)
        // @ts-ignore
        editor.selection.createRangeByElem($quote)

        const mockSelectionGetSelectionContainerElem = jest.spyOn(
            editor.selection,
            'getSelectionContainerElem'
        )
        const mockGetSelectionRangeTopNodes = jest.spyOn(
            editor.selection,
            'getSelectionRangeTopNodes'
        )

        mockSelectionGetSelectionContainerElem.mockImplementation(() => {
            return $quote
        })
        mockGetSelectionRangeTopNodes.mockImplementation(() => {
            return [$quote]
        })

        const event = new KeyboardEvent('keydown')

        editor.txt.eventHooks.enterDownEvents.forEach(fn => {
            fn(event)
        })
    })

    test('可以使用 createQuote 创建多行引用', () => {
        const $childElem: DomElement[] = [$(`<p>123</p>`), $(`<p>456</p>`)]
        const $quote = createQuote($childElem)
        const p = $(`<p></p>`)
        p.append($quote)
        expect(p.html()).toEqual(`<blockquote><p>123</p><p>456</p></blockquote>`)
    })
})
