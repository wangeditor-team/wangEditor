/**
 * @description node polyfill
 * @author wangfupeng
 */

// @ts-nocheck

// 必须是 node 环境
if (typeof global === 'object') {
  // 用于 nodejs ，避免报错
  const globalProperty = Object.getOwnPropertyDescriptor(global, 'window')

  // global.window 为空则直接写入
  // 部分框架下已经定义了global.window且是不可写属性
  if (!global.window || globalProperty.set) {
    global.window = global
    global.requestAnimationFrame = () => {}
    global.navigator = {
      userAgent: '',
    }
    global.location = {
      hostname: '0.0.0.0',
      port: 0,
      protocol: 'http:',
    }
    global.btoa = () => {}
    global.crypto = {
      getRandomValues: function (buffer: any) {
        return nodeCrypto.randomFillSync(buffer)
      },
    }
  }

  if (global.document != null) {
    // SSR 环境下可能会报错 （issue 4409）
    if (global.document.getElementsByTagName == null) {
      global.document.getElementsByTagName = () => []
    }
  }
}
