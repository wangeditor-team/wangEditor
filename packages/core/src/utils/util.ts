/**
 * @description 工具函数
 * @author wangfupeng
 */

import forEach from 'lodash.foreach'

type PromiseCallback = (value: void) => void | PromiseLike<void>

/**
 * 获取随机数字符串
 * @param prefix 前缀
 * @returns 随机数字符串
 */
export function genRandomStr(prefix: string = 'r'): string {
  // 当前时间 + 随机数
  const d = Date.now().toString().slice(-5)
  const r = Math.random().toString(36).slice(-5)

  return `${prefix}-${d}${r}`
}

export function promiseResolveThen(fn: Function) {
  Promise.resolve().then(fn as PromiseCallback)
}

/**
 * 追加 url query 参数
 * @param url url
 * @param data data
 */
export function addQueryToUrl(url: string, data: object): string {
  let [urlWithoutHash, hash] = url.split('#')

  // 拼接 query string
  const queryArr: string[] = []
  forEach(data, (val, key) => {
    queryArr.push(`${key}=${val}`)
  })
  const queryStr = queryArr.join('&')

  // 拼接到 url
  if (urlWithoutHash.indexOf('?') > 0) {
    // 已有 query
    urlWithoutHash = `${urlWithoutHash}&${queryStr}`
  } else {
    // 没有 query
    urlWithoutHash = `${urlWithoutHash}?${queryStr}`
  }

  // 返回拼接好的 url
  if (hash) {
    return `${urlWithoutHash}#${hash}`
  } else {
    return urlWithoutHash
  }
}
