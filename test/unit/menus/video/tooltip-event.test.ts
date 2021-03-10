/**
 * @description Video menu tooltip-event
 * @author lichunlin
 */

import createEditor from '../../../helpers/create-editor'
import $ from '../../../../src/utils/dom-core'
import bindTooltipEvent, * as tooltipEvent from '../../../../src/menus/video/bind-event/tooltip-event'
import mockCommand from '../../../helpers/command-mock'
import dispatchEvent from '../../../helpers/mock-dispatch-event'
import Editor from '../../../../src/editor'
import setAlignment from '../../../../src/menus/video/bind-event/video-alignment'

const showTooltip = (editorId: string) => {
    const editor = createEditor(document, editorId)
    const fns = editor.txt.eventHooks.videoClickEvents
    const fakeDom = $('<p></p>')
    document.body.appendChild(fakeDom.elems[0])

    fns.forEach(fn => {
        fn(fakeDom)
    })
    return editor
}

describe('Video menu tooltip-event', () => {
    test('绑定 tooltip-event 事件', () => {
        const editor = createEditor(document, 'div1')

        bindTooltipEvent(editor)

        expect(editor.txt.eventHooks.videoClickEvents.length).toBeGreaterThanOrEqual(1)
    })

    test('调用 createShowHideFn 函数返回显示和隐藏tooltip方法', () => {
        const editor = createEditor(document, 'div2')
        const fns = tooltipEvent.createShowHideFn(editor)

        expect(fns.showVideoTooltip instanceof Function).toBeTruthy()
        expect(fns.hideVideoTooltip instanceof Function).toBeTruthy()
    })

    test('绑定 tooltip-event 事件，执行视频点击事件会展示tooltip', () => {
        const editor = createEditor(document, 'div4')

        bindTooltipEvent(editor)

        const videoClickEvents = editor.txt.eventHooks.videoClickEvents

        videoClickEvents.forEach(fn => {
            fn($(editor.$textElem))
        })

        expect($('.w-e-tooltip').elems[0]).not.toBeUndefined()
        expect($('.w-e-tooltip').elems[0].childNodes.length).toBe(8)

        // 关掉tooltip，以防影响后的测试
        const clickEvents = editor.txt.eventHooks.clickEvents
        clickEvents.forEach(fn => {
            // @ts-ignore
            fn()
        })
    })

    test('绑定 tooltip-event 事件，执行视频之外的其它点击事件会隐藏tooltip', () => {
        const editor = createEditor(document, 'div5')

        bindTooltipEvent(editor)

        const videoClickEvents = editor.txt.eventHooks.videoClickEvents
        const clickEvents = editor.txt.eventHooks.clickEvents

        videoClickEvents.forEach(fn => {
            fn($('<div></div>'))
        })

        clickEvents.forEach(fn => {
            // @ts-ignore
            fn()
        })

        expect($('#div5 .w-e-tooltip').elems[0]).toBeUndefined()
    })

    describe('点击视频 tooltip 事件', () => {
        let id = 6
        let editor: Editor

        beforeEach(() => {
            mockCommand(document)
            document.queryCommandSupported = jest.fn().mockReturnValue(true)

            editor = showTooltip(`div${id++}`)
        })

        afterEach(() => {
            $(`#div${id - 1}`).elems[0].click()
        })

        test('点击 tooltip 靠左', () => {
            tooltipEvent.createShowHideFn(editor)

            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes
            const container = $('<p>123</p>')

            setAlignment(container, 'left')

            dispatchEvent($(tooltipChildren[5]).children()!, 'click')

            expect(container.elems[0].getAttribute('style')).toContain('text-align:left')
        })

        test('点击 tooltip 居中', () => {
            tooltipEvent.createShowHideFn(editor)

            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes
            const container = $('<p>123</p>')

            setAlignment(container, 'center')

            dispatchEvent($(tooltipChildren[6]).children()!, 'click')

            expect(container.elems[0].getAttribute('style')).toContain('text-align:center')
        })

        test('点击 tooltip 靠右', () => {
            tooltipEvent.createShowHideFn(editor)

            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes
            const container = $('<p>123</p>')

            setAlignment(container, 'right')

            dispatchEvent($(tooltipChildren[7]).children()!, 'click')

            expect(container.elems[0].getAttribute('style')).toContain('text-align:right')
        })
    })
})
