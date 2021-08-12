/**
 * @description util
 * @author wangfupeng
 */

import forEach from 'lodash.foreach'

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
