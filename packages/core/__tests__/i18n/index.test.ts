/**
 * @description i18n test
 * @author wangfupeng
 */

import i18next, { i18nAddResources, i18nChangeLanguage, t } from '../../src/i18n'

describe('i18n', () => {
  // 添加语言项
  i18nAddResources('en', {
    module1: {
      hello: 'hello',
    },
  })
  i18nAddResources('zh-CN', {
    module1: {
      hello: '你好',
    },
  })

  it('default lang', () => {
    expect(i18next.language).toBe('zh-CN')
    expect(t('module1.hello')).toBe('你好')
  })

  it('change lang', () => {
    i18nChangeLanguage('en')
    expect(i18next.language).toBe('en')
    expect(t('module1.hello')).toBe('hello')
  })
})
