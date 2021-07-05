/**
 * @description upload image menu
 * @author wangfupeng
 */

import UploadImageMenu from './UploadImageMenu'
import { genUploadImageConfig } from './config'

export const uploadImageMenuConf = {
  key: 'uploadImage',
  factory() {
    return new UploadImageMenu()
  },

  // 默认的菜单菜单配置，将存储在 editor.getConfig().MENU_CONF[key] 中
  // 可以通过 editor.getMenuConfig(key) 获取，通过 editor.setMenuConfig(key, {...}) 修改
  config: genUploadImageConfig(),
}
