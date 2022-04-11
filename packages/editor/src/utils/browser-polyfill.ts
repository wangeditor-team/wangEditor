/**
 * @description browser polyfill
 * @author wangfupeng
 */

// @ts-nocheck

// 必须是浏览器环境
if (typeof global === 'undefined') {
  // 检查 IE 浏览器
  if ('ActiveXObject' in window) {
    let info = '抱歉，wangEditor V5+ 版本开始，不在支持 IE 浏览器'
    info += '\n Sorry, wangEditor V5+ versions do not support IE browser.'
    console.error(info)
  }

  globalThisPolyfill()
  AggregateErrorPolyfill()
} else if (global && global.navigator?.userAgent.match('QQBrowser')) {
  // 兼容 QQ 浏览器 AggregateError 报错
  globalThisPolyfill()
  AggregateErrorPolyfill()
}

function globalThisPolyfill() {
  // 部分浏览器不支持 globalThis
  if (typeof globalThis === 'undefined') {
    // @ts-ignore
    window.globalThis = window
  }
}

function AggregateErrorPolyfill() {
  if (typeof AggregateError === 'undefined') {
    window.AggregateError = function (errors, msg) {
      const err = new Error(msg)
      err.errors = errors
      return err
    }
  }
}
