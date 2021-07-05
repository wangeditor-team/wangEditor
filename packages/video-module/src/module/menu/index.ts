/**
 * @description video menu
 * @author wangfupeng
 */

import InsertVideoMenu from './InsertVideoMenu'
import DeleteVideoMenu from './DeleteVideoMenu'
import { genMenuConfig } from './config'

export const insertVideoMenuConf = {
  key: 'insertVideo',
  factory() {
    return new InsertVideoMenu()
  },

  // 默认的菜单菜单配置，将存储在 editor.getConfig().MENU_CONF[key] 中
  // 可以通过 editor.getMenuConfig(key) 获取，通过 editor.setMenuConfig(key, {...}) 修改
  config: genMenuConfig(),
}

export const deleteVideoMenuConf = {
  key: 'deleteVideo',
  factory() {
    return new DeleteVideoMenu()
  },
}
