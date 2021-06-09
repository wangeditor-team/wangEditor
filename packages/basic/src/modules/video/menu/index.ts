/**
 * @description video menu
 * @author wangfupeng
 */

import InsertVideoMenu from './InsertVideoMenu'
import DeleteVideoMenu from './DeleteVideoMenu'

export const insertVideoMenuConf = {
  key: 'insertVideo',
  factory() {
    return new InsertVideoMenu()
  },
}

export const deleteVideoMenuConf = {
  key: 'deleteVideo',
  factory() {
    return new DeleteVideoMenu()
  },
}
