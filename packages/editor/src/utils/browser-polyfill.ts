/**
 * @description browser polyfill
 * @author wangfupeng
 */

// @ts-nocheck

// 必须是浏览器环境
if (typeof global === 'undefined') {
  // 部分浏览器不支持 globalThis
  if (typeof globalThis === 'undefined') {
    // @ts-ignore
    window.globalThis = window
  }

  // AggregateError 会在 qq 浏览器报错
  if (typeof AggregateError === 'undefined') {
    window.AggregateError = function (errors, msg) {
      const err = new Error(msg)
      err.errors = errors
      return err
    }
  }
}
