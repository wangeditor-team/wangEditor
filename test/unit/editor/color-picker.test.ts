/**
 * @author 翠林
 * @description color picker
 */

import ColorPicker from '../../../src/editor/color-picker'
import $ from '../../../src/utils/dom-core'

let picker: ColorPicker
let input: HTMLInputElement
let change = jest.fn()
let cancel = jest.fn()
let done = jest.fn()
let closed = jest.fn()

describe('颜色选择器：color picker', () => {
    test('初始化', () => {
        picker = ColorPicker.create({
            change,
            closed,
            done,
            cancel,
            builtInTitle: '内置颜色',
            historyTitle: '历史选色',
            customTitle: '自定义颜色',
            text: {
                done: 'OK',
                cancel: 'CANCEL',
                toSelect: 'TO SELECT',
                toPalette: 'TO PALETTE',
                empty: 'EMPTY',
            },
            custom: ['#ff0', '#00f', '#22f'],
        })
        expect(picker).not.toBeNull()
    })

    test('显示颜色列表', () => {
        picker.show()
        expect(picker.$el.find('[class="we-selections"]').elems.length).toBe(1)
        expect(picker.$el.find('[class="we-palette"]').elems.length).toBe(0)
    })

    test('列表页自定义标题配置', () => {
        const titles = picker.$el.find('[class="we-selection-title"]').elems
        expect($(titles[0]).text().trim()).toBe('内置颜色')
        expect($(titles[1]).text().trim()).toBe('自定义颜色')
        expect($(titles[2]).text().trim()).toBe('历史选色')
        expect(picker.$el.$ref('cancel').text().trim()).toBe('CANCEL')
        expect(picker.$el.$ref('switchover').text().trim()).toBe('TO PALETTE')
    })

    test('显示调色板', () => {
        picker.$el.$ref('switchover').elems[0].click()
        expect(picker.$el.find('[class="we-selections"]').elems.length).toBe(0)
        expect(picker.$el.find('[class="we-palette"]').elems.length).toBe(1)
    })

    test('调色板页自定义标题配置', () => {
        expect(picker.$el.$ref('switchover').text().trim()).toBe('TO SELECT')
        expect(picker.$el.$ref('cancel').text().trim()).toBe('CANCEL')
        expect(picker.$el.$ref('done').text().trim()).toBe('OK')
    })

    test('调色板输出值模式切换', () => {
        input = picker.$el.$ref('input').elems[0] as HTMLInputElement
        picker.$el.$ref('pattern').elems[0].click()
        expect(input.value.trim()).toBe('#ff0000')
    })

    test('回调函数：change', () => {
        input.value = '#fff'
        expect(change.mock.calls.length).toBe(2)
    })

    test('回调函数：done', () => {
        picker.$el.find('[ref="done"]').elems[0].click()
        expect(done).toBeCalled()
    })

    test('回调函数：closed', () => {
        expect(closed).toBeCalled()
    })

    test('回调函数：cancel（列表）', () => {
        picker.show()
        picker.$el.$ref('cancel').elems[0].click()
        expect(cancel.mock.calls.length).toBe(1)
    })

    test('回调函数：cancel（调色板）', () => {
        picker.show()
        picker.$el.$ref('switchover').elems[0].click()
        picker.$el.$ref('cancel').elems[0].click()
        expect(cancel.mock.calls.length).toBe(2)
    })
})
