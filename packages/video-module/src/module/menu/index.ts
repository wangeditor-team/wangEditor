/**
 * @description video menu
 * @author wangfupeng
 */

import InsertVideoMenu from './InsertVideoMenu'
// import DeleteVideoMenu from './DeleteVideoMenu'
import UploadVideoMenu from './UploadVideoMenu'
import EditorVideoSizeMenu from './EditVideoSizeMenu'
import { genInsertVideoMenuConfig, genUploadVideoMenuConfig } from './config'

export const insertVideoMenuConf = {
  key: 'insertVideo',
  factory() {
    return new InsertVideoMenu()
  },

  // 默认的菜单菜单配置，将存储在 editorConfig.MENU_CONF[key] 中
  // 创建编辑器时，可通过 editorConfig.MENU_CONF[key] = {...} 来修改
  config: genInsertVideoMenuConfig(),
}

export const uploadVideoMenuConf = {
  key: 'uploadVideo',
  factory() {
    return new UploadVideoMenu()
  },

  // 默认的菜单菜单配置，将存储在 editorConfig.MENU_CONF[key] 中
  // 创建编辑器时，可通过 editorConfig.MENU_CONF[key] = {...} 来修改
  config: genUploadVideoMenuConfig(),
}

export const editorVideSizeMenuConf = {
  key: 'editVideoSize',
  factory() {
    return new EditorVideoSizeMenu()
  },
}

// export const deleteVideoMenuConf = {
//   key: 'deleteVideo',
//   factory() {
//     return new DeleteVideoMenu()
//   },
// }
// 键盘能删除 video 了，注释掉这个菜单 wangfupeng 22.02.23
