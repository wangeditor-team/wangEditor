/**
 * @description i18n entry
 * @author wangfupeng
 */

import i18next from 'i18next'

// i18n nameSpace
const NS = 'translation'

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
export function i18nAddResources(lng: string, resources: object) {
  i18next.addResourceBundle(lng, NS, resources, true, true)
}

/**
 * 设置语言
 * @param lng 语言
 */
export function i18nChangeLanguage(lng: string) {
  i18next.changeLanguage(lng)
}

/**
 * 获取多语言配置
 * @param lng lang
 */
export function i18nGetResources(lng: string) {
  return i18next.getResourceBundle(lng, NS)
}

/**
 * 翻译
 */
export const t = i18next.t.bind(i18next)

export default i18next
