/**
 * @description slate 插件 - config 相关
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IDomEditor } from '../..'
import { EDITOR_TO_CONFIG } from '../../utils/weak-maps'
import { IEditorConfig, AlertType, ISingleMenuConfig } from '../../config/interface'
import { MENU_ITEM_FACTORIES } from '../../menus/register'

export const withConfig = <T extends Editor>(editor: T) => {
  const e = editor as T & IDomEditor

  e.getAllMenuKeys = (): string[] => {
    const arr: string[] = []
    for (let key in MENU_ITEM_FACTORIES) {
      arr.push(key)
    }
    return arr
  }

  // 获取 editor 配置信息
  e.getConfig = (): IEditorConfig => {
    const config = EDITOR_TO_CONFIG.get(e)
    if (config == null) throw new Error('Can not get editor config')
    return config
  }

  // 获取 menu config
  e.getMenuConfig = (menuKey: string): ISingleMenuConfig => {
    const { MENU_CONF = {} } = e.getConfig()
    return MENU_CONF[menuKey] || {}
  }

  // 修改配置
  e.setConfig = (newConfig: Partial<IEditorConfig>) => {
    const curConfig = e.getConfig()
    EDITOR_TO_CONFIG.set(e, {
      ...curConfig,
      ...newConfig,
    })

    // 修改配置，则立刻更新视图
    e.updateView()
  }

  // 设置 menu config
  e.setMenuConfig = (menuKey: string, newMenuConfig: ISingleMenuConfig) => {
    const curMenuConfig = e.getMenuConfig(menuKey)

    const editorConfig = e.getConfig()
    if (editorConfig.MENU_CONF == null) {
      editorConfig.MENU_CONF = {}
    }

    editorConfig.MENU_CONF[menuKey] = {
      ...curMenuConfig,
      ...newMenuConfig,
    }

    // 修改配置，则立刻更新视图
    e.updateView()
  }

  // alert
  e.alert = (info: string, type: AlertType = 'info') => {
    const { customAlert } = e.getConfig()
    if (customAlert) customAlert(info, type)
  }

  return e
}
