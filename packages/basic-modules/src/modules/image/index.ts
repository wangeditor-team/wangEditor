/**
 * @description image module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withImage from './plugin'
import { renderImageConf } from './render-elem'
import { imageToHtmlConf } from './elem-to-html'
import {
  insertImageMenuConf,
  deleteImageMenuConf,
  editImageMenuConf,
  viewImageLinkMenuConf,
} from './menu/index'

const image: IModuleConf = {
  renderElems: [renderImageConf],
  elemsToHtml: [imageToHtmlConf],
  menus: [insertImageMenuConf, deleteImageMenuConf, editImageMenuConf, viewImageLinkMenuConf],
  editorPlugin: withImage,
}

export default image
