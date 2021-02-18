/**
 * @author 翠林
 * @deprecated 字体颜色 - 颜色悬着器
 */

import Editor from '../../../src/editor'
import FontColorPicker from '../../../src/menus/font-color-picker'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let fontMenu: FontColorPicker

describe('FontColorPicker', () => {
    test('Color Picker', () => {
        editor = createEditor(document, 'div', '', {
            menus: ['foreColorPicker'],
            colorPicker: {},
        })
        fontMenu = getMenuInstance(editor, FontColorPicker) as FontColorPicker
        expect(fontMenu.picker).not.toBeNull()
    })

    test('no alpha', () => {
        fontMenu.picker.show()
        fontMenu.picker.$el.$ref('switchover').elems[0].click()
        expect(fontMenu.picker.$el.find('[class="we-color_alpha"]').elems.length).toBe(0)
    })

    test('文字颜色', () => {
        mockCmdFn(document)
        const cmdVal = '1'
        fontMenu.command(cmdVal)
        expect(document.execCommand).toBeCalledWith('foreColor', false, cmdVal)
    })
})
