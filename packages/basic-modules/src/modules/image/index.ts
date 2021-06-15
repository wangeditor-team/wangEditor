/**
 * @description image module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withImage from './plugin'
import { renderImageConf } from './render-elem'
import {
  insertImageMenuConf,
  deleteImageMenuConf,
  editImageMenuConf,
  viewImageLinkMenuConf,
} from './menu/index'

const image: IModuleConf = {
  renderElems: [renderImageConf],
  menus: [insertImageMenuConf, deleteImageMenuConf, editImageMenuConf, viewImageLinkMenuConf],
  editorPlugin: withImage,
}

export default image
