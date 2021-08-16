/**
 * @description i18n entry
 * @author wangfupeng
 */

import i18next from 'i18next'

i18next.init({
  lng: 'zh-CN',
  // debug: true,
  resources: {}, // 资源为空，随后添加
})

/**
 * 添加多语言配置
 * @param lng 语言
 * @param resources 多语言配置
 */
// TODO 补充到文档
export function i18nAddResources(lng: string, resources: object) {
  i18next.addResourceBundle(lng, 'translation', resources, true, true)
}

/**
 * 设置语言
 * @param lng 语言
 */
export function i18nChangeLanguage(lng: string) {
  i18next.changeLanguage('en')
}

/**
 * 翻译
 */
export const t = i18next.t.bind(i18next)

export default i18next
