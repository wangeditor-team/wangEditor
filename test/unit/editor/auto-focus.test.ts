/**
 * @description 选区范围
 * @author tonghan
 */

import createEditor from '../../helpers/create-editor'
import $ from '../../../src/utils/dom-core'

const TEXT = '我是一行文字'
const $SPAN = $(`<span>${TEXT}</span>`)
const $P = $('<p></p>')
$P.append($SPAN)

test('auto-focus: true', () => {
    const editor = createEditor(document, 'div1')
    const selection = editor.selection
    const range = selection.getRange()
    expect(range).not.toBeNull()
})

test('auto-focus: false', () => {
    const editor = createEditor(document, 'div1', '', { focus: false })
    const selection = editor.selection
    const range = selection.getRange()
    expect(range).toBeNull()
})
