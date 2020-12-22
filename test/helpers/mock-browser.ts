import { MOCK_FIEFOX_USER_AGENT } from './constants'

// 修改userAgent，模拟firefox
Object.defineProperty(navigator, 'userAgent', {
    value: MOCK_FIEFOX_USER_AGENT,
})
