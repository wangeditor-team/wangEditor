/**
 * @description image menu entry
 * @author wangfupeng
 */

import InsertImage from './InsertImage'
import DeleteImage from './DeleteImage'
import EditImage from './EditImage'
import ViewImageLink from './ViewImageLink'
import { genImageMenuConfig } from './config'

const config = genImageMenuConfig() // menu config

const insertImageMenuConf = {
  key: 'insertImage',
  factory() {
    return new InsertImage()
  },

  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
  config,
}

const deleteImageMenuConf = {
  key: 'deleteImage',
  factory() {
    return new DeleteImage()
  },
}

const editImageMenuConf = {
  key: 'editImage',
  factory() {
    return new EditImage()
  },
  config,
}

const viewImageLinkMenuConf = {
  key: 'viewImageLink',
  factory() {
    return new ViewImageLink()
  },
}

export { insertImageMenuConf, deleteImageMenuConf, editImageMenuConf, viewImageLinkMenuConf }
