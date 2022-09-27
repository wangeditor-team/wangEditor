/**
 * @description menu entry
 * @author wangfupeng
 */

import BulletedListMenu from './BulletedListMenu'
import NumberedListMenu from './NumberedListMenu'

export const bulletedListMenuConf = {
  key: 'bulletedList',
  factory() {
    return new BulletedListMenu()
  },
}

export const numberedListMenuConf = {
  key: 'numberedList',
  factory() {
    return new NumberedListMenu()
  },
}
