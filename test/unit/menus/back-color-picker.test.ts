/**
 * @author 翠林
 * @deprecated 背景颜色 - 颜色选择器
 */

import Editor from '../../../src/editor'
import BackColorPicker from '../../../src/menus/back-color-picker'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let backMenu: BackColorPicker

describe('BackColorPicker', () => {
    test('Color Picker', () => {
        editor = createEditor(document, 'div', '', {
            menus: ['backColorPicker'],
            colorPicker: {},
        })
        backMenu = getMenuInstance(editor, BackColorPicker) as BackColorPicker
        expect(backMenu.picker).not.toBeNull()
    })

    test('背景颜色', () => {
        mockCmdFn(document)
        const cmdVal = '1'
        backMenu.command(cmdVal)
        expect(document.execCommand).toBeCalledWith('backColor', false, cmdVal)
    })
})
