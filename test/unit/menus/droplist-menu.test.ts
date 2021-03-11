/**
 * @description droplist menu test
 * @author luochao
 */

import DropListMenu from '../../../src/menus/menu-constructors/DropListMenu'
import DropList from '../../../src/menus/menu-constructors/DropList'
import createEditor from '../../helpers/create-editor'
import $ from '../../../src/utils/dom-core'
import dispatchEvent from '../../helpers/mock-dispatch-event'

let editor: ReturnType<typeof createEditor>
let droplistMenu: DropListMenu
let id = 1
let menuEl: ReturnType<typeof $>

describe('dropList menu', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`, '', {
            lang: 'en',
        })

        const mockClickFn = jest.fn((value: string) => value)
        menuEl = $(`<div id="menu${id++}"></div>`)
        const conf = {
            title: '设置标题',
            type: 'list',
            width: 100,
            clickHandler: mockClickFn,
            list: [
                {
                    value: 'test123',
                    $elem: $('<span><i>test123</i></span>'),
                },
            ],
        }

        droplistMenu = new DropListMenu(menuEl, editor, conf)
    })

    test('初始化基本的下拉菜单', () => {
        expect(droplistMenu.dropList instanceof DropList).toBeTruthy()
    })

    test('初始化基本的下拉菜单，模拟菜单click事件会展开下来菜单', done => {
        expect.assertions(2)

        dispatchEvent(menuEl, 'click')

        setTimeout(() => {
            expect(droplistMenu.dropList.isShow).toBeTruthy()
            expect(menuEl.elems[0]).toHaveStyle(`z-index:${editor.zIndex.get('menu')}`)
            done()
        }, 300)
    })

    test('初始化基本的下拉菜单，模拟菜单mouseleave事件会隐藏菜单', done => {
        expect.assertions(3)

        dispatchEvent(menuEl, 'click')

        setTimeout(() => {
            expect(droplistMenu.dropList.isShow).toBeTruthy()

            dispatchEvent(menuEl, 'mouseleave', 'MouseEvent')

            setTimeout(() => {
                expect(droplistMenu.dropList.isShow).toBeFalsy()
                expect(menuEl.elems[0]).toHaveStyle(`z-index:auto`)
                done()
            }, 20)
        }, 300)
    })

    test('初始化基本的下拉菜单，模拟菜单click事件如果编辑器当前的range为空，则直接返回', () => {
        const mockGetRage = jest.spyOn(editor.selection, 'getRange')
        mockGetRage.mockImplementation(() => null)

        dispatchEvent(menuEl, 'click')

        expect(droplistMenu.dropList.isShow).toBeFalsy()
    })
})
