/**
 * @description video menu test
 * @author luochao
 */

import { genRandomStr } from '../src/utils/util'

describe('videoModule util', () => {
  describe('utils util', () => {
    test('genRandomStr should generate a random string every time', () => {
      const str1 = genRandomStr()
      const str2 = genRandomStr()

      expect(str1).not.toBe(str2)
    })

    test('genRandomStr should generate a random string that specify a prefix string', () => {
      const str = genRandomStr('wangeditor')

      expect(str.indexOf('wangeditor-')).toEqual(0)
    })
  })
})
