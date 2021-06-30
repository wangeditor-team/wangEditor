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
  imageWidth30MenuConf,
} from './menu/index'

const image: IModuleConf = {
  renderElems: [renderImageConf],
  elemsToHtml: [imageToHtmlConf],
  menus: [
    insertImageMenuConf,
    deleteImageMenuConf,
    editImageMenuConf,
    viewImageLinkMenuConf,
    imageWidth30MenuConf,
  ],
  editorPlugin: withImage,
}

export default image
