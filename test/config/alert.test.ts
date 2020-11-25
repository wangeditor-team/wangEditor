/**
 * @description 自定义alert test
 * @author raosiling
 */

import events from '../../src/config/events'
import { statusType } from '../../src/utils/const'

test('customAlert 事件', () => {
    window.alert = jest.fn()
    events.customAlert('customAlert', statusType.success)
    expect(window.alert).toHaveBeenCalledTimes(1)
})
