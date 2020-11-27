/**
 * @description 自定义alert test
 * @author raosiling
 */

import events from '../../../src/config/events'

test('customAlert 事件', () => {
    window.alert = jest.fn()
    events.customAlert('customAlert', 'success')
    expect(window.alert).toHaveBeenCalledTimes(1)
})
