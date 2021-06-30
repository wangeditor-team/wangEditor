/**
 * @description image menu entry
 * @author wangfupeng
 */

import InsertImage from './InsertImage'
import DeleteImage from './DeleteImage'
import EditImage from './EditImage'
import ViewImageLink from './ViewImageLink'
import ImageWidth30 from './Width30'
import { genImageMenuConfig } from './config'

const config = genImageMenuConfig() // menu config

export const insertImageMenuConf = {
  key: 'insertImage',
  factory() {
    return new InsertImage()
  },

  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
  config,
}

export const deleteImageMenuConf = {
  key: 'deleteImage',
  factory() {
    return new DeleteImage()
  },
}

export const editImageMenuConf = {
  key: 'editImage',
  factory() {
    return new EditImage()
  },
  config,
}

export const viewImageLinkMenuConf = {
  key: 'viewImageLink',
  factory() {
    return new ViewImageLink()
  },
}

export const imageWidth30MenuConf = {
  key: 'imageWidth30',
  factory() {
    return new ImageWidth30()
  },
}
