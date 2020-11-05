import CustomEvent from '../../../src/utils/custom-event'

describe('CustomEvent utils', () => {

  const eventType = 'eventType'
  it('绑定事件，可以被触发', () => {
    const event = new CustomEvent()
    const fn1 = cy.stub()
    const fn2 = cy.stub()

    // 绑定事件
    event.on(eventType, fn1)
    event.on(eventType, fn2)

    // 触发事件
    event.emit(eventType)

    expect(fn1).to.be.called
    expect(fn2).to.be.called
  })

  it('绑定事件，解绑一个函数', () => {
    const event = new CustomEvent()
    const fn1 = cy.stub()
    const fn2 = cy.stub()

    // 绑定事件
    event.on(eventType, fn1)
    event.on(eventType, fn2)

    // 解绑
    event.off(eventType, fn1)

    // 触发事件
    event.emit(eventType)

    expect(fn1).not.to.be.called // 已解绑
    expect(fn2).to.be.called
  })

  it('绑定事件，解绑所有函数', () => {
    const event = new CustomEvent()
    const fn1 = cy.stub()
    const fn2 = cy.stub()

    // 绑定事件
    event.on(eventType, fn1)
    event.on(eventType, fn2)

    // 解绑
    event.off(eventType)

    // 触发事件
    event.emit(eventType)

    expect(fn1).not.to.be.called
    expect(fn2).not.to.be.called
  })
})