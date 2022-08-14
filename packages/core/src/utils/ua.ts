/**
 * @description 通过 UA 判断浏览器
 * @author wangfupeng
 */

export const IS_IOS =
  typeof globalThis.navigator !== 'undefined' &&
  typeof globalThis.window !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !globalThis.window.MSStream

export const IS_APPLE = typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent)

export const IS_FIREFOX =
  typeof navigator !== 'undefined' && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent)

export const IS_FIREFOX_LEGACY =
  typeof navigator !== 'undefined' &&
  /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(navigator.userAgent)

export const IS_SAFARI =
  typeof navigator !== 'undefined' && /Version\/[\d\.]+.*Safari/.test(navigator.userAgent) // eslint-disable-line

// "modern" Edge was released at 79.x
export const IS_EDGE_LEGACY =
  typeof navigator !== 'undefined' &&
  /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent)

// Native beforeInput events don't work well with react on Chrome 75 and older, Chrome 76+ can use beforeInput
export const IS_CHROME_LEGACY =
  typeof navigator !== 'undefined' &&
  /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent)

export const IS_CHROME = typeof navigator !== 'undefined' && /Chrome/i.test(navigator.userAgent)

// qq browser
export const IS_QQBROWSER =
  typeof navigator !== 'undefined' && /.*QQBrowser/.test(navigator.userAgent)

// @ts-ignore 判断浏览器是否支持 beforeinput 事件 https://www.caniuse.com/?search=beforeinput
// COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
// Chrome Legacy doesn't support `beforeinput` correctly
export const HAS_BEFORE_INPUT_SUPPORT =
  !IS_CHROME_LEGACY &&
  !IS_EDGE_LEGACY &&
  // globalThis is undefined in older browsers
  typeof globalThis !== 'undefined' &&
  globalThis.InputEvent &&
  // @ts-ignore The `getTargetRanges` property isn't recognized.
  typeof globalThis.InputEvent.prototype.getTargetRanges === 'function'
