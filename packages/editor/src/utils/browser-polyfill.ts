/**
 * @description browser polyfill
 * @author wangfupeng
 */

// 必须是浏览器环境
if (typeof global === 'undefined') {
  // 部分浏览器不支持 globalThis
  if (typeof globalThis === 'undefined') {
    // @ts-ignore
    window.globalThis = window
  }

  console.log(111111, typeof AggregateError)
}
