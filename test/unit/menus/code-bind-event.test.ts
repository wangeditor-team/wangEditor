/**
 * @description code tooltip-bind-event
 * @author luochao
 */

import Editor from '../../../src/editor'
import $ from '../../../src/utils/dom-core'

import createEditor from '../../helpers/create-editor'
import { createShowHideFn } from '../../../src/menus/code/bind-event/tooltip-event'

let editor: Editor
let id = 1

describe('code bind event', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
    })

    test('调用 createShowHideFn 返回显示和隐藏code tooltip函数', () => {
        const fnObj = createShowHideFn(editor)

        expect(fnObj.showCodeTooltip).toBeInstanceOf(Function)
        expect(fnObj.hideCodeTooltip).toBeInstanceOf(Function)
    })

    test('调用 showCodeTooltip 方法展示code tooltip', () => {
        const fnObj = createShowHideFn(editor)
        const codeDom = $('<div></div>')

        fnObj.showCodeTooltip(codeDom)

        const tooltip = $(`#div${id - 1} .w-e-tooltip`)
        expect(tooltip.elems[0]).not.toBeNull()
    })

    test('调用 hideCodeTooltip 方法隐藏code tooltip', () => {
        const fnObj = createShowHideFn(editor)
        const codeDom = $('<div></div>')

        fnObj.showCodeTooltip(codeDom)

        const tooltip1 = $(`#div${id - 1} .w-e-tooltip`)
        expect(tooltip1.elems[0]).not.toBeNull()

        fnObj.hideCodeTooltip()

        const tooltip2 = $(`#div${id - 1} .w-e-tooltip`)
        expect(tooltip2.elems[0]).toBeUndefined()
    })
})
