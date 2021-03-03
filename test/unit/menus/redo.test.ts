/**
 * @description redo test
 */

import createEditor from '../../helpers/create-editor'
import Redo from '../../../src/menus/redo/index'
import Undo from '../../../src/menus/undo/index'
import mockCmdFn from '../../helpers/command-mock'
import { getMenuInstance } from '../../helpers/menus'

test('重做 兼容模式', done => {
    let count = 0
    const editor = createEditor(document, 'div1', '', {
        onchange: function () {
            count++
            // 由 editor.cmd.do 触发的 onchange
            if (count == 1) {
                const undo = getMenuInstance(editor, Undo) as Undo
                undo.clickHandler()
            }
            // 由 undo.clickHandler 触发的 onchange
            if (count == 2) {
                const redo = getMenuInstance(editor, Redo) as Redo
                redo.clickHandler()
                // 兼容模式
                expect(editor.txt.html()).toEqual('<p><br/><span>123</span></p>')
            }
            done()
        },
    })

    mockCmdFn(document)
    editor.cmd.do('insertHTML', '<span>123</span>')
})

test('重做 标准模式', done => {
    let count1 = 0
    const editor = createEditor(document, 'div2', '', {
        onchange: function () {
            count1++
            // 由 editor.cmd.do 触发的 onchange
            if (count1 == 1) {
                const undo = getMenuInstance(editor, Undo) as Undo
                undo.clickHandler()
            }
            // 由 undo.clickHandler 触发的 onchange
            if (count1 == 2) {
                const redo = getMenuInstance(editor, Redo) as Redo
                redo.clickHandler()
                // 标准模式
                expect(editor.history.size).toEqual([1, 0])
            }

            done()
        },
    })

    mockCmdFn(document)
    editor.cmd.do('insertHTML', '<span>123</span>')
})
