/**
 * @author 翠林
 * @deprecated 颜色选择器菜单基类
 */

import Editor from '../../../src/editor'
import ColorPicker from '../../../src/editor/color-picker'
import ColorPickerMenu from '../../../src/menus/menu-constructors/ColorPickerMenu'
import $, { DomElement } from '../../../src/utils/dom-core'
import createEditor from '../../helpers/create-editor'
import dispatchEvent from '../../helpers/mock-dispatch-event'

let editor: Editor
let $elem: DomElement
let menu: ColorPickerMenu

describe('Color Picker Menu', () => {
    beforeAll(() => {
        editor = createEditor(document, `div`, '')
        $elem = $(`<div></div>`)
        menu = new ColorPickerMenu($elem, editor, {})
    })

    test('初始化', () => {
        expect(menu.picker instanceof ColorPicker).toBeTruthy()
    })

    test('悬浮显示', done => {
        dispatchEvent($elem, 'mouseenter', 'MouseEvent')

        setTimeout(() => {
            expect(menu.opened).toBeTruthy()
            done()
        }, 500)
    })

    test('选区为空，悬浮不显示', done => {
        expect(menu.opened).toBeTruthy()
        menu.picker.hide() // 这里存在问题，之前的 menu 实例对本次测试有影响，需手动关闭悬浮框再进行测试
        expect(menu.opened).toBeFalsy()
        const mockGetRage = jest.spyOn(editor.selection, 'getRange')
        mockGetRage.mockImplementation(() => null)
        dispatchEvent($elem, 'mouseenter', 'MouseEvent')
        setTimeout(() => {
            expect(menu.opened).toBeFalsy()
            done()
        }, 500)
    })
})
