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

  // 默认的菜单菜单配置，将存储在 editorConfig.MENU_CONF[key] 中
  // 创建编辑器时，可通过 editorConfig.MENU_CONF[key] = {...} 来修改
  config: genUploadImageConfig(),
}
