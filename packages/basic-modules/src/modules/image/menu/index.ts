/**
 * @description image menu entry
 * @author wangfupeng
 */

import InsertImage from './InsertImage'
import DeleteImage from './DeleteImage'
import EditImage from './EditImage'
import ViewImageLink from './ViewImageLink'

const insertImageMenuConf = {
  key: 'insertImage',
  factory() {
    return new InsertImage()
  },
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
}

const viewImageLinkMenuConf = {
  key: 'viewImageLink',
  factory() {
    return new ViewImageLink()
  },
}

export { insertImageMenuConf, deleteImageMenuConf, editImageMenuConf, viewImageLinkMenuConf }
