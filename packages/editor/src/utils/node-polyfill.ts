/**
 * @description node polyfill
 * @author wangfupeng
 */

// @ts-nocheck

if (typeof global === 'object') {
  // 用于 nodejs ，避免报错

  global.window = global
  global.requestAnimationFrame = () => {}
  global.navigator = {
    userAgent: '',
  }
}
