/**
 * @description undo test
 */

import createEditor from '../../helpers/create-editor'
import Undo from '../../../src/menus/undo/index'
import mockCmdFn from '../../helpers/command-mock'
import { getMenuInstance } from '../../helpers/menus'

test('撤销', done => {
    let count = 0
    const editor = createEditor(document, 'div1', '', {
        onchange: function () {
            count++
            // 由 editor.cmd.do 触发的 onchange
            if (count == 1) {
                const undo = getMenuInstance(editor, Undo) as Undo
                undo.clickHandler()
                if (editor.isCompatibleMode) {
                    // 兼容模式
                    expect(editor.$textElem.html()).toEqual('<p><br></p>')
                } else {
                    // 标准模式
                    expect(editor.history.size).toEqual([0, 1])
                }
            }
            done()
        },
        compatibleMode: function () {
            return Math.round(Math.random()) == 1
        },
    })

    mockCmdFn(document)
    editor.cmd.do('insertHTML', '<span>123</span>')
})
