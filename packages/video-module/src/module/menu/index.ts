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

  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
  config: genMenuConfig(),
}

export const deleteVideoMenuConf = {
  key: 'deleteVideo',
  factory() {
    return new DeleteVideoMenu()
  },
}
