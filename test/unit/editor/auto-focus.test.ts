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

let id = 1
test('auto-focus: false', () => {
    createEditor(document, `div${id++}`, '', { focus: false })
    const rangeCount = window?.getSelection()?.rangeCount
    expect(rangeCount).toBe(0)
})

test('auto-focus: true', () => {
    createEditor(document, `div${id++}`)
    const rangeCount = window?.getSelection()?.rangeCount
    expect(rangeCount).toBe(1)
})
