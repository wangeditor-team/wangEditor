/**
 * @description image module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withImage from './plugin'
import { renderImageConf } from './render-elem'
import { imageToHtmlConf } from './elem-to-html'
import { parseHtmlConf } from './parse-elem-html'
import {
  insertImageMenuConf,
  deleteImageMenuConf,
  editImageMenuConf,
  viewImageLinkMenuConf,
  imageWidth30MenuConf,
  imageWidth50MenuConf,
  imageWidth100MenuConf,
  imageFloatNoneMenuConf,
  imageFloatLeftMenuConf,
  imageFloatRightMenuConf,
} from './menu'

const image: Partial<IModuleConf> = {
  renderElems: [renderImageConf],
  elemsToHtml: [imageToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [
    insertImageMenuConf,
    deleteImageMenuConf,
    editImageMenuConf,
    viewImageLinkMenuConf,
    imageWidth30MenuConf,
    imageWidth50MenuConf,
    imageWidth100MenuConf,
    imageFloatNoneMenuConf,
    imageFloatLeftMenuConf,
    imageFloatRightMenuConf,
  ],
  editorPlugin: withImage,
}

export default image
