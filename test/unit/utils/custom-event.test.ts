/**
 * @description custom event test
 * @author wangfupeng
 */

import CustomEvent from '../../../src/utils/custom-event'

const eventType = 'some-event-type'

test('绑定事件，可以被触发', () => {
    const event = new CustomEvent()
    const fn1 = jest.fn()
    const fn2 = jest.fn()

    // 绑定事件
    event.on(eventType, fn1)
    event.on(eventType, fn2)

    // 触发事件
    event.emit(eventType)

    expect(fn1).toBeCalled()
    expect(fn2).toBeCalled()
})

test('绑定事件，解绑一个函数', () => {
    const event = new CustomEvent()
    const fn1 = jest.fn()
    const fn2 = jest.fn()

    // 绑定事件
    event.on(eventType, fn1)
    event.on(eventType, fn2)

    // 解绑
    event.off(eventType, fn1)

    // 触发事件
    event.emit(eventType)

    expect(fn1).not.toBeCalled() // 已解绑
    expect(fn2).toBeCalled()
})

test('绑定事件，解绑所有函数', () => {
    const event = new CustomEvent()
    const fn1 = jest.fn()
    const fn2 = jest.fn()

    // 绑定事件
    event.on(eventType, fn1)
    event.on(eventType, fn2)

    // 解绑
    event.off(eventType)

    // 触发事件
    event.emit(eventType)

    expect(fn1).not.toBeCalled()
    expect(fn2).not.toBeCalled()
})
