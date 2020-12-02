/**
 * @description Img menu tooltip-event
 * @author luochao
 */
import createEditor from '../../../helpers/create-editor'
import $ from '../../../../src/utils/dom-core'
import bindTooltipEvent, * as tooltipEvent from '../../../../src/menus/img/bind-event/tooltip-event'

describe('Img menu tooltip-event', () => {
    test('绑定 tooltip-event 事件', () => {
        const editor = createEditor(document, 'div1')

        bindTooltipEvent(editor)

        expect(editor.txt.eventHooks.imgClickEvents.length).toBeGreaterThanOrEqual(1)
    })

    test('调用 createShowHideFn 函数返回显示和隐藏tooltip方法', () => {
        const editor = createEditor(document, 'div2')
        const fns = tooltipEvent.createShowHideFn(editor)

        expect(fns.showImgTooltip instanceof Function).toBeTruthy()
        expect(fns.hideImgTooltip instanceof Function).toBeTruthy()
    })

    test('绑定 tooltip-event 事件，执行图片点击事件会展示tooltip', () => {
        const editor = createEditor(document, 'div4')

        bindTooltipEvent(editor)

        const imgClickEvents = editor.txt.eventHooks.imgClickEvents

        imgClickEvents.forEach(fn => {
            fn($(editor.$textElem))
        })

        expect($('.w-e-tooltip').elems[0]).not.toBeUndefined()
        expect($('.w-e-tooltip').elems[0].childNodes.length).toBe(5)
    })

    test('绑定 tooltip-event 事件，执行图片之外的其它点击事件会隐藏tooltip', () => {
        const editor = createEditor(document, 'div5')

        bindTooltipEvent(editor)

        const imgClickEvents = editor.txt.eventHooks.imgClickEvents
        const clickEvents = editor.txt.eventHooks.clickEvents

        imgClickEvents.forEach(fn => {
            fn($('<div></div>'))
        })

        clickEvents.forEach(fn => {
            // @ts-ignore
            fn()
        })

        expect($('#div5 .w-e-tooltip').elems[0]).toBeUndefined()
    })
})
