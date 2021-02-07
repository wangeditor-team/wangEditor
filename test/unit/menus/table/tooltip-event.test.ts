/**
 * @description table tooltip 测试
 * @author luochao
 */
import createEditor from '../../../helpers/create-editor'
import $ from '../../../../src/utils/dom-core'
import dispatchEvent from '../../../helpers/mock-dispatch-event'
import mockCommand from '../../../helpers/command-mock'

jest.mock('../../../../src/menus/table/bind-event/event/getNode.ts', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getRowNode: jest.fn().mockReturnValue(document.createElement('p')),
            getCurrentRowIndex: jest.fn().mockReturnValue(0),
            getCurrentColIndex: jest.fn().mockReturnValue(0),
            getTableHtml: jest
                .fn()
                .mockReturnValue(
                    '<table border="0" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td></td></tr></tbody></table>'
                ),
        }
    })
})

const showTooltip = (editorId: string) => {
    const editor = createEditor(document, editorId)
    const fns = editor.txt.eventHooks.tableClickEvents
    const fakeDom = $('<p></p>')
    document.body.appendChild(fakeDom.elems[0])

    fns.forEach(fn => {
        fn(fakeDom)
    })
}
const editor = createEditor(document, 'div1')

describe('Table Tooltip Event', () => {
    test('创建编辑器表格菜单会绑定 tooltip event', () => {
        expect(editor.txt.eventHooks.tableClickEvents.length).toBeGreaterThanOrEqual(1)
    })

    test('执行 tooltip event 函数会展示 table tooltip', () => {
        const fns = editor.txt.eventHooks.tableClickEvents
        const fakeDom = $('<p></p>')
        document.body.appendChild(fakeDom.elems[0])

        fns.forEach(fn => {
            fn(fakeDom)
        })

        const tooltip = $('.w-e-tooltip')
        expect(tooltip.elems.length).toBeGreaterThanOrEqual(1)
    })

    test('展示 table tooltip 后，点击其它地方会隐藏 tooltip', () => {
        editor.$textElem.elems[0].click()

        const tooltip = $('.w-e-tooltip')
        expect(tooltip.elems.length).toEqual(0)
    })

    describe('Table Tooltip click', () => {
        let id = 4

        beforeEach(() => {
            mockCommand(document)
            document.queryCommandSupported = jest.fn().mockReturnValue(true)

            showTooltip(`div${id++}`)
        })

        afterEach(() => {
            $(`#div${id - 1}`).elems[0].click()
        })

        test('点击 tooltip 删除表格按钮，会执行删除表格操作', () => {
            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes

            dispatchEvent($(tooltipChildren[0]).children()!, 'click')

            expect(document.execCommand).toBeCalled()
        })

        test('点击 tooltip 添加行按钮，会执行添加行操作', () => {
            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes

            dispatchEvent($(tooltipChildren[1]).children()!, 'click')

            expect(document.execCommand).toBeCalled()
        })

        test('点击 tooltip 删除行按钮，会执行删除操作', () => {
            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes

            dispatchEvent($(tooltipChildren[2]).children()!, 'click')

            expect(document.execCommand).toBeCalled()
        })

        test('点击 tooltip 删除行按钮，会执行删除操作', () => {
            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes

            dispatchEvent($(tooltipChildren[2]).children()!, 'click')

            expect(document.execCommand).toBeCalled()
        })

        test('点击 tooltip 添加列按钮，会执行添加列操作', () => {
            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes

            dispatchEvent($(tooltipChildren[3]).children()!, 'click')

            expect(document.execCommand).toBeCalled()
        })

        test('点击 tooltip 删除列按钮，会执行删除列操作', () => {
            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes

            dispatchEvent($(tooltipChildren[4]).children()!, 'click')

            expect(document.execCommand).toBeCalled()
        })

        test('点击 tooltip 设置表头按钮，会执行设置表头操作', () => {
            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes

            dispatchEvent($(tooltipChildren[5]).children()!, 'click')

            expect(document.execCommand).toBeCalled()
        })

        test('点击 tooltip 取消表头按钮，会执行取消表头操作', () => {
            const tooltipChildren = $('.w-e-tooltip').elems[0].childNodes

            dispatchEvent($(tooltipChildren[6]).children()!, 'click')

            expect(document.execCommand).toBeCalled()
        })
    })
})
