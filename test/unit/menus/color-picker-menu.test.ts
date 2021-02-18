/**
 * @author 翠林
 * @deprecated 颜色选择器菜单基类
 */

import ColorPicker from '../../../src/editor/color-picker'
import ColorPickerMenu from '../../../src/menus/menu-constructors/ColorPickerMenu'
import $ from '../../../src/utils/dom-core'
import createEditor from '../../helpers/create-editor'
import dispatchEvent from '../../helpers/mock-dispatch-event'

describe('Color Picker Menu', () => {
    const editor = createEditor(document, `div`, '')
    const $elem = $(`<div></div>`)
    const menu = new ColorPickerMenu($elem, editor, {})

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
        // 手动关闭悬浮框后再进行本次测试
        menu.picker.hide()
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
