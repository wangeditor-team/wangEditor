/**
 * @description module menu helpers
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'

/**
 * 获取 menu config
 * @param editor editor
 * @param menuKey menuKey
 */
export function getMenuConf(editor: IDomEditor, menuKey: string): { [key: string]: any } {
  const { menuConf = {} } = editor.getConfig()
  const colorConf = menuConf[menuKey] || {}
  return colorConf || {}
}
