/**
 * @description browser polyfill
 * @author wangfupeng
 */

// 部分浏览器不支持 globalThis
if (typeof globalThis === 'undefined') {
  // @ts-ignore
  window.globalThis = window
}
