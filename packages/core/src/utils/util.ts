/**
 * @description 工具函数
 * @author wangfupeng
 */

import forEach from 'lodash.foreach'
import { nanoid } from 'nanoid'

type PromiseCallback = (value: void) => void | PromiseLike<void>

/**
 * 获取随机数字符串
 * @param prefix 前缀
 * @returns 随机数字符串
 */
export function genRandomStr(prefix: string = 'r'): string {
  return `${prefix}-${nanoid()}`
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

/**
 * 替换 html 特殊字符，如 > 替换为 &gt;
 * @param str html str
 */
export function replaceHtmlSpecialSymbols(str: string) {
  return (
    str
      /**
       * 遇到两个空格时才替换，一个空格不替换
       * 两个英文单词之间有一个空格，就不用替换，否则无法默认换行 issue #4403
       */
      .replace(/ {2}/g, ' &nbsp;')

      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/®/g, '&reg;')
      .replace(/©/g, '&copy;')
      .replace(/™/g, '&trade;')
  )
}

/**
 *【反转】替换 html 特殊字符，如 &gt; 替换为 >
 * @param str html str
 */
export function deReplaceHtmlSpecialSymbols(str: string) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&reg;/g, '®')
    .replace(/&copy;/g, '©')
    .replace(/&trade;/g, '™')
    .replace(/&quot;/g, '"')
}
