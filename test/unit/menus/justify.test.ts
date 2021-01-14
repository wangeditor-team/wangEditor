/**
 * @description justify menu
 * @author liuwei
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import justify from '../../../src/menus/justify/index'
import $ from '../../../src/utils/dom-core'
import { DomElement } from '../../../src/utils/dom-core'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let justifyMenu: justify

describe('Justify Menu', () => {
    test('justify 菜单：dropList', () => {
        editor = createEditor(document, 'div1') // 赋值给全局变量
        justifyMenu = getMenuInstance(editor, justify) as justify // 赋值给全局变量
        expect(justifyMenu.dropList).not.toBeNull()
        justifyMenu.dropList.show()
        expect(justifyMenu.dropList.isShow).toBe(true)
        justifyMenu.dropList.hide()
        expect(justifyMenu.dropList.isShow).toBe(false)
    })

    test('justify 菜单：设置对齐方式', () => {
        const justifyClasses = ['left', 'right', 'center', 'justify']

        const mockGetSelectionRangeTopNodes = (tagString: string) => {
            const domArr = [$(tagString)]
            jest.spyOn(editor.selection, 'getSelectionRangeTopNodes').mockImplementation(
                () => domArr
            )
            return domArr
        }

        const $elems = mockGetSelectionRangeTopNodes('<p>123</p>')
        for (let value of justifyClasses) {
            justifyMenu.command(value)
            $elems.forEach((el: DomElement) => {
                expect(el.elems[0].getAttribute('style')).toContain(`text-align:${value}`)
            })
        }
    })

    test('justify 菜单：设置对齐方式，如果当前选区是 list，则只修改当前选区的元素对其样式', () => {
        const justifyClasses = ['left', 'right', 'center', 'justify']

        const mockGetSelectionRangeTopNodes = (tagString: string) => {
            const domArr = [$(tagString)]
            jest.spyOn(editor.selection, 'getSelectionRangeTopNodes').mockImplementation(
                () => domArr
            )
            return domArr
        }

        const mockGetSelectionRangeContainer = (tagString: string) => {
            const dom = $(tagString)
            jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() => dom)
            return dom
        }

        const topElems = mockGetSelectionRangeTopNodes('<ul><li>123</li></ul>')
        const containerElems = mockGetSelectionRangeContainer('<li>123</li>')

        for (let value of justifyClasses) {
            justifyMenu.command(value)
            topElems.forEach((el: DomElement) => {
                expect(el.elems[0]).not.toHaveStyle(`text-align:${value}`)
            })
            expect(containerElems.elems[0]).toHaveStyle(`text-align:${value}`)
        }
    })

    test('justify 菜单：设置对齐方式，如果当前选区是 blockquote，则只修改当前选区的元素对其样式', () => {
        const justifyClasses = ['left', 'right', 'center', 'justify']

        const $p = $('<p>123</p>')
        const blockquote = $('<blockquote></blockquote>')
        blockquote.append($p)

        jest.spyOn(editor.selection, 'getSelectionRangeTopNodes').mockImplementation(() => [
            blockquote,
        ])
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() => $p)

        for (let value of justifyClasses) {
            justifyMenu.command(value)
            expect(blockquote.elems[0]).not.toHaveStyle(`text-align:${value}`)
            expect($p.elems[0]).toHaveStyle(`text-align:${value}`)
        }
    })
})
