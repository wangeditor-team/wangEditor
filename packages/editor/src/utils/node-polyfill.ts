/**
 * @description node polyfill
 * @author wangfupeng
 */

// @ts-nocheck

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
  }
}
