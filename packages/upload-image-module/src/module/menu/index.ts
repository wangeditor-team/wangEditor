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
  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
  config: genUploadImageConfig(),
}
