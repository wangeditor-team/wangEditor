/**
 * @description editor eventBus API test
 * @author wangfupeng
 */

import createCoreEditor from '../../create-core-editor' // packages/core 不依赖 packages/editor ，不能使用后者的 createEditor
import { withEmitter } from '../../../src/editor/plugins/with-emitter'

function createEditor(...args) {
  return withEmitter(createCoreEditor(...args))
}

describe('eventBus API', () => {
  it('bind and emit', () => {
    const editor = createEditor()

    const fn1 = jest.fn() // jest mock function
    const fn2 = jest.fn()
    const fn3 = jest.fn()

    editor.on('key1', fn1)
    editor.on('key1', fn2)
    editor.on('xxxx', fn3)

    editor.emit('key1', 10, 20)

    expect(fn1).toBeCalledWith(10, 20)
    expect(fn2).toBeCalledWith(10, 20)
    expect(fn3).not.toBeCalled()
  })

  it('off single event', () => {
    const editor = createEditor()

    const fn1 = jest.fn()
    const fn2 = jest.fn()

    editor.on('key1', fn1)
    editor.on('key1', fn2)

    editor.off('key1', fn1)

    editor.emit('key1', 10, 20)

    expect(fn1).not.toBeCalled()
    expect(fn2).toBeCalledWith(10, 20)
  })

  it('once', () => {
    const editor = createEditor()

    let n = 1

    const fn1 = jest.fn(() => n++)
    const fn2 = jest.fn(() => n++)

    editor.once('key1', fn1)
    editor.once('key1', fn2)

    // 无论 emit 多少次，只有一次生效
    editor.emit('key1')
    editor.emit('key1')
    editor.emit('key1')
    editor.emit('key1')
    editor.emit('key1')

    expect(n).toBe(3)
  })
})
