/**
 * @description menu entry
 * @author wangfupeng
 */

import TextStyleMenu from './TextStyleMenu'

/**
 * 生成 menu config
 * @param mark mark 如 'bold' 'italic' 等
 * @param title menu title
 * @param iconSvg menu icon svg
 * @returns menu config
 */
export function genMenuConf(mark: string, title: string, iconSvg: string) {
  return {
    key: mark,
    factory() {
      return new TextStyleMenu(mark, title, iconSvg)
    },
  }
}
