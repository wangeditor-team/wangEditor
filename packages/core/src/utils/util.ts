/**
 * @description 工具函数
 * @author wangfupeng
 */

// /**
//  * 获取随机数字符串
//  * @param prefix 前缀
//  * @returns 随机数字符串
//  */
// export function genRandomStr(prefix: string = 'r'): string {
//     // 当前时间 + 随机数
//     const d = Date.now().toString().slice(-5)
//     const r = Math.random().toString(36).slice(-5)

//     return `${prefix}-${d}${r}`
// }

export function promiseResolveThen(fn: Function) {
  // @ts-ignore
  Promise.resolve().then(fn)
}
