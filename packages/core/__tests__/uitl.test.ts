/**
 * @description util fns test
 * @author wangfupeng
 */

import { genRandomStr, addQueryToUrl } from '../src/utils/util'

describe('utils', () => {
  it('gen random', () => {
    const r1 = genRandomStr()
    const r2 = genRandomStr()
    expect(r1).not.toBe(r2)
  })

  it('add query to url', () => {
    const params = { a: 10, b: 'hello' }

    const url1 = 'https://wangeditor.com/'
    expect(addQueryToUrl(url1, params)).toBe('https://wangeditor.com/?a=10&b=hello')

    const url2 = 'https://wangeditor.com/?x=1'
    expect(addQueryToUrl(url2, params)).toBe('https://wangeditor.com/?x=1&a=10&b=hello')
  })
})
